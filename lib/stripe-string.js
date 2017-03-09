const termSize = require('term-size');
const stringWidth = require('string-width');

module.exports = (message, chalkOpts = _ => _) => {
    const width = termSize().columns;
    const filler = chalkOpts(
        Array(width - stringWidth(message) % width).join('/')
    );
    return `${message} ${filler}`;
};
