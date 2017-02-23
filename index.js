/* eslint-disable no-console, camelcase */
const chalk = require('chalk');

const Runner = require('./lib/oh.runner');

// generic error handling, we don't need to handle them anywhere else
const handleError = err => {
    console.log(chalk.black.bgRed(`OH_NO_${err.stack || err}`));
    process.exit(1);
};
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

const userTasks = require('./oh.js');
const yargs = require('yargs').usage('$0 <cmd> [args]').alias('h', 'help');

Object.keys(userTasks)
    .filter(task => !task.includes('__'))
    .sort()
    .forEach(task => yargs.command(task));

const { _: tasksToRun } = yargs.help().argv;

const oh = new Runner(userTasks);

oh
    .before()
    .then(() =>
        tasksToRun.reduce(
            (allTasks, task) => allTasks.then(() => oh.run(task)),
            Promise.resolve()
        ))
    .then(() => oh.after());
