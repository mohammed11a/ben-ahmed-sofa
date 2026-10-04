import React, { useState } from 'react';
import { 
  X, 
  Save, 
  User, 
  Armchair, 
  Palette, 
  PenTool, 
  DollarSign, 
  Sparkles,
  Phone, 
  MapPin, 
  Ruler, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SofaOrder, OrderType, Priority, OrderStatus } from '../types';
import { SketchCanvas } from './SketchCanvas';

interface OrderFormModalProps {
  orderToEdit?: SofaOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: SofaOrder) => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  orderToEdit,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [customerName, setCustomerName] = useState(orderToEdit?.customer.name || '');
  const [customerPhone, setCustomerPhone] = useState(orderToEdit?.customer.phone || '');
  const [customerAddress, setCustomerAddress] = useState(orderToEdit?.customer.address || '');
  const [customerNotes, setCustomerNotes] = useState(orderToEdit?.customer.notes || '');

  const [orderType, setOrderType] = useState<OrderType>(orderToEdit?.orderType || 'custom_sofa');
  const [priority, setPriority] = useState<Priority>(orderToEdit?.priority || 'normal');
  const [status, setStatus] = useState<OrderStatus>(orderToEdit?.status || 'new');

  // Dimensions
  const [length, setLength] = useState(orderToEdit?.dimensions.length || '3.5 × 2.5 م');
  const [depth, setDepth] = useState(orderToEdit?.dimensions.depth || '90 سم');
  const [height, setHeight] = useState(orderToEdit?.dimensions.height || '85 سم');
  const [cornerType, setCornerType] = useState(orderToEdit?.dimensions.cornerType || 'none');
  const [seatsCount, setSeatsCount] = useState(orderToEdit?.dimensions.seatsCount || 7);
  const [dimNotes, setDimNotes] = useState(orderToEdit?.dimensions.customNotes || '');

  // Fabric
  const [fabricType, setFabricType] = useState(orderToEdit?.fabric.type || 'بوكليه فاخر');
  const [fabricCode, setFabricCode] = useState(orderToEdit?.fabric.code || '');
  const [fabricSupplier, setFabricSupplier] = useState(orderToEdit?.fabric.supplier || '');
  const [colorName, setColorName] = useState(orderToEdit?.fabric.colorName || 'بيج فاتح');
  const [colorHex, setColorHex] = useState(orderToEdit?.fabric.colorHex || '#f5f0e6');
  const [cushionFabric, setCushionFabric] = useState(orderToEdit?.fabric.cushionFabric || '');

  // Foam & Wood
  const [woodType, setWoodType] = useState(orderToEdit?.foamAndWood.woodType || 'خشب سويدي طبيعي متين');
  const [foamType, setFoamType] = useState(orderToEdit?.foamAndWood.foamType || 'إسفنج دنلوب ضغط 36 عالي الجودة');
  const [springType, setSpringType] = useState(orderToEdit?.foamAndWood.springType || 'سست حلزونية تركية مع أحزمة ألمانية');
  const [legsType, setLegsType] = useState(orderToEdit?.foamAndWood.legsType || 'أرجل استيل ذهبي مطفي');

  // Sketch & Media
  const [sketchDataUrl, setSketchDataUrl] = useState<string>(orderToEdit?.sketchDataUrl || '');
  const [warrantyYears, setWarrantyYears] = useState<number>(orderToEdit?.warrantyYears || 5);
  const [generalNotes, setGeneralNotes] = useState(orderToEdit?.notes || '');

  // Payment & Deadlines
  const [totalAmount, setTotalAmount] = useState<number>(orderToEdit?.payment.totalAmount || 6500);
  const [discount, setDiscount] = useState<number>(orderToEdit?.payment.discount || 0);
  const [deposit, setDeposit] = useState<number>(orderToEdit?.payment.deposit || 3000);
  const [paymentMethod, setPaymentMethod] = useState(orderToEdit?.payment.paymentMethod || 'cash');
  const [expectedDate, setExpectedDate] = useState<string>(
    orderToEdit?.expectedDeliveryDate || 
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const remaining = Math.max(0, totalAmount - discount - deposit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('يرجى ملء اسم العميل ورقم الهاتف على الأقل');
      setActiveStep(1);
      return;
    }

    const orderNumber = orderToEdit?.orderNumber || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderData: SofaOrder = {
      id: orderToEdit?.id || `ord-${Date.now()}`,
      orderNumber,
      createdAt: orderToEdit?.createdAt || new Date().toISOString(),
      expectedDeliveryDate: expectedDate,
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        notes: customerNotes
      },
      orderType,
      priority,
      status,
      dimensions: {
        length,
        depth,
        height,
        cornerType,
        seatsCount: Number(seatsCount),
        customNotes: dimNotes
      },
      fabric: {
        type: fabricType,
        code: fabricCode,
        supplier: fabricSupplier,
        colorName,
        colorHex,
        cushionFabric
      },
      foamAndWood: {
        woodType,
        foamType,
        springType,
        legsType
      },
      payment: {
        totalAmount: Number(totalAmount),
        discount: Number(discount),
        deposit: Number(deposit),
        remaining,
        paymentMethod
      },
      sketchDataUrl,
      notes: generalNotes,
      warrantyYears: Number(warrantyYears)
    };

    onSave(orderData);
    onClose();
  };

  // Quick preset chips
  const popularFabrics = ['بوكليه فاخر', 'مخمل تركي نانو', 'كتان هندي ثقيل', 'جلد ألماني صناعي', 'خيش مقاوم للماء'];
  const popularFoams = ['إسفنج دنلوب ضغط 36', 'سوبر دريم ضغط 40', 'ضغط 60 كوري', 'ريش نعام صناعي فاخر'];
  const popularWoods = ['خشب سويدي طبيعي', 'خشب زان أحمر روماني', 'هيكل حديد مجلفن', 'دمج زان وسويدي'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Armchair className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                {orderToEdit ? `تعديل الطلب (${orderToEdit.orderNumber})` : 'إنشاء طلب تفصيل كنب جديد'}
              </h2>
              <p className="text-xs text-slate-400">سجل كافة المواصفات الهندسية والمواد والحسابات المالية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 sm:px-6 py-2.5 bg-slate-950/50 text-xs overflow-x-auto gap-2">
          {[
            { id: 1, label: 'العميل', icon: User },
            { id: 2, label: 'المقاسات والشكل', icon: Ruler },
            { id: 3, label: 'القماش والإسفنج', icon: Palette },
            { id: 4, label: 'الكروكي والملاحظات', icon: PenTool },
            { id: 5, label: 'المالية والتسليم', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStep === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStep(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.id}. {tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: Customer Info */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <User className="w-4 h-4" /> بيانات العميل الأساسية
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اسم العميل <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: خالد محمد الشمري"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    رقم الجوال <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="مثال: 0551234567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    العنوان وموقع التوصيل
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: الرياض - حي الصحافة - شارع العليا، فيلا 22"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    أولوية الطلب
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="normal">عادي (Normal)</option>
                    <option value="urgent">مستعجل ⚡ (Urgent)</option>
                    <option value="vip">عميل خاص 👑 (VIP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    حالة الطلب الأولية
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="new">طلب جديد (New)</option>
                    <option value="materials">توريد القماش والمواد</option>
                    <option value="carpentry">قسم النجارة</option>
                    <option value="upholstery">قسم القص والتنجيد</option>
                    <option value="quality">فحص الجودة والتشطيب</option>
                    <option value="ready">جاهز للتسليم</option>
                    <option value="completed">مكتمل ومسلّم</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ملاحظات العميل الخاصة بالتوصيل أو المعاينة
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ملاحظات حول وقت الحضور، المصعد، مواعيد العميل..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Sofa Specs & Dimensions */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Ruler className="w-4 h-4" /> نوع الكنب والمقاسات التفصيلية
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نوع الكنب / التفصيل
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="custom_sofa">طقم كنب تفصيل جديد (Custom Sofa)</option>
                    <option value="corner_sectional">كنب زاوية L / U Shape</option>
                    <option value="reupholster">تنجيد وتجديد كنب قديم (Re-upholster)</option>
                    <option value="arabic_majlis">مجلس عربي وجلسة أرضية مرتفعة</option>
                    <option value="classic_set">طقم كلاسيك / نيو كلاسيك</option>
                    <option value="curtains_cushions">ستائر ومخدات وبوفات</option>
                    <option value="repair">صيانة وإصلاح</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اتجاه وشكل الزاوية
                  </label>
                  <select
                    value={cornerType}
                    onChange={(e) => setCornerType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="none">مستقيم / بدون زاوية</option>
                    <option value="right">زاوية يمين (Right L-Shape)</option>
                    <option value="left">زاوية يسار (Left L-Shape)</option>
                    <option value="u_shape">شكل حرف U (U-Shape Sectional)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الأطوال الإجمالية
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 3.8 × 2.6 م أو قطعة 3م + قطعة 2م"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    عدد المقاعد التقريبي
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={seatsCount}
                    onChange={(e) => setSeatsCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    عمق المقعد (الجلوس)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 90 سم (قياسي) أو 100 سم (عميق)"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ارتفاع الظهر والقاعدة
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: الارتفاع الكلي 85 سم، الجلسة 45 سم"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تفاصيل إضافية عن المقاسات والتقسيمات
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: عدد 2 بوف 60×60 سم، مع مخادع متحركة أو مساند أذرع عريضة 25 سم"
                    value={dimNotes}
                    onChange={(e) => setDimNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Fabrics, Foam, and Frame */}
          {activeStep === 3 && (
            <div className="space-y-6">
              
              {/* Fabrics Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> مواصفات القماش والألوان
                </h3>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs text-slate-400 self-center">خيارات شائعة:</span>
                  {popularFabrics.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFabricType(f)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        fabricType === f 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      نوع القماش
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: بوكليه تركي مقاوم للبقع"
                      value={fabricType}
                      onChange={(e) => setFabricType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      رقم / كود القماش
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: BK-882 أو رقم الصفحة في الكتالوج"
                      value={fabricCode}
                      onChange={(e) => setFabricCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      اسم المورد / الكتالوج
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: القثمي، السريع، الجديعي، بن شيهون..."
                      value={fabricSupplier}
                      onChange={(e) => setFabricSupplier(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      اسم ولون القماش
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border border-slate-700 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        placeholder="مثال: بيج عاجي، رمادي غامق، كحلي"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      قماش ولون المخدات الإضافية (إن وجدت)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: 4 مخدات مشجرة بلون كحلي وذهبي مع شراريب"
                      value={cushionFabric}
                      onChange={(e) => setCushionFabric(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Foam, Frame, Springs */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Armchair className="w-4 h-4" /> الهيكل، الإسفنج، والأرجل
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      نوع الإسفنج والضغط
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: دنلوب ضغط 36 أو سوبر دريم ضغط 40"
                      value={foamType}
                      onChange={(e) => setFoamType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      نوع الخشب وهيكل الكنب
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: خشب سويدي طبيعي، خشب زان أحمر"
                      value={woodType}
                      onChange={(e) => setWoodType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      السست والشدادات
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: سست حلزونية تركية مع أحزمة مطاطية إيطالية"
                      value={springType}
                      onChange={(e) => setSpringType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      نوع ولون الأرجل والقواعد
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: ستانلس ذهبي تيتانيوم ارتفاع 15 سم أو أرجل خشب مخروطية"
                      value={legsType}
                      onChange={(e) => setLegsType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: Sketch & Canvas */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <PenTool className="w-4 h-4" /> رسم كروكي وتخطيط هندسي للطلب
              </h3>

              <p className="text-xs text-slate-400">
                يمكنك رسم شكل الزاوية (يمين أو يسار)، وتدوين أطوال الجدران أو أماكن الأعمدة والأبواب بدقة للورشة:
              </p>

              <SketchCanvas
                initialDataUrl={sketchDataUrl}
                onSave={(dataUrl) => setSketchDataUrl(dataUrl)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    مدة الضمان (بالسنوات)
                  </label>
                  <select
                    value={warrantyYears}
                    onChange={(e) => setWarrantyYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>سنة واحدة</option>
                    <option value={2}>سنتان</option>
                    <option value={3}>3 سنوات (إسفنج وهيكل)</option>
                    <option value={5}>5 سنوات (ضمان ذهبي)</option>
                    <option value={7}>7 سنوات (شامل مجالس)</option>
                    <option value={10}>10 سنوات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تعليمات خاصة لفريق الورشة والتنجيد
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ملاحظات فنية حول الخياطة، الأزرار، التكسيرات..."
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Financials & Delivery Date */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> الحسابات المالية وتاريخ التسليم
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    إجمالي المبلغ المطلوب (ر.س) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الخصم الممنوح (إن وجد)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    العربون المقبوض (ر.س)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Financial Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">صافي الفاتورة</span>
                  <span className="text-lg font-bold text-slate-200">
                    {(totalAmount - discount).toLocaleString()} ر.س
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">العربون المدفوع</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {deposit.toLocaleString()} ر.س
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">المتبقي عند الاستلام</span>
                  <span className={`text-xl font-black ${remaining > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {remaining.toLocaleString()} ر.س
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    طريقة دفع العربون
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="cash">نقداً (Cash)</option>
                    <option value="card">شبكة / بطاقة مدى (Card)</option>
                    <option value="transfer">تحويل بنكي مباشر (Bank Transfer)</option>
                    <option value="tabby_tamara">تقسيط (تابي / تمارا)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تاريخ التسليم المتوقع للعميل <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
                >
                  السابق
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all"
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/25 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{orderToEdit ? 'حفظ التعديلات' : 'اعتماد وإنشاء الطلب'}</span>
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
