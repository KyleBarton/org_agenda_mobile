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
        tags: ['work', 'coding', 'mobile'],
        file: 'work.org',
        project: 'Org Mobile App',
    },
    {
        id: '2',
        title: 'Buy groceries for the week',
        state: 'IN',
        tags: ['personal', 'errands', 'food'],
        file: 'personal.org',
    },
    {
        id: '3',
        title: 'Review PR #42',
        state: 'WAITINGFOR',
        tags: ['work', 'review'],
        file: 'work.org',
        project: 'Backend API',
    },
    {
        id: '4',
        title: 'Schedule dentist appointment',
        state: 'SOMEDAYMAYBE',
        tags: ['health', 'appointments'],
        file: 'personal.org',
        project: 'Health',
    },
    {
        id: '5',
        title: 'Read "The Pragmatic Programmer"',
        state: 'NEXTACTION',
        tags: ['learning', 'reading', 'dev'],
        file: 'learning.org',
        project: 'Self Improvement',
    },
    {
        id: '6',
        title: 'Pay electricity bill',
        state: 'NEXTACTION',
        tags: ['finance', 'bills', 'home'],
        file: 'personal.org',
        project: 'Finance',
    },
    {
        id: '7',
        title: 'Plan summer vacation itinerary',
        state: 'NEXTACTION',
        tags: ['travel', 'planning', 'family'],
        file: 'personal.org',
        project: 'Vacation',
    },
    {
        id: '8',
        title: 'Call Mom',
        state: 'NEXTACTION',
        tags: ['personal', 'social', 'family'],
        file: 'personal.org',
    },
    {
        id: '9',
        title: 'Write blog post about React Native',
        state: 'NEXTACTION',
        tags: ['writing', 'coding', 'blog'],
        file: 'work.org',
        project: 'Blog',
    },
    {
        id: '10',
        title: 'Practice guitar scales',
        state: 'NEXTACTION',
        tags: ['music', 'hobby', 'learning'],
        file: 'personal.org',
        project: 'Music',
    },
    {
        id: '11',
        title: 'Go for a 5k run',
        state: 'NEXTACTION',
        tags: ['fitness', 'health', 'running'],
        file: 'personal.org',
        project: 'Fitness',
    },
    {
        id: '12',
        title: 'Fix bug in login flow',
        state: 'NEXTACTION',
        tags: ['work', 'coding', 'bugfix'],
        file: 'work.org',
        project: 'Org Mobile App',
    },
    {
        id: '13',
        title: 'Research new gaming monitor',
        state: 'SOMEDAYMAYBE',
        tags: ['gaming', 'tech', 'shopping'],
        file: 'personal.org',
    },
    {
        id: '14',
        title: 'Meal prep for next week',
        state: 'NEXTACTION',
        tags: ['cooking', 'food', 'health'],
        file: 'personal.org',
        project: 'Health',
    },
    {
        id: '15',
        title: 'Update resume',
        state: 'WAITINGFOR',
        tags: ['career', 'writing'],
        file: 'work.org',
        project: 'Career',
    },
    {
        id: '16',
        title: 'Clean the garage',
        state: 'NEXTACTION',
        tags: ['home', 'chores'],
        file: 'personal.org',
        project: 'Home Maintenance',
    },
    {
        id: '17',
        title: 'Learn Rust basics',
        state: 'NEXTACTION',
        tags: ['learning', 'coding', 'rust'],
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
