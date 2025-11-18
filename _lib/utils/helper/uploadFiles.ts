// import { ChangeEvent } from "react";
// import api from "@/_lib/api"; // your axios instance

// /**
//  * Upload file(s) based on count
//  * - Single file: calls /upload/single
//  * - Multiple files: calls /upload/multiple
//  * @param e ChangeEvent<HTMLInputElement>
//  * @param fieldName string - form field name for the file (default: "file")
//  * @returns Promise<string | string[]> uploaded file URL(s)
//  */
// export const uploadSingleOrMultipleFiles = async (
//   e: ChangeEvent<HTMLInputElement>,
//   fieldName: string = "file"
// ): Promise<string | string[]> => {
//   if (!e.target.files || e.target.files.length === 0) {
//     throw new Error("No files selected");
//   }

//   const files = e.target.files.length === 1 ? e.target.files[0] : Array.from(e.target.files);
//   console.log(files,"files")
//   const endpoint = Array.isArray(files) ? "/upload/multiple" : "/upload/image";

//   const formData = new FormData();
//   if (Array.isArray(files)) {
//     files.forEach((f) => formData.append(fieldName, f));
//   } else {
//     formData.append(fieldName, files);
//   }

//   try {
//     const response = await api.post(endpoint, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     console.log(response,"response")

//     if (Array.isArray(files)) {
//       return response.data.urls || [];
//     } else {
//       return response.data.url || "";
//     }
//   } catch (error) {
//     console.error("File upload failed:", error);
//     throw error;
//   }
// };
import { ChangeEvent } from "react";
import api from "@/_lib/api";

/**
 * Convert file to Base64
 */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

/**
 * Upload single or multiple files as Base64
 */
export const uploadSingleOrMultipleFilesBase64 = async (
  e: ChangeEvent<HTMLInputElement>,
  singleFileEndpoint: string = "/upload/image",
  multipleFilesEndpoint: string = "/upload/multiple",
  folder: string = "products"
): Promise<string | string[]> => {
  if (!e.target.files || e.target.files.length === 0) {
    throw new Error("No files selected");
  }

  const files = Array.from(e.target.files);

  if (files.length === 1) {
    const base64 = await fileToBase64(files[0]);
    const res = await api.post(singleFileEndpoint, {
      image: base64,
      folder,
    });
    console.log(res,"image res")
    return res.data.data.url; // single file URL
  } else {
    const base64Array = await Promise.all(files.map(fileToBase64));
    const res = await api.post(multipleFilesEndpoint, {
      images: base64Array, // backend might expect array key as `images`
      folder,
    });
    console.log(res,'multiple file res')
    return res.data.urls; // multiple file URLs
  }
};
