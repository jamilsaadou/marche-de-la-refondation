"use client";

import { useState } from 'react';
import { 
  FaStore, 
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaIndustry,
  FaCheckCircle,
  FaArrowLeft,
  FaUpload,
  FaFileAlt
} from "react-icons/fa";
import { MdBusiness, MdDescription } from "react-icons/md";
import Link from 'next/link';
import Header from '../components/Header';

interface FormData {
  // Questions préliminaires
  typeInscription: string; // "moi-meme" ou "autre-personne"
  localisation: string; // "niamey" ou "region"
  region: string; // Si en région
  
  // Informations personnelles
  nom: string;
  prenom: string;
  nationalite: string;
  age: string;
  sexe: string;
  telephone: string;
  email: string;
  adresse: string;
  
  // Informations entreprise
  nomEntreprise: string;
  secteurActivite: string;
  registreCommerce: string;
  
  // Description de l'activité
  produitsProposés: string;
  listeProduitsDetaillée: string;
  capaciteProduction: string;
  experienceAnterieure: string;
  
  // Nouveaux champs pour l'évaluation
  origineMatieresPremieres: string;
  transformationAuNiger: string;
  innovation: string;
  regulariteApprovisionnement: string;
  adaptationDemandeCroissante: string;
  nombreFemmes: string;
  nombreJeunes: string;
  certificatConformite: string;
  
  // Informations demande
  sitePreference: string;
  tailleKiosque: string;
  nombreEmployes: string;
  
  // Engagement
  acceptEngagement: boolean;
  acceptFraisStand: boolean;
  
  // Documents
  carteIdentite: File | null;
  registreCommerceDoc: File | null;
  listeProduitsFile: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export default function InscriptionExposantPage() {
  const [formData, setFormData] = useState<FormData>({
    typeInscription: '',
    localisation: '',
    region: '',
    nom: '',
    prenom: '',
    nationalite: 'Niger',
    age: '',
    sexe: '',
    telephone: '',
    email: '',
    adresse: '',
    nomEntreprise: '',
    secteurActivite: '',
    registreCommerce: '',
    produitsProposés: '',
    listeProduitsDetaillée: '',
    capaciteProduction: '',
    experienceAnterieure: '',
    origineMatieresPremieres: '',
    transformationAuNiger: '',
    innovation: '',
    regulariteApprovisionnement: '',
    adaptationDemandeCroissante: '',
    nombreFemmes: '',
    nombreJeunes: '',
    certificatConformite: '',
    sitePreference: '',
    tailleKiosque: '',
    nombreEmployes: '',
    acceptEngagement: false,
    acceptFraisStand: false,
    carteIdentite: null,
    registreCommerceDoc: null,
    listeProduitsFile: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Commence à 0 pour les questions préliminaires

  const regions = [
    "Agadez",
    "Diffa",
    "Dosso",
    "Maradi",
    "Tahoua",
    "Tillaberi",
    "Zinder"
  ];

  const secteurs = [
    "Artisanat d'art",
    "Artisanat de services",
    "Artisanat de transformation/production"
  ];

  const sites = [
    "Site N°1 - Ex-OPVN (Petit marché)",
    "Site N°2 - Ex-Marché Djémadjé (Ministère du Commerce)",
    "Pas de préférence"
  ];

  // Tous les stands sont uniformes de 4m²
  const tailleStandUniforme = "4 m²";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 0) {
      if (!formData.typeInscription) newErrors.typeInscription = "Veuillez choisir pour qui vous inscrivez";
      if (!formData.localisation) newErrors.localisation = "Veuillez indiquer votre localisation";
      if (formData.localisation === 'region' && !formData.region) {
        newErrors.region = "Veuillez sélectionner votre région";
      }
    }

    if (step === 1) {
      if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
      if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
      if (!formData.nationalite.trim()) newErrors.nationalite = "La nationalité est requise";
      if (!formData.age.trim()) newErrors.age = "L'âge est requis";
      else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
        newErrors.age = "L'âge doit être entre 18 et 100 ans";
      }
      if (!formData.sexe) newErrors.sexe = "Le sexe est requis";
      if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
      else if (!/^\+?227\s?[0-9]{8}$/.test(formData.telephone.replace(/\s/g, ''))) {
        newErrors.telephone = "Format invalide (ex: +227 90123456)";
      }
      // Email optionnel mais doit être valide s'il est fourni
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
      }
      if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est requise";
    }

