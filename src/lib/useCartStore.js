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
