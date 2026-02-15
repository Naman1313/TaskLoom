import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Badge } from '../types';

const DEFAULT_BADGES: Badge[] = [
    { id: 'b1', name: 'Early Bird', icon: '🌅', description: 'Completed 5 tasks before deadline', earnedAt: '2026-01-15', color: '#f59e0b' },
    { id: 'b2', name: 'Team Player', icon: '🤝', description: 'Collaborated on 10 projects', earnedAt: '2026-01-20', color: '#3b82f6' },
    { id: 'b3', name: 'Streak Master', icon: '🔥', description: '7-day completion streak', earnedAt: '2026-02-01', color: '#ef4444' },
    { id: 'b4', name: 'Perfectionist', icon: '✨', description: 'Zero overdue tasks for a month', earnedAt: '2026-02-10', color: '#8b5cf6' },
    ];

    const TEAM_MEMBERS: User[] = [
    { id: 'u1', name: 'Alex Morgan', email: 'alex@taskflow.io', avatar: '', role: 'Project Manager', availability: 'available', badges: DEFAULT_BADGES, completedTasks: 47, joinedAt: '2025-06-15', bio: 'Passionate about delivering results and leading high-performing teams.' },
    { id: 'u2', name: 'Sam Chen', email: 'sam@taskflow.io', avatar: '', role: 'Frontend Developer', availability: 'busy', badges: [DEFAULT_BADGES[0], DEFAULT_BADGES[2]], completedTasks: 35, joinedAt: '2025-07-20', bio: 'Building beautiful interfaces one component at a time.' },
    { id: 'u3', name: 'Jordan Lee', email: 'jordan@taskflow.io', avatar: '', role: 'Designer', availability: 'away', badges: [DEFAULT_BADGES[1], DEFAULT_BADGES[3]], completedTasks: 28, joinedAt: '2025-08-10', bio: 'Design is not just what it looks like, it is how it works.' },
    { id: 'u4', name: 'Taylor Swift', email: 'taylor@taskflow.io', avatar: '', role: 'Backend Developer', availability: 'available', badges: [DEFAULT_BADGES[0]], completedTasks: 52, joinedAt: '2025-09-05', bio: 'Full stack enthusiast focused on scalable solutions.' },
    { id: 'u5', name: 'Riley Park', email: 'riley@taskflow.io', avatar: '', role: 'QA Engineer', availability: 'offline', badges: DEFAULT_BADGES.slice(0, 3), completedTasks: 41, joinedAt: '2025-10-12', bio: 'Finding bugs so users don\'t have to.' },
    ];

    interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    teamMembers: User[];
    login: (email: string, password: string) => boolean;
    signup: (name: string, email: string, password: string) => boolean;
    logout: () => void;
    updateAvailability: (status: User['availability']) => void;
    getMember: (id: string) => User | undefined;
    }

    export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
        user: null,
        isAuthenticated: false,
        teamMembers: TEAM_MEMBERS,
        login: (email: string, _password: string) => {
            const member = TEAM_MEMBERS.find((m) => m.email === email);
            if (member) {
            set({ user: member, isAuthenticated: true });
            return true;
            }
            // Allow any email login for demo
            const newUser: User = {
            id: 'u-' + Date.now(),
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            avatar: '',
            role: 'Team Member',
            availability: 'available',
            badges: [DEFAULT_BADGES[0]],
            completedTasks: 0,
            joinedAt: new Date().toISOString().split('T')[0],
            bio: 'New team member ready to collaborate!',
            };
            set({ user: newUser, isAuthenticated: true, teamMembers: [...get().teamMembers, newUser] });
            return true;
        },
        signup: (name: string, email: string, _password: string) => {
            const exists = get().teamMembers.find((m) => m.email === email);
            if (exists) return false;
            const newUser: User = {
            id: 'u-' + Date.now(),
            name,
            email,
            avatar: '',
            role: 'Team Member',
            availability: 'available',
            badges: [],
            completedTasks: 0,
            joinedAt: new Date().toISOString().split('T')[0],
            bio: 'New team member ready to collaborate!',
            };
            set({ user: newUser, isAuthenticated: true, teamMembers: [...get().teamMembers, newUser] });
            return true;
        },
        logout: () => set({ user: null, isAuthenticated: false }),
        updateAvailability: (status) => set((s) => ({
            user: s.user ? { ...s.user, availability: status } : null,
        })),
        getMember: (id) => get().teamMembers.find((m) => m.id === id),
        }),
        { name: 'auth-store' }
    )
);
