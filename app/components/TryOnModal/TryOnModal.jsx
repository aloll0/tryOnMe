"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import modalStyles from "../TryOnModal/TryOnModal.module.css";

export default function TryOnModal({ open, setOpen }) {
  const userInput = useRef(null);
  const clothInput = useRef(null);

  const [userImage, setUserImage] = useState(null);
  const [clothImage, setClothImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setUserImage(null);
        setClothImage(null);
        setResult(null);
        setError(null);
        setProgress(0);
        setCurrentStep(0);
      }, 300);
    }
  }, [open]);


  const readFile = (file, cb) => {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const simulateProgress = () => {
    const steps = [10, 30, 60, 80, 90, 100];
    let current = 0;

    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current]);
        setCurrentStep(Math.floor(current / 2));
        current++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return interval;
  };

  const generateTryOn = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const progressInterval = simulateProgress();

    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage,
          clothImage,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "فشل في معالجة الصورة");
      }

      setResult(data.result);
      setProgress(100);
      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
      console.error("Try-on error:", err);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result;
    link.download = `virtual-tryon-${Date.now()}.png`;
    link.click();
  };

  const retry = () => {
    setError(null);
    setProgress(0);
    setCurrentStep(0);
  };

  if (!open) return null;

  const steps = [
    "جاري رفع الصورة",
    "معالجة بالذكاء الاصطناعي",
    "تطبيق النتيجة",
  ];

  return (
    <>
      <div
        className={`${modalStyles.modalOverlay} ${open ? modalStyles.active : ""}`}
      >
        <div className={modalStyles.modalContainer}>
          <button
            onClick={() => setOpen(false)}
            className={modalStyles.modalCloseBtn}
            aria-label="إغلاق"
          >
            ×
          </button>

          <div className={modalStyles.modalHeader}>
            <h2 className={modalStyles.modalTitle}>استوديو القياس الافتراضي</h2>
            <p className={modalStyles.modalSubtitle}>
              جرب المنتج عليك بتقنية الذكاء الاصطناعي
            </p>
          </div>

          <div className={modalStyles.uploadSection}>
            <div className={modalStyles.uploadOptions}>
              <div
                className={modalStyles.uploadZone}
                onClick={() => userInput.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("dragging");
                }}
                onDragLeave={(e) =>
                  e.currentTarget.classList.remove("dragging")
                }
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("dragging");
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("image/")) {
                    readFile(file, setUserImage);
                  }
                }}
              >
                <div className={modalStyles.uploadIcon}>📷</div>
                <div className={modalStyles.uploadText}>
                  {userImage ? "✓ صورتك جاهزة" : "ارفع صورتك"}
                </div>
                <div className={modalStyles.uploadHint}>
                  PNG, JPG (حجم أقصى 10MB)
                </div>
                <input
                  ref={userInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      readFile(e.target.files[0], setUserImage);
                    }
                  }}
                />
              </div>

              <div
                className={modalStyles.uploadZone}
                onClick={() => clothInput.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("dragging");
                }}
                onDragLeave={(e) =>
                  e.currentTarget.classList.remove("dragging")
                }
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("dragging");
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("image/")) {
                    readFile(file, setClothImage);
                  }
                }}
              >
                <div className={modalStyles.uploadIcon}>👕</div>
                <div className={modalStyles.uploadText}>
                  {clothImage ? "✓ المنتج جاهز" : "صورة المنتج"}
                </div>
                <div className={modalStyles.uploadHint}>صوره واضحة للمنتج</div>
                <input
                  ref={clothInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      readFile(e.target.files[0], setClothImage);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className={`${modalStyles.previewSection} ${userImage || clothImage || result ? modalStyles.active : ""}`}
          >
              <div className={modalStyles.previewContainer}>
              <div className={modalStyles.previewLabel}>صورتك</div>
              {userImage ? (
                <Image
                  src={userImage}
                  alt="Before"
                  className={modalStyles.previewImg}
                  width={400}
                  height={533}
                  unoptimized
                />
              ) : (
                <div className={modalStyles.placeholder}>لم تُرفع صورة بعد</div>
              )}
            </div>

            <div className={modalStyles.previewContainer}>
              <div className={modalStyles.previewLabel}>النتيجة</div>
              {result ? (
                <Image
                  src={result}
                  alt="After"
                  className={modalStyles.previewImg}
                  width={400}
                  height={533}
                  unoptimized
                />
              ) : clothImage ? (
                <Image
                  src={clothImage}
                  alt="Product image"
                  className={modalStyles.previewImg}
                  width={400}
                  height={533}
                  unoptimized
                />
              ) : (
                <div className={modalStyles.placeholder}>
                  لم تُرفع صورة المنتج بعد
                </div>
              )}
            </div>
          </div>

          <div className={modalStyles.actions}>
            {userImage && clothImage && !result && !loading && (
              <button
                onClick={generateTryOn}
                className={modalStyles.actionBtn + " primary"}
              >
                <span>✨ معالجة الصورة</span>
              </button>
            )}

            {result && !loading && (
              <button
                onClick={downloadResult}
                className={modalStyles.actionBtn + " secondary"}
              >
                <span>📥 تحميل النتيجة</span>
              </button>
            )}

            {loading && (
              <button disabled className={modalStyles.actionBtn + " primary"}>
                <span>🔄 جاري المعالجة... ({progress}%)</span>
              </button>
            )}
          </div>

          {error && !loading && (
            <div className={modalStyles.notification + " error"}>{error}</div>
          )}
          {!userImage && !clothImage && (
            <div className={modalStyles.notification}>
              💡 ارفع صورتك وصورة المنتج لتبدأ التجربة الافتراضية
            </div>
          )}
        </div>
      </div>
    </>
  );
}
