import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import Workflow from "../components/Landing/Workflow";
import Features from "../components/Landing/Features";
import Stats from "../components/Landing/Stats";
import Pricing from "../components/Landing/Pricing";
import Cta from "../components/Landing/Cta";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Features />
        <Workflow />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;