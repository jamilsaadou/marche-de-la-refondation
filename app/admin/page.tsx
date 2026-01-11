"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUsers, 
  FaStore, 
  FaChartBar, 
  FaFileInvoiceDollar,
  FaClipboardList,
  FaCog,
  FaUserShield,
  FaBoxes,
  FaComments,
  FaBell,
  FaFileAlt,
  FaMapMarkedAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaBars,
  FaFilePdf,
  FaSignOutAlt
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import UtilisateursContent from './components/UtilisateursContent';
import LogsContent from './components/LogsContent';
import PrintDemande from '../components/PrintDemande';
import { FileViewerButton } from '../components/FileViewer';

// Interface pour l'utilisateur connecté
interface UserInfo {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

// PDF Generation Function
const generateApprovalPDF = async (demande: any, evaluationScores: any, totalScore: number) => {
  // Vérifier si jsPDF est disponible
  if (typeof window === 'undefined') return;
  
  try {
    // Import dynamique des modules nécessaires
    const [jsPDFModule, QRCodeModule] = await Promise.all([
      import('jspdf'),
      import('qrcode')
    ]);
    
    const jsPDF = jsPDFModule.default;
    const QRCode = QRCodeModule.default;
    
    // Configuration PDF pour optimisation de taille
    const doc = new jsPDF({
      compress: true,
      unit: 'mm',
      format: 'a4'
    });
      
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Générer le QR Code avec les informations de l'approbation
    const qrData = JSON.stringify({
      id: demande.id,
      nom: demande.nom,
      entreprise: demande.entreprise,
      date: currentDate,
      score: totalScore.toFixed(1),
      reference: `MR-${demande.id}-${new Date().getFullYear()}`
    });
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 150,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // En-tête avec logo très agrandi et bien visible - Hauteur optimisée
    doc.setFillColor(25, 135, 84); // Vert
    doc.rect(0, 0, 210, 75, 'F');
    
    // Ajouter le logo centré et très agrandi avec fond blanc pour meilleure visibilité
    try {
      // Le logo sera chargé depuis le dossier public
      const logoImg = new Image();
      logoImg.src = '/marchedela.png';
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve; // Continue même si le logo ne charge pas
        setTimeout(resolve, 2000); // Timeout augmenté à 2 secondes pour assurer le chargement
      });
      
      if (logoImg.complete && logoImg.naturalHeight !== 0) {
        // Calculer les dimensions pour maintenir le ratio d'aspect - Logo très grand et visible
        const maxWidth = 90;  // Augmenté à 90mm pour être très visible
        const maxHeight = 60; // Hauteur de 60mm
        const imgRatio = logoImg.naturalWidth / logoImg.naturalHeight;
        
        let imgWidth = maxWidth;
        let imgHeight = maxWidth / imgRatio;
        
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = maxHeight * imgRatio;
        }
        
        // Centrer le logo horizontalement sur la page (largeur page A4 = 210mm)
        const xOffset = (210 - imgWidth) / 2;
        const yOffset = 7; // Positionné avec un peu d'espace en haut
        
        // Fond blanc derrière le logo pour assurer la visibilité
        doc.setFillColor(255, 255, 255);
        const padding = 3;
        doc.roundedRect(xOffset - padding, yOffset - padding, imgWidth + (padding * 2), imgHeight + (padding * 2), 2, 2, 'F');
        
        // Ajouter le logo avec compression optimale
        doc.addImage(logoImg, 'PNG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      }
    } catch (error) {
      console.log('Logo non disponible:', error);
    }
    
    // Texte positionné juste sous le logo - espace réduit avec fond semi-transparent pour lisibilité
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MARCHÉ DE LA RÉFONDATION', 105, 54, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Centenaire de Niamey 2026', 105, 61, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text('Ministère du Commerce et de l\'Industrie', 105, 68, { align: 'center' });

    // Titre principal sous l'en-tête - Design élégant noir sur blanc
    // Encadré blanc pour le titre - agrandi pour plus d'espace
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(30, 78, 150, 20, 4, 4, 'F');
    
    // Bordure noire élégante autour du titre
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.roundedRect(30, 78, 150, 20, 4, 4, 'S');
    
    // Bordure intérieure décorative
    doc.setDrawColor(25, 135, 84);
    doc.setLineWidth(0.5);
    doc.roundedRect(32, 80, 146, 16, 3, 3, 'S');
    
    // Titre en noir, plus grand et plus visible avec espacement des caractères
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    // Diviser le texte en deux lignes pour plus d'élégance et d'espace
    doc.text('ATTESTATION', 105, 86, { align: 'center', charSpace: 2 });
    doc.text('D\'APPROBATION', 105, 92, { align: 'center', charSpace: 2 });

    // Lignes décoratives de séparation
    doc.setDrawColor(25, 135, 84);
    doc.setLineWidth(0.5);
    doc.line(20, 100, 190, 100);
    doc.setLineWidth(0.3);
    doc.line(20, 102, 190, 102);

    // Numéro et date - Ajustés pour éviter le chevauchement avec les lignes
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`N° ${demande.id}/MR/${new Date().getFullYear()}`, 20, 107);
    doc.text(`Niamey, le ${currentDate}`, 190, 107, { align: 'right' });

    // Corps du document avec texte d'introduction élégant
    let yPos = 109;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(60, 60, 60);
    doc.text('Le Comité d\'Évaluation du Marché de la Réfondation,', 105, yPos, { align: 'center' });
    yPos += 6;
    doc.text('Après étude et évaluation du dossier de candidature,', 105, yPos, { align: 'center' });
    yPos += 14;

    // Encadré informations candidat - Design amélioré avec dégradé visuel
    doc.setFillColor(245, 250, 255);
    doc.roundedRect(15, yPos, 180, 48, 3, 3, 'F');
    
    // Bordure dorée/verte élégante
    doc.setDrawColor(25, 135, 84);
    doc.setLineWidth(0.8);
    doc.roundedRect(15, yPos, 180, 48, 3, 3, 'S');
    