    if (step === 2) {
      if (!formData.secteurActivite) newErrors.secteurActivite = "Le secteur d'activité est requis";
      if (!formData.produitsProposés.trim()) newErrors.produitsProposés = "Les produits proposés sont requis";
      if (!formData.listeProduitsDetaillée.trim()) newErrors.listeProduitsDetaillée = "La liste détaillée des produits est requise";
      if (!formData.capaciteProduction.trim()) newErrors.capaciteProduction = "La capacité de production est requise";
      if (!formData.experienceAnterieure.trim()) newErrors.experienceAnterieure = "L'expérience antérieure est requise";
    }

    if (step === 3) {
      if (!formData.sitePreference) newErrors.sitePreference = "Veuillez choisir un site";
      // Tous les stands sont uniformes de 4m² - pas de validation nécessaire
      if (!formData.nombreEmployes.trim()) newErrors.nombreEmployes = "Le nombre d'employés est requis";
      if (!formData.acceptEngagement) newErrors.acceptEngagement = "Vous devez accepter l'engagement";
      if (!formData.acceptFraisStand) newErrors.acceptFraisStand = "Vous devez accepter de prendre en charge les frais de stand";
      if (!formData.carteIdentite) newErrors.carteIdentite = "La carte d'identité est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4)); // 4 étapes maintenant
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0)); // Peut revenir à l'étape 0
  };

  const uploadFile = async (file: File | null): Promise<string | null> => {
    if (!file) return null;
    
    const fileFormData = new FormData();
    fileFormData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: fileFormData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.url;
      } else {
        console.error('Erreur upload:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload des fichiers d'abord
      let carteIdentiteUrl = null;
      let registreCommerceDocUrl = null;
      let listeProduitsFileUrl = null;
      
      if (formData.carteIdentite) {
        carteIdentiteUrl = await uploadFile(formData.carteIdentite);
        if (!carteIdentiteUrl) {
          alert('Erreur lors de l\'upload de la carte d\'identité. Veuillez réessayer.');
          setIsSubmitting(false);
          return;
        }
      }
      
      if (formData.registreCommerceDoc) {
        registreCommerceDocUrl = await uploadFile(formData.registreCommerceDoc);
      }
      
      if (formData.listeProduitsFile) {
        listeProduitsFileUrl = await uploadFile(formData.listeProduitsFile);
      }

      // Préparer les données à envoyer (sans les objets File)
      const dataToSend = {
        ...formData,
        tailleKiosque: tailleStandUniforme, // Tous les stands sont uniformes de 4m²
        carteIdentiteUrl,
        registreCommerceDocUrl,
        listeProduitsFileUrl,
        // Retirer les objets File
        carteIdentite: undefined,
        registreCommerceDoc: undefined,
        listeProduitsFile: undefined,
      };

      // Envoyer les données à l'API
      const response = await fetch('/api/demandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        // Stocker le numéro de référence dans le localStorage pour l'afficher
        localStorage.setItem('lastReferenceNumber', result.numeroReference);
        setIsSuccess(true);
      } else {
        alert(result.message || 'Une erreur est survenue lors de l\'envoi de votre demande.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      alert('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    // Récupérer le numéro de référence depuis le localStorage
    const referenceNumber = localStorage.getItem('lastReferenceNumber') || `EXP-${Date.now().toString().slice(-8)}`;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Header */}
        <Header />

        {/* Success Message */}
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="glass-effect rounded-3xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Inscription Réussie !
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Votre demande d'inscription a été soumise avec succès et enregistrée dans notre base de données. Notre équipe va l'examiner et vous contacter dans les 48 heures.
            </p>
            <div className="glass-effect rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Prochaines étapes :</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">1.</span>
                  <span>Vérification de votre dossier par nos services (24-48h)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">2.</span>
                  <span>Vous recevrez un email de confirmation avec les détails</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">3.</span>
                  <span>Attribution d'un kiosque selon disponibilité</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">4.</span>
                  <span>Signature du contrat et paiement de la caution</span>
                </li>
              </ul>
            </div>
            <div className="bg-accent-50 rounded-2xl p-6 mb-8 border-2 border-accent-200">
              <p className="text-accent-900 font-semibold mb-2">Numéro de référence :</p>
              <p className="text-3xl font-bold text-accent-600">
                {referenceNumber}
              </p>
              <p className="text-sm text-accent-700 mt-2">
                Conservez ce numéro pour suivre votre demande
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/suivi-demande"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover-lift shadow-lg flex items-center justify-center space-x-2"
              >
                <FaCheckCircle />
                <span>Suivre ma demande</span>
              </Link>
              <Link 
                href="/"
                className="px-8 py-4 glass-effect text-primary-700 rounded-xl font-semibold hover-lift flex items-center justify-center"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-medium mb-4">
            <FaStore />
            <span>Devenez Exposant</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Inscrivez-vous comme <span className="gradient-text">Exposant</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Rejoignez le Marché de la Réfondation et valorisez vos produits locaux dans un espace moderne et stratégique
          </p>
        </div>
      </section>

      {/* Fiches Sectorielles */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass-effect rounded-3xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mr-4">
              <FaFileAlt className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Fiches Sectorielles</h3>
              <p className="text-gray-600">Consultez les secteurs d'activité éligibles</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Fiche 1 - Artisanat de Transformation/Production */}
            <a
              href="/Fiche_Artisanat_de_Transformation_Production.docx"
              download
              className="glass-effect rounded-2xl p-6 hover-lift transition-all group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaIndustry className="text-white text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Artisanat de Transformation</h4>
                  <p className="text-sm text-gray-600 mb-3">Production & transformation des matières premières</p>
                  <div className="flex items-center justify-center space-x-2 text-primary-600 font-semibold">
                    <FaUpload className="text-sm" />
                    <span>Télécharger</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Fiche 2 - Artisanat de Service */}
            <a
              href="/Fiche_Artisanat_de_Service.docx"
              download
              className="glass-effect rounded-2xl p-6 hover-lift transition-all group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MdBusiness className="text-white text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Artisanat de Service</h4>
                  <p className="text-sm text-gray-600 mb-3">Prestations artisanales techniques & utilitaires</p>
                  <div className="flex items-center justify-center space-x-2 text-primary-600 font-semibold">
                    <FaUpload className="text-sm" />
                    <span>Télécharger</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Fiche 3 - Artisanat d'Art */}
            <a
              href="/Fiche_Artisanat_d_Art.docx"
              download
              className="glass-effect rounded-2xl p-6 hover-lift transition-all group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaStore className="text-white text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Artisanat d'Art</h4>
                  <p className="text-sm text-gray-600 mb-3">Créativité & forte connotation culturelle</p>
                  <div className="flex items-center justify-center space-x-2 text-primary-600 font-semibold">
                    <FaUpload className="text-sm" />
                    <span>Télécharger</span>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl border-2 border-accent-200">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-semibold text-accent-700">💡 Conseil :</span> Consultez ces fiches pour identifier le secteur qui correspond à votre activité avant de remplir le formulaire.
            </p>
          </div>
        </div>
      </div>

      {/* Information sur le paiement */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-3xl p-8 border-2 border-amber-300 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-4xl">💰</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">⚠️</span>
                Information Importante
              </h3>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border-2 border-amber-300">
                <p className="text-lg text-gray-800 mb-4 leading-relaxed">
                  L'attribution du stand est soumise au <span className="font-bold text-amber-700">paiement de 100 000 Francs CFA</span>.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                    <p className="text-gray-700 text-sm">Ce montant sera payable uniquement après la validation de votre candidature</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                    <p className="text-gray-700 text-sm">Vous serez contacté pour le paiement après sélection</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                    <p className="text-gray-700 text-sm">Le paiement garantit votre place et l'attribution définitive du kiosque</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border-l-4 border-amber-600">
                <p className="text-sm font-medium text-amber-900">
                  📋 En continuant votre inscription, vous confirmez avoir pris connaissance de cette condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                  currentStep >= step
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium">
            <span className={currentStep >= 0 ? 'text-primary-600' : 'text-gray-500'}>
              Préliminaire
            </span>
            <span className={currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'}>
              Informations
            </span>
            <span className={currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'}>
              Activité
            </span>
            <span className={currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'}>
              Documents
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-8">
          {/* Step 0: Questions préliminaires */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informations Préliminaires
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  <FaUser className="inline mr-2 text-primary-600" />
                  Pour qui faites-vous cette inscription ? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="typeInscription"
                      value="moi-meme"
                      checked={formData.typeInscription === 'moi-meme'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Pour moi-même</p>
                      <p className="text-sm text-gray-600">Je m'inscris personnellement comme exposant</p>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="typeInscription"
                      value="autre-personne"
                      checked={formData.typeInscription === 'autre-personne'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Pour une autre personne</p>
                      <p className="text-sm text-gray-600">J'inscris quelqu'un d'autre comme exposant</p>
                    </div>
                  </label>
                </div>
                {errors.typeInscription && <p className="text-red-500 text-sm mt-2">{errors.typeInscription}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                  Où êtes-vous situé ? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="localisation"
                      value="niamey"
                      checked={formData.localisation === 'niamey'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Niamey</p>
                      <p className="text-sm text-gray-600">Je suis dans la capitale</p>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="localisation"
                      value="region"
                      checked={formData.localisation === 'region'}
                      onChange={handleInputChange}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">En région</p>
                      <p className="text-sm text-gray-600">Je suis dans une autre région du Niger</p>
                    </div>
                  </label>
                </div>
                {errors.localisation && <p className="text-red-500 text-sm mt-2">{errors.localisation}</p>}
              </div>

              {formData.localisation === 'region' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                    Sélectionnez votre région *
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.region ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez une région...</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Informations personnelles */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informations Personnelles
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-primary-600" />
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.nom ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-primary-600" />
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.prenom ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaIdCard className="inline mr-2 text-primary-600" />
                    Nationalité *
                  </label>
                  <input
                    type="text"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.nationalite ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Ex: Niger"
                  />
                  {errors.nationalite && <p className="text-red-500 text-sm mt-1">{errors.nationalite}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-primary-600" />
                    Âge *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.age ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Ex: 35"
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-primary-600" />
                    Sexe *
                  </label>
                  <select
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.sexe ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                  {errors.sexe && <p className="text-red-500 text-sm mt-1">{errors.sexe}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaPhone className="inline mr-2 text-primary-600" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.telephone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="+227 90 12 34 56"
                  />
                  {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-primary-600" />
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                  Adresse complète *
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.adresse ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Quartier, rue, ville"
                />
                {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Activité et Production */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Description de l'Activité
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MdBusiness className="inline mr-2 text-primary-600" />
                    Nom de l'entreprise/Groupement (si applicable)
                  </label>
                  <input
                    type="text"
                    name="nomEntreprise"
                    value={formData.nomEntreprise}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Nom de votre entreprise ou groupement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaIndustry className="inline mr-2 text-primary-600" />
                    Secteur d'activité *
                  </label>
                  <select
                    name="secteurActivite"
                    value={formData.secteurActivite}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.secteurActivite ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez...</option>
                    {secteurs.map(secteur => (
                      <option key={secteur} value={secteur}>{secteur}</option>
                    ))}
                  </select>
                  {errors.secteurActivite && <p className="text-red-500 text-sm mt-1">{errors.secteurActivite}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaFileAlt className="inline mr-2 text-primary-600" />
                  Registre de commerce / Agrément
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="registreCommerce"
                      value="Oui"
                      checked={formData.registreCommerce === 'Oui'}
                      onChange={handleInputChange}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Oui</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="registreCommerce"
                      value="Non"
                      checked={formData.registreCommerce === 'Non'}
                      onChange={handleInputChange}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Non</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaStore className="inline mr-2 text-primary-600" />
                  Produits proposés (transformés/fabriqués au Niger) *
                </label>
                <input
                  type="text"
                  name="produitsProposés"
                  value={formData.produitsProposés}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.produitsProposés ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Ex: Huile d'arachide, savon liquide, etc."
                />
                {errors.produitsProposés && <p className="text-red-500 text-sm mt-1">{errors.produitsProposés}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MdDescription className="inline mr-2 text-primary-600" />
                  Liste détaillée des produits *
                </label>
                <textarea
                  name="listeProduitsDetaillée"
                  value={formData.listeProduitsDetaillée}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                    errors.listeProduitsDetaillée ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Décrivez en détail tous vos produits..."
                />
                {errors.listeProduitsDetaillée && <p className="text-red-500 text-sm mt-1">{errors.listeProduitsDetaillée}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaIndustry className="inline mr-2 text-primary-600" />
                  Capacité de production mensuelle *
                </label>
                <input
                  type="text"
                  name="capaciteProduction"
                  value={formData.capaciteProduction}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.capaciteProduction ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Ex: 500 litres d'huile, 1000 savons, etc."
                />
                {errors.capaciteProduction && <p className="text-red-500 text-sm mt-1">{errors.capaciteProduction}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCheckCircle className="inline mr-2 text-primary-600" />
                  Expérience antérieure (foires, marchés, expositions) *
                </label>
                <textarea
                  name="experienceAnterieure"
                  value={formData.experienceAnterieure}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                    errors.experienceAnterieure ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Décrivez votre expérience dans les foires et marchés..."
                />
                {errors.experienceAnterieure && <p className="text-red-500 text-sm mt-1">{errors.experienceAnterieure}</p>}
              </div>

              {/* Informations supplémentaires pour l'évaluation */}
              <div className="border-t-2 border-primary-200 pt-6 mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 text-primary-700">
                  📋 Informations complémentaires pour l'évaluation
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Origine des matières premières
                    </label>
                    <select
                      name="origineMatieresPremieres"
                      value={formData.origineMatieresPremieres}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="100% locale">100% locale (Niger)</option>
                      <option value="Majoritairement locale">Majoritairement locale (&gt;50%)</option>
                      <option value="Partiellement locale">Partiellement locale (&lt;50%)</option>
                      <option value="Importée">Importée</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transformation/Fabrication au Niger
                    </label>
                    <select
                      name="transformationAuNiger"
                      value={formData.transformationAuNiger}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="Oui, 100%">Oui, entièrement au Niger</option>
                      <option value="Partiellement">Partiellement au Niger</option>
                      <option value="Non">Non</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Innovation dans vos produits
                  </label>
                  <input
                    type="text"
                    name="innovation"
                    value={formData.innovation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Décrivez l'innovation (nouveau procédé, emballage, formule...)"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Régularité de l'approvisionnement
                    </label>
                    <select
                      name="regulariteApprovisionnement"
                      value={formData.regulariteApprovisionnement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="Quotidien">Quotidien</option>
                      <option value="Hebdomadaire">Hebdomadaire</option>
                      <option value="Mensuel">Mensuel</option>
                      <option value="Selon demande">Selon demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacité d'adaptation à la demande
                    </label>
                    <select
                      name="adaptationDemandeCroissante"
                      value={formData.adaptationDemandeCroissante}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="Très flexible">Très flexible (+100%)</option>
                      <option value="Flexible">Flexible (+50%)</option>
                      <option value="Peu flexible">Peu flexible (+25%)</option>
                      <option value="Fixe">Capacité fixe</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre de femmes dans votre équipe
                    </label>
                    <input
                      type="number"
                      name="nombreFemmes"
                      value={formData.nombreFemmes}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Ex: 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre de jeunes (18-35 ans) dans votre équipe
                    </label>
                    <input
                      type="number"
                      name="nombreJeunes"
                      value={formData.nombreJeunes}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Ex: 2"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certificat de conformité / Normes de qualité
                  </label>
                  <select
                    name="certificatConformite"
                    value={formData.certificatConformite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="Oui, certifié">Oui, j'ai un certificat</option>
                    <option value="En cours">En cours d'obtention</option>
                    <option value="Engagement">Je m'engage à respecter les normes</option>
                    <option value="Non">Non</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Demande et documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Votre Demande
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                  Préférence de site *
                </label>
                <select
                  name="sitePreference"
                  value={formData.sitePreference}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.sitePreference ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Sélectionnez un site...</option>
                  {sites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
                {errors.sitePreference && <p className="text-red-500 text-sm mt-1">{errors.sitePreference}</p>}
              </div>

              {/* Information sur la taille uniforme des stands */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border-2 border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                      <FaStore className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Taille des stands
                    </h4>
                    <p className="text-gray-700 mb-3">
                      Tous les stands du Marché de la Réfondation sont uniformes pour garantir l'équité entre les exposants.
                    </p>
                    <div className="bg-white rounded-xl p-4 border-2 border-primary-300">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Surface attribuée :</span>
                        <span className="text-2xl font-bold text-primary-600">{tailleStandUniforme}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-primary-600" />
                  Nombre d'employés prévus *
                </label>
                <input
                  type="number"
                  name="nombreEmployes"
                  value={formData.nombreEmployes}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.nombreEmployes ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Ex: 2"
                />
                {errors.nombreEmployes && <p className="text-red-500 text-sm mt-1">{errors.nombreEmployes}</p>}
              </div>

              <div className="border-t-2 border-gray-200 pt-6 mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Documents requis
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaIdCard className="inline mr-2 text-primary-600" />
                      Carte d'identité nationale * (PDF ou Image)
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-primary-500 transition-all cursor-pointer ${
                      errors.carteIdentite ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        id="carteIdentite"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'carteIdentite')}
                        className="hidden"
                      />
                      <label htmlFor="carteIdentite" className="cursor-pointer">
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">
                          {formData.carteIdentite ? formData.carteIdentite.name : 'Cliquez pour télécharger'}
                        </p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                    {errors.carteIdentite && <p className="text-red-500 text-sm mt-1">{errors.carteIdentite}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaFileAlt className="inline mr-2 text-primary-600" />
                      Registre de commerce (optionnel)
                    </label>
                    <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary-500 transition-all cursor-pointer border-gray-300">
                      <input
                        type="file"
                        id="registreCommerceDoc"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'registreCommerceDoc')}
                        className="hidden"
                      />
                      <label htmlFor="registreCommerceDoc" className="cursor-pointer">
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">
                          {formData.registreCommerceDoc ? formData.registreCommerceDoc.name : 'Cliquez pour télécharger'}
                        </p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaFileAlt className="inline mr-2 text-primary-600" />
                      Liste des produits (optionnel)
                    </label>
                    <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary-500 transition-all cursor-pointer border-gray-300">
                      <input
                        type="file"
                        id="listeProduitsFile"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'listeProduitsFile')}
                        className="hidden"
                      />
                      <label htmlFor="listeProduitsFile" className="cursor-pointer">
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">
                          {formData.listeProduitsFile ? formData.listeProduitsFile.name : 'Cliquez pour télécharger'}
                        </p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6 mt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Engagement du candidat
                </h4>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="acceptEngagement"
                        checked={formData.acceptEngagement}
                        onChange={handleInputChange}
                        className={`mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500 rounded ${
                          errors.acceptEngagement ? 'border-red-500' : ''
                        }`}
                      />
                      <div>
                        <p className="text-gray-700 font-medium">
                          Je m'engage à respecter le règlement du Marché de la Réfondation et les normes d'hygiène et de sécurité. *
                        </p>
                        {errors.acceptEngagement && <p className="text-red-500 text-sm mt-1">{errors.acceptEngagement}</p>}
                      </div>
                    </label>
                  </div>

                  <div className="bg-accent-50 rounded-xl p-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="acceptFraisStand"
                        checked={formData.acceptFraisStand}
                        onChange={handleInputChange}
                        className={`mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500 rounded ${
                          errors.acceptFraisStand ? 'border-red-500' : ''
                        }`}
                      />
                      <div>
                        <p className="text-gray-700 font-medium">
                          Je comprends que les candidats sélectionnés prendront en charge les frais de stands. *
                        </p>
                        {errors.acceptFraisStand && <p className="text-red-500 text-sm mt-1">{errors.acceptFraisStand}</p>}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 glass-effect text-primary-700 rounded-xl font-semibold hover-lift flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Précédent</span>
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover-lift"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover-lift shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>Soumettre ma demande</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

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
                Initiative du Ministère du Commerce et de l'Industrie du Niger
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-white/80 mb-2">Niamey, Niger</p>
              <p className="text-white/80">Centenaire de Niamey 2026</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Informations</h4>
              <ul className="space-y-2 text-white/80">
                <li>1 500 kiosques disponibles</li>
                <li>2 sites stratégiques</li>
                <li>Support aux entrepreneurs</li>
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
