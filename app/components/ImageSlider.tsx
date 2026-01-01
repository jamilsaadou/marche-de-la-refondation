"use client";

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SlideImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: SlideImage[] = [
    {
      src: "/produits locaux.jpeg",
      alt: "Exposition marché fruits frais",
      title: "Produits Locaux",
      description: "Valorisation des fruits et légumes nigériens"
    },
    {
      src: "/select-1_13.jpg",
      alt: "Marché de la Réfondation",
      title: "Infrastructure Moderne",
      description: "Des kiosques modernes pour les entrepreneurs"
    },
    {
      src: "/select-1_10.jpg",
      alt: "Portrait entrepreneur",
      title: "Entrepreneurs Locaux",
      description: "Soutien aux femmes et jeunes entrepreneurs"
    },
    {
      src: "/select-1_25.jpg",
      alt: "Produits locaux",
      title: "Produits Artisanaux",
      description: "Artisanat et créations 100% nigériennes"
    },
    {
      src: "/select-1_2.jpg",
      alt: "Commerce local",
      title: "Commerce Dynamique",
      description: "Un marché moderne pour le centenaire de Niamey"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  return (
    <div className="relative w-full h-[420px] md:h-[520px] lg:h-[550px] overflow-hidden rounded-2xl">
      {/* Main Slider Container with Glassmorphism */}
      <div className="relative w-full h-full">
        {/* Background Blur Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 backdrop-blur-sm"></div>
        
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                ? 'opacity-0 -translate-x-full' 
                : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Image */}
            <img 
              src={slide.src} 
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Glassmorphism Content Card */}
            <div className="absolute bottom-8 left-8 right-8 md:left-12 md:right-auto md:max-w-md">
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {slide.title}
                </h3>
                <p className="text-white/90 text-lg drop-shadow-md">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons with Glassmorphism */}
        <button
          onClick={() => {
            prevSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 shadow-xl group"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-xl group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <button
          onClick={() => {
            nextSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 shadow-xl group"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-xl group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Slide Indicators with Glassmorphism */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 p-3 backdrop-blur-md bg-white/20 border border-white/30 rounded-full shadow-xl">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-8 h-2 bg-white shadow-lg' 
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-[4000ms] ease-linear"
            style={{
              width: isAutoPlaying ? '100%' : '0%',
              transitionDuration: isAutoPlaying ? '4000ms' : '0ms'
            }}
          />
        </div>
      </div>
    </div>
  );
}
