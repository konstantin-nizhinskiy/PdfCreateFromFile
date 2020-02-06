/**
 * Created by kostya on 02.03.17.
 */

var templateList = function (property) {
    var wrapper = document.createElement('div');

    _files[property.storageId].forEach(function(row,key){
        var img,
            wrapperImg = document.createElement('div'),
            error='';
        wrapperImg.className="";
        if(row.isSupport===false){
            wrapperImg.className=" error-support";
            error='<div class="text-error">'+property.locales.errorTypeFileNotSupport+"</div>";
        }
        if(row.typeName=='image'){
            img='<img src="'+row.content+'" alt="" class="img-rounded">'
        }else{
            img = '<div class="img-rounded">'+row.typeName+'</div>'
        }
        wrapperImg.className+=' wrapper-img';
        wrapperImg.innerHTML=
            img+
            '<div class="block-info">'+
                '<div><div class="label-file">'+property.locales.textFileName+'</div><div class="info-file">'+row.name+'</div></div>'+
                '<div><div class="label-file">'+property.locales.textFileSize+'</div><div class="info-file">'+row.sizeName+'</div></div>' +
                 error +
                '<div><button type="button" class="btn btn-default btn-delete " data-id="'+key+'" >'+property.locales.btnNameDelete+'</button></div>'+
            '</div>';
        wrapper.appendChild(wrapperImg)
    });
    return wrapper;
};



