
import React, { useRef, useState, useEffect } from 'react';
import { Theme } from '../types';

interface AudioPlayerProps {
  url: string;
  surahName: string;
  theme: Theme;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, surahName, theme }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [url]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl ${theme.card} ${theme.text} rounded-full shadow-2xl border ${theme.border} p-3 flex items-center gap-4 transition-all duration-500`}>
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <button 
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 ${theme.primary} text-white shadow-lg`}
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex-1 hidden sm:block">
        <div className="flex justify-between text-xs opacity-70 mb-1 px-1">
          <span>{surahName}</span>
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`${theme.primary} h-full transition-all duration-150`} 
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>
      </div>

      <div className="flex-1 sm:hidden">
        <span className="text-sm font-semibold truncate block">{surahName}</span>
      </div>

      <button onClick={() => { if(audioRef.current) audioRef.current.currentTime += 10; }} className="p-2 opacity-60 hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default AudioPlayer;
