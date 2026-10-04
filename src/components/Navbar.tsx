import React, { useState, useEffect } from 'react';
import { 
  Armchair, 
  PlusCircle, 
  LayoutDashboard, 
  Kanban, 
  FileText, 
  Download, 
  Wifi, 
  WifiOff, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'kanban' | 'orders';
  setCurrentTab: (tab: 'dashboard' | 'kanban' | 'orders') => void;
  onNewOrder: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onNewOrder,
  onOpenBackup
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      alert('لتثبيت التطبيق على الجوال أو المتصفح:\n- على أندرويد/كروم: اضغط على القائمة (⋮) ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".\n- على آيفون (Safari): اضغط على زر المشاركة ثم "إضافة إلى الصفحة الرئيسية".');
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40">
              <Armchair className="w-7 h-7 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                  بن أحمد للكنب
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> PWA متقدم
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">نظام إدارة ومتابعة طلبات التفصيل والتنجيد</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>لوحة التحكم</span>
            </button>

            <button
              onClick={() => setCurrentTab('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'kanban'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>مراحل الورشة والإنتاج</span>
            </button>

            <button
              onClick={() => setCurrentTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>سجل الطلبات</span>
            </button>
          </nav>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Online/Offline indicator */}
            <div 
              title={isOnline ? 'متصل بالإنترنت' : 'يعمل بدون إنترنت (تخزين محلي)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border ${
                isOnline 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50' 
                  : 'bg-rose-950/40 text-rose-400 border-rose-800/50 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{isOnline ? 'متصل' : 'أوفلاين'}</span>
            </div>

            {/* Install PWA Button */}
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all hover:scale-105 active:scale-95"
                title="تثبيت التطبيق على الشاشة الرئيسية للجوال أو الكمبيوتر"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تثبيت التطبيق</span>
              </button>
            )}

            {/* Backup & Export Button */}
            <button
              onClick={onOpenBackup}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title="نسخ احتياطي واستيراد البيانات"
            >
              <Download className="w-4 h-4 sm:ml-1 inline" />
              <span className="hidden sm:inline">النسخ الاحتياطي</span>
            </button>

            {/* Primary Action: New Order */}
            <button
              onClick={onNewOrder}
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.4]" />
              <span>طلب تفصيل جديد</span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
              currentTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>
          <button
            onClick={() => setCurrentTab('kanban')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
              currentTab === 'kanban' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>خط الإنتاج</span>
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
              currentTab === 'orders' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الطلبات</span>
          </button>
        </div>

      </div>
    </header>
  );
};
