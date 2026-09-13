/**
 * Web Audio API synthesizer for Flash Flood Emergency Sirens and Distress Whistles.
 * Fully self-contained, no external audio assets required.
 */
class AudioAlertService {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenLfo: OscillatorNode | null = null;
  private isSirenPlaying = false;

  private whistleOsc: OscillatorNode | null = null;
  private whistleGain: GainNode | null = null;
  private isWhistlePlaying = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a 2-tone rising and falling civil defense flood siren
   */
  startSiren() {
    if (this.isSirenPlaying) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.3);

      // Low frequency oscillator to modulate pitch (wail)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.35, now); // cycle every ~2.8s

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(280, now); // pitch sweep range +/- 280 Hz

      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(680, now); // base frequency 680 Hz

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(684, now); // slight detune for piercing resonance

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc1.start();
      osc2.start();

      this.sirenLfo = lfo;
      this.sirenOsc1 = osc1;
      this.sirenOsc2 = osc2;
      this.sirenGain = gain;
      this.isSirenPlaying = true;
    } catch (err) {
      console.warn('AudioContext failed:', err);
    }
  }

  stopSiren() {
    if (!this.isSirenPlaying || !this.sirenGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      setTimeout(() => {
        try {
          this.sirenOsc1?.stop();
          this.sirenOsc2?.stop();
          this.sirenLfo?.stop();
          this.sirenOsc1?.disconnect();
          this.sirenOsc2?.disconnect();
          this.sirenLfo?.disconnect();
          this.sirenGain?.disconnect();
        } catch (_) {}
        this.isSirenPlaying = false;
        this.sirenOsc1 = null;
        this.sirenOsc2 = null;
        this.sirenLfo = null;
        this.sirenGain = null;
      }, 550);
    } catch (err) {
      this.isSirenPlaying = false;
    }
  }

  toggleSiren(): boolean {
    if (this.isSirenPlaying) {
      this.stopSiren();
      return false;
    } else {
      this.startSiren();
      return true;
    }
  }

  /**
   * High-pitch acoustic rescue whistle for SOS location signaling
   */
  startWhistle() {
    if (this.isWhistlePlaying) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2800, now); // 2.8 kHz piercing emergency whistle

      // Modulate with bursts: whistle pulses 3 times (SOS-like)
      const burstLfo = ctx.createOscillator();
      burstLfo.frequency.setValueAtTime(2.5, now);
      const burstGain = ctx.createGain();
      burstGain.gain.setValueAtTime(0.2, now);

      burstLfo.connect(burstGain.gain);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      burstLfo.start();

      this.whistleOsc = osc;
      this.whistleGain = gain;
      this.isWhistlePlaying = true;
    } catch (err) {
      console.warn('AudioContext failed:', err);
    }
  }

  stopWhistle() {
    if (!this.isWhistlePlaying || !this.whistleGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      setTimeout(() => {
        try {
          this.whistleOsc?.stop();
          this.whistleOsc?.disconnect();
          this.whistleGain?.disconnect();
        } catch (_) {}
        this.isWhistlePlaying = false;
        this.whistleOsc = null;
        this.whistleGain = null;
      }, 250);
    } catch (err) {
      this.isWhistlePlaying = false;
    }
  }

  toggleWhistle(): boolean {
    if (this.isWhistlePlaying) {
      this.stopWhistle();
      return false;
    } else {
      this.startWhistle();
      return true;
    }
  }

  playShortBeep(freq = 880, duration = 0.15) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + duration);
    } catch (_) {}
  }
}

export const audioAlert = new AudioAlertService();
