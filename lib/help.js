const path = require('path');

const chalk = require('chalk');

module.exports = function showHelp(
    {
        userTasks = null,
        ohFile = null,
        message = '',
    } = {}
) {
    console.log(
        `
Usage: oh [tasks...] [args]

Tasks: ${ohFile ? chalk.dim(`(${path.relative('.', ohFile)})`) : ''}
  ${userTasks ? Object.keys(userTasks)
                  .filter(_ => !_.startsWith('__'))
                  .join('\n  ') : chalk.dim('none')}

Options:
  -h, --help       output usage information
  -v, --version    output the version number
${message ? `\n${message}` : ''}`
    );
};
