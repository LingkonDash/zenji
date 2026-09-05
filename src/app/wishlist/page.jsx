import React from 'react';

const WishlistPage = () => {
    return (
        <div>
            Wishlist

            prompt: 
            ok now two things we need to implement the cart system and the wishlist. for both i will use the localstorage. and lets do one by one. ( for now just the system setup the cart/wishlist ui will be created in next ) so i have two cards. OriginDrop and ProductCard in the src/components/shared/card/ first the current Claim text will converted to add to cart and there will be a love icon at corner so somewhere with perfect ui that syncs with the card ui. to add to wishlist. now the clicking on the button will store the data object into the localstorage as wishlist and cart. depending on the button pressed. now it also need to show in the ui. the navbar accepts &lt;Navbar cartCount={2} wishlistCount={3} /&gt; from the main layout and main layout cant be makeable to client side. so instead of accepting as parameter the navbar will directly collect it from the local storage and show in the ui. for this collection and update the local storage. there will be a dedicated function in the lib folder like getWishlist getCart putCart etc. in the whole system these function be used as main source of truth to edit the localstorage. so for now add that wishlist button in the ui of the card and do the navbar update. while doing it do not touch the current ui and ui structure. just apply the cart data logic. and the wishlist button should be dynamic like if the product is already in the wishlist it should show added or if you use heat icon then it should be filled icon and if not then empty heart with a clean abbr showing on hover.

        </div>
    );
};

export default WishlistPage;