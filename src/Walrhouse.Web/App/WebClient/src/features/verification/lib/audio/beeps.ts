import { logger } from '@/lib/utils/logger';

export function ensureAudioContext(existing?: AudioContext | null): AudioContext | null {
  const win = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const AudioCtor = win.AudioContext ?? win.webkitAudioContext;
  if (!AudioCtor) {
    logger.error('No AudioContext available in this environment');
    return null;
  }
  try {
    return existing ?? new AudioCtor();
  } catch (err) {
    logger.error('Failed to create AudioContext', err);
    return null;
  }
}

export function playSharpTone(ctx: AudioContext, duration = 180, vol = 0.18) {
  try {
    const now = ctx.currentTime + 0.01;
    const toneDur = duration / 1000; // seconds
    const freq = 2200; // slightly sharper
    const attack = 0.002; // very quick attack
    const release = 0.08; // smoother release

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, now);

    // envelope: tiny attack, sustain, then smooth release using setTargetAtTime
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol, now + attack);
    g.gain.setTargetAtTime(0.0001, now + toneDur, 0.02);

    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + toneDur + release + 0.02);

    const finalStopMs = Math.round((now + toneDur + release + 0.05 - ctx.currentTime) * 1000);
    setTimeout(
      () => {
        try {
          o.disconnect();
        } catch (e) {
          logger.error('Error disconnecting oscillator', e);
        }
        try {
          g.disconnect();
        } catch (e) {
          logger.error('Error disconnecting gain', e);
        }
      },
      Math.max(finalStopMs, 250),
    );
  } catch (err) {
    logger.error('Audio playback error in playSharpTone()', err);
  }
}
