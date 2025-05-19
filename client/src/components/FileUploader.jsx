import { useState } from "react";

export default function FileUploader({ onUploadComplete}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file.");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      setUploadMessage("✅ File uploaded successfully!");
      onUploadComplete(data.file); // Pass file object (includes fileUrl)
    } catch (err) {
      setUploadMessage("❌ Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-8 rounded-xl w-full bg-white hover:bg-gray-100 transition">
        <div className="text-gray-500 text-4xl mb-2">📂</div>
        <span className="text-gray-700 font-medium">
          {file ? file.name : "Choose a file to upload"}
        </span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
      
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-3 text-white font-semibold rounded-xl transition duration-300 ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
        }`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      {uploadMessage && (
        <>
        <p className="text-center text-sm text-gray-700 font-medium">{uploadMessage}</p>
        <p>{data.fileUrl}</p>
        </>
      )}
    </div>
  );
}
