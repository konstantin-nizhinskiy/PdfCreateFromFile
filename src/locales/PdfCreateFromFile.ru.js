(function (root, factory) {
   (typeof define === "function" && define.amd)? define(['PdfCreateFromFile'], factory) :
    (typeof module === "object" && module.exports)? module.exports = factory():
      factory(root.PdfCreateFromFile);
}(this, function (PdfCreateFromFile) {
    PdfCreateFromFile('setLocales')('ru',{
        errorArrayLoadFile:"Удалите все не поддерживаемые файлы в вашем списке",
        errorTypeFileNotSupport:"Это файл не поддерживается",
        btnNameClose:"Закрыть",
        btnNameAddFile:"Добавить файл",
        btnNameDelete:"Удалить",
        title:"Создать PDF файл",
        btnNameCreate:"Создать PDF",
        textFileSize:"Размер файла",
        textFileName:"Имя файла",
        textDrop:"Перетащите файл сюда",
        textOr:"или"
    })
}));