/*global module:false*/
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.1.2',
            banner: '/*! Localisr - v<%= meta.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://github.com/IneffablePigeon/Localisr\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            'Giles Lavelle, Oliver Lane; Licensed MIT */'
        },
        lint: {
            files: ['extension/localisr.js']
        },
        qunit: {
            files: []
        },
        concat: {
            dist: {
                src: [
                    'src/intro.js',
                    'src/time.js', 'src/price.js',
                    'src/main.js',
                    'src/outro.js'
                ],
                dest: 'extension/localisr.js'
            }
        },
        min: {
            dist: {
            src: ['<banner>', 'extension/localisr.js'],
            dest: 'extension/localisr.min.js'
            }
        },
        watch: {
            files: '<config:concat.dist.src>',
            tasks: 'concat'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true,
                '$': true,
                accounting: true,
                money: true,
                moment: true,
                Localisr: true,
                chrome: true,
                'console': true
            }
        },
        uglify: {}
    });

    // Default task.
    grunt.registerTask('default', 'concat lint min');
};
