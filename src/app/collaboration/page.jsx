import Link from "next/link";

export const metadata = {
  title: "Contact — ZENJI",
  description: "Get in touch with ZENJI. Reach out to support@zenji.shop for order inquiries, sizing questions, or brand collaboration opportunities.",
};

const CollaborationPage = () => {
  return (
    <main className="min-h-screen bg-primary text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-secondary selection:text-white">
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl">
        {/* Main Title */}
        <h1 className="font-anton text-6xl md:text-8xl tracking-wide uppercase leading-none select-none">
          COMING SOON
        </h1>

        {/* Subtitle / Status */}
        <p className="text-secondary text-xs sm:text-sm tracking-[0.25em] font-mono uppercase">
          THIS SECTOR IS RESTRICTED
        </p>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            href="/"
            className="inline-block border border-white/80 text-white font-mono text-xs sm:text-sm px-6 py-2.5 tracking-wider uppercase transition-all duration-200 hover:bg-secondary active:scale-95"
          >
            RETURN_TO_BASE
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CollaborationPage;