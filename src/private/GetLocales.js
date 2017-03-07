var getLocale=function(locale){
    var locales={};
    if(params['locales'][locale]){
        for(var key in params['locales'][locale]){
            locales[key]=params['locales'][locale][key];
        }
        //locales = params['locales'][locale];
    }else{
        for(var key in params['localesDefault']){
            locales[key]=params['localesDefault'][key];
        }
        //locales = params['localesDefault'];
    }
    if(this._locales){
        for(var key in this._locales){
            locales[key]=this._locales[key];
        }
    }
    return locales;
};