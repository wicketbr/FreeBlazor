let configuredSoftbreaks = false;
let htmlEditorDotNetHelper;
let editors = [];
let globalDefine = undefined;

export function BeautifyHtml(html) {
    let output = html;

    if (typeof (html_beautify) != 'undefined') {
        output = html_beautify(html);
    }

    return output;
}

export function BeautifyIsLoaded() {
    let output = false;

    if (typeof (html_beautify) != 'undefined') {
        output = true;
    }

    return output;
}

export function DestroyEditor(element) {
    if (editors != null && editors[element] != undefined && editors[element] != null) {
        let updatedEditors = [];

        for (var key in editors) {
            if (key != element) {
                updatedEditors[key] = editors[key];
            }
        }

        editors = updatedEditors;
    }
}

function getAllScripts() {
    const allLoadedScripts = performance.getEntriesByType('resource')
        .filter(resource => resource.initiatorType === 'script' || resource.name.endsWith('.js'))
        .map(resource => resource.name);

    return allLoadedScripts;
}

function getFontName(font) {
    return font.toLowerCase().replace(/\s/g, "-");
}

export function HtmlEditorFocus(element) {
    if (editors != null && editors[element] != undefined && editors[element] != null) {
        editors[element].focus();
    }
}

export function HtmlEditorFocusSourceView(element) {
    let el = document.getElementById(element);
    if (el != undefined && el != null) {
        el.focus();
    }
}

export function HtmlEditorInsertText(element, text) {
    editors[element].focus();
    let range = editors[element].getSelection(true);

    if (range && range.length > 0) {
        editors[element].deleteText(range.index, range.length, 'user');
        editors[element].clipboard.dangerouslyPasteHTML(range.index, text, 'api');
    } else {
        editors[element].clipboard.dangerouslyPasteHTML(range.index, text, 'api');
    }
}

export function HtmlEditorInstalled() {
    let output = true;

    if (typeof (Quill) == 'undefined') {
        output = false;
    }

    return output;
}

export function HtmlEditorIsLoaded() {
    let output = false;

    if (typeof (Quill) != 'undefined') {
        output = true;
    }

    return output;
}

export function HtmlEditorLoadCss() {
    let el = document.getElementById('quill-css');
    if (el == undefined || el == null) {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = '_content/FreeBlazor/quill/quill.snow.css';
        link.media = 'all';
        link.id = 'quill-css';
        document.head.prepend(link);
    }
}

export function HtmlEditorSetDotNetHelper(value) {
    htmlEditorDotNetHelper = value;
}

export function HtmlEditorSetupEditor(element, config, html) {
    if (html == undefined || html == null) {
        html = "";
    }

    // Find the toolbar element.
    let toolbarId = element + "-toolbar";
    let toolbarElement = document.getElementById(toolbarId);
    if (!toolbarElement) {
        console.log("Toolbar '" + toolbarId + "' not found.");
        return;
    }

    // Find the wrapper and clear any previous contents.
    let wrapperId = element + "-wrapper";
    let wrapperElement = document.getElementById(wrapperId);

    if (!wrapperElement) {
        console.log("Wrapper '" + wrapperId + "' not found.");
        return;
    } else {
        wrapperElement.innerHTML = '<div id="' + element + '"></div>';
    }

    let editorElement = document.getElementById(element);
    if (!editorElement) {
        console.log("Element '" + element + "' not found, unable to create HTML editor.");
        return;
    } else {
        editorElement.innerHTML = html;
    }

    if (config == undefined || config == null) {
        config = {
            simpleView: false,
            allowImageUploads: false,
            required: false,
            placeholderText: "HTML Editor"
        };
    }

    if (config.allowFeatureFontSelector == true) {
        if (config.allowFeatureFonts != null && config.allowFeatureFonts.length > 0) {
            let Font = Quill.import('attributors/style/font');
            Font.whitelist = config.allowFeatureFonts;
            Quill.register(Font, true);
        }
    }

    const parchment = Quill.import("parchment");

    class IndentAttributor extends parchment.StyleAttributor {
        add(node, value) {
            value = parseInt(value);
            if (value === 0) {
                return this.remove(node), true;
            } else {
                return super.add(node, `${value}em`);
            }
        }
    }

    const indentStyle = new IndentAttributor("indent", "text-indent", {
        scope: parchment.Scope.BLOCK,
        whitelist: ["1em", "2em", "3em", "4em", "5em", "6em", "7em", "8em", "9em", "10em"]
    });

    Quill.register(indentStyle, true);

    if (configuredSoftbreaks == false) {
        const Embed = Quill.import('blots/embed');
        class SoftBreakBlot extends Embed {
            static blotName = 'softbreak';
            static tagName = 'br';
        }
        Quill.register(SoftBreakBlot);

        configuredSoftbreaks = true;
    }

    if (config.allowFeatureFontSizeSelector == true) {
        if (config.allowFeatureFontSizes != null && config.allowFeatureFontSizes.length > 0) {
            let Size = Quill.import('attributors/style/size');
            Size.whitelist = config.allowFeatureFontSizes;
            Quill.register(Size, true);
        }
    }

    const DirectionStyle = Quill.import('attributors/style/direction');
    Quill.register(DirectionStyle, true);

    const AlignStyle = Quill.import('attributors/style/align');
    Quill.register(AlignStyle, true);

    const ColorStyle = Quill.import('attributors/style/color');
    Quill.register(ColorStyle, true);

    const Header = Quill.import('formats/header');
    class CustomHeader extends Header {
        static formats(domNode) {
            if (domNode.tagName === 'DIV') {
                return 'div';
            }
            if (domNode.tagName === 'PRE') {
                return 'pre';
            }
            if (domNode.tagName === 'ADDRESS') {
                return 'address';
            }

            return super.formats(domNode);
        }
    }
    CustomHeader.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'PRE', 'ADDRESS'];
    Quill.register(CustomHeader, true);

    const BlockEmbed = Quill.import('blots/block/embed');
    class DividerBlot extends BlockEmbed {
        static blotName = 'divider';
        static tagName = 'hr';
    }
    Quill.register(DividerBlot);

    let colors = [];

    if (config.allowFeatureColors != null && config.allowFeatureColors.length > 0) {
        colors = config.allowFeatureColors;
    }

    let beautify = false;
    if (config.beautifyOutput != undefined && config.beautifyOutput != null && config.beautifyOutput == true) {
        beautify = true;
    }

    let quill = new Quill(editorElement, {
        modules: {
            keyboard: {
                bindings: {
                    'shift-enter': {
                        key: 'Enter',
                        shiftKey: true,
                        handler: function (range) {
                            this.quill.insertEmbed(range.index, 'softbreak', true, 'user');
                            this.quill.setSelection(range.index + 1, 'silent');
                        }
                    }
                }
            },
            //clipboard: {
            //    matchers: [
            //        ['br', (node, delta) => delta.insert({ softbreak: true })]
            //    ]
            //},
            toolbar: toolbarElement
        },
        placeholder: config.language.placeholderText,
        theme: 'snow',
    });

    quill.on('text-change', (delta, oldDelta, source) => {
        let html = quill.getSemanticHTML();

        if (beautify) {
            html = BeautifyHtml(html);
        }

        htmlEditorDotNetHelper.invokeMethod("ValueChanged", html);
    });

    editors[element] = quill;

    htmlEditorDotNetHelper.invokeMethod("EditorLoaded");
}

