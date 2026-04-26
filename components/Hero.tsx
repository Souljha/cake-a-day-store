
import React from 'react';

interface HeroProps {
    onCTAClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCTAClick }) => {
    return (
        <section className="relative bg-gradient-to-br from-pink-50 to-rose-50 text-gray-800 py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('/picnic_bg.jpg')"}}></div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Handcrafted <span className="text-pink-600">Cakes</span> & Sweet Treats
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
                    Freshly baked cakes and treats made with love, delivered to your doorstep in Durban.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={onCTAClick} className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-all duration-300 hover:scale-105 shadow-lg">
                        Design Your Dream Cake
                    </button>
                    <a href="#menu" className="bg-white text-pink-600 border-2 border-pink-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all duration-300 hover:scale-105 shadow-lg">
                        View Our Menu
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
