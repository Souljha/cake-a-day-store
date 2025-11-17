
import React from 'react';

interface HeroProps {
    onCTAClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCTAClick }) => {
    return (
        <section className="relative bg-pink-50 text-gray-800 py-20 md:py-32">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('/picnic_bg.jpg')"}}></div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Your Daily Dose of Delicious.</h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600">Freshly baked cakes and treats delivered to your doorstep in Durban. Or, bring your dream cake to life with our AI designer.</p>
                <button onClick={onCTAClick} className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-transform duration-300 hover:scale-105 shadow-lg">
                    Design Your Dream Cake
                </button>
            </div>
        </section>
    );
};

export default Hero;
