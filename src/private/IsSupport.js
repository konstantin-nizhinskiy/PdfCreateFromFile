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