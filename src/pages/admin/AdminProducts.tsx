import React, { useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, AlertTriangle, CheckCircle2, Battery,
  ShieldAlert, Tag, Hash, TrendingUp, Sparkles, Filter
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Product, StockStatus } from '@/types';
import { formatNGN } from '@/data/products';
import ProductUploadModal from '@/components/components/admin/ProductUploadModal';

export default function AdminProductsPage() {
  const { products, deleteProduct, toggleStockStatus, updateProduct } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');

  const handleOpenNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      (p.serialNumber && p.serialNumber.toLowerCase().includes(q));

    const matchesStock =
      selectedStock === 'all'
        ? true
        : selectedStock === 'available'
        ? p.stockStatus === 'available' || (p.stockStatus === undefined && p.inStock)
        : selectedStock === 'sold'
        ? p.stockStatus === 'sold'
        : selectedStock === 'low_stock'
        ? (p.stockQuantity !== undefined && p.stockQuantity <= 2 && p.stockQuantity > 0)
        : p.stockStatus === selectedStock;

    const matchesCondition = selectedCondition === 'all' ? true : p.condition === selectedCondition;

    return matchesSearch && matchesStock && matchesCondition;
  });

  // Inventory stats
  const lowStockCount = products.filter(
    (p) => (p.stockQuantity !== undefined && p.stockQuantity <= 2 && p.stockQuantity > 0) || p.id.includes('macbook')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inventory &amp; Device Serials</h1>
            {lowStockCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> {lowStockCount} Low Stock
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage device pricing, IMEI/serial number tracking, battery health %, cosmetic gradings, and profit margins.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Upload New Gadget
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by device name, category, IMEI, or serial..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl whitespace-nowrap">
            {[
              { label: 'All Devices', value: 'all' },
              { label: 'In Stock', value: 'available' },
              { label: 'Low Stock (<3)', value: 'low_stock' },
              { label: 'Sold Out', value: 'sold' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedStock(tab.value)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  selectedStock === tab.value
                    ? 'bg-white text-[#7c3aed] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-3 py-2 text-xs focus:outline-none"
          >
            <option value="all">All Conditions</option>
            <option value="brand_new">Brand New (Sealed)</option>
            <option value="london_used">London / UK Used</option>
            <option value="nigerian_used">Nigerian Used</option>
            <option value="refurbished">Certified Refurbished</option>
            <option value="open_box">Open Box</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Device &amp; Serial/IMEI</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Condition &amp; Health</th>
                <th className="py-3.5 px-4">Selling Price &amp; Margin</th>
                <th className="py-3.5 px-4">Stock Qty</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No gadgets match your current filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isSold = product.stockStatus === 'sold';
                  const isAvailable = product.stockStatus === 'available' || (!product.stockStatus && product.inStock);
                  const qty = product.stockQuantity !== undefined ? product.stockQuantity : product.id.includes('macbook') ? 2 : 6;
                  const isLowStock = qty <= 2 && qty > 0;

                  // Estimated or recorded cost price
                  const cost = product.costPrice || Math.round(product.price * 0.85);
                  const marginAmount = product.price - cost;
                  const marginPercent = Math.round((marginAmount / product.price) * 100);

                  // Simulated or assigned serial
                  const serial = product.serialNumber || `SN: GS-${product.id.slice(-4).toUpperCase()}-9481`;
                  const battery = product.batteryHealth || (product.category === 'Smartphones' ? 94 : undefined);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <img src={product.image} alt={product.name} className="object-contain w-full h-full p-1" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{product.name}</div>
                            <div className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60 inline-block mt-0.5">
                              {serial}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{product.category}</span>
                        {product.subCategory && (
                          <div className="text-[10px] text-slate-400">{product.subCategory}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {product.condition?.replace(/_/g, ' ').toUpperCase() || 'BRAND NEW'}
                          </span>
                          {battery && (
                            <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <Battery className="w-3 h-3 text-emerald-600" /> {battery}% Battery
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900">{formatNGN(product.price)}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> Margin: +{formatNGN(marginAmount)} ({marginPercent}%)
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{qty} units</span>
                          {isLowStock && (
                            <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-1.5 py-0.5 rounded">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleStockStatus(product.id, isSold ? 'available' : 'sold')}
                          className="cursor-pointer"
                          title="Click to toggle status"
                        >
                          {isSold ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Sold Out
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              In Stock
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-slate-500 hover:text-[#7c3aed] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Device"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
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

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border p-1 shrink-0 overflow-hidden flex items-center justify-center">
                <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 text-sm truncate">{product.name}</div>
                <div className="font-black text-slate-900">{formatNGN(product.price)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="font-mono text-purple-700 text-[10px]">
                {product.serialNumber || `SN: GS-${product.id.slice(-4).toUpperCase()}`}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="px-3 py-1 bg-purple-50 text-[#7c3aed] rounded-lg font-bold text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productToEdit={editingProduct}
      />
    </div>
  );
}
