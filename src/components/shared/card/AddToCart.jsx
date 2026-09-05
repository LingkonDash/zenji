import { ShoppingCart } from 'lucide-react';
import React from 'react';

const AddToCart = ({handleAddToCart, cartPulse}) => {
    return (
        <button
            type="button"
            onClick={handleAddToCart}
            className={`group inline-flex items-center gap-2 px-4 py-2 bg-[#0B0404]/20 border border-white/20 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-none hover:bg-secondary hover:border-secondary transition-all duration-300 cursor-pointer ${
              cartPulse
                ? "!bg-secondary !border-secondary scale-105 shadow-[0_0_12px_rgba(188,1,0,0.6)]"
                : ""
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{cartPulse ? "ADDED!" : "ADD TO CART"}</span>
          </button>
    );
};

export default AddToCart;