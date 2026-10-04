export type OrderType = 
  | 'custom_sofa'       // تفصيل كنب جديد
  | 'reupholster'       // تنجيد وتجديد
  | 'corner_sectional'  // كنب زاوية L / U
  | 'arabic_majlis'     // مجلس عربي وجلسات أرضية
  | 'classic_set'       // أطقم كلاسيك / نيوكلاسيك
  | 'curtains_cushions' // ستائر ومخدات وإكسسوارات
  | 'repair';           // صيانة وتعديل

export type OrderStatus = 
  | 'new'         // طلب جديد
  | 'materials'   // قيد توريد القماش والخشب
  | 'carpentry'   // قسم النجارة والهيكل
  | 'upholstery'  // قسم القص والتنجيد
  | 'quality'     // فحص الجودة والتشطيب
  | 'ready'       // جاهز للتسليم والتركيب
  | 'completed';  // مكتمل ومسلّم بالكامل

export type Priority = 'normal' | 'urgent' | 'vip';

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface DimensionsInfo {
  length: string; // e.g. 3.5 م أو 350 سم
  depth: string;  // e.g. 90 سم
  height: string; // e.g. 85 سم
  cornerType: 'none' | 'right' | 'left' | 'u_shape';
  seatsCount: number; // e.g. 7 مقاعد
  customNotes?: string;
}

export interface FabricInfo {
  type: string;        // مخمل، بوكليه، كتان، جلد، إلخ
  code: string;        // كود القماش
  supplier: string;    // اسم المورد أو الكتالوج
  colorName: string;   // اسم اللون
  colorHex: string;    // كود اللون الست عشري للعرض
  cushionFabric?: string; // قماش المخدات إن اختلف
}

export interface FoamAndWoodInfo {
  woodType: string;    // خشب سويدي طبيعي، خشب زان أحمر، حديد، إلخ
  foamType: string;    // ضغط 40 سوبر دريم، دنلوب، ضغط 60 كوري، إلخ
  springType: string;  // سست تركية حلزونية، أحزمة شد ألمانية، خشب مصمت
  legsType: string;    // استيل ذهبي، استيل أسود، خشب زان مخروطي، خفي
}

export interface PaymentInfo {
  totalAmount: number;     // الإجمالي
  discount: number;        // الخصم
  deposit: number;         // العربون
  remaining: number;       // المتبقي
  paymentMethod: 'cash' | 'card' | 'transfer' | 'tabby_tamara';
}

export interface SofaOrder {
  id: string;
  orderNumber: string;     // e.g. "ORD-1042"
  createdAt: string;       // ISO string
  expectedDeliveryDate: string; // YYYY-MM-DD
  completedAt?: string;
  customer: CustomerInfo;
  orderType: OrderType;
  priority: Priority;
  status: OrderStatus;
  dimensions: DimensionsInfo;
  fabric: FabricInfo;
  foamAndWood: FoamAndWoodInfo;
  payment: PaymentInfo;
  sketchDataUrl?: string;  // رسم الكروكي كصورة Base64
  images?: string[];       // صور إضافية
  notes?: string;
  warrantyYears: number;   // مدة الضمان بالسنوات
}

export interface OrderStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  urgentOrders: number;
  totalRevenue: number;
  totalDeposits: number;
  totalRemaining: number;
  monthlyOrdersCount: number;
}
