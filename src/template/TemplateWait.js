var templateWait = function (property) {
    var wrapper = document.createElement('div');
    wrapper.className='wrapper-pdf-waite';
    wrapper.innerHTML =
    '<div class="floatingCirclesG">'+
        '<div class="f_circleG frotateG_01"></div>'+
        '<div class="f_circleG frotateG_02"></div>'+
        '<div class="f_circleG frotateG_03"></div>'+
        '<div class="f_circleG frotateG_04"></div>'+
        '<div class="f_circleG frotateG_05"></div>'+
        '<div class="f_circleG frotateG_06"></div>'+
        '<div class="f_circleG frotateG_07"></div>'+
        '<div class="f_circleG frotateG_08"></div>'+
    '</div>';

    return wrapper;
};
