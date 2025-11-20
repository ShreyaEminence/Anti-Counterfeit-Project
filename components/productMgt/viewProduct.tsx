// "use client";
// // pending as of noww.....
// import { FiArrowLeft } from "react-icons/fi";

// export default function ViewProduct({
// //   productId,
//   onClose,
// }: {
// //   productId: string;
//   onClose: () => void;
// }) {
//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <div className="mb-6">
//         <button
//           onClick={onClose}
//           className="flex items-center gap-2 text-gray-700 hover:text-black"
//         >
//           <FiArrowLeft size={22} />
//           <span className="text-xl font-bold">Product Details</span>
//         </button>
//       </div>

//       <div className="grid grid-cols-3 gap-8">
//         {/* LEFT VIEW */}
//         <div className="col-span-2 space-y-8">
//           {/* BASIC INFORMATION */}
//           <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
//             <h3 className="font-semibold">Basic Information</h3>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Brand</p>
//                 <div className="p-3 border rounded-lg bg-gray-50">
//                   {product.brand?.name}
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500">SKU</p>
//                 <div className="p-3 border rounded-lg bg-gray-50">
//                   {product.skuId}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">Product Name</p>
//               <div className="p-3 border rounded-lg bg-gray-50">
//                 {product.title}
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Category</p>
//                 <div className="p-3 border rounded-lg bg-gray-50">
//                   {product.category}
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500">Sub Category</p>
//                 <div className="p-3 border rounded-lg bg-gray-50">
//                   {product.subCategory}
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500">Template</p>
//                 <div className="p-3 border rounded-lg bg-gray-50">
//                   {product.template}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">No. of QR Codes</p>
//               <div className="p-3 border rounded-lg bg-gray-50">
//                 {product.qrGenerateType === "pre" ? 1 : product.noOfQR}
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">Tags</p>
//               <div className="flex gap-2 flex-wrap">
//                 {product.tags?.map((t: string) => (
//                   <span
//                     key={t}
//                     className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full"
//                   >
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">EAN Number</p>
//               <div className="p-3 border rounded-lg bg-gray-50">
//                 {product.eanNumber}
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">Description</p>
//               <div className="p-3 border rounded-lg bg-gray-50 whitespace-pre-wrap">
//                 {product.summary}
//               </div>
//             </div>
//           </div>

//           {/* MEDIA */}
//           <div className="bg-white p-6 rounded-xl border shadow-sm">
//             <h3 className="font-semibold">Media</h3>

//             <div className="grid grid-cols-4 gap-3 mt-4">
//               {product.sliderImages?.map((url: string, i: number) => (
//                 <img
//                   key={i}
//                   src={url}
//                   className="w-full h-28 object-cover rounded-lg border"
//                 />
//               ))}
//             </div>
//           </div>

//           {/* PRODUCT LIFECYCLE */}
//           <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
//             <h3 className="font-semibold">Product Lifecycle</h3>

//             <p className="text-sm text-gray-500">Lifecycle Enabled</p>
//             <div className="p-3 border rounded-lg bg-gray-50">
//               {product.warrantyEnable ? "Enabled" : "Disabled"}
//             </div>

//             {product.warrantyEnable && (
//               <>
//                 <p className="text-sm text-gray-500">Warranty Duration</p>
//                 <div className="p-3 border rounded-lg bg-gray-50">
//                   {product.warrantyDuration} {product.warrantyDurationUnit}
//                 </div>
//               </>
//             )}
//           </div>

//           {/* VIDEOS */}
//           <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
//             <h3 className="font-semibold">Videos</h3>

//             {product.youtubeVideoLink?.map((url: string, i: number) => (
//               <a
//                 key={i}
//                 href={url}
//                 target="_blank"
//                 className="block p-3 border rounded-lg bg-gray-50 text-blue-600 underline"
//               >
//                 {url}
//               </a>
//             ))}
//           </div>

//           {/* REVIEWS */}
//           <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
//             <h3 className="font-semibold">Reviews & Ratings</h3>

//             {product.reviewLinks?.map((url: string, i: number) => (
//               <a
//                 key={i}
//                 href={url}
//                 target="_blank"
//                 className="block p-3 border rounded-lg bg-gray-50 text-blue-600 underline"
//               >
//                 {url}
//               </a>
//             ))}
//           </div>

//           {/* SOCIAL LINKS */}
//           <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
//             <h3 className="font-semibold">Social Links</h3>

//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Facebook</p>
//               <div className="p-3 border rounded-lg bg-gray-50">
//                 {product.facebookLink || "—"}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Instagram</p>
//               <div className="p-3 border rounded-lg bg-gray-50">
//                 {product.instagramLink || "—"}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">X (Twitter)</p>
//               <div className="p-3 border rounded-lg bg-gray-50">
//                 {product.twitterLink || "—"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE PREVIEW */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <img src={product.mainImageUrl} className="rounded-xl shadow-md" />
//         </div>
//       </div>
//     </div>
//   );
// }
