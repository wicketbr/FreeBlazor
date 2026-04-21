export function Focus(element) {
    FocusInternal(element, 0);
}

function FocusInternal(element, safety) {
    if (safety > 20) { return; }
    safety++;

    if (isVisibleByElementId(element)) {
        let el = document.getElementById(element);

        if (el != undefined && el != null) {
            el.focus();
        }
    } else {
        setTimeout(() => FocusInternal(element, safety), 20);
    }
}

function isVisible(e) {
    if (e == undefined || e == null) {
        return false;
    } else {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    }
}

function isVisibleByElementId(elementId) {
    let e = document.getElementById(elementId);
    if (e == undefined || e == null) {
        return false;
    } else {
        return isVisible(e);
    }
}