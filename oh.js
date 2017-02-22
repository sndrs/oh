/* global */

// this.before(() => {
//     this.log('this happens before the tasks start');
// });
//
// this.after(() => {
//     this.log('this happens after the tasks end');
// });

module.exports = {
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
    }
};
