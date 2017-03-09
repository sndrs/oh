const util = require('util');

module.exports = message =>
    typeof message === 'string'
        ? message.trim()
        : util.inspect(message, { depth: null });
