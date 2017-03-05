/* eslint-disable import/no-dynamic-require, global-require */

const path = require('path');

const minimist = require('minimist');
const findUp = require('find-up');
const chalk = require('chalk');

const showHelp = require('./lib/help');

// generic error handling, we don't need to handle them anywhere else
const handleError = require('./lib/handle-error');
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

const argv = minimist(process.argv.slice(2), {
    boolean: ['version', 'help'],
    alias: { help: 'h', version: 'v' },
});

// find the oh.js
const ohFile = findUp.sync('oh.js');

// if it doesn't exist, error and stop
if (!ohFile) {
    const pkg = require('./package.json');
    showHelp({
        message: chalk.red(
            `No task manifest (oh.js) could be found.
See ${chalk.green(pkg.homepage)} to find out more.`
        ),
    });
    process.exit(1);
}

// get the list of tasks defined in the manifest
const userTasks = require(ohFile);

// if we have the help flag or no tasks, show help
if (argv.help || !argv._.length) {
    showHelp({ userTasks, ohFile });
    process.exit(0);
}

// if we have an unkown task/s, show help
const unknownTasks = argv._.filter(_ => !userTasks[_]);
if (unknownTasks.length) {
    showHelp({
        userTasks,
        ohFile,
        message: unknownTasks
            .map(_ => `${chalk.red(_)} ${chalk.dim('does not exist.')}`)
            .join('\n'),
    });
    process.exit(0);
}

// down to business...

// set cwd to wherever oh.js is
process.chdir(path.dirname(path.resolve(ohFile)));

// get the bits we needs from the args
const tasksToRun = argv._;
const userArgs = Object.keys(argv).reduce(
    (result, arg) => {
        if (['_', 'h', 'help', 'v', 'version', '$0'].some(_ => _ === arg)) {
            return result;
        }
        return Object.assign(result, { [arg]: argv[arg] });
    },
    {}
);

// turn the functions exported by oh.js into OhTasks
const runTask = require('./lib/runTask');
runTask.addTasks({ userTasks, userArgs });

runTask('__before', { silent: true })
    .then(() =>
        tasksToRun.reduce(
            (allTasks, taskToRun) => allTasks.then(() => runTask(taskToRun)),
            Promise.resolve()
        ))
    .then(() => runTask('__after', { silent: true }));
