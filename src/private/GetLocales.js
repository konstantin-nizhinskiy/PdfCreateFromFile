var getLocale=function(locale){
    var locales;
    if(params['locales'][locale]){
        locales = params['locales'][locale];
    }else{
        locales = params['localesDefault'];
    }
    if(this._locales){
        for(var key in this._locales){
            locales[key]=this._locales[key];
        }
    }
    return locales;
};