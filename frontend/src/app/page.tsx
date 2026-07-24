import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Decentralized Energy <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            Trading Platform
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12">
          Buy and sell renewable energy directly from producers. Powered by blockchain technology for secure, transparent, and instant settlements without middlemen.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/marketplace" className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
            Explore Marketplace <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all flex items-center justify-center">
            Producer Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 mt-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Direct P2P Trading</h3>
            <p className="text-gray-400">Trade energy directly with neighbors and local producers at competitive market rates.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Contract Escrow</h3>
            <p className="text-gray-400">100% secure automated settlements backed by audited OpenZeppelin smart contracts.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Green Certificates</h3>
            <p className="text-gray-400">NFT-based certification for verifiable renewable energy production sources.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
