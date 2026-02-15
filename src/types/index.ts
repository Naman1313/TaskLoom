export type AvailabilityStatus = 'available' | 'busy' | 'away' | 'offline';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ActivityType = 'task_created' | 'task_completed' | 'task_moved' | 'project_created' | 'member_joined' | 'badge_earned';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    availability: AvailabilityStatus;
    badges: Badge[];
    completedTasks: number;
    joinedAt: string;
    bio: string;
    }

    export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: string;
    color: string;
    }

    export interface Project {
    id: string;
    name: string;
    description: string;
    color: string;
    members: string[];
    createdAt: string;
    deadline: string;
    }

    export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string;
    projectId: string;
    deadline: string;
    createdAt: string;
    tags: string[];
    }

    export interface Activity {
    id: string;
    type: ActivityType;
    userId: string;
    userName: string;
    description: string;
    timestamp: string;
    projectId?: string;
    projectName?: string;
    }

    export interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
    type: 'deadline' | 'assignment' | 'mention' | 'achievement';
}
