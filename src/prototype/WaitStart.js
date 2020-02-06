PdfCreateFromFile.prototype.waitStart=function(){
    if(this._templateWait){
        this._templateWait.remove();
    }
    this._templateWait = templateWait({});
    this.getOption("wrapper").appendChild(this._templateWait)


};