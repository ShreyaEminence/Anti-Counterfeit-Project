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

export function useBatches(page = 1) {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await api.get(`/batch?page=${page}&limit=10`);
      setBatches(res.data.data.batches);
      setPagination(res.data.data.pagination);
      setLoading(false);
    }
    load();
  }, [page]);

  return { loading, batches, pagination };
}
