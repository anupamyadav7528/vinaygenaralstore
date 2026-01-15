import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Admin = () => {
  // 1. State banayein (Empty array [] ke sath taki crash na ho)
  const [products, setProducts] = useState([]);
  
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: 'Grocery',
    image: ''
  });

  // 2. Product List Laane ke liye (GET)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Yaha Render wala sahi link hai
        const res = await axios.get("https://vinaygenaralstore.onrender.com/api/products");
        setProducts(res.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // 3. Input change handle karne ke liye
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // 4. Naya Product Add karne ke liye (POST)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://vinaygenaralstore.onrender.com/api/products", product);
      alert("Product Added!");
      setProduct({ name: '', price: '', category: 'Grocery', image: '' }); // Form saaf karein
      window.location.reload(); // Page refresh karein taki naya saman dikhe
    } catch (error) {
      console.log(error);
      alert("Error adding product");
    }
  };

  // 5. Product Delete karne ke liye (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://vinaygenaralstore.onrender.com/api/products/${id}`);
        alert("Product Deleted!");
        window.location.reload(); // List refresh karein
      } catch (error) {
        console.log(error);
        alert("Error deleting product");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Admin Panel</h1>
        <Link to="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Back to Shop
        </Link>
      </div>

      {/* Product Add Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input 
            type="text" name="name" placeholder="Item Name (e.g., Aata)" 
            value={product.name} onChange={handleChange} 
            className="w-full p-2 border rounded" required 
          />
          <div className="flex gap-4">
            <input 
              type="number" name="price" placeholder="Price (₹)" 
              value={product.price} onChange={handleChange} 
              className="w-full p-2 border rounded" required 
            />
            <select 
              name="category" value={product.category} onChange={handleChange} 
              className="w-full p-2 border rounded"
            >
              <option value="Grocery">Grocery</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Snacks">Snacks</option>
              <option value="Personal Care">Personal Care</option>
            </select>
          </div>
          <input 
            type="text" name="image" placeholder="Image URL (Link)" 
            value={product.image} onChange={handleChange} 
            className="w-full p-2 border rounded" 
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">
            Save Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Store Items ({products?.length})</h2>
        
        {products?.length === 0 ? (
          <p className="text-gray-500 text-center">No items found. Add some products!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products?.map((item) => (
              <div key={item._id} className="flex justify-between items-center border p-3 rounded hover:bg-gray-50">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price} - {item.category}</p>
                </div>
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;