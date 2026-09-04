import { getProducts } from "@/lib/getProducts";
import AwakeningSection from "@/components/drop/AwakeningSection";
import CountdownSection from "@/components/drop/CountdownSection";
import WaitlistSection from "@/components/drop/WaitlistSection";
import OriginDropSection from "@/components/drop/OriginDropSection";

export const metadata = {
  title: "Awakening Drop — ZENJI Anime Streetwear",
  description:
    "Join the waitlist for the Awakening Drop. Exclusive early access and limited edition Japanese-inspired anime streetwear.",
};

const DROP_DATE_CONFIG = {
  targetDate: "2026-10-01T00:00:00+06:00",
  formattedDate: "01 October 2026",
  formattedShort: "01 oct 2026",
  location: "Australia",
};

const DropPage = async () => {
  const products = await getProducts();

  return (
    <main>
      <AwakeningSection dropConfig={DROP_DATE_CONFIG} />
      <CountdownSection dropConfig={DROP_DATE_CONFIG} />
      <OriginDropSection products={products.slice(3, 7)} />
      <WaitlistSection />
    </main>
  );
};

export default DropPage;