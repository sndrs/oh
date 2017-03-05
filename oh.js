module.exports = {
    main() {
        return this.run('logOpts').then(() => this.run('other'));
    },

    other() {
        return this.run(['other2', 'ls']);
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
        return this.exec('ls -l');
    },

    __after() {
        this.info("don't forget to do that thing");
    },
};
