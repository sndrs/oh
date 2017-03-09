/* eslint-disable class-methods-use-this */

const execa = require('execa');
const chalk = require('chalk');

const makeLoggable = require('./make-loggable');
const log = require('./log');

class Task {
    constructor({ taskName, task, userArgs, runTask, quiet } = {}) {
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
        this.quiet = quiet;
    }

    run(taskName) {
        return this.runTask(taskName, { context: this.context });
    }

    exec(
        cmd,
        opts = this.quiet
            ? {}
            : {
                  stdio: 'inherit',
              }
    ) {
        const [binary, ...args] = cmd.trim().split(' ');
        return execa(binary, [...args], opts);
    }

    log(...messages) {
        return Promise.all(
            messages.map(message =>
                Promise.resolve(log(chalk.dim(`LOG_${makeLoggable(message)}`))))
        );
    }

    info(...messages) {
        return Promise.all(
            messages.map(message =>
                Promise.resolve(
                    log(
                        `${chalk.bgBlue.black(`INFO_${makeLoggable(message)} `)}`,
                        chalk.blue.dim
                    )
                ))
        );
    }

    error(...messages) {
        throw new Error(makeLoggable(messages));
    }
}

module.exports = Task;
