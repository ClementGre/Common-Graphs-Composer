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
    var cookie = [name, '=deleted; domain=', window.location.host.toString(), '; path=/; samesite = strict; expires=Fri, 1 Jan 1970 23:59:59 GMT; '].join('');
    document.cookie = cookie;
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
window.replaceAll = function replaceAll(text, pattern, replacement){
  var newText = text.replace(pattern, replacement);
  if(newText !== text){
    return replaceAll(newText, pattern, replacement);
  }
  return newText;
}
window.encode64 = function encode64(string){
    return replaceAll(btoa(string), "=", "-");
}
window.decode64 = function decode64(string){
    return atob(replaceAll(string, "-", "="));
}

// ARRAY/OBJ UTILS
window.findElementIndex = function findElementIndex(arr, name){
    for(var i = 0 ; i < arr.length ; i++){
    if(arr[i] == name)
        return i;
    }
    return undefined;
}
// VISUAL
window.openFullscreen = function openFullscreen(elem){
    if(elem.requestFullscreen){
        elem.requestFullscreen();
    }else if(elem.webkitRequestFullscreen){ /* Safari */
        elem.webkitRequestFullscreen();
    }else if(elem.msRequestFullscreen){ /* IE11 */
        elem.msRequestFullscreen();
    }
}
window.exitFullscreen = function exitFullscreen(){
    if(document.exitFullscreen){
        document.exitFullscreen();
    }else if(document.webkitExitFullscreen){ /* Safari */
        document.webkitExitFullscreen();
    }else if(document.msExitFullscreen){ /* IE11 */
        document.msExitFullscreen();
    }
}
window.updateTimelineNameInputWidth = function updateTimelineNameInputWidth(){
    var textfield = document.getElementById("timeline-name");
    if(textfield != undefined){
        textfield.style.width = "";
        textfield.style.width = ((textfield.scrollWidth+10) > 380 ? 380 : (textfield.scrollWidth+10)) + "px";
    }
}
// from https://stackoverflow.com/questions/2863351/checking-if-browser-is-in-fullscreen
window.isFullScreen = function isFullScreen(){
    return false;
  if($.browser.opera){

    var fs=$('<div class="fullscreen"></div>');
    $('body').append(fs);

    var check=fs.css('display')=='block';
    fs.remove();

    return check;
  }

  var st=screen.top || screen.availTop || window.screenTop;

  if(st!=window.screenY){

    return false;
  }

  return window.fullScreen==true || screen.height-document.documentElement.clientHeight<=30;
}


