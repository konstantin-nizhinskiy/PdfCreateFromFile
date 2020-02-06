PdfCreateFromFile.prototype.waitStop=function(typeOpen,callback){
    if(this._templateWait){
        this._templateWait.remove();
    }
};