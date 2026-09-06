"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getCart, clearCart, onStoreChange } from "@/lib/cartStore";
import CheckoutSection from "@/components/checkout/CheckoutSection";
import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";

const FREE_SHIPPING_THRESHOLD = 100;

function parsePriceNumber(price) {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function formatCurrency(amount) {
  return `A$${amount.toFixed(2)}`;
}

const STATES = [
  { value: "NSW", label: "NSW (New South Wales)" },
  { value: "VIC", label: "VIC (Victoria)" },
  { value: "QLD", label: "QLD (Queensland)" },
  { value: "WA", label: "WA (Western Australia)" },
  { value: "SA", label: "SA (South Australia)" },
  { value: "TAS", label: "TAS (Tasmania)" },
  { value: "ACT", label: "ACT (Australian Capital)" },
  { value: "NT", label: "NT (Northern Territory)" },
];

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1 block font-sans text-xs uppercase tracking-wider text-muted">
      {children} {required && <span className="text-secondary">*</span>}
    </label>
  );
}

const inputClasses =
  "w-full border border-muted/30 bg-white/[0.03] px-4 py-3 font-sans text-sm text-white placeholder-subtle/60 transition-colors focus:border-secondary focus:outline-none";

export default function CheckoutPage() {
  const pageRef = useRef(null);

  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [deliveryData, setDeliveryData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "NSW",
    postcode: "",
    phone: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "NSW",
    postcode: "",
  });

  const syncCart = () => setCartItems(getCart());

  useEffect(() => {
    setMounted(true);
    syncCart();
    return onStoreChange(syncCart);
  }, []);

  // Entrance choreography
  useGSAP(
    () => {
      if (!mounted) return;
      const items = gsap.utils.toArray(".checkout-anim-item");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion || items.length === 0) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }
      );
    },
    { scope: pageRef, dependencies: [mounted] }
  );

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const p = parsePriceNumber(item.price);
      return sum + p * (item.qty || 1);
    }, 0);
  }, [cartItems]);

  const shippingCost = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return shippingMethod === "express" ? 15.0 : 0;
    }
    return shippingMethod === "express" ? 15.0 : 9.99;
  }, [subtotal, shippingMethod]);

  const total = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);

  const isDeliveryValid = useMemo(() => {
    const { email, firstName, lastName, address, city, postcode, phone } = deliveryData;
    return Boolean(
      email.trim() &&
        firstName.trim() &&
        lastName.trim() &&
        address.trim() &&
        city.trim() &&
        postcode.trim() &&
        phone.trim()
    );
  }, [deliveryData]);

  const isBillingValid = useMemo(() => {
    if (sameAsDelivery) return true;
    const { firstName, lastName, address, city, postcode } = billingData;
    return Boolean(
      firstName.trim() && lastName.trim() && address.trim() && city.trim() && postcode.trim()
    );
  }, [sameAsDelivery, billingData]);

  const isPaymentValid = useMemo(() => {
    if (paymentMethod === "card") {
      return Boolean(
        cardData.number.trim() &&
          cardData.expiry.trim() &&
          cardData.cvc.trim() &&
          cardData.name.trim()
      );
    }
    return true;
  }, [paymentMethod, cardData]);

  const isFormValid = isDeliveryValid && isBillingValid && isPaymentValid && cartItems.length > 0;

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderDetails = {
        orderId: `ZNJ-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cartItems],
        total,
        customerName: `${deliveryData.firstName} ${deliveryData.lastName}`,
        email: deliveryData.email,
        date: new Date().toLocaleDateString("en-AU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      setCompletedOrder(orderDetails);
      setIsSubmitting(false);
      clearCart();
    }, 1200);
  };

  if (!mounted) return null;

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-primary px-4 pt-24 pb-16 font-sans text-white selection:bg-secondary selection:text-white md:px-8 lg:px-12"
    >
      {/* Header banner */}
      <div className="checkout-anim-item mx-auto mb-8 max-w-[1400px] border-b border-muted/30 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
              <span className="motion-safe:animate-pulse inline-block h-2 w-2 rounded-full bg-secondary" />
              Secure Checkout // Zenji Protocol
            </div>
            <h1 className="font-anton text-3xl uppercase tracking-tight md:text-5xl">
              Checkout<span className="text-secondary">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 border border-muted/30 bg-white/[0.02] px-4 py-2 font-sans text-xs text-subtle">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <span>256-BIT ENCRYPTED</span>
            <span className="text-muted">|</span>
            <Truck className="h-4 w-4 text-secondary" />
            <span>AUSTRALIA-WIDE DELIVERY</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main form */}
        <div className="space-y-10 lg:col-span-7">
          <form onSubmit={handleProceed} className="space-y-10">
            {/* 01 — DELIVERY */}
            <CheckoutSection index="01" title="Delivery Address" icon={MapPin}>
              <div>
                <FieldLabel required>Email Address</FieldLabel>
                <input
                  type="email"
                  name="email"
                  required
                  value={deliveryData.email}
                  onChange={handleDeliveryChange}
                  placeholder="otaku@zenji.shop"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel required>First Name</FieldLabel>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={deliveryData.firstName}
                    onChange={handleDeliveryChange}
                    placeholder="Kenji"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FieldLabel required>Last Name</FieldLabel>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={deliveryData.lastName}
                    onChange={handleDeliveryChange}
                    placeholder="Saito"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FieldLabel required>Street Address</FieldLabel>
                <input
                  type="text"
                  name="address"
                  required
                  value={deliveryData.address}
                  onChange={handleDeliveryChange}
                  placeholder="123 Anime Way"
                  className={inputClasses}
                />
              </div>

              <div>
                <FieldLabel>Apartment, suite, unit (optional)</FieldLabel>
                <input
                  type="text"
                  name="apartment"
                  value={deliveryData.apartment}
                  onChange={handleDeliveryChange}
                  placeholder="Unit 4B"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <FieldLabel required>City / Suburb</FieldLabel>
                  <input
                    type="text"
                    name="city"
                    required
                    value={deliveryData.city}
                    onChange={handleDeliveryChange}
                    placeholder="Sydney"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FieldLabel required>State</FieldLabel>
                  <select
                    name="state"
                    value={deliveryData.state}
                    onChange={handleDeliveryChange}
                    className={`${inputClasses} appearance-none`}
                  >
                    {STATES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel required>Postcode</FieldLabel>
                  <input
                    type="text"
                    name="postcode"
                    required
                    value={deliveryData.postcode}
                    onChange={handleDeliveryChange}
                    placeholder="2000"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FieldLabel required>Phone Number</FieldLabel>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={deliveryData.phone}
                  onChange={handleDeliveryChange}
                  placeholder="+61 400 000 000"
                  className={inputClasses}
                />
              </div>
            </CheckoutSection>

            {/* 02 — SHIPPING */}
            <CheckoutSection index="02" title="Shipping Method" icon={Truck}>
              <div className="space-y-3">
                {[
                  {
                    id: "standard",
                    label: "Standard Delivery",
                    desc: "3–5 Business Days · Australia-Wide",
                    price: subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : "A$9.99",
                    isFree: subtotal >= FREE_SHIPPING_THRESHOLD,
                  },
                  {
                    id: "express",
                    label: "Express Dispatch",
                    tag: "PRIORITY",
                    desc: "1–2 Business Days · Priority Packing",
                    price: "A$15.00",
                  },
                ].map((opt) => {
                  const selected = shippingMethod === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setShippingMethod(opt.id)}
                      className={`flex cursor-pointer items-center justify-between border p-4 transition-colors ${
                        selected
                          ? "border-secondary bg-secondary/10 text-white"
                          : "border-muted/30 bg-white/[0.02] text-subtle hover:border-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            selected ? "border-secondary bg-secondary" : "border-muted"
                          }`}
                        >
                          {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-sans text-sm font-bold uppercase text-white">
                            {opt.label}
                            {opt.tag && (
                              <span className="bg-secondary px-1.5 py-0.5 font-sans text-[10px] uppercase tracking-wider text-white">
                                {opt.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted">{opt.desc}</div>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          opt.isFree ? "text-secondary" : "text-white"
                        }`}
                      >
                        {opt.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </CheckoutSection>

            {/* 03 — PAYMENT */}
            <CheckoutSection index="03" title="Payment" icon={CreditCard}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { id: "card", label: "Credit Card" },
                  { id: "paypal", label: "PayPal" },
                  { id: "afterpay", label: "Afterpay" },
                  { id: "applepay", label: "Apple Pay" },
                ].map((pm) => {
                  const selected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`border py-3 px-2 text-center font-sans text-xs font-bold uppercase transition-colors ${
                        selected
                          ? "border-secondary bg-secondary/15 text-white"
                          : "border-muted/30 bg-white/[0.02] text-subtle hover:border-muted/60"
                      }`}
                    >
                      {pm.label}
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-4 border border-muted/30 bg-white/[0.02] p-4">
                  <div>
                    <FieldLabel required>Cardholder Name</FieldLabel>
                    <input
                      type="text"
                      name="name"
                      value={cardData.name}
                      onChange={handleCardChange}
                      placeholder="KENJI SAITO"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Card Number</FieldLabel>
                    <div className="relative">
                      <input
                        type="text"
                        name="number"
                        maxLength="19"
                        value={cardData.number}
                        onChange={handleCardChange}
                        placeholder="4532 •••• •••• 8892"
                        className={`${inputClasses} pr-10`}
                      />
                      <Lock className="absolute right-3 top-3.5 h-4 w-4 text-muted" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel required>Expiry Date (MM/YY)</FieldLabel>
                      <input
                        type="text"
                        name="expiry"
                        maxLength="5"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="08/28"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <FieldLabel required>Security CVC</FieldLabel>
                      <input
                        type="text"
                        name="cvc"
                        maxLength="4"
                        value={cardData.cvc}
                        onChange={handleCardChange}
                        placeholder="739"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 border border-muted/30 bg-white/[0.02] p-6 text-center">
                  <p className="font-sans text-sm text-subtle">
                    You will be redirected to complete your payment with{" "}
                    <span className="font-bold uppercase text-secondary">{paymentMethod}</span>{" "}
                    upon clicking Proceed.
                  </p>
                  <p className="font-sans text-xs text-muted">
                    (UI simulation mode active — no actual charge will occur)
                  </p>
                </div>
              )}
            </CheckoutSection>

            {/* 04 — BILLING */}
            <CheckoutSection index="04" title="Billing Address">
              <label className="flex cursor-pointer items-center gap-3 border border-muted/30 bg-white/[0.02] p-3">
                <input
                  type="checkbox"
                  checked={sameAsDelivery}
                  onChange={(e) => setSameAsDelivery(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-secondary"
                />
                <span className="font-sans text-xs uppercase tracking-wider text-subtle">
                  Same as delivery address
                </span>
              </label>

              {!sameAsDelivery && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FieldLabel required>First Name</FieldLabel>
                      <input
                        type="text"
                        name="firstName"
                        value={billingData.firstName}
                        onChange={handleBillingChange}
                        placeholder="First Name"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <FieldLabel required>Last Name</FieldLabel>
                      <input
                        type="text"
                        name="lastName"
                        value={billingData.lastName}
                        onChange={handleBillingChange}
                        placeholder="Last Name"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel required>Billing Street Address</FieldLabel>
                    <input
                      type="text"
                      name="address"
                      value={billingData.address}
                      onChange={handleBillingChange}
                      placeholder="Street Address"
                      className={inputClasses}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <FieldLabel required>City</FieldLabel>
                      <input
                        type="text"
                        name="city"
                        value={billingData.city}
                        onChange={handleBillingChange}
                        placeholder="City"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <FieldLabel required>State</FieldLabel>
                      <select
                        name="state"
                        value={billingData.state}
                        onChange={handleBillingChange}
                        className={`${inputClasses} appearance-none`}
                      >
                        {STATES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel required>Postcode</FieldLabel>
                      <input
                        type="text"
                        name="postcode"
                        value={billingData.postcode}
                        onChange={handleBillingChange}
                        placeholder="Postcode"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CheckoutSection>

            {/* Desktop proceed */}
            <div className="checkout-anim-item hidden lg:block">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`flex w-full items-center justify-center gap-3 border py-5 px-6 font-sans text-sm font-bold uppercase tracking-wider transition-colors ${
                  isFormValid && !isSubmitting
                    ? "border-secondary bg-secondary text-white hover:bg-secondary/85"
                    : "cursor-not-allowed border-muted/30 bg-white/[0.02] text-subtle"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-5 w-5 motion-safe:animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <span>Proceed With Order ({formatCurrency(total)})</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {!isFormValid && (
                <p className="mt-2 text-center font-sans text-xs text-muted">
                  * Please fill all required fields in Delivery, Shipping &amp; Payment sections
                  to activate proceed button.
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Sidebar summary */}
        <div className="lg:col-span-5">
          <div className="checkout-anim-item sticky top-28 border border-muted/30 bg-white/[0.015] p-6">
            <h2 className="mb-4 flex items-center justify-between border-b border-muted/30 pb-4 font-sans text-lg font-bold uppercase tracking-wider">
              <span>Order Manifest</span>
              <span className="font-sans text-xs font-normal text-secondary">
                {cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)} Items
              </span>
            </h2>

            {cartItems.length === 0 ? (
              <div className="space-y-4 py-12 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-muted" />
                <p className="font-sans text-xs uppercase tracking-widest text-subtle">
                  Your cart is empty
                </p>
                <Link
                  href="/collection"
                  className="inline-block border border-secondary px-4 py-2 font-sans text-xs font-bold uppercase text-secondary transition-colors hover:bg-secondary hover:text-white"
                >
                  Explore Drops
                </Link>
              </div>
            ) : (
              <div className="mb-4 max-h-[360px] space-y-4 overflow-y-auto border-b border-muted/30 pb-4 pr-2">
                {cartItems.map((item, idx) => {
                  const itemPrice = parsePriceNumber(item.price);
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex items-center gap-4 border border-muted/20 bg-white/[0.02] p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 border border-muted/30 bg-white/[0.03]">
                        {item.posterImage ? (
                          <Image
                            src={item.posterImage}
                            alt={item.title || "Product image"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-sans text-xs text-muted">
                            IMG
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate font-sans text-xs font-bold uppercase text-white">
                          {item.title}
                        </div>
                        <div className="mt-0.5 font-sans text-[11px] text-muted">
                          QTY: {item.qty || 1}
                          {item.selectedSize ? ` · SIZE: ${item.selectedSize}` : ""}
                        </div>
                        <div className="mt-1 font-sans text-xs font-bold text-secondary">
                          {formatCurrency(itemPrice * (item.qty || 1))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mb-4 space-y-2 border-b border-muted/30 pb-4 font-sans text-xs text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-white">
                  {shippingCost === 0 ? (
                    <span className="text-secondary">FREE</span>
                  ) : (
                    formatCurrency(shippingCost)
                  )}
                </span>
              </div>

              {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="mt-2 border border-muted/30 bg-white/[0.02] p-2 text-[11px] text-muted">
                  Add{" "}
                  <span className="font-bold text-secondary">
                    {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)}
                  </span>{" "}
                  more to qualify for <span className="text-white">FREE Australia-Wide Shipping</span>.
                </div>
              )}
            </div>

            <div className="mb-6 flex items-center justify-between font-sans text-base font-bold uppercase text-white">
              <span className="tracking-widest">Total</span>
              <span className="font-anton text-xl text-secondary">{formatCurrency(total)}</span>
            </div>

            <div className="lg:hidden">
              <button
                type="submit"
                onClick={handleProceed}
                disabled={!isFormValid || isSubmitting}
                className={`flex w-full items-center justify-center gap-2 border py-4 px-4 font-sans text-xs font-bold uppercase tracking-wider transition-colors ${
                  isFormValid && !isSubmitting
                    ? "border-secondary bg-secondary text-white"
                    : "cursor-not-allowed border-muted/30 bg-white/[0.02] text-subtle"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 motion-safe:animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Proceed With Order ({formatCurrency(total)})</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-muted/30 pt-4 font-sans text-[10px] uppercase text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                <span>No Restocks Ever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                <span>Authentic Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}