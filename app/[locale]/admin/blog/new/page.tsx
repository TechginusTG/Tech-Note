"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import Editor from "@/components/editor/Editor";
import ClientOnly from "@/components/ClientOnly";
import { FiUpload } from "react-icons/fi";

export default function NewPostPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: FormData is used here to handle file uploads along with other data.
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("published", "true");
    tags.forEach(tag => formData.append("tags", tag));
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData, // No 'Content-Type' header, browser sets it for FormData
    });

    if (response.ok) {
      router.push("/blog");
    } else {
      console.error("Failed to create post");
      alert("Failed to create post. Check the console for more details.");
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("published", "false"); // Set published to false for drafts
    tags.forEach(tag => formData.append("tags", tag));
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Draft saved successfully!");
      // Optionally, redirect or show a success message
    } else {
      console.error("Failed to save draft");
      alert("Failed to save draft. Check the console for more details.");
    }
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ClientOnly>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <form onSubmit={handlePublish}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main content area */}
              <div className="flex-grow lg:w-3/4">
                <div className="mb-6">
                  <label htmlFor="title" className="sr-only">{t("title")}</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-gray-800 dark:text-gray-200 text-4xl font-extrabold focus:outline-none border-b-2 border-gray-200 dark:border-gray-700 pb-2"
                    placeholder={t("enter_post_title")}
                    required
                  />
                </div>
                <div>
                  <label className="sr-only">{t("content")}</label>
                  <Editor onContentChange={setContent} />
                </div>
              </div>

              {/* Sidebar for settings */}
              <aside className="lg:w-1/4 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{t("publish_actions")}</h2>
                  <div className="flex flex-col space-y-3">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                    >
                      {t("publish_post")}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="btn btn-secondary w-full"
                    >
                      {t("save_draft")}
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t("post_settings")}</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {t("category")}
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder={t("enter_post_category")}
                      />
                    </div>
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {t("tags")}
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                          <div key={tag} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">&times;</button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder={t("add_tag_and_press_enter")}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t("featured_image")}</h3>
                  <div className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md"/>
                      ) : (
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>{t("upload_a_file")}</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <p className="pl-1">{t("or_drag_and_drop")}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        </main>
      </div>
    </ClientOnly>
  );
}
