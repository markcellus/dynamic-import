'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bt: {
            dist: 'dist',
            build: {
                files: {
                    'dist/resource-manager.js': ['src/resource-manager.js']
                },
                browserifyOptions: {
                    standalone: 'ResourceManager'
                }
            },
            min: {
                files: {
                    'dist/resource-manager-min.js': ['dist/resource-manager.js']
                }
            },
            banner: {
                files: ['dist/*']
            },
            tests: {
                mocha: {
                    src: ['tests/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('build-tools');
};