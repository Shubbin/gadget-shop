import React, { useState } from 'react';
import {
  Search, Wrench, Phone, X, CheckCircle2, Clock, AlertCircle, RefreshCw,
  Cpu, Battery, ShieldCheck, DollarSign, UserCheck, MessageCircle, ChevronRight
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { ServiceRequest } from '@/types';
import { formatNGN } from '@/data/products';

export default function AdminServicesPage() {
  const { services, updateServiceStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Quote & Stage Edit modal
  const [editingModal, setEditingModal] = useState<ServiceRequest | null>(null);
  const [editQuote, setEditQuote] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<ServiceRequest['status']>('pending');
  const [editStage, setEditStage] = useState<ServiceRequest['stage']>('diagnostic');
  const [editNotes, setEditNotes] = useState('');

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.customerName?.toLowerCase().includes(q) ||
      s.deviceModel?.toLowerCase().includes(q) ||
      s.customerPhone?.toLowerCase().includes(q);
    const matchType = selectedType === 'all' ? true : s.type === selectedType;
    return matchSearch && matchType;
  });

  const handleOpenEdit = (req: ServiceRequest) => {
    setEditingModal(req);
    setEditQuote(req.estimatedQuote || 0);
    setEditStatus(req.status);
    setEditStage(req.stage || 'diagnostic');
    setEditNotes(req.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModal) return;
    updateServiceStatus(editingModal.id, editStatus, editQuote, editNotes, editStage);
    setEditingModal(null);
  };

  const STAGE_LABELS: Record<string, string> = {
    received: '1. Device Received',
    diagnostic: '2. Diagnostic Inspection',
    parts_wait: '3. Awaiting Genuine Parts',
    bench_work: '4. Technician Bench Work',
    quality_tested: '5. Quality Assurance Tested',
    ready_for_pickup: '6. Ready for Customer Dispatch',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Technical Services &amp; Swap Valuation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage device hardware diagnostics, technician work orders, trade-in valuations, and repair stages.
          </p>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
          {services.length} Active Tickets
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by customer, device model, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { label: 'All Requests', value: 'all' },
            { label: 'Device Repairs', value: 'repair' },
            { label: 'Trade-in Swaps', value: 'swap' },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === t.value ? 'bg-[#7c3aed] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Tickets Grid */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const isSwap = req.type === 'swap';
          const checks = req.diagnosticChecks;

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-purple-200 transition-all shadow-sm"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSwap ? 'bg-purple-50 text-[#7c3aed]' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {isSwap ? <RefreshCw className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{req.deviceModel}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isSwap
                            ? 'bg-purple-50 text-[#7c3aed] border border-purple-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Ticket ID: {req.id} &middot; {req.createdAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {req.estimatedQuote ? (
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {isSwap ? 'Trade-in Valuation' : 'Approved Quote'}
                      </div>
                      <div className="text-sm font-black text-slate-900">{formatNGN(req.estimatedQuote)}</div>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      Needs Quote
                    </span>
                  )}
                </div>
              </div>

              {/* Customer & Issue Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">{req.customerName}</div>
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.customerPhone}</span>
                  </div>
                  <div className="text-slate-500">Pickup/Intake: <span className="font-semibold capitalize text-slate-700">{req.serviceMethod || 'Doorstep'}</span></div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 font-semibold">{isSwap ? 'Customer Device Condition:' : 'Reported Defect:'}</div>
                  <div className="text-slate-800 leading-relaxed font-medium">
                    {req.issueDescription || req.deviceCondition || 'General physical maintenance'}
                  </div>
                  {req.desiredGadget && (
                    <div className="text-[#7c3aed] font-bold text-[11px] pt-1">
                      Target Upgrade: {req.desiredGadget}
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnostic Checklist & Hardware Inspection */}
              {checks && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Hardware Diagnostic Telemetry
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
                        checks.screenWorking ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {checks.screenWorking ? '✓ Screen OK' : '✗ Display Faulty'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
                        checks.batteryHealth >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <Battery className="w-3 h-3" /> {checks.batteryHealth}% Battery Health
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-slate-100 text-slate-700">
                      Biometrics: {checks.faceIdOrFingerprint ? 'Pass' : 'Fail'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-slate-100 text-slate-700">
                      Housing: {checks.housingCondition}
                    </span>
                  </div>
                </div>
              )}

              {/* Work Order Stage & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Stage:</span>
                  <span className="text-xs font-bold text-[#7c3aed] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {STAGE_LABELS[req.stage || 'diagnostic'] || 'In Progress'}
                  </span>
                  {req.technicianAssigned && (
                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                      &middot; {req.technicianAssigned}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(req)}
                    className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Update Ticket &amp; Quote
                  </button>
                  <a
                    href={`https://wa.me/${(req.customerPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${req.customerName}, this is GadgetShop Technical Support regarding your ${req.deviceModel} (Ticket #${req.id}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                    title="WhatsApp Customer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Service Ticket Modal */}
      {editingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Update Service Ticket — {editingModal.id}</h3>
              <button onClick={() => setEditingModal(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {editingModal.type === 'swap' ? 'Trade-in Valuation Offer (₦)' : 'Service Quote (₦)'}
                </label>
                <input
                  type="number"
                  required
                  value={editQuote}
                  onChange={(e) => setEditQuote(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Order Stage</label>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value="received">1. Device Received</option>
                  <option value="diagnostic">2. Diagnostic Inspection</option>
                  <option value="parts_wait">3. Awaiting Genuine Parts</option>
                  <option value="bench_work">4. Technician Bench Work</option>
                  <option value="quality_tested">5. Quality Assurance Tested</option>
                  <option value="ready_for_pickup">6. Ready for Customer Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ticket Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value="pending">Pending</option>
                  <option value="quoted">Quoted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed &amp; Dispatched</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technician / Inspection Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes on replacement parts, battery cycle, or customer acceptance..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
