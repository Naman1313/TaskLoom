import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Users, MoreHorizontal, Trash2, ArrowRight, X, Clock } from 'lucide-react';

const PROJECT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

export default function ProjectsPage() {
    const { projects, tasks, addProject, deleteProject } = useProjectStore();
    const { teamMembers } = useAuthStore();
    const navigate = useNavigate();
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(PROJECT_COLORS[0]);
    const [deadline, setDeadline] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        addProject({ name, description, color, deadline: deadline || '2026-04-01', members: selectedMembers });
        setName(''); setDescription(''); setColor(PROJECT_COLORS[0]); setDeadline(''); setSelectedMembers([]);
        setShowCreate(false);
    };

    const toggleMember = (id: string) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your team's projects</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.97]">
            <Plus className="w-4 h-4" /> New Project
            </button>
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => {
            const pTasks = tasks.filter((t) => t.projectId === p.id);
            const done = pTasks.filter((t) => t.status === 'done').length;
            const progress = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
            const isOverdue = new Date(p.deadline) < new Date();
            return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 group">
                <div className="h-2" style={{ backgroundColor: p.color }} />
                <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                    <div className="cursor-pointer flex-1" onClick={() => navigate(`/board/${p.id}`)}>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                        {menuOpen === p.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1 z-20">
                            <button onClick={() => { deleteProject(p.id); setMenuOpen(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500 dark:text-slate-400">{progress}% complete</span>
                        <span className="text-slate-500 dark:text-slate-400">{done}/{pTasks.length}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: p.color }} />
                    </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                        {p.members.slice(0, 3).map((mId) => {
                            const m = teamMembers.find((tm) => tm.id === mId);
                            return (
                            <div key={mId} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white dark:border-slate-900">
                                {m?.name?.charAt(0) || '?'}
                            </div>
                            );
                        })}
                        {p.members.length > 3 && <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 text-[10px] font-bold border-2 border-white dark:border-slate-900">+{p.members.length - 3}</div>}
                        </div>
                        <span className="text-xs text-slate-400"><Users className="w-3 h-3 inline" /> {p.members.length}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                        <Clock className="w-3 h-3" /> {p.deadline}
                    </div>
                    </div>

                    {/* Open button */}
                    <button onClick={() => navigate(`/board/${p.id}`)} className="w-full mt-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center gap-1.5 transition-colors">
                    Open Board <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                </motion.div>
            );
            })}
        </div>

        {/* Create Modal */}
        <AnimatePresence>
            {showCreate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Project</h2>
                    <button onClick={() => setShowCreate(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleCreate} className="p-6 space-y-5">
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Marketing Campaign" required className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief project description..." className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none" />
                    </div>
                    <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Color</label>
                        <div className="flex gap-2">
                        {PROJECT_COLORS.map((c) => (
                            <button key={c} type="button" onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: c }} />
                        ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deadline</label>
                        <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm" />
                        </div>
                    </div>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Team Members</label>
                    <div className="flex flex-wrap gap-2">
                        {teamMembers.map((m) => (
                        <button key={m.id} type="button" onClick={() => toggleMember(m.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedMembers.includes(m.id) ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}>
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-[8px] font-bold">{m.name.charAt(0)}</div>
                            {m.name.split(' ')[0]}
                        </button>
                        ))}
                    </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-violet-700 transition-all">Create Project</button>
                    </div>
                </form>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
}
