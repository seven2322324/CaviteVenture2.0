import { Hero } from "@/components/landingpage/Hero";
import { LogoTicker } from "@/components/landingpage/LogoTicker";
import BookView from "@/components/landingpage/BookView"
import { ProductShowcase } from "@/components/landingpage/ProductShowcase";
import Exhibitpro from "@/components/landingpage/Exhibitpro";
import ParticleRing from "@/components/landingpage/ParticleRing";
import { Testimonials } from "@/components/landingpage/Testimmonials";
import CallToAction from "@/components/landingpage/CallToAction";

export default function Home() {
  return (
    <>
     <Hero/>  
     <LogoTicker/>
     <BookView/>
     <ProductShowcase/>
     <Exhibitpro/>
     <ParticleRing/>
     <Testimonials/>
     <CallToAction/>
    </>
  );
}