'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AthleteShowcase from '@/components/AthleteShowcase';

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer - set your race date here
  useEffect(() => {
    const raceDate = new Date('2025-08-15T09:00:00'); // Update with actual race date
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = raceDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-white text-xl font-bold">
              Hell of the West
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-white hover:text-orange-400 transition-colors duration-300">About</a>
              <a href="#register" className="text-white hover:text-orange-400 transition-colors duration-300">Register</a>
              <a href="#course" className="text-white hover:text-orange-400 transition-colors duration-300">Course</a>
              <a href="#40th" className="text-white hover:text-orange-400 transition-colors duration-300">40th Anniversary</a>
              <a href="#contact" className="text-white hover:text-orange-400 transition-colors duration-300">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image - Replace with actual Kilkee coastline image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/kilkee-coastline.jpg" // Add your Kilkee image here
            alt="Kilkee Coastline - Hell of the West Triathlon"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              40th Anniversary
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            Hell of the <span className="text-orange-400">West</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
            Experience Ireland&apos;s most challenging triathlon on the dramatic Atlantic coastline of Kilkee, Co. Clare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open('https://eventickets.ie/events/hell-of-west-2025', '_blank')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Register Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Key Information Bar */}
      <section className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            {/* Event Date */}
            <div className="flex flex-col items-center">
              <div className="text-orange-400 text-2xl mb-2">📅</div>
              <h3 className="font-semibold text-lg mb-1">Event Date</h3>
              <p className="text-gray-300">August 15, 2025</p>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center">
              <div className="text-orange-400 text-2xl mb-2">📍</div>
              <h3 className="font-semibold text-lg mb-1">Location</h3>
              <p className="text-gray-300">Kilkee, Co. Clare</p>
            </div>

            {/* Registration Status */}
            <div className="flex flex-col items-center">
              <div className="text-orange-400 text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-lg mb-1">Registration</h3>
              <p className="text-green-400 font-semibold">OPEN</p>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-center">
              <div className="text-orange-400 text-2xl mb-2">⏰</div>
              <h3 className="font-semibold text-lg mb-1">Countdown</h3>
              <div className="flex space-x-2 text-sm">
                <span className="bg-orange-500 px-2 py-1 rounded">{timeLeft.days}d</span>
                <span className="bg-orange-500 px-2 py-1 rounded">{timeLeft.hours}h</span>
                <span className="bg-orange-500 px-2 py-1 rounded">{timeLeft.minutes}m</span>
                <span className="bg-orange-500 px-2 py-1 rounded">{timeLeft.seconds}s</span>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      <AthleteShowcase 
      autoPlay={true}           // Enable/disable auto-play
      autoPlayInterval={5000}   // Change speed (milliseconds)
        title="Legends of the West" 
        subtitle="40 years of athletes conquering Ireland's most challenging triathlon"
        />

      {/* Placeholder for additional sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            40 Years of Hell of the West
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Since 1985, Hell of the West has challenged athletes on the rugged Atlantic coastline of Kilkee. 
            Join us for this milestone 40th anniversary edition of Ireland&apos;s most demanding triathlon.
          </p>
        </div>
      </section>
    </>
  );
}