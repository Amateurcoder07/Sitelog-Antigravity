import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Layers, ShieldAlert, FileText, Leaf, FolderOpen } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const sections = [
  { name: 'Labour', path: 'labour', icon: Users, desc: 'Attendance, hours and wages.' },
  { name: 'Materials', path: 'materials', icon: Layers, desc: 'Orders, deliveries and waste.' },
  { name: 'Document Inventory', path: 'documents-inventory', icon: FolderOpen, desc: 'Drawings, lab reports and certs.' },
  { name: 'Safety', path: 'safety', icon: ShieldAlert, desc: 'Incidents and briefings.' },
  { name: 'Compliance', path: 'compliance', icon: FileText, desc: 'BOCW and cess tracking.' },
  { name: 'Carbon & Waste', path: 'carbon-waste', icon: Leaf, desc: 'Waste and carbon reports.' },
];

export default function ProjectOverview() {
  const { projectId } = useParams();
  const { projects } = useProject();
  const project = projects.find((p) => p._id === projectId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">{project?.name || 'Project'}</h1>
        <p className="text-black/50 dark:text-white/50 text-sm mt-1">
          {project?.address || 'No address listed'} • {project?.members?.length || 0} member{project?.members?.length === 1 ? '' : 's'}
        </p>
        <p className="text-black/40 dark:text-white/40 text-xs mt-1">
          Project ID: <span className="font-mono font-semibold text-black/60 dark:text-white/60">{project?.projectCode}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.name}
              to={s.path}
              className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5 hover:border-black/30 dark:hover:border-white/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black mb-4">
                <Icon size={17} />
              </div>
              <h3 className="text-black dark:text-white font-semibold text-sm mb-1">{s.name}</h3>
              <p className="text-black/40 dark:text-white/40 text-xs">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}