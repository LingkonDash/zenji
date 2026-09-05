"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Heart, Trash2, X } from "lucide-react";

const WishlistHeart = ({ wishlisted, handleToggleWishlist }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      setShowConfirmModal(true);
    } else {
      handleToggleWishlist(e);
    }
  };

  const handleConfirmRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(false);
    handleToggleWishlist(e);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(false);
  };

  return (
    <div className="absolute top-4 right-4 z-40 group/tooltip">
      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleClick}
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

      {/* Remove Confirmation Modal */}
      {showConfirmModal &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={handleCancel}
          >
            <div
              className="relative w-full max-w-sm border border-red-900/60 bg-[#0B0404] p-6 shadow-[0_0_50px_rgba(188,1,0,0.2)] text-left rounded-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-500">
                  <Trash2 size={18} />
                </div>
                <h4 className="font-anton text-lg uppercase tracking-wider text-white">
                  REMOVE ITEM?
                </h4>
              </div>

              <p className="font-sans text-xs text-zinc-400 mb-6 leading-relaxed">
                Are you sure you want to remove this item from your loadout?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white/70 hover:border-white/40 hover:text-white transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  className="bg-[#BC0100] hover:bg-rose-700 border border-rose-500 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer"
                >
                  REMOVE
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default WishlistHeart;