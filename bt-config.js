const transform = [
    [
        'babelify',
        {
            'presets': [
                ['env']
            ],
            'plugins': [
                ['transform-runtime', {
                    'polyfill': true,
                    'regenerator': true,
                }]
            ],
        }
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
