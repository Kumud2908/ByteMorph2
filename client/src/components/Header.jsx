import React from 'react'
import {Link} from 'react-router-dom'


export default function Header() {
  return (
    <nav className="bg-white shadow-md rounded-b-2xl border-b-2 border-teal-100">
    <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
      <h1 className="font-extrabold text-3xl text-teal-600 tracking-wide">Byte Morph</h1>
      <ul className="flex gap-6 text-base font-medium text-gray-700">
        <li>
          <Link to="/" className="hover:text-teal-500 transition-colors">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-teal-500 transition-colors">About</Link>
        </li>
        <li>
          <Link to="/signin" className="hover:text-teal-500 transition-colors">Sign-in</Link>
        </li>
        <li>
          <Link to="/signup" className="hover:text-teal-500 transition-colors">Sign-Up</Link>
        </li>
        <li>
          <Link to="/decrypt" className="hover:text-teal-500 transition-colors">Decompress</Link>
        </li>
      </ul>
    </div>
</nav>
);

}

