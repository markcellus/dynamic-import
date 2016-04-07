'use strict';
module.exports = {
    dist: 'dist',
    build: {
        files: {
            'dist/resource-manager.js': ['src/resource-manager.js']
        },
        browserifyOptions: {
            standalone: 'ResourceManager'
        },
        minifyFiles: {
            'dist/resource-manager-min.js': ['dist/resource-manager.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};
