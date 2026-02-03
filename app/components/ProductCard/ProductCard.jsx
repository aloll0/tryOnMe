"use client";

import { useState } from "react";
import TryOnModal from "../TryOnModal/TryOnModal";
import styles from "./ProductCard.module.css";
import Image from "next/image";

export default function ProductCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          <Image
            src="/placeholder.png"
            alt="Oversized Hoodie"
            fill
            className={styles.image}
          />

          <button onClick={() => setOpen(true)} className={styles.tryOnOverlay}>
            Try On
          </button>
        </div>

        <div className={styles.info}>
          <h3>Oversized Hoodie</h3>
          <span>799 EGP</span>
        </div>
      </div>

      <TryOnModal open={open} setOpen={setOpen} />
    </>
  );
}
