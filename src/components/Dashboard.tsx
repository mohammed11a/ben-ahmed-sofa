import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Armchair, 
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  FileText
} from 'lucide-react';
import { SofaOrder, OrderStats } from '../types';

interface DashboardProps {
  stats: OrderStats;
  orders: SofaOrder[];
  onNewOrder: () => void;
  onViewOrders: () => void;
  onSelectOrder: (order: SofaOrder) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  orders,
  onNewOrder,
  onViewOrders,
  onSelectOrder
}) => {
  const recentOrders = orders.slice(0, 5);

  const statusLabels: Record<string, { label: string; badge: string }> = {
    new: { label: 'طلب جديد', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    materials: { label: 'توريد المواد', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    carpentry: { label: 'معمل النجارة', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    upholstery: { label: 'القص والتنجيد', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    quality: { label: 'فحص الجودة', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    ready: { label: 'جاهز للتسليم 🚚', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    completed: { label: 'مكتمل ومسلّم ✨', badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> لوحة الإدارة الذكية لمحل وورشة الكنب
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            مرحباً بك في نظام <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">بن أحمد للمفروشات</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            متابعة شاملة لطلبات العملاء، مواصفات الأقمشة والإسفنج، كروكي المقاسات، وحسابات الدفعات والعربونات بدقة وسهولة.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNewOrder}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>تسجيل طلب تفصيل جديد</span>
            </button>
            <button
              onClick={onViewOrders}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>عرض سجل الطلبات</span>
            </button>
          </div>
        </div>

        {/* Decorative Sofa Icon in Background */}
        <div className="absolute left-6 -bottom-6 opacity-10 pointer-events-none hidden sm:block">
          <Armchair className="w-64 h-64 text-amber-400" />
        </div>
      </div>

      {/* Stats KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">إجمالي المبيعات</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-100">
            {stats.totalRevenue.toLocaleString()} <span className="text-xs text-amber-400 font-normal">ر.س</span>
          </div>
          <span className="text-[11px] text-slate-400 block">إجمالي قيمة كافة العقود والطلبات</span>
        </div>

        {/* Deposits Collected */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">المبالغ المقبوضة (العربونات)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {stats.totalDeposits.toLocaleString()} <span className="text-xs text-emerald-300 font-normal">ر.س</span>
          </div>
          <span className="text-[11px] text-emerald-500/80 block">سيولة تم تحصيلها فعلياً في الصندوق</span>
        </div>

        {/* Remaining Receivables */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">المتبقي للتحصيل</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            {stats.totalRemaining.toLocaleString()} <span className="text-xs text-amber-300 font-normal">ر.س</span>
          </div>
          <span className="text-[11px] text-slate-400 block">مستحقة الدفع عند التسليم والتركيب</span>
        </div>

        {/* Active In-Production */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">طلبات قيد التصنيع</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Armchair className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-400">
            {stats.activeOrders} <span className="text-xs text-slate-400 font-normal">طلب نشط</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {stats.urgentOrders > 0 ? (
              <span className="text-rose-400 font-bold">⚠️ يوجد {stats.urgentOrders} طلبات مستعجلة</span>
            ) : (
              'جميع الطلبات تسير وفق الجدول'
            )}
          </span>
        </div>

      </div>

      {/* Production Stage Distribution & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stage Overview Bar */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-lg">
          <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
            <span>توزيع مراحل خط الإنتاج</span>
            <span className="text-xs text-slate-400">ورشة النجارة والتنجيد</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { key: 'carpentry', name: 'معمل النجارة والهياكل', color: 'bg-amber-500' },
              { key: 'upholstery', name: 'قسم القص والتنجيد والإسفنج', color: 'bg-orange-500' },
              { key: 'quality', name: 'التشطيب وضبط الجودة', color: 'bg-cyan-500' },
              { key: 'ready', name: 'جاهز للشحن والتسليم', color: 'bg-emerald-500' }
            ].map((st) => {
              const count = orders.filter((o) => o.status === st.key).length;
              const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;

              return (
                <div key={st.key} className="space-y-1">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>{st.name}</span>
                    <span className="font-bold">{count} طلب ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${st.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>إجمالي المنجز والمسلّم بالكامل:</span>
            <span className="font-bold text-emerald-400">{stats.completedOrders} أطقم كنب</span>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">أحدث طلبات التفصيل والتنجيد</h3>
            <button
              onClick={onViewOrders}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {recentOrders.map((order) => {
              const st = statusLabels[order.status] || { label: order.status, badge: 'bg-slate-800 text-slate-300' };

              return (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-all">
                      <Armchair className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-200">{order.customer.name}</span>
                        <span className="text-xs font-mono text-slate-400">({order.orderNumber})</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {order.dimensions.length} • {order.fabric.type}
                      </p>
                    </div>
                  </div>

                  <div className="text-left space-y-1">
                    <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${st.badge}`}>
                      {st.label}
                    </span>
                    <span className="text-xs font-bold text-slate-300 block">
                      {order.payment.totalAmount.toLocaleString()} ر.س
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
