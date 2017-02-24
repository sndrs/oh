module.exports = {
    __before() {
        this.log('this happens before the tasks start');
    },

    main() {
        return this.run('logOpts').then(() => this.run('other'));
    },

    other() {
        return this.run(['other2', 'ls']).then(() => this.log('ran others'));
    },

    other2() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    },

    ls() {
        return this.exec('ls');
    },

    logOpts() {
        this.log(this.args);
    },

    __after() {
        this.log('this happens after the tasks end');
    },
};
