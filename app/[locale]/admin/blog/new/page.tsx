"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import Editor from "@/components/editor/Editor";
import styles from "./page.module.css";
import ClientOnly from "@/components/ClientOnly";

export default function NewPostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, category, published: true }),
    });

    if (response.ok) {
      router.push("/blog");
    } else {
      // Handle error
      console.error("Failed to create post");
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save draft");
    // ... (draft saving logic)
  };

  return (
    <ClientOnly>
      <main className={styles.main}>
        <h1 className={styles.title}>{t("create_new_post")}</h1>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              {t("title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder={t("enter_post_title")}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              {t("category")}
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.input}
              placeholder={t("enter_post_category")}
            />
          </div>
          <div className={styles.formGroupLarge}>
            <label className={styles.label}>{t("content")}</label>
            <Editor onContentChange={setContent} />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.button}
              onClick={handleSaveDraft}
            >
              {t("save_draft")}
            </button>
            <button
              type="submit"
              className={styles.button}
              onClick={handlePublish}
            >
              {t("publish_post")}
            </button>
          </div>
        </form>
      </main>
    </ClientOnly>
  );
}