    // Barre décorative en haut de l'encadré
    doc.setFillColor(25, 135, 84);
    doc.roundedRect(15, yPos, 180, 8, 3, 3, 'F');

    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('✓ CANDIDAT APPROUVÉ', 105, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    
    // Informations en 2 colonnes
    const leftCol = 25;
    const rightCol = 110;
    
    // Colonne gauche
    doc.text('Nom complet :', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(demande.nom, leftCol + 28, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Entreprise :', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(demande.entreprise, leftCol + 28, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Secteur :', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(demande.secteur, leftCol + 28, yPos);
    
    // Colonne droite
    yPos -= 12; // Revenir en haut pour la colonne droite
    doc.setFont('helvetica', 'bold');
    doc.text('Email :', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(demande.email, rightCol + 15, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Téléphone :', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(demande.telephone, rightCol + 22, yPos);
    
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Référence :', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`MR-${demande.id}-${new Date().getFullYear()}`, rightCol + 22, yPos);

    yPos += 14;
      
    // Score d'évaluation - Design élégant avec badge
    doc.setFillColor(236, 253, 243);
    doc.roundedRect(15, yPos, 100, 28, 3, 3, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, yPos, 100, 28, 3, 3, 'S');
    
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('RÉSULTAT DE L\'ÉVALUATION', 65, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(`${totalScore.toFixed(1)} / 100`, 65, yPos, { align: 'center' });
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(30, yPos - 4, 70, 8, 2, 2, 'F');
    doc.text('✓ QUALIFIÉ', 65, yPos, { align: 'center' });

    // QR Code avec design élégant
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(125, yPos - 26, 65, 28, 3, 3, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(125, yPos - 26, 65, 28, 3, 3, 'S');
    
    doc.addImage(qrCodeDataUrl, 'PNG', 131, yPos - 24, 24, 24, undefined, 'FAST');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Scannez pour', 168, yPos - 16, { align: 'center' });
    doc.text('authentifier', 168, yPos - 11, { align: 'center' });
    doc.text('le document', 168, yPos - 6, { align: 'center' });

    yPos += 14;
      
    // Section Décision avec encadré élégant
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(15, yPos, 180, 42, 3, 3, 'F');
    doc.setDrawColor(234, 179, 8);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, yPos, 180, 42, 3, 3, 'S');
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(161, 98, 7);
    doc.text('DÉCISION', 105, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    const decisionText = [
      'D\'APPROUVER la demande de participation du candidat susmentionné',
      'au Marché de la Réfondation - Centenaire de Niamey 2026.',
      '',
      'Le candidat est autorisé à commercialiser ses produits conformément',
      'au règlement intérieur dans l\'un des deux sites officiels.'
    ];
    
    decisionText.forEach(line => {
      doc.text(line, 105, yPos, { align: 'center' });
      yPos += 5;
    });

    yPos += 12;

    // Signatures avec design élégant
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Signature gauche
    doc.text('Le Président du Jury', 52, yPos, { align: 'center' });
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(25, yPos + 3, 80, yPos + 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Signature et Cachet', 52, yPos + 18, { align: 'center' });
    
    // Signature droite
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Le Directeur du Marché', 158, yPos, { align: 'center' });
    doc.line(130, yPos + 3, 185, yPos + 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Signature et Cachet', 158, yPos + 18, { align: 'center' });

    // Pied de page élégant avec ligne décorative
    yPos = 275;
    doc.setDrawColor(25, 135, 84);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setTextColor(25, 135, 84);
    doc.setFont('helvetica', 'bold');
    doc.text('Marché de la Réfondation - Centenaire de Niamey 2026', 105, yPos, { align: 'center' });
    yPos += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('Ministère du Commerce et de l\'Industrie', 105, yPos, { align: 'center' });
    yPos += 4;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    doc.text(`Document authentique - Référence: MR-${demande.id}-${new Date().getFullYear()} - Vérifiable par QR Code`, 105, yPos, { align: 'center' });

    // Télécharger le PDF
    const fileName = `Approbation_${demande.entreprise.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Assurez-vous que jsPDF est installé.');
  }
};

export default function AdminPage() {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState<number | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('auth-token');
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        setLoading(false);
      } else {
        localStorage.removeItem('auth-token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      localStorage.removeItem('auth-token');
      router.push('/admin/login');
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
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      localStorage.removeItem('auth-token');
      router.push('/admin/login');
    }
  };

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (la redirection est en cours)
  if (!user) {
    return null;
  }

  const menuItems = [
    {
      id: 'dashboard',
      icon: <MdDashboard className="text-xl" />,
      title: "Tableau de Bord",
      color: "text-blue-600"
    },
    {
      id: 'demandes',
      icon: <FaClipboardList className="text-xl" />,
      title: "Demandes",
      color: "text-purple-600",
      badge: 24
    },
    {
      id: 'exposants',
      icon: <FaUsers className="text-xl" />,
      title: "Exposants",
      color: "text-green-600"
    },
    {
      id: 'kiosques',
      icon: <FaStore className="text-xl" />,
      title: "Kiosques",
      color: "text-orange-600"
    },
    {
      id: 'sites',
      icon: <FaMapMarkedAlt className="text-xl" />,
      title: "Sites",
      color: "text-teal-600"
    },
    {
      id: 'paiements',
      icon: <FaFileInvoiceDollar className="text-xl" />,
      title: "Paiements",
      color: "text-red-600"
    },
    {
      id: 'statistiques',
      icon: <FaChartBar className="text-xl" />,
      title: "Statistiques",
      color: "text-indigo-600"
    },
    {
      id: 'inventaire',
      icon: <FaBoxes className="text-xl" />,
      title: "Inventaire",
      color: "text-yellow-600"
    },
    {
      id: 'communications',
      icon: <FaComments className="text-xl" />,
      title: "Communications",
      color: "text-pink-600"
    },
    {
      id: 'notifications',
      icon: <FaBell className="text-xl" />,
      title: "Notifications",
      color: "text-cyan-600"
    },
    {
      id: 'documents',
      icon: <FaFileAlt className="text-xl" />,
      title: "Documents",
      color: "text-lime-600"
    },
    {
      id: 'utilisateurs',
      icon: <FaUserShield className="text-xl" />,
      title: "Utilisateurs",
      color: "text-rose-600"
    },
    {
      id: 'logs',
      icon: <FaFileAlt className="text-xl" />,
      title: "Logs",
      color: "text-purple-600"
    },
    {
      id: 'parametres',
      icon: <FaCog className="text-xl" />,
      title: "Paramètres",
      color: "text-gray-600"
    },
  ];

  // Contenu pour chaque section
  const renderContent = () => {
    switch(selectedSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'demandes':
        return <DemandesContent />;
      case 'exposants':
        return <ExposantsContent />;
      case 'kiosques':
        return <KiosquesContent />;
      case 'sites':
        return <SitesContent />;
      case 'paiements':
        return <PaiementsContent />;
      case 'statistiques':
        return <StatistiquesContent />;
      case 'inventaire':
        return <InventaireContent />;
      case 'communications':
        return <CommunicationsContent />;
      case 'notifications':
        return <NotificationsContent />;
      case 'documents':
        return <DocumentsContent />;
      case 'utilisateurs':
        return <UtilisateursContent />;
      case 'logs':
        return <LogsContent />;
      case 'parametres':
        return <ParametresContent />;
      default:
        return <DashboardContent />;
    }
  };

  const currentMenuItem = menuItems.find(item => item.id === selectedSection);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-primary-800 to-primary-900 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="p-4 border-b border-primary-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <FaUserShield className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Admin</h2>
                  <p className="text-xs text-primary-300">Marché Réfondation</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSection(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                selectedSection === item.id
                  ? 'bg-white text-primary-800 shadow-lg'
                  : 'hover:bg-primary-700 text-white'
              }`}
            >
              <span className={selectedSection === item.id ? item.color : ''}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${currentMenuItem?.color.replace('text', 'from')}-100 ${currentMenuItem?.color.replace('text', 'to')}-200`}>
                <span className={currentMenuItem?.color}>
                  {currentMenuItem?.icon}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentMenuItem?.title}</h1>
                <p className="text-sm text-gray-500">Gestion et administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <FaBell className="text-gray-600 text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 mr-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.prenom[0]}{user.nom[0]}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.prenom} {user.nom}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  title="Déconnexion"
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Dashboard Content avec indicateurs enrichis
function DashboardContent() {
  const [stats, setStats] = useState<any>({
    demandesEnAttente: 0,
    demandesApprouvees: 0,
    demandesRejetees: 0,
    totalDemandes: 0,
    parSecteur: {},
    parRegion: {},
    parGenre: { M: 0, F: 0 },
    parLocalisation: { niamey: 0, region: 0 },
    parSitePreference: {},
    origineMatieresPremieres: {},
    transformationNiger: {},
    certificatConformite: {},
    totalEmployes: 0,
    totalFemmes: 0,
    totalJeunes: 0,
    ageMoyen: 0,
    tauxApprobation: 0,
    demandesRecentes: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch('/api/demandes?admin=true&limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const demandes = data.data;
          
          // Statistiques de base
          const enAttente = demandes.filter((d: any) => d.status === 'EN_ATTENTE').length;
          const approuvees = demandes.filter((d: any) => d.status === 'APPROUVE').length;
          const rejetees = demandes.filter((d: any) => d.status === 'REJETE').length;
          const total = demandes.length;
          
          // Statistiques par secteur
          const parSecteur: any = {};
          demandes.forEach((d: any) => {
            const secteur = d.secteurActivite || 'Non spécifié';
            parSecteur[secteur] = (parSecteur[secteur] || 0) + 1;
          });
          
          // Statistiques par région
          const parRegion: any = {};
          demandes.forEach((d: any) => {
            if (d.region) {
              parRegion[d.region] = (parRegion[d.region] || 0) + 1;
            }
          });
          
          // Statistiques par genre
          const parGenre = { M: 0, F: 0 };
          demandes.forEach((d: any) => {
            if (d.sexe === 'M') parGenre.M++;
            else if (d.sexe === 'F') parGenre.F++;
          });
          
          // Statistiques par localisation
          const parLocalisation = { niamey: 0, region: 0 };
          demandes.forEach((d: any) => {
            if (d.localisation === 'niamey') parLocalisation.niamey++;
            else if (d.localisation === 'region') parLocalisation.region++;
          });
          
          // Statistiques préférence de site
          const parSitePreference: any = {};
          demandes.forEach((d: any) => {
            const site = d.sitePreference || 'Non spécifié';
            parSitePreference[site] = (parSitePreference[site] || 0) + 1;
          });
          
          // Origine des matières premières
          const origineMatieresPremieres: any = {};
          demandes.forEach((d: any) => {
            if (d.origineMatieresPremieres) {
              origineMatieresPremieres[d.origineMatieresPremieres] = (origineMatieresPremieres[d.origineMatieresPremieres] || 0) + 1;
            }
          });
          
          // Transformation au Niger
          const transformationNiger: any = {};
          demandes.forEach((d: any) => {
            if (d.transformationAuNiger) {
              transformationNiger[d.transformationAuNiger] = (transformationNiger[d.transformationAuNiger] || 0) + 1;
            }
          });
          
          // Certificats de conformité
          const certificatConformite: any = {};
          demandes.forEach((d: any) => {
            if (d.certificatConformite) {
              certificatConformite[d.certificatConformite] = (certificatConformite[d.certificatConformite] || 0) + 1;
            }
          });
          
          // Calculs moyens
          const totalEmployes = demandes.reduce((sum: number, d: any) => sum + (parseInt(d.nombreEmployes) || 0), 0);
          const totalFemmes = demandes.reduce((sum: number, d: any) => sum + (parseInt(d.nombreFemmes) || 0), 0);
          const totalJeunes = demandes.reduce((sum: number, d: any) => sum + (parseInt(d.nombreJeunes) || 0), 0);
          const sommeAges = demandes.reduce((sum: number, d: any) => sum + (parseInt(d.age) || 0), 0);
          const ageMoyen = total > 0 ? Math.round(sommeAges / total) : 0;
          
          // Taux d'approbation
          const tauxApprobation = total > 0 ? ((approuvees / total) * 100).toFixed(1) : 0;
          
          // Demandes récentes (5 dernières)
          const demandesRecentes = demandes
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          
          setStats({
            demandesEnAttente: enAttente,
            demandesApprouvees: approuvees,
            demandesRejetees: rejetees,
            totalDemandes: total,
            parSecteur,
            parRegion,
            parGenre,
            parLocalisation,
            parSitePreference,
            origineMatieresPremieres,
            transformationNiger,
            certificatConformite,
            totalEmployes,
            totalFemmes,
            totalJeunes,
            ageMoyen,
            tauxApprobation,
            demandesRecentes,
            loading: false
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setStats((prev: any) => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    { 
      label: "Demandes en attente", 
      value: stats.demandesEnAttente.toString(), 
      icon: <FaClipboardList />,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      trend: "+5% cette semaine"
    },
    { 
      label: "Demandes approuvées", 
      value: stats.demandesApprouvees.toString(), 
      icon: <FaCheck />,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      trend: `${stats.tauxApprobation}% du total`
    },
    { 
      label: "Demandes rejetées", 
      value: stats.demandesRejetees.toString(), 
      icon: <FaTimes />,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      trend: `${((stats.demandesRejetees / (stats.totalDemandes || 1)) * 100).toFixed(1)}% du total`
    },
    { 
      label: "Total des demandes", 
      value: stats.totalDemandes.toString(), 
      icon: <FaFileAlt />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      trend: "Toutes périodes"
    },
  ];

  const socialImpactCards = [
    {
      label: "Emplois créés",
      value: stats.totalEmployes.toString(),
      icon: <FaUsers />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Total d'emplois générés"
    },
    {
      label: "Femmes employées",
      value: stats.totalFemmes.toString(),
      icon: <FaUsers />,
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
      description: "Inclusion féminine"
    },
    {
      label: "Jeunes (18-35 ans)",
      value: stats.totalJeunes.toString(),
      icon: <FaUsers />,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      description: "Employés jeunes"
    },
    {
      label: "Âge moyen",
      value: `${stats.ageMoyen} ans`,
      icon: <FaUsers />,
      bgColor: "bg-teal-100",
      textColor: "text-teal-600",
      description: "Des candidats"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Titre et résumé */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Tableau de Bord - Vue d'Ensemble</h2>
        <p className="text-white/90">Statistiques complètes du Marché de la Réfondation</p>
      </div>

      {/* Stats Grid - Demandes */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Statistiques des Demandes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-transparent hover:border-primary-500">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Social */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Impact Social et Emploi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialImpactCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} ${stat.textColor} mb-4`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-900">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Répartitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par Secteur */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Répartition par Secteur</h3>
          <div className="space-y-3">
            {Object.entries(stats.parSecteur).map(([secteur, count]: [string, any]) => (
              <div key={secteur}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{secteur}</span>
                  <span className="text-sm font-bold text-gray-900">{count} ({((count / stats.totalDemandes) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.totalDemandes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Par Genre */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Répartition par Genre</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Hommes</span>
                <span className="text-sm font-bold text-blue-600">{stats.parGenre.M} ({((stats.parGenre.M / stats.totalDemandes) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(stats.parGenre.M / stats.totalDemandes) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Femmes</span>
                <span className="text-sm font-bold text-pink-600">{stats.parGenre.F} ({((stats.parGenre.F / stats.totalDemandes) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: `${(stats.parGenre.F / stats.totalDemandes) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Par Localisation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📍 Répartition Géographique</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Niamey</span>
                <span className="text-sm font-bold text-green-600">{stats.parLocalisation.niamey} ({((stats.parLocalisation.niamey / stats.totalDemandes) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.parLocalisation.niamey / stats.totalDemandes) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Régions</span>
                <span className="text-sm font-bold text-orange-600">{stats.parLocalisation.region} ({((stats.parLocalisation.region / stats.totalDemandes) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(stats.parLocalisation.region / stats.totalDemandes) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          {Object.keys(stats.parRegion).length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Détail des régions</h4>
              <div className="space-y-2">
                {Object.entries(stats.parRegion).map(([region, count]: [string, any]) => (
                  <div key={region} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{region}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Préférence de Site */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🏪 Préférence de Site</h3>
          <div className="space-y-3">
            {Object.entries(stats.parSitePreference).map(([site, count]: [string, any]) => (
              <div key={site}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate">{site}</span>
                  <span className="text-sm font-bold text-gray-900 ml-2">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.totalDemandes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qualité et Transformation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Origine Matières Premières */}
        {Object.keys(stats.origineMatieresPremieres).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🌾 Origine des Matières</h3>
            <div className="space-y-2">
              {Object.entries(stats.origineMatieresPremieres).map(([origine, count]: [string, any]) => (
                <div key={origine} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-gray-600">{origine}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transformation au Niger */}
        {Object.keys(stats.transformationNiger).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏭 Transformation Niger</h3>
            <div className="space-y-2">
              {Object.entries(stats.transformationNiger).map(([transfo, count]: [string, any]) => (
                <div key={transfo} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-gray-600">{transfo}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificats de Conformité */}
        {Object.keys(stats.certificatConformite).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">✅ Certificats Qualité</h3>
            <div className="space-y-2">
              {Object.entries(stats.certificatConformite).map(([certif, count]: [string, any]) => (
                <div key={certif} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-gray-600">{certif}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activités Récentes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Demandes Récentes</h3>
        <div className="space-y-3">
          {stats.demandesRecentes.map((demande: any) => (
            <div key={demande.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  demande.status === 'EN_ATTENTE' ? 'bg-yellow-500' :
                  demande.status === 'APPROUVE' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{demande.prenom} {demande.nom}</p>
                  <p className="text-xs text-gray-500">{demande.secteurActivite}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                </p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  demande.status === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-700' :
                  demande.status === 'APPROUVE' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {demande.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Demandes Content
function DemandesContent() {
  const [selectedDemandeId, setSelectedDemandeId] = useState<string | null>(null);
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDemandes, setTotalDemandes] = useState(0);
  const [evaluations, setEvaluations] = useState<{[key: string]: any}>({});
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchDemandes();
  }, [page]);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch(`/api/demandes?page=${page}&limit=10&admin=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error(data.message || 'Erreur lors de la récupération des demandes');
      }
      
      if (data.success) {
        // Transformer les données pour correspondre au format attendu
        const transformedDemandes = data.data.map((d: any) => ({
          id: d.numeroReference,
          nom: `${d.prenom} ${d.nom}`,
          entreprise: d.nomEntreprise || 'N/A',
          secteur: d.secteurActivite,
          date: new Date(d.createdAt).toLocaleDateString('fr-FR'),
          statut: d.status === 'EN_ATTENTE' ? 'En attente' : d.status === 'APPROUVE' ? 'Approuvé' : 'Rejeté',
          statusBrut: d.status, // Garder le statut original pour les mises à jour
          telephone: d.telephone,
          email: d.email || 'N/A',
          adresse: d.adresse,
          produits: d.produitsProposes,
          experience: d.experienceAnterieure,
          employes: `${d.nombreEmployes} personnes`,
          region: d.region,
          localisation: d.localisation,
          sitePreference: d.sitePreference,
          tailleKiosque: d.tailleKiosque,
          capaciteProduction: d.capaciteProduction,
          listeProduitsDetaillee: d.listeProduitsDetaillee,
          nationalite: d.nationalite,
          age: d.age,
          sexe: d.sexe,
          // Ajouter les URLs des documents
          carteIdentiteUrl: d.carteIdentiteUrl,
          registreCommerceDocUrl: d.registreCommerceDocUrl,
          listeProduitsFileUrl: d.listeProduitsFileUrl,
          typeInscription: d.typeInscription,
          registreCommerce: d.registreCommerce,
          // Informations complémentaires pour l'évaluation
          origineMatieresPremieres: d.origineMatieresPremieres,
          transformationAuNiger: d.transformationAuNiger,
          innovation: d.innovation,
          regulariteApprovisionnement: d.regulariteApprovisionnement,
          adaptationDemandeCroissante: d.adaptationDemandeCroissante,
          nombreFemmes: d.nombreFemmes,
          nombreJeunes: d.nombreJeunes,
          certificatConformite: d.certificatConformite,
          photoProduitsUrls: d.photoProduitsUrls, // JSON string des URLs
        }));
        
        setDemandes(transformedDemandes);
        setTotalPages(data.pagination.totalPages);
        setTotalDemandes(data.pagination.total);
        
        // Charger les évaluations pour les demandes approuvées
        await fetchEvaluationsForDemandes(transformedDemandes);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      alert('Erreur lors de la récupération des demandes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluationsForDemandes = async (demandes: any[]) => {
    const token = localStorage.getItem('auth-token');
    if (!token) return;

    const evaluationsMap: {[key: string]: any} = {};

    // Charger les évaluations pour chaque demande approuvée
    for (const demande of demandes) {
      if (demande.statusBrut === 'APPROUVE') {
        try {
          const response = await fetch(`/api/evaluations?numeroReference=${demande.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.length > 0) {
              // Prendre la dernière évaluation approuvée
              const approvedEval = data.data.find((e: any) => e.decision === 'APPROUVE');
              if (approvedEval) {
                evaluationsMap[demande.id] = approvedEval;
              }
            }
          }
        } catch (error) {
          console.error(`Erreur lors du chargement de l'évaluation pour ${demande.id}:`, error);
        }
      }
    }

    setEvaluations(evaluationsMap);
  };

  const handleDownloadAttestation = (demande: any) => {
    const evaluation = evaluations[demande.id];
    if (evaluation) {
      generateApprovalPDF(demande, evaluation.scores || {}, evaluation.scoreTotal || 0);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      // Récupérer toutes les demandes
      const response = await fetch('/api/demandes?admin=true&limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Import dynamique de xlsx
          const XLSX = await import('xlsx');
          
          // Préparer les données pour Excel
          const excelData = data.data.map((d: any) => ({
            'N° Référence': d.numeroReference,
            'Prénom': d.prenom,
            'Nom': d.nom,
            'Email': d.email || 'N/A',
            'Téléphone': d.telephone,
            'Âge': d.age,
            'Sexe': d.sexe,
            'Nationalité': d.nationalite,
            'Adresse': d.adresse,
            'Entreprise': d.nomEntreprise || 'N/A',
            'Registre Commerce': d.registreCommerce || 'N/A',
            'Secteur d\'activité': d.secteurActivite,
            'Localisation': d.localisation,
            'Région': d.region || 'N/A',
            'Site de préférence': d.sitePreference,
            'Taille kiosque': d.tailleKiosque,
            'Nombre d\'employés': d.nombreEmployes,
            'Nombre de femmes': d.nombreFemmes || 0,
            'Nombre de jeunes': d.nombreJeunes || 0,
            'Produits proposés': d.produitsProposes,
            'Capacité de production': d.capaciteProduction,
            'Origine matières premières': d.origineMatieresPremieres || 'N/A',
            'Transformation au Niger': d.transformationAuNiger || 'N/A',
            'Innovation': d.innovation || 'N/A',
            'Régularité approvisionnement': d.regulariteApprovisionnement || 'N/A',
            'Adaptation demande': d.adaptationDemandeCroissante || 'N/A',
            'Certificat conformité': d.certificatConformite || 'N/A',
            'Expérience antérieure': d.experienceAnterieure,
            'Statut': d.status,
            'Date de création': new Date(d.createdAt).toLocaleDateString('fr-FR'),
          }));

          // Créer le workbook et la worksheet
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(excelData);

          // Ajuster la largeur des colonnes
          const colWidths = [
            { wch: 15 }, // N° Référence
            { wch: 15 }, // Prénom
            { wch: 15 }, // Nom
            { wch: 25 }, // Email
            { wch: 15 }, // Téléphone
            { wch: 8 },  // Âge
            { wch: 8 },  // Sexe
            { wch: 15 }, // Nationalité
            { wch: 30 }, // Adresse
            { wch: 25 }, // Entreprise
            { wch: 20 }, // Registre Commerce
            { wch: 25 }, // Secteur
            { wch: 15 }, // Localisation
            { wch: 15 }, // Région
            { wch: 20 }, // Site préférence
            { wch: 15 }, // Taille kiosque
            { wch: 15 }, // Nb employés
            { wch: 15 }, // Nb femmes
            { wch: 15 }, // Nb jeunes
            { wch: 40 }, // Produits
            { wch: 30 }, // Capacité production
            { wch: 25 }, // Origine matières
            { wch: 20 }, // Transformation
            { wch: 30 }, // Innovation
            { wch: 20 }, // Régularité
            { wch: 20 }, // Adaptation
            { wch: 20 }, // Certificat
            { wch: 40 }, // Expérience
            { wch: 15 }, // Statut
            { wch: 15 }, // Date création
          ];
          ws['!cols'] = colWidths;

          // Ajouter la feuille au workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Demandes');

          // Générer le fichier Excel
          const fileName = `Demandes_Exposants_${new Date().toISOString().split('T')[0]}.xlsx`;
          XLSX.writeFile(wb, fileName);

          alert(`${data.data.length} demande(s) exportée(s) avec succès !`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      alert('Erreur lors de l\'exportation des données');
    } finally {
      setExporting(false);
    }
  };

  const selectedDemande = demandes.find(d => d.id === selectedDemandeId);

  if (selectedDemande) {
    return (
      <DemandeDetailView 
        demande={selectedDemande} 
        onBack={() => {
          setSelectedDemandeId(null);
          fetchDemandes(); // Rafraîchir la liste après modification
        }} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchDemandes}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaSearch />
            <span>Rafraîchir</span>
          </button>
          <button 
            onClick={handleExportExcel}
            disabled={exporting}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Export en cours...</span>
              </>
            ) : (
              <>
                <FaDownload />
                <span>Exporter Excel</span>
              </>
            )}
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <strong>{totalDemandes}</strong> demande{totalDemandes > 1 ? 's' : ''} au total
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Secteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {demandes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Aucune demande trouvée
                </td>
              </tr>
            ) : (
              demandes.map((demande: any) => (
                <tr key={demande.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{demande.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{demande.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{demande.entreprise}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{demande.secteur}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{demande.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      demande.statusBrut === 'EN_ATTENTE' 
                        ? 'text-yellow-700 bg-yellow-100' 
                        : demande.statusBrut === 'APPROUVE'
                        ? 'text-green-700 bg-green-100'
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {demande.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedDemandeId(demande.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" 
                        title="Voir et Évaluer"
                      >
                        <FaEye />
                      </button>
                      {demande.statusBrut === 'APPROUVE' && evaluations[demande.id] && (
                        <button 
                          onClick={() => handleDownloadAttestation(demande)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                          title="Télécharger l'Attestation"
                        >
                          <FaFilePdf />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Exposants Content
function ExposantsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Liste des Exposants</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <FaPlus />
            <span>Ajouter Exposant</span>
          </button>
        </div>
        <div className="text-center py-12 text-gray-500">
          Contenu à venir - Liste des exposants avec filtres et recherche
        </div>
      </div>
    </div>
  );
}

// Kiosques Content
function KiosquesContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-2">Total Kiosques</p>
          <p className="text-3xl font-bold text-gray-900">1,054</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-2">Occupés</p>
          <p className="text-3xl font-bold text-green-600">687</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-2">Disponibles</p>
          <p className="text-3xl font-bold text-blue-600">367</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Gestion des Kiosques</h3>
        <div className="text-center py-12 text-gray-500">
          Contenu à venir - Plan des kiosques et attribution
        </div>
      </div>
    </div>
  );
}

// Sites Content
function SitesContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Site N°1 - Ex-OPVN</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Superficie:</strong> 2,600 m²</p>
            <p><strong>Kiosques:</strong> 412</p>
            <p><strong>Localisation:</strong> Petit marché</p>
            <p><strong>Statut:</strong> <span className="text-green-600">Actif</span></p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Site N°2 - Ex-Marché Djémadjé</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Superficie:</strong> 5,500 m²</p>
            <p><strong>Kiosques:</strong> 642</p>
            <p><strong>Localisation:</strong> Près du Ministère du Commerce</p>
            <p><strong>Statut:</strong> <span className="text-green-600">Actif</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Autres contenus (placeholders)
function PaiementsContent() {
  return <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-500">Contenu Paiements à venir</p></div>;
}

function StatistiquesContent() {
  return <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-500">Contenu Statistiques à venir</p></div>;
}

function InventaireContent() {
  return <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-500">Contenu Inventaire à venir</p></div>;
}

function CommunicationsContent() {
  return <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-500">Contenu Communications à venir</p></div>;
}

function NotificationsContent() {
  return <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-500">Contenu Notifications à venir</p></div>;
}

function DocumentsContent() {
  return <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-500">Contenu Documents à venir</p></div>;
}

function ParametresContent() {
  return <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-500">Contenu Paramètres à venir</p></div>;
}

// Demande Detail View with Evaluation Grid
function DemandeDetailView({ demande, onBack }: { demande: any; onBack: () => void }) {
  const [evaluationScores, setEvaluationScores] = useState<{[key: string]: number}>({});
  const [comments, setComments] = useState<{[key: string]: string}>({});
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [existingEvaluations, setExistingEvaluations] = useState<any[]>([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [evaluationStats, setEvaluationStats] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [hasUserEvaluated, setHasUserEvaluated] = useState(false);

  // Charger les évaluations et statistiques
  useEffect(() => {
    fetchEvaluations();
    fetchEvaluationStats();
    getCurrentUser();
  }, [demande.id]);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setCurrentUserRole(data.user.role);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
  };

  const fetchEvaluations = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch(`/api/evaluations?numeroReference=${demande.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setExistingEvaluations(data.data);
          
          // Vérifier si l'utilisateur actuel a déjà évalué
          const userResponse = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.success && userData.user) {
              const userEval = data.data.find((e: any) => e.evaluateurId === userData.user.id);
              setHasUserEvaluated(!!userEval);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    } finally {
      setLoadingEvaluations(false);
    }
  };

  const fetchEvaluationStats = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const response = await fetch(`/api/evaluations/stats?numeroReference=${demande.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEvaluationStats(data.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const criteria = [
    {
      id: 'pertinence',
      title: "1. Pertinence des produits (Transformés/fabriqués au Niger)",
      weight: 45,
      subCriteria: [
        { id: 'origine', label: "Origine locale des matières premières", weight: 20 },
        { id: 'transformation', label: "Transformation/fabrication réalisée au Niger", weight: 20 },
        { id: 'innovation', label: "Innovation", weight: 5 },
      ]
    },
    {
      id: 'capacite',
      title: "2. Capacité de production et régularité",
      weight: 25,
      subCriteria: [
        { id: 'volume', label: "Volume de production disponible", weight: 13 },
        { id: 'regularite', label: "Régularité de l'approvisionnement", weight: 8 },
        { id: 'adaptation', label: "Capacité d'adaptation à une demande croissante", weight: 4 },
      ]
    },
    {
      id: 'social',
      title: "3. Contribution sociale (emplois, inclusion femmes/jeunes)",
      weight: 15,
      subCriteria: [
        { id: 'emplois', label: "Nombre d'emplois créés", weight: 5 },
        { id: 'femmes', label: "Inclusion des femmes dans la chaîne de valeur", weight: 5 },
        { id: 'jeunes', label: "Inclusion des jeunes", weight: 5 },
      ]
    },
    {
      id: 'qualite',
      title: "4. Respect des normes de qualité",
      weight: 15,
      subCriteria: [
        { id: 'certificat', label: "Certificat de conformité du produit", weight: 5 },
        { id: 'engagement', label: "Engagement pour le respect des normes de qualité", weight: 10 },
      ]
    },
  ];

  const calculateSubScore = (weight: number, note: number) => {
    return (note * weight) / 5;
  };

  const calculateCategoryTotal = (categoryId: string, subCriteria: any[]) => {
    return subCriteria.reduce((total, sub) => {
      const note = evaluationScores[`${categoryId}_${sub.id}`] || 0;
      return total + calculateSubScore(sub.weight, note);
    }, 0);
  };

  const calculateTotalScore = () => {
    return criteria.reduce((total, category) => {
      return total + calculateCategoryTotal(category.id, category.subCriteria);
    }, 0);
  };

  const handleScoreChange = (key: string, value: number) => {
    setEvaluationScores(prev => ({ ...prev, [key]: value }));
  };

  const handleCommentChange = (key: string, value: string) => {
    setComments(prev => ({ ...prev, [key]: value }));
  };

  const handleApproval = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/admin/login';
        return;
      }

      // Sauvegarder l'évaluation dans la base de données
      const evaluationResponse = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numeroReference: demande.id,
          scores: evaluationScores,
          commentaires: comments,
          scoreTotal: totalScore,
          decision: 'APPROUVE',
        }),
      });

      const evaluationData = await evaluationResponse.json();

      if (!evaluationResponse.ok) {
        throw new Error(evaluationData.message || 'Erreur lors de l\'enregistrement de l\'évaluation');
      }

      setDecision('approved');
      // Mise à jour locale du statut
      demande.statusBrut = 'APPROUVE';
      demande.statut = 'Approuvé';
      
      // Rafraîchir les évaluations pour afficher celle qui vient d'être créée
      await fetchEvaluations();
      
      alert('Évaluation enregistrée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation de la demande');
    }
  };

  const handleRejection = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/admin/login';
        return;
      }

      const raisonRejet = prompt('Veuillez indiquer la raison du rejet:');
      if (!raisonRejet) {
        alert('Vous devez fournir une raison pour le rejet');
        return;
      }

      // Sauvegarder l'évaluation dans la base de données
      const evaluationResponse = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numeroReference: demande.id,
          scores: evaluationScores,
          commentaires: { ...comments, raisonRejet },
          scoreTotal: totalScore,
          decision: 'REJETE',
        }),
      });

      const evaluationData = await evaluationResponse.json();

      if (!evaluationResponse.ok) {
        throw new Error(evaluationData.message || 'Erreur lors de l\'enregistrement de l\'évaluation');
      }

      setDecision('rejected');
      // Mise à jour locale du statut
      demande.statusBrut = 'REJETE';
      demande.statut = 'Rejeté';
      
      // Rafraîchir les évaluations pour afficher celle qui vient d'être créée
      await fetchEvaluations();
      
      alert('Évaluation enregistrée avec succès !');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet de la demande');
    }
  };

  const handleDownloadPDF = () => {
    generateApprovalPDF(demande, evaluationScores, totalScore);
  };

  const totalScore = calculateTotalScore();

  return (
    <div className="space-y-6">
      {/* Back Button and Print Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <span>←</span>
          <span>Retour à la liste</span>
        </button>
        
        <PrintDemande demande={demande} />
      </div>

      {/* Candidate Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{demande.nom}</h2>
            <p className="text-lg text-gray-600">{demande.entreprise}</p>
          </div>
          <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
            demande.statusBrut === 'EN_ATTENTE' 
              ? 'text-yellow-700 bg-yellow-100' 
              : demande.statusBrut === 'APPROUVE'
              ? 'text-green-700 bg-green-100'
              : 'text-red-700 bg-red-100'
          }`}>
            {demande.statut}
          </span>
        </div>

        {/* Informations personnelles */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Informations Personnelles</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nationalité</p>
              <p className="font-medium text-gray-900">{demande.nationalite || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Âge</p>
              <p className="font-medium text-gray-900">{demande.age || 'N/A'} ans</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sexe</p>
              <p className="font-medium text-gray-900">{demande.sexe || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium text-gray-900">{demande.telephone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{demande.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-medium text-gray-900">{demande.adresse}</p>
            </div>
          </div>
        </div>

        {/* Informations de l'entreprise */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Informations de l'Entreprise</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nom de l'entreprise</p>
              <p className="font-medium text-gray-900">{demande.entreprise}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type d'inscription</p>
              <p className="font-medium text-gray-900">{demande.typeInscription || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Registre de commerce</p>
              <p className="font-medium text-gray-900">{demande.registreCommerce || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Secteur d'activité</p>
              <p className="font-medium text-gray-900">{demande.secteur}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre d'employés</p>
              <p className="font-medium text-gray-900">{demande.employes}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expérience antérieure</p>
              <p className="font-medium text-gray-900">{demande.experience}</p>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Localisation</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Région</p>
              <p className="font-medium text-gray-900">{demande.region || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Localisation précise</p>
              <p className="font-medium text-gray-900">{demande.localisation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Site de préférence</p>
              <p className="font-medium text-gray-900">{demande.sitePreference || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Produits et Production */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Produits et Production</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Produits proposés</p>
              <p className="font-medium text-gray-900">{demande.produits}</p>
            </div>
            {demande.listeProduitsDetaillee && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Liste détaillée des produits</p>
                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-line">{demande.listeProduitsDetaillee}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Capacité de production mensuelle</p>
              <p className="font-medium text-gray-900">{demande.capaciteProduction || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Taille de kiosque souhaitée</p>
              <p className="font-medium text-gray-900">{demande.tailleKiosque || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Expérience antérieure</p>
              <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">{demande.experience || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de demande</p>
              <p className="font-medium text-gray-900">{demande.date}</p>
            </div>
          </div>
        </div>

        {/* Informations complémentaires pour l'évaluation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Informations Complémentaires pour l'Évaluation</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Origine des matières premières</p>
              <p className="font-medium text-gray-900">{demande.origineMatieresPremieres || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transformation/Fabrication au Niger</p>
              <p className="font-medium text-gray-900">{demande.transformationAuNiger || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Régularité de l'approvisionnement</p>
              <p className="font-medium text-gray-900">{demande.regulariteApprovisionnement || 'Non spécifié'}</p>
            </div>
            {demande.innovation && (
              <div className="col-span-3">
                <p className="text-sm text-gray-500">Innovation dans les produits</p>
                <p className="font-medium text-gray-900 bg-blue-50 p-3 rounded-lg">{demande.innovation}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Capacité d'adaptation à la demande</p>
              <p className="font-medium text-gray-900">{demande.adaptationDemandeCroissante || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre de femmes dans l'équipe</p>
              <p className="font-medium text-gray-900">{demande.nombreFemmes !== undefined && demande.nombreFemmes !== null ? demande.nombreFemmes : 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre de jeunes (18-35 ans)</p>
              <p className="font-medium text-gray-900">{demande.nombreJeunes !== undefined && demande.nombreJeunes !== null ? demande.nombreJeunes : 'Non spécifié'}</p>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-gray-500">Certificat de conformité / Normes de qualité</p>
              <p className="font-medium text-gray-900">{demande.certificatConformite || 'Non spécifié'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Joints */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Documents Joints</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Carte d'identité */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Carte d'identité</span>
              {demande.carteIdentiteUrl ? (
                <span className="text-green-600">
                  <FaCheck />
                </span>
              ) : (
                <span className="text-gray-400">
                  <FaTimes />
                </span>
              )}
            </div>
            {demande.carteIdentiteUrl ? (
              <FileViewerButton 
                fileUrl={demande.carteIdentiteUrl}
                fileName="Carte d'identité"
                label="Voir le document"
              />
            ) : (
              <p className="text-sm text-gray-500">Non fourni</p>
            )}
          </div>

          {/* Registre de commerce */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Registre de commerce</span>
              {demande.registreCommerceDocUrl ? (
                <span className="text-green-600">
                  <FaCheck />
                </span>
              ) : (
                <span className="text-gray-400">
                  <FaTimes />
                </span>
              )}
            </div>
            {demande.registreCommerceDocUrl ? (
              <FileViewerButton 
                fileUrl={demande.registreCommerceDocUrl}
                fileName="Registre de commerce"
                label="Voir le document"
              />
            ) : demande.registreCommerce ? (
              <p className="text-sm text-gray-600">N° {demande.registreCommerce}</p>
            ) : (
              <p className="text-sm text-gray-500">Non fourni</p>
            )}
          </div>

          {/* Liste des produits */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Liste des produits</span>
              {demande.listeProduitsFileUrl ? (
                <span className="text-green-600">
                  <FaCheck />
                </span>
              ) : (
                <span className="text-gray-400">
                  <FaTimes />
                </span>
              )}
            </div>
            {demande.listeProduitsFileUrl ? (
              <FileViewerButton 
                fileUrl={demande.listeProduitsFileUrl}
                fileName="Liste des produits"
                label="Voir le document"
              />
            ) : (
              <p className="text-sm text-gray-500">Non fourni</p>
            )}
          </div>
        </div>

        {/* Détail des produits proposés */}
        {demande.listeProduitsDetaillee && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Liste détaillée des produits proposés :</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{demande.listeProduitsDetaillee}</p>
          </div>
        )}

        {/* Photos des produits */}
        {demande.photoProduitsUrls && (() => {
          try {
            const photos = JSON.parse(demande.photoProduitsUrls);
            if (Array.isArray(photos) && photos.length > 0) {
              return (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📸</span>
                    Photos des produits ({photos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {photos.map((photoUrl: string, index: number) => (
                      <div 
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedPhoto(photoUrl)}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-primary-500 transition-all">
                          <img
                            src={photoUrl.includes('/uploads/documents/') ? `/api/files/${photoUrl.split('/uploads/documents/').pop()}` : photoUrl}
                            alt={`Produit ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                          <FaEye className="text-white opacity-0 group-hover:opacity-100 text-2xl transition-opacity" />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center">Photo {index + 1}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    💡 Cliquez sur une photo pour l'agrandir
                  </p>
                </div>
              );
            }
          } catch (e) {
            console.error('Erreur lors du parsing des photos:', e);
          }
          return null;
        })()}
      </div>

      {/* Lightbox Modal pour afficher les photos en grand */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-3 transition-all"
            title="Fermer"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.includes('/uploads/documents/') ? `/api/files/${selectedPhoto.split('/uploads/documents/').pop()}` : selectedPhoto}
              alt="Photo agrandie"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Statut d'Évaluation du Jury */}
      {evaluationStats && evaluationStats.juryMembers.total > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaUsers className="mr-2 text-blue-600" />
            Statut d'Évaluation des Jurys
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total de jurys</p>
              <p className="text-3xl font-bold text-gray-900">{evaluationStats.juryMembers.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Ont évalué</p>
              <p className="text-3xl font-bold text-green-600">{evaluationStats.juryMembers.evaluated}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Score moyen</p>
              <p className="text-3xl font-bold text-blue-600">
                {evaluationStats.statistics.averageJuryScore.toFixed(1)}/100
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression des évaluations</span>
              <span className="text-sm font-bold text-gray-900">
                {evaluationStats.juryMembers.evaluated}/{evaluationStats.juryMembers.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  evaluationStats.statistics.allJuriesEvaluated ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ 
                  width: `${(evaluationStats.juryMembers.evaluated / evaluationStats.juryMembers.total) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Liste des jurys qui n'ont pas encore évalué */}
          {evaluationStats.juryMembers.notEvaluated.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <FaClipboardList className="mr-2" />
                En attente d'évaluation ({evaluationStats.juryMembers.notEvaluated.length})
              </h4>
              <ul className="space-y-1">
                {evaluationStats.juryMembers.notEvaluated.map((jury: any) => (
                  <li key={jury.id} className="text-sm text-yellow-700">
                    • {jury.prenom} {jury.nom} ({jury.email})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Statut de validation du président */}
          {evaluationStats.statistics.allJuriesEvaluated && (
            <div className={`rounded-lg p-4 ${
              evaluationStats.statistics.hasPresidentValidated 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-blue-100 border-2 border-blue-500'
            }`}>
              {evaluationStats.statistics.hasPresidentValidated ? (
                <div className="flex items-center text-green-800">
                  <FaCheck className="text-2xl mr-3" />
                  <div>
                    <h4 className="font-bold">Validation finale effectuée</h4>
                    <p className="text-sm">
                      Décision: <strong>{evaluationStats.statistics.finalDecision === 'APPROUVE' ? 'Approuvé' : 'Rejeté'}</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-blue-800">
                  <FaUserShield className="text-2xl mr-3" />
                  <div>
                    <h4 className="font-bold">Prêt pour la validation finale</h4>
                    <p className="text-sm">
                      Tous les jurys ont évalué. Le président du jury peut maintenant procéder à la validation finale.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Évaluations existantes */}
      {existingEvaluations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Historique des Évaluations</h3>
          
          {loadingEvaluations ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {existingEvaluations.map((evaluation, index) => (
                <div key={evaluation.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {evaluation.evaluateur.prenom[0]}{evaluation.evaluateur.nom[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {evaluation.evaluateur.prenom} {evaluation.evaluateur.nom}
                        </h4>
                        <p className="text-sm text-gray-600">{evaluation.evaluateur.role}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(evaluation.dateEvaluation).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl font-bold text-primary-600">
                          {evaluation.scoreTotal.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">/ 100</span>
                      </div>
                      {evaluation.decision && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          evaluation.decision === 'APPROUVE' 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-red-700 bg-red-100'
                        }`}>
                          {evaluation.decision === 'APPROUVE' ? 'Approuvé' : 'Rejeté'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Barre de progression du score */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          evaluation.scoreTotal >= 70 ? 'bg-green-500' : 
                          evaluation.scoreTotal >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${evaluation.scoreTotal}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Détails des commentaires si présents */}
                  {evaluation.commentaires && Object.keys(evaluation.commentaires).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <button
                        onClick={() => {
                          const details = document.getElementById(`eval-details-${evaluation.id}`);
                          if (details) {
                            details.classList.toggle('hidden');
                          }
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Voir les commentaires détaillés
                      </button>
                      <div id={`eval-details-${evaluation.id}`} className="hidden mt-3">
                        <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                          {Object.entries(evaluation.commentaires).map(([key, value]: [string, any]) => (
                            value && (
                              <div key={key} className="border-b border-gray-100 pb-2 last:border-0">
                                <p className="text-gray-600 font-medium">{key}:</p>
                                <p className="text-gray-800">{value}</p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bouton Évaluer - Adapté selon le rôle */}
      {!showEvaluation && demande.statusBrut === 'EN_ATTENTE' && !hasUserEvaluated && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            {currentUserRole === 'PRESIDENT_JURY' && evaluationStats && !evaluationStats.statistics.allJuriesEvaluated ? (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                <FaUserShield className="text-4xl text-yellow-600 mx-auto mb-3" />
                <h4 className="font-bold text-yellow-800 mb-2">Validation finale en attente</h4>
                <p className="text-yellow-700">
                  En tant que président du jury, vous devez attendre que tous les membres du jury 
                  aient évalué cette demande avant de procéder à la validation finale.
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  {evaluationStats.juryMembers.evaluated}/{evaluationStats.juryMembers.total} jurys ont évalué
                </p>
              </div>
            ) : currentUserRole === 'PRESIDENT_JURY' && evaluationStats && evaluationStats.statistics.allJuriesEvaluated ? (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <FaUserShield className="text-4xl text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-blue-800 mb-2">Validation finale</h4>
                <p className="text-blue-700 mb-4">
                  Tous les jurys ont évalué cette demande. Vous pouvez maintenant procéder à la validation finale.
                </p>
                <p className="text-sm text-blue-600 mb-4">
                  Score moyen des jurys: <strong>{evaluationStats.statistics.averageJuryScore.toFixed(1)}/100</strong>
                </p>
                <button
                  onClick={() => setShowEvaluation(true)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <FaUserShield className="inline-block mr-2" />
                  Procéder à la Validation Finale
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">Après avoir examiné le dossier du candidat, vous pouvez procéder à l'évaluation.</p>
                <button
                  onClick={() => setShowEvaluation(true)}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  <FaClipboardList className="inline-block mr-2" />
                  Commencer l'Évaluation
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Message si l'utilisateur a déjà évalué */}
      {hasUserEvaluated && demande.statusBrut === 'EN_ATTENTE' && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-center justify-center text-green-800">
            <FaCheck className="text-3xl mr-3" />
            <div className="text-center">
              <h4 className="font-bold text-lg">Vous avez déjà évalué cette demande</h4>
              <p className="text-sm">Votre évaluation a été enregistrée avec succès.</p>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Grid - Affiché seulement si showEvaluation est true */}
      {showEvaluation && (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Grille d'Évaluation</h3>

        <div className="space-y-8">
          {criteria.map((category) => {
            const categoryTotal = calculateCategoryTotal(category.id, category.subCriteria);
            
            return (
              <div key={category.id} className="border-l-4 border-primary-500 pl-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">{category.title}</h4>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score obtenu</p>
                    <p className="text-xl font-bold text-primary-600">
                      {categoryTotal.toFixed(1)} / {category.weight}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.subCriteria.map((sub) => {
                    const scoreKey = `${category.id}_${sub.id}`;
                    const currentNote = evaluationScores[scoreKey] || 0;
                    const subScore = calculateSubScore(sub.weight, currentNote);

                    return (
                      <div key={sub.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">{sub.label}</p>
                            <p className="text-sm text-gray-500">Pondération: {sub.weight}%</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm text-gray-500">Score</p>
                            <p className="text-lg font-bold text-gray-900">
                              {subScore.toFixed(1)} / {sub.weight}
                            </p>
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">Note (0-5) :</p>
                          <div className="flex space-x-2">
                            {[0, 1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                onClick={() => handleScoreChange(scoreKey, value)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                  currentNote === value
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comments */}
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Commentaires :</label>
                          <textarea
                            value={comments[scoreKey] || ''}
                            onChange={(e) => handleCommentChange(scoreKey, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={2}
                            placeholder="Ajoutez vos observations..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Score */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border-2 border-primary-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Score Total</h3>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary-600">{totalScore.toFixed(1)} / 100</p>
              <p className="text-sm text-gray-600 mt-1">
                {totalScore >= 70 ? '✅ Qualifié' : totalScore >= 50 ? '⚠️ À revoir' : '❌ Non qualifié'}
              </p>
            </div>
          </div>
          
          {totalScore > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    totalScore >= 70 ? 'bg-green-500' : totalScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${totalScore}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Decision Buttons - Affiché seulement si l'évaluation est en cours */}
      {showEvaluation && (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Décision Finale</h3>
        
        {!decision ? (
          <div className="flex space-x-4">
            <button
              onClick={handleApproval}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
              disabled={totalScore === 0}
            >
              <FaCheck className="text-xl" />
              <span>Approuver la Demande</span>
            </button>
            <button
              onClick={handleRejection}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              <FaTimes className="text-xl" />
              <span>Rejeter la Demande</span>
            </button>
          </div>
        ) : (
          <div className={`p-6 rounded-xl ${decision === 'approved' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
            <div className="text-center">
              <div className={`text-5xl mb-4 ${decision === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                {decision === 'approved' ? <FaCheck className="mx-auto" /> : <FaTimes className="mx-auto" />}
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {decision === 'approved' ? 'Demande Approuvée !' : 'Demande Rejetée'}
              </h4>
              <p className="text-gray-700 mb-4">
                {decision === 'approved' 
                  ? `${demande.nom} a été accepté(e) comme exposant. Un email de confirmation sera envoyé.`
                  : `La demande de ${demande.nom} a été rejetée. Un email de notification sera envoyé.`
                }
              </p>
              {decision === 'approved' && (
                <div className="mb-6">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-center mb-4">
                      <FaFilePdf className="text-4xl text-blue-600 mr-3" />
                      <div className="text-left">
                        <h5 className="text-lg font-bold text-gray-900">Document d'Approbation</h5>
                        <p className="text-sm text-gray-600">
                          Souhaitez-vous télécharger l'attestation d'approbation en PDF ?
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <FaDownload className="text-lg" />
                      <span>Télécharger l'Attestation PDF</span>
                    </button>
                  </div>
                </div>
              )}
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
                >
                  Retour à la liste
                </button>
                <button
                  onClick={() => setDecision(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Modifier la décision
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
