import React from 'react'
import FileFlow from '../components/FileFlow'
// import UserInfoCard from '../components/UserCard'
// import UrlCompressor from '../components/Compress';
import { useLocation } from 'react-router-dom';
import { useState } from "react";

export default function Profile() {
  const location = useLocation();
  const { username } = location.state || {};
  const [uploadedFile, setUploadedFile] = useState(null);
  console.log("Location state:", location.state); // Add this

  return (
   <FileFlow/>
  )
}
