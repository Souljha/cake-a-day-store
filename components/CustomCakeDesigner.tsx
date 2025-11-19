
import React, { useState } from 'react';
import { generateCakeDetails, generateCakeImage } from '../services/geminiService';
import { CustomCakeDetails, OrderItem } from '../types';
import Spinner from './Spinner';

interface CustomCakeDesignerProps {
  onAddToCart: (item: OrderItem) => void;
}

const CustomCakeDesigner: React.FC<CustomCakeDesignerProps> = ({ onAddToCart }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [cakeDetails, setCakeDetails] = useState<CustomCakeDetails | null>(null);

  // Rate limiting configuration
  const DAILY_LIMIT = 5; // Allow 5 generations per day per user
  const RATE_LIMIT_KEY = 'cakeDesignUsage';

  // Check and update rate limit
  const checkRateLimit = (): { allowed: boolean; remainingUses: number } => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    
    if (stored) {
      const usage = JSON.parse(stored);
      
      // Reset if it's a new day
      if (usage.date !== today) {
        const newUsage = { date: today, count: 0 };
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newUsage));
        return { allowed: true, remainingUses: DAILY_LIMIT };
      }
      
      // Check current day usage
      const remainingUses = DAILY_LIMIT - usage.count;
      return { 
        allowed: usage.count < DAILY_LIMIT, 
        remainingUses: Math.max(0, remainingUses) 
      };
    } else {
      // First time user
      const newUsage = { date: today, count: 0 };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newUsage));
      return { allowed: true, remainingUses: DAILY_LIMIT };
    }
  };

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    
    if (stored) {
      const usage = JSON.parse(stored);
      if (usage.date === today) {
        usage.count += 1;
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(usage));
      }
    }
  };

  const getRemainingUses = (): number => {
    const { remainingUses } = checkRateLimit();
    return remainingUses;
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please describe your cake first!');
      return;
    }

    // Check rate limit before proceeding
    const { allowed, remainingUses } = checkRateLimit();
    if (!allowed) {
      setError(`Daily limit reached! You can generate ${DAILY_LIMIT} cakes per day. Try again tomorrow or call us at +27 73 599 9972 for custom orders.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setCakeDetails(null);

    try {
      const [details, imageUrl] = await Promise.all([
        generateCakeDetails(prompt),
        generateCakeImage(prompt),
      ]);
      setCakeDetails(details);
      setGeneratedImage(imageUrl);
      
      // Increment usage count after successful generation
      incrementUsage();
      
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOrderCustomCake = () => {
    if(cakeDetails) {
        onAddToCart({ name: cakeDetails.name, price: cakeDetails.price, quantity: 1 });
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800">Design Your Dream Cake</h2>
          <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Use our AI cake designer to bring your confectionary creations to life. Just describe your ideal cake and watch the magic happen!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-pink-50 p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., a whimsical two-tier vanilla cake with pastel blue frosting, adorned with sugar flowers and a silver unicorn horn..."
              className="w-full h-24 md:h-auto p-4 border-2 border-pink-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors duration-300 resize-none text-base"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !checkRateLimit().allowed}
              className="bg-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-pink-700 transition-all duration-300 hover:scale-105 shadow-md disabled:bg-pink-300 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isLoading ? 'Creating...' : 'Generate'}
            </button>
          </div>
          
          {/* Usage indicator */}
          <div className="mt-4 flex justify-between items-center text-sm">
            <div className="text-gray-600">
              <span className="font-medium">Daily AI generations remaining: </span>
              <span className={`font-bold ${getRemainingUses() <= 1 ? 'text-red-600' : getRemainingUses() <= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                {getRemainingUses()}/{DAILY_LIMIT}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Resets daily at midnight
            </div>
          </div>
          
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>

        {isLoading && (
          <div className="text-center mt-12">
            <Spinner />
            <p className="text-gray-600 mt-4 animate-pulse">Our AI baker is whipping up your creation... this can take a moment.</p>
          </div>
        )}

        {generatedImage && cakeDetails && !isLoading && (
          <div className="mt-12 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="grid md:grid-cols-2">
              <img src={generatedImage} alt={cakeDetails.name} className="w-full h-full object-cover"/>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-4xl font-bold text-gray-800">{cakeDetails.name}</h3>
                <p className="text-gray-600 mt-4 text-lg">{cakeDetails.description}</p>
                <p className="text-5xl font-bold text-pink-600 mt-6">R{cakeDetails.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Estimated Price</p>
                <button onClick={handleOrderCustomCake} className="mt-8 bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-md">
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomCakeDesigner;
