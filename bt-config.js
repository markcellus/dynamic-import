'use strict';
var transforms = [
    [
        "babelify",
        {
            "presets": [
                "es2015"
            ],
            "plugins": [
                [
                    "add-module-exports"
                ]
            ]
        }
    ]
];
var srcTest = {
    mocha: {
        files: ['tests/*.js'],
        browserifyOptions: {
            transform: transforms
        }
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
                standalone: 'ResourceManager',
                transform: transforms,
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
