'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-500" />
            <Link href="/" className="font-bold text-xl tracking-tight text-white">
              VoltExchange
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors duration-200">
              Marketplace
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-200">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors duration-200">
              Analytics
            </Link>
          </div>

          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </motion.button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
