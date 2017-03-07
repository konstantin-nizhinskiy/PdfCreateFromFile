PdfCreateFromFile
=================

The module allows you to download multiple files and merge them into PDF.
Support type file `BMP`, `JPEG`, `JPG`, `JPE`, `JP2`, `PNG`, `TXT`, `TEX`, `HTML`, `LOG`, `JS`

 * [download](#download)
 * [Loader supports](#loader-supports)
 * [dependencies](#dependencies)
 * [config](#config)
 * [methods](#methods)
 * [example](#example)
 
## Download
```sh
  $ bower install pdf-create-from-file;
  $ git clone https://github.com/konstantin-nizhinskiy/PdfCreateFromFile.git;
```

## Dependencies

 * pdfMake - Client/server side PDF printing in pure JavaScript (https://github.com/bpampuch/pdfmake) 
 * jsZip - A library for creating, reading and editing .zip files with Javascript, with a lovely and simple API. (https://github.com/Stuk/jszip)
 
## Loader supports

 * AMD
 * CommonJS

## Config
```js
    i18n.setProperty({
       wrapper:document.body,   // Parent element 
       locale:"en",             // Set locale
       typeOpen:'download',     // Type convert file
       documentName:'Document', // Document name went download
       callback:false,          // Function callback
       locales:{},              // My custom translation
       storageId:""             // Set id storage
    });
```
### Options

#### wrapper
Name: You can set main wrapper element
Type: `HTMLElement`  
Default: `document.body`

#### locale
Name: Set locale translation
Type: `String`
Default: `en`

#### typeOpen 
Name: Set type convert file pdf
Type: `String`
Default: `download`
SupportValue:

 * download - Create PDF and download to client (you can set documentName)
 * open - Create PDF and open in new tabs 
 * print - Create PDF and auto print in new tabs
 * getBase64 - Create PDF and get base64 (This options async you need set function callback)
 * getBlob - Create PDF and get Blob (This options async you need set function callback)
 * getDataUrl - Create PDF and get DataUrl (This options async you need set function callback)

#### documentName
Name: Document name download
TYpe: `String`
Default: `Document`

#### callback
Name: Function callback getContent file getBase64,getBlob,getDataUrl in arguments
Type: `Function`

#### locales
Name: You can set custom text in modal load file
Type: `Object`
SupportValue:

 * errorArrayLoadFile - "Please delete all not support file"
 * errorTypeFileNotSupport - "This type file not support"
 * btnNameClose - "Close"
 * btnNameAddFile - "Add file"
 * btnNameDelete - "Delete"
 * title - "Create PDF file"
 * btnNameCreate - "Create PDF"
 * textFileSize - "File size"
 * textFileName - "File name"
 * textDrop - "Drag a file here"
 * textOr - "or"

#### storageId
Name: You can set storage Id in session
Type: `String`

## Methods
 Method               | Arguments                  |  info           
----------------------|----------------------------|------------------------
 openModal            | [typeOpen],[callback]      | Open modal load file


## Example

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="../dist/css/PdfCreateFromFile.min.css">

    <script src='../bower_components/pdfmake/build/pdfmake.min.js'></script>
    <script src='../bower_components/pdfmake/build/vfs_fonts.js'></script>
    <script src="../dist/js/PdfCreateFromFile.js"></script>
    <script src="../dist/js/locales/PdfCreateFromFile.ru.min.js"></script>
    <script src="../dist/js/locales/PdfCreateFromFile.ua.min.js"></script>
    <script src="../dist/js/locales/PdfCreateFromFile.en.min.js"></script>
    <script src="../bower_components/jszip/dist/jszip.min.js"></script>
<!--    <script src='jQuery.js'></script>-->
</head>
<body>
<h1>Demo generation PDF</h1>
<button onclick="pdfCreateFromFile1.openModal('open');">Open storage 1</button>
<button onclick="pdfCreateFromFile2.openModal('open');">Open storage 1(EN)</button>
<button onclick="pdfCreateFromFile3.openModal('open');">Open storage 1(RU)</button>
<button onclick="pdfCreateFromFile4.openModal('open');">Open storage 1(UA)</button>
<button onclick="pdfCreateFromFile1.openModal('print');">Print</button>
<button onclick="pdfCreateFromFile1.openModal('download');">Download</button>
<button onclick="pdfCreateFromFile1.openModal('getBase64',getData);">GetBase64</button>
<button onclick="pdfCreateFromFile1.openModal('getBlob',getData);">GetBlob</button>
<button onclick="pdfCreateFromFile1.openModal('getDataUrl',getData);">GetDataUrl</button>
<script>
    var pdfCreateFromFile1 = new PdfCreateFromFile({
        storageId:1
    });
    var pdfCreateFromFile2 = new PdfCreateFromFile({
        storageId:1,
        locale:'en'
    });
    var pdfCreateFromFile3 = new PdfCreateFromFile({
        storageId:1,
        locale:'ru',
        locales:{
            title:'My title'
        }
    });
    var pdfCreateFromFile4 = new PdfCreateFromFile({
        storageId:1,
        locale:'ua'
    });
    function getData(data){
        document.getElementById('data').innerText=data;
    }
</script>
<div id="data"></div>
</body>
</html>
```