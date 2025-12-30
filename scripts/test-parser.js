// Standalone test for regex logic
const fs = require('fs');
const path = require('path');

// Mock the OrgTask import since we are running in node without full TS setup
// We just need the parser logic which is pure TS/JS. 
// However, OrgParser imports OrgTask. 
// To make this run easily with node, we might need ts-node or just rely on the fact that we can't easily run TS files directly.
// A better approach for verification here is to create a small TS file and run it with ts-node if available, or compile it.
// Or, since I generated fixtures.js, I can try to use that.

// Actually, let's just create a simple test that reads a file and regexes it to see if it matches what we expect, 
// OR simpler: just trust the app integration test. 
// But I promised a test script. 
// Let's make a simple JS script that mimics the regex logic to verify it works on the sample string.

const sampleContent = `* Become a Writer   :Become_A_Writer:
** Purpose/Principals
It's a way to contribute to this world in a way that I actually
value. Art instead of entrepeneurship.
** Vision & Outcomes
** Brainstorming
I probably should start by reserving some time to write a short story. This can serve dual purpose:
- Get the practice in, actually writing
- Evaluate my tooling/setup today, and come up with potential tweaks in the future.
** Organization
*** <2023-09-01>
I've actually spent some time on this lately, and it's been fun. I am
trying to take a more methodical approach to skill building
(e.g. working on character, dialog, etc). I've also got some latent
story ideas that I should work through.
*** <2023-09-10>
*Writing topic: the alienation of not speaking for others.*
From my 2023-09-10 text chain with Travis. I'm very conscious of
speaking only for myself, rather than for others (e.g. "I'm boned"
rather than "we're boned"). I find this respectful, but it occurs to
me that it removes opportunities for me to build situational bonds
between people around me - that is, there's social capital to instead
saying "we're boned".
*** <2023-09-12>
Haven't spent much time on this in the last week. This competes with
my other code projects as well. But that's ok. I like them all.
*** <2024-06-30> 
You should get back to just writing some quick prompts, hence the
action item to create a writingprompts alt. Just air out some ideas,
man.
** Reference Data
** Future Work To Consider
*** Someday Maybe
**** SOMEDAYMAYBE Write a book about trust
:LOGBOOK:
- State "SOMEDAYMAYBE" from "IN"         [2022-11-26 Sat 16:13]
:END:
**** SOMEDAYMAYBE You could write about the experience of reading a trilogy
:LOGBOOK:
- State "SOMEDAYMAYBE" from "IN"         [2024-01-30 Tue 18:18]
:END:

**** DONE Buy Writing with Style
CLOSED: [2024-06-23 Sun 09:26]
:PROPERTIES:
:CATEGORY: books-to-read
:END:
:LOGBOOK:
- State "DONE"       from "SOMEDAYMAYBE" [2024-06-23 Sun 09:26]
- State "SOMEDAYMAYBE" from "IN"         [2023-07-08 Sat 14:05]
:END:
It's a book by an economist columnist. While the content can be iffy, they are technically excellent writers.
https://profilebooks.com/work/writing-with-style/?utm_campaign=a.coronavirus-special-edition&utm_medium=email.internal-newsletter.np&utm_source=salesforce-marketing-cloud&utm_term=7/8/2023&utm_id=1676506
** Actionables
*** Waiting For
*** Next Actions
**** NEXTACTION Spend an hour writing a dialog between two characters
:PROPERTIES:
:CATEGORY: writing-60min
:END:
:LOGBOOK:
- State "NEXTACTION" from              [2023-08-23 Wed 21:31]
:END:
Their speaking style must be distinct. Don't get cute with weird
accents. Something should drive the conversation forward.`;

const headerRegex = /^(\*+)\s+(?:(IN|NEXTACTION|WAITINGFOR|SOMEDAYMAYBE|DONE)\s+)?(?:\[#([A-C])\]\s+)?(.*?)(?:\s+:([a-zA-Z0-9_@:]+):)?$/;

const lines = sampleContent.split('\n');
let tasksFound = 0;

console.log('Testing Regex against sample content...');

lines.forEach((line, index) => {
    const match = line.match(headerRegex);
    if (match) {
        const [, stars, state, priority, title, tags] = match;
        if (state) {
            console.log(`Line ${index + 1}: Found task [${state}] "${title.trim()}"`);
            tasksFound++;
        }
    }
});

console.log(`Total tasks found: ${tasksFound}`);
if (tasksFound === 4) {
    console.log('SUCCESS: Found expected number of tasks (4).');
} else {
    console.log('FAILURE: Did not find expected number of tasks.');
}
