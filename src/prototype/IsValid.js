PdfCreateFromFile.prototype.isValid = function () {
    var isValid=true;
    _files[this.getOption("storageId")].forEach(function(row){
        if(row.isSupport===false){
            isValid=false;
        }
    });
    return isValid;

};