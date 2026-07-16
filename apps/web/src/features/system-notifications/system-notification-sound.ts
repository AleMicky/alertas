let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }

  return audioContext;
}

/** Resume AudioContext after a user gesture (browser autoplay policy). */
export async function unlockSystemNotificationAudio() {
  const context = getAudioContext();

  if (!context || context.state !== 'suspended') {
    return;
  }

  try {
    await context.resume();
  } catch {
    // Ignore unlock failures; sound will simply be skipped.
  }
}

/** Soft two-tone chime for inbound system notifications. */
export async function playSystemNotificationSound() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  master.connect(context.destination);

  const playTone = (frequency: number, startOffset: number, duration: number) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + startOffset);

    gain.gain.setValueAtTime(0.0001, now + startOffset);
    gain.gain.exponentialRampToValueAtTime(0.9, now + startOffset + 0.02);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + startOffset + duration,
    );

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now + startOffset);
    oscillator.stop(now + startOffset + duration + 0.02);
  };

  playTone(880, 0, 0.18);
  playTone(1174.66, 0.14, 0.28);
}
