# FreeBlazor Components

A set of free native Blazor components built in .NET 8.

## Getting Started with FreeBlazor

### 1. Install

Install the nuget package. You can add the package to your project using any of the following methods.

- Install the package from the command line by running *dotnet add package FreeBlazor*
- Add the package from the Visual Nuget Package Manager by searching of *FreeBlazor*
- Manually edit the project file to add a reference to the nuget package.

### 2. Import the Namespace

Open the *_Imports.razor* file of your Blazor application and add the line *@using FreeBlazor*. This step is optional, as you can always reference the components using the full namespace and component name (eg: `<FreeBlazor.DeleteConfirmation />` instead of `<DeleteConfirmation />`).

### 3. Include a Reference to the CSS Resources

Open your main Blazor application page (*App.razor*, *Pages\_Layout.cshtml*, *Pages\_Host.cshtml*, or *wwwroot/index.html*) and include a reference to the CSS file as:

    <link rel="stylesheet" href="_content/FreeBlazor/styles.css" />

You can omit the CSS file if you do not wish to use the included styling and instead want to handle the styling yourself.

### 4. Use a Component

    <DeleteConfirmation OnConfirmed="YourDeleteMethod" />

## The Components

### AutoComplete

An autocomplete field similar to the jQuery UI autocomplete component. There are a couple of
properties that are required. They are:

- GetAutoCompleteItems - This is a method that will be invoked receiving the current text that has been typed in the input and needs to return a tuple list `List<(string key, string label)>?`.
- OnSelected - A function that will be invoked when an item is selected from the list. This function will receive the selected tuple value `(string key, string label)`.

The other optional parameters are documented with XML markup comments to help with their use. An example of using this component is:

    <AutoComplete 
	    GetAutoCompleteItems="YourUserLookupMethod"
	    HighlightFirstMatch="true"
	    LookupDelay="300"
	    MatchParentWidth="true"
	    MinimumCharacters="1"
	    OnSelected="AutoCompleteItemSelected"
	    PlaceholderText="Search for a User" />

### AutoGrowText

A textarea that auto-resizes the height to fit the content.

	<AutoGrowText 
        @bind-Value="_content"
        Class="form-control"
        Id="auto-grow-textarea"
        MinimumHeight="100px" />

### ConfirmationCode

A simple text input that uses some dynamic CSS to make the individual digits
appear to be in their own box. Useful for entering confirmation codes.
Defaults to 6-digits, but can be customized.
There are more properties that can be overriden for things like
BackgroundColor, BorderColor, TextSize, and WrapperClass.
The TextSize property is used to set the pixel size of the font used, and defaults to 80.
No option is given to set the font color. Instead, add a class of your choice using the InputClass
property and use that in your CSS to specify the font color. Otherwise, it will use your
browser's default font color.

	<ConfirmationCode
		Id="your-confirmation-code"
		Length="6"
		InputClass="confirmation-code-text"
		@bind-Value="_confirmationCode" />

### DateTime Picker

A simple datetime picker that uses native browser input controls. Includes options for converting from UTC to local time and back. The input type is determined based on the data type specified in the TValue property.

    <DateTimePicker 
        OnUpdate="@((DateTime? v) => _myLocalDateTimeValue_ = v)"
        OnValueChanged="StateHasChanged"
        TValue="DateTime?"
        Value="_myLocalDateTimeValue" />

### Delete Confirmation

A simple component that shows a delete button initially. Then, when that button is clicked it is replaced with a cancel button and confirm delete button. The only required parameter for this component is an EventCallback for the OnConfirmed parameter. This is the method which will be invoked when the final confirm delete button is clicked. There are additional parameters that can be used to override the default text labels, icons, and button classes. The defaults will use FontAwesome icons and Bootstrap classes on the buttons. An example of using this component is:

    <DeleteConfirmation OnConfirmed="YourDeleteFunction" />

### Get Input

A control user to get user input with options for what type of input element to use. Supports Text, Textarea, Select, Multiselect, Radio, Checkbox, and Confirmation options. The Delegate callback handler function will receive either a string, a List&lt;string&gt;, or a bool depending on the type of input. For elements that return a single value you should expect a string, for elements that support multiple selections (Multiselect and Checkbox) then you should expect a List&lt;string&gt;, and for Confirmations you should expect a bool.

    <GetInput 
        Id="get-input-textarea"
        UserInputType="GetInput.InputType.Textarea"
        PlaceholderText="Enter something here..."
        Class="form-control"
        OnInputAccepted="GotInputTextarea" 
        OnValueChanged="StateHasChanged" />

### Generate Password

