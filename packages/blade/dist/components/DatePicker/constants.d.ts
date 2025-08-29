declare const classes: {
    readonly levelsGroup: "DatePicker-levelsGroup";
    readonly dayCell: "DatePicker-cell";
    readonly monthsListControl: "DatePicker-cell";
    readonly yearsListControl: "DatePicker-cell";
    readonly calendarHeader: "DatePicker-header";
    readonly row: "DatePicker-row";
    readonly weekday: "DatePicker-weekday";
};
declare const pickerToLevel: {
    readonly day: "month";
    readonly month: "year";
    readonly year: "decade";
};
declare const levelToPicker: {
    readonly month: "day";
    readonly year: "month";
    readonly decade: "year";
};
export { levelToPicker, pickerToLevel, classes };
