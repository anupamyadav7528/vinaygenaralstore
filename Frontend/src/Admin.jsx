import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Save, Lock, LogIn, Trash2 } from 'lucide-react';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]); // लिस्ट दिखाने के लिए
  
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: 'Grocery',
    image: ''
  });

  // प्रोडक्ट्स लाना
  const fetchProducts = async () => {
    const res = axios.get("https://akhilesh-kirana-store.onrender.com/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    if(isLoggedIn) fetchProducts();
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "@akhilesh1947") {
      setIsLoggedIn(true);
    } else {
      alert("❌ Galat Password!");
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://akhilesh-kirana-store.onrender.com/api/products", product);
      alert(" Product Added!");
      setProduct({ name: '', price: '', category: 'Grocery', image: '' });
      fetchProducts(); // लिस्ट अपडेट करो
    } catch (error) {
      alert(" Error!");
    }
  };

  // डिलीट फंक्शन 🗑️
  const handleDelete = async (id) => {
    if(confirm("Pakka delete karna hai?")) {
        try {
            await axios.delete(`// ✅ Sahi Code:
axios.get("https://akhilesh-kirana-store.onrender.com/api/products")/${id}`);
            fetchProducts(); // लिस्ट अपडेट करो
        } catch (error) { 
            alert("Delete nahi hua!");
        }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
                <input type="password" placeholder="Password: Vinay123" className="w-full p-3 border rounded-lg text-center" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="w-full bg-black text-white py-3 rounded-lg font-bold">Login</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 flex flex-col items-center">
      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Plus/> Add Item</h2>
            <button onClick={() => setIsLoggedIn(false)} className="text-red-500 text-sm font-bold">Logout</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" value={product.name} placeholder="Product Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <div className="flex gap-2">
            <input type="number" name="price" value={product.price} placeholder="Price" className="w-full p-2 border rounded" onChange={handleChange} required />
            <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded">
                 <option>Grocery</option><option>Snacks</option><option>Oil</option><option>Personal Care</option>
            </select>
          </div>
          <input type="text" name="image" value={product.image} placeholder="Image URL" className="w-full p-2 border rounded" onChange={handleChange} required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold flex justify-center gap-2"><Save size={18} /> Save</button>
        </form>
      </div>

      {/* PRODUCT LIST (DELETE SECTION) */}
      <div className="w-full max-w-2xl">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Dukan ka Saman ({products?.length})</h3>
          <div className="grid gap-3">
              {products?.map((p) => (
                  <div key={p._id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center border border-gray-200">
                      <div className="flex items-center gap-3">
                          <img src={p.image} className="h-10 w-10 object-contain rounded" />
                          <div>
                              <p className="font-bold text-gray-800">{p.name}</p>
                              <p className="text-xs text-green-600 font-bold">₹{p.price} | {p.category}</p>
                          </div>
                      </div>
                      <button onClick={() => handleDelete(p._id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition">
                          <Trash2 size={18} />
                      </button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}