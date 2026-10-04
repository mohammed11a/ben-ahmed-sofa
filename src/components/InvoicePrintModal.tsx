import React from 'react';
import { X, Printer, Share2, MessageCircle, Armchair, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SofaOrder } from '../types';
import { generateWhatsAppLink } from '../services/storageService';

interface InvoicePrintModalProps {
  order: SofaOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const link = generateWhatsAppLink(order);
    window.open(link, '_blank');
  };

  const orderTypeArabic: Record<string, string> = {
    custom_sofa: 'طقم كنب تفصيل جديد',
    corner_sectional: 'كنب زاوية (L / U Shape)',
    reupholster: 'تنجيد وتجديد كنب قديم',
    arabic_majlis: 'مجلس عربي وجلسة أرضية',
    classic_set: 'طقم كنب كلاسيك',
    curtains_cushions: 'ستائر ومخدات وبوفات',
    repair: 'صيانة وتعديل'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-slate-100 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Armchair className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">سند استلام وتفصيل كنب - {order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال عبر واتساب</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 bg-white">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-amber-600/30 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-700 tracking-wide font-['Tajawal']">
                  بن أحمد لمفروشات وتفصيل الكنب
                </span>
              </div>
              <p className="text-xs text-slate-500">متخصصون في أرقى أطقم الكنب والمجالس الكلاسيكية والمودرن والتنجيد</p>
              <p className="text-xs text-slate-500">هاتف الورشة: 0500000000 | العنوان: الرياض، المملكة العربية السعودية</p>
            </div>

            <div className="text-left space-y-1 border-r pr-6 border-slate-200">
              <div className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                سند طلب وتفصيل رقم: {order.orderNumber}
              </div>
              <p className="text-xs text-slate-500">تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
              <p className="text-xs font-bold text-amber-700">موعد التسليم المتوقع: {order.expectedDeliveryDate}</p>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">اسم العميل:</span>
              <span className="font-bold text-sm text-slate-900">{order.customer.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">رقم الجوال:</span>
              <span className="font-bold text-sm text-slate-900" dir="ltr">{order.customer.phone}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block font-medium">العنوان / موقع التوصيل:</span>
              <span className="font-semibold text-slate-700">{order.customer.address || 'استلام من المحل'}</span>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-amber-800 tracking-wider">
              المواصفات الفنية والهندسية
            </h4>
            
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-right border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-600 w-1/3">نوع الموديل والطلب:</td>
                    <td className="p-3 font-semibold text-slate-900">{orderTypeArabic[order.orderType] || order.orderType}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-bold text-slate-600">المقاسات والأبعاد:</td>
                    <td className="p-3 font-semibold text-slate-900">
                      {order.dimensions.length} (عمق {order.dimensions.depth} - ارتفاع {order.dimensions.height}) - عدد {order.dimensions.seatsCount} مقاعد
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-600">نوع وشكل الزاوية:</td>
                    <td className="p-3 font-semibold text-slate-900">
                      {order.dimensions.cornerType === 'right' ? 'زاوية جهة اليمين' : order.dimensions.cornerType === 'left' ? 'زاوية جهة اليسار' : order.dimensions.cornerType === 'u_shape' ? 'شكل حرف U' : 'مستقيم'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-bold text-slate-600">القماش واللون:</td>
                    <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" style={{ backgroundColor: order.fabric.colorHex }}></span>
                      <span>{order.fabric.type} - اللون: {order.fabric.colorName} (كود: {order.fabric.code || 'بدون'} - المورد: {order.fabric.supplier || 'المحل'})</span>
                    </td>
                  </tr>
                  {order.fabric.cushionFabric && (
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-600">قماش المخدات:</td>
                      <td className="p-3 font-semibold text-slate-900">{order.fabric.cushionFabric}</td>
                    </tr>
                  )}
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-bold text-slate-600">الإسفنج والضغط:</td>
                    <td className="p-3 font-semibold text-slate-900">{order.foamAndWood.foamType}</td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-600">الهيكل الخشبي والقواعد:</td>
                    <td className="p-3 font-semibold text-slate-900">{order.foamAndWood.woodType} - الأرجل: {order.foamAndWood.legsType}</td>
                  </tr>
                  {order.notes && (
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold text-slate-600">ملاحظات إضافية:</td>
                      <td className="p-3 text-slate-700 italic">{order.notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sketch if exists */}
          {order.sketchDataUrl && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-amber-800 tracking-wider">
                كروكي وتوزيع الكنب المعتمد
              </h4>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-950 flex justify-center">
                <img
                  src={order.sketchDataUrl}
                  alt="كروكي الكنب"
                  className="max-h-48 object-contain rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Financial Breakdown Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-2">
            
            {/* Warranty & Terms */}
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-[11px] space-y-1.5 text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>شهادة الضمان والشروط ({order.warrantyYears} سنوات)</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pr-1">
                <li>يسري الضمان على الهيكل الخشبي وتماسك الإسفنج ضد الهبوط.</li>
                <li>يتم استحقاق المبلغ المتبقي كاملاً قبل أو عند التركيب النهائي.</li>
                <li>لا يشمل الضمان سوء الاستخدام أو تعرض الأقمشة للمواد الكيميائية الحارقة.</li>
              </ul>
            </div>

            {/* Calculations Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>إجمالي قيمة الطلب:</span>
                <span className="font-bold">{order.payment.totalAmount.toLocaleString()} ر.س</span>
              </div>
              {order.payment.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>الخصم الممنوح:</span>
                  <span className="font-bold">- {order.payment.discount.toLocaleString()} ر.س</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1.5">
                <span>العربون المدفوع ({order.payment.paymentMethod}):</span>
                <span>{order.payment.deposit.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between text-amber-800 text-sm font-black border-t-2 border-amber-500/40 pt-1.5">
                <span>المتبقي عند التسليم:</span>
                <span>{order.payment.remaining.toLocaleString()} ر.س</span>
              </div>
            </div>

          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div className="text-center space-y-10">
              <span className="font-bold text-slate-700">توقيع وختم المعرض / الورشة</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto"></div>
            </div>
            <div className="text-center space-y-10">
              <span className="font-bold text-slate-700">توقيع العميل بالموافقة على المواصفات</span>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
