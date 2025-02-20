export function SetFocus(el) {
    var element = document.getElementById(el);
    if (element != undefined && element != null) {
        DelayedFocusInternal(el, 0);
    }
}

function DelayedFocusInternal(element, safety) {
    if (safety > 20) { return; }
    safety++;

    if (document.getElementById(element).offsetParent == null) {
        // Not visible
        setTimeout(() => DelayedFocusInternal(element, safety), 20);
    } else {
        // Visible
        document.getElementById(element).focus();
    }
}