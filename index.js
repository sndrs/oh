/* eslint-disable no-console, camelcase */
const chalk = require('chalk');

const Runner = require('./lib/oh.runner');

// generic error handling, we don't need to handle them anywhere else
const handleError = err => {
    console.log(chalk.black.bgRed(`OH_NO_${err.stack || err}`));
    process.exit(1);
};
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

const userTasks = require('./oh.js');

const oh = new Runner(userTasks);

// run task if we can
oh.before().then(() => oh.run('compile')).then(() => oh.after());
