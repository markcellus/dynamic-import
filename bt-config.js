const fs = require('fs-extra');

const babelifyOptions = fs.readJsonSync('.babelrc');
const transform = [
    [
        'babelify',
        babelifyOptions
    ]
];
module.exports = {
    tests: {
        mocha: {
            files: ['tests/*.js'],
            transform
        }
    }
};
