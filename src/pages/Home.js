import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/navbar';
import { ProductCard } from '../components/product-card';
import { useEffect, useState } from "react";
import { getProducts } from "../lib/products";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const featuredProducts = products.slice(0, 4);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-muted">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,120,120,0.1),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                New Collection Available
              </span>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Discover Premium Products for Modern Living
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                Curated selection of high-quality products designed to elevate your everyday experience.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-y border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Truck className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">On orders over ₹1000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Shield className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <RefreshCw className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Featured Products
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Handpicked favorites from our collection
                </p>
              </div>
              <Button variant="ghost" className="gap-2" onClick={() => navigate('/products')}>
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-primary-foreground sm:text-3xl">
              Join Our Newsletter
            </h2>
            <p className="mx-auto mb-8 max-w-md text-primary-foreground/80">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Shop</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">Best Sellers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">FAQs</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Shipping</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 ShopFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
