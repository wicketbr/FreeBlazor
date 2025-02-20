using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FreeBlazor
{
    /// <summary>
    /// Creates a DateTime picker using native browser input elements.
    /// You must specifiy the TValue data type that will be used for setting the value and the returned value from the OnUpdate callback delegate.
    /// </summary>
    /// <typeparam name="TValue">REQUIRED: The data type that will be used for setting the value and the returned value from the OnUpdate callback delegate.</typeparam>
    public partial class DateTimePicker<TValue> : ComponentBase
    {
        protected string _class = String.Empty;
        protected string _id = Guid.NewGuid().ToString();

        protected string _dataType = "";

        protected DateTime? _dateTime;
        protected bool _nullable = false;

        protected object? _lastValue = null;

        protected string? _valueDateTime;
        protected string? _valueDateOnly;
        protected string? _valueTimeOnly;

        /// <summary>
        /// An optional class to add to the wrapper table (defaults to "datetime-picker").
        /// </summary>
        [Parameter] public string? Class { get; set; } = "datetime-picker";

        /// <summary>
        /// Option to override the default class for the "Clear" button (defaults to "btn btn-dark btn-sm").
        /// </summary>
        [Parameter] public string? ClearButtonClass { get; set; } = "btn btn-dark";

        /// <summary>
        /// Option to provide an icon for the "Clear" button.
        /// </summary>
        [Parameter] public string? ClearButtonIcon { get; set; } = "fa-regular fa-calendar-xmark";

        /// <summary>
        /// Option to override the text on the "Clear" button.
        /// </summary>
        [Parameter] public string? ClearButtonText { get; set; } = "Clear";

        /// <summary>
        /// Optional title text for the "Clear" button.
        /// </summary>
        [Parameter] public string? ClearButtonTitle { get; set; }

        /// <summary>
        /// Option to convert from UTC to local time and back to UTC when updating the value (defaults to False). Only applies to DateTime? and TimeOnly? data types.
        /// </summary>
        [Parameter] public bool ConvertFromUtcToLocalTime { get; set; }

        /// <summary>
        /// An optional id to for the select element. If left empty a random id will be generated.
        /// </summary>
        [Parameter] public string? Id { get; set; }

        /// <summary>
        /// An optional maximum value for the input.
        /// This can be a DateTime, DateOnly, TimeOnly, or String object.
        /// Not all browsers support the use of this value for all input types.
        /// </summary>
        [Parameter] public object? Max { get; set; }

        /// <summary>
        /// An optional minimum value for the input.
        /// This can be a DateTime, DateOnly, TimeOnly, or String object.
        /// Not all browsers support the use of this value for all input types.
        /// </summary>
        [Parameter] public object? Min { get; set; }

        /// <summary>
        /// Option to override the default class for the "Now" button (defaults to "btn btn-dark btn-sm").
        /// </summary>
        [Parameter] public string? NowButtonClass { get; set; } = "btn btn-dark";

        /// <summary>
        /// Option to provide an icon for the "Now" button.
        /// </summary>
        [Parameter] public string? NowButtonIcon { get; set; } = "fa-regular fa-calendar-plus";

        /// <summary>
        /// Option to override the text on the "Now" button.
        /// </summary>
        [Parameter] public string? NowButtonText { get; set; } = "Now";

        /// <summary>
        /// Optional title text for the "Now" button.
        /// </summary>
        [Parameter] public string? NowButtonTitle { get; set; }

        /// <summary>
        /// The required callback handler that will receive the updated value. This will receive a single parameter of type TValue.
        /// </summary>
        [Parameter] public Delegate? OnUpdate { get; set; }

        /// <summary>
        /// An optional delegate that will be called when the value is updated.
        /// This delegate will receive no parameter.
        /// </summary>
        [Parameter] public Delegate? OnValueChanged { get; set; }

        /// <summary>
        /// Use this to add a class to the input field when no value is present to indicate the field is require but missing a value.
        /// </summary>
        [Parameter] public string? RequiredClass { get; set; }

        /// <summary>
        /// An option to show a "Clear" button. Most browsers include this functionality by default, so this defaults to False.
        /// This should only be used for nullable data types.
        /// </summary>
        [Parameter] public bool ShowClearButton { get; set; } = false;

        /// <summary>
        /// An option to show a "Now" button to set the current date and time. Most browsers include this functionality by default, so this defaults to False.
        /// </summary>
        [Parameter] public bool ShowNowButton { get; set; } = false;

        /// <summary>
        /// An optional step value for the input. Refer to the HTML standards for this value.
        /// </summary>
        [Parameter] public int? Step { get; set; }

        /// <summary>
        /// An option to override the default class of "datetime-picker" that gets added to the wrapper table.
        /// You can add your own class if you wish to provide your own CSS to style the elements.
        /// </summary>
        [Parameter] public string TableClass { get; set; } = "datetime-picker";

        /// <summary>
        /// An option to update the value when the date changes without the time. Only applies to the separate date and time inputs.
        /// </summary>
        [Parameter] public bool UpdateOnDateChangeWithoutTime { get; set; }

        /// <summary>
        /// The initial value to display. 
        /// This must match the type specified in TValue.
        /// Supported data types are DateTime, DateTime?, DateOnly, DateOnly?, TimeOnly, and TimeOnly?.
        /// </summary>
        [Parameter] public object? Value { get; set; }

        /// <summary>
        /// Option to wrap the picker in a table for formatting. Defaults to true.
        /// If disabled your formatting may be off.
        /// </summary>
        [Parameter] public bool WrapInTable { get; set; } = true;

        protected override void OnAfterRender(bool firstRender)
        {
            if (firstRender) {
                _lastValue = Value;

                UpdateValue(Value);
                RenderControl();
            }
        }

        protected override void OnParametersSet()
        {
            RenderControl();

            if(Value != _lastValue) {
                UpdateValue(Value);
            }
        }

        // This property will always contain a nullable DateTime that contains the calculated value that should be output.
        protected DateTime? CalculatedValue
        {
            get {
                DateTime? output = null;

                if (_dateTime.HasValue) {
                    switch (_dataType) {
                        case "dateonly":
                            output = _dateTime.Value;
                            _valueDateOnly = _dateTime.Value.ToString("yyyy-MM-dd");
                            break;

                        case "timeonly":
                            output = _dateTime.Value;
                            _valueTimeOnly = _dateTime.Value.ToString("HH:mm");
                            break;

                        default:
                            output = _dateTime.Value;
                            _valueDateTime = _dateTime.Value.ToString("yyyy-MM-dd HH:mm");
                            break;
                    }
                } else {
                    _valueDateOnly = null;
                    _valueDateTime = null;
                    _valueTimeOnly = null;
                }

                return output;
            }
        }

        protected void Clear()
        {
            _dateTime = null;
            _valueDateOnly = null;
            _valueDateTime = null;
            _valueTimeOnly = null;
            TriggerOnUpdateCallback();
        }

        protected string InputClass
        {
            get {
                string output = _class;

                if (!String.IsNullOrWhiteSpace(RequiredClass) && !_dateTime.HasValue) {
                    if (!String.IsNullOrEmpty(output)) {
                        output += " " + RequiredClass;
                    } else {
                        output += RequiredClass;
                    }
                }

                return output;
            }
        }

        protected string InputMax
        {
            get {
                string output = String.Empty;

                if (Max != null) {
                    output = InputMaxOrMinValue(Max);
                }

                return output;
            }
        }

        protected string InputMin
        {
            get {
                string output = String.Empty;

                if (Min != null) {
                    output = InputMaxOrMinValue(Min);
                }

                return output;
            }
        }

        protected string InputMaxOrMinValue(object? o)
        {
            string output = String.Empty;

            if (o != null) {
                try {
                    if (o.GetType() == typeof(DateOnly) || o.GetType() == typeof(DateOnly?)) {
                        output += ((DateOnly)o).ToString("yyyy-MM-dd");
                    } else if (o.GetType() == typeof(TimeOnly) || o.GetType() == typeof(TimeOnly?)) {
                        output += ((TimeOnly)o).ToString("HH:mm");
                    } else if (o.GetType() == typeof(DateTime) || o.GetType() == typeof(DateTime?)) {
                        output += ((DateTime)o).ToString("yyyy-MM-ddTHH:mm");
                    } else if (o.GetType() == typeof(String)) {
                        output += o.ToString();
                    }
                } catch { }
            }

            return output;
        }

        protected string InputStep
        {
            get {
                string output = "any";

                if (Step != null && Step.HasValue && Step.Value > 0) {
                    output = Step.Value.ToString();
                }

                return output;
            }
        }

        protected void OnChangeDateTime(ChangeEventArgs e)
        {
            DateTime? d = null;

            if (e != null && e.Value != null) {
                try {
                    d = DateTime.Parse("" + e.Value.ToString());
                } catch { }
            }

            _dateTime = d;
            TriggerOnUpdateCallback();
        }

        protected void OnChangeTime(ChangeEventArgs e)
        {
            TimeOnly? t = null;

            if (e != null && e.Value != null) {
                try {
                    t = TimeOnly.Parse("" + e.Value.ToString());
                } catch { }
            }

            if (t == null) {
                _dateTime = null;
            } else {
                _dateTime = Convert.ToDateTime(t.Value.ToString());
            }

            TriggerOnUpdateCallback();
        }

        protected void RenderControl()
        {
            string updatedId = !String.IsNullOrWhiteSpace(Id) ? Id : _id;
            if (_id != updatedId) {
                _id = updatedId;
            }

            string updatedClass = !String.IsNullOrWhiteSpace(Class) ? Class : "";
            if (_class != updatedClass) {
                _class = updatedClass;
            }
        }

        protected void SetNow()
        {
            _dateTime = DateTime.Now;
            StateHasChanged();
            TriggerOnUpdateCallback();
        }

        protected void TriggerOnUpdateCallback()
        {
            object? output = null;

            if (CalculatedValue.HasValue) {
                switch (_dataType) {
                    case "dateonly":
                        var dateOnly = DateOnly.FromDateTime((DateTime)CalculatedValue);
                        if(dateOnly > DateOnly.FromDateTime(Convert.ToDateTime("1/1/1753")) && dateOnly < DateOnly.FromDateTime(Convert.ToDateTime("12/31/9999"))) {
                            output = dateOnly;
                        }
                        break;

                    case "timeonly":
                        if (ConvertFromUtcToLocalTime) {
                            output = TimeOnly.FromDateTime(((DateTime)CalculatedValue).ToUniversalTime());
                        } else {
                            output = TimeOnly.FromDateTime((DateTime)CalculatedValue);
                        }
                        break;

                    default:
                        DateTime? dateTime = null;

                        if (ConvertFromUtcToLocalTime) {
                            dateTime = CalculatedValue.Value.ToUniversalTime();
                        } else {
                            dateTime = CalculatedValue;
                        }

                        if(dateTime != null && dateTime.Value > Convert.ToDateTime("1/1/1753") && dateTime.Value < Convert.ToDateTime("12/31/9999")) {
                            output = dateTime;
                        }
                        break;
                }
            }

            // Only update if there is a value or if this is a nullable type.
            if (output != null || _nullable) {
                if (OnUpdate != null) {
                    OnUpdate.DynamicInvoke(output);
                }
                
                if (OnValueChanged != null) {
                    OnValueChanged.DynamicInvoke();
                }
            }

            StateHasChanged();
        }

        protected void TimeUpdated(TimeOnly? time)
        {
            if (time.HasValue) {
                _dateTime = Convert.ToDateTime(time.Value.ToString());
            } else {
                _dateTime = null;
            }

            TriggerOnUpdateCallback();
        }

        /// <summary>
        /// An option to update the value after the control has already been rendered.
        /// </summary>
        /// <param name="value">The updated object value (must be a DateTime?, DateOnly?, or TimeOnly? object.)</param>
        public void UpdateValue(object? value)
        {
            _dateTime = null;

            _dataType = "datetime";

            if (typeof(TValue) == typeof(DateOnly) || typeof(TValue) == typeof(DateOnly?)) {
                _dataType = "dateonly";
            } else if (typeof(TValue) == typeof(TimeOnly) || typeof(TValue) == typeof(TimeOnly?)) {
                _dataType = "timeonly";
            }

            _nullable = System.Nullable.GetUnderlyingType(typeof(TValue)) != null;

            if (value != null) {
                switch (_dataType) {
                    case "dateonly":
                        _dateTime = ((DateOnly)value).ToDateTime(TimeOnly.Parse("12:00:00 PM"));
                        break;

                    case "timeonly":
                        _dateTime = Convert.ToDateTime(((TimeOnly)value).ToString());
                        break;

                    default:
                        _dateTime = (DateTime)value;
                        break;
                }
            }

            if (ConvertFromUtcToLocalTime) {
                if (_dateTime.HasValue) {
                    _dateTime = _dateTime.Value.ToLocalTime();
                }
            }

            // Touch the Calculated value to force a refresh.
            var cv = CalculatedValue;

            _lastValue = value;

            StateHasChanged();
        }
    }
}
