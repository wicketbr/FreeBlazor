//var dotNetHelper;
var elementId;
var minimumHeight;

export function Init(id, minHeight) {
    elementId = id;
    minimumHeight = minHeight;

    if (minimumHeight == undefined || minimumHeight == null) {
        minimumHeight = "";
    }

    // Set the inital height.
    ResizeElement();
}

function ResizeElement() {
    var paddingTop = 0;
    var paddingBottom = 0;

    var el = document.getElementById(elementId);

    if (el != undefined && el != null) {
        var computedPaddingTop = window.getComputedStyle(el).getPropertyValue('padding-top');
        var computedPaddingBottom = window.getComputedStyle(el).getPropertyValue('padding-bottom');

        if (computedPaddingTop != undefined && computedPaddingTop != null && computedPaddingTop != "") {
            paddingTop = parseInt(computedPaddingTop.replace('px', ''));
            //console.log("paddingTop", paddingTop);
        }

        if (computedPaddingBottom != undefined && computedPaddingBottom != null && computedPaddingBottom != "") {
            paddingBottom = parseInt(computedPaddingBottom.replace('px', ''));
            //console.log("paddingBottom", paddingBottom);
        }

        el.style.cssText = 'height:auto; padding:0; overflow:hidden;';

        var scrollHeight = el.scrollHeight;
        //console.log("scrollHeight", scrollHeight);

        var totalHeight = scrollHeight;
        if (totalHeight > 40) {
            // Add the padding
            totalHeight = scrollHeight + paddingTop + paddingBottom;
        }
        //console.log("totalHeight", totalHeight);

        var cssText = 'height:' + totalHeight + 'px; overflow:hidden;';
        if (minimumHeight != "") {
            cssText += ' min-height:' + minimumHeight + ';';
        }

        el.style.cssText = cssText;
    }
}

export function ResizeElementFromCode() {
    //console.log("ResizeElementFromCode");
    setTimeout(() => ResizeElement(), 10);
}

//export function SetDotNetHelper(value) {
//    dotNetHelper = value;
//}

export function UpdateElementId(id) {
    elementId = id;
}

export function UpdateMinHeight(minHeight) {
    if (minHeight == undefined || minHeight == null) {
        minHeight = "";
    }

    minimumHeight = minHeight;
    ResizeElement();
}