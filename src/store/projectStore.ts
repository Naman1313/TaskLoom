import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Task, Activity, Notification, TaskStatus } from '../types';

const INITIAL_PROJECTS: Project[] = [
    { id: 'p1', name: 'Website Redesign', description: 'Complete overhaul of the company website with modern design patterns', color: '#3b82f6', members: ['u1', 'u2', 'u3'], createdAt: '2026-01-10', deadline: '2026-03-15' },
    { id: 'p2', name: 'Mobile App v2', description: 'Second iteration of the mobile application with new features', color: '#8b5cf6', members: ['u1', 'u4', 'u5'], createdAt: '2026-01-20', deadline: '2026-04-01' },
    { id: 'p3', name: 'API Integration', description: 'Third-party API integrations for payment and analytics', color: '#10b981', members: ['u2', 'u4'], createdAt: '2026-02-01', deadline: '2026-03-01' },
    ];

    const INITIAL_TASKS: Task[] = [
    { id: 't1', title: 'Design landing page mockup', description: 'Create wireframes and high-fidelity mockups', status: 'done', priority: 'high', assigneeId: 'u3', projectId: 'p1', deadline: '2026-02-20', createdAt: '2026-01-12', tags: ['design', 'ui'] },
    { id: 't2', title: 'Implement authentication flow', description: 'Set up login, signup, and password reset', status: 'in-progress', priority: 'urgent', assigneeId: 'u2', projectId: 'p1', deadline: '2026-02-18', createdAt: '2026-01-15', tags: ['frontend', 'auth'] },
    { id: 't3', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deployments', status: 'review', priority: 'medium', assigneeId: 'u4', projectId: 'p1', deadline: '2026-02-25', createdAt: '2026-01-18', tags: ['devops'] },
    { id: 't4', title: 'Create component library', description: 'Build reusable UI components with Storybook', status: 'todo', priority: 'high', assigneeId: 'u2', projectId: 'p1', deadline: '2026-03-01', createdAt: '2026-01-20', tags: ['frontend', 'ui'] },
    { id: 't5', title: 'User testing sessions', description: 'Conduct usability testing with 10 participants', status: 'todo', priority: 'medium', assigneeId: 'u5', projectId: 'p1', deadline: '2026-03-10', createdAt: '2026-01-22', tags: ['testing'] },
    { id: 't6', title: 'Implement push notifications', description: 'Add FCM for real-time push notifications', status: 'in-progress', priority: 'high', assigneeId: 'u4', projectId: 'p2', deadline: '2026-02-28', createdAt: '2026-01-25', tags: ['mobile', 'backend'] },
    { id: 't7', title: 'Design app onboarding', description: 'Create smooth onboarding experience', status: 'done', priority: 'medium', assigneeId: 'u3', projectId: 'p2', deadline: '2026-02-15', createdAt: '2026-01-26', tags: ['design', 'ux'] },
    { id: 't8', title: 'Performance optimization', description: 'Reduce app load time by 40%', status: 'todo', priority: 'high', assigneeId: 'u2', projectId: 'p2', deadline: '2026-03-15', createdAt: '2026-01-28', tags: ['performance'] },
    { id: 't9', title: 'Stripe integration', description: 'Implement payment processing with Stripe', status: 'in-progress', priority: 'urgent', assigneeId: 'u4', projectId: 'p3', deadline: '2026-02-20', createdAt: '2026-02-02', tags: ['backend', 'payments'] },
    { id: 't10', title: 'Analytics dashboard', description: 'Build real-time analytics with charts', status: 'todo', priority: 'medium', assigneeId: 'u2', projectId: 'p3', deadline: '2026-02-25', createdAt: '2026-02-05', tags: ['frontend', 'data'] },
    { id: 't11', title: 'API rate limiting', description: 'Implement rate limiting middleware', status: 'review', priority: 'low', assigneeId: 'u4', projectId: 'p3', deadline: '2026-02-22', createdAt: '2026-02-06', tags: ['backend', 'security'] },
    { id: 't12', title: 'Write API documentation', description: 'Swagger/OpenAPI specs for all endpoints', status: 'todo', priority: 'low', assigneeId: 'u5', projectId: 'p3', deadline: '2026-02-28', createdAt: '2026-02-08', tags: ['docs'] },
    ];

    const INITIAL_ACTIVITIES: Activity[] = [
    { id: 'a1', type: 'task_completed', userId: 'u3', userName: 'Jordan Lee', description: 'completed "Design landing page mockup"', timestamp: '2026-02-14T16:30:00', projectId: 'p1', projectName: 'Website Redesign' },
    { id: 'a2', type: 'task_moved', userId: 'u4', userName: 'Taylor Swift', description: 'moved "API rate limiting" to Review', timestamp: '2026-02-14T14:20:00', projectId: 'p3', projectName: 'API Integration' },
    { id: 'a3', type: 'badge_earned', userId: 'u1', userName: 'Alex Morgan', description: 'earned the "Streak Master" badge', timestamp: '2026-02-14T11:00:00' },
    { id: 'a4', type: 'task_created', userId: 'u2', userName: 'Sam Chen', description: 'created "Performance optimization"', timestamp: '2026-02-13T09:15:00', projectId: 'p2', projectName: 'Mobile App v2' },
    { id: 'a5', type: 'project_created', userId: 'u1', userName: 'Alex Morgan', description: 'created project "API Integration"', timestamp: '2026-02-01T10:00:00' },
    { id: 'a6', type: 'member_joined', userId: 'u5', userName: 'Riley Park', description: 'joined "Mobile App v2"', timestamp: '2026-01-28T08:30:00', projectId: 'p2', projectName: 'Mobile App v2' },
    { id: 'a7', type: 'task_completed', userId: 'u3', userName: 'Jordan Lee', description: 'completed "Design app onboarding"', timestamp: '2026-02-12T17:45:00', projectId: 'p2', projectName: 'Mobile App v2' },
    ];

    const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: 'n1', title: 'Deadline Approaching', message: '"Implement authentication flow" is due in 3 days', read: false, timestamp: '2026-02-15T08:00:00', type: 'deadline' },
    { id: 'n2', title: 'Task Assigned', message: 'You were assigned "Analytics dashboard"', read: false, timestamp: '2026-02-14T15:00:00', type: 'assignment' },
    { id: 'n3', title: 'Achievement Unlocked!', message: 'You earned the "Team Player" badge', read: true, timestamp: '2026-02-13T12:00:00', type: 'achievement' },
    { id: 'n4', title: 'Deadline Warning', message: '"Stripe integration" is due tomorrow!', read: false, timestamp: '2026-02-15T07:00:00', type: 'deadline' },
    ];

    interface ProjectState {
    projects: Project[];
    tasks: Task[];
    activities: Activity[];
    notifications: Notification[];
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
    updateProject: (id: string, data: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (id: string, data: Partial<Task>) => void;
    moveTask: (taskId: string, newStatus: TaskStatus) => void;
    deleteTask: (id: string) => void;
    getProjectTasks: (projectId: string) => Task[];
    getProjectProgress: (projectId: string) => number;
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
    unreadCount: () => number;
    }

    export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
        projects: INITIAL_PROJECTS,
        tasks: INITIAL_TASKS,
        activities: INITIAL_ACTIVITIES,
        notifications: INITIAL_NOTIFICATIONS,
        addProject: (project) => {
            const newProject: Project = {
            ...project,
            id: 'p-' + Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
            };
            const activity: Activity = {
            id: 'a-' + Date.now(),
            type: 'project_created',
            userId: 'u1',
            userName: 'You',
            description: `created project "${newProject.name}"`,
            timestamp: new Date().toISOString(),
            };
            set((s) => ({
            projects: [newProject, ...s.projects],
            activities: [activity, ...s.activities],
            }));
        },
        updateProject: (id, data) => set((s) => ({
            projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
        deleteProject: (id) => set((s) => ({
            projects: s.projects.filter((p) => p.id !== id),
            tasks: s.tasks.filter((t) => t.projectId !== id),
        })),
        addTask: (task) => {
            const newTask: Task = {
            ...task,
            id: 't-' + Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
            };
            const activity: Activity = {
            id: 'a-' + Date.now(),
            type: 'task_created',
            userId: 'u1',
            userName: 'You',
            description: `created "${newTask.title}"`,
            timestamp: new Date().toISOString(),
            projectId: newTask.projectId,
            };
            set((s) => ({
            tasks: [newTask, ...s.tasks],
            activities: [activity, ...s.activities],
            }));
        },
        updateTask: (id, data) => set((s) => ({
            tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
        moveTask: (taskId, newStatus) => {
            const task = get().tasks.find((t) => t.id === taskId);
            if (!task) return;
            const statusLabels: Record<TaskStatus, string> = { todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done' };
            const activity: Activity = {
            id: 'a-' + Date.now(),
            type: newStatus === 'done' ? 'task_completed' : 'task_moved',
            userId: 'u1',
            userName: 'You',
            description: newStatus === 'done' ? `completed "${task.title}"` : `moved "${task.title}" to ${statusLabels[newStatus]}`,
            timestamp: new Date().toISOString(),
            projectId: task.projectId,
            };
            set((s) => ({
            tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
            activities: [activity, ...s.activities],
            }));
        },
        deleteTask: (id) => set((s) => ({
            tasks: s.tasks.filter((t) => t.id !== id),
        })),
        getProjectTasks: (projectId) => get().tasks.filter((t) => t.projectId === projectId),
        getProjectProgress: (projectId) => {
            const tasks = get().tasks.filter((t) => t.projectId === projectId);
            if (tasks.length === 0) return 0;
            return Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100);
        },
        markNotificationRead: (id) => set((s) => ({
            notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
        markAllNotificationsRead: () => set((s) => ({
            notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
        unreadCount: () => get().notifications.filter((n) => !n.read).length,
        }),
        { name: 'project-store' }
    )
);
