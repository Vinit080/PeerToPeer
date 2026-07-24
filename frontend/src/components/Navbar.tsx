'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, Zap } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';

const Navbar = () => {
  const { address, connectWallet, disconnectWallet, isConnecting } = useWeb3();

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
            {address ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/5 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button 
                  onClick={disconnectWallet}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <motion.button
                onClick={connectWallet}
                disabled={isConnecting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 ${isConnecting ? 'bg-blue-600/50' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30`}
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </motion.button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
