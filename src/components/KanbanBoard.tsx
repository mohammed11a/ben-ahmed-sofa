import React from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SofaOrder, OrderStatus } from '../types';
import { generateWhatsAppLink } from '../services/storageService';

interface KanbanBoardProps {
  orders: SofaOrder[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onEditOrder: (order: SofaOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onPrintOrder: (order: SofaOrder) => void;
}

interface ColumnDef {
  key: OrderStatus;
  title: string;
  color: string;
  badgeBg: string;
}

const COLUMNS: ColumnDef[] = [
  { key: 'new', title: 'طلب جديد', color: 'border-blue-500/40', badgeBg: 'bg-blue-500/10 text-blue-400' },
  { key: 'materials', title: 'توريد القماش والمواد', color: 'border-purple-500/40', badgeBg: 'bg-purple-500/10 text-purple-400' },
  { key: 'carpentry', title: 'معمل النجارة والهيكل', color: 'border-amber-500/40', badgeBg: 'bg-amber-500/10 text-amber-400' },
  { key: 'upholstery', title: 'قسم القص والتنجيد', color: 'border-orange-500/40', badgeBg: 'bg-orange-500/10 text-orange-400' },
  { key: 'quality', title: 'فحص الجودة والتشطيب', color: 'border-cyan-500/40', badgeBg: 'bg-cyan-500/10 text-cyan-400' },
  { key: 'ready', title: 'جاهز للتسليم 🚚', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/10 text-emerald-400' },
  { key: 'completed', title: 'مكتمل ومسلّم ✨', color: 'border-slate-500/40', badgeBg: 'bg-slate-500/10 text-slate-400' }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  orders,
  onStatusChange,
  onEditOrder,
  onDeleteOrder,
  onPrintOrder
}) => {
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const keys = COLUMNS.map(c => c.key);
    const idx = keys.indexOf(current);
    return idx < keys.length - 1 ? keys[idx + 1] : null;
  };

  const getPrevStatus = (current: OrderStatus): OrderStatus | null => {
    const keys = COLUMNS.map(c => c.key);
    const idx = keys.indexOf(current);
    return idx > 0 ? keys[idx - 1] : null;
  };

  const handleAdvance = (order: SofaOrder) => {
    const next = getNextStatus(order.status);
    if (next) {
      if (next === 'completed') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      onStatusChange(order.id, next);
    }
  };

  const handleRetract = (order: SofaOrder) => {
    const prev = getPrevStatus(order.status);
    if (prev) {
      onStatusChange(order.id, prev);
    }
  };

  const getDaysDiff = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().setHours(0,0,0,0);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">خط سير ومراحل الإنتاج (Kanban)</h2>
          <p className="text-xs text-slate-400">تتبع تقدم أطقم الكنب من النجارة والتفصيل حتى فحص الجودة والتسليم</p>
        </div>
      </div>

      {/* Columns Container (Horizontal Scroll) */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 snap-x">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);

          return (
            <div
              key={col.key}
              className={`flex-shrink-0 w-80 sm:w-84 bg-slate-900/80 rounded-2xl border ${col.color} p-3 flex flex-col max-h-[75vh] shadow-lg`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${col.badgeBg}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colOrders.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    لا توجد طلبات في هذه المرحلة حالياً
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const daysRemaining = getDaysDiff(order.expectedDeliveryDate);
                    const isUrgent = order.priority === 'urgent' || daysRemaining <= 1;

                    return (
                      <div
                        key={order.id}
                        className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all hover:shadow-xl relative group"
                      >
                        {/* Order Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-slate-100">{order.orderNumber}</span>
                              {order.priority === 'urgent' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                  مستعجل ⚡
                                </span>
                              )}
                              {order.priority === 'vip' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  VIP 👑
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-xs text-slate-300 mt-1">{order.customer.name}</h4>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onPrintOrder(order)}
                              title="طباعة السند"
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => window.open(generateWhatsAppLink(order), '_blank')}
                              title="محادثة واتساب"
                              className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditOrder(order)}
                              title="تعديل"
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Specs Mini Tag */}
                        <div className="bg-slate-900/80 rounded-xl p-2.5 text-[11px] space-y-1 border border-slate-800/80">
                          <div className="text-slate-300 font-semibold truncate">
                            {order.dimensions.length} ({order.dimensions.seatsCount} مقاعد)
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <span 
                              className="w-3 h-3 rounded-full border border-slate-600 flex-shrink-0" 
                              style={{ backgroundColor: order.fabric.colorHex }}
                            />
                            <span className="truncate">{order.fabric.type} ({order.fabric.colorName})</span>
                          </div>

                          <div className="text-slate-400 truncate">
                            إسفنج: {order.foamAndWood.foamType.split('+')[0]}
                          </div>
                        </div>

                        {/* Financial and Due Date */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                          <div>
                            <span className="text-slate-500 block">المتبقي:</span>
                            <span className={`font-bold ${order.payment.remaining > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {order.payment.remaining.toLocaleString()} ر.س
                            </span>
                          </div>

                          <div className="text-left">
                            <span className="text-slate-500 block">التسليم:</span>
                            <span className={`font-bold flex items-center gap-1 ${
                              daysRemaining < 0 
                                ? 'text-rose-400' 
                                : daysRemaining <= 2 
                                ? 'text-amber-400' 
                                : 'text-slate-300'
                            }`}>
                              <Calendar className="w-3 h-3 inline" />
                              {daysRemaining < 0 ? 'متأخر!' : daysRemaining === 0 ? 'اليوم' : `${daysRemaining} يوم`}
                            </span>
                          </div>
                        </div>

                        {/* Stage Controls: Next / Prev Arrows */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                          <button
                            disabled={!getPrevStatus(order.status)}
                            onClick={() => handleRetract(order)}
                            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-100 disabled:opacity-20 transition-all p-1"
                            title="إرجاع للمرحلة السابقة"
                          >
                            <ChevronRight className="w-4 h-4" />
                            <span>السابق</span>
                          </button>

                          <button
                            disabled={!getNextStatus(order.status)}
                            onClick={() => handleAdvance(order)}
                            className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 disabled:opacity-20 transition-all p-1"
                            title="نقل للمرحلة التالية"
                          >
                            <span>التالي</span>
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
