import React, { useState } from 'react';
import { X, Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { exportOrdersAsJSON, importOrdersFromJSON } from '../services/storageService';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReload: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onReload
}) => {
  if (!isOpen) return null;

  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportOrdersAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ben_ahmed_sofa_orders_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('تم تصدير نسخة احتياطية من قاعدة البيانات بنجاح!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importOrdersFromJSON(content);
      if (success) {
        setMessage('تم استيراد البيانات بنجاح وتحديث كافة الطلبات!');
        onReload();
      } else {
        alert('حدث خطأ: ملف النسخ الاحتياطي غير صالح أو تالف');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (confirm('هل أنت متأكد من إعادة ضبط البيانات وتحميل النماذج التجريبية الافتراضية؟ سيتم استبدال البيانات الحالية.')) {
      localStorage.removeItem('ben_ahmed_sofa_orders_v1');
      onReload();
      setMessage('تمت إعادة ضبط البيانات إلى الوضع التجريبي الافتراضي.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">النسخ الاحتياطي وإدارة البيانات</h3>
              <p className="text-xs text-slate-400">حفظ واستعادة بيانات ورشة الكنب بأمان كامل</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-4">
          
          {/* Export Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-200">تصدير نسخة احتياطية (JSON)</h4>
              <p className="text-xs text-slate-400">تنزيل ملف يحتوي على كافة الطلبات والمواصفات والحسابات</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>تصدير الآن</span>
            </button>
          </div>

          {/* Import Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-200">استعادة نسخة سابقة</h4>
              <p className="text-xs text-slate-400">رفع ملف JSON لاستعادة الطلبات من جهاز آخر</p>
            </div>
            <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-all whitespace-nowrap">
              <Upload className="w-4 h-4" />
              <span>رفع ملف</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          {/* Reset Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-300">إعادة ضبط البيانات التجريبية</h4>
              <p className="text-xs text-slate-500">تحميل الطلبات والأطقم الافتراضية الجاهزة للتجربة</p>
            </div>
            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          </div>

        </div>

        <div className="text-[11px] text-slate-500 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          💡 تطبيق بن أحمد يعمل بنظام <strong>Offline-First</strong> حيث تحفظ بياناتك محلياً في متصفحك حتى بدون اتصال بالإنترنت. يُنصح بتصدير نسخة احتياطية دورياً.
        </div>

      </div>
    </div>
  );
};
