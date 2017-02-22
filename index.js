/* eslint-disable no-console, camelcase */
const chalk = require('chalk');

const Runner = require('./lib/oh.runner');
const updateablePromise = require('./lib/updateable-promise');

// generic error handling, we don't need to handle them anywhere else
const handleError = err => {
    console.log(chalk.black.bgRed(`OH NO ${err.stack || err}`));
    process.exit(1);
};
process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

// variables that are/can be set by oh
const before = updateablePromise();
const after = updateablePromise();

const userTasks = require('./oh.js');

const oh = new Runner(userTasks);

// run task if we can
before().then(() => oh.run('compile')).then(after);
