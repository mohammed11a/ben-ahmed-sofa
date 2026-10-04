import { SofaOrder, OrderStatus } from '../types';

export type AudioMode = 'both' | 'chime' | 'voice';

export interface AudioSettings {
  enabled: boolean;
  mode: AudioMode;
  volume: number; // 0.0 to 1.0
  voiceRate: number; // 0.8 to 1.2
}

const SETTINGS_KEY = 'ben_ahmed_audio_settings_v1';

const DEFAULT_SETTINGS: AudioSettings = {
  enabled: true,
  mode: 'both',
  volume: 0.8,
  voiceRate: 1.0
};

export const getAudioSettings = (): AudioSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveAudioSettings = (settings: AudioSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save audio settings', err);
  }
};

// Web Audio API Context (Lazily created on user interaction)
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Synthesize pleasant tones using pure Web Audio API oscillators (0 KB footprint)
const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0, gainLevel: number = 0.3) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const settings = getAudioSettings();
  if (!settings.enabled || settings.mode === 'voice') return;

  const actualGain = gainLevel * settings.volume;

  setTimeout(() => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(actualGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone play error', e);
    }
  }, delay);
};

// Distinct Chimes for Sofa Shop Events
export const playCashChime = () => {
  // Cash Register / Coin bell sound: high crisp dual frequencies
  playTone(987.77, 'sine', 0.18, 0, 0.4);      // B5
  playTone(1318.51, 'triangle', 0.35, 120, 0.45); // E6
};

export const playSuccessChime = () => {
  // Harmonic major chord for successful order creation
  playTone(523.25, 'triangle', 0.2, 0, 0.3);   // C5
  playTone(659.25, 'triangle', 0.25, 80, 0.3);  // E5
  playTone(783.99, 'triangle', 0.35, 160, 0.35); // G5
  playTone(1046.50, 'sine', 0.5, 240, 0.4);   // C6
};

export const playStepChime = () => {
  // Forward progression tone for moving Kanban stages
  playTone(440.00, 'sine', 0.15, 0, 0.25);   // A4
  playTone(554.37, 'sine', 0.2, 70, 0.3);    // C#5
  playTone(659.25, 'triangle', 0.3, 140, 0.35); // E5
};

export const playWarningChime = () => {
  // Double alert beep for urgent / delayed orders
  playTone(740, 'sawtooth', 0.15, 0, 0.25);
  playTone(740, 'sawtooth', 0.2, 180, 0.25);
};

export const playCelebrationChime = () => {
  // Grand fanfare for order completed & delivered
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  notes.forEach((freq, idx) => {
    playTone(freq, 'triangle', 0.4, idx * 90, 0.35);
  });
};

// Web Speech API Arabic Text-to-Speech
export const speakArabic = (text: string, onEnd?: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const settings = getAudioSettings();
  if (!settings.enabled || settings.mode === 'chime') return;

  try {
    // Cancel any pending speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = settings.voiceRate || 1.0;
    utterance.volume = settings.volume || 0.8;
    utterance.pitch = 1.0;

    // Pick an Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('Maged') || v.name.includes('Laila') || v.name.includes('Tarik'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error', err);
  }
};

// High-Level Notification Triggers
export const notifyOrderCreated = (order: SofaOrder) => {
  playSuccessChime();
  setTimeout(() => {
    speakArabic(`تم تسجيل طلب تفصيل جديد للعميل ${order.customer.name}`);
  }, 400);
};

export const notifyStatusAdvanced = (order: SofaOrder, newStatus: OrderStatus) => {
  const statusSpoken: Record<OrderStatus, { text: string; chime: () => void }> = {
    new: {
      text: `تم إعادة الطلب ${order.orderNumber} كطلب جديد`,
      chime: playStepChime
    },
    materials: {
      text: `الطلب ${order.orderNumber} قيد توريد القماش والمواد`,
      chime: playStepChime
    },
    carpentry: {
      text: `تم تحويل طلب ${order.customer.name} إلى معمل النجارة والهيكل`,
      chime: playStepChime
    },
    upholstery: {
      text: `تم تحويل طلب ${order.customer.name} إلى قسم القص والتنجيد`,
      chime: playStepChime
    },
    quality: {
      text: `الطلب ${order.orderNumber} في مرحلة فحص الجودة والتشطيب`,
      chime: playStepChime
    },
    ready: {
      text: `الطلب ${order.orderNumber} جاهز للتسليم والتركيب`,
      chime: playStepChime
    },
    completed: {
      text: `مبروك، تم تسليم طلب العميل ${order.customer.name} وإغلاق الحساب بنجاح`,
      chime: playCelebrationChime
    }
  };

  const action = statusSpoken[newStatus] || { text: `تم تحديث حالة الطلب`, chime: playStepChime };
  action.chime();
  setTimeout(() => {
    speakArabic(action.text);
  }, 400);
};

export const notifyDepositReceived = (amount: number, customerName: string) => {
  playCashChime();
  setTimeout(() => {
    speakArabic(`تم تسجيل استلام عربون بقيمة ${amount} ريال من العميل ${customerName}`);
  }, 350);
};

export const notifyUrgentWarning = (urgentCount: number) => {
  playWarningChime();
  setTimeout(() => {
    speakArabic(`تنبيه: يوجد ${urgentCount} طلبات مستعجلة في الورشة`);
  }, 400);
};
