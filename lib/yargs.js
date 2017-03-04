const omit = require('lodash.omit');
const yargs = require('yargs')
    .usage('$0 <task> [task] [args]')
    .recommendCommands()
    .demandCommand(1, 'You need to supply at least one task to run.')
    .help('help', 'Show help (this)')
    .updateStrings({
        'Commands:': 'Available tasks:',
    })
    .version()
    .alias({
        version: 'v',
        help: 'h',
    });

module.exports = userTasks => {
    // add all possible user tasks to the help output
    Object.keys(userTasks)
        .filter(task => !task.includes('__'))
        .sort()
        .forEach(task => {
            yargs.command(task);
        });

    const { _: tasksToRun } = yargs.argv;
    const userArgs = omit(yargs.argv, ['_', 'h', 'help', 'v', 'version', '$0']);

    return {
        tasksToRun,
        userArgs,
    };
};
