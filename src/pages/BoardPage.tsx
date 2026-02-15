import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, Flag, Tag, User, GripVertical, Clock, ChevronLeft } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../types';

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string }[] = [
    { id: 'todo', label: 'To Do', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
    { id: 'in-progress', label: 'In Progress', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { id: 'review', label: 'Review', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { id: 'done', label: 'Done', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    ];

    const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
    ];

    export default function BoardPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { projects, tasks, addTask, moveTask, deleteTask } = useProjectStore();
    const { teamMembers } = useAuthStore();
    const project = projects.find((p) => p.id === projectId);
    const projectTasks = tasks.filter((t) => t.projectId === projectId);

    const [showCreate, setShowCreate] = useState(false);
    const [createStatus, setCreateStatus] = useState<TaskStatus>('todo');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [assigneeId, setAssigneeId] = useState('');
    const [deadline, setDeadline] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const dragRef = useRef<{ taskId: string; sourceCol: TaskStatus } | null>(null);
    const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

    const handleDragStart = (taskId: string, status: TaskStatus) => {
        dragRef.current = { taskId, sourceCol: status };
    };

    const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
        e.preventDefault();
        setDragOverCol(colId);
    };

    const handleDragLeave = () => setDragOverCol(null);

    const handleDrop = (colId: TaskStatus) => {
        if (dragRef.current && dragRef.current.sourceCol !== colId) {
        moveTask(dragRef.current.taskId, colId);
        }
        dragRef.current = null;
        setDragOverCol(null);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !projectId) return;
        addTask({
        title, description, status: createStatus, priority, assigneeId: assigneeId || 'u1',
        projectId, deadline: deadline || '2026-03-01', tags,
        });
        setTitle(''); setDescription(''); setPriority('medium'); setAssigneeId(''); setDeadline(''); setTags([]);
        setShowCreate(false);
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
        }
    };

    const done = projectTasks.filter((t) => t.status === 'done').length;
    const progress = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;

    if (!project) {
        return (
        <div className="p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">Project not found.</p>
            <button onClick={() => navigate('/projects')} className="mt-4 text-blue-600 hover:underline">Go to Projects</button>
        </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
            <button onClick={() => navigate('/projects')} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
                <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 ml-6">{project.description}</p>
            </div>
            </div>
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl">
                <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: project.color }} />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{progress}%</span>
            </div>
            <button onClick={() => { setCreateStatus('todo'); setShowCreate(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.97]">
                <Plus className="w-4 h-4" /> Add Task
            </button>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {COLUMNS.map((col) => {
            const colTasks = projectTasks.filter((t) => t.status === col.id);
            return (
                <div key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(col.id)}
                className={`min-w-[280px] sm:min-w-[300px] flex-1 rounded-2xl transition-colors duration-200 ${
                    dragOverCol === col.id ? 'bg-blue-50 dark:bg-blue-500/5 ring-2 ring-blue-400/30 ring-dashed' : 'bg-slate-50/50 dark:bg-slate-900/30'
                }`}>
                <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${col.id === 'todo' ? 'bg-slate-400' : col.id === 'in-progress' ? 'bg-blue-500' : col.id === 'review' ? 'bg-amber-500' : 'bg-green-500'}`} />
                        <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                        <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-medium">{colTasks.length}</span>
                    </div>
                    <button onClick={() => { setCreateStatus(col.id); setShowCreate(true); }} className="p-1 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                    </div>

                    <div className="space-y-2.5 min-h-[80px]">
                    <AnimatePresence>
                        {colTasks.map((task) => (
                        <TaskCard key={task.id} task={task} teamMembers={teamMembers} onDragStart={handleDragStart} onDelete={deleteTask} />
                        ))}
                    </AnimatePresence>
                    </div>
                </div>
                </div>
            );
            })}
        </div>

        {/* Create Task Modal */}
        <AnimatePresence>
            {showCreate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900 dark:text-white">Create Task</h2>
                    <button onClick={() => setShowCreate(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleCreate} className="p-5 space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Task title..."
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Describe the task..."
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> Priority</label>
                        <div className="flex flex-wrap gap-1.5">
                        {PRIORITIES.map((p) => (
                            <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${priority === p.value ? p.color + ' ring-1 ring-current/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>{p.label}</button>
                        ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Assignee</label>
                        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                        <option value="">Select member</option>
                        {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline</label>
                        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Tags</label>
                        <div className="flex gap-1.5">
                        <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..."
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
                        <button type="button" onClick={addTag} className="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"><Plus className="w-4 h-4" /></button>
                        </div>
                        {tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{tags.map((t) => (
                        <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-xs">
                            {t}<button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                        ))}</div>}
                    </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25">Create Task</button>
                    </div>
                </form>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
    }

    function TaskCard({ task, teamMembers, onDragStart, onDelete }: {
    task: Task; teamMembers: { id: string; name: string }[];
    onDragStart: (id: string, status: TaskStatus) => void;
    onDelete: (id: string) => void;
    }) {
    const assignee = teamMembers.find((m) => m.id === task.assigneeId);
    const isOverdue = task.status !== 'done' && new Date(task.deadline) < new Date();
    const priorityColors: Record<TaskPriority, string> = {
        low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        medium: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
        urgent: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    };

    return (
        <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        draggable onDragStart={() => onDragStart(task.id, task.status)}
        className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group">
        <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
            <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
            </div>
            <button onClick={() => onDelete(task.id)} className="p-1 text-slate-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
        </div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 leading-snug">{task.title}</h4>
        {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{task.description}</p>}
        {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
            {task.tags.map((t) => <span key={t} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded text-[10px]">{t}</span>)}
            </div>
        )}
        <div className="flex items-center justify-between">
            {assignee ? (
            <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-[8px] font-bold">{assignee.name.charAt(0)}</div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{assignee.name.split(' ')[0]}</span>
            </div>
            ) : <div />}
            <span className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            <Clock className="w-2.5 h-2.5" /> {task.deadline}
            </span>
        </div>
        </motion.div>
    );
}
