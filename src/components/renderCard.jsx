import React, { useState, useEffect } from "react";
import Card from "./Card";
import flowersData from "../data";

const RenderCard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [availableFlowers, setAvailableFlowers] = useState(flowersData);

  // Load cart & available flowers from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    const storedAvailable = localStorage.getItem("availableFlowers");

    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedAvailable) {
      setAvailableFlowers(JSON.parse(storedAvailable));
    } else {
      // If no localStorage, store initial flowers
      localStorage.setItem("availableFlowers", JSON.stringify(flowersData));
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync available flowers to localStorage
  useEffect(() => {
    localStorage.setItem("availableFlowers", JSON.stringify(availableFlowers));
  }, [availableFlowers]);

  const toggleCart = (flower) => {
    setCartItems((prev) =>
      prev.includes(flower)
        ? prev.filter((item) => item !== flower)
        : [...prev, flower]
    );
  };

  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, flower) => sum + flower.price, 0);
    if (total === 0) {
      alert("No flowers added to cart");
      return;
    }

    alert(`Total price: ₹${total}`);

    // Remove cart items from available flowers
    const updatedFlowers = availableFlowers.filter(
      (flower) => !cartItems.includes(flower)
    );
    setAvailableFlowers(updatedFlowers);
    localStorage.setItem("availableFlowers", JSON.stringify(updatedFlowers));

    // Clear cart
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <div className="bg-purple-50 text-gray-800 font-sans min-h-screen relative overflow-hidden -mt-120">
      <main className="p-8">
        <div className="flex flex-wrap justify-center">
          {availableFlowers.map((flower, idx) => (
            <Card
              key={idx}
              {...flower}
              isAdded={cartItems.includes(flower)}
              toggleItem={() => toggleCart(flower)}
              handleBuyNow={() =>
                alert(`Buying "${flower.title}" for ₹${flower.price} 💐💸`)
              }
            />
          ))}
        </div>
      </main>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-200 hover:text-purple-700 transition-all font-semibold"
          onClick={getTotalPrice}
        >
          Checkout 🛍️
        </button>
      </div>
    </div>
  );
};

export default RenderCard;
