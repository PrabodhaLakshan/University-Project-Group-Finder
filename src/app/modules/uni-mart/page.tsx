"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Plus,
  MessageCircle,
  ShoppingCart,
  User,
  Search,
  TrendingUp,
  DollarSign,
  Heart,
  Settings,
  ShoppingBag,
  Receipt,
  Bell,
} from "lucide-react";

export default function UniMartHome() {
  const router = useRouter();

  const actionCards = [
    {
      title: "Browse Products",
      description: "Explore items posted by students",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      href: "/modules/uni-mart/products",
    },
    {
      title: "Post an Item",
      description: "Sell your unused items easily",
      icon: Plus,
      color: "from-green-500 to-green-600",
      href: "/modules/uni-mart/new",
    },
    {
      title: "My Purchases",
      description: "View your order history",
      icon: ShoppingBag,
      color: "from-indigo-500 to-indigo-600",
      href: "/modules/uni-mart/purchase-history",
    },
    {
      title: "My Sales",
      description: "Track your sales and revenue",
      icon: Receipt,
      color: "from-teal-500 to-teal-600",
      href: "/modules/uni-mart/orders/seller",
    },
    {
      title: "Messages",
      description: "Chat with buyers and sellers",
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
      href: "/modules/uni-mart/messages",
    },
    {
      title: "My Items",
      description: "Manage your posted products",
      icon: ShoppingCart,
      color: "from-orange-500 to-orange-600",
      href: "/modules/uni-mart/my-items",
    },
    {
      title: "Sales History",
      description: "View items you've sold",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      href: "/modules/uni-mart/sales-history",
    },
    {
      title: "Notifications",
      description: "View your notifications",
      icon: Bell,
      color: "from-cyan-500 to-cyan-600",
      href: "/modules/uni-mart/notifications",
    },
    {
      title: "My Profile",
      description: "View and edit your profile",
      icon: User,
      color: "from-pink-500 to-pink-600",
      href: "/modules/uni-mart/profile",
    },
  ];

  const stats = [
    { label: "Active Items", value: "10K+", icon: Package },
    { label: "Happy Traders", value: "5K+", icon: TrendingUp },
    { label: "Deals Done", value: "15K+", icon: DollarSign },
    { label: "Avg Rating", value: "4.8", icon: Heart },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
          <ShoppingCart className="text-white" size={40} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to Campus eMart
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Buy and sell items with your campus community. Safe, fast, and easy trading platform for students.
        </p>
      </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className="text-blue-500 mb-2" size={24} />
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Action Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {actionCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={() => router.push(card.href)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 overflow-hidden hover:scale-105"
              >
                <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                <div className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${card.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Quick Search Card */}
          <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 overflow-hidden hover:scale-105">
            <div className="p-8 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Quick Search
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Find what you need instantly
                </p>
              </div>
              <button
                onClick={() => router.push("/modules/uni-mart/products")}
                className="mt-6 w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Search Now
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Campus eMart?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <ShoppingCart className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Safe Trading
              </h3>
              <p className="text-gray-600">
                Trade with verified students from your campus community
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <DollarSign className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Get great deals on textbooks, electronics, and more
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <MessageCircle className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Communication
              </h3>
              <p className="text-gray-600">
                Chat directly with sellers and buyers in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Ready to start trading?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/modules/uni-mart/products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse Products
            </button>
            <button
              onClick={() => router.push("/modules/uni-mart/new")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg border-2 border-blue-600"
            >
              Post an Item
            </button>
          </div>
        </div>
    </div>
  );
}
