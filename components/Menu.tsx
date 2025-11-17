
import React, { useState, useMemo } from 'react';
import { MenuCategory as MenuCategoryType, MenuItem as MenuItemType, OrderItem } from '../types';
import { MENU_DATA } from '../constants';

interface PricingOption {
    label: string;
    price: string;
}

interface SidebarCategory {
    name: string;
    items?: PricingOption[];
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
    {
        name: "Cakes",
        items: [
            { label: "6\"", price: "R250" },
            { label: "7\"", price: "R350" },
            { label: "8\"", price: "R450" },
            { label: "9\"", price: "R550" },
            { label: "10\"", price: "R650" },
            { label: "12\"", price: "R850" },
            { label: "14\"", price: "R950" },
            { label: "Square", price: "R450" },
            { label: "Heart (S)", price: "R350" },
            { label: "Heart (L)", price: "R450" },
            { label: "Flower", price: "R350" },
            { label: "Alphabet/Number", price: "R300ea" },
            { label: "Birthday Box", price: "R350" },
            { label: "Smash Box Cake", price: "R300" },
        ]
    },
    {
        name: "Extras",
        items: [
            { label: "Edible Print (A4)", price: "R100" },
            { label: "Fondant Topper", price: "R100ea" },
            { label: "Macarons", price: "R15ea" },
            { label: "Meringue Pops", price: "R30(6)" },
            { label: "Burn Away", price: "R100" },
            { label: "Personalised Cake Topper", price: "R60" },
        ]
    },
    {
        name: "Cupcakes",
        items: [
            { label: "vanilla/choc", price: "R90/doz" },
            { label: "caramel", price: "R90/doz" },
            { label: "banana", price: "R90/doz" },
            { label: "lemon poppy", price: "R90/doz" },
            { label: "red velvet", price: "R90/doz" },
            { label: "malvas", price: "R90/doz" },
            { label: "giant cupcakes", price: "R120/doz" },
            { label: "mini cupcakes", price: "R60/doz" },
        ]
    },
    {
        name: "Sweeties",
        items: [
            { label: "custard pastry", price: "R120(12)" },
            { label: "*eclairs", price: "R120(12)" },
            { label: "*homies", price: "R120(12)" },
            { label: "apple pastry", price: "R90(12)" },
            { label: "date rolls", price: "R60(12)" },
            { label: "brownies", price: "R90(12)" },
        ]
    },
    {
        name: "Specials",
        items: [
            { label: "sticky toffee pudding", price: "R180" },
            { label: "medovik", price: "R250" },
            { label: "baklava", price: "R360(12)" },
            { label: "fruit cake", price: "R350" },
            { label: "syrup koesisters", price: "R120(12)" },
        ]
    },
    {
        name: "Loaves",
        items: [
            { label: "lamingtons", price: "R120(9)" },
            { label: "banana/carrot loaf", price: "R45" },
            { label: "madeira loaf", price: "R45" },
            { label: "lemon/orange loaf", price: "R45" },
            { label: "scones (plain)", price: "R60(12)" },
            { label: "scones (raisins)", price: "R72(12)" },
        ]
    },
    {
        name: "Cakesickles",
        items: [
            { label: "Ice-Cream Pops", price: "R20each" },
            { label: "cake pops", price: "R120(12)" },
            { label: "coconut squares", price: "R120(12)" },
            { label: "peppermint squares", price: "R120(12)" },
        ]
    },
    {
        name: "Sweet Treats",
        items: [
            { label: "meringues", price: "R60(12)" },
            { label: "donuts/churros", price: "R90(12)" },
            { label: "biscuits", price: "R150(Tub)" },
            { label: "pancakes/crumpets", price: "R48(12)" },
            { label: "cremora tart", price: "R90(doz)" },
        ]
    },
    {
        name: "Tarts",
        items: [
            { label: "Milk Tart (minis doz)", price: "R120" },
            { label: "Milk Tart (med/large)", price: "R60" },
            { label: "Caramel Tart (minis doz)", price: "R120" },
            { label: "Caramel Tart (med/large)", price: "R60" },
            { label: "Cheese Tart (minis doz)", price: "R120" },
            { label: "Cheese Tart (med/large)", price: "R60" },
            { label: "Custard Tart (minis doz)", price: "R120" },
            { label: "Custard Tart (med/large)", price: "R60" },
            { label: "Lemon Meringue (minis doz)", price: "R120" },
            { label: "Lemon Meringue (med/large)", price: "R60" },
            { label: "Cheese Cake (minis doz)", price: "R150" },
            { label: "Cheese Cake (med/large)", price: "R90" },
            { label: "*Fridge Tart (minis doz)", price: "R120" },
            { label: "*Fridge Tart (med/large)", price: "R60" },
        ]
    },
    {
        name: "Pies",
        items: [
            { label: "Banana Cream Pie (minis doz)", price: "R90" },
            { label: "Banana Cream Pie (med/large)", price: "R45" },
            { label: "Mince Pie (minis doz)", price: "R90" },
            { label: "Mince Pie (med/large)", price: "R45" },
            { label: "Apple Crumble Pie (minis doz)", price: "R90" },
            { label: "Apple Crumble Pie (med/large)", price: "R45" },
            { label: "Pumpkin Pie (minis doz)", price: "R90" },
            { label: "Pumpkin Pie (med/large)", price: "R45" },
            { label: "Malva Pudding (minis doz)", price: "R90" },
            { label: "Malva Pudding (med/large)", price: "R45" },
        ]
    },
    {
        name: "Cupcake compotes",
        items: [
            { label: "chocolate (per doz)", price: "R120" },
            { label: "chocolate (double doz)", price: "R220" },
            { label: "strawberry (per doz)", price: "R120" },
            { label: "strawberry (double doz)", price: "R220" },
            { label: "vanilla (per doz)", price: "R120" },
            { label: "vanilla (double doz)", price: "R220" },
            { label: "banana (per doz)", price: "R120" },
            { label: "banana (double doz)", price: "R220" },
            { label: "apple (per doz)", price: "R120" },
            { label: "apple (double doz)", price: "R220" },
        ]
    },
    {
        name: "Packaging",
        items: [
            { label: "Cupcake of 12", price: "R15" },
            { label: "Cupcake of 24", price: "R30" },
            { label: "Std Cake Box", price: "R30" },
            { label: "Tall Cake", price: "R60" },
            { label: "Bento Box", price: "R30" },
            { label: "Treats Box", price: "R20" },
            { label: "Cake Pop Stand of 12", price: "R24" },
            { label: "Cake Pop Stand of 24", price: "R48" },
        ]
    },
    {
        name: "Transport",
        items: [
            { label: "Flat Rate", price: "R150" },
        ]
    },
];

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: OrderItem) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
            <h4 className="text-xl font-semibold text-gray-800">{item.name}</h4>
            <p className="text-pink-600 font-bold mt-1 text-lg">{item.price}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => handleQuantityChange(-1)} 
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                >
                    -
                </button>
                <span className="font-semibold text-lg w-8 text-center" aria-live="polite">{quantity}</span>
                <button 
                    onClick={() => handleQuantityChange(1)} 
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full font-bold hover:bg-gray-300 transition-colors"
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>
            <button onClick={() => onAddToCart({ name: item.name, price: item.price, quantity })} className="bg-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition-colors duration-300">
                Add
            </button>
        </div>
      </div>
    </div>
  );
};

