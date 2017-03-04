/* eslint-disable class-methods-use-this */

const execa = require('execa');
const chalk = require('chalk');
const termSize = require('term-size');
const stringWidth = require('string-width');

const normaliseMessages = require('./normalise-messages');

const formatMessage = message => {
    const width = termSize().columns;
    const filler = Array(width - stringWidth(message) % width).join('/');
    return `${message} ${filler}`;
};

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
        return Promise.resolve(
            console.log(chalk.green.dim(normaliseMessages(messages)))
        );
    }

    info(...messages) {
        return Promise.resolve(
            console.log(
                `\n${chalk.blue(formatMessage(normaliseMessages(messages)))}`
            )
        );
    }

    error(...messages) {
        throw new Error(normaliseMessages(messages));
    }
}

module.exports = Task;
