/**
 * Pure Web Audio API romantic music box synthesizer + HTML5 audio bridge.
 * Guarantees romantic background music plays reliably in browser without CORS or network dependency.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isSynthesizing = false;
  private timerId: number | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isMuted = false;
  private volume = 0.5;
  private onStateChange: ((isPlaying: boolean) => void) | null = null;

  // Romantic music box melody (frequencies in Hz)
  private melodyNotes = [
    // Canon / waltz in D-major / G-major romance:
    // Notes: [freq, duration in seconds, delayToNext in seconds]
    [523.25, 0.6, 0.45], // C5
    [659.25, 0.6, 0.45], // E5
    [783.99, 0.8, 0.65], // G5
    [659.25, 0.5, 0.45], // E5
    [880.00, 0.7, 0.55], // A5
    [783.99, 0.8, 0.65], // G5
    [659.25, 0.6, 0.5],  // E5
    [587.33, 0.8, 0.65], // D5
    
    [523.25, 0.6, 0.45], // C5
    [587.33, 0.5, 0.45], // D5
    [659.25, 0.7, 0.55], // E5
    [783.99, 0.6, 0.5],  // G5
    [698.46, 0.7, 0.6],  // F5
    [659.25, 0.6, 0.5],  // E5
    [587.33, 0.8, 0.7],  // D5
    [523.25, 1.2, 0.9],  // C5
    
    // Part 2: Sweet Arpeggio
    [440.00, 0.5, 0.4],  // A4
    [523.25, 0.5, 0.4],  // C5
    [659.25, 0.6, 0.5],  // E5
    [783.99, 0.8, 0.6],  // G5
    [1046.50, 1.1, 0.8], // C6
    [987.77, 0.7, 0.55], // B5
    [880.00, 0.8, 0.65], // A5
    [783.99, 1.2, 0.95], // G5
  ];

  private currentNoteIndex = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public registerStateChange(callback: (isPlaying: boolean) => void) {
    this.onStateChange = callback;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single bell / music box note with warm harmonics
  private playMusicBoxNote(freq: number, duration: number) {
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // Primary tone (triangle wave for chime sweetness)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      // Shimmer harmonic (pure sine octave higher, quiet)
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Envelope: fast attack, gentle chime decay
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.28 * this.volume, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.3);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.4);
      osc2.stop(now + duration + 0.4);
    } catch (e) {
      console.warn('Audio note play error:', e);
    }
  }

  private stepMelody = () => {
    if (!this.isSynthesizing) return;

    const note = this.melodyNotes[this.currentNoteIndex];
    if (note) {
      this.playMusicBoxNote(note[0], note[1]);
      const nextDelay = note[2] * 1000;
      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melodyNotes.length;
      this.timerId = window.setTimeout(this.stepMelody, nextDelay);
    }
  };

  public play(customUrl?: string) {
    this.initContext();

    if (customUrl && customUrl.trim() !== '') {
      this.stopSynth();
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.loop = true;
      }
      this.audioElement.src = customUrl;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      this.audioElement.play().catch(e => {
        console.warn('Custom audio playback failed, falling back to synth melody:', e);
        this.startSynth();
      });
      this.onStateChange?.(true);
      return;
    }

    // Default to synthesizer
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.startSynth();
  }

  private startSynth() {
    if (this.isSynthesizing) return;
    this.isSynthesizing = true;
    this.stepMelody();
    this.onStateChange?.(true);
  }

  private stopSynth() {
    this.isSynthesizing = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public pause() {
    this.stopSynth();
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.onStateChange?.(false);
  }

  public toggle(customUrl?: string): boolean {
    if (this.isPlaying()) {
      this.pause();
      return false;
    } else {
      this.play(customUrl);
      return true;
    }
  }

  public isPlaying(): boolean {
    if (this.audioElement && !this.audioElement.paused) {
      return true;
    }
    return this.isSynthesizing;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cute chime sound effect for clicks / unlock / coupons
  public playSparkleChime() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {
      // Audio effect non-fatal
    }
  }

  // Candle blow puff sound
  public playBlowSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.linearRampToValueAtTime(150, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {
      // Sound effect non-fatal
    }
  }
}

export const romanticAudio = new RomanticAudioEngine();
