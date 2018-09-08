const formats = [
    {format: 'esm', extension: 'js'},
    {format: 'umd', extension: 'umd.js'},
];

const configs = formats.map(({format, extension}) => {
    const filePath = 'resource-manager';
    return {
        input: `src/${filePath}.js`,
        output: {
            name: 'ResourceManager ',
            format,
            file: `dist/${filePath}.${extension}`
        }
    };
});

export default configs;