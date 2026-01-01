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
  FaTrophy
} from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { BiSolidFactory } from "react-icons/bi";
import Header from '../components/Header';

export default function MarchePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Information Section - Guide Pratique */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Guide Pratique pour les Candidats
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Sélection des occupants du Marché de la Refondation
            </p>
          </div>

          {/* Objectif */}
          <div className="glass-effect rounded-3xl p-8 mb-8 border-2 border-primary-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaBullseye className="text-white text-xl" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Objectif</h4>
                <p className="text-gray-700 text-lg">
                  Permettre aux entrepreneurs et producteurs (hommes et femmes) de présenter leurs produits transformés/fabriqués au Niger dans un espace organisé et valorisant.
                </p>
              </div>
            </div>
          </div>

          {/* Qui peut participer */}
          <div className="glass-effect rounded-3xl p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUsers className="text-white text-xl" />
              </div>
              <div className="w-full">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Qui peut participer ?</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">Entreprises, coopératives ou groupements constitués</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">
                      Toute personne (producteurs, transformateurs) de nationalité nigérienne (joindre la pièce d'identité) proposant des produits transformés/fabriqués localement et respectant les normes de qualité relative aux produits commercialisés
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Processus d'inscription en 4 colonnes */}
          <div className="mb-12">
            <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">Étapes à suivre</h4>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="glass-effect rounded-2xl p-6 hover-lift h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl">
                    1
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2">Obtenir la fiche</h5>
                  <p className="text-gray-700 text-sm">
                    Télécharger en ligne ou retirer auprès des Directions Régionales du Commerce, Direction du Commerce Intérieur, CCIN ou Ville de Niamey
                  </p>
                </div>
                {/* Connecteur */}
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <div className="glass-effect rounded-2xl p-6 hover-lift h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl">
                    2
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2">Remplir et déposer</h5>
                  <p className="text-gray-700 text-sm">
                    Compléter la fiche de candidature et déposer votre dossier complet avec les justificatifs avant la date limite
                  </p>
                </div>
                {/* Connecteur */}
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <div className="glass-effect rounded-2xl p-6 hover-lift h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl">
                    3
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2">Sélection</h5>
                  <p className="text-gray-700 text-sm">
                    Évaluation des dossiers par le comité et publication de la liste définitive des candidats retenus
                  </p>
                </div>
                {/* Connecteur */}
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <div className="glass-effect rounded-2xl p-6 hover-lift h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl">
                    4
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2">Paiement et installation</h5>
                  <p className="text-gray-700 text-sm">
                    Payer les frais de stands après sélection et installer votre stand 3 jours avant l'ouverture
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Critères et Engagements côte à côte */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Critères de sélection */}
            <div className="glass-effect rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <FaAward className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Critères de sélection</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaLeaf className="text-primary-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Pertinence des produits proposés (transformés/fabriqués au Niger)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <BiSolidFactory className="text-primary-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Capacité de production</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FaHeart className="text-primary-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Contribution sociale (emplois, inclusion des jeunes et des femmes)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FaTrophy className="text-primary-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Respect des normes de qualité relatives aux produits commercialisés</p>
                </div>
              </div>
            </div>

            {/* Engagement des candidats */}
            <div className="glass-effect rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
                  <FaHandshake className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Engagement des candidats</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MdSecurity className="text-accent-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Respecter le règlement du marché</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FaShoppingBag className="text-accent-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Présenter uniquement les produits déclarés</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FaSeedling className="text-accent-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Maintenir le stand propre et fonctionnel</p>
                </div>
                <div className="flex items-start space-x-3">
                  <FaChartLine className="text-accent-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Coopérer aux activités de suivi-évaluation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-effect rounded-3xl p-8 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-4">Contact</h4>
              <p className="mb-4">Pour toute information, veuillez contacter :</p>
              <div className="backdrop-blur-md bg-white/20 rounded-xl p-6 inline-block">
                <p className="font-bold text-xl mb-2">Direction du Commerce Intérieur</p>
                <p>Ministère du Commerce et de l'Industrie</p>
                <p className="mt-4 text-sm">République du Niger</p>
                <p className="text-xs italic mt-2">Fraternité – Travail – Progrès</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
