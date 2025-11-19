"use client";

import { useState, useEffect } from "react";
import { uploadSingleOrMultipleFilesBase64 } from "@/_lib/utils/helper/uploadFiles";
import { Brand } from "@/_lib/types";
import { useRouter } from "next/navigation";

interface BrandFormProps {
  initialData?: Brand | null;
  onSubmit: (payload: any) => Promise<void>;
  isEdit?: boolean;
}

export default function BrandForm({ initialData, onSubmit, isEdit }: BrandFormProps) {
  const router = useRouter();
const [isUploading, setIsUploading] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState<
    { name: string; subcategories: string[]; subInput: string }[]
  >([]);

  // Load existing brand in Edit mode
  useEffect(() => {
    if (initialData) {
      setBrandName(initialData.name);
      setWebsite(initialData.website);
      setDescription(initialData.description);
      setLogoUrl(initialData.logo);

      setCategories(
        initialData.manage_categories?.map((cat) => ({
          name: cat.categories,
          subcategories: cat.subcategories,
          subInput: "",
        })) || []
      );
    }
  }, [initialData]);

  // Add new category block
  const handleAddCategory = () => {
    setCategories([...categories, { name: "", subcategories: [], subInput: "" }]);
  };

  // Add subcategory
  const handleAddSubcategory = (index: number) => {
    const updated = [...categories];
    const input = updated[index].subInput.trim();

    if (input && !updated[index].subcategories.includes(input)) {
      updated[index].subcategories.push(input);
      updated[index].subInput = "";
      setCategories(updated);
    }
  };

  // Remove subcategory
  const handleRemoveSubcategory = (catIndex: number, sub: string) => {
    const updated = [...categories];
    updated[catIndex].subcategories = updated[catIndex].subcategories.filter(
      (s) => s !== sub
    );
    setCategories(updated);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!brandName.trim()) return alert("Brand name is required");
    if (!logoUrl) return alert("Logo is required");
    if (categories.length === 0) return alert("Add at least one category");

    const payload = {
      name: brandName,
      logo: logoUrl,
      website,
      description,
      manage_categories: categories.map((cat) => ({
        categories: cat.name,
        subcategories: cat.subcategories,
      })),
    };

    await onSubmit(payload);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">

        <h2 className="text-2xl font-bold">
          {isEdit ? "Update Brand" : "Add New Brand"}
        </h2>

        {/* Logo Upload */}
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Brand Logo" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500">Logo</span>
            )}
          </div>

          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
             onChange={async (e) => {
  try {
    setIsUploading(true);

    const uploadedUrl = await uploadSingleOrMultipleFilesBase64(e);

    setLogoUrl(uploadedUrl as string);
  } finally {
    setIsUploading(false);
  }
}}

            />
          </label>
        </div>

        {/* Brand Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Brand Name"
            className="w-full border rounded-lg px-4 py-2"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Brand Website"
            className="w-full border rounded-lg px-4 py-2"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border rounded-lg px-4 py-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleAddCategory}
          >
            Add Category
          </button>

          {categories.map((cat, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 shadow">
              <input
                type="text"
                placeholder="Category"
                className="w-full border rounded-lg px-4 py-2"
                value={cat.name}
                onChange={(e) => {
                  const updated = [...categories];
                  updated[index].name = e.target.value;
                  setCategories(updated);
                }}
              />

              {/* Add Subcategory */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add Subcategory"
                  className="flex-1 border rounded-lg px-4 py-2"
                  value={cat.subInput}
                  onChange={(e) => {
                    const updated = [...categories];
                    updated[index].subInput = e.target.value;
                    setCategories(updated);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory(index)}
                />

                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  onClick={() => handleAddSubcategory(index)}
                >
                  Add
                </button>
              </div>

              {/* Subcategories List */}
              <div className="flex flex-wrap gap-2">
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub}
                    className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{sub}</span>
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveSubcategory(index, sub)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 rounded-lg border"
            onClick={() => router.push("/brandManagement")}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-blue-500 text-white"
            onClick={handleSubmit}
          >
            {isEdit ? "Update Brand" : "Add Brand"}
          </button>
        </div>

      </div>
    </div>
  );
}
