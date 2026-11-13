// Web Audio API High-Fidelity Mechanical Keyboard & Custom Media Engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.noiseBuffer = null;
    // Default to unmuted so user hears typing sound immediately
    const savedMute = localStorage.getItem("rails_muted");
    this.muted = savedMute === "true"; // false by default if null
    this.listeners = new Set();

    // Preloaded AudioBuffers for 0ms ultra-crisp mechanical clicks
    this.clickBuffers = [];
    this.spaceBuffer = null;
    this.samplesLoaded = false;

    // Custom media elements
    this.successAudio = null;
    this.wrongAudio = null;
    this.isMusicPlaying = false;

    if (typeof window !== "undefined") {
      this.initMedia();
      // Pre-fetch samples as soon as possible
      this.preloadSamples();
    }
  }

  initMedia() {
    try {
      this.successAudio = new Audio("/audio/success.mp3");
      this.wrongAudio = new Audio("/audio/wrong.mp3");

      this.successAudio.addEventListener("play", () => {
        this.isMusicPlaying = true;
        this.notifyListeners();
      });

      this.successAudio.addEventListener("pause", () => {
        this.isMusicPlaying = false;
        this.notifyListeners();
      });

      this.successAudio.addEventListener("ended", () => {
        this.isMusicPlaying = false;
        this.notifyListeners();
      });
    } catch (e) {
      console.warn("Media init warning:", e);
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (!this.samplesLoaded && this.ctx) {
      this.preloadSamples();
    }
  }

  async preloadSamples() {
    if (typeof window === "undefined" || this.samplesLoaded) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx && AudioContext) {
        this.ctx = new AudioContext();
      }
      if (!this.ctx) return;

      const clickFiles = [
        "/audio/mech_click1.mp3",
        "/audio/mech_click2.mp3",
        "/audio/mech_click3.mp3",
        "/audio/mech_click4.mp3"
      ];

      const decodedClicks = await Promise.all(
        clickFiles.map(async (url) => {
          try {
            const res = await fetch(url);
            const arrayBuffer = await res.arrayBuffer();
            return await this.ctx.decodeAudioData(arrayBuffer);
          } catch (e) {
            return null;
          }
        })
      );

      this.clickBuffers = decodedClicks.filter(Boolean);

      try {
        const spaceRes = await fetch("/audio/mech_space.mp3");
        const spaceArray = await spaceRes.arrayBuffer();
        this.spaceBuffer = await this.ctx.decodeAudioData(spaceArray);
      } catch (e) {
        // Fallback to synth space
      }

      this.samplesLoaded = this.clickBuffers.length > 0;
    } catch (err) {
      console.warn("Could not load mechanical samples, using synth fallback:", err);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.isMusicPlaying));
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("rails_muted", this.muted ? "true" : "false");
    if (this.muted) {
      this.stopSuccessMusic();
      if (this.wrongAudio) {
        this.wrongAudio.pause();
        this.wrongAudio.currentTime = 0;
      }
    } else {
      // Play a quick test click to confirm sound is on
      this.playKeyClick(false);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  unmute() {
    this.muted = false;
    localStorage.setItem("rails_muted", "false");
  }

  // Play crisp, clicky mechanical switch sound on key press
  playKeyClick(isWordEnd = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // 1. If real mechanical audio buffers are decoded, use zero-latency buffer source
    if (isWordEnd && this.spaceBuffer) {
      this.playBuffer(this.spaceBuffer, 0.95 + Math.random() * 0.1, 0.95);
      return;
    }

    if (!isWordEnd && this.clickBuffers.length > 0) {
      const idx = Math.floor(Math.random() * this.clickBuffers.length);
      const buf = this.clickBuffers[idx];
      // Randomize pitch slightly (0.92 to 1.08) for natural variation across keys
      const pitch = 0.94 + Math.random() * 0.12;
      this.playBuffer(buf, pitch, 0.88);
      return;
    }

    // 2. High-impact synthesized mechanical switch fallback (Cherry MX Blue style)
    this.playSynthClick(isWordEnd);
  }

  playBuffer(buffer, pitch = 1.0, volume = 0.85) {
    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = pitch;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);

      source.connect(gain);
      gain.connect(this.ctx.destination);
      source.start(0);
    } catch (e) {
      // Fallback
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  // Crisp clicky mechanical switch synthesis (Plastic stem click + metallic click leaf snap + bottom-out)
  playSynthClick(isWordEnd = false) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    try {
      // Metallic Click Leaf Snap (High Q bandpass at 3400Hz)
      const noise = this.ctx.createBufferSource();
      const nBuf = this.createNoiseBuffer();
      if (nBuf) {
        noise.buffer = nBuf;

        const filter = this.ctx.createBiquadFilter();
        filter.type = isWordEnd ? "bandpass" : "highpass";
        filter.frequency.setValueAtTime(isWordEnd ? 1400 : 3200 + Math.random() * 800, t);
        filter.Q.value = isWordEnd ? 1.5 : 3.0;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(isWordEnd ? 0.35 : 0.45, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + (isWordEnd ? 0.03 : 0.018));

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(t);
        noise.stop(t + 0.035);
      }

      // Stem bottom-out clack
      const clack = this.ctx.createOscillator();
      const clackGain = this.ctx.createGain();
      clack.type = "triangle";
      clack.frequency.setValueAtTime(isWordEnd ? 240 : 540 + Math.random() * 80, t);
      clack.frequency.exponentialRampToValueAtTime(80, t + 0.025);

      clackGain.gain.setValueAtTime(0.3, t);
      clackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      clack.connect(clackGain);
      clackGain.connect(this.ctx.destination);
      clack.start(t);
      clack.stop(t + 0.035);

      // Low housing resonance (Thock)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = isWordEnd ? 130 + Math.random() * 25 : 220 + Math.random() * 50;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + (isWordEnd ? 0.06 : 0.04));

      gain.gain.setValueAtTime(isWordEnd ? 0.4 : 0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (isWordEnd ? 0.07 : 0.05));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + (isWordEnd ? 0.08 : 0.06));
    } catch (err) {
      // AudioContext fallback
    }
  }

  // Play "Aero Chord - Shooting Star [oh baby a triple drop]" on solving question correctly
  playSuccessMusic() {
    if (this.muted) return;
    this.stopWrongSound();

    if (!this.successAudio) {
      this.initMedia();
    }

    if (this.successAudio) {
      this.successAudio.currentTime = 0;
      this.successAudio.volume = 0.85;
      const playPromise = this.successAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Could not play victory track:", err);
        });
      }
    }

    this.playSuccessChime();
  }

  stopSuccessMusic() {
    if (this.successAudio) {
      this.successAudio.pause();
      this.successAudio.currentTime = 0;
      this.isMusicPlaying = false;
      this.notifyListeners();
    }
  }

  toggleMusicPlayback() {
    if (!this.successAudio) return;
    if (this.successAudio.paused) {
      this.successAudio.play().catch(() => {});
    } else {
      this.successAudio.pause();
    }
  }

  // Play "Fahhh - Sound Effect for Meme Edits" on getting an answer wrong
  playWrongSound() {
    if (this.muted) return;
    this.stopSuccessMusic();

    if (!this.wrongAudio) {
      this.initMedia();
    }

    if (this.wrongAudio) {
      this.wrongAudio.currentTime = 0;
      this.wrongAudio.volume = 0.95;
      const playPromise = this.wrongAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Could not play wrong sound effect:", err);
        });
      }
    }

    this.playError();
  }

  stopWrongSound() {
    if (this.wrongAudio) {
      this.wrongAudio.pause();
      this.wrongAudio.currentTime = 0;
    }
  }

  // Soft ceramic bell / chime
  playSuccessChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 warm major triad
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + idx * 0.06);

      gain.gain.setValueAtTime(0.08, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.06 + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.6);
    });
  }

  // Subtle paper slide on drawer open
  playDrawer() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Gentle low thud on syntax mismatch
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Soft affectionate purr / chirp when petting the capybara
  playPetPurr() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const tones = [
      { f0: 380, f1: 520, d: 0.14, g: 0.05 },
      { f0: 570, f1: 780, d: 0.16, g: 0.035 }
    ];

    tones.forEach((tone) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.f0, t);
      osc.frequency.exponentialRampToValueAtTime(tone.f1, t + tone.d);

      gain.gain.setValueAtTime(tone.g, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + tone.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + tone.d + 0.02);
    });
  }
}

export const soundEngine = new SoundEngine();

// Auto-unlock AudioContext on first user interaction
if (typeof window !== "undefined") {
  const unlock = () => {
    soundEngine.init();
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("click", unlock);
  };
  window.addEventListener("keydown", unlock);
  window.addEventListener("click", unlock);
}
