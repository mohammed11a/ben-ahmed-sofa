import React, { useState, useEffect } from 'react';
import { SofaOrder, OrderStats, OrderStatus } from './types';
import { 
  getOrders, 
  addOrder, 
  updateOrder, 
  deleteOrder, 
  updateOrderStatus, 
  calculateStats 
} from './services/storageService';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { OrderList } from './components/OrderList';
import { OrderFormModal } from './components/OrderFormModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { BackupModal } from './components/BackupModal';

export const App: React.FC = () => {
  const [orders, setOrders] = useState<SofaOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    urgentOrders: 0,
    totalRevenue: 0,
    totalDeposits: 0,
    totalRemaining: 0,
    monthlyOrdersCount: 0
  });

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'kanban' | 'orders'>('dashboard');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [orderToEdit, setOrderToEdit] = useState<SofaOrder | null>(null);

  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [orderToPrint, setOrderToPrint] = useState<SofaOrder | null>(null);

  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);

  // Load orders on start
  const refreshData = () => {
    const loaded = getOrders();
    setOrders(loaded);
    setStats(calculateStats(loaded));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSaveOrder = (savedOrder: SofaOrder) => {
    let updated: SofaOrder[];
    if (orderToEdit) {
      updated = updateOrder(savedOrder);
    } else {
      updated = addOrder(savedOrder);
    }
    setOrders(updated);
    setStats(calculateStats(updated));
    setOrderToEdit(null);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    setStats(calculateStats(updated));
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = deleteOrder(orderId);
    setOrders(updated);
    setStats(calculateStats(updated));
  };

  const handleEditClick = (order: SofaOrder) => {
    setOrderToEdit(order);
    setIsFormOpen(true);
  };

  const handlePrintClick = (order: SofaOrder) => {
    setOrderToPrint(order);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onNewOrder={() => {
          setOrderToEdit(null);
          setIsFormOpen(true);
        }}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            orders={orders}
            onNewOrder={() => {
              setOrderToEdit(null);
              setIsFormOpen(true);
            }}
            onViewOrders={() => setCurrentTab('orders')}
            onSelectOrder={(order) => handlePrintClick(order)}
          />
        )}

        {currentTab === 'kanban' && (
          <KanbanBoard
            orders={orders}
            onStatusChange={handleStatusChange}
            onEditOrder={handleEditClick}
            onDeleteOrder={handleDeleteOrder}
            onPrintOrder={handlePrintClick}
          />
        )}

        {currentTab === 'orders' && (
          <OrderList
            orders={orders}
            onEditOrder={handleEditClick}
            onDeleteOrder={handleDeleteOrder}
            onPrintOrder={handlePrintClick}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Modals */}
      <OrderFormModal
        isOpen={isFormOpen}
        orderToEdit={orderToEdit}
        onClose={() => {
          setIsFormOpen(false);
          setOrderToEdit(null);
        }}
        onSave={handleSaveOrder}
      />

      <InvoicePrintModal
        isOpen={isInvoiceOpen}
        order={orderToPrint}
        onClose={() => {
          setIsInvoiceOpen(false);
          setOrderToPrint(null);
        }}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onReload={refreshData}
      />

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 تطبيق مفروشات وتفصيل كنب بن أحمد — يعمل بتقنية PWA وبدون اتصال بالإنترنت</p>
      </footer>

    </div>
  );
};

export default App;
