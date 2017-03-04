const chalk = require('chalk');

const Task = require('./task');

function logState(context) {
    console.log(chalk.black.bgGreen(`RUN_${context.reverse().join('/')}`));
}

function runTask(taskName, { context = [], silent = false } = {}) {
    // parallel this.ohTasks are passed in as an array
    if (Array.isArray(taskName)) {
        return Promise.all(
            taskName.map(parallelTask => runTask(parallelTask, context))
        );
    }

    if (!silent) logState([taskName, ...context]);

    const task = runTask.tasks[taskName];

    // if the task exists, run it
    if (task) {
        task.context = [taskName, ...context];
        return Promise.resolve(task.task());
    }

    // if this isn't a silent task, error
    if (!silent) {
        throw new Error(`The task called '${taskName}' does not exist`);
    }

    // it doesn't exist, but it's silent, so just silently fail
    return Promise.resolve();
}

runTask.addTasks = ({ userTasks = {}, userArgs = {} } = {}) => {
    runTask.tasks = Object.keys(userTasks).reduce((_, taskName) =>
        Object.assign(_, {
            [taskName]: new Task({
                taskName,
                userArgs,
                runTask,
                task: userTasks[taskName],
            }),
        }), {});
};

module.exports = runTask;
