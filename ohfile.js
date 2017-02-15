// not necessary, but provide some helpers
const oh = require('./src/index.js');

// optional, run before task list starts
oh.beforeAll(() => {
    // e.g. check env, package versions etc
    oh.log('beforeAll');
});

// optional, run after task list starts
oh.afterAll(() => {
    // do any kind of clean up
    oh.log('afterAll');
});

module.exports = {
    // run if `oh` has no input tasks (or `oh default`)
    default() {
        // run `log` task
        oh.run('log');

        return oh.run('clean').then(() => {
            oh.log("i've cleaned up");
        });
    },

    // `oh log` simple function that returns nothing
    log() {
        oh.log('hi Lorem ipsum dolor sit amet');
    },

    // `oh listCWD` simple command
    listCWD: 'ls -la',

    // `oh thing2` Promise method
    thing2: Promise.resolve('hi'),

    // `oh clean` function that returns
    clean() {
        return oh.run('cleanJS');
    },

    // `oh cleanJS` promise
    cleanJS: () => new Promise((resolve, reject) => {
        setTimeout(
            () => {
                reject('failed');
            },
            2000
        );
    })
};
