import { Batch, BatchDetailsResponse } from "@/_lib/types";

const SerialNumberPage = ({ batch }: { batch: BatchDetailsResponse }) => {
  console.log("batch", batch);
  return (
    <div className="border rounded-xl bg-white p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Serial Number</h3>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-3 text-left">Serial #</th>
            <th className="p-3 text-left">QR Status</th>
            <th className="p-3 text-left">Scan Count</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Owner</th>
          </tr>
        </thead>

        <tbody>
          {batch.tags?.map((tag, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{tag.productSerialNumber}</td>

              <td className="p-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  Generated
                </span>
              </td>

              <td className="p-3">{tag.scanCount}</td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tag.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tag.status}
                </span>
              </td>

              <td className="p-3">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SerialNumberPage;
