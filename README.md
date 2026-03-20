# ShopFlow - Premium E-Commerce Platform

![ShopFlow Logo](https://img.shields.io/badge/ShopFlow-E--Commerce-34d399?style=for-the-badge)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Suraj--Rapeti-black?logo=github)](https://github.com/Suraj-Rapeti)

A modern, feature-rich e-commerce platform built with React, Firebase, and Tailwind CSS. ShopFlow provides a seamless shopping experience with real-time product management, secure authentication, and comprehensive order tracking.

## ✨ Features

### 🛍️ Shopping Features
- **Product Catalog** - Browse and filter products with detailed information
- **Search Functionality** - Real-time product search across the catalog
- **Shopping Cart** - Add, remove, and manage cart items with persistent storage
- **Checkout Process** - Secure and streamlined checkout experience
- **Order Tracking** - View order history and track purchases

### 🔐 Authentication & Security
- **Google OAuth Login** - Quick sign-in with Google account
- **Email & Password Authentication** - Traditional email-based registration
- **User Profiles** - Profile photo support (Google avatars + custom uploads)
- **Firebase Security** - Secure backend with Firebase Authentication

### 🎨 User Experience
- **Dark & Light Theme** - Toggle between themes for comfortable viewing
- **Responsive Design** - Mobile-first approach, works on all devices
- **Smooth Animations** - Polished UI with Tailwind CSS transitions
- **Auto-hiding Navbar** - Smart navbar that hides on scroll for better space

### 🏪 Admin Features
- **Product Management** - Add, edit, and delete products
- **Inventory Control** - Manage stock and product details
- **Order Management** - View all orders and customer information
- **Dashboard** - Comprehensive admin dashboard with analytics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Latest React with hooks for state management
- **React Router** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - Beautiful SVG icons
- **Chart.js** - Data visualization for admin dashboard

### Backend & Services
- **Firebase** - Real-time database and authentication
  - Firebase Authentication (Email & Google OAuth)
  - Firestore Database (Real-time NoSQL)
  - Firebase Storage (Product images)

### State Management & Context
- **React Context API** - Shopping cart management
- **Custom Hooks** - Auth and theme management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- Firebase account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Suraj-Rapeti/ecommerce-app.git
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Get your Firebase config credentials
   - Update `src/lib/firebase.js` with your credentials:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Set up Firestore Database**
   - Create a Firestore database in Firebase Console
   - Set up collections: `users`, `products`, `orders`
   - Enable Google and Email authentication methods

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### For Customers
1. **Browse Products** - Start from the home page
2. **Search & Filter** - Use search bar to find products
3. **Add to Cart** - Click "Add to Cart" on any product
4. **Login** - Register or login with Google/Email
5. **Checkout** - Review cart and complete purchase
6. **Track Orders** - View order history in "My Orders"

### For Admins
1. **Login** - Use admin email: `suraj.rapeti06@gmail.com`
2. **Access Dashboard** - Navigate to Dashboard in profile menu
3. **Manage Products** - Add, edit, or delete products
4. **View Orders** - See all customer orders and details

## 📁 Project Structure

```
ecommerce-app/
├── public/                 # Static files
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/        # Reusable React components
│   │   ├── navbar.js
│   │   ├── product-card.js
│   │   ├── theme-provider.js
│   │   ├── theme-toggle.js
│   │   └── ui/            # UI component library
│   ├── pages/             # Page components
│   │   ├── Home.js
│   │   ├── Products.js
│   │   ├── ProductDetail.js
│   │   ├── Cart.js
│   │   ├── Login.js
│   │   ├── Checkout.js
│   │   ├── MyOrders.js
│   │   └── Admin.js
│   ├── lib/               # Utilities and services
│   │   ├── firebase.js
│   │   ├── cart-context.js
│   │   ├── products.js
│   │   ├── utils.js
│   │   └── uploadProducts.js
│   ├── App.js             # Main app component
│   ├── App.css            # Global styles
│   ├── index.css          # Tailwind + theme configuration
│   └── index.js           # React entry point
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js
└── README.md
```

## 🔧 Configuration

### Theme Customization
Edit the CSS variables in `src/index.css`:
- **Light Theme** - Primary colors and backgrounds
- **Dark Theme** - Accent colors automatically adjust

### Firebase Rules
Set up Firestore security rules in Firebase Console for production:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.email == 'suraj.rapeti06@gmail.com';
    }
    match /orders/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📦 Available Scripts

### Development
```bash
npm start          # Run development server on port 3000
npm test           # Run tests in interactive mode
```

### Production
```bash
npm run build      # Create optimized production build
npm run eject      # Eject from Create React App (one-way operation)
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Deploy to Firebase Hosting
```bash
npm run build
firebase login
firebase init hosting
firebase deploy
```

## 🔐 Security Notes

- ⚠️ **Never commit Firebase credentials** - Use environment variables
- 🔒 **Firestore Security Rules** - Always set up proper permissions
- 🛡️ **OAuth Validation** - Google login validates tokens server-side
- 💳 **Payment Processing** - Use Stripe/PayPal for real transactions (not implemented in demo)

## 📝 Environment Variables

Create a `.env.local` file (add to `.gitignore`):
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Suraj Rapeti**
- GitHub: [@Suraj-Rapeti](https://github.com/Suraj-Rapeti)
- Email: suraj.rapeti06@gmail.com

## 🙏 Acknowledgments

- React community for excellent documentation
- Firebase for backend services
- Tailwind CSS for beautiful styling
- Lucide React for icons

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include screenshots if applicable

---

**Made with ❤️ by Suraj Rapeti**

⭐ If you found this project helpful, please consider giving it a star!


### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
