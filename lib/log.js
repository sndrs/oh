const chalk = require('chalk');

const stripeString = require('./stripe-string');

module.exports = (message, stripe) => {
    console.log(
        stripeString(chalk.green(message.trim()), stripe || chalk.dim.green)
    );
};
