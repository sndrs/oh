module.exports = {
    main() {
        return this.run('logArgs').then(() => this.run('other'));
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

    logArgs() {
        this.log(this.args);
        return this.exec('ls -l');
    },

    test() {
        return this.exec('jest');
    },

    __after() {},
};
