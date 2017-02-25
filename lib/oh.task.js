/* eslint-disable class-methods-use-this */

const execa = require('execa');
const chalk = require('chalk');

module.exports = class Task {
    constructor(name, task, runner) {
        if (typeof task !== 'function') {
            throw new Error(
                `The task called '${name}' should be a Function...`
            );
        }
        this.name = name;
        this.task = task.bind(this);

        // we need a ref to the runner for `run`
        this.runner = runner;
        this.args = this.runner.args;

        // keep track what's been called up the tree
        this.stack = [];
    }

    runTask(stack) {
        this.stack = stack;
        return this.task();
    }

    run(taskName) {
        return this.runner.run(taskName, this.stack);
    }

    exec(
        cmd,
        opts = {
            stdio: 'inherit',
        }
    ) {
        const [binary, ...args] = cmd.trim().split(' ');
        return execa(binary, [...args], opts);
    }

    log(s) {
        const message = typeof s !== 'string'
            ? JSON.stringify(s, null, 2)
            : `«${s.split(' ').join('_')}»`;
        return console.log(chalk.green.dim(message));
    }
};
