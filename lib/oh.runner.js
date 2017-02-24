/* eslint-disable no-underscore-dangle */

const chalk = require('chalk');
const Task = require('./oh.task');

function logState(stack, done = false) {
    const state = chalk.dim(done ? '!' : '');
    const notification = `OH_${stack.reverse().join(chalk.dim('?'))}${state}`;
    // eslint-disable-next-line no-console
    console.log(`${chalk.black.bgGreen(`${notification}`)}`);
}

module.exports = class runner {
    constructor(tasks, args) {
        this.args = args;
        this.tasks = Object.keys(tasks).reduce((ohTasks, taskName) =>
            Object.assign(ohTasks, {
                [taskName]: new Task(taskName, tasks[taskName], this)
            }), {});
    }

    before() {
        if (this.tasks.__before) {
            Promise.resolve(this.tasks.__before.runTask(this.args));
        }
        return Promise.resolve();
    }

    after() {
        if (this.tasks.__after) {
            Promise.resolve(this.tasks.__after.runTask(this.args));
        }
        return Promise.resolve();
    }

    run(task, stack = []) {
        // parallel tasks are passed in as an array
        if (Array.isArray(task)) {
            return Promise.all(
                task.map(parallelTask => this.run(parallelTask, stack))
            );
        }

        logState([task, ...stack]);

        const ohTask = this.tasks[task];

        if (!ohTask) {
            throw new Error(`The task called '${task}' does not exist`);
        }

        return Promise.resolve(ohTask.runTask([task, ...stack]))
            .then(() => logState([task, ...stack], true));
    }
};
