/*
name: pdf-create-from-file
version: 1.1.1
author: Konstantin Nizhinskiy
date: 2020-02-06 13:02:35 

*/
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
     * @param property.maxCountFile {number} - Max count file you can add [0] if == 0 We do not check count file
     * @param property.listTypeFile {array} - List type file you can add if list is empty we check default file type
     * @param property.storageId {string}
     * @param property.locale {string}
     * @param property.locales {object}
     * @param property.typeOpen {string} [download,open,print,getBase64,getBlob,getDataUrl]
     * @param property.documentName {string}
     * @param property.urlPdfMerge {string} URL on app to merge pdf
     * @param property.callback {function}
     */
    var PdfCreateFromFile = function (property) {
            property = property || {};
            if (property == 'setLocales') {
                return function (locale, locales) {
                    params['locales'][locale]=locales;
                }
            }
            this._options={
                wrapper:property.wrapper || document.body,
                locale:property.locale || 'en',
                maxCountFile:property.maxCountFile || 0,
                listTypeFile:property.listTypeFile || [],
                typeOpen:property.typeOpen || 'download',
                documentName:property.documentName || 'Document',
                callback:property.callback,
                locales:property.locales||false,
                urlPdfMerge:property.urlPdfMerge||false,
                storageId:property.storageId || (+new Date())

            };
            //this._wrapper = property.wrapper || document.body;
            //this._locale = property.locale || 'en';
            //this._maxCountFile = property.maxCountFile || 0;
            //this._listTypeFile = property.listTypeFile || [];
            //this._typeOpen = property.typeOpen || 'download';
            //this._documentName = property.documentName || 'Document';
            //this._callback = property.callback;
            //this._locales = property.locales||false;
            //this._storageId = property.storageId || (+new Date());
            //_urlPdfMerge=property.urlPdfMerge||false;
            if (property.locales) {
                for (var key in property.locales) {
                    params['locales'][key] = property.locales[key];
                }
            }
            if (!_files[this.getOption("storageId")]) {
                _files[this.getOption("storageId")] = [];
            }
            if (_supportTypeOpen.indexOf(this.getOption("typeOpen")) < 0) {
                throw 'Not fount typeOpen [' + this.getOption("typeOpen") + ']'
            }
            if (_supportTypeOpenCallback.indexOf(this.getOption("typeOpen")) > -1 && 'function' !== typeof this.getOption("callback")) {
                throw 'Set function callback in param callback'
            }
        },
        _supportTypeOpen = ['download', 'open', 'print', 'getBase64', 'getBlob', 'getDataUrl','onlyContentFile'],
        _supportTypeImg = ['BMP', 'JPEG', 'JPG', 'JPE', 'JP2', 'PNG', "IMAGE"],
        _supportTypeText = ['TXT','LOG','JS', 'TEX', 'TEXT',"XML","JSON"],
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


    // 

    // 
var addClass= function( classname, element ) {
    var cn = element.className;
    //test for existance
    if( cn.indexOf( classname ) != -1 ) {
        return;
    }
    //add a space if the element already has class
    if( cn != '' ) {
        classname = ' '+classname;
    }
    element.className = cn+classname;
};

