
// CustomerOrderHistory.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CustomerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, 'orders'), where('phone', '==', currentUser.phoneNumber));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-4">Loading your orders...</div>;
  if (!user) return <div className="text-center p-4 text-red-600">Please log in to view your orders.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Order History</h1>
      <div className="grid grid-cols-1 gap-4">
        {orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-xl p-4 shadow-sm">
              <p className="font-semibold">Service: {order.name}</p>
              <p>Description: {order.description}</p>
              <p>Price: ₹{order.price}</p>
              <p>Status: <span className={order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>{order.status}</span></p>
            </div>
          ))}
        )}
      </div>
    </div>
  );
};

export default CustomerOrderHistory;
