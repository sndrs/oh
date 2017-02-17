/* global before, after, log, run, exec */

before(() => {
    log('this happens before the tasks start');
});

after(() => {
    log('this happens after the tasks end');
});

module.exports = {
    default() {
        run('log');

        return run('clean').then(() => {
            log("i've cleaned up");
        });
    },

    log() {
        log('hi Lorem ipsum dolor sit amet');
    },

    parallel() {
        return run(['wait2Seconds', 'wait2point5Seconds']).then(() =>
            run('wait2Seconds'));
    },

    wait2Seconds() {
        return new Promise(resolve => {
            setTimeout(
                () => {
                    log('2 seconds have passed');
                    resolve();
                },
                2000
            );
        });
    },

    wait2point5Seconds() {
        return new Promise(resolve => {
            setTimeout(
                () => {
                    log('2.5 seconds have passed');
                    resolve();
                },
                2500
            );
        });
    },

    listCWD() {
        run('log');
        exec('ls -la');
    },

    thing2: Promise.resolve('hi'),

    clean() {
        return run('cleanJS');
    },

    cleanJS: () => new Promise((resolve, reject) => {
        setTimeout(
            () => {
                reject('failed');
            },
            2000
        );
    })
};