var FileListView = function (property,main) {
    var _id = +new Date(),
        wrapper = document.createElement('div'),
        render;

    render = function () {
        var _templateList = templateList({
                id: _id,
                storageId: property.storageId,
                locales: property.locales
            }),
            btnDelete = _templateList.getElementsByClassName('btn-delete');

        for (var i = 0; i < btnDelete.length; i++) {
            btnDelete[i].onclick = function (atr) {
                var _filesNew = [],
                    _id = atr.target.dataset.id;
                _files[property.storageId].forEach(function (row, key) {
                    if (_id != key) {
                        _filesNew.push(row)
                    }

                });
                _files[property.storageId] = _filesNew;
                if (wrapper.children.length) {
                    wrapper.children[0].remove();
                }

                _files[property.storageId].forEach(function(row){
                    row.isSupport=isSupport(row.typeName,main);
                });
                isSupports(main);
                wrapper.appendChild(render());
                property.changeFile();
            }
        }
        return _templateList;
    };
    wrapper.appendChild(render());

    return wrapper;
};
var FileLoadView = function(property){
    var _id=+new Date(),
        _templateLoad=templateLoad({
            id:_id,
            locales:property.locales
        }),
        _this=this,
        dropZone = _templateLoad.getElementsByClassName('drop-zone')[0],
        fileInput = _templateLoad.getElementsByClassName('file-load')[0],
        textError = _templateLoad.getElementsByClassName('text-error')[0];
    fileInput.addEventListener("change", function(event) {
        textError.innerText="";
        _this.addFile(event.target.files[0],
            {
                success:property.success,
                error:function(error){
                    textError.innerText=error;
                }
            });
    });
    dropZone.ondragover = function() {
        textError.innerText="";
        addClass('hover',dropZone);
        return false;
    };
    dropZone.ondragleave = function() {
        textError.innerText="";
        removeClass('hover',dropZone);
        return false;
    };
    dropZone.ondrop = function(event) {
        event.preventDefault();
        textError.innerText="";
        removeClass('hover',dropZone);
        addClass('drop',dropZone);
        var file = event.dataTransfer.files[0];
        _this.addFile(file,{
            success:property.success,
            error:function(error){
                textError.innerText=error;
            }
        });
    };

    return _templateLoad;
};
var getLocale=function(locale){
    var locales={};
    if(params['locales'][locale]){
        for(var key in params['locales'][locale]){
            locales[key]=params['locales'][locale][key];
        }
        //locales = params['locales'][locale];
    }else{
        for(var key in params['localesDefault']){
            locales[key]=params['localesDefault'][key];
        }
        //locales = params['localesDefault'];
    }
    if(this.getOption("locales")){
        for(var key in this.getOption("locales")){
            locales[key]=this.getOption("locales")[key];
        }
    }
    return locales;
};
var isSupport = function(type,property,countLength){
    if (_supportTypeImg.indexOf(type.toUpperCase()) > -1) {
        return true;
    }
    if (_supportTypeText.indexOf(type.toUpperCase()) > -1) {
        return true;
    }
    if (_supportTypeHtml.indexOf(type.toUpperCase()) > -1) {
        return true;
    }
    if (type.toUpperCase() == 'PDF') {
        if(_files[property.getOption("storageId")].length==countLength||0){
            return true;
        }
        if(property.getOption("urlPdfMerge")){
            return true;
        }

    }
    return false;
};
var isSupports = function(property){
    _files[property.getOption("storageId")].forEach(function(row){
        row.isSupport=isSupport(row.typeName,property,1);
    });
};
function ParseContainer(cnt, e, p, styles) {
    var elements = [];
    var children = e.childNodes;
    if (children.length != 0) {
        for (var i = 0; i < children.length; i++) p = ParseElement(elements, children[i], p, styles);
    }
    if (elements.length != 0) {
        for (var i = 0; i < elements.length; i++) cnt.push(elements[i]);
    }
    return p;
}

function ComputeStyle(o, styles) {
    styles.forEach(function(singleStyle) {
        var styleDefinition = singleStyle.trim().toLowerCase().split(":");
        var style = styleDefinition[0];
        var value = styleDefinition[1];
        if (styleDefinition.length == 2) {
            switch (style) {
                case "padding-left":
                    o.margin = [parseInt(value), 0, 0, 0];
                    break;
                case "font-size":
                    o.fontSize = parseInt(value);
                    break;
                case "text-align":
                    switch (value) {
                        case "right":
                        case "center":
                        case "justify":
                            o.alignment = value;
                            break;
                    }
                    break;
                case "font-weight":
                    switch (value) {
                        case "bold":
                            o.bold = true;
                            break;
                    }
                    break;
                case "text-decoration":
                    switch (value) {
                        case "underline":
                            o.decoration = "underline";
                            break;
                        case "line-through":
                            o.decoration = "lineThrough";
                            break;
                    }
                    break;
                case "font-style":
                    switch (value) {
                        case "italic":
                            o.italics = true;
                            break;
                    }
                    break;
                case "color":
                    o.color = value;
                    break;
                case "background-color":
                    o.background = value;
                    break;
            }
        }
    })
}

