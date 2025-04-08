import React, { useState, useEffect } from "react";
import Card from "./Card";
import flowersData from "../data";

const RenderCard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [availableFlowers, setAvailableFlowers] = useState([]);

  // Load available flowers from localStorage on initial mount only
  useEffect(() => {
    const storedAvailable = localStorage.getItem("availableFlowers");

    if (storedAvailable) {
      // Use the stored available flowers
      setAvailableFlowers(JSON.parse(storedAvailable));
    } else {
      // Initial setup - store and use the default flowersData
      localStorage.setItem("availableFlowers", JSON.stringify(flowersData));
      setAvailableFlowers(flowersData);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Toggle flower in cart using ID
  const toggleCart = (flower) => {
    setCartItems((prev) =>
      prev.some((item) => item.id === flower.id)
        ? prev.filter((item) => item.id !== flower.id)
        : [...prev, flower]
    );
  };

  // Checkout logic
  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, flower) => sum + flower.price, 0);
    if (total === 0) {
      alert("No flowers added to cart");
      return;
    }

    alert(`Total price: ₹${total}`);

    // Remove purchased flowers from available flowers
    const updatedFlowers = availableFlowers.filter(
      (flower) => !cartItems.some((item) => item.id === flower.id)
    );
    
    // Update state and localStorage with the new available flowers list
    setAvailableFlowers(updatedFlowers);
    localStorage.setItem("availableFlowers", JSON.stringify(updatedFlowers));

    // Clear cart
    setCartItems([]);
  };

  return (
    <div className="bg-purple-50 text-gray-800 font-sans min-h-screen relative overflow-hidden -mt-120">
      <main className="p-8">
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