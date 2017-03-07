function ParseContainer(cnt, e, p, styles) {
    var elements = [];
    var children = e.childNodes;
    if (children.length != 0) {
        for (var i = 0; i < children.length; i++) p = ParseElement(elements, children[i], p, styles);
    }
    if (elements.length != 0) {
        for (var i = 0; i < elements.length; i++) cnt.push(elements[i]);
    }
    return p;
}

function ComputeStyle(o, styles) {
    styles.forEach(function(singleStyle) {
        var styleDefinition = singleStyle.trim().toLowerCase().split(":");
        var style = styleDefinition[0];
        var value = styleDefinition[1];
        if (styleDefinition.length == 2) {
            switch (style) {
                case "padding-left":
                    o.margin = [parseInt(value), 0, 0, 0];
                    break;
                case "font-size":
                    o.fontSize = parseInt(value);
                    break;
                case "text-align":
                    switch (value) {
                        case "right":
                        case "center":
                        case "justify":
                            o.alignment = value;
                            break;
                    }
                    break;
                case "font-weight":
                    switch (value) {
                        case "bold":
                            o.bold = true;
                            break;
                    }
                    break;
                case "text-decoration":
                    switch (value) {
                        case "underline":
                            o.decoration = "underline";
                            break;
                        case "line-through":
                            o.decoration = "lineThrough";
                            break;
                    }
                    break;
                case "font-style":
                    switch (value) {
                        case "italic":
                            o.italics = true;
                            break;
                    }
                    break;
                case "color":
                    o.color = value;
                    break;
                case "background-color":
                    o.background = value;
                    break;
            }
        }
    })
}

function ParseElement(cnt, e, p, styles) {
    var elementStyles = {
            "b": ["font-weight:bold"],
            "strong": ["font-weight:bold"],
            "u": ["text-decoration:underline"],
            "em": ["font-style:italic"],
            "i": ["font-style:italic"],
            "h1": ["font-size:16", "font-weight:bold"],
            "h2": ["font-size:12", "font-weight:bold"],
            "h3": ["font-size:10", "font-weight:bold"],
            "h4": ["font-size:10", "font-style:italic"],
            "h5": ["font-size:10"],
            "h6": ["font-size:10"],
            "a": ["color:blue", "text-decoration:underline"],
            "del": ["color:red", "text-decoration:line-through"],
            "ins": ["color:green", "text-decoration:underline"]
        },
        classStyles = {
            "delete": ["color:red", "text-decoration:line-through"],
            "insert": ["color:green", "text-decoration:underline"]
        };

    if (!styles) styles = [];
    styles=styles.concat(elementStyles[e.nodeName.toLowerCase()]||[]);
    if (e.getAttribute) {
        var nodeStyle = e.getAttribute("style");
        if (nodeStyle) {
            var ns = nodeStyle.split(";");
            for (var k = 0; k < ns.length; k++) styles.push(ns[k]);
        }
    }

    switch (e.nodeName.toLowerCase()) {
        case "#text": {
            var t = { text: e.textContent.replace(/\n/g, "") };
            if (styles) ComputeStyle(t, styles);
            p.text.push(t);
            break;
        }
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
            p.marginTop=5;
            p.marginBottom=5;
            ParseContainer(cnt, e, p, styles);
            break;
        case "b":
        case "strong":
        case "u":
        case "em":
        case "i":
        case "ins":
        case "del":
            ParseContainer(cnt, e, p, styles);
            break;
        case "span": {
            ParseContainer(cnt, e, p, styles);
            break;
        }
        case "br": {
            p = CreateParagraph();
            p.text=["\n"];
            cnt.push(p);
            break;
        }
        case "table":
        {
            var t = {
                table: {
                    widths: [],
                    body: []
                }
            }
            var border = e.getAttribute("border");
            var isBorder = false;
            if (border) if (parseInt(border) == 1) isBorder = true;
            if (!isBorder) t.layout = 'noBorders';
            ParseContainer(t.table.body, e, p, styles);

            var widths = e.getAttribute("widths");
            if (!widths) {
                if (t.table.body.length != 0) {
                    if (t.table.body[0].length != 0) for (var k = 0; k < t.table.body[0].length; k++) t.table.widths.push("*");
                }
            } else {
                var w = widths.split(",");
                for (var k = 0; k < w.length; k++) t.table.widths.push(w[k]);
            }
            cnt.push(t);
            break;
        }
        case "tbody": {
            ParseContainer(cnt, e, p, styles);
            //p = CreateParagraph();
            break;
        }
        case "tr": {
            var row = [];
            ParseContainer(row, e, p, styles);
            cnt.push(row);
            break;
        }
        case "td": {
            p = CreateParagraph();
            var st = {stack: []}
            st.stack.push(p);

            var rspan = e.getAttribute("rowspan");
            if (rspan) st.rowSpan = parseInt(rspan);
            var cspan = e.getAttribute("colspan");
            if (cspan) st.colSpan = parseInt(cspan);

            ParseContainer(st.stack, e, p, styles);
            cnt.push(st);
            break;
        }
        case "div":case "p": {
        p = CreateParagraph();
        var st = {stack: []};
        st.stack.push(p);
        ComputeStyle(st, styles);
        ParseContainer(st.stack, e, p);

        cnt.push(st);
        break;
    }
        default: {
            console.error("Parsing for node " + e.nodeName + " not found");
            break;
        }
    }
    return p;
}
ParseHtml = function (htmlText,cnt) {
    var div=document.createElement('div');
    div.innerHTML=htmlText;
    cnt=cnt||[];
    for (var i = 0; i < div.children.length; i++) {
        if(['div','p','table'].indexOf(div.children[i].nodeName.toLowerCase())<0){
            cnt.push(ParseElement(cnt, div.children[i], CreateParagraph(), []))
        }else{
            ParseElement(cnt, div.children[i], CreateParagraph(), []);
        }
    }
    return cnt;
};

function CreateParagraph() {
    var p = {text:[]};
    return p;
}