interface MenuCategoryProps {
  category: MenuCategoryType;
  onAddToCart: (item: OrderItem) => void;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ category, onAddToCart }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Cakes");
  const isSignatureCakes = category.title === "Signature Cakes";

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName);
  };

  if (isSignatureCakes) {
    return (
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Latest Creations Sidebar */}
          <div className="lg:w-64">
            <h3 className="text-4xl font-bold text-gray-800 mb-8">Latest Creations</h3>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-2">
                {SIDEBAR_CATEGORIES.map((sidebarCategory) => (
                  <div key={sidebarCategory.name} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => toggleCategory(sidebarCategory.name)}
                      className="w-full flex items-center justify-between py-3 text-left hover:text-pink-600 transition-colors"
                    >
                      <span className="font-semibold text-gray-800">{sidebarCategory.name}</span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedCategory === sidebarCategory.name ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {expandedCategory === sidebarCategory.name && sidebarCategory.items && (
                      <div className="pl-4 pb-3 space-y-2">
                        {sidebarCategory.items.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => onAddToCart({
                              name: `${sidebarCategory.name} - ${item.label}`,
                              price: item.price,
                              quantity: 1
                            })}
                            className="w-full flex justify-between text-sm py-1 px-2 rounded hover:bg-pink-50 transition-colors duration-200 cursor-pointer group"
                            title="Click to add to cart"
                          >
                            <span className="text-gray-700 group-hover:text-pink-600">{item.label}:</span>
                            <span className="text-pink-600 font-semibold group-hover:text-pink-700">{item.price}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signature Cakes Grid */}
          <div className="flex-1">
            <h3 className="text-4xl font-bold text-gray-800 mb-8">{category.title}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item) => (
                <MenuItem key={item.name} item={item} onAddToCart={onAddToCart} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layout for other categories
  return (
    <div className="mb-12">
      <h3 className="text-4xl font-bold text-gray-800 mb-8 text-center">{category.title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.items.map((item) => (
          <MenuItem key={item.name} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

interface MenuProps {
  onAddToCart: (item: OrderItem) => void;
}

const Menu: React.FC<MenuProps> = ({ onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) {
      return MENU_DATA;
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    return MENU_DATA
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.name.toLowerCase().includes(lowercasedQuery)
        ),
      }))
      .filter(category => category.items.length > 0);
  }, [searchQuery]);

  const totalItemsFound = filteredMenu.reduce((count, category) => count + category.items.length, 0);

  return (
    <section className="py-20 bg-pink-50">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-8">Our Menu</h2>
        
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cakes, tarts, cupcakes..."
              className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-full focus:ring-pink-500 focus:border-pink-500 transition-colors duration-300 text-lg shadow-sm"
              aria-label="Search menu items"
            />
          </div>
        </div>

        {totalItemsFound > 0 ? (
          filteredMenu.map((category) => (
            <MenuCategory key={category.title} category={category} onAddToCart={onAddToCart} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-gray-700">No Treats Found</h3>
            <p className="text-gray-500 mt-2">We couldn't find anything matching "{searchQuery}". Try a different search!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
