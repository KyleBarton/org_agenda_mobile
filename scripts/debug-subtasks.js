// Mock the OrgParser since we can't import TS directly in node without compilation or ts-node

// Mock the OrgParser since we can't import TS directly in node without compilation or ts-node
// Actually, I'll just copy the parser logic here for a quick test or try to use ts-node if available.
// Since I can't easily use ts-node in this environment without setup, I will create a JS version of the parser logic to test, 
// OR I can try to run the existing test-parser.js if it exists and modify it.

// Let's look at the existing test-parser.js first.
const fs = require('fs');
const path = require('path');

const content = `
**** NEXTACTION Make project file names filter by allowed chars too
:PROPERTIES:
:CATEGORY: yakshaving-30min
:END:
:LOGBOOK:
- State "NEXTACTION" from "IN"         [2023-07-18 Tue 09:36]
:END:
Probably just letters and numbers
***** This is a headline
And inside, a list:
- First item of the list
- Second item of the list

Here's another list, but numbered:
1. First item
2. Second item

Finally, here's a checkbox:
- [ ] First unchecked item
- [X] Second unchecked item
***** This is a second headline
***** 2025-12-30
This is a timestamped headline
`;

// Paste the parser logic here adapted for JS
class OrgParserJS {
    static parse(fileName, content) {
        const lines = content.split('\n');
        const rootTasks = [];
        const stack = [];
        let currentProject;

        const headerRegex = /^(\*+)\s+(?:(IN|NEXTACTION|WAITINGFOR|SOMEDAYMAYBE|DONE)\s+)?(?:\[#([A-C])\]\s+)?(.*?)(?:\s+:([a-zA-Z0-9_@:]+):)?$/;
        const deadlineRegex = /DEADLINE:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        const scheduledRegex = /SCHEDULED:\s+<(\d{4}-\d{2}-\d{2}\s+\w{3}(?:\s+\d{2}:\d{2})?)>/;
        const categoryRegex = /:CATEGORY:\s+(.+)/;
        const logbookStartRegex = /:LOGBOOK:/;
        const logbookEndRegex = /:END:/;
        const logStateChangeRegex = /- State "(\w+)"\s+from\s+"(\w+)"\s+\[(.*?)\]/;
        const logNoteRegex = /- Note taken on \[(.*?)\] \\\\/;

        let inLogbook = false;
        let currentTask = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const headerMatch = line.match(headerRegex);

            if (headerMatch) {
                inLogbook = false;
                const [, stars, state, priority, title, tagsStr] = headerMatch;
                const level = stars.length;
                const tags = tagsStr ? tagsStr.split(':').filter(t => t) : [];

                const newTask = {
                    id: `${fileName}-${i}`,
                    title: title.trim(),
                    state: state || undefined,
                    tags: tags,
                    file: fileName,
                    project: undefined,
                    children: [],
                    logs: [],
                    body: ''
                };

                if (level === 1) {
                    currentProject = title.trim();
                    newTask.project = currentProject;
                    rootTasks.push(newTask);
                    stack.length = 0;
                    stack.push({ task: newTask, level });
                } else {
                    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                        stack.pop();
                    }

                    if (stack.length > 0) {
                        const parent = stack[stack.length - 1].task;
                        parent.children = parent.children || [];
                        parent.children.push(newTask);
                        newTask.project = parent.project;
                    } else {
                        rootTasks.push(newTask);
                    }
                    stack.push({ task: newTask, level });
                }
                currentTask = newTask;

            } else if (currentTask) {
                if (line.match(logbookStartRegex)) {
                    inLogbook = true;
                    continue;
                }
                if (line.match(logbookEndRegex)) {
                    inLogbook = false;
                    continue;
                }

                if (line.trim() === ':PROPERTIES:') continue;
                if (line.trim() === ':END:') continue;

                if (inLogbook) {
                    // Skip logs for this test
                } else {
                    if (line.match(deadlineRegex)) continue;
                    if (line.match(scheduledRegex)) continue;
                    if (line.match(categoryRegex)) continue;

                    if (line.trim().length > 0) {
                        currentTask.body = currentTask.body ? currentTask.body + '\n' + line : line;
                    }
                }
            }
        }

        // Return all tasks flattened to check them
        const allTasks = [];
        const traverse = (nodes) => {
            for (const node of nodes) {
                allTasks.push(node);
                if (node.children) traverse(node.children);
            }
        };
        traverse(rootTasks);
        return allTasks;
    }
}

const tasks = OrgParserJS.parse('test.org', content);
console.log(JSON.stringify(tasks, null, 2));
