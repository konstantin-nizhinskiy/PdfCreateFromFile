"use strict";
var path = require('path'),
    grunt = require('grunt');
module.exports = {
    uglify: {
        options: {
            compress: {
                drop_console: true
            }
        },
        PdfCreateFromFile: {
            files: [
                {
                    'dist/js/PdfCreateFromFile.min.js': [
                        'dist/js/PdfCreateFromFile.js'
                    ]
                },
                {
                    expand: true,
                    cwd: 'src/locales',
                    src: '*.js',
                    dest: 'dist/js/locales',
                    rename: function (dst, src) {
                        return dst + '/' + src.replace('.js', '.min.js');
                    }
                }
            ]
        }

    }
};