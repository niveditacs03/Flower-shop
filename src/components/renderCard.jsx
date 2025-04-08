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
    // Bring back original flowers
    setAvailableFlowers(flowersData);
    setCartItems([]);
    localStorage.setItem("availableFlowers", JSON.stringify(flowersData));
  };

  return (
    <div className="bg-purple-50 text-gray-800 font-sans min-h-screen relative overflow-hidden -mt-120">
      <main className="p-8">
        <div className="flex justify-end mb-6">
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition-all font-semibold"
            onClick={resetShop}
          >
           Reset Shop
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

      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-400 transition-all font-semibold"
          onClick={getTotalPrice}
        >
          Checkout 🛍️
        </button>
      </div>
    </div>
  );
};

export default RenderCard;
