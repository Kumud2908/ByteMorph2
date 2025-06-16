# 🌀 ByteMorph

ByteMorph is a full-stack application powered by Node.js, Express, MongoDB, and Firebase, designed to handle secure file uploads with advanced features like TailwindCSS styling, authentication, and Cloudinary image storage.

About the app -
the app uses huffmann and rle  to compress the file  
in the project the .exe files  codes for huffmann and rle are run as child processes
however i have included cpp files for the same too for understanding pusposes 

## 🌐 Live Demo

Check out the project on (https://channeli.in/api/django_filemanager/media_files/124871/).

---

## 📦 Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** TailwindCSS (via Vite & PostCSS)
- **Database:** MongoDB (with Mongoose)
- **File Handling:** Multer, GridFS, Cloudinary
- **Authentication:** JWT, bcryptjs
- **Others:** Firebase, dotenv, fs-extra

---

## 🚀 Features

- 🔐 JWT-based user authentication
- 📁 Upload files securely to MongoDB (GridFS)
- ☁️ Cloudinary integration for image storage
- 🧰 TailwindCSS-powered frontend styling
- 🔄 Live reload using Nodemon in development

---

## 📁 Project Structure

```
ByteMorph/
├── api/              # Main backend logic
├── assets/           # Static assets
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Kumud2908/ByteMorph.git
cd ByteMorph
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root with the following:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FIREBASE_CONFIG=your_firebase_config


```
for testing pusposes i have uploaded .env file u can use the same 

### 4. Start the Server

```bash
# Development
npm run dev


```

---

## 🧪 Testing the API

You can use tools like **Postman** or **cURL** to test file uploads, authentication routes, and more.

---

## 🐞 Issues

Found a bug or want to request a feature? Submit an issue at:  
[https://github.com/Kumud2908/ByteMorph/issues](https://github.com/Kumud2908/ByteMorph/issues)

---


