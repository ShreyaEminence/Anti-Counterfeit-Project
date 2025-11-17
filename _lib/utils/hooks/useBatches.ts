import { useEffect, useState } from "react";
import api from "@/_lib/api";
import { Batch } from "@/_lib/types";

// export const useBatches = () => {
//   const [loading, setLoading] = useState(true);
//   const [batches, setBatches] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const res = await api.get(`/batch`);
//         setBatches(res?.data?.data?.batches || []);
//       } catch (err) {
//         setBatches([]);
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBatches();
//   }, []);

//   return { loading, batches, setBatches };
// };

export function useBatches(page = 1, search = "") {
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

        const res = await api.get(`/batch?${query.toString()}`);
        setBatches(res.data.data.batches);
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
  }, [page, search]);

  return { loading, batches, pagination };
}
