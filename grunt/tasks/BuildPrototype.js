
"use strict";
var path = require('path'),
    grunt = require('grunt');
grunt.task.registerTask('buildPrototype','build prototype',function(){
    var prototype=[''],
        _private=[''],
        _template=[''];
    grunt.file.recurse('src/prototype', function (a) {
        prototype.push(grunt.file.read(a));
    });
    grunt.file.recurse('src/private', function (a) {
        _private.push(grunt.file.read(a));
    });
    grunt.file.recurse('src/template', function (a) {
        _private.push(grunt.file.read(a));
    });
    grunt.file.write('dist/js/PdfCreateFromFile.js',grunt.template.process(
        grunt.file.read('src/PdfCreateFromFile.js'),
        {
            data:{
                template:_template.join('\n'),
                private:_private.join('\n'),
                prototype:prototype.join('\n')
            }
        }));

});