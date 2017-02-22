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
        return this.run(['cleanJS', 'cleanCSS']);
    },

    cleanJS() {
        this.log('clean JS');
    },

    cleanCSS() {
        this.exec('ls');
    }
};
