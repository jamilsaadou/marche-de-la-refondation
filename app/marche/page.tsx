"use client";

import { useState } from 'react';
import { 
  FaStore, 
  FaMapMarkerAlt, 
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaHeart,
  FaLeaf,
  FaPhone,
  FaStar,
  FaBox
} from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
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

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  vendor: {
    name: string;
    location: string;
    site: string;
    kiosk: string;
    phone: string;
    coordinates: [number, number];
  };
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export default function MarchePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<number[]>([]);

  const categories = [
    "Tous",
    "Agroalimentaire", 
    "Cosmétiques",
    "Textile & Artisanat"
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Farine de Mil Local",
      category: "Agroalimentaire",
      price: 2500,
      image: "/exposition-sur-le-marche-des-fruits-frais.jpg",
      vendor: {
        name: "Coopérative Sahel",
        location: "Site N°1 - Ex-OPVN",
        site: "Rond-point Maourey",
        kiosk: "A-125",
        phone: "+227 90 12 34 56",
        coordinates: [13.514167, 2.108889]
      },
      description: "Farine de mil 100% naturelle, produite localement dans la région de Tillabéri",
      inStock: true,
      rating: 4.8,
      reviews: 45
    },
    {
      id: 2,
      name: "Huile de Moringa Bio",
      category: "Cosmétiques",
      price: 8500,
      image: "/select-1_2.jpg",
      vendor: {
        name: "Femmes Entrepreneurs",
        location: "Site N°2 - Ex-Marché Djémadjé",
        site: "Près du Ministère du Commerce",
        kiosk: "B-234",
        phone: "+227 91 23 45 67",
        coordinates: [13.515833, 2.107778]
      },
      description: "Huile de moringa pressée à froid, riche en vitamines et antioxydants",
      inStock: true,
      rating: 4.9,
      reviews: 67
    },
    {
      id: 3,
      name: "Boubou Traditionnel",
      category: "Textile & Artisanat",
      price: 35000,
      image: "/select-1_13.jpg",
      vendor: {
        name: "Artisans de Niamey",
        location: "Site N°1 - Ex-OPVN",
        site: "Rond-point Maourey",
        kiosk: "A-087",
        phone: "+227 92 34 56 78",
        coordinates: [13.514167, 2.108889]
      },
      description: "Boubou brodé à la main avec motifs traditionnels touarègues",
      inStock: true,
      rating: 5.0,
      reviews: 23
    },
    {
      id: 4,
      name: "Miel de Brousse",
      category: "Agroalimentaire",
      price: 4500,
      image: "/exposition-sur-le-marche-des-fruits-frais.jpg",
      vendor: {
        name: "Apiculteurs du Niger",
        location: "Site N°2 - Ex-Marché Djémadjé",
        site: "Près du Ministère du Commerce",
        kiosk: "B-156",
        phone: "+227 93 45 67 89",
        coordinates: [13.515833, 2.107778]
      },
      description: "Miel pur et naturel récolté dans les zones rurales",
      inStock: true,
      rating: 4.7,
      reviews: 89
    },
    {
      id: 5,
      name: "Savon au Karité",
      category: "Cosmétiques",
      price: 1500,
      image: "/select-1_25.jpg",
      vendor: {
        name: "Beauté Naturelle",
        location: "Site N°1 - Ex-OPVN",
        site: "Rond-point Maourey",
        kiosk: "A-203",
        phone: "+227 94 56 78 90",
        coordinates: [13.514167, 2.108889]
      },
      description: "Savon artisanal enrichi au beurre de karité, idéal pour peaux sensibles",
      inStock: true,
      rating: 4.6,
      reviews: 112
    },
    {
      id: 6,
      name: "Dattier du Sahel",
      category: "Agroalimentaire",
      price: 3000,
      image: "/exposition-sur-le-marche-des-fruits-frais.jpg",
      vendor: {
        name: "Oasis du Désert",
        location: "Site N°2 - Ex-Marché Djémadjé",
        site: "Près du Ministère du Commerce",
        kiosk: "B-089",
        phone: "+227 95 67 89 01",
        coordinates: [13.515833, 2.107778]
      },
      description: "Dattes fraîches de qualité supérieure, riches en énergie",
      inStock: true,
      rating: 4.8,
      reviews: 56
    },
    {
      id: 7,
      name: "Panier Artisanal",
      category: "Textile & Artisanat",
      price: 12000,
      image: "/select-1_8.jpg",
      vendor: {
        name: "Artisanat Traditionnel",
        location: "Site N°1 - Ex-OPVN",
        site: "Rond-point Maourey",
        kiosk: "A-145",
        phone: "+227 96 78 90 12",
        coordinates: [13.514167, 2.108889]
      },
      description: "Panier tressé à la main en fibres naturelles, durable et écologique",
      inStock: true,
      rating: 4.5,
      reviews: 34
    },
    {
      id: 8,
      name: "Beurre de Karité",
      category: "Cosmétiques",
      price: 6500,
      image: "/portrait-photorealiste-d-une-personne-gerant-et-proprietaire-de-son-entreprise.jpg",
      vendor: {
        name: "Femmes Entrepreneurs",
        location: "Site N°2 - Ex-Marché Djémadjé",
        site: "Près du Ministère du Commerce",
        kiosk: "B-234",
        phone: "+227 91 23 45 67",
        coordinates: [13.515833, 2.107778]
      },
      description: "Beurre de karité pur à 100%, hydratant et nourrissant",
      inStock: true,
      rating: 4.9,
      reviews: 98
    },
    {
      id: 9,
      name: "Riz Local Premium",
      category: "Agroalimentaire",
      price: 5500,
      image: "/exposition-sur-le-marche-des-fruits-frais.jpg",
      vendor: {
        name: "Coopérative Sahel",
        location: "Site N°1 - Ex-OPVN",
        site: "Rond-point Maourey",
        kiosk: "A-125",
        phone: "+227 90 12 34 56",
        coordinates: [13.514167, 2.108889]
      },
      description: "Riz cultivé au Niger, grain long et parfumé",
      inStock: true,
      rating: 4.7,
      reviews: 78
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
  };

  const isInCart = (productId: number) => {
    return cart.includes(productId);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Shopping Cart Button - Fixed position */}
      <div className="fixed top-20 right-4 z-40">
        <button className="relative p-3 glass-effect rounded-lg hover-lift shadow-lg">
          <FaShoppingCart className="text-2xl text-primary-600" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-medium mb-4">
            <FaLeaf />
            <span>Produits 100% Locaux</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Boutique en Ligne du <span className="gradient-text">Marché de la Réfondation</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Découvrez et achetez les meilleurs produits locaux de Niamey avec livraison à domicile
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 glass-effect rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Category Filter - Horizontal Scroll on Mobile */}
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium whitespace-nowrap transition-all text-sm sm:text-base ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                        : 'glass-effect text-gray-700 hover-lift'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {/* Scroll indicator for mobile */}
              <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none sm:hidden"></div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm sm:text-base text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> produit(s) disponible(s)
              </div>
              <button className="sm:hidden p-2 glass-effect rounded-lg">
                <FaFilter className="text-primary-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="glass-effect rounded-2xl overflow-hidden hover-lift group"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.inStock && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      En stock
                    </div>
                  )}
                  <button className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <FaHeart className="text-accent-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews} avis)
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Vendor Info */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-start space-x-2 text-sm">
                      <FaStore className="text-primary-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{product.vendor.name}</p>
                        <p className="text-gray-600 text-xs">{product.vendor.location}</p>
                        <p className="text-gray-500 text-xs">Kiosque: {product.vendor.kiosk}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        {product.price.toLocaleString()} <span className="text-lg">CFA</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-3 glass-effect rounded-lg hover-lift"
                        title="Voir la localisation"
                      >
                        <FaMapMarkerAlt className="text-accent-600" />
                      </button>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={isInCart(product.id)}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          isInCart(product.id)
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover-lift'
                        }`}
                      >
                        {isInCart(product.id) ? 'Ajouté' : 'Acheter'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Location Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-effect rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Localisation du Vendeur
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-600">×</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Vendor Details */}
                <div className="space-y-4">
                  <div className="glass-effect rounded-xl p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      {selectedProduct.vendor.name}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-primary-600" />
                        <span>{selectedProduct.vendor.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaStore className="text-accent-600" />
                        <span>Kiosque: {selectedProduct.vendor.kiosk}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaPhone className="text-primary-600" />
                        <span>{selectedProduct.vendor.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-effect rounded-xl p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      {selectedProduct.description}
                    </p>
                    <div className="text-2xl font-bold text-primary-600">
                      {selectedProduct.price.toLocaleString()} CFA
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct.id);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover-lift"
                    >
                      <FaShoppingCart className="inline mr-2" />
                      Acheter en ligne
                    </button>
                    <a
                      href={`tel:${selectedProduct.vendor.phone}`}
                      className="flex-1 px-6 py-3 glass-effect text-primary-700 rounded-xl font-semibold hover-lift text-center"
                    >
                      <FaPhone className="inline mr-2" />
                      Appeler
                    </a>
                  </div>
                </div>

                {/* Map */}
                <div className="h-[400px] rounded-xl overflow-hidden">
                  <LocationMap highlightedVendor={selectedProduct.vendor} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-effect rounded-2xl p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdLocalShipping className="text-3xl text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Livraison Niamey</h4>
              <p className="text-sm text-gray-600">Livraison dans toute la ville de Niamey</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-3xl text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">100% Local</h4>
              <p className="text-sm text-gray-600">Produits fabriqués au Niger</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBox className="text-3xl text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Qualité Garantie</h4>
              <p className="text-sm text-gray-600">Standards de qualité vérifiés</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-3xl text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Support Client</h4>
              <p className="text-sm text-gray-600">Assistance disponible 7j/7</p>
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
                Plateforme e-commerce officielle du Marché de la Réfondation
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Informations</h4>
              <ul className="space-y-2 text-white/80">
                <li>Produits 100% locaux</li>
                <li>Livraison à Niamey</li>
                <li>Paiement sécurisé</li>
                <li>Support client</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-white/80 mb-2">Niamey, République du Niger</p>
              <p className="text-white/80">Centenaire de Niamey 2026</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>© 2025-2026 Marché de la Réfondation. République du Niger</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
