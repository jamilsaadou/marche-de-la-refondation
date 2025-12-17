"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaGlobe,
  FaShoppingBag,
  FaUserTie,
  FaSearch,
  FaBars,
  FaTimes,
  FaHome,
  FaFileAlt,
  FaChevronRight,
  FaUserShield,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";

// Interface pour l'utilisateur connecté
interface UserInfo {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('auth-token');
        }
      } else {
        localStorage.removeItem('auth-token');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      localStorage.removeItem('auth-token');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      localStorage.removeItem('auth-token');
      setUser(null);
      router.push('/');
    }
  };

  // Menu items publics (accessibles uniquement aux visiteurs non connectés)
  const publicMenuItems = [
    {
      label: "Accueil",
      href: "/",
      icon: <FaHome className="text-lg" />,
      description: "Page principale",
      forAll: true // Accessible à tous (visiteurs et admins)
    },
    {
      label: "Informations",
      href: "/marche",
      icon: <FaShoppingBag className="text-lg" />,
      description: "Détails du marché",
      forAll: true // Accessible à tous
    },
    {
      label: "Règlement",
      href: "/reglement",
      icon: <FaFileAlt className="text-lg" />,
      description: "Conditions générales",
      forAll: true // Accessible à tous
    },
    {
      label: "Devenir Exposant",
      href: "/inscription-exposant",
      icon: <FaUserTie className="text-lg" />,
      highlight: true,
      description: "Inscription en ligne",
      forAll: false // Uniquement pour visiteurs
    },
    {
      label: "Suivi de Demande",
      href: "/suivi-demande",
      icon: <FaSearch className="text-lg" />,
      description: "Vérifier votre statut",
      forAll: false // Uniquement pour visiteurs
    }
  ];

  // Menu items administrateur (uniquement pour les admins)
  const adminMenuItems = [
    {
      label: "Administration",
      href: "/admin",
      icon: <FaUserShield className="text-lg" />,
      description: "Panneau d'administration",
      highlight: false,
      forAll: false
    }
  ];

  // Combiner les menus en fonction du rôle de l'utilisateur
  let menuItems;
  
  if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
    // Pour les administrateurs : menus communs + menu administration
    menuItems = [
      ...publicMenuItems.filter(item => item.forAll),
      ...adminMenuItems
    ];
  } else {
    // Pour les visiteurs : tous les menus publics
    menuItems = publicMenuItems;
  }

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-2xl' 
        : 'backdrop-blur-md bg-white/70 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-4 md:py-5">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Logo */}
          <Link href="/" className="hover-lift flex-shrink-0">
            <div className="relative" style={{ width: '260px', height: '75px' }}>
              <Image 
                src="/marchedela.png" 
                alt="Logo Marché de la Réfondation"
                fill
                className="object-contain"
                priority
                sizes="260px"
              />
            </div>
          </Link>

          {/* Desktop Navigation with Glassmorphism */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
            {menuItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`relative flex items-center space-x-2 px-4 xl:px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isActive(item.href)
                      ? 'backdrop-blur-md bg-gradient-to-r from-primary-500/90 to-accent-500/90 text-white shadow-xl border border-white/20'
                      : (item as any).highlight
                      ? 'backdrop-blur-md bg-gradient-to-r from-accent-500/80 to-accent-600/80 text-white hover:from-accent-600/90 hover:to-accent-700/90 shadow-lg border border-white/10 hover:shadow-xl hover:-translate-y-0.5'
                      : 'backdrop-blur-sm bg-white/30 text-gray-700 hover:bg-white/50 border border-gray-200/30 hover:border-gray-300/50 hover:shadow-md'
                  }`}
                >
                  <span className={`${isActive(item.href) || (item as any).highlight ? 'animate-pulse' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">{item.label.split(' ')[0]}</span>
                  
                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 transform transition-transform duration-300 ${
                    isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
                
                {/* Tooltip with description */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/90 backdrop-blur-md text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/10">
                  {item.description}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-l border-t border-white/10"></div>
                </div>
              </div>
            ))}

            {/* Boutons d'authentification */}
            {!loadingAuth && (
              <div className="flex items-center space-x-2 ml-2">
                {user ? (
                  <>
                    {/* Profil utilisateur */}
                    <div className="flex items-center space-x-2 px-3 py-2 backdrop-blur-sm bg-white/30 border border-white/50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.prenom[0]}{user.nom[0]}
                        </span>
                      </div>
                      <div className="hidden xl:block">
                        <p className="text-xs font-semibold text-gray-900">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="text-xs text-gray-600">{user.role}</p>
                      </div>
                    </div>
                    {/* Bouton de déconnexion */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 backdrop-blur-md bg-red-500/80 text-white rounded-xl hover:bg-red-600/90 transition-all duration-300 shadow-md hover:shadow-lg border border-white/20"
                      title="Déconnexion"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span className="hidden xl:inline">Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    className="flex items-center space-x-2 px-4 py-2 backdrop-blur-md bg-primary-500/80 text-white rounded-xl hover:bg-primary-600/90 transition-all duration-300 shadow-md hover:shadow-lg border border-white/20"
                  >
                    <FaSignInAlt className="text-lg" />
                    <span className="hidden xl:inline">Connexion Admin</span>
                  </Link>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button with Glassmorphism */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 sm:p-3 backdrop-blur-md bg-white/30 border border-white/50 rounded-xl hover:bg-white/50 transition-all duration-300 flex-shrink-0 shadow-md hover:shadow-lg"
            aria-label="Toggle menu"
          >
            <div className="relative">
              {isMenuOpen ? (
                <FaTimes className="text-xl sm:text-2xl text-primary-600 transition-transform duration-300 rotate-0" />
              ) : (
                <FaBars className="text-xl sm:text-2xl text-primary-600 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Navigation with Glassmorphism */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <nav className="pb-4 border-t border-white/20 pt-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm transform hover:translate-x-1 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500/80 to-accent-500/80 text-white shadow-xl border border-white/20'
                      : (item as any).highlight
                      ? 'bg-accent-500/70 text-white hover:bg-accent-600/80 border border-white/10'
                      : 'bg-white/20 text-gray-700 hover:bg-white/40 border border-gray-200/20'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${isActive(item.href) || (item as any).highlight ? 'animate-pulse' : ''}`}>
                      {item.icon}
                    </span>
                    <div>
                      <span className="block">{item.label}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  </div>
                  <FaChevronRight className="text-sm opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              ))}

              {/* Boutons d'authentification mobile */}
              {!loadingAuth && (
                <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                  {user ? (
                    <>
                      {/* Profil utilisateur mobile */}
                      <div className="flex items-center space-x-3 px-4 py-3 backdrop-blur-sm bg-white/30 border border-white/50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.prenom[0]}{user.nom[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {user.prenom} {user.nom}
                          </p>
                          <p className="text-xs text-gray-600">{user.role}</p>
                        </div>
                      </div>
                      {/* Bouton de déconnexion mobile */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 backdrop-blur-md bg-red-500/80 text-white rounded-xl hover:bg-red-600/90 transition-all duration-300 shadow-md border border-white/20"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span>Déconnexion</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/admin/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 backdrop-blur-md bg-primary-500/80 text-white rounded-xl hover:bg-primary-600/90 transition-all duration-300 shadow-md border border-white/20"
                    >
                      <FaSignInAlt className="text-lg" />
                      <span>Connexion Admin</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
