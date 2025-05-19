import React from 'react';
import { FaCloudUploadAlt, FaLock, FaUserShield } from 'react-icons/fa';

const features = [
  {
    icon: <FaCloudUploadAlt className="text-4xl text-[#3fb59c]" />,
    title: 'Fast Uploads',
    desc: 'Upload large files swiftly with our optimized backend.',
  },
  {
    icon: <FaLock className="text-4xl text-[#3fb59c]" />,
    title: 'Privacy Focused',
    desc: 'End-to-end encryption ensures your data stays safe.',
  },
  {
    icon: <FaUserShield className="text-4xl text-[#3fb59c]" />,
    title: 'User Friendly',
    desc: 'A modern interface designed for comfort and clarity.',
  },
];

export default function Features() {
  return (
    <section className="py-12 px-4 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
      {features.map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-md border border-[#d4f5ea] p-6 text-center">
          {item.icon}
          <h3 className="text-xl font-semibold my-3">{item.title}</h3>
          <p className="text-gray-600 text-sm">{item.desc}</p>
        </div>
      ))}
    </section>
);
}