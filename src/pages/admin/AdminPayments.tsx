import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard, Search, Filter, CheckCircle2, Clock, XCircle, AlertCircle,
  ArrowUpRight, ArrowDownRight, RefreshCw, Eye, Download, ShieldCheck,
  Building2, Receipt, DollarSign, ChevronRight, X, ExternalLink
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { PaymentRecord, PaymentStatus } from '@/types';
import { formatNGN } from '@/data/products';

export default function AdminPaymentsPage() {
  const { payments, verifyPayment, refundPayment } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string>('');

  // Financial Computations
  const successfulPayments = payments.filter((p) => p.status === 'successful');
  const pendingPayments = payments.filter((p) => p.status === 'pending_verification');
  const refundedPayments = payments.filter((p) => p.status === 'refunded');

  const grossVolume = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalFees = successfulPayments.reduce((sum, p) => sum + p.fee, 0);
  const netSettled = grossVolume - totalFees;
  const pendingVolume = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  // Filtered List
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || p.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const handleOpenVerify = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowVerifyModal(true);
  };

  const handleConfirmVerification = (status: 'successful' | 'failed') => {
    if (!selectedPayment) return;
    verifyPayment(selectedPayment.id, status);
    setShowVerifyModal(false);
    setActionSuccessMessage(
      status === 'successful'
        ? `Payment ${selectedPayment.transactionRef} marked as verified & order updated to Processing.`
        : `Payment ${selectedPayment.transactionRef} flagged as unverified.`
    );
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleOpenRefund = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setRefundAmount(payment.amount);
    setRefundReason('Customer return / order cancelled');
    setShowRefundModal(true);
  };

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    refundPayment(selectedPayment.id, refundAmount, refundReason);
    setShowRefundModal(false);
    setActionSuccessMessage(`Refund of ${formatNGN(refundAmount)} recorded for ${selectedPayment.transactionRef}.`);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Tracker &amp; Ledger</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#7c3aed] border border-purple-200">
              <ShieldCheck className="w-3 h-3 text-[#7c3aed]" /> Automated Reconciliation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of online card gateways, direct bank transfer verification, POS terminals, and payout settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csv = payments.map(p => `${p.transactionRef},${p.orderId},${p.customerName},${p.amount},${p.status}`).join('\n');
              const blob = new Blob([`Ref,Order,Customer,Amount,Status\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `GadgetShop-Payments-${new Date().toISOString().slice(0,10)}.csv`;
              a.click();
            }}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export Ledger CSV
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Inflow</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{formatNGN(grossVolume)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{successfulPayments.length} transactions cleared</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Available Payout</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{formatNGN(netSettled)}</div>
          <div className="text-[11px] text-slate-500 font-medium">Minus {formatNGN(totalFees)} gateway fees</div>
        </div>

        <div className={`rounded-2xl border p-5 space-y-2 ${pendingPayments.length > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Bank Transfers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              {pendingPayments.length}
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 tracking-tight">{formatNGN(pendingVolume)}</div>
          <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Requires manual bank credit verification
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Refunds &amp; Disputed</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{refundedPayments.length} Records</div>
          <div className="text-[11px] text-slate-500 font-medium">Order adjustments &amp; returns</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Transaction Ref, Order ID, Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
            >
              <option value="all">All Channels</option>
              <option value="Paystack / Card">Paystack / Card</option>
              <option value="Direct Bank Transfer">Direct Bank Transfer</option>
              <option value="POS on Delivery">POS on Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Reference / Order</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Channel / Gateway</th>
                <th className="px-5 py-3.5">Amount (NGN)</th>
                <th className="px-5 py-3.5">Date &amp; Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const isPending = payment.status === 'pending_verification';
                  const isSuccess = payment.status === 'successful';
                  const isRefunded = payment.status === 'refunded';

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 font-mono">{payment.transactionRef}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span>Order:</span>
                          <Link to="/admin/orders" className="text-[#7c3aed] hover:underline font-mono font-semibold">
                            {payment.orderId}
                          </Link>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{payment.customerName}</div>
                        <div className="text-[11px] text-slate-400">{payment.customerEmail}</div>
                        {payment.customerPhone && <div className="text-[10px] text-slate-500 font-mono">{payment.customerPhone}</div>}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {payment.channel === 'Direct Bank Transfer' ? (
                            <Building2 className="w-3.5 h-3.5 text-[#7c3aed]" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          {payment.channel}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-black text-slate-900 text-sm">{formatNGN(payment.amount)}</div>
                        {payment.fee > 0 && (
                          <div className="text-[10px] text-slate-400">Net: {formatNGN(payment.net)}</div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-slate-800">{payment.date}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{payment.time}</div>
                      </td>

                      <td className="px-5 py-4">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" /> Verify Transfer
                          </span>
                        )}
                        {isRefunded && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" /> Refunded
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isPending ? (
                          <button
                            onClick={() => handleOpenVerify(payment)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" /> Review Receipt
                          </button>
                        ) : isSuccess ? (
                          <button
                            onClick={() => handleOpenRefund(payment)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Refund
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Receipt Verification Modal */}
      {showVerifyModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Verify Customer Bank Transfer</h3>
                  <p className="text-[11px] text-slate-500">Ref: {selectedPayment.transactionRef}</p>
                </div>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount to Confirm:</span>
                  <span className="font-black text-slate-900 text-sm">{formatNGN(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Linked Order:</span>
                  <span className="font-mono font-bold text-[#7c3aed]">{selectedPayment.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold text-slate-800">{selectedPayment.customerName}</span>
                </div>
                {selectedPayment.transferDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sender Bank:</span>
                      <span className="font-medium text-slate-700">{selectedPayment.transferDetails.senderBank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sender Account Name:</span>
                      <span className="font-semibold text-slate-800">{selectedPayment.transferDetails.senderAccountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Destination Account:</span>
                      <span className="font-medium text-slate-700">{selectedPayment.transferDetails.receivingBank}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Transfer Proof Preview Card */}
              <div className="p-3.5 border border-dashed border-purple-200 rounded-xl bg-purple-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#7c3aed] flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" /> Customer Proof of Payment
                  </span>
                  <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded font-bold">Uploaded</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  &ldquo;{selectedPayment.notes || 'Customer uploaded mobile banking debit alert receipt via checkout.'}&rdquo;
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center text-slate-500 text-[11px]">
                  📸 Bank Screenshot: <span className="font-mono text-slate-800">NIP/GTB/{selectedPayment.transactionRef.slice(-6)}</span> confirmed via mobile app
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleConfirmVerification('failed')}
                className="px-4 py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reject / Not Credited
              </button>
              <button
                onClick={() => handleConfirmVerification('successful')}
                className="px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm &amp; Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Process Financial Refund</h3>
              <button onClick={() => setShowRefundModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRefund} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Transaction</label>
                <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-slate-800 border border-slate-200">
                  {selectedPayment.transactionRef} ({formatNGN(selectedPayment.amount)})
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Refund Amount (NGN)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  max={selectedPayment.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Reason for Refund</label>
                <textarea
                  required
                  rows={2}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  placeholder="e.g., Customer cancelled before dispatch, device exchange difference..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
                >
                  Confirm Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
