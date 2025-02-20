using Demos.Client.Pages;
using FreeBlazor;
using Microsoft.JSInterop;
using Radzen;

namespace Demos.Client;

public static class Helpers
{
    private static bool _initialized = false;
    private static Radzen.DialogService _dialogService;
    private static IJSRuntime _jsRuntime;

    /// <summary>
    /// Initializes the static helpers class with the necessary injection libraries.
    /// </summary>
    /// <param name="jSRuntime"></param>
    /// <param name="dialogService"></param>
    public static void Init(IJSRuntime jSRuntime, Radzen.DialogService dialogService)
    {
        _dialogService = dialogService;
        _jsRuntime = jSRuntime;
        _initialized = true;
    }

    /// <summary>
    /// Shows a confirmation dialog.
    /// </summary>
    /// <param name="OnButtonClicked">The delegate that will receive the bool response based on which button is clicked.</param>
    /// <param name="Title">An optional title for the dialog (defaults to "Confirm")</param>
    /// <param name="Instructions">Optional instructions to show before the buttons.</param>
    /// <param name="OkButtonText">Optional text to use for the Ok button (defaults to "Ok")</param>
    /// <param name="OkButtonClass">Optional class to add to the Ok button (defaults to "btn btn-success")</param>
    /// <param name="OkButtonIcon">Optional icon to show before the button text. Will render as HTML or get wrapped in an i element if not HTML is detected.</param>
    /// <param name="CancelButtonText">Optional text to use for the Cancel button (defaults to "Cancel")</param>
    /// <param name="CancelButtonClass">Optional class to add to the Cancel button (defaults to "btn btn-dark")</param>
    /// <param name="CancelButtonIcon">Optional icon to show before the button text. Will render as HTML or get wrapped in an i element if not HTML is detected.</param>
    /// <param name="width">Optional width. Leave empty for the default or set to "auto" for the dialog defaults.</param>
    /// <param name="height">Optional width. Leave empty for the default or set to "auto" for the dialog defaults.</param>
    public static async Task Confirmation(Delegate OnButtonClicked,
        string Title = "",
        string Instructions = "",
        string OkButtonText = "",
        string OkButtonClass = "",
        string OkButtonIcon = "",
        string CancelButtonText = "",
        string CancelButtonClass = "",
        string CancelButtonIcon = "",
        string width = "",
        string height = "")
    {
        if (String.IsNullOrWhiteSpace(Title)) {
            Title = "Confirm";
        }

        Dictionary<string, object> parameters = new Dictionary<string, object>();
        parameters.Add("OnInputAccepted", OnButtonClicked);

        if (!String.IsNullOrWhiteSpace(Instructions)) {
            parameters.Add("Instructions", Instructions);
        }

        if (!String.IsNullOrWhiteSpace(OkButtonText)) {
            parameters.Add("ConfirmOkButtonText", OkButtonText);
        }
        if (!String.IsNullOrWhiteSpace(OkButtonClass)) {
            parameters.Add("ConfirmOkButtonClass", OkButtonClass);
        }
        if (!String.IsNullOrWhiteSpace(OkButtonIcon)) {
            parameters.Add("ConfirmOkButtonIcon", OkButtonIcon);
        }

        if (!String.IsNullOrWhiteSpace(CancelButtonText)) {
            parameters.Add("ConfirmCancelButtonText", CancelButtonText);
        }
        if (!String.IsNullOrWhiteSpace(CancelButtonClass)) {
            parameters.Add("ConfirmCancelButtonClass", CancelButtonClass);
        }
        if (!String.IsNullOrWhiteSpace(CancelButtonIcon)) {
            parameters.Add("ConfirmCancelButtonIcon", CancelButtonIcon);
        }

        parameters.Add("UserInputType", FreeBlazor.GetInput.InputType.Confirmation);

        if (width == "auto") {
            width = "";
        }

        if (height == "auto") {
            height = "";
        }

        await _dialogService.OpenAsync<GetInput>(Title, parameters, new DialogOptions() {
            AutoFocusFirstElement = false,
            Resizable = false,
            Draggable = false,
            Width = width,
            Height = height,
        });
    }

