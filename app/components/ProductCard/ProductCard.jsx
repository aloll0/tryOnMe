"use client";

import { useState } from "react";
import { SquareDashedMousePointer } from "lucide-react";
import TryOnModal from "../TryOnModal/TryOnModal";
import styles from "./ProductCard.module.css";

export default function ProductCard() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`p-10 w-full max-w-7xl mx-auto space-y-10 ${styles.container}`}
    >
      {/* Header */}
      <div className={styles.header_fixed}>
        <div className="flex flex-col justify-between bg-black/50 p-4">
          <h1 className="text-3xl font-semibold tracking-tight">TRY ON ME</h1>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`complate flex justify-center items-center ${styles.upload_area}`}
      >
        <div
          onClick={() => setOpen(true)}
          className={styles.upload_area_label}
        >
          <SquareDashedMousePointer
            size={40}
            className="mb-3 opacity-70 group-hover:scale-110 transition"
          />

          <p className="text-gray-300 font-medium">Click here to Try On</p>
        </div>

        {/* المودال */}
        <TryOnModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
