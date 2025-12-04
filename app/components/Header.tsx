"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaStore, 
  FaGlobe,
  FaShoppingBag,
  FaUserTie,
  FaSearch,
  FaBars,
  FaTimes,
  FaHome
} from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Accueil",
      href: "/",
      icon: <FaHome className="text-lg" />
    },
    {
      label: "Boutique",
      href: "/marche",
      icon: <FaShoppingBag className="text-lg" />
    },
    {
      label: "Devenir Exposant",
      href: "/inscription-exposant",
      icon: <FaUserTie className="text-lg" />,
      highlight: true
    },
    {
      label: "Suivi de Demande",
      href: "/suivi-demande",
      icon: <FaSearch className="text-lg" />
    }
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <header className="glass-effect fixed top-0 left-0 right-0 z-50 shadow-lg mb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover-lift flex-shrink min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <FaStore className="text-white text-xl sm:text-2xl" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold gradient-text truncate">
                Marché de la Réfondation
              </h1>
              <p className="hidden sm:block text-xs sm:text-sm text-primary-700">Niger 2026 | Centenaire de Niamey</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-shrink-0">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-2.5 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                    : item.highlight
                    ? 'bg-accent-500 text-white hover:bg-accent-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.label.split(' ')[0]}</span>
              </Link>
            ))}
            <div className="ml-1 xl:ml-2 px-2.5 xl:px-4 py-2 bg-primary-500 text-white rounded-lg text-xs xl:text-sm font-medium whitespace-nowrap flex items-center space-x-1.5">
              <FaGlobe className="text-sm" />
              <span className="hidden xl:inline">Fabriqué au Niger</span>
              <span className="xl:hidden">Niger</span>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 sm:p-3 glass-effect rounded-lg hover-lift flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="text-xl sm:text-2xl text-primary-600" />
            ) : (
              <FaBars className="text-xl sm:text-2xl text-primary-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : item.highlight
                      ? 'bg-accent-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="px-4 py-3 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium flex items-center space-x-2">
                <FaGlobe />
                <span>Fabriqué au Niger</span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
