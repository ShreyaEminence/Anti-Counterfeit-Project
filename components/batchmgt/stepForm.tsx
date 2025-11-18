"use client";

import { useState } from "react";
import {
  FiPackage,
  FiInfo,
  FiShield,
  FiAlertTriangle,
  FiHash,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import api from "@/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBrandShortRef, StepFormProps } from "@/_lib/types";

export default function StepForm({
  brands,
  products,
  businessOwnerId,
  onClose,
}: StepFormProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [brandId, setBrandId] = useState("");
  const [productId, setProductId] = useState("");

  // Step 2
  const [batchId, setBatchId] = useState("");
  const [noOfItems, setNoOfItems] = useState<number | "">("");
  const [manufactureDate, setManufactureDate] = useState("");

  // Step 3
  const [hasWarranty, setHasWarranty] = useState<boolean | null>(null);

  // Step 4
  const [hasExpiry, setHasExpiry] = useState<boolean | null>(null);
  const [expireDate, setExpireDate] = useState("");

  // Step 5
  const [serialNumberType, setSerialNumberType] = useState<
    "sequential" | "random" | ""
  >("");
  const [prefix, setPrefix] = useState("");
  const [startSerialNumber, setStartSerialNumber] = useState("");

  // Step 6
  const [manufacturingLocation, setManufacturingLocation] = useState("");
  const [batchNotes, setBatchNotes] = useState("");

  // Misc
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  function validateStep() {
    setError("");

    if (step === 1) {
      if (!brandId) return setError("Please select brand");
      if (!productId) return setError("Please select product");
    }

    if (step === 2) {
      if (!batchId) return setError("Batch ID required");
      if (noOfItems === "" || Number(noOfItems) <= 0)
        return setError("Enter valid quantity");
      if (!manufactureDate) return setError("Manufacture date required");
    }

    if (step === 3 && hasWarranty === null)
      return setError("Select warranty option");

    if (step === 4) {
      if (hasExpiry === null) return setError("Select expiry option");
      if (hasExpiry && !expireDate) return setError("Select expiry date");
    }

    if (step === 5) {
      if (!serialNumberType) return setError("Select serial type");
      if (
        serialNumberType === "sequential" &&
        (!startSerialNumber || startSerialNumber.trim() === "")
      )
        return setError("Start serial number required");
    }

    return true;
  }

  async function handleNext() {
    if (!validateStep()) return;

    if (step === 6) return submitForm();

    setStep(step + 1);
  }

  async function submitForm() {
    setLoading(true);
    setError("");

    const payload = {
      productId,
      batchId,
      manufactureDate,
      expireDate: hasExpiry ? expireDate : "",
      serialNumberType: serialNumberType,
      prefix: serialNumberType === "sequential" ? prefix : "",
      startSerialNumber:
        serialNumberType === "sequential" ? startSerialNumber : "",
      noOfItems: Number(noOfItems),
      businessOwnerId,
    };
    try {
      const res = await api.post("/batch/with-tags", payload);
      setSuccessData(res.data);
    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong while creating batch"
      );
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { id: 1, title: "Select Product", icon: <FiPackage /> },
    { id: 2, title: "Batch Information", icon: <FiInfo /> },
    { id: 3, title: "Warranty", icon: <FiShield /> },
    { id: 4, title: "Expiry", icon: <FiAlertTriangle /> },
    { id: 5, title: "Serial Configuration", icon: <FiHash /> },
    { id: 6, title: "Additional Info", icon: <FiFileText /> },
  ];
  const extractBrandId = (brand: string | IBrandShortRef) => {
    if (!brand) return null;

    // If backend returned an object
    if (typeof brand === "object") {
      return brand._id; // directly return object `_id`
    }

    // If backend returned a stringified object → extract using regex
    const match = brand.match(/ObjectId\('(.+?)'\)/);
    return match ? match[1] : null;
  };

  const filteredProducts = brandId
    ? products.filter((p) => extractBrandId(p.brandId) === brandId)
    : products;
  console.log(filteredProducts, "dd");
  // ⭐ SUCCESS SCREEN
  if (successData) {
    const batch = successData?.data?.batch;
    const tags = successData?.data?.tags || [];

    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-green-600 text-xl font-semibold mb-3">
          <FiCheckCircle size={26} />
          Batch Created Successfully
        </div>

        <div className="bg-white border p-6 rounded-xl max-w-xl">
          <div className="mb-3">
            <div className="text-gray-500 text-sm">Batch ID</div>
            <div className="font-semibold">{batch?.batchId}</div>
          </div>

          <div className="mb-3">
            <div className="text-gray-500 text-sm">Total Tags</div>
            <div className="font-semibold">{tags.length}</div>
          </div>

          <div className="mb-4">
            <div className="text-gray-500 text-sm">Serial Type</div>
            <div className="font-semibold">{batch?.serialNumberType}</div>
          </div>

          <Button className="mt-4" onClick={onClose}>
            Back to Listing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* STEP INDICATORS */}
      <div className="flex gap-6 overflow-x-auto mb-8">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              step === s.id ? "bg-purple-100 border-purple-400" : "bg-white"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === s.id ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              {s.icon}
            </div>
            <div>
              <div className="text-sm font-medium">Step {s.id}</div>
              <div className="text-xs text-gray-500">{s.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white p-6 rounded-xl border">
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Step 1 — Select Product
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Brand *</Label>
                <select
                  value={brandId}
                  onChange={(e) => {
                    setBrandId(e.target.value);
                    setProductId("");
                  }}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Select Brand</option>
                  {Array.isArray(brands) &&
                    brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <Label>Product *</Label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Select Product</option>
                  {Array.isArray(filteredProducts) &&
                    filteredProducts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Step 2 — Batch Information
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Batch ID *</Label>
                <Input
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
              </div>

              <div>
                <Label>No Of Units *</Label>
                <Input
                  type="number"
                  value={noOfItems}
                  onChange={(e) =>
                    setNoOfItems(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="mt-4 max-w-sm">
              <Label>Manufacture Date *</Label>
              <Input
                type="date"
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Step 3 — Warranty</h2>

            <Label>Does this product have warranty?</Label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={hasWarranty === true}
                  onChange={() => setHasWarranty(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={hasWarranty === false}
                  onChange={() => setHasWarranty(false)}
                />
                No
              </label>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Step 4 — Expiry</h2>

            <Label>Does this product have expiry?</Label>
            <div className="flex gap-6 mt-2 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={hasExpiry === true}
                  onChange={() => setHasExpiry(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={hasExpiry === false}
                  onChange={() => setHasExpiry(false)}
                />
                No
              </label>
            </div>

            {hasExpiry && (
              <div className="max-w-sm">
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Step 5 — Serial Configuration
            </h2>

            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={serialNumberType === "sequential"}
                  onChange={() => setSerialNumberType("sequential")}
                />
                Sequential
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={serialNumberType === "random"}
                  onChange={() => setSerialNumberType("random")}
                />
                Random
              </label>
            </div>

            {serialNumberType === "sequential" && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Prefix (Optional)</Label>
                  <Input
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Start Serial Number *</Label>
                  <Input
                    value={startSerialNumber}
                    onChange={(e) => setStartSerialNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Step 6 — Additional Information
            </h2>

            <div className="mb-4">
              <Label>Manufacturing Location</Label>
              <Input
                value={manufacturingLocation}
                onChange={(e) => setManufacturingLocation(e.target.value)}
                placeholder="Factory Name or Country"
              />
            </div>

            <div>
              <Label>Batch Notes</Label>
              <textarea
                className="w-full border p-2 rounded-lg"
                value={batchNotes}
                onChange={(e) => setBatchNotes(e.target.value)}
                placeholder="Write notes..."
              ></textarea>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="text-red-600 font-medium mt-4">{error}</div>}

      {/* FOOTER BUTTONS */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>

        <Button onClick={handleNext} className="bg-purple-600 text-white">
          {step === 6 ? (loading ? "Creating..." : "Create Batch") : "Next"}
        </Button>
      </div>
    </div>
  );
}
