// app/components/Navbar.jsx
'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/">
          <h1 className="text-xl font-bold">Poll App</h1>
        </Link>
        <Link href="/create-poll" className="bg-blue-800 px-3 py-1 rounded">
          Create Poll
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;