function ParseElement(cnt, e, p, styles) {
    var elementStyles = {
            "b": ["font-weight:bold"],
            "strong": ["font-weight:bold"],
            "u": ["text-decoration:underline"],
            "em": ["font-style:italic"],
            "i": ["font-style:italic"],
            "h1": ["font-size:16", "font-weight:bold"],
            "h2": ["font-size:12", "font-weight:bold"],
            "h3": ["font-size:10", "font-weight:bold"],
            "h4": ["font-size:10", "font-style:italic"],
            "h5": ["font-size:10"],
            "h6": ["font-size:10"],
            "a": ["color:blue", "text-decoration:underline"],
            "del": ["color:red", "text-decoration:line-through"],
            "ins": ["color:green", "text-decoration:underline"]
        },
        classStyles = {
            "delete": ["color:red", "text-decoration:line-through"],
            "insert": ["color:green", "text-decoration:underline"]
        };

    if (!styles) styles = [];
    styles=styles.concat(elementStyles[e.nodeName.toLowerCase()]||[]);
    if (e.getAttribute) {
        var nodeStyle = e.getAttribute("style");
        if (nodeStyle) {
            var ns = nodeStyle.split(";");
            for (var k = 0; k < ns.length; k++) styles.push(ns[k]);
        }
    }

    switch (e.nodeName.toLowerCase()) {
        case "#text": {
            var t = { text: e.textContent.replace(/\n/g, "") };
            if (styles) ComputeStyle(t, styles);
            p.text.push(t);
            break;
        }
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
            p.marginTop=5;
            p.marginBottom=5;
            ParseContainer(cnt, e, p, styles);
            break;
        case "b":
        case "strong":
        case "u":
        case "em":
        case "i":
        case "ins":
        case "del":
            ParseContainer(cnt, e, p, styles);
            break;
        case "span": {
            ParseContainer(cnt, e, p, styles);
            break;
        }
        case "br": {
            p = CreateParagraph();
            p.text=["\n"];
            cnt.push(p);
            break;
        }
        case "table":
        {
            var t = {
                table: {
                    widths: [],
                    body: []
                }
            }
            var border = e.getAttribute("border");
            var isBorder = false;
            if (border) if (parseInt(border) == 1) isBorder = true;
            if (!isBorder) t.layout = 'noBorders';
            ParseContainer(t.table.body, e, p, styles);

            var widths = e.getAttribute("widths");
            if (!widths) {
                if (t.table.body.length != 0) {
                    if (t.table.body[0].length != 0) for (var k = 0; k < t.table.body[0].length; k++) t.table.widths.push("*");
                }
            } else {
                var w = widths.split(",");
                for (var k = 0; k < w.length; k++) t.table.widths.push(w[k]);
            }
            cnt.push(t);
            break;
        }
        case "tbody": {
            ParseContainer(cnt, e, p, styles);
            //p = CreateParagraph();
            break;
        }
        case "tr": {
            var row = [];
            ParseContainer(row, e, p, styles);
            cnt.push(row);
            break;
        }
        case "td": {
            p = CreateParagraph();
            var st = {stack: []}
            st.stack.push(p);

            var rspan = e.getAttribute("rowspan");
            if (rspan) st.rowSpan = parseInt(rspan);
            var cspan = e.getAttribute("colspan");
            if (cspan) st.colSpan = parseInt(cspan);

            ParseContainer(st.stack, e, p, styles);
            cnt.push(st);
            break;
        }
        case "div":case "p": {
        p = CreateParagraph();
        var st = {stack: []};
        st.stack.push(p);
        ComputeStyle(st, styles);
        ParseContainer(st.stack, e, p);

        cnt.push(st);
        break;
    }
        default: {
            console.error("Parsing for node " + e.nodeName + " not found");
            break;
        }
    }
    return p;
}
ParseHtml = function (htmlText,cnt) {
    var div=document.createElement('div');
    div.innerHTML=htmlText;
    cnt=cnt||[];
    for (var i = 0; i < div.children.length; i++) {
        if(['div','p','table'].indexOf(div.children[i].nodeName.toLowerCase())<0){
            cnt.push(ParseElement(cnt, div.children[i], CreateParagraph(), []))
        }else{
            ParseElement(cnt, div.children[i], CreateParagraph(), []);
        }
    }
    return cnt;
};

function CreateParagraph() {
    var p = {text:[]};
    return p;
}

var removeClass = function( classname, element ) {
    var cn = element.className;
    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
    cn = cn.replace( rxp, '' );
    element.className = cn;
};
/**
 * Created by kostya on 02.03.17.
 */

