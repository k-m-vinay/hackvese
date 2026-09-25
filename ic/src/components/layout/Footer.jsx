import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-lg text-gray-900">HarvestLink</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Turning post-harvest data into actionable decisions for a sustainable agricultural future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4 md:items-center">
            <h3 className="font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600 md:text-center">
              <li>
                <NavLink to="/" className="hover:text-emerald-600 transition-colors">Home</NavLink>
              </li>
              <li>
                <NavLink to="/analyze" className="hover:text-emerald-600 transition-colors">Analyze</NavLink>
              </li>
              <li>
                <NavLink to="/how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-emerald-600 transition-colors">About</NavLink>
              </li>
            </ul>
          </div>

          {/* Event Info */}
          <div className="flex flex-col space-y-4 md:items-end">
            <h3 className="font-semibold text-gray-900">Built For</h3>
            <div className="text-sm text-gray-600 md:text-right">
              <p className="font-medium text-emerald-700">Innovators Conclave 2026</p>
              <p className="mt-1">Empowering agricultural innovation.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
          <p>© 2026 HarvestLink. All rights reserved.</p>
          <p className="font-medium text-gray-600">AgriTech Track — PS-02</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
