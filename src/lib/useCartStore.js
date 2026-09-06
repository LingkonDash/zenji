"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCartCount,
  getWishlistCount,
  isInWishlist,
  isInCart,
  onStoreChange,
} from "@/lib/cartStore";

/**
 * Re-renders whenever the cart/wishlist localStorage changes.
 * Returns live counts for badges.
 */
export function useStoreCounts() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const sync = useCallback(() => {
    setCartCount(getCartCount());
    setWishlistCount(getWishlistCount());
  }, []);

  useEffect(() => {
    // initial read
    sync();
    // listen to mutations from any component
    return onStoreChange(sync);
  }, [sync]);

  return { cartCount, wishlistCount };
}

/**
 * Track whether a specific product is wishlisted, updating in real time.
 */
export function useIsWishlisted(productId) {
  const [wishlisted, setWishlisted] = useState(false);

  const sync = useCallback(() => {
    setWishlisted(isInWishlist(productId));
  }, [productId]);

  useEffect(() => {
    sync();
    return onStoreChange(sync);
  }, [sync]);

  return wishlisted;
}


/**
 * Track whether a specific product is in the cart, updating in real time.
 */
export function useIsInCart(productId) {
  const [inCart, setInCart] = useState(false);

  const sync = useCallback(() => {
    setInCart(isInCart(productId));
  }, [productId]);

  useEffect(() => {
    sync();
    return onStoreChange(sync);
  }, [sync]);

  return inCart;
}

/**
 * Hook to manage Cart Drawer visibility and live cart data state.
 */
export function useCartDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("cart-drawer-open", handleOpen);
    window.addEventListener("cart-drawer-close", handleClose);

    return () => {
      window.removeEventListener("cart-drawer-open", handleOpen);
      window.removeEventListener("cart-drawer-close", handleClose);
    };
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}

