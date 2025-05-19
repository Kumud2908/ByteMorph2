import { useState } from "react";
import FileUploader from "./FileUploader";
import UrlCompressor from "./Compress";
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";
import CompressionSelector from "./compressionSelector";

export default function FileFlow() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressionMethod, setCompressionMethod] = useState("huffman");
  

  const handleUploadComplete = (file) => {
    setUploadedFile(file);
  };
  const handleCompressionComplete = (file) => {
    setCompressedFile(file);
  };  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xl space-y-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Upload & Compress
        </h1>

        {/* Show selector only before upload */}
        {!uploadedFile && (
          <CompressionSelector
            selectedMethod={compressionMethod}
            onChange={setCompressionMethod}
          />
        )}

        {!uploadedFile ? (
          <FileUploader
          onUploadComplete={handleUploadComplete}
          compressionMethod={compressionMethod}
        />
        
        ) : (
          <>
          {!compressedFile && (
            <UrlCompressor
              fileUrl={uploadedFile.fileUrl}
              compressionMethod={compressionMethod}
              onCompressed={handleCompressionComplete}
            />
          )}

          {compressedFile && (
            <Encrypt fileUrl={compressedFile.fileUrl} />
          )}
          
        </>
        )}
      </div>
    </div>
  );
}
