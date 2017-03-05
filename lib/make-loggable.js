const util = require('util');

module.exports = messages =>
    messages
        .map(
            message =>
                typeof message === 'string'
                    ? message.trim()
                    : util.inspect(message, { depth: null })
        )
        .join(' ');
