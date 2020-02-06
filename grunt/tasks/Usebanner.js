"use strict";
var path = require('path'),
    grunt = require('grunt');
module.exports = {
    usebanner: {
        PdfCreateFromFile: {
            options: {
                position: 'top',
                banner: '/*<%= banner %>*/',
                linebreak: true
            },
            files: {
                src: [
                    'dist/**/*.js'

                ]
            }
        }
    }
};