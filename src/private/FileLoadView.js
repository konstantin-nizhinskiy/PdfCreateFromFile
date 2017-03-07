var FileLoadView = function(property){
    var _id=+new Date(),
        _templateLoad=templateLoad({
            id:_id,
            locales:property.locales
        }),
        _this=this,
        dropZone = _templateLoad.getElementsByClassName('drop-zone')[0],
        fileInput = _templateLoad.getElementsByClassName('file-load')[0],
        textError = _templateLoad.getElementsByClassName('text-error')[0];
    fileInput.addEventListener("change", function(event) {
        textError.innerText="";
        _this.addFile(event.target.files[0],
            {
                success:property.success,
                error:function(error){
                    textError.innerText=error;
                }
            });
    });
    dropZone.ondragover = function() {
        textError.innerText="";
        addClass('hover',dropZone);
        return false;
    };
    dropZone.ondragleave = function() {
        textError.innerText="";
        removeClass('hover',dropZone);
        return false;
    };
    dropZone.ondrop = function(event) {
        event.preventDefault();
        textError.innerText="";
        removeClass('hover',dropZone);
        addClass('drop',dropZone);
        var file = event.dataTransfer.files[0];
        _this.addFile(file,{
            success:property.success,
            error:function(error){
                textError.innerText=error;
            }
        });
    };

    return _templateLoad;
};