import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Clock, Briefcase, Calendar, ArrowLeft, ChevronDown, Check, Flame, Star, Target, Zap, Trophy, Shield } from 'lucide-react';
import { useState } from 'react';
import type { AvailabilityStatus } from '../types';

const statusColors: Record<AvailabilityStatus, string> = {
    available: 'bg-green-500',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
    offline: 'bg-slate-400',
    };
    const statusLabels: Record<AvailabilityStatus, string> = {
    available: 'Available',
    busy: 'Busy',
    away: 'Away',
    offline: 'Offline',
    };
    const statusBg: Record<AvailabilityStatus, string> = {
    available: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    busy: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    away: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
    offline: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
    };

    const badgeIcons: Record<string, typeof Star> = {
    'Early Bird': Zap,
    'Team Player': Shield,
    'Streak Master': Flame,
    'Perfectionist': Target,
    };

    export default function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { user, teamMembers, updateAvailability } = useAuthStore();
    const { tasks, projects } = useProjectStore();
    const [statusOpen, setStatusOpen] = useState(false);

    const member = userId ? teamMembers.find((m) => m.id === userId) : user;
    const isOwnProfile = !userId || member?.id === user?.id;

    if (!member) {
        return (
        <div className="p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">Member not found.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
        </div>
        );
    }

    const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
    const completedTasks = memberTasks.filter((t) => t.status === 'done');
    const activeTasks = memberTasks.filter((t) => t.status !== 'done');
    const memberProjects = projects.filter((p) => p.members.includes(member.id));
    const onTimeRate = completedTasks.length > 0 ? Math.round((completedTasks.filter((t) => new Date(t.deadline) >= new Date(t.createdAt)).length / completedTasks.length) * 100) : 100;

    const profileStats = [
        { label: 'Tasks Done', value: member.completedTasks + completedTasks.length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
        { label: 'Active Tasks', value: activeTasks.length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Projects', value: memberProjects.length, icon: Briefcase, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
        { label: 'On-Time Rate', value: `${onTimeRate}%`, icon: Target, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {userId && (
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
            </button>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 relative">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            </div>
            </div>
            <div className="px-6 pb-6 -mt-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-white dark:border-slate-900 shadow-xl">
                    {member.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusColors[member.availability]} rounded-full border-3 border-white dark:border-slate-900`} />
                </div>
                <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{member.name}</h1>
                <p className="text-slate-500 dark:text-slate-400">{member.role}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {member.joinedAt}</p>
                </div>
                <div className="flex items-center gap-3">
                {isOwnProfile ? (
                    <div className="relative">
                    <button onClick={() => setStatusOpen(!statusOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${statusBg[member.availability]}`}>
                        <div className={`w-2 h-2 rounded-full ${statusColors[member.availability]}`} />
                        {statusLabels[member.availability]}
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {statusOpen && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1 z-20">
                        {(Object.keys(statusLabels) as AvailabilityStatus[]).map((s) => (
                            <button key={s} onClick={() => { updateAvailability(s); setStatusOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                            <div className={`w-2 h-2 rounded-full ${statusColors[s]}`} />
                            {statusLabels[s]}
                            {member.availability === s && <Check className="w-3.5 h-3.5 ml-auto text-blue-500" />}
                            </button>
                        ))}
                        </div>
                    )}
                    </div>
                ) : (
                    <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${statusBg[member.availability]}`}>
                    <div className={`w-2 h-2 rounded-full ${statusColors[member.availability]}`} />
                    {statusLabels[member.availability]}
                    </span>
                )}
                </div>
            </div>
            {member.bio && <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">{member.bio}</p>}
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {profileStats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2.5`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </motion.div>
            ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
            {/* Badges */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                <Trophy className="w-5 h-5 text-amber-500" /> Achievements & Badges
            </h2>
            {member.badges.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No badges yet. Complete tasks to earn badges!</p>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                {member.badges.map((badge, i) => {
                    const BadgeIcon = badgeIcons[badge.name] || Award;
                    return (
                    <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 hover:shadow-lg transition-all group overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20" style={{ backgroundColor: badge.color }} />
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5" style={{ backgroundColor: badge.color + '15' }}>
                        <BadgeIcon className="w-5 h-5" style={{ color: badge.color }} />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{badge.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{badge.description}</p>
                        <p className="text-[10px] text-slate-400 mt-2">Earned {badge.earnedAt}</p>
                    </motion.div>
                    );
                })}
                </div>
            )}
            </div>

            {/* Completed Tasks */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Completed Tasks
            </h2>
            {completedTasks.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No completed tasks yet</p>
            ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {completedTasks.map((t) => {
                    const proj = projects.find((p) => p.id === t.projectId);
                    return (
                    <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{t.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {proj && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: proj.color + '15', color: proj.color }}>{proj.name}</span>}
                            <span className="text-xs text-slate-400">{t.deadline}</span>
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
            </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <Briefcase className="w-5 h-5 text-violet-500" /> Active Projects
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberProjects.map((p) => {
                const pTasks = tasks.filter((t) => t.projectId === p.id);
                const done = pTasks.filter((t) => t.status === 'done').length;
                const progress = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
                return (
                <button key={p.id} onClick={() => navigate(`/board/${p.id}`)}
                    className="text-left p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</h3>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: p.color }} />
                    </div>
                    <p className="text-xs text-slate-400">{progress}% • {done}/{pTasks.length} tasks</p>
                </button>
                );
            })}
            </div>
        </div>
        </div>
    );
}
