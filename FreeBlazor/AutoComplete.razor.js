window.clickWatchers = [];
window.el = null;
window.parentEl = null;
window.matchParentWidth = false;

export function ClearValue(el) {
    var elem = document.getElementById(el);
    elem.value = "";
}

export function ClosePopup(el) {
    var elem = document.getElementById(el);
    if (elem != null && elem.style != null) {
        elem.style.display = "none";
    }
}

export function GetValue(el) {
    var elem = document.getElementById(el)
    return elem.value;
}

export function OpenPopup(el, parentEl, matchParentWidth) {
    window.el = el;
    window.parentEl = parentEl;
    window.matchParentWidth = matchParentWidth;

    var popup = document.getElementById(el);

    PositionElement();

    // Setup watchers to close the popup when clicking outside the popup in the document and to reposition on scroll and resize.
    clickWatchers[el] = function (e) {
        if (e.type == 'scroll' || e.type == 'resize') {
            PositionElement();
            return;
        }

        if (e.type == 'contextmenu' || !e.target) {
            return;
        }

        if (!/Android/i.test(navigator.userAgent) &&
            !['input', 'textarea'].includes(document.activeElement ? document.activeElement.tagName.toLowerCase() : '') && e.type == 'resize') {
            ClosePopup(el);
            return;
        }

        var closestPopup = e.target.closest && (e.target.closest('.autocomplete-search-results'));

        if (closestPopup && closestPopup != popup) {
            return;
        }

        if (parent) {
            if (e.type == 'mousedown' && parent.contains != undefined && parent.contains != null && !parent.contains(e.target) && !popup.contains(e.target)) {
                ClosePopup(el);
            }
        } else {
            if (popup.contains != undefined && popup.contains != null && !popup.contains(e.target)) {
                ClosePopup(el);
            }
        }
    };

    document.removeEventListener('mousedown', clickWatchers[el]);
    document.addEventListener('mousedown', clickWatchers[el]);
    window.removeEventListener('resize', clickWatchers[el]);
    window.addEventListener('resize', clickWatchers[el]);

    window.removeEventListener('scroll', clickWatchers[el]);
    window.addEventListener('scroll', clickWatchers[el]);
}

function PositionElement() {
    var popup = document.getElementById(el);

    //console.log("popup", popup);
    if (!popup) {
        return;
    }

    var parent = document.getElementById(parentEl);
    //console.log("parent", parent);
    if (!parent) {
        return;
    }

    var parentRect = parent ? parent.getBoundingClientRect() : { top: y || 0, bottom: 0, left: x || 0, right: 0, width: 0, height: 0 };
    //console.log("parentRect", parentRect);

    var scrollLeft = 0;
    var scrollTop = 0;

    if (/Edge/.test(navigator.userAgent)) {
        //scrollLeft = document.body.scrollLeft;
        //scrollTop = document.body.scrollTop;
    } else {
        //scrollLeft = document.documentElement.scrollLeft;
        //scrollTop = document.documentElement.scrollTop;
    }

    //console.log("scrollLeft", scrollLeft);
    //console.log("scrollTop", scrollTop);

    var top = parentRect.bottom;
    var left = parentRect.left;

    if (matchParentWidth) {
        popup.style.width = parentRect.width + 'px';
    }

    popup.style.display = 'block';
    popup.style.position = 'fixed';

    var rect = popup.getBoundingClientRect();

    // Test for various types of dialogs
    var inDialog = parent.closest(".rz-dialog");


    if (inDialog != null) {
        var dialogRect = inDialog.getBoundingClientRect();
        //console.log("dialogRect", dialogRect);

        // Adjust for dialog positioning issues.
        left = left - dialogRect.left;
        if (left < 0) {
            left = 0;
        }

        top = top - dialogRect.top;
        if (top < 0) {
            top = 0;
        }
    }

    popup.style.zIndex = 10000;
    popup.style.left = left + scrollLeft + 'px';
    popup.style.top = top + scrollTop + 'px';
    //popup.style.top = top + 'px';


    //console.log("left", left + scrollLeft + "px");
    //console.log("top", top + scrollTop + "px");
    //console.log("top", top + "px");
}

export function ShowSearchResults(el) {
    var elem = document.querySelector("#" + el);
    elem.style.display = "inline";
}