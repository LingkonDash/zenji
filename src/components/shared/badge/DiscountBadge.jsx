import { Sparkles } from "lucide-react";
import { getDiscountPercent } from "@/lib/product/formatters";

/**
 * Reusable DiscountBadge component.
 *
 * @param {Object} props
 * @param {string|number} [props.price]         - Current price (e.g. "A$33.99" or 33.99)
 * @param {string|number} [props.originalPrice]  - Original price before discount
 * @param {number} [props.discount]              - Explicit discount percentage (if already calculated)
 * @param {string} [props.variant="badge"]       - "badge" for card corner pills or "stamp" for large gallery stamp
 * @param {string} [props.className=""]          - Additional custom classes
 */
export default function DiscountBadge({
  price,
  originalPrice,
  discount: explicitDiscount,
  variant = "badge",
  className = "",
}) {
  let discountPercent = 0;

  if (typeof explicitDiscount === "number" && !isNaN(explicitDiscount)) {
    discountPercent = explicitDiscount;
  } else if (price && originalPrice) {
    discountPercent = getDiscountPercent(price, originalPrice);
  }

  if (discountPercent <= 0) return null;

  if (variant === "stamp") {
    return (
      <div className={`flex h-16 w-16 flex-col items-center justify-center border-2 border-secondary bg-primary/90 text-center leading-none text-secondary sm:h-20 sm:w-20 ${className}`}>
        <div className="flex items-center gap-0.5">
          <Sparkles className="w-3 h-3 text-secondary fill-secondary animate-pulse" />
          <span className="font-anton text-xl sm:text-2xl">-{discountPercent}%</span>
        </div>
        <span className="font-sans text-[8px] tracking-[0.15em] text-secondary/80 sm:text-[9px]">
          LIMITED
        </span>
      </div>
    );
  }

  // Default "badge" variant — clean, sleek anime-styled pill tag with star/sparkle icon
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-white text-[10px] font-mono font-bold tracking-widest uppercase rounded-none shadow-md ${className}`}
    >
      -{discountPercent}% OFF
      <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
    </span>
  );
}

