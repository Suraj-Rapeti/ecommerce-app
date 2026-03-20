import { SlidersHorizontal, Grid, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { ProductCard } from '../components/product-card';
import { Button } from '../components/ui/button';
import { getProducts } from '../lib/products';

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const categories = [
    "All",
    "Electronics",
    "Accessories",
    "Bags",
    "Clothing",
    "Home",
    "Footwear",
    "Stationery"
  ];

  const filteredProducts = products.filter(
    (product) => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const searchMatch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    }
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-16">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {searchQuery 
              ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
              : `Browse our collection of ${products.length} products`
            }
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Sidebar */}
          <aside className="w-full lg:w-64">
            <div className="border rounded-lg p-6">
              
              <div className="mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold">Filters</h2>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium">Category</h3>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded mb-1 transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-input bg-background text-foreground px-2 py-2 rounded transition-colors hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">

            {/* Top Controls */}
            <div className="flex justify-between items-center mb-6">
              <p>Showing {sortedProducts.length} products</p>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid />
                </Button>

                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                >
                  <List />
                </Button>
              </div>
            </div>

            {/* Grid */}
            {sortedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p>No products found</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('All');
                    navigate('/products');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}