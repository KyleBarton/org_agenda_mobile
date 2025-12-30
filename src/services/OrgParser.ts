import { OrgTask } from '../mock/tasks';

export class OrgParser {
    static parse(fileName: string, content: string): OrgTask[] {
        const tasks: OrgTask[] = [];
        const lines = content.split('\n');
        let currentProject: string | undefined;

        // Regex for parsing headers
        // Matches: * (stars) (keyword)? (priority)? (title) (tags)?
        const headerRegex = /^(\*+)\s+(?:(IN|NEXTACTION|WAITINGFOR|SOMEDAYMAYBE|DONE)\s+)?(?:\[#([A-C])\]\s+)?(.*?)(?:\s+:([a-zA-Z0-9_@:]+):)?$/;

        // Regex for properties
        const deadlineRegex = /DEADLINE:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        const scheduledRegex = /SCHEDULED:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        const categoryRegex = /:CATEGORY:\s+(.+)/;

        let currentTask: Partial<OrgTask> | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const headerMatch = line.match(headerRegex);

            if (headerMatch) {
                // If we were processing a task, push it (unless it was just a project header without state)
                if (currentTask && currentTask.state) {
                    tasks.push(currentTask as OrgTask);
                }

                const [, stars, state, priority, title, tagsStr] = headerMatch;
                const level = stars.length;
                const tags = tagsStr ? tagsStr.split(':').filter(t => t) : [];

                // Determine if this is a project or a task
                // For this simple parser, we'll assume level 1 is file/project level, level 2+ are tasks if they have a state
                // Or if it has a state, it's a task.

                if (level === 1) {
                    currentProject = title.trim();
                }

                if (state) {
                    currentTask = {
                        id: `${fileName}-${i}`, // Simple ID generation
                        title: title.trim(),
                        state: state as OrgTask['state'],
                        tags: tags,
                        file: fileName,
                        project: level > 1 ? currentProject : undefined
                    };
                } else {
                    // It's a header without a state. Could be a category or project definition.
                    // If it's level 1, we already set currentProject.
                    // If it's deeper, maybe update currentProject?
                    // For now, let's keep it simple: Level 1 is project context for children.
                    currentTask = null;
                }
            } else if (currentTask) {
                // Parse properties in the body of the task
                const deadlineMatch = line.match(deadlineRegex);
                if (deadlineMatch) {
                    currentTask.deadline = this.parseOrgDate(deadlineMatch[1]);
                }

                const scheduledMatch = line.match(scheduledRegex);
                if (scheduledMatch) {
                    currentTask.scheduled = this.parseOrgDate(scheduledMatch[1]);
                }

                const categoryMatch = line.match(categoryRegex);
                if (categoryMatch) {
                    const category = categoryMatch[1].trim();
                    if (currentTask.tags && !currentTask.tags.includes(category)) {
                        currentTask.tags.push(category);
                    }
                }
            }
        }

        // Push the last task
        if (currentTask && currentTask.state) {
            tasks.push(currentTask as OrgTask);
        }

        return tasks;
    }

    private static parseOrgDate(dateStr: string): Date {
        // Format: 2023-09-01 Fri 15:12
        // We can just let Date.parse handle the YYYY-MM-DD part, but the day name might confuse it?
        // Actually new Date('2023-09-01 Fri 15:12') might work or might not depending on env.
        // Safer to strip the day name.
        const cleanDate = dateStr.replace(/\s+[A-Za-z]{3}\s+/, 'T').replace(/\s+[A-Za-z]{3}$/, '');
        // If no time, append T00:00:00
        const finalDate = cleanDate.includes('T') ? cleanDate : `${cleanDate}T00:00:00`;
        return new Date(finalDate);
    }
}
