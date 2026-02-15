import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, signup } = useAuthStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isLogin) {
        const ok = login(email, password);
        if (!ok) setError('Invalid credentials. Try any email to sign in.');
        } else {
        if (!name.trim()) { setError('Name is required'); return; }
        const ok = signup(name, email, password);
        if (!ok) setError('Email already exists');
        }
    };

    const features = [
        { icon: '📋', title: 'Task Boards', desc: 'Drag-and-drop kanban boards' },
        { icon: '📊', title: 'Progress Tracking', desc: 'Real-time project analytics' },
        { icon: '🏆', title: 'Achievements', desc: 'Earn badges for productivity' },
        { icon: '👥', title: 'Team Collaboration', desc: 'Assign and manage together' },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 p-12 flex-col justify-between">
            <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-white font-bold text-2xl tracking-tight">TaskLoom</span>
            </div>
            <p className="text-blue-100 text-sm mt-1">Collaborative Project Management</p>
            </div>
            <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold text-white leading-tight">Manage projects.<br />Track progress.<br />Achieve together.</h2>
            <div className="grid grid-cols-2 gap-4 mt-8">
                {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <span className="text-2xl">{f.icon}</span>
                    <h3 className="text-white font-semibold mt-2 text-sm">{f.title}</h3>
                    <p className="text-blue-200 text-xs mt-1">{f.desc}</p>
                </motion.div>
                ))}
            </div>
            </div>
            <div className="relative z-10 flex items-center gap-3">
            <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-pink-400'].map((c, i) => (
                <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold`}>
                    {String.fromCharCode(65 + i)}
                </div>
                ))}
            </div>
            <p className="text-blue-100 text-sm"><span className="text-white font-semibold">2,400+</span> teams already onboard</p>
            </div>
        </div>

        {/* Right panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">TaskLoom</span>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {isLogin ? 'Welcome back' : 'Create account'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                {isLogin ? 'Sign in to continue to your dashboard' : 'Start managing your projects today'}
                </p>
            </div>

            <AnimatePresence mode="wait">
                <motion.form key={isLogin ? 'login' : 'signup'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all" />
                    </div>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                    <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-11 pr-11 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                    </motion.div>
                )}

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                </button>

                {isLogin && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3.5 space-y-1.5">
                    <p className="text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Quick access: use any email to sign in</p>
                    <p className="text-blue-600/70 dark:text-blue-400/70 text-xs">Try: alex@TaskLoom.io for a pre-loaded experience</p>
                    </div>
                )}
                </motion.form>
            </AnimatePresence>

            <p className="text-center text-slate-500 dark:text-slate-400 mt-8 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-600 dark:text-blue-400 font-semibold ml-1.5 hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
                </button>
            </p>
            </motion.div>
        </div>
        </div>
    );
}
