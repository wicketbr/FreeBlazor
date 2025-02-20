var htmlEditorDotNetHelper;

export function HtmlEditorInstalled() {
    var output = true;

    if (typeof (CKEDITOR) == 'undefined') {
        output = false;
    }

    return output;
}

export function HtmlEditorLoad() {
    if (typeof (CKEDITOR) != 'undefined') {
        return;
    }

    // CK Editor is not already loaded, so load the script into the head element.
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '_content/FreeBlazor/ckEditor/ckeditor.js';
    document.head.appendChild(script);
}

export function HtmlEditorGetValue(element) {
    var output = "";

    if (CKEDITOR.instances[element] != undefined) {
        output = CKEDITOR.instances[element].getData();
    }

    return output;
}

export function HtmlEditorInsertText(element, text, asHtml) {
    if (CKEDITOR.instances[element] != undefined) {
        if (asHtml != undefined && asHtml != null && asHtml == true) {
            CKEDITOR.instances[element].insertHtml(text);
        } else {
            CKEDITOR.instances[element].insertText(text);
        }
    }
}

export function HtmlEditorFocus(element) {
    setTimeout(() => CKEDITOR.instances[element].focus(), 100);
}

export function HtmlEditorSetDotNetHelper(value) {
    htmlEditorDotNetHelper = value;
}

export function HtmlEditorUpdate(element, html) {
    if (CKEDITOR.instances[element] != undefined) {
        CKEDITOR.instances[element].setData(html);
    }
}

