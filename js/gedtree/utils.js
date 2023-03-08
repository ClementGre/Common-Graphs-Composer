function utf8ToAscii(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function gedDateToJSDate(gedDate) {
    gedDate = gedDate?.valueAsDate()[0]?.date;
    if (gedDate === undefined) return null;
    let date = new Date();
    date.setDate(gedDate.day);
    date.setMonth(gedDate.month-1);
    date.setFullYear(gedDate.year.value);
    return date;
}
function gedDateToString(gedDate) {
    const date = gedDateToJSDate(gedDate)
    if (date === null) return "";
    return date.toDateString();
}
