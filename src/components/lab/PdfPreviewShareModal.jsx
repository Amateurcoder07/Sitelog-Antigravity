import React from 'react';
import { X, FileText, Download, Share2, ExternalLink, CheckCircle2 } from 'lucide-react';
import Button from '../Button';

export default function PdfPreviewShareModal({ isOpen, onClose, cert, onShareWhatsApp, onShareEmail }) {
  if (!isOpen || !cert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-6 shadow-2xl z-10 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-black dark:text-white">NABL Certificate Document</h2>
              <p className="text-xs text-black/50 dark:text-white/50">{cert.id} — {cert.fileType} ({cert.fileSize})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Simulated PDF Document Viewer */}
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              {cert.nablLabName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {cert.approvalStatus}
            </span>
          </div>

          <h3 className="font-extrabold text-base text-black dark:text-white">{cert.title}</h3>
          
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-black/5 dark:border-white/5 text-black/70 dark:text-white/70">
            <div>
              <span className="text-[10px] text-black/40 dark:text-white/40 block">Linked Sample</span>
              <span className="font-mono font-bold text-black dark:text-white">{cert.sampleId}</span>
            </div>
            <div>
              <span className="text-[10px] text-black/40 dark:text-white/40 block">Date Issued</span>
              <span className="font-bold text-black dark:text-white">{cert.issueDate}</span>
            </div>
          </div>

          {/* Document Preview Box Placeholder */}
          <div className="h-32 bg-white dark:bg-black/50 border border-dashed border-black/20 dark:border-white/20 rounded-xl flex flex-col items-center justify-center text-center p-3">
            <FileText size={32} className="text-orange-500 mb-1" />
            <p className="text-xs font-bold text-black dark:text-white">{cert.title}.pdf</p>
            <p className="text-[10px] text-black/40 dark:text-white/40">Verified NABL Digital Signature Stamp Attached</p>
          </div>
        </div>

        {/* Action Buttons: Download PDF, Share via WhatsApp, Share via Email */}
        <div className="space-y-2.5">
          <Button variant="primary" onClick={() => alert(`Downloading ${cert.title}.pdf`)} className="w-full !py-3 gap-2 min-h-[48px]">
            <Download size={18} /> Download Official PDF
          </Button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onShareWhatsApp(cert)}
              className="w-full min-h-[48px] py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 size={16} /> Share WhatsApp
            </button>

            <button
              onClick={() => onShareEmail(cert)}
              className="w-full min-h-[48px] py-3 px-3 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white font-bold text-xs rounded-xl border border-black/10 dark:border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink size={16} /> Share Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
