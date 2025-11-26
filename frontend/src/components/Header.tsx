import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  keywords?: string;
  setKeywords?: (v: string) => void;
  location?: string;
  setLocation?: (v: string) => void;
  limit?: number;
  setLimit?: (v: number) => void;
  onSearch?: () => void;
  loading?: boolean;
  showSearch?: boolean;
}

export default function Header({
  keywords, setKeywords,
  location, setLocation,
  onSearch, loading,
  showSearch = true
}: HeaderProps) {
  const { pathname } = useLocation();

  return (
    <header className="bg-[#FDFBF7]/80 backdrop-blur-md z-20 p-5 sticky top-0 border-b-2 border-[#E6AA68]/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Top Row: Brand + Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand Area */}
            <Link to="/" className="flex items-center gap-3 select-none group cursor-pointer">
              <div className="w-12 h-12 bg-[#2D3748] rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 border-2 border-[#E6AA68]">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FDFBF7]" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h1 className="text-3xl font-black text-[#2D3748] tracking-tight">
                Scout<span className="text-[#E6AA68]">ling</span>
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="flex gap-2 bg-white/50 p-1 rounded-xl border border-[#2D3748]/5">
                <Link
                  to="/"
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${pathname === '/' ? 'bg-[#2D3748] text-white shadow-md' : 'text-[#2D3748]/70 hover:bg-[#E6AA68]/10'}`}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/settings"
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${pathname === '/settings' ? 'bg-[#2D3748] text-white shadow-md' : 'text-[#2D3748]/70 hover:bg-[#E6AA68]/10'}`}
                >
                  My Profile & Agent
                </Link>
            </nav>
        </div>

        {/* Search Bar Container (Conditional) */}
        {showSearch && (
          <div className="flex flex-col md:flex-row gap-3 w-full bg-white p-2 rounded-2xl border-2 border-[#2D3748]/10 shadow-sm focus-within:border-[#E6AA68]/50 focus-within:shadow-md transition-all">
              {/* Keywords Input */}
              <div className="flex-1 relative border-r border-gray-100">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E6AA68] text-lg">🔍</span>
                  <input
                    value={keywords}
                    onChange={(e) => setKeywords?.(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
                    className="w-full pl-10 bg-transparent p-2.5 text-[#2D3748] font-bold placeholder-[#2D3748]/40 outline-none"
                    placeholder="Job Title (e.g. Python)"
                  />
              </div>

              {/* Location Input */}
              <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E6AA68] text-lg">📍</span>
                  <input
                    value={location}
                    onChange={(e) => setLocation?.(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
                    className="w-full pl-10 bg-transparent p-2.5 text-[#2D3748] font-bold placeholder-[#2D3748]/40 outline-none"
                    placeholder="Location"
                  />
              </div>

              {/* Search Button */}
              <button
                onClick={onSearch}
                disabled={loading}
                className="bg-[#E6AA68] text-white px-8 rounded-xl font-bold hover:bg-[#d69045] active:bg-[#c07d3a] disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                {loading ? '...' : 'Find'}
              </button>
          </div>
        )}
      </div>
    </header>
  );
}