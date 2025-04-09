import React from "react";

const Card = ({ title, price, image, isAdded, toggleItem, handleBuyNow }) => {
  return (
    <div className="w-[300px] h-[400px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col overflow-hidden mr-10 mb-10">
      <div className="w-full h-[250px] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="text-center p-3 text-sm flex-grow">
        <p className="font-semibold">{title}</p>
        <p className="font-bold mb-3">{price}ETH</p>

        <button
          className={`px-4 py-2 text-xs rounded-full transition duration-300 font-semibold mb-2 ${
            isAdded
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-purple-500 text-white hover:bg-purple-600"
          } cursor-pointer`}
          onClick={toggleItem}
        >
          {isAdded ? "✅ Added to Cart" : "Add to Cart"}
        </button>

      </div>
    </div>
  );
};

export default Card;
