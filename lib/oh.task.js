/* eslint-disable class-methods-use-this */

const execa = require('execa');
const chalk = require('chalk');
const termSize = require('term-size');
const stringWidth = require('string-width');

const handleError = require('./handle-error');
const normaliseMessages = require('./normalise-messages');

const formatMessage = message => {
    const width = termSize().columns;
    const filler = Array(width - stringWidth(message) % width).join('/');
    return `${message} ${filler}`;
};

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

    log(...messages) {
        return console.log(chalk.green.dim(normaliseMessages(messages)));
    }

    error(...messages) {
        throw new Error(normaliseMessages(messages));
    }

    info(...messages) {
        return console.log(
            `\n${chalk.blue(formatMessage(normaliseMessages(messages)))}`
        );
    }
};
