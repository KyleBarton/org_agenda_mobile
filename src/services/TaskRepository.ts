import { fixtures } from '../mock/fixtures';
import { OrgTask } from '../mock/tasks';
import { OrgParser } from './OrgParser';

export class TaskRepository {
    private static tasks: OrgTask[] = [];
    private static initialized = false;

    static async initialize() {
        if (this.initialized) return;

        const allTasks: OrgTask[] = [];

        Object.entries(fixtures).forEach(([fileName, content]) => {
            const tasks = OrgParser.parse(fileName, content);
            allTasks.push(...tasks);
        });

        this.tasks = allTasks;
        this.initialized = true;
    }

    static getTasks(): OrgTask[] {
        if (!this.initialized) {
            // Sync initialization if possible, or return empty/throw.
            // Since parsing is sync and fixtures are in memory, we can just init.
            this.initialize();
        }
        return this.tasks;
    }

    static getTasksByState(state: OrgTask['state']): OrgTask[] {
        return this.getTasks().filter(t => t.state === state);
    }
}
