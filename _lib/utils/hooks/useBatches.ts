import { useEffect, useState } from "react";
import api from "@/_lib/api";
import { Batch } from "@/_lib/types";

export function useBatches(
  page = 1,
  search = "",
  selectedProduct = "",
  selectedBrand = "",
  selectedStatus = ""
) {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const query = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        if (search.trim() !== "") {
          query.append("batchId", search.trim());
        }

        if (selectedProduct) {
          query.append("productId", selectedProduct);
        }

        if (selectedBrand) {
          query.append("brandId", selectedBrand);
        }

        if (selectedStatus) {
          query.append("status", selectedStatus);
        }

        const res = await api.get(`/batch?${query.toString()}`);

        setBatches(res.data.data.batches || []);
        setPagination(res.data.data.pagination);
      } catch (err) {
        console.error("Failed to fetch batches", err);
        setBatches([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, search, selectedProduct, selectedBrand, selectedStatus]);

  return { loading, batches, pagination };
}
