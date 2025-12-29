// src/app/course/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseMapProps {
  title: string;
  distance: string;
  elevation?: string;
  description: string;
  embedUrl?: string;
  mapProvider: 'ridewithgps' | 'mapbox' | 'strava' | 'komoot';
  highlights: string[];
}

const courseData: Record<'swim' | 'bike' | 'run', CourseMapProps> = {
    swim: {
        title: "Swim Course - Kilkee Bay",
        distance: "1.5km",
       
        description: "Start your Hell of the West challenge in the protected waters of Kilkee's horseshoe bay. The swim takes you around the natural amphitheater with the dramatic cliffs as your backdrop.",
        embedUrl: "https://ridewithgps.com/embeds?type=route&id=52738908&title=Hell%20of%20the%20West%20(Swim)&hideSurface=true",
        mapProvider: 'ridewithgps' as const,
        highlights: [
          "Sheltered bay start",
          "Crystal clear Atlantic water",
          "Stunning cliff views throughout",
          "Professional safety boat coverage"
        ]
      },
  bike: {
    title: "Bike Course - Wild Atlantic Way",
    distance: "46km",
    description: "Experience the raw beauty and challenge of Ireland's Wild Atlantic Way. This course will test your endurance with rolling coastal roads, challenging climbs, and breathtaking Atlantic views.",
    embedUrl: "https://ridewithgps.com/embeds?type=route&id=52739026&metricUnits=true", // We'll add the actual RideWithGPS embed here
    mapProvider: 'ridewithgps' as const,
    highlights: [
      "Spectacular coastal roads",
      "Challenging climbs through Loop Head",
      "Technical descents with ocean views",
      "Historic landmarks along the route",
      ]
  },
  run: {
    title: "Run Course - Kilkee Coastaline Route",
    distance: "10km",
    description: "Finish strong on the rugged coastline around Kilkee. This run combines terrain with some of the most spectacular scenery in Ireland.",
    embedUrl: "https://ridewithgps.com/embeds?type=route&id=52739074&metricUnits=true",
    mapProvider: 'ridewithgps' as const,
    highlights: [
      "Cliff-top running with ocean views",
      "terrain - Asphalt roads",
      "Historic Kilkee promenade section",
      ]
  }
};

function CourseMap({ title, distance, elevation, description, embedUrl, mapProvider, highlights }: CourseMapProps) {
  const [mapError, setMapError] = useState(false);

  const getMapPlaceholder = () => {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center rounded-lg">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-blue-100">Interactive map coming soon</p>
          <p className="text-sm text-blue-200 mt-2">
            Upload your {mapProvider} embed URL to display the course
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Map Container */}
      <div className="relative">
        {embedUrl && !mapError ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setMapError(true)}
            className="w-full h-96"
          />
        ) : (
          getMapPlaceholder()
        )}
      </div>

      {/* Course Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                📏 {distance}
              </span>
              {elevation && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  ⛰️ {elevation}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Course Highlights:</h4>
          <ul className="space-y-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-orange-500 mr-2">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CoursePage() {
  const [activeTab, setActiveTab] = useState<'swim' | 'bike' | 'run'>('swim');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/kilkee-coastline.jpg"
            alt="Hell of the West Course"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Hell of the West <span className="text-orange-400">Course</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the challenging course that has tested athletes for 40 years on Ireland&apos;s Wild Atlantic Way
          </p>
        </div>
      </section>

      {/* Course Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            {Object.entries(courseData).map(([key, course]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as 'swim' | 'bike' | 'run')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === key
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {course.title.split(' - ')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseMap {...courseData[activeTab]} />
        </div>
      </section>

      {/* Course Summary */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete Course Overview</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The full Hell of the West challenge combines all three disciplines into one epic day on the Wild Atlantic Way
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(courseData).map(([key, course], index) => (
              <div key={key} className="text-center">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <div className="space-y-1 mb-4">
                  <p className="text-orange-400 font-semibold">{course.distance}</p>
                  <p className="text-gray-400 text-sm">{course.elevation}</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/#register"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}