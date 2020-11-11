
var app = new Vue({
    el: "#app",
    name: "timeline",
    data: {
        user: "Clement",
        timeline: {
            periodevents: constants.defaultPeriodEvents,
            dateevents: constants.defaultDateEvents
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
            fullscreen: false
        },
        settings: {},
        settingsDetails: constants.settingsDetails,
        project: {
            name: "unnamed timeline"
        },
        ui: {
            currentTab: "event",
            selectedType: 0,
            selectedYear: undefined,
            selectedIndex: undefined
        }
    },
    computed: {
        orderedDateEvents: function (){
            this.timeline.dateevents = _.orderBy(this.timeline.dateevents, 'year');
        },
        orderedPeriodEvents: function (){
            this.timeline.periodevents = _.orderBy(this.timeline.periodevents, 'year');
        },
        selectedEventDate: {
            get: () => {
                if(app.ui.selectedType == 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }else{
                    return app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }
            },
            set: (value) => {
                var dateData = parseDate(value);

                if(app.ui.selectedType == 1){
                    //if(dateData.day != undefined) this.timeline.periodevents[ui.selectedYear][ui.selectedIndex].date
                }else{
                    app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].date = value;
                    console.log(dateData)
                    if(dateData.month != undefined) app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].month = dateData.month;
                    if(dateData.day != undefined) app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].day = dateData.day;
                    if(dateData.year != undefined){
                        if(dateData.year != app.ui.selectedYear){
                            app.switchSelectedEventYear(dateData.year);
                        }
                    }
                    app.sortTimeline();
                    app.ui.selectedSortedIndex = app.findSortedIndexByIndex();
                    setTimeout(() => {
                        app.sortTimeline();
                    }, 0);
                }
            }
        },
        selectedEventEndDate: {
            get: () => {
                if(app.ui.selectedType == 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }
                return "-";
            },
            set: (value) => {
                var dateData = parseDate(value);
                if(app.ui.selectedType == 1){

                }else{
                    
                }
            }
        },
    },
    methods: {
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
                this.ui.selectedSortedIndex = this.findSortedIndexByIndex();

                // updateVueJs
                Vue.set(this.timeline.dateevents, this.ui.selectedYear, this.timeline.dateevents[this.ui.selectedYear]);
                Vue.set(this.timeline.dateevents, target, this.timeline.dateevents[target]);
                
            }
        },
        selectEvent(year, index){
            var eventData = this.sortedTimeline.dateyearsevents[year][index];
            this.timeline.dateevents[year].forEach((event, i) => {
                if(eventData.name === event.name && eventData.date === event.date && eventData.description === event.description){
                    this.$set(this.ui, "selectedType", 0);
                    this.$set(this.ui, "selectedYear", year);
                    this.$set(this.ui, "selectedIndex", i);
                    this.$set(this.ui, "selectedSortedIndex", index);
                }
            });
        },
        findSortedIndexByIndex(){
            var eventData = this.timeline.dateevents[this.ui.selectedYear][this.ui.selectedIndex];
            var response = 0;
            this.sortedTimeline.dateyearsevents[this.ui.selectedYear].forEach((event, i) => {
                if(eventData.name === event.name && eventData.date === event.date && eventData.description === event.description){
                    response = i; return;
                }
            });
            return response
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
            var firstYear = orderedDateEventsYears[0] < orderedPeriodEventsYears[0] ? orderedDateEventsYears[0] : orderedPeriodEventsYears[0];
            var lastYear = orderedDateEventsYears[orderedDateEventsYears.length-1] > orderedPeriodEventsYears[orderedPeriodEventsYears.length-1] ? orderedDateEventsYears[orderedDateEventsYears.length-1] : orderedPeriodEventsYears[orderedPeriodEventsYears.length-1];
            if(firstYear == undefined) firstYear = lastYear;
            if(lastYear == undefined){
                if(firstYear == undefined){
                    lastYear = 0;
                    firstYear = 0;
                }else{
                    lastYear = firstYear;
                }
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
                    var orderedEvents = _.orderBy(this.timeline.dateevents[year], ['month', 'day'], ['desc', 'desc']);
                    for(let i in orderedEvents){
                        dateyearsevents[year].push(orderedEvents[i]);
                    }
                }
                if(this.timeline.periodevents[year] != undefined || year == lastYear){
                    periodyears.push(year);
                    periodyearsevents[year] = [];
                    var orderedEvents = _.orderBy(this.timeline.periodevents[year], ['startmonth', 'startday'], ['desc', 'desc']);
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
            
        }
    },
    watch: {
        timeline: {
            deep: true,
            immediate: true,
            handler: function (val, oldVal) {
                if(this.settings.global == undefined) this.settings = this.generateSettings(this.settingsDetails); 
                this.sortTimeline();
            }
        },
        sortedTimeline: {
            deep: true,
            immediate: true,
            handler: function (val, oldVal) {
                //console.log('sorted timeline data changed');
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
                setTimeout(() => {
                    this.sortTimeline();
                }, 0);
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
        $("a#downloadpreview").attr("download", app.project.name + ".png").attr("href", newData);
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
setTimeout(() => {
    app.sortTimeline();
}, 0);
setTimeout(() => {
    //app.timeline.dateevents[1820] = app.timeline.dateevents[1820].splice(0, 1);
    //Vue.set(app.timeline.dateevents, 1814, []);
    //app.timeline.dateevents[1814].push({date: "12 Avril 1820", day: 12, month: 4, title: "test", description: ":aucune:"});
    //app.timeline.dateevents[1830][1] = {date: "13 Décembre 1830", day: 13, month: 12, title: "test 2", description: "Ceci est un event de test"};
    
}, 1000);

setTimeout(() => {
    //app.timeline.dateevents[1820].push({date: "12 Avril 1820", day: 12, month: 4, title: "test", description: ":aucune:"});
}, 5000);

