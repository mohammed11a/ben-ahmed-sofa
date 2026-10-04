import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Printer, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Phone, 
  Eye, 
  Calendar,
  Armchair,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { SofaOrder, OrderStatus, OrderType, Priority } from '../types';
import { generateWhatsAppLink } from '../services/storageService';

interface OrderListProps {
  orders: SofaOrder[];
  onEditOrder: (order: SofaOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onPrintOrder: (order: SofaOrder) => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onEditOrder,
  onDeleteOrder,
  onPrintOrder,
  onStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fabric.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fabric.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.orderType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const statusOptions: { key: OrderStatus; label: string; color: string }[] = [
    { key: 'new', label: 'طلب جديد', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { key: 'materials', label: 'توريد المواد', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { key: 'carpentry', label: 'معمل النجارة', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { key: 'upholstery', label: 'القص والتنجيد', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { key: 'quality', label: 'فحص الجودة', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { key: 'ready', label: 'جاهز للتسليم 🚚', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { key: 'completed', label: 'مكتمل ومسلّم ✨', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }
  ];

  const orderTypeArabic: Record<string, string> = {
    custom_sofa: 'تفصيل جديد',
    corner_sectional: 'كنب زاوية L/U',
    reupholster: 'تنجيد وتجديد',
    arabic_majlis: 'مجلس عربي',
    classic_set: 'طقم كلاسيك',
    curtains_cushions: 'ستائر ومخدات',
    repair: 'صيانة'
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">سجل أوامر تفصيل وتنجيد الكنب</h2>
          <p className="text-xs text-slate-400">إجمالي {filteredOrders.length} طلب مطابق للبحث والفلترة</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث بالاسم، الجوال، رقم الطلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">كافة الحالات</option>
            <option value="new">طلب جديد</option>
            <option value="materials">توريد المواد</option>
            <option value="carpentry">معمل النجارة</option>
            <option value="upholstery">القص والتنجيد</option>
            <option value="quality">فحص الجودة</option>
            <option value="ready">جاهز للتسليم</option>
            <option value="completed">مكتمل ومسلّم</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">كافة الموديلات</option>
            <option value="custom_sofa">تفصيل جديد</option>
            <option value="corner_sectional">كنب زاوية</option>
            <option value="reupholster">تنجيد وتجديد</option>
            <option value="arabic_majlis">مجلس عربي</option>
            <option value="classic_set">طقم كلاسيك</option>
            <option value="curtains_cushions">ستائر ومخدات</option>
            <option value="repair">صيانة</option>
          </select>

        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-4">رقم الطلب</th>
                <th className="py-4 px-4">العميل والتواصل</th>
                <th className="py-4 px-4">الموديل والمقاسات</th>
                <th className="py-4 px-4">القماش واللون</th>
                <th className="py-4 px-4">مرحلة التنفيذ</th>
                <th className="py-4 px-4">المالية (ر.س)</th>
                <th className="py-4 px-4">التسليم</th>
                <th className="py-4 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    لا توجد طلبات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const currentStatusObj = statusOptions.find(s => s.key === order.status);

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                      
                      {/* Order # */}
                      <td className="py-4 px-4 font-bold text-slate-100 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{order.orderNumber}</span>
                          {order.priority === 'urgent' && (
                            <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/50">
                              عاجل
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block font-normal">
                          {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-200">{order.customer.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-slate-400 font-mono text-[11px]" dir="ltr">
                            {order.customer.phone}
                          </span>
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="text-slate-400 hover:text-emerald-400"
                            title="اتصال"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => window.open(generateWhatsAppLink(order), '_blank')}
                            className="text-slate-400 hover:text-emerald-400"
                            title="واتساب"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Sofa Model & Dims */}
                      <td className="py-4 px-4">
                        <span className="inline-block text-[11px] font-semibold text-amber-300">
                          {orderTypeArabic[order.orderType] || order.orderType}
                        </span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {order.dimensions.length} ({order.dimensions.seatsCount} مقاعد)
                        </div>
                      </td>

                      {/* Fabric */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-slate-600 flex-shrink-0"
                            style={{ backgroundColor: order.fabric.colorHex }}
                          />
                          <div>
                            <span className="text-slate-200 block truncate max-w-[140px]">{order.fabric.type}</span>
                            <span className="text-[10px] text-slate-400">{order.fabric.colorName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold rounded-xl px-2.5 py-1.5 border focus:outline-none ${currentStatusObj?.color || ''} bg-slate-950`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s.key} value={s.key} className="bg-slate-900 text-slate-200">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Financials */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-200">
                          {order.payment.totalAmount.toLocaleString()} ر.س
                        </div>
                        <div className="text-[11px] text-slate-400">
                          العربون: {order.payment.deposit.toLocaleString()} ر.س
                        </div>
                        <div className={`text-[11px] font-bold ${order.payment.remaining > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          المتبقي: {order.payment.remaining.toLocaleString()} ر.س
                        </div>
                      </td>

                      {/* Delivery Date */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-300">
                        {order.expectedDeliveryDate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onPrintOrder(order)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                            title="عرض وطباعة سند الطلب"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditOrder(order)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                            title="تعديل بيانات الطلب"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف الطلب رقم ${order.orderNumber} للعميل ${order.customer.name}؟`)) {
                                onDeleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-400 hover:border-rose-700"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
