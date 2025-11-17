import React, { useState } from 'react';
import { OrderItem } from '../types';

interface PricingOption {
    label: string;
    price: string;
}

interface SidebarCategory {
    name: string;
    items?: PricingOption[];
}

interface LatestCreationsProps {
    onAddToCart: (item: OrderItem) => void;
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
    {
        name: "Cakes",
        items: [
            { label: "6", price: "R250" },
            { label: "7", price: "R350" },
            { label: "8", price: "R450" },
            { label: "9", price: "R550" },
            { label: "10", price: "R650" },
            { label: "Square", price: "R450" },
            { label: "Heart (S)", price: "R350" },
            { label: "Heart (L)", price: "R450" },
        ]
    },
    { name: "Extras" },
    { name: "Cupcakes" },
    { name: "Sweeties" },
    { name: "Specials" },
    { name: "Loaves" },
    { name: "Tarts" },
    { name: "Pies" },
    { name: "Cupcake compotes" },
    { name: "Packaging" },
    { name: "Transport" },
];

const FEATURED_CAKES = [
    { name: "Elegant Rose Cake", price: "R500", imageUrl: "/Latest_01.jpg" },
    { name: "Chocolate Drip Cake", price: "R450", imageUrl: "/Latest_02.jpg" },
    { name: "Floral Dream Cake", price: "R550", imageUrl: "/Latest_03.jpg" },
    { name: "Premium Birthday Cake", price: "R480", imageUrl: "/Latest_04.jpg" },
    { name: "Luxury Celebration Cake", price: "R600", imageUrl: "/Latest_05.jpg" },
];

const LatestCreations: React.FC<LatestCreationsProps> = ({ onAddToCart }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>("Cakes");
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const toggleCategory = (categoryName: string) => {
        setExpandedCategory(prev => prev === categoryName ? null : categoryName);
    };

    const handleQuantityChange = (cakeName: string, amount: number) => {
        setQuantities(prev => ({
            ...prev,
            [cakeName]: Math.max(1, (prev[cakeName] || 1) + amount)
        }));
    };

    const getQuantity = (cakeName: string) => quantities[cakeName] || 1;

    return (
        <section className="py-20 bg-pink-50">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-bold text-center text-gray-800 mb-12">Latest Creations</h2>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 bg-white rounded-xl shadow-lg p-6 h-fit">
                        <div className="space-y-2">
                            {SIDEBAR_CATEGORIES.map((category) => (
                                <div key={category.name} className="border-b border-gray-200 last:border-b-0">
                                    <button
                                        onClick={() => toggleCategory(category.name)}
                                        className="w-full flex items-center justify-between py-3 text-left hover:text-pink-600 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-800">{category.name}</span>
                                        <svg
                                            className={`w-5 h-5 transition-transform duration-200 ${
                                                expandedCategory === category.name ? 'rotate-90' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {expandedCategory === category.name && category.items && (
                                        <div className="pl-4 pb-3 space-y-2">
                                            {category.items.map((item) => (
                                                <div key={item.label} className="flex justify-between text-sm py-1">
                                                    <span className="text-gray-700">{item.label}:</span>
                                                    <span className="text-pink-600 font-semibold">{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="flex-1">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {FEATURED_CAKES.map((cake) => (
                                <div
                                    key={cake.name}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden"
                                >
                                    <img src={cake.imageUrl} alt={cake.name} className="w-full h-48 object-cover" />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex-grow">
                                            <h4 className="text-xl font-semibold text-gray-800">{cake.name}</h4>
                                            <p className="text-pink-600 font-bold mt-1 text-lg">{cake.price}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityChange(cake.name, -1)}
                                                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label="Decrease quantity"
                                                    disabled={getQuantity(cake.name) <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="font-semibold text-lg w-8 text-center" aria-live="polite">
                                                    {getQuantity(cake.name)}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(cake.name, 1)}
                                                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    onAddToCart({
                                                        name: cake.name,
                                                        price: cake.price,
                                                        quantity: getQuantity(cake.name)
                                                    })
                                                }
                                                className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700 transition-colors duration-300"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestCreations;
