import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#eafaf1] rounded-xl overflow-hidden shadow-lg">
      {/* Left Side - Content */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-10 bg-[#eafaf1]">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-teal-600 mb-4">About ByteMorph</h2>
          <p className="text-gray-700 mb-3">
            <strong>ByteSqueeze</strong> is a multithreaded file compression system designed for performance and precision. Built using adaptive chunking and smart encoding algorithms like Huffman and RLE, it ensures optimal speed and efficiency.
          </p>
          <p className="text-gray-700 mb-3">
            This project supports multi-core execution, dynamic load balancing, and a user-friendly UI — ideal for developers, researchers, and enthusiasts dealing with large datasets.
          </p>
          <p className="text-gray-700">
            Created with ❤ by a team passionate about clean code, high performance, and delightful user experience.
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="md:w-1/2 w-full bg-[#6ad6c4] relative flex items-center justify-center">
      <img
  src="/women.svg"
  alt="Compression Illustration"
  className="max-w-[70%] mx-auto drop-shadow-lg"
/>
        {/* You can replace with an SVG similar to the email/flying paper plane theme shown in the screenshot */}
      </div>
    </div>
  );
}
