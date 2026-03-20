import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { db, auth } from "../lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";
import { Badge } from "../components/ui/badge";

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

const ADMIN_EMAIL = "suraj.rapeti06@gmail.com"  ; // 🔥 change this

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔐 Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // 📦 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderSnap = await getDocs(collection(db, "orders"));
        const userSnap = await getDocs(collection(db, "users"));

        const orderData = orderSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const userData = userSnap.docs.map(doc => doc.data());

        setOrders(orderData);
        setUsers(userData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ⛔ Loading
  if (loading) return <p className="p-10">Loading...</p>;

  // ⛔ Not logged in
  if (!user) return <Navigate to="/login" />;

  // ⛔ Not admin
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p>You are not admin</p>
        <Link to="/">
          <Button className="mt-4">Go Home</Button>
        </Link>
      </div>
    );
  }

  // 🔄 UPDATE ORDER STATUS
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // 📊 CALCULATIONS

  // Total revenue
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Total orders
  const totalOrders = orders.length;

  // Total users
  const totalUsers = users.length;

  // Monthly revenue
  const monthlyMap = {};

  orders.forEach((order) => {
    if (!order.createdAt) return;

    const date = order.createdAt.toDate();
    const month = date.toLocaleString("default", { month: "short" });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, revenue: 0, orders: 0 };
    }

    monthlyMap[month].revenue += order.total || 0;
    monthlyMap[month].orders += 1;
  });

  const revenueData = Object.values(monthlyMap);

  // Recent orders
  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-background pt-16">

      {/* HEADER */}
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft /> Back
            </Button>
          </Link>
          <h1 className="font-bold text-lg">Admin Dashboard</h1>
        </div>

        <ThemeToggle />
      </header>

      {/* STATS */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">

        <Card>
          <CardContent className="p-6">
            <p>Total Revenue</p>
            <h2 className="text-2xl font-bold">
              ₹{totalRevenue.toFixed(2)}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Total Orders</p>
            <h2 className="text-2xl font-bold">{totalOrders}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p>Total Users</p>
            <h2 className="text-2xl font-bold">{totalUsers}</h2>
          </CardContent>
        </Card>

      </main>

      {/* MONTHLY REVENUE */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>

        {revenueData.length === 0 ? (
          <p>No data yet</p>
        ) : (
          <div className="space-y-2">
            {revenueData.map((item, i) => (
              <div key={i} className="border p-3 rounded">
                <p>{item.month}</p>
                <p>Revenue: ₹{item.revenue.toFixed(2)}</p>
                <p>Orders: {item.orders}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <div key={order.id} className="border p-4 rounded bg-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p><strong>Order:</strong> {order.id}</p>
                    <p>Customer: {order.userEmail}</p>
                    <p>Total: ₹{order.total}</p>
                  </div>
                  <Badge className={`${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status || 'Pending'}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-semibold mb-2">Update Status:</p>
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={order.status === status ? "default" : "outline"}
                        onClick={() => updateOrderStatus(order.id, status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Items: {order.items?.length}</p>
                  <p>Date: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}