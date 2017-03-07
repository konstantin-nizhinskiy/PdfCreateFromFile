var FileListView = function (property) {
    var _id = +new Date(),
        wrapper = document.createElement('div'),
        render;

    render = function () {
        var _templateList = templateList({
                id: _id,
                storageId: property.storageId,
                locales: property.locales
            }),
            btnDelete = _templateList.getElementsByClassName('btn-delete');

        for (var i = 0; i < btnDelete.length; i++) {
            btnDelete[i].onclick = function (atr) {
                var _filesNew = [],
                    _id = atr.target.dataset.id;
                _files[property.storageId].forEach(function (row, key) {
                    if (_id != key) {
                        _filesNew.push(row)
                    }

                });
                _files[property.storageId] = _filesNew;
                if (wrapper.children.length) {
                    wrapper.children[0].remove();
                }

                _files[property.storageId].forEach(function(row){
                    row.isSupport=isSupport(row.typeName,property.storageId);
                });
                isSupports(property.storageId);
                wrapper.appendChild(render());
            }
        }
        return _templateList;
    };
    wrapper.appendChild(render());

    return wrapper;
};