A control used to generate a random password with options for length and toggles for requiring uppercase, lowercase, numbers, and special characters. Can be used on a page, but works better in a dialog as a popup selector. An example of using this component is:

    <GeneratePassword 
        OnPasswordGenerated="GeneratedPassword"
        OnValueChanged="StateHasChanged" />

    protected void GeneratedPassword(string password){
        User.Password = password;
    }

### HTML Editor

An HTML editor that uses the ckEditor 4 to create an editor that can be used as-is or highly customized via a configuration parameter. No parameters are required to use this control. You can set a @ref to the element so that you can get and set the values. An example of using this component is:

    <HtmlEditor 
        @ref="_htmlEditor"
        Config="_config"
        OnModeChanged="OnModeChanged"
        OnValueChanged="StateHasChanged" />

    @code {
        HtmlEditor _htmlEditor;
        protected HtmlEditor.HtmlEditorConfiguration _config = new HtmlEditor.HtmlEditorConfiguration {
            PlaceholderText = "Enter Your HTML Here",
            SimpleView = false,
        };
    }

    // Examples of interacting with the editor
    // Set the HTML
    await _htmlEditor.SetHTML("<p>Your HTML Here</p>");

    // Set the Focus
    await _htmlEditor.SetFocus();

    // Get the HTML
    string html = await _htmlEditor.GetHTML();


### MultiSelect

A multiselect list that gets around some of the limitations of trying to do that standard Blazor binding against a select list with the multiple flag set to true. Pass in your options to the Options parameter as a tuple list (eg: `List<(string value, string label, bool selected)>`). An optional Action parameter OnUpdate can be set to notify your code when the values have changed. These will be passed as a `List<string>` to your function. An example of using this component is:

    <MultiSelect
        Class="form-select"
        Id="test-select-list"
        Options="YourListOfOptions"
        OnUpdate="YourFunctionToBeNotifiedWhenTheSelectionChange"
        OnValueChanged="StateHasChanged"/>

The parameters for this component are all documented with XML comments.

### Paged Recordset

A control for displaying a table to represent a collection of data. The only required parameters are RecordData which uses an internal class of Recordset to take the information about your data and the NavigationCallbackHander which takes an action that will be invoked when the records per page changes, the current page is changed, or a column sort is changed. All parameters have XML comments for help with using them. An example of using this component is:

    <PagedRecordset 
        NavigationCallbackHander="YourNavigationCallbackHander"
        RecordData="YourRecordsetObjectThatContainsYourDataInformation" />

### String List

A control for binding to a List&lt;string&gt;. The list will be rendered in a table with a class of "string-list"
that you can use to style the layout. By default the remove item button will have a class of "btn btn-danger btn-sm"
and an icon of &lt;i class=\"fa-solid fa-xmark\"&gt;&lt;/i&gt;. You can override these defaults by setting the
RemoveButtonClass, RemoveIcon, RemoveText, and RemoveTooltip parameters. Use the @bind-Value option for
two-way binding support. Use the optional OnValueChanged Delegate to get notified when the values have changed.

	<StringList 
	    @bind-Value="_items"
        OnValueChanged="StateHasChanged" />

### Toggle Password Input

A control for showing a password with icons to show/hide the password and options for showing a "copy to clipboard" icon.

    <TogglePasswordInput 
        Class="@(_disabled ? "" : "form-control")"
        Disabled="_disabled"
        DisabledIconsAtEnd="false"
        IconCopyToClipboard="fa-regular fa-copy"
        IconHidePassword="fa-regular fa-eye-slash"
        IconShowPassword="fa-regular fa-eye"
        Id="toggle-password-input" 
        OnChange="OnPasswordChanged"
        OnValueChanged="StateHasChanged"
        OnToggledShowPassword="OnToggledShowPassword"
        PasswordCopiedToClipboard="OnPasswordCopiedToClipboard"
        Placeholder="Enter a Password"
        RequiredClass="missing-empty"
        ShowCopyPasswordButton="true"
        ShowPassword="false"
        TextCopyToClipboard="Copy to Clipboard"
        TextHidePassword="Hide Password"
        TextShowPassword="Show Password"
        UseBootstrapInputGroup="true"
        Value="@_password" />

## Contact

Contact Brad Wickett at [brad@wickett.net](mailto:brad@wickett.net) for assistance.

You can also download the source code for this project from my Azure DevOps site at [https://wickett.visualstudio.com/FreeBlazor](https://wickett.visualstudio.com/FreeBlazor). The source code includes a demo Blazor app that shows how to use each component, along with some more advanced demos of using components inside of a dialog.