export function HtmlEditorSetupEditor(element, config, html) {
    if (html == undefined || html == null) {
        html = "";
    }

    var editorElement = document.getElementById(element);
    if (!editorElement) {
        console.log("Element '" + element + "' not found, unable to create HTML editor.");
        return;
    }

    if (config == undefined || config == null) {
        config = {
            //onupdate: null,
            //onmodechange: null,
            simpleView: false,
            allowImageUploads: false,
            hideSourceButton: false,
            required: false,
            placeholderText: "HTML Editor"
        };
    }

    if (config.placeholderText == undefined || config.placeholderText == null) {
        config.placeholderText = "HTML Editor";
    }

    if (config.hideSourceButton == undefined || config.hideSourceButton == null) {
        config.hideSourceButton = false;
    }

    if (config.required == undefined || config.required == null) {
        config.required = false;
    }

    if (CKEDITOR.instances[element] != undefined) {
        CKEDITOR.instances[element].destroy();
    }

    CKEDITOR.config.htmlEncodeOutput = false;
    CKEDITOR.config.entities = false;
    CKEDITOR.config.forcePasteAsPlainText = false;
    CKEDITOR.config.dataIndentationChars = '  ';
    CKEDITOR.config.height = '50px';
    CKEDITOR.config.resize_minHeight = 180;
    CKEDITOR.config.autoGrow_minHeight = 20;
    CKEDITOR.config.autoGrow_onStartup = true;
    CKEDITOR.config.editorplaceholder = config.placeholderText;
    CKEDITOR.config.baseFloatZIndex = 9999999;
    CKEDITOR.config.font_names = config.allowFeatureFonts;
    CKEDITOR.config.fontSize_sizes = config.allowFeatureFontSizes;
    CKEDITOR.config.colorButton_colors = config.allowFeatureFontColors;
    CKEDITOR.config.colorButton_enableMore = true;

    var extraRemove = "";
    var disallowedContent = '';
    if (!config.allowFeatureFormFields) {
        disallowedContent += 'form; select; input; textarea; radio;';
        extraRemove += ",forms";
    }

    disallowedContent += 'img; ';
    extraRemove = ",Image";

    if (config.hideSourceButton) { extraRemove += ",Source"; }
    if (!config.allowFeatureBold) { extraRemove += ",Bold"; }
    if (!config.allowFeatureItalic) { extraRemove += ",Italic"; }
    if (!config.allowFeatureUnderline) { extraRemove += ",Underline"; }
    if (!config.allowFeatureStrikeThrough) { extraRemove += ",Strike"; }
    if (!config.allowFeatureSubscript) { extraRemove += ",Subscript"; }
    if (!config.allowFeatureSuperscript) { extraRemove += ",Superscript"; }
    if (!config.allowFeatureStyleSelector) { extraRemove += ",Format"; }
    if (!config.allowFeatureFontSelector) { extraRemove += ",Font"; }
    if (!config.allowFeatureFontSizeSelector) { extraRemove += ",FontSize"; }
    if (!config.allowFeatureFontColorSelector) { extraRemove += ",TextColor"; }
    if (!config.allowFeatureBackgroundColorSelector) { extraRemove += ",BGColor"; }
    if (!config.allowFeatureTables) { extraRemove += ",tabletools,Table"; }

    if (config.simpleView != undefined && config.simpleView != null && config.simpleView == true) {
        // The simple view
        CKEDITOR.config.toolbarGroups = [
            { name: 'document', groups: ['mode', 'document', 'doctools'] },
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
            { name: 'forms', groups: ['forms'] },
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
            { name: 'links', groups: ['links'] },
            { name: 'insert', groups: ['insert'] },
            { name: 'styles', groups: ['styles'] },
            { name: 'colors', groups: ['colors'] },
            { name: 'tools', groups: ['tools'] },
            { name: 'others', groups: ['others'] },
            { name: 'about', groups: ['about'] }
        ];
        CKEDITOR.config.removeButtons = 'Save,NewPage,ExportPdf,Preview,Print,Templates,Find,Replace,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Language,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,About,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,SelectAll,Scayt,Source,NumberedList,BulletedList,CopyFormatting,RemoveFormat,Strike,Subscript,Superscript,Blockquote,CreateDiv,BidiLtr,BidiRtl,Link,Unlink,Anchor,Table,HorizontalRule,Font,FontSize,Maximize' + extraRemove;
    } else {
        CKEDITOR.config.toolbarGroups = [
            { name: 'document', groups: ['mode', 'document', 'doctools'] },
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
            { name: 'forms', groups: ['forms'] },
            '/',
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
            { name: 'links', groups: ['links'] },
            { name: 'insert', groups: ['insert'] },
            '/',
            { name: 'styles', groups: ['styles'] },
            { name: 'colors', groups: ['colors'] },
            { name: 'tools', groups: ['tools'] },
            { name: 'others', groups: ['others'] },
            { name: 'about', groups: ['about'] }
        ];
        CKEDITOR.config.removeButtons = 'Save,NewPage,ExportPdf,Preview,Print,Templates,Language,BidiRtl,BidiLtr,Anchor,PageBreak,Iframe,Maximize,About,Styles,uploadButton' + extraRemove;
    }

    CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4;pre;address;div';
    CKEDITOR.config.autoParagraph = false;
    CKEDITOR.config.disallowedContent = disallowedContent;

    //CKEDITOR.config.contentsCss = window.baseURL + "css/htmlEditor.css";

    CKEDITOR.config.allowedContent = true;
    CKEDITOR.config.extraAllowedContent = '*(*);*{*}';
    CKEDITOR.config.extraAllowedContent = 'span;ul;li;table;td;style;*[id];*(*);*{*}';

    document.getElementById(element).value = html;

    //$("#" + element).val(html);

    var editor = CKEDITOR.replace(element);

    if (editor !== undefined && editor !== null) {
        editor.on("instanceReady", function (evt) {
            //evt.editor.commands.save.disable();
            //console.log( editor.filter.allowedContent );
            //$("#cke_" + element).removeClass("missing-required");
            editorElement.classList.remove('missing-required');

            if (config.required == true && html == "") {
                //$("#cke_" + element).addClass("missing-required");
                editorElement.classList.add('missing-required');
            }
        });
        editor.on("change", function (evt) {
            var html = evt.editor.getData();

            if (config.required == true) {
                if (html == null || html == "") {
                    //$("#cke_" + element).addClass("missing-required");
                    editorElement.classList.add('missing-required');
                } else {
                    //$("#cke_" + element).removeClass("missing-required");
                    editorElement.classList.remove('missing-required');
                }
            }

            htmlEditorDotNetHelper.invokeMethod("ValueChanged", html);
        });
        editor.on("mode", function () {
            //DotNet.invokeMethod("CRM.Client", "ModeChanged", this.mode);
            htmlEditorDotNetHelper.invokeMethod("ModeHasChanged", this.mode);
        });
    }
}

