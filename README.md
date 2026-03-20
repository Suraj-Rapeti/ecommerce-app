# 🛍️ ShopFlow – E-commerce Product Management System

A full-stack e-commerce web application built using **React, Firebase, and Tailwind CSS**, designed as a **product management project** focusing on user experience, order tracking, and admin analytics.

---

## 🚀 Overview

ShopFlow is not just a UI demo — it simulates a **real-world e-commerce system** with:

* User authentication (Email + Google)
* Product browsing and filtering
* Cart and checkout system
* Order tracking for users
* Admin dashboard with real-time data

The project demonstrates both **engineering implementation** and **product thinking**, focusing on improving the post-purchase experience and system transparency.

---

## 🎯 Problem Statement

Users often face:

* Lack of visibility after placing orders
* Poor checkout experience
* No clear tracking of purchases

This project aims to solve:

> **“How can we improve the end-to-end e-commerce experience, especially post-purchase visibility and system transparency?”**

---

## 💡 Key Features

### 👤 User Features

* 🔐 Authentication (Email + Google Sign-In)
* 🛒 Add to Cart & Manage Cart
* 💳 Checkout System
* 📦 View Order History (My Orders)
* 🧾 Real-time Order Details

---

### 🛍️ Product Features

* Product listing with categories
* Product detail pages
* Responsive UI
* Search functionality (basic)

---

### 📊 Admin Features

* 🔑 Role-based access (Admin only)
* 📈 Dashboard with:

  * Total Revenue
  * Total Orders
  * Total Users
* 📦 View all orders
* 🧠 Real data fetched from Firebase

---

## 🧱 Tech Stack

| Technology    | Usage          |
| ------------- | -------------- |
| React.js      | Frontend       |
| Firebase Auth | Authentication |
| Firestore     | Database       |
| Tailwind CSS  | Styling        |
| React Router  | Navigation     |
| Lucide Icons  | UI Icons       |

---

## 🗂️ Project Structure

```
src/
├── components/
├── pages/
│   ├── Home.js
│   ├── Products.js
│   ├── ProductDetail.js
│   ├── Cart.js
│   ├── Checkout.js
│   ├── Login.js
│   ├── Admin.js
│   └── MyOrders.js
├── lib/
│   ├── firebase.js
│   ├── cart-context.js
│   └── products.js
```

---

## 🔥 Firebase Setup

1. Create a Firebase project

2. Enable:

   * Authentication (Email + Google)
   * Firestore Database

3. Add your config in:

```js
src/lib/firebase.js
```

---

## ▶️ Run Locally

```bash
git clone https://github.com/Suraj-Rapeti/ecommerce-app.git
cd ecommerce-app
npm install
npm start
```

---

## 📊 Data Model

### Orders Collection

```json
{
  "items": [],
  "total": number,
  "userId": string,
  "userEmail": string,
  "createdAt": timestamp
}
```

---

## 🧠 Product Thinking

This project focuses on:

* Improving **user trust after checkout**
* Providing **clear order visibility**
* Enabling **admin insights using real data**
* Simulating a **complete product lifecycle**

---

## 📌 Future Improvements

* Payment Integration (Stripe / Razorpay)
* Order Status Tracking (Processing → Shipped → Delivered)
* Advanced Search & Filters
* Notifications system
* Performance optimization

---

## 👨‍💻 Author

**Suraj Rapeti**

---

## ⭐ Conclusion

This project demonstrates how a simple e-commerce system can evolve into a **product-focused solution** by combining:

* Real backend integration
* User-centric features
* Data-driven admin insights

---

> Built with effort, debugging pain, and way too much time spent fixing profile pictures.
