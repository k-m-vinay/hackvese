import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Leaf, Menu, X, ChevronDown, BarChart3, Truck, 
  ThermometerSnowflake, TrendingUp, Cpu, Users, 
  CloudSun, Calculator, HelpCircle, Info
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const primaryLinks = [
    { name: 'Home', path: '/' },
    { name: 'Decision Engine', path: '/analyze' },
    { name: 'Mandi Live', path: '/markets' },
    { name: 'Cold Storage', path: '/cold-storage' },
    { name: 'Logistics', path: '/logistics' },
    { name: 'AI Forecast', path: '/forecast' },
  ];

  const secondaryTools = [
    { name: 'Model XAI & SHAP', path: '/model-transparency', desc: 'Inspect feature weights & ML metrics', icon: Cpu },
    { name: 'FPO Collective Hub', path: '/fpo-hub', desc: 'Batch pooling & institutional buyers', icon: Users },
    { name: 'Weather & Decay Risk', path: '/weather-advisory', desc: 'Micro-climate & harvest advisory', icon: CloudSun },
    { name: 'Net Realization Calculator', path: '/profit-calculator', desc: '4-channel farmgate profit breakdown', icon: Calculator },
    { name: 'How It Works', path: '/how-it-works', desc: 'System architecture & math logic', icon: HelpCircle },
    { name: 'About Conclave', path: '/about', desc: 'Track 06 Innovators Conclave 2026', icon: Info },
  ];

  const isSecondaryActive = secondaryTools.some(tool => location.pathname === tool.path);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  HarvestLink
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  PS-02 AgriTech
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Dropdown Menu for More Tools */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isSecondaryActive || dropdownOpen
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                <span>Intelligence & Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Advanced Modules & Research
                  </div>
                  {secondaryTools.map(tool => (
                    <NavLink
                      key={tool.name}
                      to={tool.path}
                      onClick={() => setDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-start gap-3 px-3 py-2.5 hover:bg-emerald-50/70 transition-colors ${
                          isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'
                        }`
                      }
                    >
                      <tool.icon className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">{tool.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{tool.desc}</div>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Direct CTA */}
            <NavLink
              to="/analyze"
              className="ml-3 inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
            >
              Run Analysis
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-600 hover:text-emerald-600 focus:outline-none p-2 rounded-lg hover:bg-slate-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 max-h-[85vh] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Primary Navigation
            </div>
            <div className="space-y-1">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-bold ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 border-t border-slate-100">
              Intelligence Modules
            </div>
            <div className="space-y-1">
              {secondaryTools.map((tool) => (
                <NavLink
                  key={tool.name}
                  to={tool.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <tool.icon className="w-4 h-4 text-emerald-600" />
                  <span>{tool.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
