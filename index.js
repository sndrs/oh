// generic error handling, we don't need to handle them anywhere else
const handleError = require('./lib/handle-error');
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

const yargs = require('./lib/yargs');

// get the list of user tasks from a local oh.js
const userTasks = require('./oh.js');

// get the bits we needs from the args
const { tasksToRun, userArgs } = yargs(userTasks);

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
