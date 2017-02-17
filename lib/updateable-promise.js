module.exports = () => {
    let fn = () => {};

    return userFn => {
        if (typeof userFn === 'function') {
            fn = userFn;
            return false;
        }
        return new Promise((resolve, reject) => {
            try {
                return resolve(fn());
            } catch (e) {
                return reject(new Error(e));
            }
        });
    };
};
