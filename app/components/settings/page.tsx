"use client";

import { useState } from "react";
import styles from "../settings/page.module.css";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "account", label: "Account" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Settings</h2>

        <div className={`${styles.tabs}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className={styles.content}>
        {activeTab === "profile" && (
          <>
          <div className="content_container mx-w-[300px]">

            <h3 className="text-center">Profile Settings</h3>
            <form action="">

            <div className={styles.formGroup}>
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" placeholder="email@example.com" />
            </div>
            </form>

            <button type="submit" className={styles.saveBtn}>Save Changes</button>
          </div>
          </>
        )}

        {activeTab === "account" && (
          <>
            <h3 className="text-center">Account Settings</h3>
            <div className="content_container mx-w-[300px]">
              <form action="">
                <div className={styles.formGroup}>
                  <label>Account Name</label>
                  <input type="text" placeholder="Account name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Account Email</label>
                  <input type="email" placeholder="Account email" />
                </div>
                <button type="submit" className={styles.saveBtn}>Save Changes</button>
              </form>
            </div>
          </>
        )}

        {activeTab === "security" && (
          <>
            <h3 className="text-center">Security Settings</h3>
            <div className="content_container mx-w-[300px]">
              <form action="">
                <div className={styles.formGroup}>
                  <label>Current Password</label>
                  <input type="password" placeholder="Current password" />
                </div>
                <div className={styles.formGroup}>
                  <label>New Password</label>
                  <input type="password" placeholder="New password" />
                </div>
                <div className={styles.formGroup}>
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
                <button type="submit" className={styles.saveBtn}>Save Changes</button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
