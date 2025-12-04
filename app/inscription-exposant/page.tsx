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
  // Informations personnelles
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  
  // Informations entreprise
  nomEntreprise: string;
  typeActivite: string;
  categorieProduits: string;
  descriptionActivite: string;
  
  // Informations demande
  sitePreference: string;
  tailleKiosque: string;
  nombreEmployes: string;
  
  // Documents
  carteIdentite: File | null;
  registreCommerce: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export default function InscriptionExposantPage() {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    nomEntreprise: '',
    typeActivite: '',
    categorieProduits: '',
    descriptionActivite: '',
    sitePreference: '',
    tailleKiosque: '',
    nombreEmployes: '',
    carteIdentite: null,
    registreCommerce: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    "Agroalimentaire",
    "Cosmétiques",
    "Textile & Artisanat",
    "Produits laitiers",
    "Fruits et légumes",
    "Céréales et légumineuses",
    "Artisanat traditionnel",
    "Bijoux et accessoires",
    "Autre"
  ];

  const typesActivite = [
    "Production",
    "Transformation",
    "Commerce",
    "Artisanat"
  ];

  const sites = [
    "Site N°1 - Ex-OPVN (Rond-point Maourey)",
    "Site N°2 - Ex-Marché Djémadjé (Ministère du Commerce)",
    "Pas de préférence"
  ];

  const taillesKiosque = [
    "Petit (10 m²)",
    "Moyen (20 m²)",
    "Grand (30 m²)"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    if (step === 1) {
      if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
      if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
      if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
      else if (!/^\+?227\s?[0-9]{8}$/.test(formData.telephone.replace(/\s/g, ''))) {
        newErrors.telephone = "Format invalide (ex: +227 90123456)";
      }
      if (!formData.email.trim()) newErrors.email = "L'email est requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
      }
      if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est requise";
    }

    if (step === 2) {
      if (!formData.nomEntreprise.trim()) newErrors.nomEntreprise = "Le nom de l'entreprise est requis";
      if (!formData.typeActivite) newErrors.typeActivite = "Le type d'activité est requis";
      if (!formData.categorieProduits) newErrors.categorieProduits = "La catégorie est requise";
      if (!formData.descriptionActivite.trim()) newErrors.descriptionActivite = "La description est requise";
      else if (formData.descriptionActivite.length < 50) {
        newErrors.descriptionActivite = "La description doit contenir au moins 50 caractères";
      }
    }

    if (step === 3) {
      if (!formData.sitePreference) newErrors.sitePreference = "Veuillez choisir un site";
      if (!formData.tailleKiosque) newErrors.tailleKiosque = "Veuillez choisir une taille";
      if (!formData.nombreEmployes.trim()) newErrors.nombreEmployes = "Le nombre d'employés est requis";
      if (!formData.carteIdentite) newErrors.carteIdentite = "La carte d'identité est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Log the form data (in production, this would be sent to an API)
      console.log('Form submitted:', formData);
    }, 2000);
  };

  if (isSuccess) {
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
              Votre demande d'inscription a été soumise avec succès. Notre équipe va l'examiner et vous contacter dans les 48 heures.
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
                EXP-{Date.now().toString().slice(-8)}
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
      <section className="py-12 px-4 sm:px-6 lg:px-8">
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

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
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
            <span className={currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'}>
              Informations personnelles
            </span>
            <span className={currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'}>
              Entreprise
            </span>
            <span className={currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'}>
              Demande & Documents
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-8">
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
                    Email *
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

          {/* Step 2: Informations entreprise */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informations sur votre Entreprise
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MdBusiness className="inline mr-2 text-primary-600" />
                  Nom de l'entreprise / Coopérative *
                </label>
                <input
                  type="text"
                  name="nomEntreprise"
                  value={formData.nomEntreprise}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.nomEntreprise ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Nom de votre entreprise"
                />
                {errors.nomEntreprise && <p className="text-red-500 text-sm mt-1">{errors.nomEntreprise}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaIndustry className="inline mr-2 text-primary-600" />
                    Type d'activité *
                  </label>
                  <select
                    name="typeActivite"
                    value={formData.typeActivite}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.typeActivite ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez...</option>
                    {typesActivite.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.typeActivite && <p className="text-red-500 text-sm mt-1">{errors.typeActivite}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaStore className="inline mr-2 text-primary-600" />
                    Catégorie de produits *
                  </label>
                  <select
                    name="categorieProduits"
                    value={formData.categorieProduits}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.categorieProduits ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.categorieProduits && <p className="text-red-500 text-sm mt-1">{errors.categorieProduits}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MdDescription className="inline mr-2 text-primary-600" />
                  Description détaillée de votre activité * (min. 50 caractères)
                </label>
                <textarea
                  name="descriptionActivite"
                  value={formData.descriptionActivite}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                    errors.descriptionActivite ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Décrivez votre activité, vos produits, votre expérience..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.descriptionActivite && (
                    <p className="text-red-500 text-sm">{errors.descriptionActivite}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.descriptionActivite.length} / 500
                  </p>
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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaStore className="inline mr-2 text-primary-600" />
                    Taille de kiosque souhaitée *
                  </label>
                  <select
                    name="tailleKiosque"
                    value={formData.tailleKiosque}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      errors.tailleKiosque ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez...</option>
                    {taillesKiosque.map(taille => (
                      <option key={taille} value={taille}>{taille}</option>
                    ))}
                  </select>
                  {errors.tailleKiosque && <p className="text-red-500 text-sm mt-1">{errors.tailleKiosque}</p>}
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
                        id="registreCommerce"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'registreCommerce')}
                        className="hidden"
                      />
                      <label htmlFor="registreCommerce" className="cursor-pointer">
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">
                          {formData.registreCommerce ? formData.registreCommerce.name : 'Cliquez pour télécharger'}
                        </p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
            {currentStep > 1 && (
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
                Initiative du Ministère du Commerce et de l'Industrie de la République du Niger
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-white/80 mb-2">Niamey, République du Niger</p>
              <p className="text-white/80">Centenaire de Niamey 2026</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Informations</h4>
              <ul className="space-y-2 text-white/80">
                <li>1 054 kiosques disponibles</li>
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
