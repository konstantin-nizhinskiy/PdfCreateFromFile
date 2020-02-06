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