import { PaginationProps } from "@/_lib/types";

export default function Pagination({
  pagination,
  onPageChange,
}: PaginationProps) {
  if (!pagination) return null;

  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center justify-end gap-2 mt-6">
      {/* Prev */}
      <button
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1.5 rounded-lg border ${
          hasPrevPage
            ? "hover:bg-gray-100"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1.5 rounded-lg border ${
            currentPage === num
              ? "bg-purple-600 text-white shadow"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-1.5 rounded-lg border ${
          hasNextPage
            ? "hover:bg-gray-100"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}
