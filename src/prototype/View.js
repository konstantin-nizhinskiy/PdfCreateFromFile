PdfCreateFromFile.prototype.view=function(typeOpen,callback){
    var _id=+new Date(),
        _this=this,
        _locales=getLocale.call(this,this._locale),
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
        btnSave = _template.getElementsByClassName('btn-save')[0];


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
        if(_files[_this._storageId].length==1 && _files[_this._storageId][0].typeName.toUpperCase()=='PDF'){
            switch (typeOpen){
                case 'getBase64':
                    callback(_files[_this._storageId][0].content.substring(_files[_this._storageId][0].content.indexOf("base64,") + 7));
                    _template.remove();
                    _this.trigger('close');
                    break;
                case 'getDataUrl':
                    callback(_files[_this._storageId][0].content);
                    _template.remove();
                    _this.trigger('close');
                    break;
                default:
                    errorFooter.innerText='Work only function callback getBase64 getDataUrl';
            }
            return false;
        }
        var docDefinition = {content: []};
        _files[_this._storageId].forEach(function(row,key){
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
        });

        switch (typeOpen){
            case 'download':
                pdfMake.createPdf(docDefinition).download(_this._documentName+'.pdf');
                break;
            case 'open':
                pdfMake.createPdf(docDefinition).open();
                break;
            case 'print':
                pdfMake.createPdf(docDefinition).print();
                break;
            case 'getBase64':
                _this.waitStart();
                pdfMake.createPdf(docDefinition).getBase64(function(data){
                    callback(data);
                    _this.waitStop();

                });
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
                    storageId:_this._storageId,
                    locales:_locales
                }));
            }
        }));
        body.scrollTop = body.scrollHeight;
    };
    if(_files[_this._storageId].length){
        body.appendChild(FileListView({
            storageId:_this._storageId,
            locales:_locales
        }));
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
                    storageId:_this._storageId,
                    locales:_locales
                }));
            }
        }));


    }


    return _template;
};