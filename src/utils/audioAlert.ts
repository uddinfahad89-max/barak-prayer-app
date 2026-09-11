/**
 * Plays a gentle, peaceful prayer chime or authentic Adhan audio.
 */
let audioCtx: AudioContext | null = null;
let activeAzanAudio: HTMLAudioElement | null = null;
let onAzanEndCallback: (() => void) | null = null;

export function setAzanEndCallback(cb: (() => void) | null) {
  onAzanEndCallback = cb;
}

export function playPrayerChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Harmonic frequencies for a serene brass bowl chime
    const fundamental = 392.0; // G4
    const harmonics = [fundamental, fundamental * 1.5, fundamental * 2, fundamental * 2.75];

    harmonics.forEach((freq, idx) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.2 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx!.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  } catch (err) {
    console.warn('Audio chime unavailable', err);
  }
}

/**
 * Plays the authentic Adhan audio.
 * Returns a promise resolving to true if played successfully, or false if blocked by browser policy.
 */
export async function playAzan(volume = 1.0): Promise<boolean> {
  try {
    stopAzan();

    const audio = new Audio('/assets/adhan.mp3');
    audio.volume = Math.max(0, Math.min(1, volume));
    activeAzanAudio = audio;

    audio.onended = () => {
      activeAzanAudio = null;
      if (onAzanEndCallback) onAzanEndCallback();
    };

    audio.onerror = (e) => {
      console.warn('Adhan playback error, falling back to chime', e);
      activeAzanAudio = null;
      playPrayerChime();
      if (onAzanEndCallback) onAzanEndCallback();
    };

    await audio.play();
    return true;
  } catch (err) {
    console.warn('Adhan autoplay blocked or failed, falling back to chime', err);
    activeAzanAudio = null;
    playPrayerChime();
    return false;
  }
}

/**
 * Stops any playing Adhan audio.
 */
export function stopAzan() {
  if (activeAzanAudio) {
    try {
      activeAzanAudio.pause();
      activeAzanAudio.currentTime = 0;
    } catch {
      // Ignore
    }
    activeAzanAudio = null;
    if (onAzanEndCallback) onAzanEndCallback();
  }
}

/**
 * Checks if Adhan is currently playing.
 */
export function isAzanPlaying(): boolean {
  return Boolean(activeAzanAudio && !activeAzanAudio.paused);
}

