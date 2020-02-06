var addClass= function( classname, element ) {
    var cn = element.className;
    //test for existance
    if( cn.indexOf( classname ) != -1 ) {
        return;
    }
    //add a space if the element already has class
    if( cn != '' ) {
        classname = ' '+classname;
    }
    element.className = cn+classname;
};
