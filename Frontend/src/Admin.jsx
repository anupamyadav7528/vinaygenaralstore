import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Admin = () => {
  // --- 1. LOGIN STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  // --- 2. DASHBOARD STATES ---
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: 'Grocery',
    image: ''
  });

  // --- 3. LOGIN FUNCTION ---
  const handleLogin = () => {
    // Yaha apna Password set karein (Akhilesh123 ya Vinay123)
    if (password === "Akhilesh123") { 
      setIsLoggedIn(true);
    } else {
      alert("Wrong Password! Sirf Akhilesh Bhai allowed hain.");
    }
  };

  // --- 4. DATA FETCHING (GET) ---
  useEffect(() => {
    if (isLoggedIn) { // Sirf login hone ke baad hi data layein
      const fetchProducts = async () => {
        try {
          const res = await axios.get("https://vinaygenaralstore.onrender.com/api/products");
          setProducts(res.data);
        } catch (error) {
          console.log("Error fetching products:", error);
        }
      };
      fetchProducts();
    }
  }, [isLoggedIn]);

  // --- 5. HANDLERS (Add/Delete) ---
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://vinaygenaralstore.onrender.com/api/products", product);
      alert("Product Added!");
      setProduct({ name: '', price: '', category: 'Grocery', image: '' });
      window.location.reload();
    } catch (error) {
      alert("Error adding product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete kar dein?")) {
      try {
        await axios.delete(`https://vinaygenaralstore.onrender.com/api/products/${id}`);
        alert("Product Deleted!");
        window.location.reload();
      } catch (error) {
        alert("Error deleting product");
      }
    }
  };

  // --- 6. RENDER LOGIC ---
  
  // Agar Login nahi hai, to Login Form dikhao
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Admin Login</h2>
          <p className="mb-4 text-gray-600">Sirf Akhilesh Bhai ke liye</p>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />
          <button 
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            Login
          </button>
          <div className="mt-4">
            <Link to="/" className="text-blue-500 underline">Back to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  // Agar Login hai, to Dashboard dikhao
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Admin Panel (Akhilesh)</h1>
        <button onClick={() => setIsLoggedIn(false)} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Product Add Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input type="text" name="name" placeholder="Item Name" value={product.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          <div className="flex gap-4">
            <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} className="w-full p-2 border rounded" required />
            <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="Grocery">Grocery</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Snacks">Snacks</option>
              <option value="Personal Care">Personal Care</option>
            </select>
          </div>
          <input type="text" name="image" placeholder="Image URL" value={product.image} onChange={handleChange} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold">Save Product</button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Total Items: {products?.length}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products?.map((item) => (
            <div key={item._id} className="flex justify-between items-center border p-3 rounded">
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm">₹{item.price}</p>
              </div>
              <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;