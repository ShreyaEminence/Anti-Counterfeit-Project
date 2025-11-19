"use client";

import { useEffect, useState } from "react";
import api from "@/_lib/api";
import BrandForm from "@/components/Brand/BrandForm";
import { useRouter } from "next/navigation";
export default function EditBrandPage({ params }: any) {
  const [brand, setBrand] = useState(null);
const router=useRouter();
  // Fetch brand using ID
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await api.get(`/brand/${params.id}`);
        setBrand(res.data.data);
      } catch (error) {
        console.error("Failed to load brand:", error);
      }
    };

    fetchBrand();
  }, [params.id]);

  // Submit update API
  const handleUpdate = async (payload: any) => {
  const res=  await api.put(`/brand/${params.id}`, payload);
  console.log(res,"res in update")
  if(res.data.status){
    console.log(res.data.status,"status")
   router.push('/brandManagement')
  }
 
  };

  // Wait for data to load
  if (!brand) return <p className="p-4">Loading...</p>;

  return (
    <BrandForm
      initialData={brand}
      onSubmit={handleUpdate}
      isEdit={true}
    />
  );
}
