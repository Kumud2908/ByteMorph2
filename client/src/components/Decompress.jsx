import { useEffect, useState } from "react";

export default function DecompressionChecker({ fileUrl }) {
  console.log("file url recieved",fileUrl)
  const [decompressedFile, setDecompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!fileUrl) return;

    const decompressFile = async () => {
      setLoading(true);
      setMessage("");
      setDecompressedFile(null);

      try {
        const res = await fetch("http://localhost:3000/api/decompress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Decompression failed");

        setMessage(data.message || "✅ Decompression successful!");
        setDecompressedFile(data.file);
      }catch (err) {
          console.error("Decompression error:", err);
        
          const isNetworkError =
            err.name === "TypeError" &&
            (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"));
        
          setMessage(
            isNetworkError
              ? "❌ Network error: Could not reach the decompression server. Please check your connection."
              : `❌ ${err.message || "Decompression failed. Please try again."}`
          );
        }
         finally {
        setLoading(false);
      }
    };

    decompressFile();
  }, [fileUrl]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-3xl shadow-xl space-y-4">
      <h3 className="text-2xl font-bold text-center text-gray-800">
        🔄 Decompression Status
      </h3>

      {loading && (
        <div className="text-center text-teal-600 animate-pulse">⏳ Decompressing...</div>
      )}

      {!loading && message && (
        <p className="text-center font-medium text-gray-700">{message}</p>
      )}

      {decompressedFile?.fileUrl && (
        <div className="text-center mt-4 bg-teal-50 p-4 rounded-xl border border-teal-100">
          <p className="text-sm text-gray-600 mb-1">📥 Decompressed File:</p>
          <a
            href={decompressedFile.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 underline font-medium break-all"
          >
            ⬇️ {decompressedFile.fileName}
          </a>
        </div>
      )}

      {!fileUrl && (
        <p className="text-sm text-center text-gray-400">
          Waiting for a file to decompress...
        </p>
      )}
    </div>
  );
}
