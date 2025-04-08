import React, { useState, useEffect } from "react";
import Card from "./Card";
import flowersData from "../data";

const RenderCard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [availableFlowers, setAvailableFlowers] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const storedAvailable = localStorage.getItem("availableFlowers");
    if (storedAvailable) {
      setAvailableFlowers(JSON.parse(storedAvailable));
    } else {
      localStorage.setItem("availableFlowers", JSON.stringify(flowersData));
      setAvailableFlowers(flowersData);
    }
  }, []);

  const toggleCart = (flower) => {
    setCartItems((prev) =>
      prev.some((item) => item.id === flower.id)
        ? prev.filter((item) => item.id !== flower.id)
        : [...prev, flower]
    );
  };

  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, flower) => sum + flower.price, 0);
    if (total === 0) {
      alert("No flowers added to cart");
      return;
    }

    alert(`Total price: ₹${total.toFixed(2)}`);

    const updatedFlowers = availableFlowers.filter(
      (flower) => !cartItems.some((item) => item.id === flower.id)
    );

    setAvailableFlowers(updatedFlowers);
    localStorage.setItem("availableFlowers", JSON.stringify(updatedFlowers));
    setCartItems([]);
  };

  const resetShop = () => {
    setAvailableFlowers(flowersData);
    setCartItems([]);
    localStorage.setItem("availableFlowers", JSON.stringify(flowersData));
  };

  return (
    <div className="bg-purple-50 text-gray-800 font-sans min-h-screen relative overflow-hidden -mt-120">
      <main className="p-8">
        {/* Top-right Reset Button */}
        <div className="flex justify-end items-center mb-10 -mt-5">
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-700 transition-all font-semibold"
            onClick={resetShop}
          >
            Reset Shop
          </button>
        </div>

        {/* 💫 Floating Show Cart Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-all font-semibold"
            onClick={() => setShowCart((prev) => !prev)}
          >
            {showCart ? "Hide Cart ❌" : "Show Cart 🛒"}
          </button>
        </div>

        <div className="flex flex-wrap justify-center">
          {availableFlowers.map((flower) => (
            <Card
              key={flower.id}
              {...flower}
              isAdded={cartItems.some((item) => item.id === flower.id)}
              toggleItem={() => toggleCart(flower)}
              handleBuyNow={() =>
                alert(`Buying "${flower.title}" for ₹${flower.price} 💐💸`)
              }
            />
          ))}
        </div>
      </main>

      {/* 🛒 Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setShowCart(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4 border-b pb-2">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">No flowers in cart</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-4 border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover mr-3"
                />
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600">₹{item.price}</p>
                </div>
              </div>
            ))}

            {/* 💸 Total and Checkout */}
            <div className="mt-6 border-t pt-4">
              <p className="font-semibold text-base mb-4">
                Total: ₹
                {cartItems
                  .reduce((sum, flower) => sum + flower.price, 0)
                  .toFixed(2)}
              </p>
              <button
                className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-800 transition-all font-semibold"
                onClick={getTotalPrice}
              >
                Checkout Now 💐
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RenderCard;