    /// <summary>
    /// Copies the value to the clipboard using jsInterop.
    /// </summary>
    /// <param name="value">The value to copy to the clipboard.</param>
    public static async Task CopyToClipboard(string value)
    {
        if (_jsRuntime != null) {
            await _jsRuntime.InvokeVoidAsync("CopyToClipboard", value);
        }
    }

    /// <summary>
    /// Sets the focus to an element as soon as it becomes visible.
    /// </summary>
    /// <param name="elementId">The id of the HTML element.</param>
    public static async Task DelayedFocus(string elementId)
    {
        if(_jsRuntime != null && !String.IsNullOrWhiteSpace(elementId)) {
            await _jsRuntime.InvokeVoidAsync("DelayedFocus", elementId);
        }
    }

    /// <summary>
    /// Gets user input.
    /// </summary>
    /// <param name="OnInputAccepted">The delegate that will be invoke with the results of the user input.</param>
    /// <param name="UserInputType">The type of input to get from the user.</param>
    /// <param name="Title">The title of the input dialog.</param>
    /// <param name="Id">A id to add to the input element.</param>
    /// <param name="DefaultValue">The default value to use in input elements that support it.</param>
    /// <param name="Instructions">Any instructions to show before the input element.</param>
    /// <param name="Class">A class to add to the input elements for elements that support it.</param>
    /// <param name="MultiSelectRows">For multiselect elements the number of rows to show.</param>
    /// <param name="PlaceholderText">Placeholder text for elements that support it.</param>
    /// <param name="SetFocus">Option to set the focus to the element.</param>
    /// <param name="UserInputOptions">Any options for input elements that support options. The first element is the value and the second is the label.</param>
    /// <param name="width">A width for the dialog.</param>
    /// <param name="height">A height for the dialog.</param>
    public static async Task GetInput(Delegate OnInputAccepted, 
        FreeBlazor.GetInput.InputType UserInputType = FreeBlazor.GetInput.InputType.Text,
        string Title = "", 
        string Id = "",
        string DefaultValue = "", 
        string Instructions = "", 
        string Class = "", 
        int? MultiSelectRows = null,
        string PlaceholderText = "",
        bool SetFocus = false,
        Dictionary<string, string>? UserInputOptions = null,
        string width = "", 
        string height = "")
    {
        Dictionary<string, object> parameters = new Dictionary<string, object>();
        parameters.Add("OnInputAccepted", OnInputAccepted);

        parameters.Add("UserInputType", UserInputType);

        if (!String.IsNullOrWhiteSpace(Id)) {
            parameters.Add("Id", Id);
        }

        if (!String.IsNullOrWhiteSpace(DefaultValue)) {
            parameters.Add("DefaultValue", DefaultValue);
        }

        if (!String.IsNullOrWhiteSpace(Instructions)) {
            parameters.Add("Instructions", Instructions);
        }

        if (!String.IsNullOrWhiteSpace(Class)) {
            parameters.Add("Class", Class);
        }

        if (MultiSelectRows.HasValue) {
            parameters.Add("MultiSelectRows", (int)MultiSelectRows);
        }

        if (!String.IsNullOrWhiteSpace(PlaceholderText)) {
            parameters.Add("PlaceholderText", PlaceholderText);
        }

        parameters.Add("SetFocus", SetFocus);

        if(UserInputOptions != null && UserInputOptions.Any()) {
            parameters.Add("UserInputOptions", UserInputOptions);
        }

        if (width == "auto") {
            width = "";
        }

        if (height == "auto") {
            height = "";
        }

        await _dialogService.OpenAsync<GetInputDialog>(Title, parameters, new DialogOptions() {
            AutoFocusFirstElement = false,
            Resizable = false,
            Draggable = false,
            Width = width,
            Height = height,
        });
    }

