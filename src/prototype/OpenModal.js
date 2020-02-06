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



