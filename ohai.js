/* global beforeAll, afterAll, log, run, exec */

// optional, run before task list starts
beforeAll(() => {
    // e.g. check env, package versions etc
    log('beforeAll');
});

// optional, run after task list starts
afterAll(() => {
    // do any kind of clean up
    log('afterAll');
});

module.exports = {
    // run if `oh` has no input tasks (or `oh default`)
    default() {
        // run `log` task
        run('log');

        return run('clean').then(() => {
            log("i've cleaned up");
        });
    },

    // `oh log` simple function that returns nothing
    log() {
        log('hi Lorem ipsum dolor sit amet');
    },

    // `oh listCWD` simple command
    listCWD() {
        run('log');
        exec('ls -la');
    },

    // `oh thing2` Promise method
    thing2: Promise.resolve('hi'),

    // `oh clean` function that returns
    clean() {
        return run('cleanJS');
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
