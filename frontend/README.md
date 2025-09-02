
# Wifmart

📌 **Overview**
Wifmart is an online marketplace that connects service providers with clients. Service providers can create profiles, showcase portfolios, and allow clients to search and hire them. The platform simplifies hiring through skill-based and name-based searches.

---

## 🚀 Tech Stack

* **Frontend:** Vite + React (JSX)
* **Styling:** TailwindCSS
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Media Storage:** Cloudinary
* **Authentication:** Google OAuth (Sign in with Google)

---

## 🎯 Features

### 🔑 Authentication

* Sign in with Google (OAuth 2.0)
* Secure session management using JWT

### 👤 Service Provider Profiles

* Name, bio, skills, and services
* Contact info: phone, WhatsApp, portfolio link
* Profile picture (stored in Cloudinary)

### 🖼 Portfolio Showcase

* Upload up to 5 images (stored in Cloudinary)
* Optional external portfolio/social media links

### 🔍 Search

* Skill-based search
* Name-based search

### 📬 Notifications

* Welcome message on sign-in
* Optional email notifications (future update)

---

## 🗄 Database Structure (MongoDB)

### `users` Collection

| Field            | Type     | Description                        |
| ---------------- | -------- | ---------------------------------- |
| `_id`            | ObjectId | MongoDB ID                         |
| `googleId`       | String   | Google account unique ID           |
| `name`           | String   | Full name                          |
| `email`          | String   | User email (unique)                |
| `bio`            | String   | Short description                  |
| `phone`          | String   | Contact number                     |
| `whatsapp`       | String   | WhatsApp link                      |
| `portfolio_link` | String   | External portfolio URL             |
| `profile_image`  | String   | Cloudinary URL for profile picture |
| `created_at`     | Date     | Signup date                        |

---

### `services` Collection

| Field         | Type     | Description               |
| ------------- | -------- | ------------------------- |
| `_id`         | ObjectId | MongoDB ID                |
| `user_id`     | ObjectId | Reference to user’s `_id` |
| `skill`       | String   | Skill name                |
| `category`    | String   | Category of service       |
| `description` | String   | Service details           |

---

### `portfolios` Collection

| Field       | Type     | Description                             |
| ----------- | -------- | --------------------------------------- |
| `_id`       | ObjectId | MongoDB ID                              |
| `user_id`   | ObjectId | Reference to user’s `_id`               |
| `image_url` | String   | Cloudinary URL for portfolio image      |
| `link`      | String   | Optional external portfolio/social link |

---

## 🗂 Cloudinary Storage

* **Folders:**

  * `wifmart/profile-images/` → Profile pictures
  * `wifmart/portfolio-images/` → Portfolio samples
* Files named as: `userId_timestamp.extension`

---

## 📄 Pages

**Public:**

* Home → Search bar + featured providers
* Service List → Search results & filters
* Profile View → Provider details + portfolio

**Auth:**

* Sign in with Google

**Dashboard (Logged-in Users):**

* Profile settings
* Manage services
* Upload/edit portfolio

---

## 🔐 Backend Setup

* **Authentication:** Google OAuth 2.0 + JWT
* **MongoDB:** Mongoose for schema-based modeling
* **Cloudinary:** For profile and portfolio image storage
* **API Routes:**

  * `/api/auth`: Google sign-in, JWT session management
  * `/api/users`: Profile CRUD
  * `/api/services`: Service CRUD
  * `/api/portfolios`: Portfolio CRUD
  * `/api/search`: Skill and name-based search

---

## 📆 Development Plan

* Integrate Google OAuth for sign-in
* Configure MongoDB with Mongoose schemas
* Connect backend (Node.js + Express) with Google Auth flow
* Integrate Cloudinary for image uploads
* Implement JWT-based authentication after Google login
* Build search functionality with MongoDB queries
* Style UI with TailwindCSS and ensure responsiveness

---

## 🔮 Future Enhancements

* Ratings & reviews
* Location-based search
* Payment integration with Stripe
* In-app messaging
* Advanced search filters
* Backend optimization with Redis caching

---

## 🏗 Project Goal

To create a fast, scalable marketplace that connects service providers and clients using the MERN stack, Google OAuth for authentication, and Cloudinary for media storage—ensuring a seamless hiring experience.

