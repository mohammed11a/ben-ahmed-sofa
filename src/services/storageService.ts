import { SofaOrder, OrderStats, OrderStatus } from '../types';

const STORAGE_KEY = 'ben_ahmed_sofa_orders_v1';

// Initial realistic demo orders for immediate testing
const INITIAL_DEMO_ORDERS: SofaOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-1001',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer: {
      name: 'عبدالرحمن العتيبي',
      phone: '0551234567',
      address: 'الرياض - حي النرجس، فيلا 14',
      notes: 'يفضل التوصيل في الفترة المسائية بعد صلاة العصر'
    },
    orderType: 'corner_sectional',
    priority: 'urgent',
    status: 'upholstery',
    dimensions: {
      length: '4.2 × 2.8 م',
      depth: '95 سم',
      height: '85 سم',
      cornerType: 'right',
      seatsCount: 8,
      customNotes: 'زاوية يمين مع بوف إضافي متحرك 90×90 سم'
    },
    fabric: {
      type: 'بوكليه فاخر مقاوم للبلل',
      code: 'BK-902',
      supplier: 'كتالوج مفروشات القثمي',
      colorName: 'بيج عاجي (أوف وايت)',
      colorHex: '#f5f0e6',
      cushionFabric: 'مخمل جملي عسلي (4 مخدات)'
    },
    foamAndWood: {
      woodType: 'خشب سويدي طبيعي مع تدعيم زان روماني',
      foamType: 'إسفنج دنلوب ضغط 36 عالي الكثافة (سوبر مريح)',
      springType: 'سست تركية حلزونية مع أحزمة إيطالية',
      legsType: 'أرجل ستانلس ستيل تيتانيوم ذهبي مطفي ارتفاع 15 سم'
    },
    payment: {
      totalAmount: 7800,
      discount: 300,
      deposit: 4000,
      remaining: 3500,
      paymentMethod: 'transfer'
    },
    warrantyYears: 5,
    notes: 'تمت معاينة عينة القماش بالمحل والموافقة عليها'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-1002',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer: {
      name: 'سارة خالد الدوسري',
      phone: '0549876543',
      address: 'الدمام - حي الشاطئ الشرقي',
      notes: 'عمارة الدور الثالث يوجد مصعد واسع'
    },
    orderType: 'custom_sofa',
    priority: 'vip',
    status: 'carpentry',
    dimensions: {
      length: 'طقم 3+2+1+1 (إجمالي 7 مقاعد)',
      depth: '90 سم',
      height: '90 سم',
      cornerType: 'none',
      seatsCount: 7,
      customNotes: 'تصميم نيو كلاسيك كابتونيه للأذرع والظهر'
    },
    fabric: {
      type: 'مخمل تركي ناعم ثقيل نانو',
      code: 'TR-771',
      supplier: 'كتالوج السريع للأقمشة',
      colorName: 'أخضر ملكي زمردي',
      colorHex: '#064e3b',
      cushionFabric: 'ساتان منقوش ذهبي وأخضر'
    },
    foamAndWood: {
      woodType: 'هيكل كامل من خشب الزان الأحمر المتبخر',
      foamType: 'ضغط 40 سوبر دريم + طبقة ريش نعام صناعي 3 سم',
      springType: 'أحزمة إيطالية مزدوجة الشد',
      legsType: 'خشب زان منحوت مدهون بلون الجوز الداكن'
    },
    payment: {
      totalAmount: 9200,
      discount: 0,
      deposit: 5000,
      remaining: 4200,
      paymentMethod: 'card'
    },
    warrantyYears: 5,
    notes: 'تم أخذ مقاسات الصالة ميدانياً بواسطة المعلم محمد'
  },
  {
    id: 'ord-1003',
    orderNumber: 'ORD-1003',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer: {
      name: 'سليمان بن ناصر الحمدان',
      phone: '0502233445',
      address: 'الرياض - حي الملقا',
      notes: 'تسليم في الموقع الجديد'
    },
    orderType: 'arabic_majlis',
    priority: 'normal',
    status: 'quality',
    dimensions: {
      length: 'مجلس دائري متصل 14 متر',
      depth: '85 سم',
      height: '45 سم (جلسة منخفضة)',
      cornerType: 'u_shape',
      seatsCount: 16,
      customNotes: 'مع 12 تكاية جانبية ومركى ساند'
    },
    fabric: {
      type: 'كتان هندي ثقيل معالج ضد البقع',
      code: 'IN-401',
      supplier: 'مؤسسة روعة المنسوجات',
      colorName: 'رمادي حجري دافئ',
      colorHex: '#78716c',
      cushionFabric: 'سدو تقليدي مودرن'
    },
    foamAndWood: {
      woodType: 'قواعد خشب سويدي سماكة 18 ملم مع دعامات',
      foamType: 'إسفنج الراجحي ضغط 60 كوري قاسي للجلسات الأرضية',
      springType: 'خشب مصمت مع حشو فايبر مضغوط',
      legsType: 'مخفية كعوب بلاستيكية عازلة للرطوبة'
    },
    payment: {
      totalAmount: 14500,
      discount: 500,
      deposit: 8000,
      remaining: 6000,
      paymentMethod: 'cash'
    },
    warrantyYears: 7,
    notes: 'العميل معتمد الموديل من صورة المعرض'
  },
  {
    id: 'ord-1004',
    orderNumber: 'ORD-1004',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer: {
      name: 'فهد إبراهيم المنصور',
      phone: '0567788990',
      address: 'جدة - حي الروضة',
      notes: 'طلب جديد بانتظار وصول القماش من المورد'
    },
    orderType: 'reupholster',
    priority: 'normal',
    status: 'materials',
    dimensions: {
      length: 'طقم كنب أمريكي 5 قطع',
      depth: '88 سم',
      height: '80 سم',
      cornerType: 'none',
      seatsCount: 6,
      customNotes: 'تغيير الإسفنج التالف وتجديد البطانة السفلية'
    },
    fabric: {
      type: 'قماش كتان شانيل إسباني',
      code: 'ESP-12',
      supplier: 'أقمشة العمر',
      colorName: 'كحلي ليلي',
      colorHex: '#1e3a8a',
      cushionFabric: 'أوف وايت وكحلي'
    },
    foamAndWood: {
      woodType: 'الهيكل الأصلي بحالة جيدة (يحتاج تقوية بسيطة)',
      foamType: 'تجديد كامل بإسفنج ضغط 40 سوبر دريم',
      springType: 'إعادة شد السست والشرائط',
      legsType: 'إعادة رش وصنفرة الأرجل الخشبية بلون مطفي'
    },
    payment: {
      totalAmount: 4800,
      discount: 0,
      deposit: 2000,
      remaining: 2800,
      paymentMethod: 'tabby_tamara'
    },
    warrantyYears: 3,
    notes: 'تم استلام الكنب من منزل العميل'
  }
];

