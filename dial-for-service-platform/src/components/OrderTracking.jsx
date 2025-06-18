
// OrderTracking.jsx
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, 'orders'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, { status });
    setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  if (loading) return <div className="text-center p-4">Loading orders...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Order Tracking & Management</h1>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-xl p-4 shadow-md">
            <p className="font-semibold">Service: {order.name}</p>
            <p>Description: {order.description}</p>
            <p>Price: ₹{order.price}</p>
            <p>Status: <span className={order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>{order.status}</span></p>
            <div className="mt-2 flex gap-2">
              {order.status !== 'completed' && (
                <Button onClick={() => updateOrderStatus(order.id, 'completed')} className="bg-green-600 text-white">Mark Complete</Button>
              )}
              <Button onClick={() => updateOrderStatus(order.id, 'pending')} className="bg-yellow-500 text-white">Set Pending</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
