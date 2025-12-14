export interface OrgTask {
    id: string;
    title: string;
    state: 'IN' | 'NEXTACTION' | 'WAITINGFOR' | 'SOMEDAYMAYBE' | 'DONE';
    tags: string[];
    deadline?: Date;
    scheduled?: Date;
    file: string; // Which file it came from
    project?: string; // Parent header
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export let mockTasks: OrgTask[] = [
    {
        id: '1',
        title: 'Finish the UI prototype for Org Mobile',
        state: 'NEXTACTION',
        tags: ['work', 'coding'],
        file: 'work.org',
        project: 'Org Mobile App',
    },
    {
        id: '2',
        title: 'Buy groceries for the week',
        state: 'IN',
        tags: ['personal', 'errands'],
        file: 'personal.org',
        // No project, should default to Misc
    },
    {
        id: '3',
        title: 'Review PR #42',
        state: 'WAITINGFOR',
        tags: ['work'],
        file: 'work.org',
        project: 'Backend API',
    },
    {
        id: '4',
        title: 'Schedule dentist appointment',
        state: 'SOMEDAYMAYBE',
        tags: ['health'],
        file: 'personal.org',
        project: 'Health',
    },
    {
        id: '5',
        title: 'Read "The Pragmatic Programmer"',
        state: 'NEXTACTION',
        tags: ['learning'],
        file: 'learning.org',
        project: 'Self Improvement',
    },
];

export const addTask = (task: Omit<OrgTask, 'id'>) => {
    const newTask = {
        ...task,
        id: Math.random().toString(36).substr(2, 9),
    };
    // Add to beginning
    mockTasks = [newTask, ...mockTasks];
    return newTask;
};
