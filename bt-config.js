const fs = require('fs-extra');

const babelifyOptions = fs.readJsonSync('.babelrc');
const transform = [
    [
        'babelify',
        babelifyOptions
    ]
];
module.exports = {
    build: {
        files: {
            'dist/resource-manager.js': ['src/resource-manager.js']
        },
        browserifyOptions: {
            standalone: 'ResourceManager',
            transform
        },
        minifyFiles: {
            'dist/resource-manager-min.js': ['dist/resource-manager.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            files: ['tests/*.js'],
            transform
        }
    }
};
