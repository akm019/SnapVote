'use client';

import Link from 'next/link';
import { PlusCircle, BarChart2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <BarChart2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-bold text-white tracking-wide">SnapVote</h1>
          </Link>
          
          <Link 
            href="/create-poll" 
            className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-full 
                     shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Create Poll</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;