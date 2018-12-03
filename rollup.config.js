import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/import.ts',
    output: {
        format: 'esm',
        file: `dist/import.js`
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript()
    ]
}