/* eslint-disable no-console, camelcase */

const execa = require('execa');
const chalk = require('chalk');
const sandbox = require('sandboxed-module');

const updateablePromise = require('./lib/updateable-promise');

// generic error handling, we don't need to handle them anywhere else
const handleError = err => {
    console.log(chalk.black.bgRed(`OH NO ${err.stack || err}`));
    process.exit(1);
};
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

// variables that are/can be set by oh
let OH_tasks;
const before = updateablePromise();
const after = updateablePromise();

// main task runner
const run = task => {
    // arrays of tasks are treated as parallel tasks
    if (Array.isArray(task)) {
        return Promise.all(task.map(run));
    }

    const OH_task = OH_tasks[task];
    console.log(chalk.black.bgGreen(`OH_${task}`));

    if (typeof OH_task === 'function') return OH_task();
    if (OH_task.then && OH_task.then === 'function') return OH_task;

    throw new Error(
        `The task called '${task}' should be a Function or a Promise...`
    );
    // });
};

// get tasks in oh.js, providing a some global helpers
OH_tasks = sandbox.require('./oh.js', {
    locals: {
        before,
        after,
        run,
        log(s) {
            console.log(chalk.green.dim(`«${s.split(' ').join('_')}»`));
        },
        exec(cmd) {
            const [binary, ...args] = cmd.trim().split(' ');
            return execa.sync(binary, [args], {
                stdio: 'inherit'
            });
        }
    }
});

// run task if we can
before().then(() => run('parallel')).then(after);