export function HtmlEditorSetupMonaco(element, value, darkMode) {
    let el = document.getElementById(element);
    if (el != undefined && el != null) {
        let theme = "vs";
        if (darkMode != undefined && darkMode != null && darkMode == true) {
            theme = "vs-dark";
        }

        // Configure Monaco loader
        let loaderScript = "../_content/FreeBlazor/monaco/min/vs";
        let scripts = getAllScripts();
        scripts.forEach((element, index, array) => {
            let i = element.toLowerCase().indexOf("min/vs/loader.js");
            if (i > -1) {
                loaderScript = element.substring(0, i + 6);
            }
        });

        require.config({
            paths: {
                //'vs': 'https://unpkg.com/monaco-editor@0.54.0/min/vs'
                //'vs': '../_content/FreeBlazor/monaco/min/vs'
                'vs': loaderScript
            }
        });

        require(['vs/editor/editor.main'], function () {
            const editor = monaco.editor.create(document.getElementById(element), {
                value: value,
                language: 'html',
                theme: theme,
                automaticLayout: true,
                fontSize: 15,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                autoClosingBrackets: 'always',
                //tabSize: 2,
                //insertSpaces: true,
            });

            editor.onDidChangeModelContent((event) => {
                const newValue = editor.getValue();

                htmlEditorDotNetHelper.invokeMethod("ValueChanged", newValue);
            });

            editor.focus();

            editors[element] = editor;
        });
    } else {
        console.log("Unable to find element", element);
    }
}

export function HtmlEditorUpdate(element, html) {
    let delta = editors[element].clipboard.convert({ html: html });
    editors[element].setContents(delta, 'silent');
}

export function LoadMonacoLoader() {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    //script.src = 'https://unpkg.com/monaco-editor@0.54.0/min/vs/loader.js';
    script.src = './_content/FreeBlazor/monaco/min/vs/loader.js';
    script.onload = () => {
        //htmlEditorDotNetHelper.invokeMethod("MonacoLoaded");
        htmlEditorDotNetHelper.invokeMethod("ScriptLoaded", "MonacoLoader");
    };
    document.head.prepend(script);
}

export function LoaderIsLoaded() {
    let output = false;

    if (typeof (require) != 'undefined') {
        output = true;
    }

    return output;
}

export function LoadScript(source, name) {
    SuspendDefine();

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = source;
    script.onload = () => {
        htmlEditorDotNetHelper.invokeMethod("ScriptLoaded", name);
    };
    document.head.prepend(script);
}

export function MonacoEditorUpdate(element, html) {
    let editor = editors[element];

    if (editor != undefined && editor != null) {
        editor.getModel().setValue(html);
    }
}

export function MonacoInsertText(element, text) {
    let editor = editors[element];

    if (editor != undefined && editor != null) {
        const position = editor.getPosition(); // Get current cursor position

        const range = new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
        );

        editor.executeEdits("inserted-text", [{
            range: range,
            text: text,
            forceMoveMarkers: true // Move the cursor to the end of the inserted text
        }]);
    }
}

export function MonacoSetFocus(element) {
    let editor = editors[element];

    if (editor != undefined && editor != null) {
        editor.focus();
    }
}

export function MonacoUpdateTheme(element, darkMode) {
    let theme = "vs";
    if (darkMode != undefined && darkMode != null && darkMode == true) {
        theme = "vs-dark";
    }

    let editor = editors[element];

    if (editor != undefined && editor != null) {
        editor._themeService.setTheme(theme);
    }
}

export function RestoreDefine() {
    if (window.define == undefined) {
        window.define = globalDefine;
    }
}

function scriptIsLoaded(script) {
    let scripts = getAllScripts();

    let scriptLower = script.toLowerCase();

    scripts.forEach((element, index, array) => {
        if (element.toLowerCase().indexOf(scriptLower) > -1) {
            return true;
        }
    });

    return false;
}

export function SuspendDefine() {
    if (window.define != undefined) {
        globalDefine = window.define;
        window.define = undefined;
    }
}