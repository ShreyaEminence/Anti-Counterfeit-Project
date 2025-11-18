"use client";

import { useState, useEffect } from "react";
import api from "@/_lib/api";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FiUploadCloud, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiPlusCircle } from "react-icons/bi";

export default function AddProduct({ onClose }: { onClose: () => void }) {
  // ----------------------------------------------------------------------
  // FORM STATES
  // ----------------------------------------------------------------------
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [template, setTemplate] = useState("");

  const [noOfQR, setNoOfQR] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  // ----------------------------------------------------------------------
  // MEDIA STATES
  // ----------------------------------------------------------------------
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const maxImages = 8;
  const minImages = 5;

  // ----------------------------------------------------------------------
  // LIFECYCLE STATES
  // ----------------------------------------------------------------------
  const [lifecycleEnabled, setLifecycleEnabled] = useState(true);
  const [lifecycleType, setLifecycleType] = useState("warranty");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [warrantyUnit, setWarrantyUnit] = useState("months");

  // ----------------------------------------------------------------------
  // VIDEO STATES
  // ----------------------------------------------------------------------
  const [videosEnabled, setVideosEnabled] = useState(true);
  const [videoLinks, setVideoLinks] = useState<string[]>([""]);

  // ----------------------------------------------------------------------
  // FETCH BRAND & CATEGORY DATA
  // ----------------------------------------------------------------------
  const businessOwnerId =
    typeof window !== "undefined" && localStorage.getItem("businessOwner")
      ? JSON.parse(localStorage.getItem("businessOwner")!)._id
      : "";

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await api.get(`/brand/business-owner/${businessOwnerId}`);
        setBrands(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch brands", error);
      }
    }
    if (businessOwnerId) loadBrands();
  }, [businessOwnerId]);

  // ----------------------------------------------------------------------
  // IMAGE UPLOAD LOGIC
  // ----------------------------------------------------------------------
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []) as File[];

    if (images.length + files.length > maxImages) return;

    setImages((prev) => [...prev, ...files]);
    setImageUrls((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  }

  // ----------------------------------------------------------------------
  // BRAND SELECT
  // ----------------------------------------------------------------------
  function handleBrandSelect(brandId: string) {
    setBrand(brandId);
    setCategory("");
    setSubCategory("");

    const brandObj = brands.find((b) => b._id === brandId);

    if (brandObj?.manage_categories?.length > 0) {
      setCategories(brandObj.manage_categories); // objects
    } else {
      setCategories([]);
    }

    setSubCategories([]);
  }

  // ----------------------------------------------------------------------
  // CATEGORY SELECT
  // ----------------------------------------------------------------------
  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);
    setSubCategory("");

    const catObj = categories.find(
      (c: any) => c.categories === selectedCategory
    );

    if (catObj) {
      setSubCategories(catObj.subcategories || []);
    } else {
      setSubCategories([]);
    }
  }

  // ----------------------------------------------------------------------
  // SUBMIT FORM
  // ----------------------------------------------------------------------
  async function handleSubmit() {
    const form = new FormData();
    form.append("title", title);
    form.append("brandId", brand);
    form.append("skuId", sku);
    form.append("category", category);
    form.append("subCategory", subCategory);
    form.append("template", template);
    form.append("noOfQR", noOfQR);
    form.append("tags", JSON.stringify(tags));
    form.append("description", description);
    form.append("lifecycleEnabled", String(lifecycleEnabled));
    form.append("lifecycleType", lifecycleType);
    form.append("warrantyPeriod", warrantyPeriod);
    form.append("warrantyUnit", warrantyUnit);
    form.append("videosEnabled", String(videosEnabled));
    form.append("videoLinks", JSON.stringify(videoLinks));
    form.append("businessOwnerId", businessOwnerId);

    images.forEach((img) => form.append("images", img));

    try {
      await api.post("/product", form);
      alert("Product Created Successfully!");
      onClose();
    } catch (err) {
      console.error("Error creating product", err);
    }
  }

  // ----------------------------------------------------------------------
  // UI STARTS
  // ----------------------------------------------------------------------
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <button
          onClick={() => onClose()}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <FiArrowLeft size={22} />
          <span className="text-xl font-bold">Add New Product</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* LEFT FORM */}
        <div className="col-span-2 space-y-8">
          {/* ---------------- BASIC INFO ---------------- */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-semibold mb-4">Basic Information</h3>

            {/* Brand + SKU */}
            <div className="grid grid-cols-3 gap-4">
              {/* Brand */}
              <div>
                <label className="text-sm text-gray-600">Brand *</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={brand}
                  onChange={(e) => handleBrandSelect(e.target.value)}
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="text-sm text-gray-600">SKU *</label>
                <input
                  className="w-full p-3 border rounded-lg"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="eg. QR-2024-BLK"
                />
              </div>
            </div>

            {/* Product Name */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">Product Name *</label>
              <input
                className="w-full p-3 border rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Product Name"
              />
            </div>

            {/* Category Row */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Category */}
              <div>
                <label className="text-sm text-gray-600">Category *</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={category}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  disabled={!brand}
                >
                  <option value="">Select Category</option>
                  {categories.map((c: any) => (
                    <option key={c._id} value={c.categories}>
                      {c.categories}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="text-sm text-gray-600">Sub-Category *</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                >
                  <option value="">Select Sub-category</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template */}
              <div>
                <label className="text-sm text-gray-600">Template *</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  <option value="">Select Template</option>
                  <option value="default">Default Template</option>
                </select>
              </div>
            </div>

            {/* No of QR */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">No. of QRs *</label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg"
                value={noOfQR}
                onChange={(e) => setNoOfQR(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">Tags</label>
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Tag + Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val !== "") {
                      setTags([...tags, val]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">Description *</label>
              <textarea
                className="w-full p-3 border rounded-lg min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-right text-gray-400">
                {description.length}/160
              </p>
            </div>
          </div>

          {/* ---------------- MEDIA ---------------- */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Media</h3>
              <span className="text-sm text-gray-500">
                {images.length}/{maxImages}
              </span>
            </div>

            <label className="mt-4 flex items-center gap-2 px-4 py-3 border bg-purple-50 text-purple-600 rounded-lg cursor-pointer w-fit">
              <FiUploadCloud />
              Upload Images
              <input
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={handleImageUpload}
              />
            </label>

            <div className="grid grid-cols-4 gap-3 mt-4">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    className="w-full h-28 object-cover rounded-lg border"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => {
                      setImages((prev) => prev.filter((_, idx) => idx !== i));
                      setImageUrls((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      );
                    }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- PRODUCT LIFECYCLE ---------------- */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Product Lifecycle</h3>
              <Switch
                checked={lifecycleEnabled}
                onCheckedChange={setLifecycleEnabled}
              />
            </div>

            {lifecycleEnabled && (
              <div className="mt-4">
                <label className="text-sm text-gray-600">Lifecycle Type</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={lifecycleType}
                  onChange={(e) => setLifecycleType(e.target.value)}
                >
                  <option value="warranty">Warranty</option>
                  <option value="lifetime">Lifetime</option>
                  <option value="ownership">Ownership</option>
                </select>

                {lifecycleType === "warranty" && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      className="p-3 border rounded-lg"
                      placeholder="Enter value"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
                    />

                    <div className="flex gap-2 items-center">
                      <Button
                        variant={
                          warrantyUnit === "months" ? "default" : "outline"
                        }
                        onClick={() => setWarrantyUnit("months")}
                      >
                        Months
                      </Button>
                      <Button
                        variant={
                          warrantyUnit === "years" ? "default" : "outline"
                        }
                        onClick={() => setWarrantyUnit("years")}
                      >
                        Years
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------- VIDEOS SECTION ---------------- */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Videos</h3>
              <Switch
                checked={videosEnabled}
                onCheckedChange={setVideosEnabled}
              />
            </div>

            {videosEnabled &&
              videoLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-3 mt-4">
                  <input
                    type="text"
                    placeholder="https://youtube.com/..."
                    value={link}
                    onChange={(e) => {
                      const updated = [...videoLinks];
                      updated[idx] = e.target.value;
                      setVideoLinks(updated);
                    }}
                    className="flex-1 p-3 border rounded-lg"
                  />

                  <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <AiOutlineCheckCircle size={16} />
                  </button>

                  <button
                    className="p-2 bg-red-100 text-red-600 rounded-lg"
                    onClick={() =>
                      setVideoLinks((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}

            {videosEnabled && (
              <button
                onClick={() => setVideoLinks([...videoLinks, ""])}
                className="mt-4 w-full bg-purple-50 text-purple-600 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <BiPlusCircle /> Add another URL
              </button>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            className="w-full bg-purple-600 text-white py-3 rounded-lg"
            onClick={handleSubmit}
          >
            Save Product
          </Button>
        </div>

        {/* ---------------- RIGHT SIDE PREVIEW ---------------- */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <img
            src="https://dummyimage.com/300x600/ccc/fff&text=Mobile+Preview"
            className="rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
