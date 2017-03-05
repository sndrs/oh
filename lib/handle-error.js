const chalk = require('chalk');

module.exports = err => {
    console.log(chalk.black.bgRed(`OH_NO_${err.stack || err}`));
    console.log(chalk.red('OH_exit'));
    process.exit(1);
};