var templateList = function (property) {
    var wrapper = document.createElement('div');

    _files[property.storageId].forEach(function(row,key){
        var img,
            wrapperImg = document.createElement('div'),
            error='';
        wrapperImg.className="";
        if(row.isSupport===false){
            wrapperImg.className=" error-support";
            error='<div class="text-error">'+property.locales.errorTypeFileNotSupport+"</div>";
        }
        if(row.typeName=='image'){
            img='<img src="'+row.content+'" alt="" class="img-rounded">'
        }else{
            img = '<div class="img-rounded">'+row.typeName+'</div>'
        }
        wrapperImg.className+=' wrapper-img';
        wrapperImg.innerHTML=
            img+
            '<div class="block-info">'+
                '<div><div class="label-file">'+property.locales.textFileName+'</div><div class="info-file">'+row.name+'</div></div>'+
                '<div><div class="label-file">'+property.locales.textFileSize+'</div><div class="info-file">'+row.sizeName+'</div></div>' +
                 error +
                '<div><button type="button" class="btn btn-default btn-delete " data-id="'+key+'" >'+property.locales.btnNameDelete+'</button></div>'+
            '</div>';
        wrapper.appendChild(wrapperImg)
    });
    return wrapper;
};




/**
 * Created by kostya on 02.03.17.
 */

var templateLoad = function (property) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML =
        '<div class="drop-zone">' +
            '<div>'+property.locales.textDrop+'</div>' +
            '<div>'+property.locales.textOr+'</div>' +
            '<div class="text-error"></div>' +
            '<div class="drop-zone-message">' +
            '<div><input class="file-load" type="file"></div></div>' +
            '</div>' +
        '</div>';

    return wrapper;
};




var templateWait = function (property) {
    var wrapper = document.createElement('div');
    wrapper.className='wrapper-pdf-waite';
    wrapper.innerHTML =
    '<div class="floatingCirclesG">'+
        '<div class="f_circleG frotateG_01"></div>'+
        '<div class="f_circleG frotateG_02"></div>'+
        '<div class="f_circleG frotateG_03"></div>'+
        '<div class="f_circleG frotateG_04"></div>'+
        '<div class="f_circleG frotateG_05"></div>'+
        '<div class="f_circleG frotateG_06"></div>'+
        '<div class="f_circleG frotateG_07"></div>'+
        '<div class="f_circleG frotateG_08"></div>'+
    '</div>';

    return wrapper;
};

/**
 * Created by kostya on 02.03.17.
 */

var templateWrapper=function(property){
    var wrapper=document.createElement('div'),
        height = 540;//window.innerHeight;
    wrapper.innerHTML=
        '<div class="wrapper-pdf-create">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        property.locales.title+
                    '</div>'+
                    '<div class="modal-body" style="max-height: '+height+'px" >'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default btn-close " data-dismiss="modal">'+property.locales.btnNameClose+'</button>'+
                        '<button type="button" class="btn btn-primary btn-add">'+property.locales.btnNameAddFile+'</button>'+
                        '<span class="error-footer text-error"></span>'+
                        '<button type="button" class="btn btn-success btn-save">'+property.locales.btnNameCreate+'</button>'+
                    '</div>'+
                '</div>'+
        '</div>'+
    '</div>';
    return wrapper;
};





    // 
