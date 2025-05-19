import { useEffect, useState } from "react";

export default function UrlCompressor({ fileUrl,compressionMethod,onCompressed }) {
  const [loading, setLoading] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!fileUrl) return;

    const compressFile = async () => {
      setLoading(true);
      setCompressedUrl("");
      setMessage("");

      try {
        const res = await fetch("http://localhost:3000/api/compress/compress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl,method:compressionMethod }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Compression failed");

        setCompressedUrl(data.file.fileUrl);
        setMessage("✅ File compressed successfully!");
        onCompressed && onCompressed({ fileUrl: data.file.fileUrl });

      } catch (err) {
        console.error("Compression error:", err);
        setMessage("❌ Compression failed. Try again.");
      } finally {
        setLoading(false);
      }
    };

    compressFile();
  }, [fileUrl,compressionMethod]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600">Uploaded File:</p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 underline text-sm font-medium"
        >
          📄 View Uploaded File
        </a>
      </div>

      {loading && (
        <div className="text-center text-teal-600 animate-pulse">
          ⏳ Compressing your file...
        </div>
      )}

      {message && (
        <p className="text-center text-gray-700 font-medium">{message}</p>
      )}

      {compressedUrl && (
        <div className="text-center bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Download Compressed File:</p>
          <a
            href={compressedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 underline text-sm font-medium"
          >
            📦 Download File
          </a>
        </div>
      )}
    </div>
  );
}