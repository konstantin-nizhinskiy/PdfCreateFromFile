(function (root, factory) {
   (typeof define === "function" && define.amd)? define(['PdfCreateFromFile'], factory) :
    (typeof module === "object" && module.exports)? module.exports = factory():
      factory(root.PdfCreateFromFile);
}(this, function (PdfCreateFromFile) {
    PdfCreateFromFile('setLocales')('en',{
        errorArrayLoadFile: "Please delete all not support file",
        errorTypeFileNotSupport: "This type file not support",
        btnNameClose: "Close",
        btnNameAddFile: "Add file",
        btnNameDelete: "Delete",
        title: "Create PDF file",
        btnNameCreate: "Create PDF",
        textFileSize: "File size",
        textFileName: "File name",
        textDrop: "Drag a file here",
        textOr: "or"
    })
}));