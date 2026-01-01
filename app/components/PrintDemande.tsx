"use client";

import { FaPrint } from "react-icons/fa";

interface PrintDemandeProps {
  demande: any;
}

export default function PrintDemande({ demande }: PrintDemandeProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Bouton d'impression - visible à l'écran uniquement */}
      <button
        onClick={handlePrint}
        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors print:hidden"
      >
        <FaPrint className="text-lg" />
        <span>Imprimer la Demande</span>
      </button>

      {/* Contenu d'impression - masqué à l'écran, visible à l'impression */}
      <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-8">
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content,
            .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              margin: 2cm;
              size: A4;
            }
          }
        `}</style>

        <div className="print-content">
          {/* En-tête */}
          <div className="border-b-4 border-primary-600 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  DEMANDE D'INSCRIPTION
                </h1>
                <p className="text-lg text-gray-600">Marché de la Réfondation - Centenaire de Niamey 2026</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Numéro de référence</p>
                <p className="text-2xl font-bold text-primary-600">{demande.id}</p>
                <p className="text-sm text-gray-600 mt-2">Date: {demande.date}</p>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border-l-4 border-primary-600">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Statut de la demande:</p>
              <span className={`px-4 py-2 text-sm font-bold rounded-full ${
                demande.statusBrut === 'EN_ATTENTE' 
                  ? 'text-yellow-700 bg-yellow-100 border border-yellow-300' 
                  : demande.statusBrut === 'APPROUVE'
                  ? 'text-green-700 bg-green-100 border border-green-300'
                  : 'text-red-700 bg-red-100 border border-red-300'
              }`}>
                {demande.statut}
              </span>
            </div>
          </div>

          {/* Section 1: Informations Personnelles */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              1. INFORMATIONS PERSONNELLES
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Nom complet</p>
                <p className="font-semibold text-gray-900">{demande.nom}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Nationalité</p>
                <p className="font-semibold text-gray-900">{demande.nationalite || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Âge</p>
                <p className="font-semibold text-gray-900">{demande.age || 'N/A'} ans</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Sexe</p>
                <p className="font-semibold text-gray-900">{demande.sexe || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Téléphone</p>
                <p className="font-semibold text-gray-900">{demande.telephone}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Email</p>
                <p className="font-semibold text-gray-900">{demande.email}</p>
              </div>
              <div className="border-b border-gray-200 pb-2 col-span-2">
                <p className="text-xs text-gray-500 uppercase">Adresse</p>
                <p className="font-semibold text-gray-900">{demande.adresse}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Informations de l'Entreprise */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              2. INFORMATIONS DE L'ENTREPRISE
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Nom de l'entreprise</p>
                <p className="font-semibold text-gray-900">{demande.entreprise}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Type d'inscription</p>
                <p className="font-semibold text-gray-900">{demande.typeInscription || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Registre de commerce</p>
                <p className="font-semibold text-gray-900">{demande.registreCommerce || 'Non fourni'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Secteur d'activité</p>
                <p className="font-semibold text-gray-900">{demande.secteur}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Nombre d'employés</p>
                <p className="font-semibold text-gray-900">{demande.employes}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Expérience antérieure</p>
                <p className="font-semibold text-gray-900">{demande.experience}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Localisation */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              3. LOCALISATION
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Région</p>
                <p className="font-semibold text-gray-900">{demande.region || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Localisation précise</p>
                <p className="font-semibold text-gray-900">{demande.localisation || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2 col-span-2">
                <p className="text-xs text-gray-500 uppercase">Site de préférence</p>
                <p className="font-semibold text-gray-900">{demande.sitePreference || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Produits et Production */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              4. PRODUITS ET PRODUCTION
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="border-b border-gray-200 pb-2 col-span-2">
                <p className="text-xs text-gray-500 uppercase">Produits proposés</p>
                <p className="font-semibold text-gray-900">{demande.produits}</p>
              </div>
              {demande.listeProduitsDetaillee && (
                <div className="border-b border-gray-200 pb-2 col-span-2">
                  <p className="text-xs text-gray-500 uppercase">Liste détaillée des produits</p>
                  <p className="font-semibold text-gray-900 whitespace-pre-line">{demande.listeProduitsDetaillee}</p>
                </div>
              )}
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Capacité de production mensuelle</p>
                <p className="font-semibold text-gray-900">{demande.capaciteProduction || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Taille de kiosque souhaitée</p>
                <p className="font-semibold text-gray-900">{demande.tailleKiosque || 'N/A'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2 col-span-2">
                <p className="text-xs text-gray-500 uppercase">Expérience antérieure</p>
                <p className="font-semibold text-gray-900">{demande.experience || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Informations complémentaires pour l'évaluation */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              5. INFORMATIONS COMPLÉMENTAIRES POUR L'ÉVALUATION
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Origine des matières premières</p>
                <p className="font-semibold text-gray-900">{demande.origineMatieresPremieres || 'Non spécifié'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Transformation/Fabrication au Niger</p>
                <p className="font-semibold text-gray-900">{demande.transformationAuNiger || 'Non spécifié'}</p>
              </div>
              {demande.innovation && (
                <div className="border-b border-gray-200 pb-2 col-span-2">
                  <p className="text-xs text-gray-500 uppercase">Innovation dans les produits</p>
                  <p className="font-semibold text-gray-900">{demande.innovation}</p>
                </div>
              )}
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Régularité de l'approvisionnement</p>
                <p className="font-semibold text-gray-900">{demande.regulariteApprovisionnement || 'Non spécifié'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Capacité d'adaptation à la demande</p>
                <p className="font-semibold text-gray-900">{demande.adaptationDemandeCroissante || 'Non spécifié'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Nombre de femmes dans l'équipe</p>
                <p className="font-semibold text-gray-900">{demande.nombreFemmes !== undefined ? demande.nombreFemmes : 'Non spécifié'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs text-gray-500 uppercase">Nombre de jeunes (18-35 ans)</p>
                <p className="font-semibold text-gray-900">{demande.nombreJeunes !== undefined ? demande.nombreJeunes : 'Non spécifié'}</p>
              </div>
              <div className="border-b border-gray-200 pb-2 col-span-2">
                <p className="text-xs text-gray-500 uppercase">Certificat de conformité / Normes de qualité</p>
                <p className="font-semibold text-gray-900">{demande.certificatConformite || 'Non spécifié'}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Documents Joints */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
              5. DOCUMENTS JOINTS
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-300 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase mb-1">Carte d'identité</p>
                <p className="font-semibold text-sm text-gray-900">
                  {demande.carteIdentiteUrl ? '✓ Fourni' : '✗ Non fourni'}
                </p>
                {demande.carteIdentiteUrl && (
                  <p className="text-xs text-gray-600 mt-1 break-all">{demande.carteIdentiteUrl}</p>
                )}
              </div>
              <div className="border border-gray-300 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase mb-1">Registre de commerce</p>
                <p className="font-semibold text-sm text-gray-900">
                  {demande.registreCommerceDocUrl ? '✓ Fourni' : '✗ Non fourni'}
                </p>
                {demande.registreCommerceDocUrl && (
                  <p className="text-xs text-gray-600 mt-1 break-all">{demande.registreCommerceDocUrl}</p>
                )}
              </div>
              <div className="border border-gray-300 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase mb-1">Liste des produits</p>
                <p className="font-semibold text-sm text-gray-900">
                  {demande.listeProduitsFileUrl ? '✓ Fourni' : '✗ Non fourni'}
                </p>
                {demande.listeProduitsFileUrl && (
                  <p className="text-xs text-gray-600 mt-1 break-all">{demande.listeProduitsFileUrl}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-8 pt-4 border-t-2 border-gray-300">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div>
                <p className="font-semibold">Marché de la Réfondation</p>
                <p>Centenaire de Niamey 2026</p>
              </div>
              <div className="text-right">
                <p>Ministère du Commerce et de l'Industrie</p>
                <p>Document imprimé le {new Date().toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
