import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle } from '../api';

export default function Navbar() {
  const { token, logout } = useAuth();
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/community', label: 'Community' },
    ...(token
      ? [
          { to: '/history', label: 'History' },
          { to: '/stats', label: 'Dashboard' },
        ]
      : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-line bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-mono text-[17px] font-bold tracking-tight select-none">
          <span className="text-neutral-100">Fix</span>
          <span className="text-violet-500">ify</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm transition-colors duration-150 ${
                pathname === to
                  ? 'text-neutral-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        {token ? (
          <button
            onClick={logout}
            className="text-sm text-zinc-500 hover:text-neutral-100 border border-line hover:border-zinc-700 px-3.5 py-1.5 rounded-md transition-all duration-150"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="text-sm text-violet-400 border border-violet-600/40 hover:bg-violet-600 hover:text-white hover:border-violet-600 px-4 py-1.5 rounded-md transition-all duration-150"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
