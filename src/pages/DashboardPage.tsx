import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { 
    BarChart3, 
    CheckCircle2, 
    Clock, 
    Users, 
    TrendingUp, 
    AlertTriangle, 
    FolderKanban, 
    ArrowUpRight,
    MoreHorizontal,
    Search
    } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';

    const activityIcons: Record<string, string> = {
    task_created: '📝',
    task_completed: '✅',
    task_moved: '🔄',
    project_created: '🚀',
    member_joined: '👋',
    badge_earned: '🏆',
    };

    export default function DashboardPage() {
    const { projects, tasks, activities } = useProjectStore();
    const { user, teamMembers } = useAuthStore();
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState('');

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const overdueTasks = tasks.filter((t) => t.status !== 'done' && new Date(t.deadline) < new Date()).length;

    const filteredProjects = projects.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMembers = teamMembers.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { 
        label: 'Total Projects', 
        value: projects.length, 
        icon: FolderKanban, 
        color: 'text-blue-600 dark:text-blue-400', 
        gradient: 'from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' 
        },
        { 
        label: 'Tasks Done', 
        value: completedTasks, 
        icon: CheckCircle2, 
        color: 'text-emerald-600 dark:text-emerald-400', 
        gradient: 'from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' 
        },
        { 
        label: 'In Progress', 
        value: inProgress, 
        icon: TrendingUp, 
        color: 'text-violet-600 dark:text-violet-400', 
        gradient: 'from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400',
        bg: 'bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-500/20' 
        },
        { 
        label: 'Overdue', 
        value: overdueTasks, 
        icon: AlertTriangle, 
        color: 'text-rose-600 dark:text-rose-400', 
        gradient: 'from-rose-600 to-orange-500 dark:from-rose-400 dark:to-orange-400',
        bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' 
        },
    ];

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Here's your daily productivity overview.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* SEARCH FIELD */}
            <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                type="text" 
                placeholder="Search projects or team..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 focus:border-blue-500/50 transition-all shadow-sm"
                />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700 shadow-sm whitespace-nowrap">
                Export Report
                </button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap">
                + Project
                </button>
            </div>
            </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
            <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                className={`relative overflow-hidden rounded-2xl p-6 border ${s.bg} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/40`}
            >
                <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{s.label}</p>
                    <h3 className={`text-3xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r ${s.gradient}`}>
                    {s.value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl bg-white dark:bg-slate-950/30 shadow-sm border border-slate-100 dark:border-white/5 ${s.color}`}>
                    <s.icon className="w-6 h-6" />
                </div>
                </div>
                <div className={`hidden dark:block absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-2xl bg-gradient-to-r ${s.gradient}`} />
            </motion.div>
            ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* MAIN COLUMN: PROJECTS */}
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Active Projects
                </h2>
                <button 
                    onClick={() => navigate('/projects')} 
                    className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                >
                    View All <ArrowUpRight className="w-4 h-4" />
                </button>
                </div>

                <div className="space-y-4">
                {/* 4. Use filteredProjects instead of projects */}
                {filteredProjects.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No projects found matching "{searchQuery}"</p>
                ) : (
                    filteredProjects.map((p, idx) => {
                    const pTasks = tasks.filter((t) => t.projectId === p.id);
                    const done = pTasks.filter((t) => t.status === 'done').length;
                    const progress = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
                    
                    return (
                        <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        onClick={() => navigate(`/board/${p.id}`)}
                        className="group cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md dark:hover:shadow-none transition-all"
                        >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                            <div 
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm" 
                                style={{ backgroundColor: `${p.color}20`, color: p.color }}
                            >
                                {p.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Due {p.deadline}
                                </p>
                            </div>
                            </div>
                            <div className="text-right">
                            <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">{progress}%</span>
                            </div>
                        </div>

                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${progress}%` }} 
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full relative"
                            style={{ backgroundColor: p.color }}
                            >
                            <div className="absolute inset-0 bg-white/20" />
                            </motion.div>
                        </div>
                        
                        <div className="flex justify-between mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span>{done} completed</span>
                            <span>{pTasks.length - done} remaining</span>
                        </div>
                        </motion.div>
                    );
                    })
                )}
                </div>
            </div>

            {/* TEAM MEMBERS SECTION */}
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-none">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> 
                </div>
                Team Members
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* 5. Use filteredMembers instead of teamMembers */}
                {filteredMembers.slice(0, 5).map((m) => (
                    <motion.button 
                    key={m.id} 
                    whileHover={{ y: -3 }} 
                    onClick={() => navigate(`/profile/${m.id}`)}
                    className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md dark:hover:shadow-none transition-all group relative overflow-hidden"
                    >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative mb-3">
                        <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500/50 transition-colors shadow-sm">
                        {m.name.charAt(0)}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                        m.availability === 'available' ? 'bg-emerald-500' : 
                        m.availability === 'busy' ? 'bg-rose-500' : 
                        'bg-amber-500'
                        }`} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate w-full text-center">{m.name.split(' ')[0]}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate w-full text-center">{m.role}</p>
                    </motion.button>
                ))}
                
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                        <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">Add Member</span>
                </button>
                </div>
            </div>
            </div>

            {/* SIDEBAR COLUMN: ACTIVITY */}
            <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 h-full sticky top-6 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-violet-600 dark:text-violet-400" /> 
                    </div>
                    Activity
                </h2>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
                </div>

                <div className="space-y-6 relative">
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                {activities.slice(0, 8).map((a, i) => (
                    <div key={a.id} className="flex gap-4 relative z-10 group">
                    <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-sm group-hover:border-blue-400 group-hover:scale-110 transition-all">
                        {activityIcons[a.type] || '📌'}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                        <span className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">{a.userName}</span> 
                        <span className="mx-1 text-slate-400 dark:text-slate-500">{a.description}</span>
                        </p>
                        {a.projectName && (
                        <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 text-[10px] font-medium text-blue-600 dark:text-blue-300">
                            {a.projectName}
                        </div>
                        )}
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1 font-medium uppercase tracking-wide">{formatTime(a.timestamp)}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>

        </div>
        </div>
    );
}