PdfCreateFromFile.prototype.addFile=function(file,property){
    var typeName, reader = new FileReader(),
        _this=this,
        locales=getLocale.call(this,this.getOption("locale")),
        _typeFile=file.name.split('.').pop();
    if(this.getOption("listTypeFile").length>0){
        var _isFileSupports=false;
        this.getOption("listTypeFile").forEach(function(row){
            if(_typeFile.toUpperCase()===row.toUpperCase()) {
                _isFileSupports=true;

            }
        });
        if(_isFileSupports==false){
            property.error(locales['errorTypeFileNotSupport']);
            return false;
        }
    }
    if(file.type.indexOf('image')>-1||_supportTypeImg.indexOf(_typeFile.toUpperCase())>-1){
        typeName='image';
    }else if(file.type.indexOf('html')>-1||_supportTypeHtml.indexOf(_typeFile.toUpperCase())>-1){
        typeName='html';
    }else if(file.type.indexOf('text')>-1||file.type.indexOf('xml')>-1||file.type.indexOf('json')>-1||_supportTypeText.indexOf(_typeFile.toUpperCase())>-1){
        typeName='text';
    }else if(file.type.indexOf('pdf')>-1){
        typeName='pdf';
    }else if(file.type.indexOf('zip')>-1){
        typeName='zip';
        JSZip().loadAsync(file).then(function (zip) {
            for(var key in zip.files){
                (function(zFile){
                    (function(typeNameZip,zFile){
                        var async='base64',
                            prefix='';
                        if(_supportTypeImg.indexOf(typeNameZip.toUpperCase())>-1){
                            prefix='data:image/'+typeNameZip.toLowerCase()+';base64,';
                            typeNameZip='image';
                            async='base64';
                        }else if(_supportTypeText.indexOf(typeNameZip.toUpperCase())>-1){
                            typeNameZip='text';
                            async='string';
                        }else if(_supportTypeHtml.indexOf(typeNameZip.toUpperCase())>-1){
                            typeNameZip='html';
                            async='string';
                        }

                        zFile.async(async).then(function (fileData) {
                            _files[_this.getOption("storageId")].push({
                                lastModified: +zFile.date,
                                name: zFile.name,
                                size: 0,
                                sizeName: 'ZIP',
                                type: typeNameZip,
                                typeName: typeNameZip,
                                content: prefix+fileData
                            });
                            isSupports(_this);
                            property.success();
                        })
                    }(zFile.name.split('.').pop(),zFile));
                }(zip.files[key]));
            }
            })
    }else{
        property.error(locales['errorTypeFileNotSupport']);
        return false;
    }
    if(typeName!='zip') {
        var _cp1251=false;
        reader.onload = function (e) {
            if(_cp1251==false && e.target.result.indexOf('encoding="windows-1251"')>-1){
                _cp1251=true;
                reader.readAsText(file, "windows-1251");
                return false;
            }
            var humanFileSize = function (size) {
                var i = Math.floor(Math.log(size) / Math.log(1024));
                return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
            };

            _files[_this.getOption("storageId")].push({
                lastModified: file.lastModified,
                name: file.name,
                size: file.size,
                sizeName: humanFileSize(file.size),
                type: file.type,
                typeName: typeName,
                content: e.target.result
            });
            isSupports(_this);
            property.success();
        };
        if(_supportTypeText.indexOf(typeName.toUpperCase())>-1 ||_supportTypeHtml.indexOf(typeName.toUpperCase())>-1){
            reader.readAsText(file, "UTF-8");

        } else {
            reader.readAsDataURL(file);
        }
    }


};
var eventCallback={};
/**
 * Bind event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
PdfCreateFromFile.prototype.on=function(event,callback){
    if('undefined' === typeof eventCallback[event]){
        eventCallback[event]={
            callback:[],
            callbackOnce:[]
        }
    }
    eventCallback[event].callback.push(callback);
};
/**
 * Bind once event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
PdfCreateFromFile.prototype.once=function(event,callback){
    if('undefined' === typeof eventCallback[event]){
        eventCallback[event]={
            callback:[],
            callbackOnce:[]
        }
    }
    eventCallback[event].callbackOnce.push(callback);
};
/**
 * Unbind event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
PdfCreateFromFile.prototype.off=function(event,callback){
    var _callback;
    if('function'===typeof callback){
        if(eventCallback[event].callback && eventCallback[event].callback.length>0){
            _callback=[];
            for(var i= 0; i<eventCallback[event].callback.length;i++){
                if('function' === typeof eventCallback[event].callback[i] && eventCallback[event].callback[i]!==callback){
                    _callback.push(eventCallback[event].callback[i])
                }
            }
            eventCallback[event].callback=_callback;
        }
        if(eventCallback[event].callbackOnce && eventCallback[event].callbackOnce.length>0){
            _callback=[];
            for(var i= 0; i<eventCallback[event].callbackOnce.length;i++){
                if('function' === typeof eventCallback[event].callbackOnce[i] && eventCallback[event].callbackOnce[i]!==callback){
                    _callback.push(eventCallback[event].callbackOnce[i])
                }
            }
            eventCallback[event].callbackOnce=_callback;
        }
    }else{
        delete eventCallback[event];
    }
};
/**
 * Trigger event
 *
 * @param event - name event
 * @example pdfCreateFromFile.trigger('test',1,2,3....)
 */
