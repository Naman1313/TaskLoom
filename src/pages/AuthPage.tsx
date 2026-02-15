import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    
    const { login, signup } = useAuthStore ? useAuthStore() : { login: () => true, signup: () => true };

    const handleSubmit = (e) => {
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
        { icon: '📋', title: 'Task Boards', desc: 'Drag-and-drop workflow' },
        { icon: '📊', title: 'Analytics', desc: 'Real-time insights' },
        { icon: '⚡', title: 'Automation', desc: 'Streamline your work' },
        { icon: '👥', title: 'Collaboration', desc: 'Work together effortlessly' },
    ];

    return (
        // Main container - Deep Dark background to let the vibrant logo pop
        <div className="min-h-screen flex bg-[#0f172a] text-white font-sans selection:bg-violet-500/30">
        
        {/* LEFT PANEL - The "Brand" Side */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] p-16 flex-col justify-between border-r border-white/5">
            
            {/* LOGO-INSPIRED BACKGROUND GLOWS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top Left: Cyan/Blue Glow (Matches top-left of logo) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
            
            {/* Center: Rich Violet Glow (Matches top-right of logo) */}
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            
            {/* Bottom Right: Warm Orange Glow (Matches bottom of logo) */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Logo Area */}
            <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
                {/* Placeholder for your actual Logo Image */}
                <img 
                src="/src/assets/logo.png" 
                alt="Logo" 
                className="w-12 h-12 object-contain drop-shadow-2xl" 
                /> 
                <span className="text-white font-bold text-3xl tracking-tight">TaskLoom</span>
            </div>
            <p className="text-slate-400 text-sm ml-1 font-medium tracking-wide">Workspace Optimized</p>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.15]">
                Manage projects. <br />
                {/* Gradient text matching the logo's flow: Blue -> Purple -> Orange */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400">
                Master productivity.
                </span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
                {features.map((f, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4 + i * 0.1 }} 
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors group"
                >
                    <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform duration-300">{f.icon}</span>
                    <h3 className="text-white font-semibold text-sm tracking-wide">{f.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
                </motion.div>
                ))}
            </div>
            </div>

            {/* Social Proof */}
            <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-white/10">
            <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1e1b4b] bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                </div>
                ))}
                {/* The +2k badge uses the Purple from the logo */}
                <div className="w-10 h-10 rounded-full border-2 border-[#1e1b4b] bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                +2k
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-1">
                {/* Stars use the Orange from the logo */}
                {[1,2,3,4,5].map(star => <span key={star} className="text-orange-400 text-xs">★</span>)}
                </div>
                <p className="text-slate-300 text-xs font-medium">Trusted by agile teams</p>
            </div>
            </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
            
            {/* Subtle Violet background glow for the right side */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full max-w-md relative z-10"
            >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                <img src="/path-to-your-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="font-bold text-2xl tracking-tight text-white">TaskLoom</span>
            </div>

            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
                </h1>
                <p className="text-slate-400 text-sm">
                {isLogin ? 'Enter your details to access your workspace' : 'Start your 30-day free trial today'}
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <AnimatePresence mode="wait">
                <motion.form 
                    key={isLogin ? 'login' : 'signup'} 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit} 
                    className="space-y-5"
                >
                    {!isLogin && (
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Full Name</label>
                        <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="e.g. Jordan Lee" 
                            className="w-full pl-11 pr-4 py-3.5 bg-[#0f172a]/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all" 
                        />
                        </div>
                    </div>
                    )}
                    
                    <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                        <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="name@company.com" 
                        required 
                        className="w-full pl-11 pr-4 py-3.5 bg-[#0f172a]/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all" 
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                        <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        required 
                        className="w-full pl-11 pr-12 py-3.5 bg-[#0f172a]/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all" 
                        />
                        <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    </div>

                    {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {error}
                    </motion.div>
                    )}

                    {/* BUTTON: Gradient from Blue to Violet (Top of logo) */}
                    <button 
                    type="submit" 
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.form>
                </AnimatePresence>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                    {isLogin ? "New to TaskLoom?" : 'Already have an account?'}
                    {/* Text Link: Uses the Orange/Amber from bottom of logo for contrast */}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-orange-400 font-semibold ml-1.5 hover:text-orange-300 transition-colors">
                    {isLogin ? 'Create an account' : 'Sign in'}
                    </button>
                </p>
                </div>
            </div>

            {isLogin && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} className="mt-6 text-center">
                <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 
                    Secure, encrypted connection
                </p>
                </motion.div>
            )}

            </motion.div>
        </div>
        </div>
    );
}