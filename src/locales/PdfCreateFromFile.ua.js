(function (root, factory) {
   (typeof define === "function" && define.amd)? define(['PdfCreateFromFile'], factory) :
    (typeof module === "object" && module.exports)? module.exports = factory():
      factory(root.PdfCreateFromFile);
}(this, function (PdfCreateFromFile) {
    PdfCreateFromFile('setLocales')('ua',{
        errorArrayLoadFile:"Видаліть все не підтримувані файли в вашому списку",
        errorTypeFileNotSupport:"Це файл не підтримується",
        btnNameClose:"Закрити",
        btnNameAddFile:"Додати файл",
        btnNameDelete:"Видалити",
        title:"Створити PDF файл",
        btnNameCreate:"Створити PDF",
        textFileSize:"Розмір файла",
        textFileName:"Ім`я файлу",
        textDrop:"Перетягніть файл сюди",
        textOr:"або"
    })
}));