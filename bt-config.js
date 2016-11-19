'use strict';
var srcTest = {
    mocha: {
        files: ['tests/*.js']
    }
};

var distTest = Object.assign({}, srcTest, {
  requires: {
      '../src/resource-manager': './dist/resource-manager'
  }
});

module.exports = {
    production: {
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
            bannerFiles: ['dist/*'],
        },
        tests: [srcTest, distTest]
    },
    development: {
        watch: true,
        tests: srcTest
    },
};
