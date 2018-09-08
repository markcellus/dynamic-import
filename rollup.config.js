const formats = [
    {format: 'esm', file: 'resource-manager.esm.js'},
    {format: 'umd', file: 'resource-manager.js'},
];

const configs = formats.map(({format, file}) => {
    return {
        input: 'src/resource-manager.js',
        output: {
            name: 'ResourceManager ',
            format,
            file: `dist/${file}`
        }
    };
});

export default configs;