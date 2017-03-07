PdfCreateFromFile.prototype.isValid = function () {
    var isValid=true;
    _files[this._storageId].forEach(function(row){
        if(row.isSupport===false){
            isValid=false;
        }
    });
    return isValid;

};