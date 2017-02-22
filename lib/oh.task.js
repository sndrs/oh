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
        this.runner = runner;

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

    exec(cmd) {
        const [binary, ...args] = cmd.trim().split(' ');
        return execa(binary, [...args], {
            stdio: 'inherit'
        });
    }

    log(s) {
        // eslint-disable-next-line no-console
        return console.log(chalk.green.dim(`«${s.split(' ').join('_')}»`));
    }
};
