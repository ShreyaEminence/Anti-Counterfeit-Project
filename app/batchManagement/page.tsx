"use client";
import { useEffect, useState } from "react";
import EmptyState from "@/components/batchmgt/initialCreate";
import CardView from "@/components/batchmgt/cardView";
import ListView from "@/components/batchmgt/listView";
import { FiGrid, FiList } from "react-icons/fi";
import { BiDownload } from "react-icons/bi";
import api from "@/_lib/api";
import { useBatches } from "@/_lib/utils/hooks/useBatches";
import Pagination from "@/components/common/pagination";

// ⭐ NEW FORM (full page)
import StepForm from "@/components/batchmgt/stepForm";

export default function BatchManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [showStepForm, setShowStepForm] = useState(false);

  const [view, setView] = useState<"card" | "list">("card");
  const [selected, setSelected] = useState<string[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [exportType, setExportType] = useState("excel");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);

  const businessOwnerId =
    typeof window !== "undefined" && localStorage.getItem("businessOwner")
      ? JSON.parse(localStorage.getItem("businessOwner")!)._id
      : "";
  const { loading, batches, pagination } = useBatches(
    page,
    debouncedSearch,
    selectedProduct,
    selectedBrand,
    selectedStatus
  );
  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setFilterLoading(true);
        const [productsRes, brandsRes] = await Promise.all([
          api.get(`/product/business-owner/${businessOwnerId}`),
          api.get(`/brand/business-owner/${businessOwnerId}`),
        ]);
        setProducts(productsRes.data.data || []);
        setBrands(brandsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch filter data", err);
      } finally {
        setFilterLoading(false);
      }
    };

    if (businessOwnerId) fetchFilters();
  }, [businessOwnerId]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(
      selected.length === batches.length ? [] : batches.map((b) => b._id)
    );
  };

  const handleExport = async () => {
    if (!selected.length) return;
    try {
      const query = new URLSearchParams();
      query.append("batchIds", JSON.stringify(selected));

      const url =
        exportType === "excel"
          ? `/batch/download/excel?${query.toString()}`
          : `/batch/download/csv?${query.toString()}`;

      const response = await api.get(url, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        exportType === "excel" ? "batches_export.xlsx" : "batches_export.csv";
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      setShowExport(false);
    } catch (err) {
      console.error("EXPORT FAILED", err);
    }
  };

  if (showStepForm) {
    return (
      <StepForm
        brands={brands}
        products={products}
        businessOwnerId={businessOwnerId}
        onClose={() => setShowStepForm(false)}
      />
    );
  }

  if (
    (loading &&
      search === "" &&
      selectedBrand == "" &&
      selectedProduct == "") ||
    filterLoading
  ) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!batches.length && search === "") {
    return (
      <EmptyState
        onCreate={() => {
          setShowStepForm(true);
        }}
      />
    );
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("card")}
              className={`px-3 py-2 flex items-center gap-1 ${
                view === "card"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-500"
              }`}
            >
              <FiGrid /> Card View
            </button>

            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 flex items-center gap-1 ${
                view === "list"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-500"
              }`}
            >
              <FiList /> List View
            </button>
          </div>

          <button
            onClick={() => setShowStepForm(true)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Create New Batch
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 justify-between bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search By BatchId..."
              className="px-3 py-2 border rounded-lg w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value.trim())}
            />

            <select
              className="px-3 py-2 border rounded-lg min-w-[150px]"
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setPage(1); // reset pagination
              }}
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border rounded-lg min-w-[150px]"
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border rounded-lg min-w-[150px]"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              disabled={selected.length === 0}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${
                selected.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-purple-600"
              }`}
            >
              <BiDownload className="text-lg" />
              Export
            </button>

            {/* Export dropdown */}
            {showExport && selected.length > 0 && (
              <div className="absolute right-0 mt-2 w-56 bg-white border shadow-xl rounded-xl p-2 z-50">
                <button
                  onClick={() => {
                    setExportType("excel");
                    handleExport();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Export as Excel (.xlsx)
                </button>

                <button
                  onClick={() => {
                    setExportType("csv");
                    handleExport();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Export as CSV (.csv)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Batch Views */}
      <div className="min-h-[400px] relative">
        {loading &&
        (search !== "" || selectedBrand != "" || selectedProduct != "") ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : batches.length === 0 ? (
          <div>No Matched Data Found</div>
        ) : view === "card" ? (
          <CardView
            batches={batches}
            selected={selected}
            toggleSelect={toggleSelect}
          />
        ) : (
          <ListView
            batches={batches}
            selected={selected}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
          />
        )}
      </div>

      {/* Pagination */}
      {batches.length > 0 && (
        <Pagination pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  );
}
