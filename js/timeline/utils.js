// from https://stackoverflow.com/questions/11344531/pure-javascript-store-object-in-cookie
// timeline-ui-lasttab               : "event"/"settings"
// timeline-settings-[SECTION]       : { Section JSON }
// timeline-timelines                : [timelines names list]
// timeline-timeline-[TIMELINE NAME] : { Timeline JSON}
// timeline-lasttimeline             : last opened timeline name
window.bake_cookie = function bake_cookie(name, value) {
  var cookie = [name, '=', JSON.stringify(value), '; domain=', window.location.host.toString(), '; path=/; samesite = strict; expires=Fri, 31 Dec 9999 23:59:59 GMT; '].join('');
  document.cookie = cookie;
}
window.read_cookie = function read_cookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}
window.delete_cookie = function delete_cookie(name) {
  document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}
//

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

// UTILS
window.parseMonth = function parseMonth(month){
    // J + A     | January - Janvier
    // F         | February - Février
    // MA + R    | March - Mars
    // A + P/V   | April - Avril
    // MA + x    | May - Mai
    // JU + N/IN | June - Juin
    // J + x     | July - Juillet
    // A + x     | August - Août
    // S         | September - Septembre
    // O         | October - Octobre
    // N         | November - Novembre
    // D         | December - Décembre
    month = month.toUpperCase();
    var ch12 = month.substr(0, 2);
    var ch1 = month.charAt(0);
    var ch2 = month.charAt(1);
    
    var ch34 = month.substr(2, 2);
    var ch3 = month.charAt(2);
    var ch4 = month.charAt(3);
    switch(ch1){
        case 'F': // February
            return 2;
        case 'M': // March / May
            if(ch3 == 'R'){
                return 3;
            }
            return 5;
        case 'J': // January / June / July
            if(ch2 == 'A'){
                return 1;
            }else if(ch3 == 'N' || ch34 == 'IN'){
                return 6;
            }
            return 7;
        case 'A': // April / August
            if(ch2 == 'P' || ch2 == 'V'){
                return 4;
            }
            return 8;
        case 'S': // September
            return 9;
        case 'O': // October
            return 10;
        case 'N': // November
            return 11;
        case 'D': // December
            return 12;
    }
    return undefined;
}
window.parseDate = function parseDate(date){
    var args = date.split(/[^a-zA-Z0-9]/);
    var month = undefined;
    var day = undefined;
    var year = undefined;
    args.forEach((arg, i) => {
        var intArg = parseInt(arg, 10);
        console.log(arg)
        if(isNaN(intArg) && month == undefined){
            month = parseMonth(arg);
        }
    });
    args.forEach((arg, i) => {
        var intArg = parseInt(arg, 10);
        if(!isNaN(intArg)){
            if(month == undefined && intArg <= 12 && intArg >= 1){
                month = intArg;
            }else if(day == undefined && intArg <= 31 && intArg >= 1){
                day = intArg;
            }else if(year == undefined && intArg <= 9999 && intArg >= 0){
                year = intArg;
            }
        }
    });
    if(month == undefined) month = 1;
    if(day == undefined) day = 1;
    return {month: month, day: day, year: year};
}

// ARRAY/OBJ UTILS
window.findElementIndex = function findElementIndex(arr, name){
  for (var i = 0 ; i < arr.length ; i++)
    if(arr[i] == name)
      return i;
  return undefined;
}