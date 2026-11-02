
import React, { useState } from 'react';
import { Ayah, Theme, FontOption, TafseerResponse } from '../types';
import { getTafseer } from '../services/geminiTafseer';

interface AyahCardProps {
  ayah: Ayah;
  englishAyah: Ayah;
  theme: Theme;
  font: FontOption;
  fontSize: number;
  surahName: string;
}

const AyahCard: React.FC<AyahCardProps> = ({ ayah, englishAyah, theme, font, fontSize, surahName }) => {
  const [tafseer, setTafseer] = useState<TafseerResponse | null>(null);
  const [loadingTafseer, setLoadingTafseer] = useState(false);
  const [showTafseer, setShowTafseer] = useState(false);

  const handleTafseerRequest = async () => {
    if (tafseer) {
      setShowTafseer(!showTafseer);
      return;
    }

    setLoadingTafseer(true);
    const result = await getTafseer(ayah.text, englishAyah.text, surahName, ayah.numberInSurah);
    setTafseer(result);
    setLoadingTafseer(false);
    setShowTafseer(true);
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border ${theme.border} ${theme.card} transition-all hover:shadow-xl`}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start gap-4">
          <span className={`w-10 h-10 flex items-center justify-center rounded-full border ${theme.border} text-sm font-bold opacity-60`}>
            {ayah.numberInSurah}
          </span>
          <button 
            onClick={handleTafseerRequest}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${theme.border} hover:opacity-80 transition-opacity flex items-center gap-2`}
          >
            {loadingTafseer ? 'Reflecting...' : (showTafseer ? 'Hide Tafseer' : 'View Tafseer')}
            {!loadingTafseer && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>

        <p 
          className="arabic-text text-right leading-[1.8] select-all" 
          style={{ fontFamily: font, fontSize: `${fontSize}px` }}
        >
          {ayah.text}
        </p>

        <p className="text-lg leading-relaxed font-light italic opacity-90 border-t pt-6" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
          {englishAyah.text}
        </p>

        {showTafseer && tafseer && (
          <div className={`mt-4 p-5 rounded-2xl bg-black bg-opacity-5 border-l-4 border-indigo-500 animate-in fade-in slide-in-from-top-2 duration-300`}>
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V5h2v5z" />
              </svg>
              AI Tafseer
            </h4>
            <p className="text-sm opacity-80 mb-4 leading-relaxed">{tafseer.tafseer}</p>
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Spiritual Reflection
            </h4>
            <p className="text-sm opacity-80 italic leading-relaxed">{tafseer.reflection}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AyahCard;
