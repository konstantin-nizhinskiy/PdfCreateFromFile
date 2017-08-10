PdfCreateFromFile.prototype.addFile=function(file,property){
    var typeName, reader = new FileReader(),
        _this=this,
        locales=getLocale.call(this,this._locale),
        _typeFile=file.name.split('.').pop();
    if(this._listTypeFile.length>0){
        var _isFileSupports=false;
        this._listTypeFile.forEach(function(row){
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
                            _files[_this._storageId].push({
                                lastModified: +zFile.date,
                                name: zFile.name,
                                size: 0,
                                sizeName: 'ZIP',
                                type: typeNameZip,
                                typeName: typeNameZip,
                                content: prefix+fileData
                            });
                            isSupports(_this._storageId);
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

            _files[_this._storageId].push({
                lastModified: file.lastModified,
                name: file.name,
                size: file.size,
                sizeName: humanFileSize(file.size),
                type: file.type,
                typeName: typeName,
                content: e.target.result
            });
            isSupports(_this._storageId);
            property.success();
        };
        if(_supportTypeText.indexOf(typeName.toUpperCase())>-1 ||_supportTypeHtml.indexOf(typeName.toUpperCase())>-1){
            reader.readAsText(file, "UTF-8");

        } else {
            reader.readAsDataURL(file);
        }
    }


};