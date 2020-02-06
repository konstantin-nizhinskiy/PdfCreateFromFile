"use strict";
var path = require('path'),
    grunt = require('grunt');
module.exports = {
    usebanner: {
        sass: {
            options: {
                position: 'top',
                banner: '/*<%= bannerWC %>*/',
                linebreak: true
            },
            files: {
                src: [
                    'dist/css/*.css'
                ]
            }
        }
    },
    sass: {
        PdfCreateFromFile:{
            options: {
                style: 'compressed'
            },
            files: {
                'dist/css/PdfCreateFromFile.min.css': 'src/sass/PdfCreateFromFile.scss'

            }
        }


    }
};