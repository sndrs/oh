const chalk = require('chalk');
const yargs = require('./yargs');

module.exports = err => {
    if (err.message === 'unknownTask') {
        yargs.showHelp();
    } else {
        console.log(chalk.black.bgRed(`OH_NO_${err.stack || err}`));
        console.log(chalk.red('OH_exit'));
        process.exit(1);
    }
};
