"use client";

import React from "react";
import { Brand } from "@/_lib/types"; 

interface DeleteBrandModalProps {
  isOpen: boolean;
  brand: Brand | null;
  onCancel: () => void;
  onConfirm: (brand: Brand) => void;
}

const DeleteBrandModal: React.FC<DeleteBrandModalProps> = ({
  isOpen,
  brand,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-96 space-y-4 shadow-lg">
        <h3 className="text-lg font-bold">Delete Brand</h3>
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{brand.name}</span>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg "
            onClick={() => onConfirm(brand)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBrandModal;
