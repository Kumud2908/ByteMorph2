import React, { useState } from 'react';
import DecompressionChecker from '../components/Decompress';
import Decrypt from "../components/Decrypt";

export default function DeCompressorPage() {
  const [decrypt, setDecrypt] = useState(null);

  const handleDecryptComplete = (file) => {
    setDecrypt(file); // file should have fileUrl
  };

  return (
    <div className="bg-gradient-to-br from-[#eafaf1] to-[#f7fdfc] min-h-screen space-y-6 py-10 px-4">
      <Decrypt onDecryptComplete={handleDecryptComplete} />
      
      {decrypt?.fileUrl ? (
        <DecompressionChecker fileUrl={decrypt.fileUrl} />
      ) : (
        <p className="text-center text-gray-600">🔒 Waiting for decryption to complete...</p>
      )}
    </div>
  );
}
