import api from "@/_lib/api";
import { BatchDetailsResponse } from "@/_lib/types";
import { parseProduct } from "@/_lib/utils/helper";

const QRtab = ({ batch }: { batch: BatchDetailsResponse }) => {
  const product = parseProduct(batch.productId); // extract real product object
  const productId = product?._id; // THIS is what backend needs

  const handleFileDownload = async (
    endpoint: string,
    fileName: string,
    extraParams: Record<string, any> = {}
  ) => {
    try {
      const response = await api.get(endpoint, {
        params: {
          productId, // always send productId
          ...extraParams, // add any additional params
        },
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleQRDownload = async (
    tagId: string,
    type: "pre" | "post",
    fileName: string
  ) => {
    try {
      const response = await api.get(`/tag/${tagId}/download`, {
        params: { type, productId },
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("QR download failed:", err);
    }
  };

  return (
    <div className="border rounded-xl bg-white p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6">
        Preview QR Codes for this batch
      </h3>

      <div className="grid grid-cols-3 gap-6">
        {batch.tags?.map((tag: any, i: number) => (
          <div key={i} className="border rounded-xl p-4 shadow-sm bg-gray-50">
            <p className="font-medium">Serial: {tag.productSerialNumber}</p>

            {/* PRE QR */}
            <p className="text-xs font-semibold mt-3">PRE-SCAN QR</p>
            <img
              src={tag.preScannerQRCodeUrl}
              className="w-40 h-40 mx-auto"
              alt="pre QR"
            />
            <button
              className="text-purple-600 mt-2 float-right text-lg"
              onClick={() =>
                handleQRDownload(
                  tag._id,
                  "pre",
                  `${tag.productSerialNumber}-preScan.svg`
                )
              }
            >
              ⬇
            </button>

            {/* POST QR */}
            <p className="text-xs font-semibold mt-3">POST-SCAN QR</p>
            <img
              src={tag.postScannerQRCodeUrl}
              className="w-40 h-40 mx-auto"
              alt="post QR"
            />
            <button
              className="text-purple-600 mt-2 float-right text-lg"
              onClick={() =>
                handleQRDownload(
                  tag._id,
                  "post",
                  `${tag.productSerialNumber}-postScan.svg`
                )
              }
            >
              ⬇
            </button>
          </div>
        ))}
      </div>
      {/* FOOTER BUTTONS */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() =>
            handleFileDownload(
              "/tag/export/pdf",
              `${batch.batchId}-qrcodes.xlsx`
            )
          }
          className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700"
        >
          Download All as Excel
        </button>
        <button
          onClick={() =>
            handleFileDownload(
              "/tag/export/csv",
              `${batch.batchId}-qrcodes.csv`,
              {
                batchId: batch._id,
                businessOwnerId:
                  typeof window !== "undefined" &&
                  JSON.parse(localStorage.getItem("businessOwner") || "{}")._id,
              }
            )
          }
          className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700"
        >
          Download All as pdf
        </button>
      </div>
    </div>
  );
};

export default QRtab;
