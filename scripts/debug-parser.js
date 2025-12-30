const fs = require('fs');
const path = require('path');

class OrgParser {
    static parse(fileName, content) {
        const tasks = [];
        const lines = content.split('\n');
        let currentProject;

        const headerRegex = /^(\*+)\s+(?:(IN|NEXTACTION|WAITINGFOR|SOMEDAYMAYBE|DONE)\s+)?(?:\[#([A-C])\]\s+)?(.*?)(?:\s+:([a-zA-Z0-9_@:]+):)?$/;
        const deadlineRegex = /DEADLINE:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        const scheduledRegex = /SCHEDULED:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        // New regex for category
        const categoryRegex = /:CATEGORY:\s+(.+)/;

        let currentTask = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const headerMatch = line.match(headerRegex);

            if (headerMatch) {
                if (currentTask && currentTask.state) {
                    tasks.push(currentTask);
                }

                const [, stars, state, priority, title, tagsStr] = headerMatch;
                const level = stars.length;
                const tags = tagsStr ? tagsStr.split(':').filter(t => t) : [];

                if (level === 1) {
                    currentProject = title.trim();
                }

                if (state) {
                    currentTask = {
                        id: `${fileName}-${i}`,
                        title: title.trim(),
                        state: state,
                        tags: tags,
                        file: fileName,
                        project: level > 1 ? currentProject : undefined
                    };
                } else {
                    currentTask = null;
                }
            } else if (currentTask) {
                const deadlineMatch = line.match(deadlineRegex);
                if (deadlineMatch) {
                    currentTask.deadline = deadlineMatch[1]; // Simplified date for debug
                }

                const scheduledMatch = line.match(scheduledRegex);
                if (scheduledMatch) {
                    currentTask.scheduled = scheduledMatch[1];
                }

                // Check for Category
                const categoryMatch = line.match(categoryRegex);
                if (categoryMatch) {
                    const category = categoryMatch[1].trim();
                    // Add category to tags
                    if (!currentTask.tags.includes(category)) {
                        currentTask.tags.push(category);
                    }
                }
            }
        }

        if (currentTask && currentTask.state) {
            tasks.push(currentTask);
        }

        return tasks;
    }
}

const fixturePath = path.join(__dirname, '../fixtures/work/Become-a-Writer.org');
const content = fs.readFileSync(fixturePath, 'utf8');

console.log('Parsing Become-a-Writer.org...');
const tasks = OrgParser.parse('Become-a-Writer.org', content);

// Find the "Spend an hour..." task
const task = tasks.find(t => t.title.includes('Spend an hour writing a dialog'));

if (task) {
    console.log('Found task:');
    console.log(JSON.stringify(task, null, 2));
} else {
    console.log('Task not found!');
}

// Also check if any task has "Become_A_Writer" tag
const weirdTask = tasks.find(t => t.tags.includes('Become_A_Writer'));
if (weirdTask) {
    console.log('Found task with Become_A_Writer tag:', weirdTask.title);
}
