// "use client";

// import { useState, ChangeEvent } from "react";
// import { uploadSingleOrMultipleFilesBase64 } from "@/_lib/utils/helper/uploadFiles";
// import api from "@/_lib/api";
// import { useRouter } from "next/navigation";
// export default function NewBrandPage() {
//     const router=useRouter();
// const [logoUrl, setLogoUrl] = useState<string | null>(null);
//   const [brandName, setBrandName] = useState("");
//   const [website, setWebsite] = useState("");
//   const [description, setDescription] = useState("");

//   const [subcategories, setSubcategories] = useState<string[]>([]);
//   const [subcategoryInput, setSubcategoryInput] = useState("");

// const [categories, setCategories] = useState<
//   { name: string; subcategories: string[]; subInput: string }[]
// >([]);
// // Add new category card
// const handleAddCategory = () => {
//   setCategories([...categories, { name: "", subcategories: [], subInput: "" }]);
// };
//  const handleAddSubcategory = (index: number) => {
//   const updated = [...categories];
//   const input = updated[index].subInput.trim();
//   if (input && !updated[index].subcategories.includes(input)) {
//     updated[index].subcategories.push(input);
//     updated[index].subInput = "";
//     setCategories(updated);
//   }
// };

// // Update category name
// const handleCategoryChange = (index: number, value: string) => {
//   const updated = [...categories];
//   updated[index].name = value;
//   setCategories(updated);
// };
// const handleRemoveSubcategory = (catIndex: number, sub: string) => {
//   const updated = [...categories];
//   updated[catIndex].subcategories = updated[catIndex].subcategories.filter(
//     (s) => s !== sub
//   );
//   setCategories(updated);
// };



//    // Handle form submission
//   const handleAddBrand = async () => {
//     if (!brandName.trim()) {
//       alert("Brand name is required");
//       return;
//     }
//     if (!logoUrl) {
//       alert("Logo is required");
//       return;
//     }
//     if (categories.length === 0) {
//       alert("Add at least one category");
//       return;
//     }

//     const payload = {
//       name: brandName,
//       logo: logoUrl,
//       website,
//       description,
//       manage_categories: categories.map((cat) => ({
//         categories: cat.name,
//         subcategories: cat.subcategories,
//       })),
//     };
// console.log(payload,"payload")
//     try {
//       const response = await api.post("/brand", payload); // replace with your API endpoint
//       console.log("Brand added successfully:", response.data);
//       alert("Brand added successfully!");
//       // Reset form
//       setBrandName("");
//       setWebsite("");
//       setDescription("");
//       setLogoUrl(null);
//       setCategories([]);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add brand");
//     }
//   };

// console.log(logoUrl,"logoUrl")
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
//         <h2 className="text-2xl font-bold">Add New Brand</h2>

//         {/* Logo Upload */}
//         <div className="flex items-center gap-6">
//           <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
//             {logoUrl ? (
//               <img
//                 src={logoUrl}
//                 alt="Brand Logo"
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <span className="text-gray-500">Logo</span>
//             )}
//           </div>
//           <div>
//             <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
//               Upload Logo
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={async (e) => {
//     const uploadedUrl = await uploadSingleOrMultipleFilesBase64(e);
//     console.log(uploadedUrl,"uploadedUrl")
//       setLogoUrl(uploadedUrl as string)
//   }}
//               />
//             </label>
//           </div>
//         </div>

//         {/* Brand Details */}
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Brand Name"
//             className="w-full border rounded-lg px-4 py-2"
//             value={brandName}
//             onChange={(e) => setBrandName(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Brand Website"
//             className="w-full border rounded-lg px-4 py-2"
//             value={website}
//             onChange={(e) => setWebsite(e.target.value)}
//           />
//           <textarea
//             placeholder="Description"
//             className="w-full border rounded-lg px-4 py-2 resize-none"
//             rows={4}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         {/* Categories */}
//     <div className="space-y-4">
//   <button
//     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//     onClick={handleAddCategory}
//   >
//     Add Category
//   </button>

//   {categories.map((cat, index) => (
//     <div key={index} className="bg-white p-4 rounded-xl shadow space-y-2 border">
//       <input
//         type="text"
//         placeholder="Category"
//         className="w-full border rounded-lg px-4 py-2"
//         value={cat.name}
//         onChange={(e) => handleCategoryChange(index, e.target.value)}
//       />

//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Add Subcategory"
//           className="flex-1 border rounded-lg px-4 py-2"
//           value={cat.subInput}
//           onChange={(e) => {
//             const updated = [...categories];
//             updated[index].subInput = e.target.value;
//             setCategories(updated);
//           }}
//           onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory(index)}
//         />
//         <button
//           className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//           onClick={() => handleAddSubcategory(index)}
//         >
//           Add
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-2">
//         {cat.subcategories.map((sub) => (
//           <div key={sub} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
//             <span>{sub}</span>
//             <button
//               className="text-red-500 hover:text-red-700"
//               onClick={() => handleRemoveSubcategory(index, sub)}
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//          <div className="flex justify-end gap-4 mt-6">
//           <button
//             type="button"
//             className="px-6 py-2 rounded-lg border hover:bg-gray-100"
//             onClick={() => router.push("/brand-management")} // Redirect on cancel
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
//             onClick={handleAddBrand}
//           >
//             Add Brand
//           </button>
//         </div>
//     </div>
//   ))}
// </div>

//       </div>
//     </div>
//   );
// }


"use client";

import BrandForm from "@/components/Brand/BrandForm";
import api from "@/_lib/api";
import { useRouter } from "next/navigation";

export default function NewBrandPage() {
  const router = useRouter();

  // ⬅️ Called when BrandForm submits payload
  const handleAddBrand = async (payload: any) => {
    try {
      const res = await api.post("/brand", payload);

      alert("Brand created successfully!");

      router.push("/brandManagement");
    } catch (error) {
      console.error("Failed to create brand:", error);
      alert("Failed to create brand");
    }
  };

  return (
    <BrandForm
      initialData={null}
      isEdit={false}
      onSubmit={handleAddBrand}
    />
  );
}
