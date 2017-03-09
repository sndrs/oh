/* eslint-disable import/no-dynamic-require, global-require */

const path = require('path');
const fs = require('fs');

const minimist = require('minimist');
const findUp = require('find-up');
const chalk = require('chalk');

const showHelp = require('./lib/help');

// generic error handling, we don't need to handle them anywhere else
const handleError = require('./lib/handle-error');
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

// process user input
const argv = minimist(process.argv.slice(2), {
    boolean: ['version', 'help', 'quiet'],
    string: ['oh'],
    alias: { help: 'h', version: 'v', quiet: 'q' },
    default: {
        help: false,
        quiet: false,
    },
});

// find the oh.js
// eslint-disable-next-line no-nested-ternary
const ohFilePath = argv.oh
    ? fs.existsSync(argv.oh) ? argv.oh : null
    : findUp.sync('oh.js');

// if it doesn't exist, error and stop
if (argv.oh && !ohFilePath) {
    showHelp({
        message: chalk.red(`${argv.oh} could not be found.`),
    });
    process.exit(1);
}

// if it doesn't exist, error and stop
if (!ohFilePath) {
    const pkg = require('./package.json');
    showHelp({
        message: chalk.red(
            `No task manifest could be found.
See ${chalk.green(pkg.homepage)} to find out more.`
        ),
    });
    process.exit(1);
}

// get the list of tasks defined in the manifest
const userTasks = require(ohFilePath);

// if we have the help flag or no tasks, show help
if (argv.help || !argv._.length) {
    showHelp({ userTasks, ohFilePath });
    process.exit(argv.help ? 0 : 1);
}

// if we have an unkown task/s, show help
const unknownTasks = argv._.filter(_ => !userTasks[_]);
if (unknownTasks.length) {
    showHelp({
        userTasks,
        ohFilePath,
        message: unknownTasks
            .map(_ => `${chalk.red(_)} ${chalk.dim('does not exist.')}`)
            .join('\n'),
    });
    process.exit(0);
}

// down to business...

// set cwd to wherever oh.js is
process.chdir(path.dirname(path.resolve(ohFilePath)));

// get the bits we needs from the args
const tasksToRun = argv._;
const userArgs = Object.keys(argv).reduce(
    (result, arg) => {
        if (
            ['_', 'h', 'help', 'v', 'version', 'q', 'quiet', 'oh'].some(
                _ => _ === arg
            )
        ) {
            return result;
        }
        return Object.assign(result, { [arg]: argv[arg] });
    },
    {}
);

// turn the functions exported by oh.js into OhTasks
const runTask = require('./lib/runTask');
runTask.addTasks({
    userTasks,
    userArgs,
    quiet: argv.quiet,
});

runTask('__before', { silent: true })
    .then(() =>
        tasksToRun.reduce(
            (allTasks, taskToRun) => allTasks.then(() => runTask(taskToRun)),
            Promise.resolve()
        ))
    .then(() => runTask('__after', { silent: true }));
