import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  LogOut,
  Home,
  Package,
  Settings,
  ClipboardList
} from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCart } from '../lib/cart-context';
import { ThemeToggle } from './theme-toggle';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const ADMIN_EMAIL = "suraj.rapeti06@gmail.com";

export function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);

  // 🔐 AUTH + PHOTO FIX
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        try {
          const userDoc = await getDoc(doc(db, "users", u.uid));

          let photoURL = null;

          // 🔥 1. Firestore photo
          if (userDoc.exists()) {
            const data = userDoc.data();
            photoURL = data.photo || null;
          }

          // 🔥 2. Google photo fallback (FIXED)
          if (!photoURL && u.photoURL) {
            photoURL = u.photoURL.includes('googleusercontent')
              ? `${u.photoURL}?sz=200`
              : u.photoURL;
          }

          setUserPhoto(photoURL);

        } catch (err) {
          console.error(err);

          // fallback anyway
          setUserPhoto(
            u.photoURL
              ? `${u.photoURL}?sz=200`
              : null
          );
        }
      } else {
        setUserPhoto(null);
      }
    });

    return unsub;
  }, []);

  // 📜 SCROLL
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY.current && currentY > 60) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Products', path: '/products', icon: Package },
    ...(user ? [{ label: 'My Orders', path: '/orders', icon: ClipboardList }] : []),
    ...(user && user.email === ADMIN_EMAIL
      ? [{ label: 'Dashboard', path: '/admin', icon: Settings }]
      : [])
  ];

  return (
    <header className={`fixed top-0 left-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm shadow-sm transition-transform duration-300 ${
      showNavbar ? "translate-y-0" : "-translate-y-full"
    }`}>
      
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity group">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-accent-foreground font-bold relative shadow-md group-hover:shadow-lg transition-shadow overflow-hidden">
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6" 
              fill="currentColor"
            >
              {/* Meaningful cart + arrow up = growth in ecommerce */}
              {/* Shopping Cart */}
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Upward Arrow - Growth */}
              <path d="M12 14v-8M9 9l3-3 3 3" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Dots for circles */}
              <circle cx="20" cy="21" r="1" fill="currentColor" />
              <circle cx="9" cy="21" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="hidden sm:flex flex-col gap-0">
            <span className="font-bold text-lg text-foreground leading-tight">ShopFlow</span>
            <span className="text-xs text-accent font-semibold">E-Commerce</span>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex gap-2 ml-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button variant="ghost">{link.label}</Button>
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3 ml-auto">

          {/* SEARCH */}
          <div className="hidden lg:flex w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <ThemeToggle />

          {/* USER */}
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://ui-avatars.com/api/?name=User&background=random";
                    }}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User />
                )}
              </Button>

              {/* DROPDOWN */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg p-4 z-50">

                  <p className="font-semibold text-foreground text-base">{user.displayName || "User"}</p>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>

                  <Link to="/orders" onClick={() => setIsUserDropdownOpen(false)}>
                    <Button variant="ghost" className="w-full mt-3 justify-start text-foreground hover:bg-secondary/50">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      My Orders
                    </Button>
                  </Link>

                  {user.email === ADMIN_EMAIL && (
                    <Link to="/admin" onClick={() => setIsUserDropdownOpen(false)}>
                      <Button variant="ghost" className="w-full mt-2 justify-start text-foreground hover:bg-secondary/50">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="destructive"
                    className="w-full mt-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}

          {/* CART */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* MOBILE MENU */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>

        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 md:hidden bg-background border-b shadow-lg">
            <div className="flex flex-col gap-2 px-4 py-4 max-w-7xl mx-auto">
              
              {/* SEARCH - Mobile */}
              <div className="flex lg:hidden w-full relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>

              {/* NAV LINKS */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}