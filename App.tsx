
import React, { useState, useEffect, useMemo } from 'react';
import { fetchSurahList, fetchSurahDetail, getAudioUrl } from './services/quranApi';
import { SurahListItem, SurahDetail, Theme, FontOption } from './types';
import { THEMES } from './constants';
import SettingsPanel from './components/SettingsPanel';
import AyahCard from './components/AyahCard';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahListItem[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahListItem | null>(null);
  const [surahDetail, setSurahDetail] = useState<{ arabic: SurahDetail, english: SurahDetail } | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization State
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [currentFont, setCurrentFont] = useState<FontOption>(FontOption.Amiri);
  const [arabicFontSize, setArabicFontSize] = useState(36);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const list = await fetchSurahList();
        setSurahs(list);
      } catch (error) {
        console.error("Failed to fetch surah list", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSurahClick = async (surah: SurahListItem) => {
    setSelectedSurah(surah);
    setDetailLoading(true);
    setSurahDetail(null);
    try {
      const detail = await fetchSurahDetail(surah.number);
      setSurahDetail(detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to fetch surah detail", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredSurahs = useMemo(() => {
    return surahs.filter(s => 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.number.toString().includes(searchQuery)
    );
  }, [surahs, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-100 font-medium tracking-widest uppercase">Opening the Radiant Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-all duration-300 font-sans pb-32`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 ${currentTheme.card} backdrop-blur-md bg-opacity-80 border-b ${currentTheme.border} p-4 sm:p-6 shadow-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedSurah(null)}
              className="md:hidden p-2 hover:bg-black hover:bg-opacity-5 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${currentTheme.accent} cursor-pointer`} onClick={() => setSelectedSurah(null)}>
                Al-Muneer
              </h1>
              <p className="text-xs opacity-60 font-medium">Radiant Guidance for the Soul</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Search Surah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 pl-10 pr-4 rounded-full bg-black bg-opacity-5 border ${currentTheme.border} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors border ${currentTheme.border}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block lg:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => handleSurahClick(surah)}
              className={`w-full text-left p-4 rounded-2xl border transition-all hover:translate-x-1 ${selectedSurah?.number === surah.number ? `${currentTheme.primary} text-white shadow-lg` : `${currentTheme.card} ${currentTheme.border} hover:shadow-md`}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold opacity-70">#{surah.number}</span>
                <span className="arabic-text text-xl" style={{ fontFamily: FontOption.Amiri }}>{surah.name}</span>
              </div>
              <p className="font-semibold">{surah.englishName}</p>
              <p className="text-xs opacity-70">{surah.numberOfAyahs} Ayahs • {surah.revelationType}</p>
            </button>
          ))}
        </aside>

        {/* Reader Area */}
        <section className="col-span-1 lg:col-span-3">
          {!selectedSurah ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => handleSurahClick(surah)}
                  className={`text-left p-5 rounded-3xl border ${currentTheme.card} ${currentTheme.border} transition-all hover:shadow-lg`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold opacity-60">SURAH {surah.number}</span>
                    <span className="arabic-text text-2xl" style={{ fontFamily: FontOption.Amiri }}>{surah.name}</span>
                  </div>
                  <h3 className="text-lg font-bold">{surah.englishName}</h3>
                  <p className="text-sm opacity-60">{surah.englishNameTranslation}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Surah Header */}
              <div className={`p-8 rounded-[2rem] text-center space-y-4 border ${currentTheme.border} ${currentTheme.card} relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${currentTheme.primary}`}></div>
                <h2 className="text-4xl sm:text-6xl arabic-text" style={{ fontFamily: FontOption.Amiri }}>{selectedSurah.name}</h2>
                <h3 className="text-2xl font-bold">{selectedSurah.englishName}</h3>
                <p className={`text-lg italic opacity-80 ${currentTheme.accent}`}>{selectedSurah.englishNameTranslation}</p>
                <div className="flex justify-center gap-6 text-sm font-semibold opacity-60">
                  <span>{selectedSurah.revelationType}</span>
                  <span>•</span>
                  <span>{selectedSurah.numberOfAyahs} Ayahs</span>
                </div>

                {/* Bismillah */}
                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                   <div className="pt-6 border-t mt-6" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
                      <p className="text-3xl sm:text-4xl arabic-text" style={{ fontFamily: currentFont }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                      <p className="text-sm opacity-60 mt-2">In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
                   </div>
                )}
              </div>

              {/* Ayahs List */}
              {detailLoading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="opacity-60 animate-pulse">Illuminating the verses...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {surahDetail?.arabic.ayahs.map((ayah, idx) => (
                    <AyahCard 
                      key={ayah.number}
                      ayah={ayah}
                      englishAyah={surahDetail.english.ayahs[idx]}
                      theme={currentTheme}
                      font={currentFont}
                      fontSize={arabicFontSize}
                      surahName={selectedSurah.englishName}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {!selectedSurah && (
            <div className="hidden lg:flex items-center justify-center min-h-[60vh] text-center opacity-40">
              <div>
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-2xl font-light">Select a Surah to begin your journey</h2>
                <p>Reading, hearing, and reflecting on the Quran is light for the heart.</p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Audio Player */}
      {selectedSurah && (
        <AudioPlayer 
          url={getAudioUrl(selectedSurah.number)} 
          surahName={selectedSurah.englishName}
          theme={currentTheme}
        />
      )}

      {/* Settings Modal */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onThemeSelect={setCurrentTheme}
        currentFont={currentFont}
        onFontSelect={setCurrentFont}
        arabicFontSize={arabicFontSize}
        setArabicFontSize={setArabicFontSize}
      />
      
      {/* Mobile Back Button */}
      {selectedSurah && (
        <button 
          onClick={() => setSelectedSurah(null)}
          className={`fixed bottom-28 right-6 z-40 p-4 rounded-full shadow-xl lg:hidden ${currentTheme.card} ${currentTheme.border} border-2`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
