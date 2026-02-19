"use client";

import Image from "next/image";
import { Shirt, ImageIcon, Settings } from "lucide-react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const menu = [
    { title: "Try On", icon: Shirt, href: "/dashboard/tryonme" },
    { title: "My Uploads", icon: ImageIcon, href: "/dashboard/uploads" },
    { title: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <aside className={`w-64 border-r border-white/10 p-6 flex flex-col h-screen ${styles.sidebar}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <Image src="/tryonme.png" width={40} height={40} alt="logo" className={styles.sidebar_logo} />
        <h1 className="font-bold text-lg">TryOnMe</h1>
      </div>

      {/* Menu */}
      <nav className="space-y-3">
        {menu.map((item, i) => {
          const Icon = item.icon;
          const href = item.href;
          return (
            <Link href={href}
              key={i}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl
            transition-all group ${styles.hovering}`}
            >
              <Icon size={20} />
              <span className={`${styles.transtion} group-hover:translate-x-1 transition-all`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* user */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <p className="text-sm text-gray-400">aloll0</p>
      </div>
    </aside>
  );
}
