import { NextResponse } from "next/server";

const FITROOM_API_KEY = process.env.FITROOM_API_KEY;
const FITROOM_BASE = "https://platform.fitroom.app/api/tryon";

export async function POST(req) {
  try {
    const { userImage, clothImage } = await req.json();

    // Convert base64 to blob for FormData
    const base64ToBlob = (base64) => {
      const base64Data = base64.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'image/jpeg' });
    };

    // Create FormData for FitRoom API
    const formData = new FormData();
    formData.append('model_image', base64ToBlob(userImage), 'model.jpg');
    formData.append('cloth_image', base64ToBlob(clothImage), 'cloth.jpg');
    formData.append('cloth_type', 'upper'); // Change to 'lower' or 'full' as needed
    formData.append('hd_mode', 'true'); // Optional: for better quality

    // Step 1: Create try-on task
    const createRes = await fetch(`${FITROOM_BASE}/v2/tasks`, {
      method: "POST",
      headers: {
        "X-API-KEY": FITROOM_API_KEY,
      },
      body: formData,
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error("FitRoom Create Error:", errorText);
      throw new Error(`Failed to create task: ${createRes.status}`);
    }

    const { task_id } = await createRes.json();

    if (!task_id) {
      throw new Error("Task ID not returned");
    }

    // Step 2: Poll for results
    let status = "CREATED";
    let downloadUrl = null;
    const maxAttempts = 30; // 30 attempts × 2 seconds = 60 seconds max
    
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000)); // Wait 2 seconds between polls

      const pollRes = await fetch(`${FITROOM_BASE}/v2/tasks/${task_id}`, {
        headers: {
          "X-API-KEY": FITROOM_API_KEY,
        },
      });

      if (!pollRes.ok) {
        throw new Error(`Failed to check task status: ${pollRes.status}`);
      }

      const data = await pollRes.json();
      status = data.status;

      console.log(`Task ${task_id} status: ${status}, progress: ${data.progress}%`);

      if (status === "COMPLETED") {
        downloadUrl = data.download_signed_url;
        break;
      }

      if (status === "FAILED") {
        throw new Error(data.error || "FitRoom processing failed");
      }
    }

    if (!downloadUrl) {
      throw new Error("Timeout waiting for AI result");
    }

    return NextResponse.json({ result: downloadUrl });
  } catch (err) {
    console.error("TRYON ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}