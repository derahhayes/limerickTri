'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Types for our athlete data
interface Athlete {
  id: number;
  name: string;
  year: string;
  category: string;
  image: string;
  description?: string;
  time?: string;
}

interface AthleteCarouselProps {
  title?: string;
  subtitle?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

// Function to parse filename and extract athlete info
function parseFilename(filename: string): Omit<Athlete, 'id' | 'image'> {
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const yearMatch = nameWithoutExt.match(/(\d{4})$/);
  const year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
  const nameWithoutYear = yearMatch ? nameWithoutExt.replace(/-?\d{4}$/, '') : nameWithoutExt;
  
  const name = nameWithoutYear
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  let category = 'Competitor';
  const currentYear = new Date().getFullYear();
  const photoYear = parseInt(year);
  
  if (currentYear - photoYear > 30) {
    category = 'Pioneer';
  } else if (currentYear - photoYear > 10) {
    category = 'Veteran';
  } else if (currentYear - photoYear <= 2) {
    category = 'Recent Champion';
  }

  if (nameWithoutExt.toLowerCase().includes('winner')) {
    category = 'Winner';
  } else if (nameWithoutExt.toLowerCase().includes('record')) {
    category = 'Record Holder';
  } else if (nameWithoutExt.toLowerCase().includes('first')) {
    category = 'First Timer';
  }

  return {
    name,
    year,
    category,
    description: `Competed in Hell of the West ${year}`
  };
}

export default function AthleteCarousel({ 
  title = "Legends of the West",
  subtitle = "40 years of athletes conquering Ireland's most challenging triathlon",
  autoPlay = true,
  autoPlayInterval = 4000
}: AthleteCarouselProps) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadAthleteImages() {
      try {
        const response = await fetch('/api/competitors');
        const imageFiles = await response.json();
        
        if (imageFiles.length === 0) {
          setLoading(false);
          return;
        }

        const athleteData: Athlete[] = imageFiles.map((filename: string, index: number) => {
          const athleteInfo = parseFilename(filename);
          return {
            id: index + 1,
            image: `/images/competitors/${filename}`,
            ...athleteInfo
          };
        });

        athleteData.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        setAthletes(athleteData);
      } catch (error) {
        console.error('Error loading athlete images:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAthleteImages();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && athletes.length > 0 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % athletes.length);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, athletes.length, autoPlayInterval, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + athletes.length) % athletes.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % athletes.length);
  };

  const handleImageError = (athleteId: number) => {
    setImageErrors(prev => new Set(prev).add(athleteId));
  };

  // Get visible slides (current + 2 on each side for larger screens)
  const getVisibleSlides = () => {
    if (athletes.length === 0) return [];
    
    const slides = [];
    const totalSlides = athletes.length;
    
    // Show 5 slides on large screens, 3 on medium, 1 on small
    const slidesToShow = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 5 : typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1;
    const centerOffset = Math.floor(slidesToShow / 2);
    
    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex - centerOffset + i + totalSlides) % totalSlides;
      slides.push({ athlete: athletes[index], index, position: i - centerOffset });
    }
    
    return slides;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-white mt-4">Loading athlete gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (athletes.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300">
            Add competitor photos to /public/images/competitors/ to showcase your athletes!
          </p>
          <div className="mt-8 p-6 bg-gray-800 rounded-lg max-w-2xl mx-auto">
            <p className="text-orange-400 font-semibold mb-2">Quick Setup:</p>
            <p className="text-gray-300 text-sm">
              1. Create folder: public/images/competitors/<br/>
              2. Add JPG files like: john-smith-2023.jpg<br/>
              3. Photos will appear automatically!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const visibleSlides = getVisibleSlides();
  const currentAthlete = athletes[currentIndex];

  return (
    <>
      {/* Main Carousel Section */}
      <section 
        className="relative py-16 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/swimmers-kilkee-bay.jpg" // Swimmers in Kilkee Bay background
            alt="Competitors swimming in Kilkee Bay"
            fill
            className="object-cover"
            priority={false}
          />
          {/* Faded overlay to match hero section styling */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                {title}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {subtitle}
              </p>
              <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
            </div>

            {/* Carousel Container */}
            <div className="relative">
              
              {/* Main Carousel */}
              <div className="relative h-96 mb-8 overflow-hidden rounded-lg">
                <div className="flex items-center justify-center h-full">
                  
                  {/* Desktop: Multiple slides visible */}
                  <div className="hidden md:flex items-center justify-center space-x-4 w-full">
                    {visibleSlides.map(({ athlete, index, position }) => (
                      <div
                        key={athlete.id}
                        className={`relative transition-all duration-500 ease-in-out cursor-pointer ${
                          position === 0 
                            ? 'w-80 h-80 scale-110 z-10' 
                            : 'w-64 h-64 scale-90 opacity-70 hover:opacity-90'
                        }`}
                        onClick={() => position === 0 ? setSelectedAthlete(athlete) : goToSlide(index)}
                      >
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                          {!imageErrors.has(athlete.id) ? (
                            <Image
                              src={athlete.image}
                              alt={`${athlete.name} - ${athlete.year}`}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(athlete.id)}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                              <div className="text-white text-4xl font-bold opacity-20">
                                {athlete.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                          )}
                          {position !== 0 && (
                            <div className="absolute inset-0 bg-black/30"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile: Single slide */}
                  <div className="md:hidden relative w-80 h-80">
                    <div 
                      className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setSelectedAthlete(currentAthlete)}
                    >
                      {!imageErrors.has(currentAthlete.id) ? (
                        <Image
                          src={currentAthlete.image}
                          alt={`${currentAthlete.name} - ${currentAthlete.year}`}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(currentAthlete.id)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <div className="text-white text-6xl font-bold opacity-20">
                            {currentAthlete.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  ←
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  →
                </button>
              </div>

             
              {/* Call to Action */}
              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  Ready to join the legends? Register now for Hell of the West 2025
                </p>
                <button 
                  onClick={() => {
                    const el = document.getElementById('register');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.location.href = '/#register';
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Register Interest
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Selected Athlete */}
      {selectedAthlete && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAthlete(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedAthlete(null)}
                className="absolute top-4 right-4 text-white hover:text-orange-400 z-10 text-2xl"
              >
                ✕
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                {!imageErrors.has(selectedAthlete.id) ? (
                  <Image
                    src={selectedAthlete.image}
                    alt={`${selectedAthlete.name} - ${selectedAthlete.year}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <div className="text-white text-8xl font-bold opacity-20">
                      {selectedAthlete.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Modal Content */}
              <div className="p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-3xl font-bold">{selectedAthlete.name}</h3>
                  <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedAthlete.year}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-orange-400 font-semibold">
                    {selectedAthlete.category}
                  </p>
                  {selectedAthlete.time && (
                    <p className="text-gray-300">
                      <span className="font-semibold">Finish Time:</span> {selectedAthlete.time}
                    </p>
                  )}
                  {selectedAthlete.description && (
                    <p className="text-gray-300 leading-relaxed">
                      {selectedAthlete.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}