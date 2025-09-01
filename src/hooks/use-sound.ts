
'use client';

import { useState, useCallback } from 'react';

const useSound = (soundPath: string, volume = 0.5) => {
  const [audio] = useState(() => {
    // Check if window is defined (runs only in browser)
    if (typeof window !== 'undefined') {
      const audioInstance = new Audio(soundPath);
      audioInstance.volume = volume;
      return audioInstance;
    }
    return null;
  });

  const play = useCallback(() => {
    if (audio) {
      // Rewind to the start and play
      audio.currentTime = 0;
      audio.play().catch(error => {
        // Autoplay was prevented.
        console.warn('Sound play prevented by browser:', error);
      });
    }
  }, [audio]);

  return play;
};

export default useSound;
