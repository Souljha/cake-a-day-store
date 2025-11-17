
import React from 'react';

interface HeroProps {
    onCTAClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCTAClick }) => {
    return (
        <section className="relative bg-pink-50 text-gray-800 py-20 md:py-32">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('/picnic_bg.jpg')"}}></div>

            {/* Christmas Banner */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 via-green-600 to-red-600 py-2 z-20">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-white font-bold text-sm md:text-base flex items-center justify-center gap-2">
                        <span className="text-xl">🎄</span>
                        <span className="animate-pulse">Season's Greetings! Order Your Christmas Cakes Now!</span>
                        <span className="text-xl">🎅</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 text-center relative z-10 mt-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Your Daily Dose of Delicious.
                    <span className="block text-3xl md:text-4xl text-red-600 mt-2">🎄 Merry Christmas! 🎄</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600">Freshly baked cakes and treats delivered to your doorstep in Durban. Or, bring your dream cake to life with our AI designer.</p>
                <button onClick={onCTAClick} className="bg-gradient-to-r from-red-600 to-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-red-700 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg">
                    Design Your Dream Christmas Cake 🎄
                </button>
            </div>
        </section>
    );
};

export default Hero;
