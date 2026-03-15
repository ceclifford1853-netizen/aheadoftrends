import { Link } from "wouter";
import { ScarcityCounter } from "./ScarcityCounter";

export function Hero() {
  return (
    <section className="relative bg-slate-950 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Scarcity Counter */}
        <div className="mb-8 flex justify-center">
          <ScarcityCounter totalSlots={20} filledSlots={3} />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">Ahead of Trends: AEO Agency</h1>
        <p className="text-xl mb-8 text-slate-300">Unlock the future of digital presence with Agentic Engine Optimization.</p>
        <Link href="/alpha-rating">
          <a className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-block">Get Your Alpha Rating</a>
        </Link>
      </div>
    </section>
  );
}
