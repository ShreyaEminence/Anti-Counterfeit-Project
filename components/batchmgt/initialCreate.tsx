"use client";

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center py-16">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-10 py-12 flex flex-col items-center text-center max-w-xl w-full">
        {/* Illustration */}
        <div className="w-24 h-24 mb-6">
          <img
            src="/assets/svg/noBatchYet.svg"
            alt="No Batches"
            className="w-full h-full object-contain opacity-90"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          No Batches Yet
        </h2>

        <p className="text-gray-500 mb-8 max-w-sm">
          Start by creating your first batch to manage and track your QRs
          efficiently.
        </p>

        <button
          onClick={onCreate}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition"
        >
          <span className="text-lg">＋</span> Create New Batch
        </button>
      </div>
    </div>
  );
}
