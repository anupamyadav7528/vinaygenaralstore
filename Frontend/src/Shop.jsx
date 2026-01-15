import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Search, Menu, X, Trash2, Truck, Star, Zap } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHomeDelivery, setIsHomeDelivery] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. डेटा लाना
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://vinaygenaralstore.onrender.com");
        setProducts(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, []);

  // 2. कार्ट लॉजिक
  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const itemsTotal = cart.reduce((acc, item) => acc + item.price, 0);
  const deliveryCharge = isHomeDelivery ? 5 : 0;
  const finalTotal = itemsTotal + deliveryCharge;

  // 3. WHATSAPP ORDER (अपना नंबर यहाँ बदलें)
  const placeOrder = () => {
    if (cart.length === 0) return alert("Cart khali hai!");
    let message = `*🔥 New Order from Website!*%0A%0A`;
    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.name} - ₹${item.price}%0A`;
    });
    message += `%0A--------------------%0A`;
    message += `🚚 Delivery: ${isHomeDelivery ? "Home Delivery (+₹5)" : "Self Pickup"}%0A`;
    message += `💰 *Total Pay: ₹${finalTotal}*`;

    // 👇 यहाँ अपना नंबर लिखें (91 जरूर लगाएं)
    window.open(`https://wa.me/916388443178?text=${message}`, "_blank");
  };

  // सर्च फिल्टर
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-green-100">
      
      {/* --- MODERN NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-200">
                    <Zap size={20} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Akhilesh</h1>
                    <span className="text-xs text-green-600 font-bold tracking-widest uppercase">Kirana Store</span>
                </div>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3 border focus-within:border-green-500 focus-within:bg-white transition-all">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search atta, dal, rice..." 
                  className="bg-transparent border-none outline-none w-full ml-2 text-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button 
                onClick={() => setIsCartOpen(true)} 
                className="group relative bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 transition shadow-xl shadow-gray-200 active:scale-95">
                <ShoppingCart size={18} />
                <span className="font-bold text-sm">Bag</span>
                {cart.length > 0 && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {cart.length}
                    </span>
                )}
            </button>
        </div>
      </nav>

      {/* --- HERO SECTION (Banner) --- */}
      <div className="container mx-auto p-4 mt-4">
        <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-green-200 relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                    🚀 Super Fast Delivery
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-4 leading-tight">
                    Ghar ka Rashan, <br/> <span className="text-green-200">Ab Online!</span>
                </h1>
                <p className="text-green-100 mb-6">Order karein aur payein 30 min mein delivery.</p>
                <button className="bg-white text-green-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                    Shop Now
                </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 right-20 w-40 h-40 bg-green-400/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="container mx-auto p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Star size={20} className="text-yellow-500" fill="currentColor"/> Popular Items
            </h2>
        </div>
        
        {products.length === 0 ? (
           <div className="text-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
               <p className="text-gray-400">Loading fresh items...</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                  <div key={product._id} className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                      
                      {/* Image Area */}
                      <div className="h-40 flex items-center justify-center mb-4 bg-gray-50 rounded-xl relative overflow-hidden">
                          <img src={product.image} alt={product.name} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-gray-500">
                              {product.category}
                          </div>
                      </div>

                      {/* Content */}
                      <div>
                          <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-green-700 transition">{product.name}</h3>
                          <div className="flex justify-between items-end mt-3">
                              <div>
                                  <p className="text-xs text-gray-400 line-through">₹{product.price + 5}</p>
                                  <p className="text-lg font-black text-gray-900">₹{product.price}</p>
                              </div>
                              <button 
                                  onClick={() => addToCart(product)}
                                  className="bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-200 transition active:scale-95">
                                  ADD +
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        )}
      </div>

      {/* --- ULTRA MODERN CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-white">
              <div>
                  <h2 className="text-xl font-bold text-gray-900">My Cart</h2>
                  <p className="text-xs text-gray-500">{cart.length} items added</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <ShoppingCart size={48} className="mb-4 text-gray-300"/>
                        <p>Your cart is empty</p>
                        <button onClick={() => setIsCartOpen(false)} className="mt-4 text-green-600 font-bold text-sm">Start Shopping</button>
                    </div>
                ) : (
                    cart.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center bg-white p-2 rounded-xl border border-gray-100 hover:shadow-md transition">
                        <div className="h-16 w-16 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                            <img src={item.image} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                            <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                    ))
                )}
            </div>

            {/* Footer Bill */}
            <div className="p-6 bg-gray-50 border-t rounded-t-3xl">
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 mb-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Truck size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Home Delivery</p>
                            <p className="text-[10px] text-gray-500">₹5 extra charge</p>
                        </div>
                    </div>
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-green-600 cursor-pointer"
                        checked={isHomeDelivery} 
                        onChange={() => setIsHomeDelivery(!isHomeDelivery)} 
                    />
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Item Total</span>
                        <span>₹{itemsTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Delivery</span>
                        <span className={isHomeDelivery ? "text-red-500" : "text-green-500"}>
                            {isHomeDelivery ? "+₹5" : "FREE"}
                        </span>
                    </div>
                    <div className="border-t border-dashed border-gray-300 my-2"></div>
                    <div className="flex justify-between text-xl font-black text-gray-900">
                        <span>Grand Total</span>
                        <span>₹{finalTotal}</span>
                    </div>
                </div>

                <button 
                    onClick={placeOrder} 
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-200 transition transform active:scale-95 flex items-center justify-center gap-2">
                    <span>Order via WhatsApp</span>
                    <Zap size={20} fill="currentColor" />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}