(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // the AMD loader.
        define(['pdfMake',"JSZip"], factory);
    } else if (typeof module === "object" && module.exports) {
        // the CommonJS loader.
        module.exports = factory(require('pdfMake'),require('JSZip'));
    } else {
        if (!root.pdfMake) {
            throw 'not fount module pdfMake https://github.com/bpampuch/pdfmake'
        }
        if (!root.JSZip) {
            throw 'not fount module JSZip https://github.com/Stuk/jszip'
        }
        root.PdfCreateFromFile = factory(root.pdfMake,root.JSZip);

    }
}(this, function (pdfmake,JSZip) {
    /**
     *
     * @constructor
     * @param property {object|string}
     * @param property.wrapper {object}
     * @param property.storageId {string}
     * @param property.locale {string}
     * @param property.locales {object}
     * @param property.typeOpen {string} [download,open,print,getBase64,getBlob,getDataUrl]
     * @param property.documentName {string}
     * @param property.callback {function}
     */
    var PdfCreateFromFile = function (property) {
            property = property || {};
            if (property == 'setLocales') {
                return function (locale, locales) {
                    params['locales'][locale]=locales;
                }
            }

            this._wrapper = property.wrapper || document.body;
            this._locale = property.locale || 'en';
            this._typeOpen = property.typeOpen || 'download';
            this._documentName = property.documentName || 'Document';
            this._callback = property.callback;
            this._locales = property.locales||false;
            this._storageId = property.storageId || (+new Date());
            if (property.locales) {
                for (var key in property.locales) {
                    params['locales'][key] = property.locales[key];
                }
            }
            if (!_files[this._storageId]) {
                _files[this._storageId] = [];
            }
            if (_supportTypeOpen.indexOf(this._typeOpen) < 0) {
                throw 'Not fount typeOpen [' + this._typeOpen + ']'
            }
            if (_supportTypeOpenCallback.indexOf(this._typeOpen) > -1 && 'function' !== typeof this._callback) {
                throw 'Set function callback in param callback'
            }
        },
        _supportTypeOpen = ['download', 'open', 'print', 'getBase64', 'getBlob', 'getDataUrl'],
        _supportTypeImg = ['BMP', 'JPEG', 'JPG', 'JPE', 'JP2', 'PNG', "IMAGE"],
        _supportTypeText = ['TXT','LOG','JS', 'TEX', 'TEXT'],
        _supportTypeHtml = ['HTML'],
        _supportTypeOpenCallback = ['getBase64', 'getBlob', 'getDataUrl'],
        _files = [],
        params = {
            localesDefault: {
                errorArrayLoadFile: "Please delete all not support file",
                errorTypeFileNotSupport: "This type file not support",
                btnNameClose: "Close",
                btnNameAddFile: "Add file",
                btnNameDelete: "Delete",
                title: "Create PDF file",
                btnNameCreate: "Create PDF",
                textFileSize: "File size",
                textFileName: "File name",
                textDrop: "Drag a file here",
                textOr: "or"
            },
            locales: {}
        };


    // <%= template %>

    // <%= private %>

    // <%= prototype %>

    return PdfCreateFromFile;
}));