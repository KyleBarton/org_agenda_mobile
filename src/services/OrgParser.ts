import { OrgTask } from '../mock/tasks';

export class OrgParser {
    static parse(fileName: string, content: string): OrgTask[] {
        const lines = content.split('\n');
        const rootTasks: OrgTask[] = [];
        const stack: { task: OrgTask, level: number }[] = [];
        let currentProject: string | undefined;

        // Regex for parsing headers
        // Matches: * (stars) (keyword)? (priority)? (title) (tags)?
        const headerRegex = /^(\*+)\s+(?:(IN|NEXTACTION|WAITINGFOR|SOMEDAYMAYBE|DONE)\s+)?(?:\[#([A-C])\]\s+)?(.*?)(?:\s+:([a-zA-Z0-9_@:]+):)?$/;

        // Regex for properties
        const deadlineRegex = /DEADLINE:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        const scheduledRegex = /SCHEDULED:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        const categoryRegex = /:CATEGORY:\s+(.+)/;
        const logbookStartRegex = /:LOGBOOK:/;
        const logbookEndRegex = /:END:/;
        const logStateChangeRegex = /- State "(\w+)"\s+from\s+"(\w+)"\s+\[(.*?)\]/;
        const logNoteRegex = /- Note taken on \[(.*?)\] \\\\/;

        let inLogbook = false;
        let currentTask: OrgTask | null = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const headerMatch = line.match(headerRegex);

            if (headerMatch) {
                inLogbook = false; // Reset logbook state on new header
                const [, stars, state, priority, title, tagsStr] = headerMatch;
                const level = stars.length;
                const tags = tagsStr ? tagsStr.split(':').filter(t => t) : [];

                // Create new task object
                const newTask: OrgTask = {
                    id: `${fileName}-${i}`,
                    title: title.trim(),
                    state: (state as OrgTask['state']) || undefined, // Allow undefined state for structure nodes
                    tags: tags,
                    file: fileName,
                    project: undefined, // Will be set based on hierarchy
                    children: [],
                    logs: []
                };

                // Handle hierarchy
                if (level === 1) {
                    currentProject = title.trim();
                    newTask.project = currentProject;
                    rootTasks.push(newTask);
                    stack.length = 0; // Clear stack for new root
                    stack.push({ task: newTask, level });
                } else {
                    // Find parent
                    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                        stack.pop();
                    }

                    if (stack.length > 0) {
                        const parent = stack[stack.length - 1].task;
                        parent.children = parent.children || [];
                        parent.children.push(newTask);
                        newTask.project = parent.project; // Inherit project
                    } else {
                        // Fallback if hierarchy is weird (e.g. starting with level 2)
                        rootTasks.push(newTask);
                    }
                    stack.push({ task: newTask, level });
                }
                currentTask = newTask;

            } else if (currentTask) {
                // Property parsing
                if (line.match(logbookStartRegex)) {
                    inLogbook = true;
                    continue;
                }
                if (line.match(logbookEndRegex)) {
                    inLogbook = false;
                    continue;
                }

                // Check for properties drawer
                if (line.trim() === ':PROPERTIES:') {
                    continue;
                }
                if (line.trim() === ':END:') {
                    continue;
                }

                if (inLogbook) {
                    const stateChangeMatch = line.match(logStateChangeRegex);
                    if (stateChangeMatch) {
                        currentTask.logs?.push({
                            type: 'STATE_CHANGE',
                            to: stateChangeMatch[1],
                            from: stateChangeMatch[2],
                            timestamp: this.parseOrgDate(stateChangeMatch[3])
                        });
                    }
                    const noteMatch = line.match(logNoteRegex);
                    if (noteMatch) {
                        currentTask.logs?.push({
                            type: 'NOTE',
                            timestamp: this.parseOrgDate(noteMatch[1]),
                            note: '' // Note content usually follows, simplified for now
                        });
                    }
                } else {
                    // Regular properties
                    const deadlineMatch = line.match(deadlineRegex);
                    if (deadlineMatch) {
                        currentTask.deadline = this.parseOrgDate(deadlineMatch[1]);
                        continue;
                    }

                    const scheduledMatch = line.match(scheduledRegex);
                    if (scheduledMatch) {
                        currentTask.scheduled = this.parseOrgDate(scheduledMatch[1]);
                        continue;
                    }

                    const categoryMatch = line.match(categoryRegex);
                    if (categoryMatch) {
                        const category = categoryMatch[1].trim();
                        if (currentTask.tags && !currentTask.tags.includes(category)) {
                            currentTask.tags.push(category);
                        }
                        continue;
                    }

                    // If it's not a property, it's body text
                    // We should probably trim leading/trailing whitespace but keep internal structure?
                    // For now, just append line
                    if (line.trim().length > 0) {
                        currentTask.body = currentTask.body ? currentTask.body + '\n' + line : line;
                    }
                }
            }
        }

        // Flatten the list for the current simple view, OR return roots?
        // The current app expects a flat list of tasks.
        // We should probably return a flat list of ALL tasks that have a state,
        // but now they will have 'children' populated.
        // However, the recursive view requirement implies we might want to navigate structure.
        // For now, let's keep the flat return of "actionable" things (things with state),
        // but ensure they have their children attached for the detail view.

        const allTasks: OrgTask[] = [];
        const traverse = (nodes: OrgTask[]) => {
            for (const node of nodes) {
                if (node.state) {
                    allTasks.push(node);
                }
                if (node.children) {
                    traverse(node.children);
                }
            }
        };
        traverse(rootTasks);

        return allTasks;
    }

    private static parseOrgDate(dateStr: string): Date {
        // Format: 2023-09-01 Fri 15:12
        const cleanDate = dateStr.replace(/\s+[A-Za-z]{3}\s+/, 'T').replace(/\s+[A-Za-z]{3}$/, '');
        // If no time, append T00:00:00
        const finalDate = cleanDate.includes('T') ? cleanDate : `${cleanDate}T00:00:00`;
        return new Date(finalDate);
    }
}
