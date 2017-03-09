const chalk = require('chalk');
const termSize = require('term-size');
const stringWidth = require('string-width');

const format = (message, chalkOpts = _ => _) => {
    const width = termSize().columns;
    const filler = chalkOpts(
        Array(width - stringWidth(message) % width).join('/')
    );
    return `${message} ${filler}`;
};

module.exports = (message, stripe) => {
    console.log(format(chalk.green(message.trim()), stripe || chalk.dim.green));
};
