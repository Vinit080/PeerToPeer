'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BatteryCharging, Zap, DollarSign, Activity } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';
// We'll import these after deployment generates them
import EnergyMarketplaceABI from '../abi/EnergyMarketplace.json';
import ContractAddresses from '../abi/contract-addresses.json';

export default function ProducerDashboard() {
  const { address, signer, connectWallet, isConnecting } = useWeb3();
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [listAmount, setListAmount] = React.useState('');
  const [listPrice, setListPrice] = React.useState('');

  const handleDeploy = async () => {
    if (!address || !signer) {
      await connectWallet();
      return;
    }
    
    if (!listAmount || !listPrice) {
      alert("Please enter amount and price.");
      return;
    }

    try {
      setIsDeploying(true);
      
      const marketplace = new ethers.Contract(
        ContractAddresses.EnergyMarketplace,
        EnergyMarketplaceABI,
        signer
      );

      // Call smart contract (amount, price)
      const tx = await marketplace.listEnergy(
        ethers.parseUnits(listAmount, 18), 
        ethers.parseEther(listPrice)
      );
      
      await tx.wait(); // Wait for confirmation
      
      // Sync with backend API
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energySource: 'Solar Array (Dashboard)',
          capacity: parseFloat(listAmount),
          pricePerUnit: parseFloat(listPrice),
          txHash: tx.hash
        })
      });

      alert('Energy listed successfully on the blockchain!');
    } catch (e: any) {
      console.error(e);
      alert('Transaction failed: ' + (e.message || e));
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Producer Dashboard</h1>
          <p className="text-gray-400">Manage your energy production, view analytics, and control marketplace listings.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Capacity</CardTitle>
              <Zap className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,500 kWh</div>
              <p className="text-xs text-green-400 mt-1">+15% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Listings</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-gray-500 mt-1">2.4k kWh available</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.25 ETH</div>
              <p className="text-xs text-green-400 mt-1">≈ $8,450.00</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Battery Status</CardTitle>
              <BatteryCharging className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-gray-500 mt-1">Charging (Solar Array 1)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Listings Table */}
          <Card className="col-span-2 bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Your Active Listings</CardTitle>
              <CardDescription className="text-gray-400">Manage energy currently listed on the P2P exchange.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-400">Source</TableHead>
                    <TableHead className="text-gray-400">Amount (kWh)</TableHead>
                    <TableHead className="text-gray-400">Price (ETH/unit)</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-gray-200">Solar Array A</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>0.001</TableCell>
                    <TableCell><Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge></TableCell>
                  </TableRow>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-gray-200">Wind Turbine 2</TableCell>
                    <TableCell>1200</TableCell>
                    <TableCell>0.0008</TableCell>
                    <TableCell><Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge></TableCell>
                  </TableRow>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-gray-200">Community Solar</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0.0012</TableCell>
                    <TableCell><Badge variant="outline" className="text-gray-400 border-gray-600">Sold Out</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* New Listing Form */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>List Energy</CardTitle>
              <CardDescription className="text-gray-400">Create a new smart contract escrow listing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-gray-300">Energy Source Certificate</Label>
                  <Input id="source" placeholder="e.g. Solar Array B" className="bg-black/50 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">Amount (kWh)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="1000" 
                    value={listAmount}
                    onChange={(e) => setListAmount(e.target.value)}
                    className="bg-black/50 border-white/10 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">Price per unit (ETH)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.0001" 
                    placeholder="0.001" 
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="bg-black/50 border-white/10 text-white" 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleDeploy}
                  disabled={isDeploying || isConnecting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 disabled:bg-blue-600/50"
                >
                  {isDeploying ? 'Deploying...' : (address ? 'Deploy to Blockchain' : 'Connect Wallet to Deploy')}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
