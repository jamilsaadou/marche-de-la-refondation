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
  FaUserTie
} from "react-icons/fa";
import { MdSecurity, MdOutlineLocalShipping } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { BiSolidFactory } from "react-icons/bi";
import dynamic from 'next/dynamic';
import Header from './components/Header';

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
      value: "1 054",
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
      icon: <FaShoppingBag className="text-4xl text-white" />,
      title: "Agroalimentaire",
      description: "Produits alimentaires transformés localement",
      bgColor: "bg-gradient-to-br from-primary-500 to-primary-600"
    },
    {
      icon: <FaSeedling className="text-4xl text-white" />,
      title: "Cosmétiques",
      description: "Produits de beauté naturels et biologiques",
      bgColor: "bg-gradient-to-br from-accent-500 to-accent-600"
    },
    {
      icon: <BiSolidFactory className="text-4xl text-white" />,
      title: "Textile & Artisanat",
      description: "Créations artisanales et textiles traditionnels",
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
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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
                <a href="/marche" className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                  <FaShoppingBag className="group-hover:scale-110 transition-transform" />
                  <span>Accéder aux Marchés</span>
                </a>
                <a href="/inscription-exposant" className="group px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                  <FaUserTie className="group-hover:scale-110 transition-transform" />
                  <span>Devenir Exposant</span>
                </a>
              </div>
            </div>

            {/* Photo Grid - Right side (50%) */}
            <div className="w-full">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[220px] md:h-[260px] lg:h-[280px]">
                {/* Top left */}
                <div className="col-span-1 row-span-1 relative overflow-hidden rounded-xl shadow-lg group">
                  <img 
                    src="/exposition-sur-le-marche-des-fruits-frais.jpg" 
                    alt="Exposition marché fruits frais"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Top right - tall image spanning full height */}
                <div className="col-span-1 row-span-2 relative overflow-hidden rounded-xl shadow-xl group">
                  <img 
                    src="/select-1_13.jpg" 
                    alt="Marché de la Réfondation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Bottom left - first small image */}
                <div className="col-span-1 row-span-1 relative overflow-hidden rounded-xl shadow-lg group">
                  <img 
                    src="/portrait-photorealiste-d-une-personne-gerant-et-proprietaire-de-son-entreprise.jpg" 
                    alt="Portrait entrepreneur"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              
              {/* Bottom row with 2 more images */}
              <div className="grid grid-cols-2 gap-2 mt-2 h-[100px] md:h-[120px] lg:h-[130px]">
                <div className="relative overflow-hidden rounded-xl shadow-lg group">
                  <img 
                    src="/select-1_25.jpg" 
                    alt="Produits locaux"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative overflow-hidden rounded-xl shadow-lg group">
                  <img 
                    src="/select-1_2.jpg" 
                    alt="Commerce local"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
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
                      <strong>Site N°1 - Ex-OPVN:</strong> 2 600 m² | 412 kiosques (Rond-point Maourey)
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
              Un espace moderne inspiré de l'architecture traditionnelle touarègue
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

          {/* Site Information Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="glass-effect rounded-2xl p-8 hover-lift border-l-4 border-blue-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FaStore className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Site N°1 - Ex-OPVN (Petit marché)</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong className="text-blue-600">Superficie:</strong> 2 600 m²</p>
                    <p><strong className="text-blue-600">Capacité:</strong> 412 kiosques</p>
                    <p><strong className="text-blue-600">Localisation:</strong> Rond-point Maourey</p>
                    <p className="text-sm text-gray-600 mt-3">📍 13°30'51"N 2°06'32"E</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8 hover-lift border-l-4 border-green-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FaStore className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Site N°2 - Ex-Marché Djémadjé</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong className="text-green-600">Superficie:</strong> 5 500 m²</p>
                    <p><strong className="text-green-600">Capacité:</strong> 642 kiosques</p>
                    <p><strong className="text-green-600">Localisation:</strong> Près du Ministère du Commerce</p>
                    <p className="text-sm text-gray-600 mt-3">📍 13°30'57"N 2°06'28"E</p>
                  </div>
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
                Initiative du Ministère du Commerce et de l'Industrie de la République du Niger
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
              <p className="text-white/80 mb-1">Cabinet Le Concret</p>
              <p className="text-white/80">CCIN - Chambre de Commerce</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>© 2025-2026 Marché de la Réfondation. République du Niger - Fraternité, Travail, Progrès</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
