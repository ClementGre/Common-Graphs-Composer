// Cookies clearer
var cookies = document.cookie.split(";");
if(false){
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; domain=', window.location.host.toString(), '; path=/; samesite = strict; expires=Fri, 1 Jan 1970 23:59:59 GMT; ";
    }
}

var app = new Vue({
    el: "#app",
    name: "timeline",
    data: {
        user: "Clement",
        timeline: {
            periodevents: constants.defaultPeriodEvents,
            dateevents: constants.defaultDateEvents,
        },
        sortedTimeline: {
            dateyears: [],
            periodyears: [],
            lineyears: [],
            dateyearsevents: {},
            periodyearsevents: {}
        },
        renderData: {
            dateEventsOccuped: [],
            yearPx: 0,
            yearDivideFactor: 1,
            
            sectedYearTarget: undefined
        },
        settings: {},
        settingsDetails: constants.settingsDetails,
        ui: {
            timelineName: "unnamed timeline",
            currentTab: read_cookie('timeline-ui-lasttab') == undefined ? "settings" : read_cookie('timeline-ui-lasttab'),
            selectedType: 0,
            selectedYear: undefined,
            selectedIndex: undefined,
            fullScreen: false,
            browserFullScreen: false,
            timelinesMenu: false,
            timelinesMenuX: 0,
            timelines: read_cookie('timeline-timelines') == undefined ? [] : read_cookie('timeline-timelines')
        }
    },
    computed: {
        orderedDateEvents: function (){
            this.timeline.dateevents = _.orderBy(this.timeline.dateevents, 'year');
        },
        orderedPeriodEvents: function (){
            this.timeline.periodevents = _.orderBy(this.timeline.periodevents, 'year');
        },
        timelineName: {
            get: function(){
                return this.ui.timelineName;
            },
            set: function(originValue){
                var value = originValue.replace(/[^A-Za-z0-9à-ü ._^%$#!~@-]/g, "");
                if(originValue !== value){
                    $('#timeline-name').val(value);
                }
                value = $.trim(value);
                if(value === "" || findElementIndex(this.ui.timelines, value) != undefined){
                    setTimeout(() => {
                        if($.trim($('#timeline-name').val()) === value){
                            $('#timeline-name').val(this.ui.timelineName);
                        }
                    }, 1000);    
                    return;
                }
                var oldValue = this.ui.timelineName;
                this.ui.timelineName = value;
                this.renameTimeline(oldValue, value);
            }
        },
        selectedEventTitle: {
            get: () => {
                return app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].title;
            },
            set: (value) => {
                app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].title = value;
                setTimeout(() => {
                    app.sortTimeline();
                    setTimeout(() => {
                        app.sortTimeline();
                    }, 0);
                }, 0);
            }
        },
        selectedEventDescription: {
            get: () => {
                setTimeout(() => {
                    var textarea = document.getElementById("event-description-field");
                    if(textarea != undefined){ textarea.style.height = ""; textarea.style.height = textarea.scrollHeight + "px";} 
                }, 0);
                return app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].description;
            },
            set: (value) => {
                var textarea = document.getElementById("event-description-field");
                if(textarea != undefined){ textarea.style.height = ""; textarea.style.height = textarea.scrollHeight + "px";}
                app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].description = value;
                setTimeout(() => {
                    app.sortTimeline();
                    setTimeout(() => {
                        app.sortTimeline();
                    }, 0);
                }, 0);
            }
        },
        selectedEventDate: {
            get: () => {
                if(app == undefined || !(app.ui.selectedType != undefined && app.ui.selectedYear != undefined && app.ui.selectedIndex != undefined)) return "";
                if(app.ui.selectedType == 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }else{
                    return app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }
            },
            set: (value) => {
                if(app == undefined || !(app.ui.selectedType != undefined && app.ui.selectedYear != undefined && app.ui.selectedIndex != undefined)) return;
                var dateData = parseDate(value);

                if(app.ui.selectedType == 1){
                    // if(dateData.day != undefined) this.timeline.periodevents[ui.selectedYear][ui.selectedIndex].date
                }else{
                    app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].date = value;
                    console.log(dateData)
                    if(dateData.month != undefined) app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].month = dateData.month;
                    if(dateData.day != undefined) app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].day = dateData.day;
                    if(dateData.year != undefined){
                        if(dateData.year != app.ui.selectedYear){
                            app.updateEventYear(dateData.year);
                        }
                    }
                    app.sortTimeline();
                    setTimeout(() => {
                        app.sortTimeline();
                        setTimeout(() => {
                            app.sortTimeline();
                        }, 0);
                    }, 0);
                }
            }
        },
        selectedEventEndDate: {
            get: () => {
                if(app == undefined || !(app.ui.selectedType != undefined && app.ui.selectedYear != undefined && app.ui.selectedIndex != undefined)) return "";
                if(app.ui.selectedType == 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }
                return "";
            },
            set: (value) => {
                if(app == undefined || !(app.ui.selectedType != undefined && app.ui.selectedYear != undefined && app.ui.selectedIndex != undefined)) return;
                var dateData = parseDate(value);
                if(app.ui.selectedType == 1){

                }else{
                    
                }
            }
        },
    },
    methods: {
        createEvent(){
            if(this.ui.selectedYear != undefined && this.ui.selectedIndex != undefined){
                var selectedData = JSON.parse(JSON.stringify(this.timeline.dateevents[this.ui.selectedYear][this.ui.selectedIndex]));
                selectedData.title = ""; selectedData.description = "";
                this.timeline.dateevents[this.ui.selectedYear].push(selectedData);
                this.ui.selectedIndex = this.timeline.dateevents[this.ui.selectedYear].length -1;
            }else{
                var year = this.sortedTimeline.lineyears[Math.round(this.sortedTimeline.lineyears.length/2)];
                if(this.timeline.dateevents[year] == undefined) Vue.set(this.timeline.dateevents, year, []);
                this.timeline.dateevents[year].push({date: "" + year, day: 1, month: 1, title: "", description: ""});
                this.ui.selectedIndex = this.timeline.dateevents[year].length -1;
                this.ui.selectedYear = year; this.ui.selectedType = 0;
            }
            
            this.sortTimeline();
            Vue.set(this.timeline.dateevents, this.ui.selectedYear, this.timeline.dateevents[this.ui.selectedYear]);
            setTimeout(() => {
                this.sortTimeline();
            }, 0);
        },
        deleteSelectedEvent(){
            this.timeline.dateevents[this.ui.selectedYear].splice(this.ui.selectedIndex, 1);
            if(this.timeline.dateevents[this.ui.selectedYear].length == 0){
                delete this.timeline.dateevents[this.ui.selectedYear+""];
            }
            this.ui.selectedYear = undefined;
            this.ui.selectedIndex = undefined;
            this.ui.selectedType = undefined;
            setTimeout(() => {
                this.sortTimeline();
            }, 0);
        },
        duplicateSelectedEvent(){
            this.timeline.dateevents[this.ui.selectedYear].push(JSON.parse(JSON.stringify(this.timeline.dateevents[this.ui.selectedYear][this.ui.selectedIndex])));
            this.ui.selectedIndex = this.timeline.dateevents[this.ui.selectedYear].length -1;
            this.sortTimeline();
            Vue.set(this.timeline.dateevents, this.ui.selectedYear, this.timeline.dateevents[this.ui.selectedYear]);
            setTimeout(() => {
                this.sortTimeline();
            }, 0);
        },
        updateEventYear(target){
            this.renderData.sectedYearTarget = target;
            setTimeout(() => {
                if(this.renderData.sectedYearTarget == target){
                    this.switchSelectedEventYear(target);
                    app.sortTimeline();
                    setTimeout(() => {
                        app.sortTimeline();
                    }, 0);
                }
            }, 1000);
        },
        switchSelectedEventYear(target){
            if(this.ui.selectedType == 1){

            }else{
                if(this.timeline.dateevents[target] == undefined){
                    Vue.set(this.timeline.dateevents, target, []);
                }
                // Push new element
                this.timeline.dateevents[target].push(this.timeline.dateevents[this.ui.selectedYear][this.ui.selectedIndex]);
                // Remove last element
                this.timeline.dateevents[this.ui.selectedYear].splice(this.ui.selectedIndex, 1);
                if(this.timeline.dateevents[this.ui.selectedYear].length == 0){
                    delete this.timeline.dateevents[this.ui.selectedYear]
                }

                // Update ui vars
                this.sortTimeline();
                this.ui.selectedYear = target;
                this.ui.selectedIndex = this.timeline.dateevents[target].length -1;

                // updateVueJs
                Vue.set(this.timeline.dateevents, target, this.timeline.dateevents[target]);
                
                setTimeout(() => {
                    app.sortTimeline();
                    setTimeout(() => {
                        app.sortTimeline();
                    }, 0);
                }, 0);
            }
        },
        selectEvent(year, index){
            var eventData = this.sortedTimeline.dateyearsevents[year][index];
            this.$set(this.ui, "selectedType", 0);
            this.$set(this.ui, "selectedYear", year);
            this.$set(this.ui, "selectedIndex", eventData.index);
            this.$set(this.ui, "currentTab", "event");
        },
        selectPeriod(year, index){
            this.ui.selectedType = 1;
            this.ui.selectedYear = year;
            this.ui.selectedIndex = index;
        },
        editSetting: function(data){
            if(data.subname != undefined) this.$set(this.settings[data.section][data.name], data.subname, data.value);
            else this.$set(this.settings[data.section], data.name, data.value);
        },
        resetSection: function(section){
            this.settings[section] = this.generateSettings(this.settingsDetails[section]);
            setTimeout(() => {
                $.each($("main .panel .pane input[data-jscolor]"), function(index, element){
                    element.jscolor.fromString($(element).val()); // Update for JSColor
                });
            }, 0);
        },
        loadDefaultSection: function(section){
            var data = read_cookie('timeline-settings-' + section);
            if(data == undefined) this.settings[section] = this.generateSettings(this.settingsDetails[section]);
            else this.settings[section] = data;
            setTimeout(() => {
                $.each($("main .panel .pane input[data-jscolor]"), function(index, element){
                    element.jscolor.fromString($(element).val()); // Update for JSColor
                });
            }, 0);
        },
        loadDefaultSettings: function(){
            this.loadDefaultSection('global');
            this.loadDefaultSection('years');
            this.loadDefaultSection('events');
            this.loadDefaultSection('periods');
        },
        setDefaultSection: function(section){
            bake_cookie('timeline-settings-' + section, this.settings[section]);
            displayCheckFloater();
        },
        generateSettings: function(source){
            var result = {}
            Object.keys(source).forEach(name => {
                if(typeof source[name] == 'object'){
                    if(source[name].type != undefined){
                        result[name] = source[name].value;
                    }else{
                        result[name] = this.generateSettings(source[name]);
                    }
                }
            });
            return result;
        },
        updateYearPx: function(){
            // Width of a year in px (First year = First event && Last year = Last event)
            // DivideFactor is calculated by comparing this value to the total timeline width
            var lastAndFirstYears = this.getFirstAndLastYears();
            var yearsLength = lastAndFirstYears.lastYear - lastAndFirstYears.firstYear;
            var yearpx = (this.getTimelineWidth()-this.settings.events.width-40) / yearsLength;
            if(yearpx === 0) yearpx = 0.001;

            // Width of a year in px (First year = First visible event && Last year = Last visible event)
            // (First year can do not having an event since the first year is round to the last year who % divideFactor == 0)
            // This is the final width of a year on the screen
            var showedLastAndFirstYears = this.getShowedFirstAndLastYears();
            var showedYearsLength = showedLastAndFirstYears.lastYear - showedLastAndFirstYears.firstYear;
            var showedyearpx = (this.getTimelineWidth()-this.settings.events.width-40) / showedYearsLength;
            if(showedyearpx === 0) showedyearpx = 0.001;
            
            // calculating Year divide Factor with yearPX
            var factor = 1;
            if(yearpx <= 65){
                factor = 2;
                if((yearpx*factor) <= 65){
                    var factor = 5;
                    if((yearpx*factor) <= 65){
                        var factor = 10;
                        while((yearpx*factor) <= 65){
                            var factor = factor * 10;
                        }
                    }
                }
            }
            this.renderData.yearPx = showedyearpx;
            if(this.renderData.yearDivideFactor !== factor){
                this.renderData.yearDivideFactor = factor;
                this.sortTimeline();
            }
            
        },
        getFirstAndLastYears: function(){
            var orderedDateEventsYears = _.sortBy(Object.keys(this.timeline.dateevents).map(Number));
            var orderedPeriodEventsYears = _.sortBy(Object.keys(this.timeline.periodevents).map(Number));
            if(orderedDateEventsYears.length == 0 && orderedPeriodEventsYears.length == 0){
                return {firstYear: 1900, lastYear: 1930}
            }else if(orderedDateEventsYears.length == 0){
                var firstYear = orderedPeriodEventsYears[0];
                var lastYear = orderedPeriodEventsYears[orderedPeriodEventsYears.length-1];
            }else if(orderedPeriodEventsYears.length == 0){
                var firstYear = orderedDateEventsYears[0];
                var lastYear = orderedDateEventsYears[orderedDateEventsYears.length-1];
            }else{
                var firstYear = orderedDateEventsYears[0] < orderedPeriodEventsYears[0] ? orderedDateEventsYears[0] : orderedPeriodEventsYears[0];
                var lastYear = orderedDateEventsYears[orderedDateEventsYears.length-1] > orderedPeriodEventsYears[orderedPeriodEventsYears.length-1] ? orderedDateEventsYears[orderedDateEventsYears.length-1] : orderedPeriodEventsYears[orderedPeriodEventsYears.length-1];
            }
            return {firstYear: firstYear, lastYear: lastYear};
            
        },
        getShowedFirstAndLastYears: function(){
            var firstYear = this.sortedTimeline.lineyears[this.sortedTimeline.lineyears.length-1];
            var lastYear = this.sortedTimeline.lineyears[0] + this.renderData.yearDivideFactor;
            return {firstYear: firstYear, lastYear: lastYear};  
        },
        getSortedTimeLine: function (){

            // Get first and last years
            var lastAndFirstYears = this.getFirstAndLastYears();
            var firstYear = lastAndFirstYears.firstYear;
            var lastYear = lastAndFirstYears.lastYear;

            // Check if some years are skipped, to add the years in order to round down.
            var yearpx = (this.getTimelineWidth()-this.settings.events.width-40) / (lastYear-firstYear);
            if(yearpx === 0) yearpx = 0.001;
            var factor = 1;
            if(yearpx <= 65){
                factor = 2;
                if((yearpx*factor) <= 65){
                    var factor = 5;
                    if((yearpx*factor) <= 65){
                        var factor = 10;
                        while((yearpx*factor) <= 65){
                            var factor = factor * 10;
                        }
                    }
                }
            }
            if(firstYear % this.renderData.yearDivideFactor != 0) firstYear -= firstYear % this.renderData.yearDivideFactor;
            if((lastYear+1) % this.renderData.yearDivideFactor != 0) lastYear += this.renderData.yearDivideFactor - (lastYear % this.renderData.yearDivideFactor)-1;

            // Update arrays
            var dateyears = [];
            var periodyears = [];
            var lineyears = [];
            var dateyearsevents = {};
            var periodyearsevents = {};
            //console.log('Define ends : ' + firstYear + ' < ' + lastYear);
            for(var year = lastYear; year >= firstYear; year--){
                
                if(this.timeline.dateevents[year] != undefined || year == lastYear){
                    dateyears.push(year);
                    dateyearsevents[year] = [];
                    if(this.timeline.dateevents[year] != undefined){
                        var orderedEvents = _.orderBy(this.timeline.dateevents[year].map((event, index) => {
                            event.index = index; return event;
                        }), ['month', 'day'], ['desc', 'desc']);
                    }else{
                        var orderedEvents = _.orderBy(this.timeline.dateevents[year], ['month', 'day'], ['desc', 'desc']);
                    }
                    
                    for(let i in orderedEvents){
                        dateyearsevents[year].push(orderedEvents[i]);
                    }
                }
                if(this.timeline.periodevents[year] != undefined || year == lastYear){
                    periodyears.push(year);
                    periodyearsevents[year] = [];
                    if(this.timeline.periodevents[year]){
                        var orderedEvents = _.orderBy(this.timeline.periodevents[year].map((event, index) => {
                            event.index = index; return event;
                        }), ['startmonth', 'startday'], ['desc', 'desc']);
                    }else{
                        var orderedEvents = _.orderBy(this.timeline.periodevents[year], ['startmonth', 'startday'], ['desc', 'desc']);
                    }
                    
                    for(let i in orderedEvents){
                        periodyearsevents[year].push(orderedEvents[i]);
                    }
                }
                if(year % this.renderData.yearDivideFactor == 0){
                    lineyears.push(year);
                }
            }
            return {dateyears: dateyears, periodyears: periodyears, lineyears: lineyears, dateyearsevents: dateyearsevents, periodyearsevents: periodyearsevents,};
        },
        sortTimeline: function(){
            var sorted = this.getSortedTimeLine();
            this.sortedTimeline.dateyears = sorted.dateyears;
            this.sortedTimeline.periodyears = sorted.periodyears;
            this.sortedTimeline.lineyears = sorted.lineyears;
            this.sortedTimeline.dateyearsevents = sorted.dateyearsevents;
            this.sortedTimeline.periodyearsevents = sorted.periodyearsevents;
        },
        getTimelineWidthStyle: function(timelineWidth){
            return "width: " + this.getTimelineWidth() + "px;";
        },
        getTimelineWidth: function(){
            if(parseInt(this.settings.global.timelineWidth, 10) < 500){
                return $("#timeline").width() < 500 ? 500 : $("#timeline").width();
            }
            return parseInt(this.settings.global.timelineWidth, 10);
            
        },
        // TIMELINES SAVE / DELETE / RENAME
        clickToShowTimelinesMenu(event){
            var x = event.pageX < window.innerWidth-200 ? event.pageX : window.innerWidth-300;
            this.showTimelinesMenu(x);
        },
        showTimelinesMenu(x){
            this.updateTimelines();
            this.ui.timelinesMenu = true;
            this.ui.timelinesMenuX = x;
        },
        updateTimelines(){
            this.ui.timelines = read_cookie('timeline-timelines') == undefined ? [] : read_cookie('timeline-timelines');
        },
        loadTimeline(name){
            this.$set(this.ui, "selectedType", undefined);
            this.$set(this.ui, "selectedYear", undefined);
            this.$set(this.ui, "selectedIndex", undefined);
            this.saveTimeline();
            var data = read_cookie('timeline-timeline-' +  btoa(name));
            this.ui.timelineName = name;
            if(data == null){
                this.timeline.dateevents = {};
                this.timeline.periodevents = {};
                this.loadDefaultSettings();
            }else{
                this.timeline = data.timeline;
                this.settings = data.settings;
            }
            bake_cookie('timeline-lastopened', name);
        },
        deleteTimeline(baseName){
            var name = baseName;
            this.updateTimelines();
            var index = findElementIndex(this.ui.timelines, name);
            if(baseName == undefined || name === this.ui.timelineName){
                baseName = undefined;
                var name = this.ui.timelineName;
                this.timeline.dateevents = {};
                this.timeline.periodevents = {};

                // Load another timeline
                var index = findElementIndex(this.ui.timelines, name);
                if(this.ui.timelines.length == 1){
                    this.createTimeline();
                }else{
                    if(index-1 < 0) this.loadTimeline(this.ui.timelines[index+1]);
                    else this.loadTimeline(this.ui.timelines[index-1]);
                }
            }
            this.ui.timelines.splice(index, 1);
            delete_cookie('timeline-timeline-' + btoa(name));
            this.saveTimelines();
        },
        createTimeline(){
            this.updateTimelines();
            var count = 1;
            var name = "unnamed timeline";
            while(findElementIndex(this.ui.timelines, name) != undefined){
                name = "unnamed timeline (" + count + ")"; count++;
            }
            this.ui.timelines.push(name);
            this.saveTimelines();
            this.loadTimeline(name);
        },
        saveTimelines(){
            bake_cookie('timeline-timelines', this.ui.timelines);
        },
        saveTimeline(){
            var data = {
                timeline: this.timeline,
                settings: this.settings
            };
            bake_cookie('timeline-timeline-' + btoa(this.ui.timelineName), data);
            if(findElementIndex(this.ui.timelines, this.ui.timelineName) == undefined){
                this.ui.timelines.push(this.ui.timelineName);
                this.saveTimelines();
            }
        },
        renameTimeline(oldName, newName){
            this.deleteTimeline(oldName);
            this.ui.timelineName = newName;
            this.saveTimeline();
            bake_cookie('timeline-lastopened', newName);
        },
        fireFullScreen(){
            if(!this.browserFullScreen || !isFullScreen()){
                openFullscreen(document.getElementById('body'));
            }else{
                exitFullscreen();
            }
            this.browserFullScreen = !this.browserFullScreen;
            
        }
    },
    watch: {
        timeline: {
            deep: true,
            handler: function (val, oldVal) {
                this.sortTimeline();
                this.saveTimeline();
            }
        },
        sortedTimeline: {
            deep: true,
            handler: function (val, oldVal) {
                this.updateYearPx();
            }
        },
        renderData: {
            deep: true,
            handler: function (val, oldVal) {
                
            }
        },
        settings: {
            deep: true,
            handler: function (val, oldVal) {
                this.updateYearPx();
                this.saveTimeline();
                setTimeout(() => {
                    this.sortTimeline();
                }, 0);
            }
        },
        // START WATCHER (immediate)
        'ui.currentTab': {
            immediate: true,
            handler: function (val, oldVal) {
                if(this.settings.global == undefined) this.settings = this.generateSettings(this.settingsDetails);

                bake_cookie('timeline-ui-lasttab', val);
            }
        },
        'ui.fullScreen': {
            handler: function(val, oldVal){
                //if(val) openFullscreen(document.getElementById("body"));
            }
        }
    },
    components: {
        "app-year": appYearComp,
        "app-event": appEventComp,
        "app-period": appPeriodComp,
        "app-settings": appSettingsComp,
        "app-setting": appSettingComp
    }
});

