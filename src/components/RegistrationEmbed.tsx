'use client';

import { useEffect, useRef, useState } from 'react';

interface RegistrationEmbedProps {
  title?: string;
  srcUrl?: string;
  className?: string;
  heightPx?: number;
}

export default function RegistrationEmbed({
  title = 'Register for Hell of the West',
  srcUrl = 'https://in.register-sportstiming.ie/kilkee-hell-of-the-west-2026?currentPage=select-competition',
  className = '',
  heightPx = 1200
}: RegistrationEmbedProps) {
  const [embedState, setEmbedState] = useState<'loading' | 'loaded' | 'failed'>('loading');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setEmbedState('loading');
    const timeoutId = setTimeout(() => {
      if (embedState !== 'loaded') {
        setEmbedState('failed');
      }
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [srcUrl]);

  return (
    <div className={`bg-gray-900 border border-gray-700 p-6 sm:p-8 rounded-lg ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">Secure your place via our ticketing partner</p>
      </div>

      <div className="rounded-lg overflow-hidden bg-black/20">
        {embedState === 'failed' && (
          <div className="p-6 text-center">
            <p className="text-gray-300 mb-4">
              We couldn't display the registration form here. Some sites block embedding in other pages.
            </p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={srcUrl}
          width="100%"
          height={heightPx}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setEmbedState('loaded')}
          onError={() => setEmbedState('failed')}
        />
      </div>

      <div className="text-center mt-4">
        <a
          href={srcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:text-orange-300 underline"
        >
          Open registration in a new tab
        </a>
      </div>
    </div>
  );
}


