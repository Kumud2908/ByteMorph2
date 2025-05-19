import React, { useState } from "react";
import axios from "axios";

const Decrypt = ({onDecryptComplete}) => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseUrl, setResponseUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !key || !iv) {
      alert("Please provide all fields.");
      return;
    }

    if (file.size === 0) {
      alert("File is empty.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);
    formData.append("iv", iv);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/decrypt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponseUrl(res.data.fileUrl);
      if (onDecryptComplete && res.data.fileUrl) {
        onDecryptComplete({
          fileUrl: res.data.fileUrl,
          
        });
      }
    } catch (err) {
      console.error("Decryption failed:", err.response?.data || err.message);
      alert(`Decryption failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-[#d1f2eb] px-6 py-8 space-y-6">
    <h2 className="text-2xl font-bold text-center text-[#2e7e6d]">🔐 Decrypt Encrypted File</h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Encrypted File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Encrypted File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="block w-full border border-gray-300 rounded-lg text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#eafaf1] file:text-[#2e7e6d] hover:file:bg-[#d1f2eb] focus:outline-none focus:ring-2 focus:ring-[#3fb59c]"
        />
      </div>

      {/* Decryption Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Decryption Key (hex)</label>
        <input
          type="text"
          pattern="[0-9a-fA-F]+"
          title="Hexadecimal only"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
          placeholder="e.g. a1b2c3d4..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fb59c] focus:border-[#3fb59c] text-gray-800"
        />
      </div>

      {/* IV */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IV (hex)</label>
        <input
          type="text"
          pattern="[0-9a-fA-F]+"
          title="Hexadecimal only"
          value={iv}
          onChange={(e) => setIv(e.target.value)}
          required
          placeholder="e.g. 1234abcd..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3fb59c] focus:border-[#3fb59c] text-gray-800"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md text-white font-semibold transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#3fb59c] hover:bg-[#35a38c]"
        }`}
      >
        {loading ? "Decrypting..." : "🔓 Decrypt"}
      </button>
    </form>

    {/* Result Section */}
    {responseUrl && (
      <div className="bg-[#f1fbf8] border border-[#c5eee3] rounded-lg p-4 text-[#256c5d] space-y-3 mt-4">
        <h4 className="font-semibold text-[#2e7e6d]">✅ Decryption Complete</h4>
        <a
          href={responseUrl}
          target="_blank"
          rel="noreferrer"
          className="block break-words text-sm text-[#2b7a6d] underline"
        >
          {responseUrl}
        </a>
        <a href={responseUrl} download>
          <button className="mt-2 w-full py-2 bg-[#3fb59c] text-white rounded-md hover:bg-[#35a38c]">
            ⬇️ Download Decrypted File
          </button>
        </a>
      </div>
    )}
  </div>
);

  
  
};

export default Decrypt;
