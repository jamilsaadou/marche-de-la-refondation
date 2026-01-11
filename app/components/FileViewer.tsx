"use client";

import { useState } from 'react';
import { FaDownload, FaTimes, FaExpand, FaCompress, FaFileAlt, FaFilePdf, FaImage } from 'react-icons/fa';

interface FileViewerProps {
  fileUrl: string;
  fileName?: string;
  onClose?: () => void;
  showModal?: boolean;
}

/**
 * Composant pour visualiser les fichiers (images, PDF) directement sur la plateforme
 */
export default function FileViewer({ fileUrl, fileName, onClose, showModal = false }: FileViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!fileUrl) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaFileAlt className="mx-auto text-4xl mb-2" />
        <p>Aucun fichier à afficher</p>
      </div>
    );
  }

  // Extraire le nom du fichier depuis l'URL
  const extractedFileName = fileName || fileUrl.split('/').pop() || 'document';
  
  // Convertir l'URL pour utiliser l'API de fichiers
  // Si l'URL commence par /uploads/ ou contient uploads/, extraire le nom du fichier
  let apiFileUrl = fileUrl;
  if (fileUrl.includes('/uploads/documents/')) {
    const filename = fileUrl.split('/uploads/documents/').pop();
    apiFileUrl = `/api/files/${filename}`;
  } else if (fileUrl.startsWith('/uploads/')) {
    apiFileUrl = `/api/files/${fileUrl.split('/').pop()}`;
  }

  // Déterminer le type de fichier
  const fileExtension = extractedFileName.split('.').pop()?.toLowerCase();
  const isPDF = fileExtension === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = apiFileUrl;
    link.download = extractedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = () => {
    if (isPDF) return <FaFilePdf className="text-red-500" />;
    if (isImage) return <FaImage className="text-blue-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Impossible de charger le fichier');
  };

  const content = (
    <div className={`${showModal ? 'fixed inset-0 z-50 bg-black bg-opacity-90' : 'bg-white rounded-lg border border-gray-200'} ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getFileIcon()}
          <div>
            <p className="font-medium text-gray-900 text-sm">{extractedFileName}</p>
            <p className="text-xs text-gray-500">
              {isPDF && 'Document PDF'}
              {isImage && 'Image'}
              {!isPDF && !isImage && 'Document'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
            title="Télécharger"
          >
            <FaDownload />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
            title={isFullscreen ? "Réduire" : "Plein écran"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
          {(onClose || showModal) && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              title="Fermer"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`${isFullscreen ? 'h-screen' : showModal ? 'h-[calc(100vh-60px)]' : 'h-96'} overflow-auto bg-gray-50 flex items-center justify-center relative`}>
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Chargement...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 p-8">
            <FaFileAlt className="mx-auto text-5xl mb-3" />
            <p className="font-medium mb-2">{error}</p>
            <p className="text-sm text-gray-600">
              Le fichier est peut-être corrompu ou inaccessible
            </p>
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Essayer de télécharger
            </button>
          </div>
        )}

        {!error && (
          <>
            {isImage && (
              <img
                src={apiFileUrl}
                alt={extractedFileName}
                className="max-w-full max-h-full object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}

            {isPDF && (
              <iframe
                src={`${apiFileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                onLoad={handleImageLoad}
                onError={handleImageError}
                title={extractedFileName}
              />
            )}

            {!isImage && !isPDF && (
              <div className="text-center p-8">
                <FaFileAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Aperçu non disponible pour ce type de fichier
                </p>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2 mx-auto"
                >
                  <FaDownload />
                  <span>Télécharger le fichier</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black bg-opacity-75"
          onClick={onClose}
        />
        <div className="relative w-full max-w-6xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

/**
 * Composant simplifié pour afficher un bouton qui ouvre le visualiseur en modal
 */
export function FileViewerButton({ fileUrl, fileName, label = "Voir le document" }: { fileUrl: string; fileName?: string; label?: string }) {
  const [showViewer, setShowViewer] = useState(false);

  if (!fileUrl) {
    return (
      <span className="text-sm text-gray-500">Non fourni</span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowViewer(true)}
        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
      >
        <FaFileAlt />
        <span>{label}</span>
      </button>

      {showViewer && (
        <FileViewer
          fileUrl={fileUrl}
          fileName={fileName}
          onClose={() => setShowViewer(false)}
          showModal={true}
        />
      )}
    </>
  );
}
