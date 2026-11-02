
import React from 'react';
import { THEMES } from '../constants';
import { Theme, FontOption } from '../types';

interface SettingsPanelProps {
  currentTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
  currentFont: FontOption;
  onFontSelect: (font: FontOption) => void;
  arabicFontSize: number;
  setArabicFontSize: (size: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  currentTheme,
  onThemeSelect,
  currentFont,
  onFontSelect,
  arabicFontSize,
  setArabicFontSize,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`${currentTheme.card} ${currentTheme.text} w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border ${currentTheme.border}`}>
        <div className={`p-4 border-b ${currentTheme.border} flex justify-between items-center`}>
          <h2 className="text-xl font-bold">Preferences</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Themes */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70">App Theme</h3>
            <div className="grid grid-cols-5 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onThemeSelect(t)}
                  className={`w-full aspect-square rounded-full border-2 transition-all transform hover:scale-110 ${t.bg} ${currentTheme.id === t.id ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-80'}`}
                  title={t.name}
                />
              ))}
            </div>
          </section>

          {/* Fonts */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70">Arabic Font</h3>
            <div className="space-y-2">
              {Object.values(FontOption).map((font) => (
                <button
                  key={font}
                  onClick={() => onFontSelect(font)}
                  className={`w-full p-3 rounded-lg text-left border transition-all ${currentFont === font ? `${currentTheme.border} bg-opacity-10 bg-indigo-500` : 'border-transparent hover:bg-opacity-5 hover:bg-gray-500'}`}
                  style={{ fontFamily: font }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                    <span className="text-xs opacity-60 font-sans">{font}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Font Size */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70">Arabic Size ({arabicFontSize}px)</h3>
            <input 
              type="range" 
              min="24" 
              max="64" 
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
