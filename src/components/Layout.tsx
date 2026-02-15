import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FolderKanban, Columns3, UserCircle, Sun, Moon, Bell,
    LogOut, Menu, X, ChevronDown, Check
    } from 'lucide-react';
    import type { AvailabilityStatus } from '../types';

    const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/board/p1', icon: Columns3, label: 'Board' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
    ];

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

    export default function Layout() {
    const { isDark, toggle } = useThemeStore();
    const { user, logout, updateAvailability } = useAuthStore();
    const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useProjectStore();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };
    const unread = unreadCount();

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Mobile overlay */}
        <AnimatePresence>
            {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">TaskLoom</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400">
                <X className="w-5 h-5" />
            </button>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`
                }>
                <Icon className="w-[18px] h-[18px]" />
                {label}
                </NavLink>
            ))}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[user?.availability || 'offline']} rounded-full border-2 border-white dark:border-slate-900`} />
                </div>
                <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="relative flex-1">
                <button onClick={() => setStatusOpen(!statusOpen)} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${statusColors[user?.availability || 'offline']}`} />
                    {statusLabels[user?.availability || 'offline']}
                    <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                    {statusOpen && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1 z-50">
                        {(Object.keys(statusLabels) as AvailabilityStatus[]).map((s) => (
                        <button key={s} onClick={() => { updateAvailability(s); setStatusOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
                            <div className={`w-2 h-2 rounded-full ${statusColors[s]}`} />
                            {statusLabels[s]}
                            {user?.availability === s && <Check className="w-3 h-3 ml-auto text-blue-500" />}
                        </button>
                        ))}
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>
                <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
                </button>
            </div>
            </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sm:px-6 gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />

            {/* Theme toggle */}
            <button onClick={toggle} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {/* Notifications */}
            <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative">
                <Bell className="w-[18px] h-[18px]" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>
                )}
                </button>
                <AnimatePresence>
                {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h3>
                        {unread > 0 && (
                        <button onClick={() => markAllNotificationsRead()} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                        )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-slate-400 text-center">No notifications</p>
                        ) : notifications.map((n) => (
                        <button key={n.id} onClick={() => markNotificationRead(n.id)} className={`w-full text-left p-3.5 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0 ${!n.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}>
                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                            <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                            </div>
                        </button>
                        ))}
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Avatar */}
            <NavLink to="/profile" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold text-xs">
                {user?.name?.charAt(0) || 'U'}
                </div>
            </NavLink>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-auto">
            <Outlet />
            </main>
        </div>
        </div>
    );
}
