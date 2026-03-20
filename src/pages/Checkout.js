import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Check, Truck, Lock, Package } from 'lucide-react';
import { Navbar } from '../components/navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCart } from '../lib/cart-context';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Check authentication on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setFormData(prev => ({
          ...prev,
          email: currentUser.email || ''
        }));
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [navigate]);

  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Store order details before clearing cart
      const orderDetails = {
        items: items,
        subtotal: totalPrice,
        shipping: shipping,
        tax: tax,
        total: finalTotal,
        formData: formData,
        paymentMethod: paymentMethod
      };

      await addDoc(collection(db, "orders"), {
      items,
      total: finalTotal,
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      createdAt: new Date(),
      status: 'Pending',
      shippingAddress: formData,
      paymentMethod: paymentMethod
});

      setConfirmedOrder(orderDetails);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert('Error placing order. Please try again.');
    }

    setIsProcessing(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>;
  }

  // ✅ Order success screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto py-12 px-4 pt-16">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/10 rounded-full p-4">
                <Check className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Order Confirmed! 🎉</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Thank you for your purchase. Your order has been placed successfully.
            </p>

            {/* Order Summary */}
            <div className="bg-muted rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6 pb-6 border-b border-border/50">
                {confirmedOrder?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-foreground font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{confirmedOrder?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">
                    {confirmedOrder?.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${confirmedOrder?.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="text-foreground">₹{confirmedOrder?.tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="font-bold text-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{confirmedOrder?.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-muted rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-foreground mb-4">Delivery Address</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{confirmedOrder?.formData.firstName} {confirmedOrder?.formData.lastName}</p>
                <p>{confirmedOrder?.formData.address}</p>
                <p>{confirmedOrder?.formData.city}, {confirmedOrder?.formData.state} {confirmedOrder?.formData.zipCode}</p>
                <p>📱 {confirmedOrder?.formData.phone}</p>
                <p>📧 {confirmedOrder?.formData.email}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-muted rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-foreground mb-4">Payment Method</h2>
              <div className="text-sm text-muted-foreground">
                <p className="text-foreground font-medium">
                  {confirmedOrder?.paymentMethod === 'cash-on-delivery' 
                    ? '💵 Cash on Delivery' 
                    : '💳 Credit/Debit Card'}
                </p>
                <p className="text-xs mt-1">
                  {confirmedOrder?.paymentMethod === 'cash-on-delivery' 
                    ? 'Payment will be collected at the time of delivery' 
                    : 'Payment has been processed'}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6 text-center">
              A confirmation email has been sent to <strong>{confirmedOrder?.formData.email}</strong>
            </p>
            <Button 
              className="w-full mb-3"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 pt-16">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Checkout</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{items.length} items</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* LEFT - FORM (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input 
                    id="zipCode"
                    name="zipCode"
                    placeholder="10001"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition"
                     onClick={() => setPaymentMethod('credit-card')}>
                  <input 
                    type="radio" 
                    id="credit-card" 
                    name="payment-method"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer mb-0">
                    <span className="font-medium text-foreground">Credit/Debit Card</span>
                    <p className="text-xs text-muted-foreground">Secure payment with card</p>
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition"
                     onClick={() => setPaymentMethod('cash-on-delivery')}>
                  <input 
                    type="radio" 
                    id="cash-on-delivery" 
                    name="payment-method"
                    value="cash-on-delivery"
                    checked={paymentMethod === 'cash-on-delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="cash-on-delivery" className="flex-1 cursor-pointer mb-0">
                    <span className="font-medium text-foreground">Cash on Delivery</span>
                    <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                  </Label>
                </div>
              </div>
            </div>

            {/* Payment Information - Only show if Credit Card selected */}
            {paymentMethod === 'credit-card' && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Card Details
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input 
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={handleChange}
                    required={paymentMethod === 'credit-card'}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4532 1111 1111 1111"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength="19"
                    required={paymentMethod === 'credit-card'}
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      maxLength="5"
                      required={paymentMethod === 'credit-card'}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength="4"
                      required={paymentMethod === 'credit-card'}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm sticky top-20 h-fit">
              <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} <span className="text-foreground font-medium">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 p-3 bg-primary/5 rounded-lg">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mb-3"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Place Order
                  </>
                )}
              </Button>

              {/* Security Info */}
              <p className="text-xs text-muted-foreground text-center">
                ✓ Secure SSL encrypted payment
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}