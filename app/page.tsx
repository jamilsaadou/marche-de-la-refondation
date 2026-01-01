"use client";

import { 
  FaStore, 
  FaUsers, 
  FaChartLine, 
  FaMapMarkerAlt, 
  FaLeaf,
  FaHandshake,
  FaAward,
  FaCalendarAlt,
  FaShoppingBag,
  FaBullseye,
  FaHeart,
  FaSeedling,
  FaTrophy,
  FaUserTie,
  FaFileAlt
} from "react-icons/fa";
import { MdSecurity, MdOutlineLocalShipping } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { BiSolidFactory } from "react-icons/bi";
import dynamic from 'next/dynamic';
import Header from './components/Header';
import ImageSlider from './components/ImageSlider';

const LocationMap = dynamic(() => import('./components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-gray-100 rounded-2xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const stats = [
    {
      icon: <FaStore className="text-4xl" />,
      value: "1 500",
      label: "Kiosques disponibles",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: <FaUsers className="text-4xl" />,
      value: "3 000+",
      label: "Emplois créés",
      color: "from-accent-500 to-accent-600"
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl" />,
      value: "2",
      label: "Sites stratégiques",
      color: "from-primary-600 to-accent-500"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      value: "+30%",
      label: "Croissance attendue",
      color: "from-accent-600 to-primary-500"
    }
  ];

  const objectives = [
    {
      icon: <FaBullseye className="text-3xl text-primary-600" />,
      title: "Souveraineté Économique",
      description: "Promouvoir l'indépendance économique du Niger à travers la valorisation des produits locaux"
    },
    {
      icon: <FaLeaf className="text-3xl text-accent-600" />,
      title: "Consommer Local",
      description: "Encourager le patriotisme économique et la consommation des produits fabriqués au Niger"
    },
    {
      icon: <FaHandshake className="text-3xl text-primary-600" />,
      title: "Autonomisation",
      description: "Créer des opportunités pour les femmes et les jeunes entrepreneurs"
    },
    {
      icon: <FaTrophy className="text-3xl text-accent-600" />,
      title: "Excellence",
      description: "Améliorer la qualité et la présentation des produits locaux"
    }
  ];

  const sectors = [
    {
      icon: <BiSolidFactory className="text-4xl text-white" />,
      title: "Artisanat de Transformation/Production",
      description: "Transformation de matières premières locales en produits finis",
      bgColor: "bg-gradient-to-br from-primary-500 to-primary-600"
    },
    {
      icon: <FaHandshake className="text-4xl text-white" />,
      title: "Artisanat de Service",
      description: "Prestations artisanales techniques et utilitaires",
      bgColor: "bg-gradient-to-br from-accent-500 to-accent-600"
    },
    {
      icon: <FaHeart className="text-4xl text-white" />,
      title: "Artisanat d'Art",
      description: "Créativité et forte connotation culturelle nigérienne",
      bgColor: "bg-gradient-to-br from-primary-600 to-accent-600"
    }
  ];

  const features = [
    {
      icon: <MdSecurity />,
      title: "Sécurisé",
      description: "Système de sécurité moderne avec surveillance 24/7"
    },
    {
      icon: <FaAward />,
      title: "Qualité Garantie",
      description: "Standards de qualité pour tous les produits"
    },
    {
      icon: <MdOutlineLocalShipping />,
      title: "Logistique",
      description: "Infrastructure optimisée pour la distribution"
    },
    {
      icon: <GiTakeMyMoney />,
      title: "Économique",
      description: "Modèle viable basé sur l'entrepreneuriat local"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header / Navigation */}
      <Header />

      {/* Hero Section - Text Left, Photos Right */}
      <section className="pt-40 sm:pt-44 md:pt-48 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content - Left side (50%) */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-medium mb-4">
                <FaCalendarAlt />
                <span>Janvier - Décembre 2026</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Marché de la{" "}
                <span className="gradient-text">Réfondation</span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-700">
                Valorisation et Commercialisation des Produits Locaux dans le cadre du Centenaire de Niamey
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <a href="/inscription-exposant" className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                  <FaUserTie className="group-hover:scale-110 transition-transform" />
                  <span>Devenir Exposant</span>
                </a>
                <a href="/reglement" className="group px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                  <FaFileAlt className="group-hover:scale-110 transition-transform" />
                  <span>Consulter le Règlement</span>
                </a>
              </div>
            </div>

            {/* Image Slider with Glassmorphism - Right side (50%) */}
            <div className="w-full">
              <ImageSlider />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-6 hover-lift"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              À Propos du Projet
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Une initiative stratégique du Gouvernement nigérien pour promouvoir la souveraineté économique nationale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="glass-effect rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUserTie className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Vision Présidentielle</h4>
                    <p className="text-gray-700">
                      S'inscrit dans l'Axe 3 du programme du Président de la République, Son Excellence le Général d'Armée ABDOURAHAMANE TIANI : 
                      "Pour le Niger, Laabou Sanni No, Zancen Kasa Ne"
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Localisation Stratégique</h4>
                    <p className="text-gray-700 mb-3">
                      <strong>Site N°1 - Ex-OPVN:</strong> 2 600 m² | 412 kiosques (Petit marché)
                    </p>
                    <p className="text-gray-700">
                      <strong>Site N°2 - Ex-Marché Djémadjé:</strong> 5 500 m² | 642 kiosques (Près du Ministère du Commerce)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {objectives.map((obj, index) => (
                <div key={index} className="glass-effect rounded-2xl p-6 hover-lift">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
                      {obj.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{obj.title}</h4>
                      <p className="text-gray-700">{obj.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Filières Prioritaires
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Trois secteurs clés pour la valorisation des produits locaux
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className={`${sector.bgColor} rounded-2xl p-8 text-white hover-lift shadow-xl`}
              >
                <div className="mb-6">{sector.icon}</div>
                <h4 className="text-2xl font-bold mb-3">{sector.title}</h4>
                <p className="text-white/90">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Caractéristiques du Marché
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-effect rounded-2xl p-6 hover-lift text-center"
              >
                <div className="text-4xl text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-medium mb-4">
              <FaMapMarkerAlt />
              <span>Localisation des Sites</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nos Deux Sites Stratégiques
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              Découvrez l'emplacement des deux marchés au cœur de Niamey
            </p>
          </div>

          <div className="mb-8">
            <LocationMap />
          </div>

          {/* Site Information Cards with Enhanced Glassmorphism */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Site 1 Card */}
            <div className="group relative">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              
              {/* Main card with glassmorphism */}
              <div className="relative backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/50 shadow-2xl hover:-translate-y-2 transition-all duration-300">
                {/* Badge */}
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Site N°1
                </div>
                
                {/* Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 blur-lg opacity-50"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                      <FaStore className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
                      Ex-OPVN
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">Petit marché moderne</p>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="backdrop-blur-md bg-white/30 rounded-xl p-3 border border-white/40">
                    <div className="flex items-center space-x-2 text-blue-700 mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      <span className="text-xs font-semibold">Superficie</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">2 600 m²</p>
                  </div>
                  <div className="backdrop-blur-md bg-white/30 rounded-xl p-3 border border-white/40">
                    <div className="flex items-center space-x-2 text-blue-700 mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                      </svg>
                      <span className="text-xs font-semibold">Kiosques</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">412</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="backdrop-blur-md bg-gradient-to-r from-blue-50/50 to-blue-100/50 rounded-xl p-4 mb-4 border border-white/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Localisation</span>
                      </div>
                      <p className="text-gray-800 font-medium">Petit marché</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Coordonnées GPS</p>
                      <p className="text-sm font-mono text-gray-700">13°30'51"N 2°06'32"E</p>
                    </div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <span className="backdrop-blur-md bg-white/40 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full border border-white/50">
                    ✅ Parking
                  </span>
                  <span className="backdrop-blur-md bg-white/40 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full border border-white/50">
                    ✅ Sécurité 24/7
                  </span>
                  <span className="backdrop-blur-md bg-white/40 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full border border-white/50">
                    ✅ Électricité
                  </span>
                </div>
              </div>
            </div>

            {/* Site 2 Card */}
            <div className="group relative">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              
              {/* Main card with glassmorphism */}
              <div className="relative backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/50 shadow-2xl hover:-translate-y-2 transition-all duration-300">
                {/* Badge */}
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  Site N°2
                </div>
                
                {/* Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400 blur-lg opacity-50"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
                      <FaStore className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-1">
                      Ex-Marché Djémadjé
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">Grand marché principal</p>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="backdrop-blur-md bg-white/30 rounded-xl p-3 border border-white/40">
                    <div className="flex items-center space-x-2 text-green-700 mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      <span className="text-xs font-semibold">Superficie</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">5 500 m²</p>
                  </div>
                  <div className="backdrop-blur-md bg-white/30 rounded-xl p-3 border border-white/40">
                    <div className="flex items-center space-x-2 text-green-700 mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                      </svg>
                      <span className="text-xs font-semibold">Kiosques</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">642</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="backdrop-blur-md bg-gradient-to-r from-green-50/50 to-green-100/50 rounded-xl p-4 mb-4 border border-white/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <FaMapMarkerAlt className="text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">Localisation</span>
                      </div>
                      <p className="text-gray-800 font-medium">Ministère du Commerce</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Coordonnées GPS</p>
                      <p className="text-sm font-mono text-gray-700">13°30'57"N 2°06'28"E</p>
                    </div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <span className="backdrop-blur-md bg-white/40 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full border border-white/50">
                    ✅ Parking VIP
                  </span>
                  <span className="backdrop-blur-md bg-white/40 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full border border-white/50">
                    ✅ Zone stockage
                  </span>
                  <span className="backdrop-blur-md bg-white/40 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-full border border-white/50">
                    ✅ Restaurant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary-800 to-accent-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <FaStore />
                <span>Marché de la Réfondation</span>
              </h4>
              <p className="text-white/80">
               </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-white/80 mb-2">Niamey, République du Niger</p>
              <p className="text-white/80">Centenaire de Niamey 2026</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Partenaires</h4>
              <p className="text-white/80 mb-1">Ville de Niamey</p>
              <p className="text-white/80 mb-1">Agence Nationale pour la Société de l'Information</p>
              <p className="text-white/80">CCIN - Chambre de Commerce</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>© 2025-2026 Marché de la Réfondation. Niger - Fraternité, Travail, Progrès</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
