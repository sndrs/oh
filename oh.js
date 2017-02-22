module.exports = {
    OH_before() {
        this.log('this happens before the tasks start');
    },

    compile() {
        return this.run('clean');
    },

    clean() {
        return this
            .run(['cleanJS', 'cleanCSS'])
            .then(() => this.log('cleaned up'));
    },

    cleanJS() {
        this.log('clean JS');
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    },

    cleanCSS() {
        return this.exec('ls');
    },

    OH_after() {
        this.log('this happens after the tasks end');
    }
};
