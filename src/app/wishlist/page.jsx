'use client'

import WishlistGallery from '@/components/wishlist/WishlistGallery';
import WishlistHeader from '@/components/wishlist/WishlistHeader';
import React from 'react';

const WishlistPage = () => {
    return (
        <main>
            <WishlistHeader />
            <WishlistGallery />
        </main>
    );
};

export default WishlistPage;