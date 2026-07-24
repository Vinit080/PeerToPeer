'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Zap, ShieldCheck } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';
import EnergyMarketplaceABI from '../../abi/EnergyMarketplace.json';
import ContractAddresses from '../../abi/contract-addresses.json';

interface Listing {
  id: string;
  blockchainId: number;
  sellerId: string;
  energySource: string;
  capacity: number;
  pricePerUnit: number;
}

export default function Marketplace() {
  const { address, signer, connectWallet } = useWeb3();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/marketplace')
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(console.error);
  }, []);

  const handlePurchase = async (listing: Listing) => {
    if (!address || !signer) {
      await connectWallet();
      return;
    }

    try {
      setIsPurchasing(listing.id);
      const marketplace = new ethers.Contract(
        ContractAddresses.EnergyMarketplace,
        EnergyMarketplaceABI,
        signer
      );

      // Buy all capacity for simplicity, or hardcoded 1 unit. Let's do 1 unit for now.
      const amountToBuy = ethers.parseUnits("1", 18);
      const totalCost = ethers.parseEther(listing.pricePerUnit.toString());

      const tx = await marketplace.buyEnergy(listing.blockchainId, amountToBuy, {
        value: totalCost
      });

      await tx.wait();

      alert("Purchase successful! It will be synced shortly.");
      // Remove from UI
      setListings(listings.filter(l => l.id !== listing.id));
    } catch (e: any) {
      console.error(e);
      alert("Purchase failed: " + (e.message || e));
    } finally {
      setIsPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Energy Marketplace</h1>
            <p className="text-gray-400">Purchase renewable energy directly from verified producers globally.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by location, source..." 
              className="w-full pl-10 bg-white/5 border-white/10 text-white focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 flex gap-1 items-center">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </Badge>
                  <span className="text-sm font-mono text-gray-500">{listing.sellerId.slice(0,6)}...</span>
                </div>
                <CardTitle className="text-xl">{listing.energySource}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-gray-400 mt-1">
                  <MapPin className="w-3 h-3" /> Global Node
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="flex justify-between items-center py-3 border-y border-white/10">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Available</span>
                    <span className="text-lg font-semibold flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-400" /> {listing.capacity} kWh
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm text-gray-400">Price per unit</span>
                    <span className="text-lg font-semibold text-green-400">{listing.pricePerUnit} ETH</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <button 
                  onClick={() => handlePurchase(listing)}
                  disabled={isPurchasing === listing.id}
                  className="w-full bg-blue-600/90 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20 disabled:bg-gray-600"
                >
                  {isPurchasing === listing.id ? 'Processing...' : 'Purchase 1 kWh'}
                </button>
              </CardFooter>
            </Card>
          ))}
          
          {listings.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No active energy listings available right now. 
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
