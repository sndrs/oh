const chalk = require('chalk');
const Task = require('./oh.task');

module.exports = class runner {
    constructor(tasks) {
        this.tasks = Object.keys(tasks).reduce((ohTasks, taskName) =>
            Object.assign(ohTasks, {
                [taskName]: new Task(taskName, tasks[taskName], this)
            }), {});
    }

    before() {
        if (this.tasks.OH_before) {
            Promise.resolve(this.tasks.OH_before.runTask());
        }
        return Promise.resolve();
    }

    after() {
        if (this.tasks.OH_after) Promise.resolve(this.tasks.OH_after.runTask());
        return Promise.resolve();
    }

    run(task, stack = []) {
        // parallel tasks are passed in as an array
        if (Array.isArray(task)) {
            return Promise.all(
                task.map(parallelTask => this.run(parallelTask, stack))
            );
        }

        // eslint-disable-next-line no-console
        console.log(
            chalk.black.bgGreen(`OH_${[task, ...stack].reverse().join(':')}`)
        );

        const ohTask = this.tasks[task];

        if (!ohTask) {
            throw new Error(`The task called '${task}' does not exist`);
        }

        return Promise.resolve(ohTask.runTask([task, ...stack]));
    }
};
