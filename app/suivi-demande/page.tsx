"use client";

import { useState } from 'react';
import { 
  FaStore, 
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle
} from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '../components/Header';

const LocationMap = dynamic(() => import('../components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

interface DemandStatus {
  referenceNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  applicantName: string;
  businessName: string;
  email: string;
  phone: string;
  category: string;
  assignedSite?: {
    name: string;
    kiosk: string;
    size: string;
    coordinates: [number, number];
  };
  reviewDate?: string;
  rejectionReason?: string;
  nextSteps?: string[];
}

// Simulation de base de données de demandes
const mockDemands: { [key: string]: DemandStatus } = {
  'EXP-12345678': {
    referenceNumber: 'EXP-12345678',
    status: 'approved',
    submittedDate: '2025-01-05',
    applicantName: 'Amadou Moussa',
    businessName: 'Coopérative Sahel',
    email: 'amadou@example.com',
    phone: '+227 90 12 34 56',
    category: 'Agroalimentaire',
    reviewDate: '2025-01-07',
    assignedSite: {
      name: 'Site N°1 - Ex-OPVN',
      kiosk: 'A-125',
      size: 'Moyen (20 m²)',
      coordinates: [13.514167, 2.108889]
    },
    nextSteps: [
      'Contacter notre service au +227 XX XX XX XX pour finaliser votre dossier',
      'Préparer les documents requis (contrat, caution)',
      'Planifier la signature du contrat dans les 7 jours',
      'Payer la caution de garantie'
    ]
  },
  'EXP-87654321': {
    referenceNumber: 'EXP-87654321',
    status: 'pending',
    submittedDate: '2025-01-09',
    applicantName: 'Fatima Ibrahim',
    businessName: 'Beauté Naturelle',
    email: 'fatima@example.com',
    phone: '+227 91 23 45 67',
    category: 'Cosmétiques',
    nextSteps: [
      'Votre dossier est en cours d\'examen',
      'Vous recevrez une réponse sous 24-48 heures',
      'Vérifiez régulièrement votre email'
    ]
  },
  'EXP-11223344': {
    referenceNumber: 'EXP-11223344',
    status: 'rejected',
    submittedDate: '2025-01-03',
    applicantName: 'Hassane Ali',
    businessName: 'Artisanat Moderne',
    email: 'hassane@example.com',
    phone: '+227 92 34 56 78',
    category: 'Textile & Artisanat',
    reviewDate: '2025-01-06',
    rejectionReason: 'Documents incomplets - Carte d\'identité non lisible et absence de registre de commerce pour une entreprise constituée.',
    nextSteps: [
      'Corriger les documents manquants',
      'Soumettre une nouvelle demande avec les documents complets',
      'Contacter notre service pour plus d\'informations'
    ]
  }
};

export default function SuiviDemandePage() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [searchResult, setSearchResult] = useState<DemandStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    
    if (!referenceNumber.trim()) {
      setError('Veuillez entrer un numéro de référence');
      return;
    }

    setIsSearching(true);

    // Simuler une recherche
    setTimeout(() => {
      const result = mockDemands[referenceNumber.trim()];
      
      if (result) {
        setSearchResult(result);
      } else {
        setError('Numéro de référence introuvable. Veuillez vérifier et réessayer.');
      }
      
      setIsSearching(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'from-green-400 to-green-600';
      case 'pending':
        return 'from-yellow-400 to-yellow-600';
      case 'rejected':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-5xl" />;
      case 'pending':
        return <FaClock className="text-5xl" />;
      case 'rejected':
        return <FaTimesCircle className="text-5xl" />;
      default:
        return <FaInfoCircle className="text-5xl" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Demande Approuvée';
      case 'pending':
        return 'En Cours d\'Examen';
      case 'rejected':
        return 'Demande Rejetée';
      default:
        return 'Statut Inconnu';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Félicitations ! Votre demande a été approuvée et un kiosque vous a été attribué.';
      case 'pending':
        return 'Votre demande est actuellement en cours d\'examen par notre équipe.';
      case 'rejected':
        return 'Votre demande n\'a pas pu être acceptée. Consultez les détails ci-dessous.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-medium mb-4">
            <FaSearch />
            <span>Suivi de Demande</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Vérifiez le Statut de votre <span className="gradient-text">Demande</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Entrez votre numéro de référence pour connaître l'état d'attribution de votre kiosque
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="glass-effect rounded-3xl p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FaIdCard className="inline mr-2 text-primary-600" />
                Numéro de Référence
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                  placeholder="Ex: EXP-12345678"
                  className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-lg"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <FaTimesCircle className="mr-1" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover-lift shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Recherche en cours...</span>
                </>
              ) : (
                <>
                  <FaSearch />
                  <span>Rechercher</span>
                </>
              )}
            </button>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                💡 Numéros de test disponibles:
              </p>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• <code className="bg-blue-100 px-2 py-1 rounded">EXP-12345678</code> - Demande approuvée</p>
                <p>• <code className="bg-blue-100 px-2 py-1 rounded">EXP-87654321</code> - En attente</p>
                <p>• <code className="bg-blue-100 px-2 py-1 rounded">EXP-11223344</code> - Rejetée</p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Search Results */}
      {searchResult && (
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Status Card */}
            <div className="glass-effect rounded-3xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className={`w-24 h-24 bg-gradient-to-br ${getStatusColor(searchResult.status)} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-white`}>
                  {getStatusIcon(searchResult.status)}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {getStatusText(searchResult.status)}
                </h3>
                <p className="text-lg text-gray-700">
                  {getStatusDescription(searchResult.status)}
                </p>
              </div>

              {/* Applicant Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Informations du Demandeur</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <FaIdCard className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Nom complet</p>
                        <p className="font-semibold text-gray-900">{searchResult.applicantName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MdBusiness className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Entreprise</p>
                        <p className="font-semibold text-gray-900">{searchResult.businessName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaStore className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Catégorie</p>
                        <p className="font-semibold text-gray-900">{searchResult.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Détails de la Demande</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <FaIdCard className="text-accent-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Numéro de référence</p>
                        <p className="font-semibold text-gray-900">{searchResult.referenceNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaCalendarAlt className="text-accent-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Date de soumission</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(searchResult.submittedDate).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {searchResult.reviewDate && (
                      <div className="flex items-start">
                        <FaCheckCircle className="text-accent-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500">Date d'examen</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(searchResult.reviewDate).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned Site (if approved) */}
              {searchResult.status === 'approved' && searchResult.assignedSite && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 mb-8 border-2 border-green-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                      <FaMapMarkerAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-green-900">Kiosque Attribué</h4>
                      <p className="text-green-700">Votre emplacement a été confirmé</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Site</p>
                        <p className="font-bold text-gray-900 text-lg">{searchResult.assignedSite.name}</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Numéro de Kiosque</p>
                        <p className="font-bold text-primary-600 text-2xl">{searchResult.assignedSite.kiosk}</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Taille</p>
                        <p className="font-bold text-gray-900 text-lg">{searchResult.assignedSite.size}</p>
                      </div>
                    </div>

                    <div className="h-[300px] rounded-xl overflow-hidden shadow-lg">
                      <LocationMap highlightedVendor={{
                        name: searchResult.businessName,
                        location: searchResult.assignedSite.name,
                        site: searchResult.assignedSite.name,
                        kiosk: searchResult.assignedSite.kiosk,
                        phone: searchResult.phone,
                        coordinates: searchResult.assignedSite.coordinates
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Reason (if rejected) */}
              {searchResult.status === 'rejected' && searchResult.rejectionReason && (
                <div className="bg-red-50 rounded-2xl p-6 mb-8 border-2 border-red-200">
                  <h4 className="font-bold text-red-900 mb-3 flex items-center text-lg">
                    <FaTimesCircle className="mr-2" />
                    Raison du Rejet
                  </h4>
                  <p className="text-red-800">{searchResult.rejectionReason}</p>
                </div>
              )}

              {/* Next Steps */}
              {searchResult.nextSteps && searchResult.nextSteps.length > 0 && (
                <div className="glass-effect rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">
                    Prochaines Étapes
                  </h4>
                  <ul className="space-y-3">
                    {searchResult.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="glass-effect rounded-2xl p-8">
              <h4 className="font-bold text-gray-900 mb-4 text-xl">
                Besoin d'Aide ?
              </h4>
              <p className="text-gray-700 mb-6">
                Notre équipe est disponible pour répondre à vos questions
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href={`tel:${searchResult.phone}`} className="flex items-center space-x-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                  <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-semibold text-primary-700">+227 XX XX XX XX</p>
                  </div>
                </a>
                <a href={`mailto:${searchResult.email}`} className="flex items-center space-x-3 p-4 bg-accent-50 rounded-xl hover:bg-accent-100 transition-colors">
                  <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-accent-700">contact@marche.ne</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary-800 to-accent-800 text-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
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
              <h4 className="text-xl font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/inscription-exposant" className="hover:text-white">Devenir Exposant</Link></li>
                <li><Link href="/marche" className="hover:text-white">Boutique en Ligne</Link></li>
                <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              </ul>
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
