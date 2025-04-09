import React from "react";
import ConnectWallet from "./connectWallet";

const Dashboard = () => {
  return (
    <div className="bg-purple-50 text-gray-800 font-sans min-h-screen relative overflow-hidden">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-400 text-white p-4 flex justify-between items-center shadow-xl h-20">
        <h1
          className="text-7xl font-bold ml-10 mt-8"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          My Flower Shop
        </h1>
       
        <ul className="flex space-x-6 text-md font-bold mr-10">
          {["Home", "About Us", "Cart", "Contact"].map((item, index) => (
            <li
              key={index}
              className="relative cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
      <ConnectWallet/>
      <main className="p-15 -mt-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Your Flowers",
              desc: "View and manage your collection.",
            },
            {
              title: "Orders",
              desc: "Track your recent orders and sales.",
            },
            {
              title: "Messages",
              desc: "Check your customer inquiries.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
