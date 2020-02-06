/**
 * Created by kostya on 02.03.17.
 */

var templateLoad = function (property) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML =
        '<div class="drop-zone">' +
            '<div>'+property.locales.textDrop+'</div>' +
            '<div>'+property.locales.textOr+'</div>' +
            '<div class="text-error"></div>' +
            '<div class="drop-zone-message">' +
            '<div><input class="file-load" type="file"></div></div>' +
            '</div>' +
        '</div>';

    return wrapper;
};



