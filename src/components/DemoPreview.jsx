import React, { useState } from 'react';
import { Search, FileText, FlaskConical, Users } from 'lucide-react';

const tabs = [
  { id: 'attendance', label: 'Attendance', icon: Users },
  { id: 'docs', label: 'Documents & Inventory', icon: FileText },
  { id: 'labs', label: 'Lab Reports', icon: FlaskConical },
];

const attendanceRows = [
  { name: 'Ramesh K.', role: 'Mason', hrs: '8.0', status: 'Present' },
  { name: 'Suresh P.', role: 'Helper', hrs: '7.5', status: 'Present' },
  { name: 'Vinod S.', role: 'Electrician', hrs: '—', status: 'Absent' },
  { name: 'Anil M.', role: 'Mason', hrs: '8.0', status: 'Present' },
];

const docRows = [
  { name: 'Structural_Drawing_R3.pdf', type: 'Drawing', tag: 'Approved' },
  { name: 'Cement_Stock_Ledger.xlsx', type: 'Inventory', tag: 'Updated' },
  { name: 'Site_Safety_Cert.pdf', type: 'Compliance', tag: 'Verified' },
];

const labRows = [
  { name: 'Concrete Cube Test — Batch 14', result: '32.5 MPa', status: 'Pass' },
  { name: 'Soil Bearing Capacity', result: '180 kN/m²', status: 'Pass' },
  { name: 'Steel Tensile Test — Lot B', result: '410 MPa', status: 'Review' },
];

function StatusDot({ status }) {
  const positive = status === 'Present' || status === 'Pass' || status === 'Approved' || status === 'Verified';
  const color = positive
    ? 'bg-emerald-500'
    : status === 'Absent'
    ? 'bg-red-500'
    : 'bg-amber-500';
  return <span className={`w-1.5 h-1.5 rounded-full ${color}`} />;
}

export default function DemoPreview() {
  const [active, setActive] = useState('attendance');

  return (
    <section className="py-20 px-6 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-black dark:text-white mb-3 tracking-tight">
          See it in action
        </h2>
        <p className="text-center text-black/50 dark:text-white/50 text-sm mb-10">
          One platform for everything happening on site
        </p>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-black/10 dark:border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-black/20 dark:bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/20 dark:bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/20 dark:bg-white/20" />
            <span className="ml-3 text-[11px] text-black/40 dark:text-white/40 font-medium">
              terracore.ai/{active}
            </span>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-black/10 dark:border-white/10 px-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70'
                  }`}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 min-h-[240px]">
            {active === 'attendance' && (
              <div>
                <div className="grid grid-cols-4 text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 pb-3 border-b border-black/10 dark:border-white/10">
                  <span>Worker</span><span>Role</span><span>Hours</span><span>Status</span>
                </div>
                {attendanceRows.map((r, idx) => (
                  <div
                    key={r.name}
                    className="grid grid-cols-4 items-center py-3 text-sm text-black/80 dark:text-white/80 border-b border-black/5 dark:border-white/5 last:border-0 opacity-0 animate-row-in"
                    style={{ animationDelay: `${idx * 0.12}s` }}
                  >
                    <span className="font-medium">{r.name}</span>
                    <span>{r.role}</span>
                    <span>{r.hrs}</span>
                    <span className="flex items-center gap-1.5">
                      <StatusDot status={r.status} />
                      <span className={r.status === 'Present' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                        {r.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {active === 'docs' && (
              <div>
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-md border border-black/10 dark:border-white/15 text-black/40 dark:text-white/40">
                  <Search size={14} />
                  <span className="text-xs">Search documents, inventory, permits…</span>
                </div>
                <div className="grid grid-cols-3 text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 pb-3 border-b border-black/10 dark:border-white/10">
                  <span>File</span><span>Type</span><span>Status</span>
                </div>
                {docRows.map((r, idx) => (
                  <div
                    key={r.name}
                    className="grid grid-cols-3 items-center py-3 text-sm text-black/80 dark:text-white/80 border-b border-black/5 dark:border-white/5 last:border-0 opacity-0 animate-row-in"
                    style={{ animationDelay: `${idx * 0.12}s` }}
                  >
                    <span className="font-medium truncate pr-2">{r.name}</span>
                    <span>{r.type}</span>
                    <span className="flex items-center gap-1.5">
                      <StatusDot status={r.tag} />
                      <span className="text-emerald-600 dark:text-emerald-400">{r.tag}</span>
                    </span>
                  </div>
                ))}
                <p className="mt-3 text-[11px] text-black/40 dark:text-white/40">Only authorized roles can search and open these files.</p>
              </div>
            )}

            {active === 'labs' && (
              <div>
                <div className="grid grid-cols-3 text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 pb-3 border-b border-black/10 dark:border-white/10">
                  <span>Test</span><span>Result</span><span>Status</span>
                </div>
                {labRows.map((r, idx) => (
                  <div
                    key={r.name}
                    className="grid grid-cols-3 items-center py-3 text-sm text-black/80 dark:text-white/80 border-b border-black/5 dark:border-white/5 last:border-0 opacity-0 animate-row-in"
                    style={{ animationDelay: `${idx * 0.12}s` }}
                  >
                    <span className="font-medium">{r.name}</span>
                    <span>{r.result}</span>
                    <span className="flex items-center gap-1.5">
                      <StatusDot status={r.status} />
                      <span className={r.status === 'Pass' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                        {r.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}