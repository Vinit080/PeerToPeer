'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Activity, Globe, Zap } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Network Analytics</h1>
          <p className="text-gray-400">Global insights into decentralized energy trading and network capacity.</p>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Volume Traded</CardTitle>
              <Globe className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142.5 ETH</div>
              <p className="text-xs text-green-400 mt-1">+12% this week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Producers</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,204</div>
              <p className="text-xs text-gray-500 mt-1">Across 42 regions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Energy Supplied</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4 GWh</div>
              <p className="text-xs text-green-400 mt-1">100% Renewable</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Price</CardTitle>
              <LineChart className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.00085 ETH/kWh</div>
              <p className="text-xs text-red-400 mt-1">-2.4% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md min-h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle>Trading Volume (30 Days)</CardTitle>
              <CardDescription className="text-gray-400">Daily smart contract settlement volume in ETH.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center border-t border-white/5 mt-4">
              <p className="text-gray-500 flex items-center gap-2">
                <LineChart className="w-5 h-5" /> Chart rendering initializing...
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-md min-h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle>Energy Distribution</CardTitle>
              <CardDescription className="text-gray-400">Breakdown of traded energy by renewable source.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center border-t border-white/5 mt-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-32 bg-yellow-400/80 rounded-t-sm"></div>
                  <span className="text-xs text-gray-400 mt-2">Solar</span>
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="w-4 h-24 bg-blue-400/80 rounded-t-sm"></div>
                  <span className="text-xs text-gray-400 mt-2">Wind</span>
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="w-4 h-12 bg-blue-600/80 rounded-t-sm"></div>
                  <span className="text-xs text-gray-400 mt-2">Hydro</span>
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="w-4 h-8 bg-green-500/80 rounded-t-sm"></div>
                  <span className="text-xs text-gray-400 mt-2">Biomass</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
