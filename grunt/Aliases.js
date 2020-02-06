"use strict";

module.exports = {
    build:[
        'buildPrototype',
        'uglify:PdfCreateFromFile',
        'usebanner:PdfCreateFromFile',
        'sass:PdfCreateFromFile'

    ]
};