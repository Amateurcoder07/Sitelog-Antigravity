import React, { useState } from 'react';
import { X, QrCode, Camera, CheckCircle2, RefreshCw } from 'lucide-react';
import Button from '../Button';

export default function QrScanModal({ isOpen, onClose, onScanned }) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedSample, setScannedSample] = useState(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const mockResult = {
        id: 'TS-2026-005',
        sampleName: 'M25 Ready Mix Concrete',
        structureLocation: 'Staircase Tower A',
        targetStrength: '16.5 N/mm²',
        status: 'Due Today'
      };
      setScannedSample(mockResult);
    }, 1200);
  };

  const handleConfirm = () => {
    if (scannedSample) {
      onScanned(scannedSample);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-6 shadow-2xl z-10 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <QrCode size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-black dark:text-white">Scan Sample Barcode / QR</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Point camera at site cube barcode tag</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Camera Viewfinder Container */}
        <div className="relative aspect-square w-full bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-orange-500/50 mb-5">
          {/* Animated Laser Scanning Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_15px_#f97316] animate-pulse top-1/2 -translate-y-1/2" />
          
          <div className="z-10 text-center p-6 space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-orange-400 animate-pulse">
              <Camera size={32} />
            </div>
            {isScanning ? (
              <p className="text-xs text-white/80 font-medium animate-pulse">Align QR code within frame...</p>
            ) : (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} /> Barcode Scanned Successfully!
              </div>
            )}
          </div>
        </div>

        {scannedSample && !isScanning && (
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3.5 rounded-xl space-y-1 mb-4 text-xs">
            <p className="font-bold text-black dark:text-white">{scannedSample.id} — {scannedSample.sampleName}</p>
            <p className="text-black/60 dark:text-white/60">Location: {scannedSample.structureLocation}</p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold">Status: 7-Day Strength Test Due Today</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={handleSimulateScan} className="!py-3 flex-1 gap-2 text-xs">
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            Rescan Barcode
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!scannedSample} className="!py-3 flex-1 text-xs">
            Open Sample Record
          </Button>
        </div>
      </div>
    </div>
  );
}
