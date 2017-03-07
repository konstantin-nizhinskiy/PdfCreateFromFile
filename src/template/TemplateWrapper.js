/**
 * Created by kostya on 02.03.17.
 */

var templateWrapper=function(property){
    var wrapper=document.createElement('div'),
        height = window.innerHeight;
    wrapper.innerHTML=
        '<div class="wrapper-pdf-create">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        property.locales.title+
                    '</div>'+
                    '<div class="modal-body" style="max-height: '+height+'px" >'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default btn-close " data-dismiss="modal">'+property.locales.btnNameClose+'</button>'+
                        '<button type="button" class="btn btn-primary btn-add">'+property.locales.btnNameAddFile+'</button>'+
                        '<span class="error-footer text-error"></span>'+
                        '<button type="button" class="btn btn-success btn-save">'+property.locales.btnNameCreate+'</button>'+
                    '</div>'+
                '</div>'+
        '</div>'+
    '</div>';
    return wrapper;
};



