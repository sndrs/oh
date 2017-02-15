/* eslint-disable no-console */

const execa = require('execa');
const chalk = require('chalk');
const changeCase = require('change-case');

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

// variables that will/can be overridden by user config
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
        case 'string': {
            const [binary, ...args] = task.trim().split(' ');
            return execa(binary, [args], {
                stdio: 'inherit'
            });
        }
        case 'object':
            if (typeof task.then !== 'undefined') {
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

// public functions for use in ohfile.js
module.exports.beforeAll = fn => {
    beforeAll = () => promisify(fn);
};
module.exports.afterAll = fn => {
    afterAll = () => promisify(fn);
};
module.exports.run = run;
module.exports.log = function _log(s) {
    console.log(chalk.green.dim(`OH_«${s.split(' ').join('_')}»`));
};

// find tasks in ohfile
tasks = require('./ohfile');

// run task if we can
beforeAll().then(() => run('listCWD')).then(afterAll);
