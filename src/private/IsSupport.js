var isSupport = function(type,storageId,countLength){
    if (_supportTypeImg.indexOf(type.toUpperCase()) > -1) {
        return true;
    }
    if (_supportTypeText.indexOf(type.toUpperCase()) > -1) {
        return true;
    }
    if (_supportTypeHtml.indexOf(type.toUpperCase()) > -1) {
        return true;
    }
    if (type.toUpperCase() == 'PDF' && _files[storageId].length==countLength||0) {
        return true;
    }
    return false;
};
var isSupports = function(storageId){
    _files[storageId].forEach(function(row){
        row.isSupport=isSupport(row.typeName,storageId,1);
    });
};