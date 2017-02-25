const chalk = require('chalk');
const omit = require('lodash.omit');

const Runner = require('./lib/oh.runner');

// generic error handling, we don't need to handle them anywhere else
const handleError = err => {
    console.log(chalk.black.bgRed(`OH_NO_${err.stack || err}`));
    process.exit(1);
};
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

// get the list of user tasks from a local oh.js
const userTasks = require('./oh.js');

// parse the args from running `oh ...`
const yargs = require('yargs')
    .usage('$0 <cmd> [args]')
    .recommendCommands()
    .demandCommand(1, 'You need to supply at least one task to run.')
    .help()
    .version()
    .alias({
        version: 'v',
        help: 'h',
    });

// add all possible user tasks to the help output
Object.keys(userTasks)
    .filter(task => !task.includes('__'))
    .sort()
    .forEach(task => {
        yargs.command(task);
    });

// get the bits we needs from the args
const { _: tasksToRun } = yargs.argv;
const args = omit(yargs.argv, ['_', 'h', 'help', 'v', 'version', '$0']);

// if no command is supplied, just show help
if (!tasksToRun.length) {
    yargs.showHelp();
} else {
    const oh = new Runner(userTasks, args);
    oh
        .before()
        .then(() =>
            tasksToRun.reduce(
                (allTasks, task) => allTasks.then(() => oh.run(task)),
                Promise.resolve()
            ))
        .then(() => oh.after());
}
