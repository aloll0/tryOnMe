"use client";

import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, Download } from "lucide-react";
import styles from "./page.module.css";

export default function Uploads() {
  
  const [images, setImages] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("uploads");
    if (saved) {
      setImages(JSON.parse(saved));
    }
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Images = await Promise.all(
      Array.from(files).map((file) => fileToBase64(file)),
    );

    setImages((prev) => {
      const updated = [...prev, ...base64Images];
      localStorage.setItem("uploads", JSON.stringify(updated));
      return updated;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("uploads", JSON.stringify(updated));
      return updated;
    });
  };

  const downloadImage = (index: number) => {
    const imageUrl = images[index];
    if (!imageUrl) return;

    setDownloading(index);

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(null);
    }, 500);
  };

  return (
    <div
      className={`p-10 w-full max-w-7xl mx-auto space-y-10 ${styles.container}`}
    >
      {/* Header */}
      <div className={`${styles.header_fixed}`}>
        <div className="flex flex-col justify-between bg-black/50 p-4">
          <h1 className="text-3xl font-semibold tracking-tight">My Uploads</h1>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`complate flex justify-center items-center ${styles.upload_area}`}
      >
        <label
          className="group relative flex flex-col items-center justify-center
        border border-dashed border-white/20
        rounded-3xl h-56 cursor-pointer
        bg-white/2
        hover:bg-white/5
        hover:border-white/40
        transition-all duration-300"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />

          <UploadCloud
            size={40}
            className="mb-3 opacity-70 group-hover:scale-110 transition"
          />

          <p className="text-gray-300 font-medium cursor-pointer">
            Click to upload or drag & drop
          </p>
          <span className="text-sm text-gray-500">PNG, JPG up to 10MB</span>
        </label>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className={`${styles.griding}`}>
            {images.map((src, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl overflow-hidden
              bg-white/1 border border-white/10
              hover:border-white/30 transition ${styles.grid_item}`}
              >
                <Image
                  src={src}
                  alt="upload"
                  width={200}
                  height={200}
                  className="object-cover relative  group-hover:scale-105 transition duration-300"
                />

                {/* Overlay */}
                <div className={styles.delete_button}>
                  <button
                    onClick={() => removeImage(index)}
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer
                  rounded-xl text-sm font-medium transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      downloading === index ? null : downloadImage(index)
                    }
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer
                  rounded-xl text-sm font-medium transition"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
