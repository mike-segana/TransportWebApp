import Hero from "../components/landing/Hero";
import Navbar from "../components/landing/Navbar";
import QuoteEstimator from "../components/landing/QuoteEstimator";
import Services from "../components/landing/Services";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#EEF4FA]">
      <Navbar />

      <Hero />

      <div id="quote">
        <QuoteEstimator />
      </div>

      <Services />
    </main>
  );
}