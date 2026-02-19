"use client";

import TryOnPage from "../../components/ProductCard/ProductCard";
import Sidebar from "../../components/Sidebar";

export default function TryOnMe() {
  return (
    <div className="min-h-screen flex items-center bg-white w-full">
      <Sidebar />
      <TryOnPage />
    </div>
  );
}
