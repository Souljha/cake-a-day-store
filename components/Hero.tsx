
import React from 'react';

interface HeroProps {
    onCTAClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCTAClick }) => {
    return (
        <section className="relative valentine-bg text-gray-800 py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('/picnic_bg.jpg')"}}></div>

            {/* Valentine decorative hearts */}
            <div className="absolute top-10 left-10 text-red-300 text-4xl opacity-30 animate-pulse">&#10084;</div>
            <div className="absolute top-20 right-20 text-pink-300 text-3xl opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}>&#10084;</div>
            <div className="absolute bottom-20 left-1/4 text-red-200 text-2xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}>&#10084;</div>
            <div className="absolute bottom-10 right-1/4 text-pink-200 text-3xl opacity-30 animate-pulse" style={{animationDelay: '1.5s'}}>&#10084;</div>

            <div className="container mx-auto px-6 text-center relative z-10">
                {/* Valentine badge */}
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
                    <span>&#10084;</span>
                    <span>Valentine's Season</span>
                    <span>&#10084;</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    <span className="text-red-600">Sweet</span> Treats for Your <span className="text-red-600">Sweetheart</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
                    Celebrate love with our Valentine's specials! Freshly baked cakes and treats delivered to your doorstep in Durban.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={onCTAClick} className="valentine-cta bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg">
                        Design Your Dream Cake
                    </button>
                    <a href="#menu" className="bg-white text-red-600 border-2 border-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-lg">
                        View Specials
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
