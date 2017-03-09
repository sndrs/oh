const path = require('path');

const chalk = require('chalk');

module.exports = function showHelp(
    {
        userTasks = null,
        ohFilePath = null,
        message = '',
    } = {}
) {
    console.log(
        `
Usage: oh [tasks...] [args]

Tasks: ${ohFilePath ? chalk.dim(`(${path.relative('.', ohFilePath)})`) : ''}
  ${userTasks ? Object.keys(userTasks)
                  .filter(_ => !_.startsWith('__'))
                  .join('\n  ') : chalk.dim('none')}

Options:
  -h, --help       output usage information            [boolean]
  -v, --version    output the version number           [boolean]
  -q, --quiet      only log error output from tasks    [boolean]
  --oh             path to an oh.js manifest            [string]
${message ? `\n${message}` : ''}`
    );
};
