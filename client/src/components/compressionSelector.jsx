import React from 'react';

export default function CompressionSelector({ selectedMethod, onChange }) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-700 font-medium mb-2">Choose Compression Algorithm:</p>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => onChange('huffmann')}
          className={`px-4 py-1 text-sm font-medium border ${
            selectedMethod === 'huffmann'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-teal-600 border-teal-600'
          } rounded-l-md`}
        >
          Huffman
        </button>
        <button
          type="button"
          onClick={() => onChange('rle')}
          className={`px-4 py-1 text-sm font-medium border ${
            selectedMethod === 'rle'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-teal-600 border-teal-600'
          } rounded-r-md`}
        >
          RLE
        </button>
      </div>
    </div>
  );
}
