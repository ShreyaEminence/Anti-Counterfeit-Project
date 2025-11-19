import { useState,useEffect } from "react";
import api from "@/_lib/api";

 function ProductSection({ brandId }: { brandId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // You can change page size
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product", {
        params: { brandId, page, limit },
      });
      console.log(res,"res")
      setProducts(res.data?.data || []);
      setTotal(res.data?.total || 0); // assuming API returns total count
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) fetchProducts();
  }, [brandId, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>
            ))}
          </div> 

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-3 py-1">
              Page {page} of {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}
export default ProductSection