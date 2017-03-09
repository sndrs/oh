/* eslint-disable class-methods-use-this */

const execa = require('execa');
const chalk = require('chalk');

const makeLoggable = require('./make-loggable');
const log = require('./log');

class Task {
    constructor({ taskName, task, userArgs, runTask } = {}) {
        if (typeof task !== 'function') {
            throw new Error(
                `The task called '${taskName}' should be a Function...`
            );
        }
        this.name = taskName;
        this.task = task.bind(this);
        this.context = [];
        this.args = userArgs;
        this.runTask = runTask;
    }

    run(taskName) {
        return this.runTask(taskName, { context: this.context });
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

    log(...messages) {
        return Promise.resolve(log(chalk.dim(makeLoggable(messages))));
    }

    info(...messages) {
        return Promise.resolve(
            log(
                `${chalk.bgBlue.black(` ${makeLoggable(messages)} `)}`,
                chalk.blue.dim
            )
        );
    }

    error(...messages) {
        throw new Error(makeLoggable(messages));
    }
}

module.exports = Task;
