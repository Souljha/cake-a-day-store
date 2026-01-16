import React, { useState } from 'react';

const ValentineBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="valentine-banner text-white py-2 px-4 relative">
            <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
                <span className="animate-pulse">&#10084;</span>
                <span className="font-semibold">Valentine's Specials!</span>
                <span className="hidden sm:inline">&#8226;</span>
                <span className="hidden sm:inline">Up to 30% off on selected treats</span>
                <span className="animate-pulse">&#10084;</span>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
                aria-label="Close banner"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default ValentineBanner;
