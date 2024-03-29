function utf8ToAscii(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function getDateToJSDate(gedDate) {
    gedDate = gedDate?.valueAsDate()[0]?.date;
    if (gedDate === undefined) return null;
    let date = new Date();
    date.setDate(gedDate.day);
    date.setMonth(gedDate.month-1);
    date.setFullYear(gedDate.year.value);
    return date;
}
function getDateToString(gedDate) {
    const date = getDateToJSDate(gedDate)
    if (date === null) return "";
    return date.toDateString();
}

// FLOATERS
window.displayCheckFloater = function displayCheckFloater(){
    $('#disapear-floater').css('display', 'block');
    $('.floater i.check').css('display', 'block');
    setTimeout(() => {
        $('#disapear-floater').css('display', 'none');
        $('.floater i.check').css('display', 'none');
    }, 500);
}
window.displayLoader = function displayLoader(){
    $('#floater').css('display', 'block');
    $('.floater i.loader').css('display', 'block');
}
window.hideLoader = function hideLoader(){
    $('#floater').css('display', 'none');
    $('.floater i.loader').css('display', 'none');
}

// DATA SAVING
window.set_local_data = function save_data(name, value){
    localStorage.setItem(name, JSON.stringify(value));
}
window.get_local_data = function read_local_data(name){
    return JSON.parse(localStorage.getItem(name));
}
window.remove_local_data = function delete_local_data(name){
    localStorage.removeItem(name);
}

// UTILS

function prettyPrintJSONtoHTML(json) {
    return JSON.stringify(json, function(k, v){
        let doStringify = false;
        if(v instanceof Array && v.every(a => !(a instanceof Object || a instanceof Array) || a instanceof Date)){
            doStringify = true;

        }else if(v instanceof Object && Object.values(v).every(a => !(a instanceof Object || a instanceof Array) || a instanceof Date )){
            doStringify = true;
        }
        if (doStringify){
            return JSON.stringify(v)
                .replace(/\\"/g, "\"")
                .replace(/","/g, "\", \"")
                .replace(/":"/g, "\": \"")
        }
        return v;
    }, 4)
        .replace(/\\/g, '')
        .replace(/\"\[/g, '[')
        .replace(/\]\"/g,']')
        .replace(/\"\{/g, '{')
        .replace(/\}\"/g,'}')
        .replace(/\n/g, "<br>")
        .replace(/    /g, "&nbsp;&nbsp;")
}
