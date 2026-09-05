import { Heart } from 'lucide-react';
import React from 'react';

const WishlistHeart = ({ wishlisted, handleToggleWishlist }) => {
    return (
        <div className="absolute top-4 right-4 z-40 group/tooltip">
            <button
                type="button"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={handleToggleWishlist}
                className={`p-2.5 border transition-all duration-300 cursor-pointer backdrop-blur-md ${
                    wishlisted
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-500 shadow-sm"
                        : "bg-black/30 border-white/15 text-white/70 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10"
                }`}
            >
                <Heart
                    className="w-4 h-4 transition-transform duration-300 active:scale-90"
                    strokeWidth={2}
                    fill={wishlisted ? "currentColor" : "none"}
                />
            </button>

            {/* Aesthetic Tooltip - Positioned Below */}
            <div className="absolute right-0 top-full mt-2 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 -translate-y-1 group-hover/tooltip:translate-y-0 whitespace-nowrap z-50">
                <span className="font-mono text-[10px] tracking-wider uppercase bg-zinc-950/90 text-zinc-200 border border-zinc-800 px-2 py-1 shadow-xl block backdrop-blur-md">
                    {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </span>
            </div>
        </div>
    );
};

export default WishlistHeart;