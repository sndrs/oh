/* eslint-disable no-underscore-dangle */

const chalk = require('chalk');

const Task = require('./oh.task');

function logState(stack) {
    console.log(chalk.black.bgGreen(`RUN_${stack.reverse().join('/')}`));
}

module.exports = class runner {
    constructor(tasks, args) {
        this.args = args;
        this.tasks = Object.keys(tasks).reduce((ohTasks, taskName) =>
            Object.assign(ohTasks, {
                [taskName]: new Task(taskName, tasks[taskName], this),
            }), {});
    }

    before() {
        return Promise.resolve(
            this.tasks.__before ? this.tasks.__before.runTask(this.args) : null
        );
    }

    after() {
        return Promise.resolve(
            this.tasks.__after ? this.tasks.__after.runTask(this.args) : null
        );
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

        return Promise.resolve(ohTask.runTask([task, ...stack]));
    }
};
