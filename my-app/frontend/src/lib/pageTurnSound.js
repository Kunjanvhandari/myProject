let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function createNoiseBuffer(ctx, duration, type) {
  const sampleRate = ctx.sampleRate;
  const bufferSize = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / sampleRate;
    const progress = t / duration;

    let envelope;
    switch (type) {
      case "rustle":
        envelope = Math.pow(Math.sin(Math.PI * progress), 0.6) * (1 - progress * 0.3);
        data[i] = envelope * (Math.random() * 2 - 1) * 0.4;
        break;
      case "whoosh":
        envelope = Math.pow(progress, 0.5) * Math.pow(1 - progress, 0.3) * 2.5;
        data[i] = envelope * (Math.random() * 2 - 1) * 0.15;
        break;
      case "thud":
        envelope = Math.exp(-progress * 30) * 0.8;
        data[i] = envelope * (Math.random() * 2 - 1) * 0.2 + envelope * 0.5 * Math.sin(t * 150);
        break;
      case "crisp":
        envelope = Math.pow(Math.sin(Math.PI * progress), 0.8) * (1 - progress * 0.5);
        data[i] = envelope * (Math.random() * 2 - 1) * 0.25;
        break;
      default:
        envelope = Math.sin(Math.PI * progress);
        data[i] = envelope * (Math.random() * 2 - 1) * 0.3;
    }
  }
  return buffer;
}

export function playPageTurnSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Layer 1: Low paper rustle (warm body sound)
    const rustleBuf = createNoiseBuffer(ctx, 0.18, "rustle");
    const rustle = ctx.createBufferSource();
    rustle.buffer = rustleBuf;
    const rustleFilter = ctx.createBiquadFilter();
    rustleFilter.type = "lowpass";
    rustleFilter.frequency.value = 1800;
    const rustleGain = ctx.createGain();
    rustleGain.gain.setValueAtTime(0.5, now);
    rustleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    rustle.connect(rustleFilter);
    rustleFilter.connect(rustleGain);
    rustleGain.connect(ctx.destination);
    rustle.start(now);
    rustle.stop(now + 0.18);

    // Layer 2: Crisp high-frequency paper crackle
    const crispBuf = createNoiseBuffer(ctx, 0.12, "crisp");
    const crisp = ctx.createBufferSource();
    crisp.buffer = crispBuf;
    const crispFilter = ctx.createBiquadFilter();
    crispFilter.type = "highpass";
    crispFilter.frequency.value = 3000;
    const crispGain = ctx.createGain();
    crispGain.gain.setValueAtTime(0.3, now + 0.02);
    crispGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    crisp.connect(crispFilter);
    crispFilter.connect(crispGain);
    crispGain.connect(ctx.destination);
    crisp.start(now + 0.02);
    crisp.stop(now + 0.14);

    // Layer 3: Air whoosh between pages
    const whooshBuf = createNoiseBuffer(ctx, 0.1, "whoosh");
    const whoosh = ctx.createBufferSource();
    whoosh.buffer = whooshBuf;
    const whooshFilter = ctx.createBiquadFilter();
    whooshFilter.type = "bandpass";
    whooshFilter.frequency.value = 1200;
    whooshFilter.Q.value = 0.5;
    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.2, now + 0.04);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    whoosh.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whoosh.start(now + 0.04);
    whoosh.stop(now + 0.14);

    // Layer 4: Thud when page settles
    const thudBuf = createNoiseBuffer(ctx, 0.08, "thud");
    const thud = ctx.createBufferSource();
    thud.buffer = thudBuf;
    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.5, now + 0.14);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now + 0.14);
    thud.stop(now + 0.22);

  } catch {
    // Audio not available
  }
}