window.onresize = function resize() {
    app.updateYearPx();
};

$(document).ready(function() { 
          
    var getCanvas;
    $("i#export-timeline").on('click', function() {
        app.ui.selectedYear = undefined;
        app.ui.selectedIndex = undefined;
        app.ui.selectedIndex = undefined;
        $("#timeline").css("overflow", "visible");
        displayLoader();
        html2canvas($("#timeline .timelinecontent"), {
            
        }).then( function(canvas){
            $("div#rendercanvas").html(canvas);
            $("#timeline").css("overflow", "scroll");
            hideLoader();
            $(".filter").attr('style', 'display: block;');
            $(".filter .export").attr('style', 'display: block;');
            getCanvas = canvas;
        });
    }); 

    $("a#downloadpreview").on('click', function() { 
        var imgageData = getCanvas.toDataURL("image/png"); 
        var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
        $("a#downloadpreview").attr("download", app.ui.timelineName + ".png").attr("href", newData);
        $(".filter").attr('style', 'display: none;');
        $(".filter .export").attr('style', 'display: none;');
    }); 
    $("a#showpreview").on('click', function() { 
        var imgageData = getCanvas.toDataURL("image/png"); 
        var newData = imgageData;
        $("a#showpreview").attr("href", newData);
    });
    $(".filter").on('click', function(e) {
        if(e.target != this) return;
        $(".filter").attr('style', 'display: none;');
        $(".filter .export").attr('style', 'display: none;');
    });
    $("a#closepreview").on('click', function(e) {
        $(".filter").attr('style', 'display: none;');
        $(".filter .export").attr('style', 'display: none;');
    }); 
});