PdfCreateFromFile.prototype.trigger=function(event){
    if(eventCallback[event]){
        var args=[];
        for (var key in arguments){
            if(key!=0){
                args.push(arguments[key])
            }

        }
        if(eventCallback[event].callback && eventCallback[event].callback.length>0){

            for(var i= 0; i<eventCallback[event].callback.length;i++){
                if('function' === typeof eventCallback[event].callback[i]){
                    eventCallback[event].callback[i].apply(this,args)
                }
            }
        }
        if(eventCallback[event].callbackOnce && eventCallback[event].callbackOnce.length>0){
            for(var i= 0; i<eventCallback[event].callbackOnce.length;i++){
                if('function' === typeof eventCallback[event].callbackOnce[i]){
                    eventCallback[event].callbackOnce[i].apply(this,args)
                }
            }
            eventCallback[event].callbackOnce=[];
        }
    }
};


PdfCreateFromFile.prototype.getOption = function (key) {
    return this._options[key];

};
PdfCreateFromFile.prototype.isValid = function () {
    var isValid=true;
    _files[this.getOption("storageId")].forEach(function(row){
        if(row.isSupport===false){
            isValid=false;
        }
    });
    return isValid;

};
PdfCreateFromFile.prototype.openModal=function(typeOpen,callback){
    typeOpen=typeOpen||this.getOption("typeOpen");
    if(_supportTypeOpen.indexOf(typeOpen)<0){
        throw 'Not fount typeOpen ['+typeOpen+']'
    }
    if(_supportTypeOpenCallback.indexOf(typeOpen)>-1 && 'function'!==typeof callback){
        throw 'Set function callback in param callback'
    }

    this.getOption("wrapper").appendChild(this.view(typeOpen,callback))
};




