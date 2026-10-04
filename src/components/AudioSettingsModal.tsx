import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bell, 
  Mic, 
  Check, 
  Play, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  AudioSettings, 
  AudioMode, 
  getAudioSettings, 
  saveAudioSettings, 
  playCashChime, 
  playSuccessChime, 
  playStepChime, 
  playCelebrationChime, 
  playWarningChime, 
  speakArabic 
} from '../services/soundService';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [settings, setSettings] = useState<AudioSettings>(getAudioSettings());
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    setSettings(getAudioSettings());
  }, [isOpen]);

  const updateSetting = <K extends keyof AudioSettings>(key: K, val: AudioSettings[K]) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    saveAudioSettings(updated);
  };

  const runTest = (name: string, fn: () => void) => {
    setTestStatus(name);
    fn();
    setTimeout(() => {
      setTestStatus(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">تخصيص الإشعارات الصوتية</h3>
              <p className="text-xs text-slate-400">تفعيل الرنات والنطق الصوتي لورشة الكنب</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          
          {/* Main Sound Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-3">
              {settings.enabled ? (
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Volume2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-slate-800 text-slate-500">
                  <VolumeX className="w-5 h-5" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-200">الصوتيات والتنبيهات</h4>
                <p className="text-xs text-slate-400">
                  {settings.enabled ? 'الصوت مفعل حالياً' : 'التطبيق في وضع الصامت'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateSetting('enabled', !settings.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                  settings.enabled ? '-translate-x-6' : '-translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.enabled && (
            <>
              {/* Notification Style / Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">نمط التنبيه الصوتي:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { mode: 'both', label: 'دمج الاثنين 🌟', desc: 'رنة ثم نطق' },
                    { mode: 'voice', label: 'نطق صوتي 🗣️', desc: 'كلمات عربية' },
                    { mode: 'chime', label: 'رنات فقط 🔔', desc: 'نغمات ترددية' }
                  ].map((m) => (
                    <button
                      key={m.mode}
                      type="button"
                      onClick={() => updateSetting('mode', m.mode as AudioMode)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        settings.mode === m.mode
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-bold block">{m.label}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">مستوى الصوت:</span>
                  <span className="text-amber-400 font-bold">{Math.round(settings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.volume}
                  onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Test Audio Controls */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-300 block flex items-center justify-between">
                  <span>تجربة الصوتيات والنغمات مباشرة:</span>
                  {testStatus && <span className="text-amber-400 font-normal animate-pulse text-[11px]">{testStatus}</span>}
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  
                  {/* Test 1: Cash Chime */}
                  <button
                    type="button"
                    onClick={() => runTest('💰 جاري تشغيل صوت العربون...', () => {
                      playCashChime();
                      if (settings.mode !== 'chime') {
                        setTimeout(() => speakArabic('تم استلام عربون ألفين ريال'), 350);
                      }
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center gap-2 transition-all hover:border-amber-500/50"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>رنة العربون والكاشير</span>
                  </button>

                  {/* Test 2: Order Created */}
                  <button
                    type="button"
                    onClick={() => runTest('🔔 جاري تشغيل نغمة الطلب...', () => {
                      playSuccessChime();
                      if (settings.mode !== 'chime') {
                        setTimeout(() => speakArabic('تم تسجيل طلب تفصيل كنب جديد للعميل عبد الرحمن'), 400);
                      }
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center gap-2 transition-all hover:border-amber-500/50"
                  >
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>نغمة إنشاء الطلب</span>
                  </button>

                  {/* Test 3: Kanban Stage */}
                  <button
                    type="button"
                    onClick={() => runTest('🚚 جاري تشغيل نغمة المرحلة...', () => {
                      playStepChime();
                      if (settings.mode !== 'chime') {
                        setTimeout(() => speakArabic('تم تحويل الطلب إلى قسم التنجيد والقص'), 350);
                      }
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center gap-2 transition-all hover:border-amber-500/50"
                  >
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>نغمة نقل المراحل</span>
                  </button>

                  {/* Test 4: Celebration */}
                  <button
                    type="button"
                    onClick={() => runTest('✨ جاري تشغيل نغمة التسليم...', () => {
                      playCelebrationChime();
                      if (settings.mode !== 'chime') {
                        setTimeout(() => speakArabic('مبروك، تم تسليم الطلب بنجاح'), 500);
                      }
                    })}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center gap-2 transition-all hover:border-amber-500/50"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>نغمة اكتمال التسليم</span>
                  </button>

                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md"
          >
            تم والحفظ
          </button>
        </div>

      </div>
    </div>
  );
};
