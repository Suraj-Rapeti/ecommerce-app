import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { db, auth } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navbar } from "../components/navbar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const STATUS_COLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

export default function MyOrders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Check login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // 📦 Fetch user's orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(data);
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p className="p-10">Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 pt-16">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded">

                <div className="flex justify-between mb-2">
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <div className="flex gap-2 items-center">
                    <Badge className={`${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status || 'Pending'}
                    </Badge>
                    <p>
                      {order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleString()
                        : ""}
                    </p>
                  </div>
                </div>

                <p className="mb-2">Total: ₹{order.total}</p>

                <div className="text-sm text-gray-600">
                  {order.items?.map((item, i) => (
                    <p key={i}>
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

        <Link to="/products">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </main>
    </div>
  );
}