export const getOrders = (): SofaOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load orders from localStorage', err);
    return INITIAL_DEMO_ORDERS;
  }
};

export const saveOrders = (orders: SofaOrder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
};

export const addOrder = (order: SofaOrder): SofaOrder[] => {
  const current = getOrders();
  const updated = [order, ...current];
  saveOrders(updated);
  return updated;
};

export const updateOrder = (order: SofaOrder): SofaOrder[] => {
  const current = getOrders();
  const updated = current.map((o) => (o.id === order.id ? order : o));
  saveOrders(updated);
  return updated;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus): SofaOrder[] => {
  const current = getOrders();
  const updated = current.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : o.completedAt
      };
    }
    return o;
  });
  saveOrders(updated);
  return updated;
};

export const deleteOrder = (orderId: string): SofaOrder[] => {
  const current = getOrders();
  const updated = current.filter((o) => o.id !== orderId);
  saveOrders(updated);
  return updated;
};

export const calculateStats = (orders: SofaOrder[]): OrderStats => {
  const activeOrders = orders.filter((o) => o.status !== 'completed').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const urgentOrders = orders.filter((o) => o.priority === 'urgent' && o.status !== 'completed').length;
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment.totalAmount - (o.payment.discount || 0)), 0);
  const totalDeposits = orders.reduce((sum, o) => sum + (o.payment.deposit || 0), 0);
  const totalRemaining = orders.reduce((sum, o) => sum + (o.payment.remaining || 0), 0);

  return {
    totalOrders: orders.length,
    activeOrders,
    completedOrders,
    urgentOrders,
    totalRevenue,
    totalDeposits,
    totalRemaining,
    monthlyOrdersCount: orders.length
  };
};

export const exportOrdersAsJSON = (): string => {
  const orders = getOrders();
  return JSON.stringify(orders, null, 2);
};

export const importOrdersFromJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data)) {
      saveOrders(data);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Import failed', err);
    return false;
  }
};

export const generateWhatsAppLink = (order: SofaOrder): string => {
  const phone = order.customer.phone.replace(/^0/, '966').replace(/\D/g, '');
  const remaining = order.payment.remaining;
  const statusLabels: Record<OrderStatus, string> = {
    new: 'طلب جديد',
    materials: 'قيد تجهيز وتوريد الأقمشة والمواد',
    carpentry: 'في قسم النجارة والهيكل',
    upholstery: 'في قسم القص والتنجيد',
    quality: 'فحص الجودة والتشطيب',
    ready: 'جاهز للتسليم والتركيب 🚚',
    completed: 'تم التسليم بنجاح ✨'
  };

  const message = `السلام عليكم ورحمة الله وبركاته،
أهلاً بك أستاذ *${order.customer.name}* 🛋️
معك *مفروشات وتفصيل كنب بن أحمد*،

إليك ملخص طلبك رقم: *${order.orderNumber}*
- *الموديل*: ${order.orderType === 'corner_sectional' ? 'كنب زاوية' : order.orderType === 'custom_sofa' ? 'طقم كنب تفصيل' : 'مجلس وتنجيد كنب'}
- *المقاسات*: ${order.dimensions.length} (${order.dimensions.seatsCount} مقاعد)
- *القماش واللون*: ${order.fabric.type} (${order.fabric.colorName})
- *نوع الإسفنج*: ${order.foamAndWood.foamType}
- *حالة الطلب الحالية*: ${statusLabels[order.status] || order.status}
- *تاريخ التسليم المتوقع*: ${order.expectedDeliveryDate}
-------------------------
- *إجمالي الطلب*: ${order.payment.totalAmount} ر.س
- *العربون المدفوع*: ${order.payment.deposit} ر.س
- *المتبقي عند التسليم*: *${remaining} ر.س*

يسعدنا دائماً خدمتكم وضمان أعلى جودة في تفصيل أثاثكم!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
