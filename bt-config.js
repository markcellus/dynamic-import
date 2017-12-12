let transform = [
    [
        "babelify",
        {
            "presets": [
                "es2015"
            ],
            "plugins": [
                "add-module-exports"
            ]
        }
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
