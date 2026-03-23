# 🚀 Clubero – Membership & Event Management Platform  

## 📂 Project Links  

- 🔗 Live: https://clubero.vercel.app/  
- 🔗 Backend: https://github.com/Mostafiz002/Clubero-Backend 
- 🔗 Frontend: https://github.com/Mostafiz002/Clubero-Frontend  

---

## 📌 Overview  

**Clubero** is a full-stack web application that allows users to **discover, join, and manage local clubs and events**. Members can explore clubs, join memberships, and register for events. Club Managers can create clubs, manage members, and organize events. Admins oversee and control the entire platform  

---

## ✨ Features  

### ⚙️ Backend  
- 🔒 Secure API with JWT & Firebase Admin verification  
- 🧠 Structured MongoDB schema using Mongoose  
- ✅ Request validation using Zod  
- ⚠️ Centralized error handling (Global Error Handler + AppError)  
- 🔄 Async error handling using catchAsync  
- 📦 Standardized API responses using sendResponse 
- 🏢 Club creation, approval, and management system  
- 💳 Membership system (Free & Paid with Stripe integration)  
- 🎟️ Event creation & registration system  
- 📄 Server-side filtering, sorting & pagination and Dashboard Apis 

---

### 🎨 Frontend  
- 🔐 Firebase Authentication (Email/Password + Google Sign-in)  
- 👥 Role-based UI (Member / Club Manager / Admin)  
- 📊 Dynamic dashboards using TanStack Query  
- 📝 Forms with React Hook Form  
- 🔍 Search & filtering for clubs and events  
- ⚡ Real-time UI updates  
- 🎨 Responsive UI with Tailwind CSS + DaisyUI  
- 🎬 Smooth animations with Framer Motion  
- 🔔 Toast notifications for user feedback 

---

## 🛠️ Tech Stack  

### ⚙️ Backend  
- Node.js + Express.js  
- TypeScript  
- MongoDB + Mongoose  
- Zod (Validation)  
- Firebase Admin SDK  
- JWT Authentication  
- Stripe API  
- Global Error Handling  
- dotenv, CORS   

---

### 🎨 Frontend  
- React.js (Vite)  
- React Router v6  
- React Hook Form  
- TanStack Query (React Query)  
- Tailwind CSS + DaisyUI  
- Framer Motion  
- Firebase Authentication  
- Stripe Checkout  
- Axios  
- React Hot Toast  

---

## 🧠 Backend Refactor (Latest Update)  

Originally, the backend was built in a **single `index.js` file**, which was not scalable or industry-standard.  

The backend has now been completely restructured and upgraded:  

- ✅ Migrated from **JavaScript → TypeScript**  
- ✅ Introduced Mongoose for structured MongoDB schema management  
- ✅ Implemented Zod validation for request data integrity  
- ✅ Added Global Error Handler with custom `AppError`  
- ✅ Used catchAsync to eliminate repetitive try-catch blocks  
- ✅ Standardized responses using sendResponse utility
- ✅ Refactored into a modular, scalable folder structure 

---