    /// <summary>
    /// Shows a dialog with the GeneratePassword component
    /// </summary>
    /// <param name="OnPasswordAccepted">The Delegate function that will receive the new password.</param>
    /// <param name="Title">An option to override the dialog title.</param>
    /// <param name="Class">A class to add to the new password field.</param>
    /// <param name="Length">Option to set the new password length.</param>
    /// <param name="RequireUpperCase">Option to specify if the new password requires uppercase characters.</param>
    /// <param name="RequireLowerCase">Option to specify if the new password requires lowercase characters.</param>
    /// <param name="RequireNumbers">Option to specify if the new password requires numbers.</param>
    /// <param name="RequireSpecialCharacters">Option to specify if the new password requires special characters.</param>
    public static async Task GetNewPassword(Delegate OnPasswordAccepted, string Title = "", string Class = "", int Length = 0,
        bool? RequireUpperCase = null, bool? RequireLowerCase = null, bool? RequireNumbers = null, bool? RequireSpecialCharacters = null)
    {
        if (String.IsNullOrWhiteSpace(Title)) {
            Title = "Generate Password";
        }

        Dictionary<string, object> parameters = new Dictionary<string, object>();
        parameters.Add("OnPasswordAccepted", OnPasswordAccepted);

        if (String.IsNullOrWhiteSpace(Class)) {
            Class = "form-control";
        }
        parameters.Add("Class", Class);

        if (Length > 0) {
            parameters.Add("Length", Length);
        }

        if (RequireUpperCase.HasValue) {
            parameters.Add("RequireUpperCase", (bool)RequireUpperCase);
        }

        if (RequireLowerCase.HasValue) {
            parameters.Add("RequireLowerCase", (bool)RequireLowerCase);
        }

        if (RequireNumbers.HasValue) {
            parameters.Add("RequireNumbers", (bool)RequireNumbers);
        }

        if (RequireSpecialCharacters.HasValue) {
            parameters.Add("RequireSpecialCharacters", (bool)RequireSpecialCharacters);
        }

        await _dialogService.OpenAsync<GeneratePasswordDialog>(Title, parameters, new Radzen.DialogOptions() {
            AutoFocusFirstElement = false,
            Resizable = false,
            Draggable = false,
            CloseDialogOnEsc = true,
            ShowClose = false,
        });
    }

    /// <summary>
    /// A popup HTML editor.
    /// </summary>
    /// <param name="OnEditCompleted">The required Delegate that will receive the HTML when the OK button is clicked.</param>
    /// <param name="HTML">Optional HTML to set in the editor.</param>
    /// <param name="Title">Optional title to override the default title.</param>
    /// <param name="config">Optional HtmlEditorConfiguration object to override default editor options.</param>
    /// <param name="width">Optional width. Leave empty for the default or set to "auto" for the dialog defaults.</param>
    /// <param name="height">Optional width. Leave empty for the default or set to "auto" for the dialog defaults.</param>
    public static async Task HtmlEditor(Delegate OnEditCompleted, string HTML = "", string Title = "", FreeBlazor.HtmlEditor.HtmlEditorConfiguration? config = null, string width = "", string height = "")
    {
        if (String.IsNullOrWhiteSpace(Title)) {
            Title = "Edit HTML";
        }

        Dictionary<string, object> parameters = new Dictionary<string, object>();
        parameters.Add("OnEditCompleted", OnEditCompleted);
        parameters.Add("Value", HTML);

        if (config != null) {
            parameters.Add("Config", config);
        }

        string top = String.Empty;

        if (String.IsNullOrWhiteSpace(width)) {
            width = "95%";
            top = "80px";
        }

        if (String.IsNullOrWhiteSpace(height)) {
            height = "calc(100vh - 120px)";
            top = "80px";
        }

        if (width == "auto") {
            width = "";
        }

        if (height == "auto") {
            height = "";
        }

        await _dialogService.OpenAsync<HtmlEditorDialog>(Title, parameters, new DialogOptions() {
            AutoFocusFirstElement = false,
            Resizable = false,
            Draggable = false,
            Width = width,
            Height = height,
            Top = top,
        });
    }

    /// <summary>
    /// Indicates if the helper class has been initialized by passing the required injection libraries.
    /// </summary>
    public static bool Initialized
    {
        get {
            return _initialized;
        }
    }

    /// <summary>
    /// Closes any open modal dialog.
    /// </summary>
    public static void ModalClose()
    {
        _dialogService.Close();
    }
}
