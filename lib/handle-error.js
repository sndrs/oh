const chalk = require('chalk');

module.exports = err => {
    console.log(chalk.black.bgRed(`OH_NO_${err.stack || err}`));
    process.exit(1);
};
