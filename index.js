/* eslint-disable no-console */

const vm = require('vm');
const fs = require('fs');

const execa = require('execa');
const chalk = require('chalk');

// generic error handling, we don't need to handle them anywhere else
const handleError = err => {
    console.log(chalk.black.bgRed(`OH NO ${err.stack || err}`));
    process.exit(1);
};
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

// wrap function in a promise
const promisify = fn => new Promise((resolve, reject) => {
    try {
        return resolve(fn());
    } catch (e) {
        return reject(new Error(e));
    }
});

// variables that are/can be set by ohai
let tasks;
let beforeAll = () => Promise.resolve();
let afterAll = () => Promise.resolve();

// main task runner
const run = (taskName = 'default') => {
    const task = tasks[taskName];

    console.log(chalk.black.bgGreen(`OH_${taskName}`));

    switch (typeof task) {
        case 'function':
            return task();
        case 'object':
            // if it's a promise...
            if (typeof task.then === 'function') {
                return task;
            }
            throw new Error(
                `The task called '${taskName}' is not a Function, String or Promise`
            );
        default:
            throw new Error(
                `The task called '${taskName}' is not a Function, String or Promise`
            );
    }
};

// globals for ohai
const helpers = Object.assign(global, {
    module,
    run,
    beforeAll(fn) {
        beforeAll = () => promisify(fn);
    },
    afterAll(fn) {
        afterAll = () => promisify(fn);
    },
    log(s) {
        console.log(chalk.green.dim(`OH_«${s.split(' ').join('_')}»`));
    },
    exec(cmd) {
        const [binary, ...args] = cmd.trim().split(' ');
        return execa.sync(binary, [args], {
            stdio: 'inherit'
        });
    }
});

// get tasks in ohai, providing a some global helpers
tasks = vm.runInNewContext(fs.readFileSync('ohai.js'), helpers);

// run task if we can
beforeAll().then(() => run('listCWD')).then(afterAll);
