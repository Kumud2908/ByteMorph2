import React from 'react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="py-10 text-center">
      <Link
        to="/profile"
        className="px-6 py-3 bg-[#3fb59c] text-white font-semibold rounded-full hover:bg-[#34a28a] transition"
      >
        Get Started
      </Link>
    </section>
);
}