const path = require('path');

const chalk = require('chalk');

const stripeString = require('./stripe-string');

module.exports = function showHelp(
    {
        userTasks = null,
        ohFilePath = null,
        message = '',
    } = {}
) {
    console.log(
        chalk.green(
            `
${chalk.dim(stripeString('OH_usage'))}
  oh [tasks...] [args]
  
${chalk.dim(stripeString(`OH_tasks ${ohFilePath ? chalk.dim(`(found in ${path.relative('.', ohFilePath)})`) : ''}`))}
  ${userTasks ? Object.keys(userTasks)
                      .filter(_ => !_.startsWith('__'))
                      .join('\n  ') : chalk.dim('none')}
                      
${chalk.dim(stripeString('OH_options'))}
  -h, --help       output usage information            [boolean]
  -v, --version    output the version number           [boolean]
  -q, --quiet      only log error output from tasks    [boolean]
  --oh             path to an oh.js manifest            [string]
${message ? `\n${message}` : ''}`
        )
    );
};
