import React, { useState, useEffect } from "react";
import axios from "axios";

const EncryptFileUpload = ({ fileUrl }) => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const encryptFile = async () => {
      if (!fileUrl) return;

      try {
        setLoading(true);
        const res = await axios.post("http://localhost:3000/api/encrypt", {
          fileUrl,
        });

        setResponseData(res.data);
      } catch (err) {
        console.error("Encryption failed:", err.response?.data || err.message);
        alert("Encryption failed. Please check the file URL.");
      } finally {
        setLoading(false);
      }
    };

    encryptFile();
  }, [fileUrl]);

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-[#d1f2eb] rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#3fb59c] mb-4 text-center">🔐 Encrypting File...</h2>
  
      {loading && (
        <p className="text-center text-gray-600 flex items-center justify-center gap-2">
          ⏳ Encrypting, please wait...
        </p>
      )}
  
      {responseData && (
        <div className="mt-6 bg-[#e6f7f3] border border-[#c0e9dd] rounded-lg p-4 text-[#256c5d] space-y-4">
          <h4 className="font-semibold text-lg">✅ Encrypted File Info:</h4>
  
          {/* File URL Box */}
          <div className="bg-white border border-[#c0e9dd] rounded-md p-3">
            <p className="text-sm font-medium text-gray-700 mb-1">File URL:</p>
            <a
              href={responseData.encryptedFileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#2b7a6d] break-words underline"
            >
              {responseData.encryptedFileUrl}
            </a>
          </div>
  
          {/* Key Box */}
          <div className="bg-white border border-[#c0e9dd] rounded-md p-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Key:</p>
            <p className="break-all text-gray-800">{responseData.key}</p>
          </div>
  
          {/* IV Box */}
          <div className="bg-white border border-[#c0e9dd] rounded-md p-3">
            <p className="text-sm font-medium text-gray-700 mb-1">IV:</p>
            <p className="break-all text-gray-800">{responseData.iv}</p>
          </div>
        </div>
      )}
  
      {!loading && !responseData && (
        <p className="text-gray-400 text-sm text-center mt-4">
          Waiting for file to encrypt...
        </p>
      )}
    </div>
  );
  
  
};

export default EncryptFileUpload;