PdfCreateFromFile.prototype.view=function(typeOpen,callback){
    var _id=+new Date(),
        _this=this,
        _locales=getLocale.call(this,this.getOption("locale")),
        _template=templateWrapper({
            id:_id,
            locales:_locales,
            btnNameClose:params.btnNameClose,
            btnNameAddFile:params.btnNameAddFile,
            btnNameCreate:params.btnNameCreate,
            title:params.title
        }),
        body = _template.getElementsByClassName('modal-body')[0],
        btnClose = _template.getElementsByClassName('btn-close')[0],
        btnAdd = _template.getElementsByClassName('btn-add')[0],
        errorFooter = _template.getElementsByClassName('error-footer')[0],
        btnSave = _template.getElementsByClassName('btn-save')[0],
        changeFile=function(){
            if(_files[_this.getOption("storageId")].length==0){
                btnAdd.style.display='none';
                btnSave.style.display='none';

                body.appendChild(FileLoadView.call(_this,{
                    locales:_locales,
                    success: function () {
                        btnAdd.style.display='block';
                        btnSave.style.display='block';
                        body.innerHTML = "";
                        body.appendChild(FileListView({
                            storageId:_this.getOption("storageId"),
                            locales:_locales,
                            changeFile:changeFile
                        }),_this);
                        changeFile();
                    }
                }));
            }else{
                if(_this.getOption("maxCountFile")>0){
                    if(_this.getOption("maxCountFile")<=_files[_this.getOption("storageId")].length){
                        btnAdd.style.display='none';
                    }else{
                        btnAdd.style.display='block';
                    }
                }
            }

        };


    btnClose.onclick=function(atr){
        _template.remove();
        _this.trigger('close');
    };
    btnSave.onclick=function(atr){
        errorFooter.innerText='';
        if(_this.isValid()===false){
            errorFooter.innerText=_locales['errorArrayLoadFile'];
            return false;
        }
        /** Off generation pdf get only content file in function callback */
        if(typeOpen=='onlyContentFile'){
            callback(_files[_this.getOption("storageId")]);
        }
        if(_files[_this.getOption("storageId")].length==1 && _files[_this.getOption("storageId")][0].typeName.toUpperCase()=='PDF'){
            switch (typeOpen){
                case 'getBase64':
                    callback(_files[_this.getOption("storageId")][0].content.substring(_files[_this.getOption("storageId")][0].content.indexOf("base64,") + 7));
                    _template.remove();
                    _this.trigger('close');
                    break;
                case 'getDataUrl':
                    callback(_files[_this.getOption("storageId")][0].content);
                    _template.remove();
                    _this.trigger('close');
                    break;
                default:
                    errorFooter.innerText='Work only function callback getBase64 getDataUrl';
            }
            return false;
        }
        var docDefinition = {content: []},
            pdf=[];
        _files[_this.getOption("storageId")].forEach(function(row,key){
            if(row.typeName=='image'){
                docDefinition.content.push({
                    "image":row.content,
                    "fit": [525, 700]
                });
            }
            if(row.typeName=='html'){
                ParseHtml(row.content,docDefinition.content);
            }
            if(row.typeName=='text'){
                docDefinition.content.push({
                    "text":row.content,
                    "fontSize": 8
                });
            }
            if(row.typeName.toUpperCase()=='PDF'){
                pdf.push(row.content.split(';base64,')[1]);
            }
        });
        var _mergePDF=function(data,callback){
            var xhr = new XMLHttpRequest();
            xhr.open("POST", _this.getOption("urlPdfMerge"), true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    _this.trigger('error', 'error:merge_pdf', xhr.statusText, xhr.status, xhr);
                    _this.trigger('error:merge_pdf', xhr.statusText, xhr.status, xhr);
                } else {
                    var res=JSON.parse(xhr.responseText);
                    if(res.file) {
                        callback(res.file)
                    }else{
                        _this.trigger('error', 'error:merge_pdf:res', "Error response from urlPdfMerge not return attr file");
                        _this.trigger('error:merge_pdf:res', "Error response from urlPdfMerge not return attr file");
                    }

                }

            };
            xhr.send(JSON.stringify(data))
        };

        switch (typeOpen){
            case 'download':
                pdfMake.createPdf(docDefinition).download(_this.getOption("documentName")+'.pdf');
                break;
            case 'open':
                pdfMake.createPdf(docDefinition).open();
                break;
            case 'print':
                pdfMake.createPdf(docDefinition).print();
                break;
            case 'getBase64':
                _this.waitStart();
                if (_this.getOption("urlPdfMerge") && pdf.length && pdf.length==_files[_this.getOption("storageId")].length){
                    _mergePDF({
                        "files": pdf,
                        "type": "base64"
                    }, function(data2){
                        callback(data2);
                        _this.waitStop();
                    })
                }else {
                    pdfMake.createPdf(docDefinition).getBase64(function (data) {
                        if (_this.getOption("urlPdfMerge") && pdf.length) {
                            _mergePDF({
                                "files": pdf.concat([data]),
                                "type": "base64"
                            }, function(data2){
                                callback(data2);
                                _this.waitStop();
                            })

                        } else {
                            callback(data);
                            _this.waitStop();
                        }

                    });
                }
                break;
            case 'getBlob':
                _this.waitStart();
                pdfMake.createPdf(docDefinition).getBlob(function(data){
                    callback(data);
                    _this.waitStop();
                });
                break;
            case 'getDataUrl':
                _this.waitStart();
                pdfMake.createPdf(docDefinition).getDataUrl(function(data){
                    callback(data);
                    _this.waitStop();
                });
                break;
        }
        _template.remove();
        _this.trigger('close');
    };
    btnAdd.onclick=function(atr){
        btnAdd.style.display='none';
        btnSave.style.display='none';
        _this.trigger('add:file');
        body.appendChild(FileLoadView.call(_this,{
            locales:_locales,
            success: function () {
                btnAdd.style.display='block';
                btnSave.style.display='block';
                body.innerHTML = "";
                body.appendChild(FileListView({
                    storageId:_this.getOption("storageId"),
                    locales:_locales,
                    changeFile:changeFile
                },_this));
                changeFile()
            }
        }));
        body.scrollTop = body.scrollHeight;
    };
    if(_files[_this.getOption("storageId")].length){
        body.appendChild(FileListView({
            storageId:_this.getOption("storageId"),
            locales:_locales,
            changeFile:changeFile
        },_this));
    }else{
        btnAdd.style.display='none';
        btnSave.style.display='none';
        body.appendChild(FileLoadView.call(_this,{
            locales:_locales,
            success: function () {
                btnAdd.style.display='block';
                btnSave.style.display='block';
                body.innerHTML = "";
                body.appendChild(FileListView({
                    storageId:_this.getOption("storageId"),
                    locales:_locales,
                    changeFile:changeFile
                },_this));
                changeFile();
            }
        }));


    }


    return _template;
};
PdfCreateFromFile.prototype.waitStart=function(){
    if(this._templateWait){
        this._templateWait.remove();
    }
    this._templateWait = templateWait({});
    this.getOption("wrapper").appendChild(this._templateWait)


};
PdfCreateFromFile.prototype.waitStop=function(typeOpen,callback){
    if(this._templateWait){
        this._templateWait.remove();
    }
};

    return PdfCreateFromFile;
}));