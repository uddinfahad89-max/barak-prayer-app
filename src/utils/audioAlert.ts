/**
 * Plays a gentle, peaceful prayer chime or azan tone cue using Web Audio API.
 */
let audioCtx: AudioContext | null = null;

export function playPrayerChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Harmonic frequencies for a serene Tibetan/Islamic brass bowl chime
    const fundamental = 392.0; // G4
    const harmonics = [fundamental, fundamental * 1.5, fundamental * 2, fundamental * 2.75];

    harmonics.forEach((freq, idx) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = (0.2 / (idx + 1));
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
