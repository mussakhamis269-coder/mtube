/**
 * Web Audio Engine for Mtube
 * Provides real synthesized melodic audio patterns for music & video audio previews
 * With real-time AnalyserNode for audio reactive visualizers!
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning: boolean = false;
  private timer: number | null = null;
  private step: number = 0;
  private currentGenre: string = 'bongo';
  private currentBpm: number = 104;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.gainNode.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  public playTrack(genre: string = 'bongo', bpm: number = 104) {
    this.initContext();
    this.currentGenre = genre;
    this.currentBpm = bpm;
    this.isRunning = true;
    this.step = 0;

    if (this.timer) {
      window.clearInterval(this.timer);
    }

    const intervalMs = (60 / this.currentBpm / 2) * 1000; // 8th notes
    this.timer = window.setInterval(() => {
      if (!this.isRunning || !this.ctx || !this.gainNode) return;
      this.tick();
      this.step = (this.step + 1) % 16;
    }, intervalMs);
  }

  private tick() {
    if (!this.ctx || !this.gainNode) return;
    const now = this.ctx.currentTime;

    // Musical Chords & Melodies
    // Scale frequencies (Pentatonic / Dorian)
    const bongoPitches = [220, 261.63, 293.66, 329.63, 392.0, 440]; // A minor / C major
    const amapianoLogBass = [55, 65.41, 73.42, 82.41, 98.0]; // Deep log-drum sub bass

    if (this.currentGenre === 'amapiano') {
      // Amapiano Log Drum on beats 0, 3, 6, 10, 12
      if ([0, 3, 6, 10, 12].includes(this.step)) {
        this.playLogDrum(amapianoLogBass[this.step % amapianoLogBass.length], now);
      }
      // Shaker on every 8th note
      this.playShaker(now, this.step % 2 === 0 ? 0.05 : 0.02);

      // Chords on step 0 and 8
      if (this.step === 0 || this.step === 8) {
        this.playChord([261.63, 329.63, 392.0, 493.88], now, 0.6); // Cmaj7
      }
    } else {
      // Bongo Flava & Afrobeats Groove
      // Kick on 0, 4, 8, 12
      if (this.step % 4 === 0) {
        this.playKick(now);
      }
      // Snare / Rimshot on 4, 12
      if (this.step === 4 || this.step === 12) {
        this.playSnare(now);
      }
      // Melodic plucks
      if ([0, 2, 5, 7, 10, 14].includes(this.step)) {
        const pitch = bongoPitches[(this.step * 2) % bongoPitches.length];
        this.playPluck(pitch, now);
      }
    }
  }

  private playKick(time: number) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    g.gain.setValueAtTime(0.7, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(g);
    g.connect(this.gainNode);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.gainNode) return;
    // Noise buffer for snap
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.4, time);
    g.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.gainNode);
    noise.start(time);
  }

  private playShaker(time: number, vol: number) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, time);

    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(g);
    g.connect(this.gainNode);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playPluck(freq: number, time: number) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    g.gain.setValueAtTime(0.25, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(g);
    g.connect(this.gainNode);
    osc.start(time);
    osc.stop(time + 0.25);
  }

  private playLogDrum(freq: number, time: number) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.08);

    g.gain.setValueAtTime(0.9, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(g);
    g.connect(this.gainNode);
    osc.start(time);
    osc.stop(time + 0.38);
  }

  private playChord(freqs: number[], time: number, duration: number) {
    if (!this.ctx || !this.gainNode) return;
    freqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      g.gain.setValueAtTime(0.12, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(g);
      g.connect(this.gainNode!);
      osc.start(time);
      osc.stop(time + duration);
    });
  }

  public pauseTrack() {
    this.isRunning = false;
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  public stopTrack() {
    this.pauseTrack();
    this.step = 0;
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const audioEngine = new AudioEngine();
