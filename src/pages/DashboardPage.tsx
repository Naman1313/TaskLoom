import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock, Users, TrendingUp, AlertTriangle, FolderKanban, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const activityIcons: Record<string, string> = {
    task_created: '📝',
    task_completed: '✅',
    task_moved: '🔄',
    project_created: '📁',
    member_joined: '👋',
    badge_earned: '🏆',
    };

    export default function DashboardPage() {
    const { projects, tasks, activities } = useProjectStore();
    const { user, teamMembers } = useAuthStore();
    const navigate = useNavigate();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const overdueTasks = tasks.filter((t) => t.status !== 'done' && new Date(t.deadline) < new Date()).length;

    const stats = [
        { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Tasks Completed', value: completedTasks, icon: CheckCircle2, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-500/10' },
        { label: 'In Progress', value: inProgress, icon: TrendingUp, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 dark:bg-violet-500/10' },
        { label: 'Overdue', value: overdueTasks, icon: AlertTriangle, color: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-500/10' },
    ];

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Welcome */}
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 group">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 bg-gradient-to-r ${s.color} bg-clip-text`} style={{ color: s.color.includes('blue') ? '#3b82f6' : s.color.includes('green') ? '#10b981' : s.color.includes('violet') ? '#8b5cf6' : '#ef4444' }} />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
            </motion.div>
            ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            {/* Project Progress */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Project Progress
                </h2>
                <button onClick={() => navigate('/projects')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">View all <ArrowUpRight className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-5">
                {projects.map((p) => {
                const pTasks = tasks.filter((t) => t.projectId === p.id);
                const done = pTasks.filter((t) => t.status === 'done').length;
                const progress = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
                return (
                    <div key={p.id} className="group cursor-pointer" onClick={() => navigate(`/board/${p.id}`)}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{done}/{pTasks.length} tasks</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: p.color }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-slate-400">{progress}% complete</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Due {p.deadline}</span>
                    </div>
                    </div>
                );
                })}
            </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-500" /> Recent Activity
            </h2>
            <div className="space-y-4">
                {activities.slice(0, 8).map((a) => (
                <div key={a.id} className="flex gap-3">
                    <div className="mt-0.5 text-base">{activityIcons[a.type] || '📌'}</div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-medium text-slate-900 dark:text-white">{a.userName}</span> {a.description}
                    </p>
                    {a.projectName && <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{a.projectName}</p>}
                    <p className="text-xs text-slate-400 mt-0.5">{formatTime(a.timestamp)}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Team Members */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" /> Team Members
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teamMembers.slice(0, 5).map((m) => (
                <motion.button key={m.id} whileHover={{ y: -2 }} onClick={() => navigate(`/profile/${m.id}`)}
                className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center group">
                <div className="relative mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {m.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${m.availability === 'available' ? 'bg-green-500' : m.availability === 'busy' ? 'bg-red-500' : m.availability === 'away' ? 'bg-yellow-500' : 'bg-slate-400'} rounded-full border-2 border-white dark:border-slate-900`} />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate w-full">{m.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-full">{m.role}</p>
                </motion.button>
            ))}
            </div>
        </div>
        </div>
    );
}