// RESTORE LAST
if(read_cookie('timeline-lastopened') != undefined){
    app.ui.timelineName = read_cookie('timeline-lastopened');
    var data = read_cookie('timeline-timeline-' + btoa(app.ui.timelineName));
    if(data != undefined){
        app.timeline = data.timeline;
        app.settings = data.settings;
    }else{
        app.loadDefaultSettings();
    }
}else{
    app.createTimeline();
}
// SORT
app.sortTimeline();
setTimeout(() => {
    app.sortTimeline();
}, 0);
setTimeout(() => {
    app.sortTimeline();
}, 1000);
setTimeout(() => {
    //app.timeline.dateevents[1820] = app.timeline.dateevents[1820].splice(0, 1);
    //Vue.set(app.timeline.dateevents, 1814, []);
    //app.timeline.dateevents[1814].push({date: "12 Avril 1820", day: 12, month: 4, title: "test", description: ":aucune:"});
    //app.timeline.dateevents[1830][1] = {date: "13 Décembre 1830", day: 13, month: 12, title: "test 2", description: "Ceci est un event de test"};
    
}, 1000);

setTimeout(() => {
    //app.timeline.dateevents[1820].push({date: "12 Avril 1820", day: 12, month: 4, title: "test", description: ":aucune:"});
}, 5000);



