'use client';

import Header from '../components/Header';
import { FaDownload, FaFileAlt, FaCheckCircle, FaInfoCircle, FaClipboardList, FaGavel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export default function ReglementPage() {
  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - margin * 2;
    let yPosition = 20;

    // Ajouter le logo
    const logoUrl = '/marchedela.png';
    const logoImg = new Image();
    logoImg.src = logoUrl;
    
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });
    
    // Centrer le logo avec les bonnes proportions (logo rectangulaire)
    const logoWidth = 100;
    const logoHeight = 30;
    doc.addImage(logoImg, 'PNG', (pageWidth - logoWidth) / 2, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 15;

    // Titre principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const title = 'RÈGLEMENT DE SÉLECTION DES OCCUPANTS';
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    doc.text('DU MARCHÉ DE LA REFONDATION', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Description
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    const description = doc.splitTextToSize(
      'Ce règlement est conçu pour assurer la transparence, l\'équité et la promotion des produits transformés/fabriqués au Niger.',
      textWidth
    );
    doc.text(description, margin, yPosition);
    yPosition += description.length * 5 + 10;
    
    // Articles
    const articles = [
      {
        titre: 'Article premier : Objet',
        contenu: 'Le présent règlement définit les conditions, critères et procédures de sélection des occupants des stands du Marché de la Refondation, organisé par le Ministère du Commerce et de l\'Industrie en partenariat avec la Ville de Niamey.'
      },
      {
        titre: 'Article 2 : Principes directeurs',
        contenu: 'La sélection des occupants repose sur les principes suivants :',
        liste: [
          'Transparence et équité du processus',
          'Promotion des produits transformés/fabriqués au Niger',
          'Inclusion des jeunes, des femmes et des groupements',
          'Respect des normes de qualité'
        ]
      },
      {
        titre: 'Article 3 : Conditions d\'éligibilité',
        contenu: 'Peuvent postuler :',
        liste: [
          'Les entreprises, coopératives ou groupements constitués au Niger',
          'Les producteurs, transformateurs dans les trois corps de métiers retenus dont les produits sont transformés/fabriqués localement',
          'Les candidats disposant d\'un dossier complet (fiche de candidature, justificatifs, description des produits)'
        ]
      },
      {
        titre: 'Article 4 : Critères de sélection',
        contenu: 'Les candidatures seront évaluées selon les critères suivants :',
        liste: [
          'Pertinence des produits proposés (transformés/fabriqués au Niger)',
          'Capacité de production',
          'Contribution sociale (emplois, inclusion des jeunes et des femmes)',
          'Respect des normes de qualité'
        ]
      },
      {
        titre: 'Article 5 : Procédure de sélection',
        contenu: '',
        procedure: [
          { titre: 'Dépôt des candidatures', desc: 'les candidats remplissent la fiche de candidature et déposent leur dossier dans les délais fixés' },
          { titre: 'Examen des dossiers', desc: 'le comité réceptionne, examine et évalue les candidatures à l\'aide de la fiche d\'évaluation' },
          { titre: 'Délibération', desc: 'les membres du comité délibèrent et établissent une liste provisoire des candidats retenus' },
          { titre: 'Publication', desc: 'la liste définitive est validée à travers un texte règlementaire et publiée officiellement' },
          { titre: 'Attribution des stands', desc: 'les stands sont répartis selon le plan d\'occupation et attribués aux candidats sélectionnés' }
        ]
      },
      {
        titre: 'Article 6 : Obligations des bénéficiaires',
        contenu: 'Les occupants sélectionnés s\'engagent à :',
        liste: [
          'Respecter le règlement du marché',
          'Maintenir leurs stands en bon état et propres',
          'Commercialiser exclusivement les produits déclarés dans leur dossier',
          'Coopérer aux activités de suivi-évaluation organisées par le comité',
          'S\'engager à respecter les normes de qualité relatives aux produits commercialisés'
        ]
      },
      {
        titre: 'Article 7 : Dispositions finales',
        contenu: 'Le présent règlement entre en vigueur dès son adoption par le comité ad hoc et reste applicable pendant toute la durée du Marché de la Refondation.'
      }
    ];
    
    // Ajout des articles
    articles.forEach((article) => {
      // Vérifier s'il faut changer de page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Titre de l'article
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      const titreLines = doc.splitTextToSize(article.titre, textWidth);
      doc.text(titreLines, margin, yPosition);
      yPosition += titreLines.length * 5 + 5;
      
      // Contenu de l'article
      if (article.contenu) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const contenuLines = doc.splitTextToSize(article.contenu, textWidth);
        doc.text(contenuLines, margin, yPosition);
        yPosition += contenuLines.length * 5 + 3;
      }
      
      // Liste à puces
      if (article.liste) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        article.liste.forEach((item) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          const itemLines = doc.splitTextToSize(`• ${item}`, textWidth - 5);
          doc.text(itemLines, margin + 5, yPosition);
          yPosition += itemLines.length * 5 + 2;
        });
      }
      
      // Procédure
      if (article.procedure) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        article.procedure.forEach((proc) => {
          if (yPosition > 260) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFont('helvetica', 'bold');
          const procTitreLines = doc.splitTextToSize(`${proc.titre} :`, textWidth - 5);
          doc.text(procTitreLines, margin + 5, yPosition);
          yPosition += procTitreLines.length * 5 + 2;
          
          doc.setFont('helvetica', 'normal');
          const procDescLines = doc.splitTextToSize(proc.desc, textWidth - 10);
          doc.text(procDescLines, margin + 10, yPosition);
          yPosition += procDescLines.length * 5 + 4;
        });
      }
      
      yPosition += 8;
    });
    
    // Ajouter un QR code à la fin
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Générer le QR code
    const qrUrl = 'https://marche-refondation.ne'; // URL du site web
    try {
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#00693E',
          light: '#FFFFFF'
        }
      });
      
      // Ajouter le QR code centré
      const qrSize = 30;
      doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - qrSize - 10, yPosition + 10, qrSize, qrSize);
      
      // Ajouter un texte sous le QR code
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Scanner pour plus d\'infos', pageWidth - margin - qrSize/2 - 10, yPosition + qrSize + 15, { align: 'center' });
      
      // Ajouter un petit texte au centre
      doc.setFontSize(10);
      doc.text('Marché de la Refondation', pageWidth / 2, yPosition + 20, { align: 'center' });
      doc.setFontSize(8);
      doc.text('www.marche-refondation.ne', pageWidth / 2, yPosition + 25, { align: 'center' });
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
    }
    
    // Sauvegarder le PDF
    doc.save('reglement-marche-refondation.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-36 lg:pt-40">
        {/* En-tête avec bouton de téléchargement */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-[#00693E] to-[#FF6B35] rounded-xl p-8 shadow-xl text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-3">
                  <FaGavel className="text-3xl mr-3" />
                  <h1 className="text-3xl md:text-4xl font-bold">Règlement de Sélection</h1>
                </div>
                <p className="text-lg opacity-90">Marché de la Refondation - Édition 2025</p>
              </div>
              <button 
                onClick={generatePDF}
                className="bg-white text-[#00693E] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaDownload className="text-xl" />
                Télécharger en PDF
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-[#00693E]/10 to-[#FF6B35]/10 rounded-lg p-6 border-l-4 border-[#00693E]">
                <FaInfoCircle className="text-3xl text-[#00693E] mx-auto mb-3" />
                <p className="text-gray-700 text-lg leading-relaxed">
                  Ce règlement est conçu pour assurer la <span className="font-semibold">transparence</span>, 
                  l'<span className="font-semibold">équité</span> et la <span className="font-semibold">promotion 
                  des produits transformés/fabriqués au Niger</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Articles avec un design moderne */}
          <div className="space-y-6">
            {/* Article 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-[#00693E] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#00693E] mb-3">Article premier : Objet</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Le présent règlement définit les conditions, critères et procédures de sélection des occupants des stands du Marché de la Refondation, organisé par le Ministère du Commerce et de l'Industrie en partenariat avec la Ville de Niamey.
                  </p>
                </div>
              </div>
            </div>

            {/* Article 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-[#00693E] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#00693E] mb-3">Article 2 : Principes directeurs</h2>
                  <p className="text-gray-700 mb-4">La sélection des occupants repose sur les principes suivants :</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <FaCheckCircle className="text-[#00693E] flex-shrink-0" />
                      <span className="text-gray-700">Transparence et équité du processus</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCheckCircle className="text-[#00693E] flex-shrink-0" />
                      <span className="text-gray-700">Promotion des produits transformés/fabriqués au Niger</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCheckCircle className="text-[#00693E] flex-shrink-0" />
                      <span className="text-gray-700">Inclusion des jeunes, des femmes et des groupements</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCheckCircle className="text-[#00693E] flex-shrink-0" />
                      <span className="text-gray-700">Respect des normes de qualité</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-[#00693E] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#00693E] mb-3">Article 3 : Conditions d'éligibilité</h2>
                  <p className="text-gray-700 mb-4">Peuvent postuler :</p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <FaCheckCircle className="text-[#FF6B35] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Les entreprises, coopératives ou groupements constitués au Niger</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FaCheckCircle className="text-[#FF6B35] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Les producteurs, transformateurs dans les trois corps de métiers retenus dont les produits sont transformés/fabriqués localement</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FaCheckCircle className="text-[#FF6B35] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">Les candidats disposant d'un dossier complet (fiche de candidature, justificatifs, description des produits)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article 4 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-[#00693E] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#00693E] mb-3">Article 4 : Critères de sélection</h2>
                  <p className="text-gray-700 mb-4">Les candidatures seront évaluées selon les critères suivants :</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-[#00693E]/5 to-transparent p-3 rounded-lg border-l-3 border-[#00693E]">
                      <p className="font-semibold text-gray-800 mb-1">Pertinence des produits</p>
                      <p className="text-sm text-gray-600">Transformés/fabriqués au Niger</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#FF6B35]/5 to-transparent p-3 rounded-lg border-l-3 border-[#FF6B35]">
                      <p className="font-semibold text-gray-800 mb-1">Capacité de production</p>
                      <p className="text-sm text-gray-600">Volume et régularité de production</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#00693E]/5 to-transparent p-3 rounded-lg border-l-3 border-[#00693E]">
                      <p className="font-semibold text-gray-800 mb-1">Contribution sociale</p>
                      <p className="text-sm text-gray-600">Emplois, inclusion des jeunes et des femmes</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#FF6B35]/5 to-transparent p-3 rounded-lg border-l-3 border-[#FF6B35]">
                      <p className="font-semibold text-gray-800 mb-1">Respect des normes</p>
                      <p className="text-sm text-gray-600">Normes de qualité et d'hygiène</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article 5 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-[#00693E] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#00693E] mb-4">Article 5 : Procédure de sélection</h2>
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#00693E] to-[#FF6B35]"></div>
                    
                    <div className="space-y-4">
                      <div className="relative flex items-start ml-8">
                        <div className="absolute -left-6 bg-[#00693E] w-4 h-4 rounded-full border-4 border-white shadow"></div>
                        <div className="bg-gray-50 p-4 rounded-lg flex-1 hover:bg-gray-100 transition-colors">
                          <h3 className="font-semibold text-gray-800 mb-2">1. Dépôt des candidatures</h3>
                          <p className="text-sm text-gray-600">Les candidats remplissent la fiche de candidature et déposent leur dossier dans les délais fixés</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start ml-8">
                        <div className="absolute -left-6 bg-[#00693E] w-4 h-4 rounded-full border-4 border-white shadow"></div>
                        <div className="bg-gray-50 p-4 rounded-lg flex-1 hover:bg-gray-100 transition-colors">
                          <h3 className="font-semibold text-gray-800 mb-2">2. Examen des dossiers</h3>
                          <p className="text-sm text-gray-600">Le comité réceptionne, examine et évalue les candidatures à l'aide de la fiche d'évaluation</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start ml-8">
                        <div className="absolute -left-6 bg-[#00693E] w-4 h-4 rounded-full border-4 border-white shadow"></div>
                        <div className="bg-gray-50 p-4 rounded-lg flex-1 hover:bg-gray-100 transition-colors">
                          <h3 className="font-semibold text-gray-800 mb-2">3. Délibération</h3>
                          <p className="text-sm text-gray-600">Les membres du comité délibèrent et établissent une liste provisoire des candidats retenus</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start ml-8">
                        <div className="absolute -left-6 bg-[#FF6B35] w-4 h-4 rounded-full border-4 border-white shadow"></div>
                        <div className="bg-gray-50 p-4 rounded-lg flex-1 hover:bg-gray-100 transition-colors">
                          <h3 className="font-semibold text-gray-800 mb-2">4. Publication</h3>
                          <p className="text-sm text-gray-600">La liste définitive est validée à travers un texte règlementaire et publiée officiellement</p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start ml-8">
                        <div className="absolute -left-6 bg-[#FF6B35] w-4 h-4 rounded-full border-4 border-white shadow"></div>
                        <div className="bg-gray-50 p-4 rounded-lg flex-1 hover:bg-gray-100 transition-colors">
                          <h3 className="font-semibold text-gray-800 mb-2">5. Attribution des stands</h3>
                          <p className="text-sm text-gray-600">Les stands sont répartis selon le plan d'occupation et attribués aux candidats sélectionnés</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article 6 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-[#00693E] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  6
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#00693E] mb-3">Article 6 : Obligations des bénéficiaires</h2>
                  <p className="text-gray-700 mb-4">Les occupants sélectionnés s'engagent à :</p>
                  <div className="bg-gradient-to-r from-[#00693E]/5 to-[#FF6B35]/5 rounded-lg p-4">
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <FaClipboardList className="text-[#00693E] flex-shrink-0" />
                        <span className="text-gray-700">Respecter le règlement du marché</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <FaClipboardList className="text-[#00693E] flex-shrink-0" />
                        <span className="text-gray-700">Maintenir leurs stands en bon état et propres</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <FaClipboardList className="text-[#00693E] flex-shrink-0" />
                        <span className="text-gray-700">Commercialiser exclusivement les produits déclarés dans leur dossier</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <FaClipboardList className="text-[#00693E] flex-shrink-0" />
                        <span className="text-gray-700">Coopérer aux activités de suivi-évaluation organisées par le comité</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <FaClipboardList className="text-[#00693E] flex-shrink-0" />
                        <span className="text-gray-700">S'engager à respecter les normes de qualité relatives aux produits commercialisés</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Article 7 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-[#00693E] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  7
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#00693E] mb-3">Article 7 : Dispositions finales</h2>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-700 leading-relaxed">
                      <FaInfoCircle className="inline text-yellow-600 mr-2" />
                      Le présent règlement entre en vigueur dès son adoption par le comité ad hoc et reste applicable pendant toute la durée du Marché de la Refondation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Actions */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={generatePDF}
              className="bg-gradient-to-r from-[#00693E] to-[#004d2c] text-white px-8 py-3 rounded-lg hover:from-[#004d2c] hover:to-[#00693E] transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <FaFileAlt className="text-xl" />
              Télécharger une copie PDF
            </button>
            <a 
              href="/inscription-exposant"
              className="inline-block bg-gradient-to-r from-[#FF6B35] to-[#FF8F66] text-white px-8 py-3 rounded-lg hover:from-[#FF8F66] hover:to-[#FF6B35] transition-all font-semibold shadow-lg text-center"
            >
              Postuler maintenant →
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Marché de la Refondation - Ministère du Commerce et de l'Industrie</p>
        </div>
      </footer>
    </div>
  );
}
