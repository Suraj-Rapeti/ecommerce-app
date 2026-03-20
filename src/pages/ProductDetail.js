import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Heart, ArrowLeft} from 'lucide-react';
import { Navbar } from '../components/navbar';
import { ProductCard } from '../components/product-card';
import { Button } from '../components/ui/button';
import { useCart } from '../lib/cart-context';
import { getProductById, getProducts } from '../lib/products';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Fetch product + all products
  useEffect(() => {
    getProductById(id).then(setProduct);
    getProducts().then(setAllProducts);
  }, [id]);

  // Loading state
  if (!product) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  // Related products (from Firebase now)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    // Add to cart and go to checkout
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-16">

        {/* Back */}
        <nav className="mb-8">
          <Link to="/products" className="flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </nav>

        {/* Product */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* Image */}
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg"
          />

          {/* Info */}
          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>

            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span>{product.rating}</span>
            </div>

            <p className="text-xl font-bold mt-4">₹{product.price}</p>

            <p className="mt-4 text-muted-foreground">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mt-6 bg-muted rounded-lg p-3 w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 hover:bg-background rounded transition"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="px-4 font-semibold text-foreground min-w-[2rem] text-center">{quantity}</span>

              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 hover:bg-background rounded transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={handleAddToCart}
                variant="outline"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart ({quantity})
              </Button>

              <Button 
                onClick={handleBuyNow}
                className="flex-1"
              >
                Buy Now
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
              </Button>
            </div>

          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}