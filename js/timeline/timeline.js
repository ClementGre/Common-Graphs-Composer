// Cookies clearer
const cookies = document.cookie.split(";");
if(false){
    for(let i = 0; i < cookies.length; i++){
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; domain=" + window.location.host.toString() + "; path=/; samesite = strict; expires=Fri, 1 Jan 1970 23:59:59 GMT; ";
    }
}

const app = new Vue({
    el: "#app",
    name: "timeline",
    data: {
        user: "Clement",
        timeline: {
            periodevents: {},
            dateevents: {},
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
            timelineNameTarget: undefined,
            sectedYearTarget: undefined,
            renderedCanvas: undefined,
            lastTimelineDataChanged: undefined
        },
        settings: {},
        settingsDetails: constants.settingsDetails,
        ui: {
            timelineName: "unnamed timeline",
            currentTab: !read_cookie('timeline-ui-lasttab') ? "settings" : read_cookie('timeline-ui-lasttab'),
            selectedType: 0,
            selectedYear: undefined,
            selectedIndex: undefined,
            fullScreen: false,
            browserFullScreen: false,
            timelinesMenu: false,
            downloadMenu: false,
            downloadImageMenu: false,
            dropMenuX: 0,
            timelines: !read_cookie('timeline-timelines') ? [] : read_cookie('timeline-timelines')
        }
    },
    computed: {
        orderedDateEvents: function(){
            this.timeline.dateevents = _.orderBy(this.timeline.dateevents, 'year');
        },
        orderedPeriodEvents: function(){
            this.timeline.periodevents = _.orderBy(this.timeline.periodevents, 'year');
        },
        timelineName: {
            get: function(){
                return this.ui.timelineName;
            },
            set: function(originValue){
                setTimeout(() => {
                    updateTimelineNameInputWidth()
                }, 0);
                let value = originValue.replace(/[^ -ÿ]/g, "");
                if(originValue !== value){
                    $('#timeline-name').val(value);
                }
                value = $.trim(value);
                if(value === "" || findElementIndex(this.ui.timelines, value) !== undefined){
                    setTimeout(() => {
                        if($.trim($('#timeline-name').val()) === value){
                            $('#timeline-name').val(this.ui.timelineName);
                            updateTimelineNameInputWidth()
                        }
                    }, 1000);
                    return;
                }
                const oldValue = this.ui.timelineName;
                this.renameTimeline(oldValue, value);
            }
        },
        selectedEventTitle: {
            get: () => {
                if(app.ui.selectedType === 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].title
                }else{
                    return app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].title
                }
            },
            set: (value) => {
                app.updateSelectedEventValue(value, 'title');
            }
        },
        selectedEventDescription: {
            get: () => {
                setTimeout(() => {
                    const textarea = document.getElementById("event-description-field");
                    if(textarea){
                        textarea.style.height = "";
                        textarea.style.height = textarea.scrollHeight + "px";
                    }
                }, 0);
                if(app.ui.selectedType === 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].description
                }else{
                    return app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].description
                }
            },
            set: (value) => {
                const textarea = document.getElementById("event-description-field");
                if(textarea !== undefined){
                    textarea.style.height = "";
                    textarea.style.height = textarea.scrollHeight + "px";
                }

                app.updateSelectedEventValue(value, 'description');
            }
        },
        selectedEventDate: {
            get: () => {
                if(app === undefined || !(app.ui.selectedType !== undefined && app.ui.selectedYear !== undefined && app.ui.selectedIndex !== undefined)) return "";
                if(app.ui.selectedType === 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }else{
                    return app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex].date
                }
            },
            set: (value) => {
                if(app === undefined || !(app.ui.selectedType !== undefined && app.ui.selectedYear !== undefined && app.ui.selectedIndex !== undefined)) return;
                const dateData = parseDate(value);

                let section = app.ui.selectedType === 1 ? app.timeline.periodevents : app.timeline.dateevents;

                section[app.ui.selectedYear][app.ui.selectedIndex].date = value;
                if(dateData.month !== undefined) section[app.ui.selectedYear][app.ui.selectedIndex].month = dateData.month;
                if(dateData.day !== undefined) section[app.ui.selectedYear][app.ui.selectedIndex].day = dateData.day;
                if(dateData.year !== undefined){
                    if(dateData.year !== app.ui.selectedYear){
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
        },
        selectedEventEndDate: {
            get: () => {
                if(app === undefined || !(app.ui.selectedType !== undefined && app.ui.selectedYear !== undefined && app.ui.selectedIndex !== undefined)) return "";
                if(app.ui.selectedType === 1){
                    return app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].enddate
                }
                return "";
            },
            set: (value) => {
                let selectedData;
                if(app === undefined || !(app.ui.selectedType !== undefined && app.ui.selectedYear !== undefined && app.ui.selectedIndex !== undefined)) return;
                const dateData = parseDate(value);
                if(app.ui.selectedType === 1){
                    if(value === ""){ // Convert to date
                        selectedData = JSON.parse(JSON.stringify(app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex]));
                        delete selectedData.yearsLength;
                        delete selectedData.endday;
                        delete selectedData.endmonth;
                        delete selectedData.enddate;
                        // delete
                        app.timeline.periodevents[app.ui.selectedYear].splice(app.ui.selectedIndex, 1);
                        if(app.timeline.periodevents[app.ui.selectedYear].length === 0){
                            delete app.timeline.periodevents[app.ui.selectedYear + ""];
                        }
                        // create
                        if(app.timeline.dateevents[app.ui.selectedYear] === undefined) Vue.set(app.timeline.dateevents, app.ui.selectedYear, []);
                        app.timeline.dateevents[app.ui.selectedYear].push(selectedData);
                        app.ui.selectedIndex = app.timeline.dateevents[app.ui.selectedYear].length - 1;
                        app.ui.selectedType = 0;
                    }else{
                        app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].enddate = value;
                        if(dateData.day !== undefined) app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].endday = dateData.day;
                        if(dateData.year !== undefined){
                            if(dateData.year >= app.ui.selectedYear) app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].yearsLength = dateData.year - app.ui.selectedYear;
                        }
                        if(dateData.month !== undefined){
                            app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex].endmonth = dateData.month;
                        }
                    }
                }else{
                    if(value !== ""){ // Convert to period
                        selectedData = JSON.parse(JSON.stringify(app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex]));
                        selectedData.yearsLength = 5;
                        selectedData.endday = 31;
                        selectedData.endmonth = 12;
                        selectedData.enddate = value;
                        if(dateData.day !== undefined) selectedData.endday = dateData.day;
                        if(dateData.year !== undefined){
                            if(dateData.year >= app.ui.selectedYear) selectedData.yearsLength = dateData.year - app.ui.selectedYear;
                        }
                        if(dateData.month !== undefined){
                            selectedData.endmonth = dateData.month;
                        }
                        // delete
                        app.timeline.dateevents[app.ui.selectedYear].splice(app.ui.selectedIndex, 1);
                        if(app.timeline.dateevents[app.ui.selectedYear].length === 0){
                            delete app.timeline.dateevents[app.ui.selectedYear + ""];
                        }
                        // create
                        if(app.timeline.periodevents[app.ui.selectedYear] === undefined) Vue.set(app.timeline.periodevents, app.ui.selectedYear, []);
                        app.timeline.periodevents[app.ui.selectedYear].push(selectedData);
                        app.ui.selectedIndex = app.timeline.periodevents[app.ui.selectedYear].length - 1;
                        app.ui.selectedType = 1;
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
        },
    },
    methods: {
        updateSelectedEventValue(value, valueName){
            if(app.ui.selectedType === 1) app.timeline.periodevents[app.ui.selectedYear][app.ui.selectedIndex][valueName] = value;
            else app.timeline.dateevents[app.ui.selectedYear][app.ui.selectedIndex][valueName] = value;

            setTimeout(() => { app.sortTimeline();
                setTimeout(() => { app.sortTimeline(); }, 0);
            }, 0);
        },
        createEvent(){
            let selectedData;
            if(this.ui.selectedYear !== undefined && this.ui.selectedIndex !== undefined){
                if(this.ui.selectedType === 0){
                    selectedData = JSON.parse(JSON.stringify(this.timeline.dateevents[this.ui.selectedYear][this.ui.selectedIndex]));
                    selectedData.title = "";
                    selectedData.description = "";
                    this.timeline.dateevents[this.ui.selectedYear].push(selectedData);
                    this.ui.selectedIndex = this.timeline.dateevents[this.ui.selectedYear].length - 1;
                    this.ui.selectedType = 0;
                }else{
                    if(this.timeline.dateevents[this.ui.selectedYear] === undefined) Vue.set(this.timeline.dateevents, this.ui.selectedYear, []);
                    selectedData = JSON.parse(JSON.stringify(this.timeline.periodevents[this.ui.selectedYear][this.ui.selectedIndex]));
                    selectedData.title = "";
                    selectedData.description = "";
                    delete selectedData.yearsLength;
                    delete selectedData.endday;
                    delete selectedData.endmonth;
                    delete selectedData.enddate;
                    this.timeline.dateevents[this.ui.selectedYear].push(selectedData);
                    this.ui.selectedIndex = this.timeline.dateevents[this.ui.selectedYear].length - 1;
                    this.ui.selectedType = 0;
                }
            }else{
                const year = this.sortedTimeline.lineyears[Math.round(this.sortedTimeline.lineyears.length / 2) - 1];
                if(this.timeline.dateevents[year] === undefined) Vue.set(this.timeline.dateevents, year, []);
                this.timeline.dateevents[year].push({date: "" + year, day: 1, month: 1, title: "", description: ""});
                this.ui.selectedIndex = this.timeline.dateevents[year].length - 1;
                this.ui.selectedYear = year;
                this.ui.selectedType = 0;
            }

            this.sortTimeline();
            Vue.set(this.timeline.dateevents, this.ui.selectedYear, this.timeline.dateevents[this.ui.selectedYear]);
            setTimeout(() => {
                this.sortTimeline();
                if(this.timeline.dateevents[this.ui.selectedYear][this.ui.selectedIndex].title === "") $('#event-title-input').focus();
                else $('#event-date-input').focus();
            }, 0);
        },
        createPeriod(){
            let selectedData;
            if(this.ui.selectedYear !== undefined && this.ui.selectedIndex !== undefined){
                if(this.ui.selectedType === 0){
                    if(this.timeline.periodevents[this.ui.selectedYear] === undefined) Vue.set(this.timeline.periodevents, this.ui.selectedYear, []);
                    selectedData = JSON.parse(JSON.stringify(this.timeline.dateevents[this.ui.selectedYear][this.ui.selectedIndex]));
                    selectedData.title = "";
                    selectedData.description = "";
                    selectedData.yearsLength = 5;
                    selectedData.endday = 31;
                    selectedData.endmonth = 12;
                    selectedData.enddate = this.ui.selectedYear + 5;
                    this.timeline.periodevents[this.ui.selectedYear].push(selectedData);
                    this.ui.selectedIndex = this.timeline.periodevents[this.ui.selectedYear].length - 1;
                    this.ui.selectedType = 1;
                }else{
                    selectedData = JSON.parse(JSON.stringify(this.timeline.periodevents[this.ui.selectedYear][this.ui.selectedIndex]));
                    selectedData.title = "";
                    selectedData.description = "";
                    this.timeline.periodevents[this.ui.selectedYear].push(selectedData);
                    this.ui.selectedIndex = this.timeline.periodevents[this.ui.selectedYear].length - 1;
                    this.ui.selectedType = 1;
                }

            }else{
                const year = this.sortedTimeline.lineyears[Math.round(this.sortedTimeline.lineyears.length / 2) - 1];
                if(this.timeline.periodevents[year] === undefined) Vue.set(this.timeline.periodevents, year, []);
                this.timeline.periodevents[year].push({
                    date: "" + year - 2,
                    day: 1,
                    month: 1,
                    endmonth: 12,
                    endday: 31,
                    yearsLength: 5,
                    enddate: "" + (year + 3),
                    title: "",
                    description: ""
                });
                this.ui.selectedIndex = this.timeline.periodevents[year].length - 1;
                this.ui.selectedYear = year;
                this.ui.selectedType = 1;
            }

            this.sortTimeline();
            Vue.set(this.timeline.periodevents, this.ui.selectedYear, this.timeline.periodevents[this.ui.selectedYear]);
            setTimeout(() => {
                this.sortTimeline();
                setTimeout(() => {
                    this.sortTimeline();
                }, 0);
                if(this.timeline.periodevents[this.ui.selectedYear][this.ui.selectedIndex].title === "") $('#event-title-input').focus();
                else $('#event-date-input').focus();
            }, 0);
        },
        deleteSelectedEvent(){
            if(this.ui.selectedType === 0){
                this.timeline.dateevents[this.ui.selectedYear].splice(this.ui.selectedIndex, 1);
                if(this.timeline.dateevents[this.ui.selectedYear].length === 0){
                    delete this.timeline.dateevents[this.ui.selectedYear + ""];
                }
            }else{
                this.timeline.periodevents[this.ui.selectedYear].splice(this.ui.selectedIndex, 1);
                if(this.timeline.periodevents[this.ui.selectedYear].length === 0){
                    delete this.timeline.periodevents[this.ui.selectedYear + ""];
                }
            }
            this.ui.selectedYear = undefined;
            this.ui.selectedIndex = undefined;
            this.ui.selectedType = undefined;
            setTimeout(() => {
                this.sortTimeline();
            }, 0);
        },
        duplicateSelectedEvent(){
            let section = this.ui.selectedType === 0 ? this.timeline.dateevents : this.timeline.periodevents;

            section[this.ui.selectedYear].push(JSON.parse(JSON.stringify(section[this.ui.selectedYear][this.ui.selectedIndex])));
            this.ui.selectedIndex = section[this.ui.selectedYear].length - 1;
            this.sortTimeline();
            Vue.set(section, this.ui.selectedYear, section[this.ui.selectedYear]);
            if(section[this.ui.selectedYear][this.ui.selectedIndex].title === "") $('#event-title-input').focus();
            else $('#event-date-input').focus();

            setTimeout(this.sortTimeline.bind(this), 0);
        },
        updateEventYear(target){
            this.renderData.sectedYearTarget = target;
            setTimeout(() => {
                if(this.renderData.sectedYearTarget === target){
                    this.switchSelectedEventYear(target);
                    app.sortTimeline();
                    setTimeout(() => {
                        app.sortTimeline();
                    }, 0);
                }
            }, 1000);
        },
        switchSelectedEventYear(target){
            let section = this.ui.selectedType === 1 ? this.timeline.periodevents : this.timeline.dateevents;
            if(section[target] === undefined) Vue.set(section, target, []); // set section if empty

            // Push new element
            if(this.ui.selectedType === 1){
                section[this.ui.selectedYear][this.ui.selectedIndex].yearsLength -= target - this.ui.selectedYear;
                section[target].push(section[this.ui.selectedYear][this.ui.selectedIndex]);
            }else{
                section[target].push(section[this.ui.selectedYear][this.ui.selectedIndex]);
            }

            // Remove last element
            section[this.ui.selectedYear].splice(this.ui.selectedIndex, 1);
            if(section[this.ui.selectedYear].length === 0){
                delete section[this.ui.selectedYear]
            }

            // Update ui vars
            this.sortTimeline();
            this.ui.selectedYear = target;
            this.ui.selectedIndex = section[target].length - 1;

            // updateVueJs
            Vue.set(section, target, section[target]);

            setTimeout(() => { app.sortTimeline();
                setTimeout(() => { app.sortTimeline(); }, 0);
            }, 0);

        },
        selectEvent(year, index){
            this.selectPeriodOrEvent(year, index, 0, this.sortedTimeline.dateyearsevents);
        },
        selectPeriod(year, index){
            this.selectPeriodOrEvent(year, index, 1, this.sortedTimeline.periodyearsevents);
        },
        selectPeriodOrEvent(year, index, type, section){
            const eventData = section[year][index];
            this.$set(this.ui, "selectedType", type);
            this.$set(this.ui, "selectedYear", year);
            this.$set(this.ui, "selectedIndex", eventData.index);
            this.$set(this.ui, "currentTab", "event");

            setTimeout(() => {
                if(section[this.ui.selectedYear][this.ui.selectedIndex].title === "") $('#event-title-input').focus();
                else $('#event-date-input').focus();
            }, 0);

        },
        editSetting: function(data){
            if(data.subname !== undefined) this.$set(this.settings[data.section][data.name], data.subname, data.value);
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
            const data = read_cookie('timeline-settings-' + section);
            if(!data) this.settings[section] = this.generateSettings(this.settingsDetails[section]);
            else this.settings[section] = data;
            setTimeout(() => {
                $.each($("main .panel .pane input[data-jscolor]"), function(index, element){
                    element.jscolor.fromString($(element).val()); // Update for JSColor
                });
            }, 0);
        },
        loadDefaultSettings: function(){
            console.log("Loading default settings...")
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
            const result = {};
            Object.keys(source).forEach(name => {
                if(typeof source[name] == 'object'){
                    if(source[name].type !== undefined){
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
            const lastAndFirstYears = this.getFirstAndLastYears();
            const yearsLength = lastAndFirstYears.lastYear - lastAndFirstYears.firstYear;
            const marginRight = parseInt(this.settings.events.width, 10) > parseInt(this.settings.periods.minWidth, 10) ? parseInt(this.settings.events.width, 10) : parseInt(this.settings.periods.minWidth, 10);
            let yearpx = (this.getTimelineWidth() - marginRight - 40) / yearsLength;
            if(yearpx === 0) yearpx = 0.001;

            // Width of a year in px (First year = First visible event && Last year = Last visible event)
            // (First year can do not having an event since the first year is round to the last year who % divideFactor == 0)
            // This is the final width of a year on the screen
            const showedLastAndFirstYears = this.getShowedFirstAndLastYears();
            const showedYearsLength = showedLastAndFirstYears.lastYear - showedLastAndFirstYears.firstYear;
            let showedyearpx = (this.getTimelineWidth() - marginRight - 40) / showedYearsLength;
            if(showedyearpx === 0) showedyearpx = 0.001;

            // calculating Year divide Factor with yearPX
            let factor = 1;
            if(yearpx <= 65){
                factor = 2;
                if((yearpx * factor) <= 65){
                    factor = 5;
                    if((yearpx * factor) <= 65){
                        factor = 10;
                        while((yearpx * factor) <= 65){
                            factor = factor * 10;
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
            let lastYear;
            let firstYear;
            const orderedDateEventsYears = _.sortBy(Object.keys(this.timeline.dateevents).map(Number));
            const orderedPeriodEventsYears = Object.keys(this.timeline.periodevents).map(Number);
            if(orderedDateEventsYears.length === 0 && orderedPeriodEventsYears.length === 0){
                return {firstYear: 1900, lastYear: 1928}
            }else if(orderedDateEventsYears.length === 0){
                firstYear = orderedPeriodEventsYears[0];
                lastYear = this.getLastPeriodYear();
            }else if(orderedPeriodEventsYears.length === 0){
                firstYear = orderedDateEventsYears[0];
                lastYear = orderedDateEventsYears[orderedDateEventsYears.length - 1];
            }else{
                const lastPeriodYear = this.getLastPeriodYear();
                firstYear = orderedDateEventsYears[0] < orderedPeriodEventsYears[0] ? orderedDateEventsYears[0] : orderedPeriodEventsYears[0];
                lastYear = orderedDateEventsYears[orderedDateEventsYears.length - 1] > lastPeriodYear ? orderedDateEventsYears[orderedDateEventsYears.length - 1] : lastPeriodYear;
            }
            return {firstYear: firstYear, lastYear: lastYear};

        },
        getLastPeriodYear(){
            let higherYear = 0;
            for(let year of Object.keys(this.timeline.periodevents)){
                const higherLocalYear = this.getPeriodYearEnd(year);
                if(higherLocalYear > higherYear){
                    higherYear = higherLocalYear;
                }
            }
            return higherYear;
        },
        getPeriodYearEnd: function(year){
            let higherLength = 0;
            if(this.timeline.periodevents[year] === undefined) return year;
            this.timeline.periodevents[year].forEach((period) => {
                if(period.yearsLength > higherLength){
                    higherLength = period.yearsLength;
                }
            });
            return parseInt(year, 10) + higherLength;
        },
        getShowedFirstAndLastYears: function(){
            const firstYear = this.sortedTimeline.lineyears[this.sortedTimeline.lineyears.length - 1];
            const lastYear = this.sortedTimeline.lineyears[0] + this.renderData.yearDivideFactor;
            return {firstYear: firstYear, lastYear: lastYear};
        },
        getSortedTimeLine: function(){

            let orderedEvents;
// Get first and last years
            const lastAndFirstYears = this.getFirstAndLastYears();
            let firstYear = lastAndFirstYears.firstYear;
            let lastYear = lastAndFirstYears.lastYear;

            // Check if some years are skipped, to add the years in order to round down.
            let yearpx = (this.getTimelineWidth() - this.settings.events.width - 40) / (lastYear - firstYear);
            if(yearpx === 0) yearpx = 0.001;
            let factor = 1;
            if(yearpx <= 65){
                factor = 2;
                if((yearpx * factor) <= 65){
                    factor = 5;
                    if((yearpx * factor) <= 65){
                        factor = 10;
                        while((yearpx * factor) <= 65){
                            factor = factor * 10;
                        }
                    }
                }
            }
            if(firstYear % this.renderData.yearDivideFactor !== 0) firstYear -= firstYear % this.renderData.yearDivideFactor;
            if((lastYear + 1) % this.renderData.yearDivideFactor !== 0) lastYear += this.renderData.yearDivideFactor - (lastYear % this.renderData.yearDivideFactor) - 1;

            // Update arrays
            const dateyears = [];
            const periodyears = [];
            const lineyears = [];
            const dateyearsevents = {};
            const periodyearsevents = {};
            //console.log('Define ends : ' + firstYear + ' < ' + lastYear);
            for(let year = lastYear; year >= firstYear; year--){

                if(this.timeline.dateevents[year] !== undefined || year === lastYear){
                    dateyears.push(year);
                    dateyearsevents[year] = [];
                    if(this.timeline.dateevents[year] !== undefined){
                        orderedEvents = _.orderBy(this.timeline.dateevents[year].map((event, index) => {
                            event.index = index;
                            return event;
                        }), ['month', 'day'], ['desc', 'desc']);
                    }else{
                        orderedEvents = _.orderBy(this.timeline.dateevents[year], ['month', 'day'], ['desc', 'desc']);
                    }

                    for(let i in orderedEvents){
                        dateyearsevents[year].push(orderedEvents[i]);
                    }
                }
                if(this.timeline.periodevents[year] !== undefined || year === lastYear){
                    periodyears.push(year);
                    periodyearsevents[year] = [];
                    if(this.timeline.periodevents[year]){
                        orderedEvents = _.orderBy(this.timeline.periodevents[year].map((event, index) => {
                            event.index = index;
                            return event;
                        }), ['startmonth', 'startday'], ['desc', 'desc']);
                    }else{
                        orderedEvents = _.orderBy(this.timeline.periodevents[year], ['startmonth', 'startday'], ['desc', 'desc']);
                    }

                    for(let i in orderedEvents){
                        periodyearsevents[year].push(orderedEvents[i]);
                    }
                }
                if(year % this.renderData.yearDivideFactor === 0){
                    lineyears.push(year);
                }
            }
            return {
                dateyears: dateyears,
                periodyears: periodyears,
                lineyears: lineyears,
                dateyearsevents: dateyearsevents,
                periodyearsevents: periodyearsevents,
            };
        },
        sortTimeline: function(){
            const sorted = this.getSortedTimeLine();
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
        centerScrollView(){
            const scrollElement = document.getElementById('timeline');
            const offsetTop = document.getElementById('timeline-time-line').offsetTop - $('#timeline-time-line').height() / 2;
            scrollElement.scrollTo(0, offsetTop - $('#timeline').height() / 2);
        },

        // TIMELINES SAVE / DELETE / RENAME
        clickToShowTimelinesMenu(event){
            const x = event.pageX < window.innerWidth - 200 ? event.pageX : window.innerWidth - 300;
            this.showTimelinesMenu(x);
        },
        showTimelinesMenu(x){
            this.updateTimelines();
            this.ui.timelinesMenu = true;
            this.ui.dropMenuX = x;
        },
        updateTimelines(){
            this.ui.timelines = !read_cookie('timeline-timelines') ? [] : read_cookie('timeline-timelines');
        },
        loadTimeline(name){
            this.$set(this.ui, "selectedType", undefined);
            this.$set(this.ui, "selectedYear", undefined);
            this.$set(this.ui, "selectedIndex", undefined);
            this.saveTimeline();
            const data = read_cookie('timeline-timeline-' + encode64(name));
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
            setTimeout(() => {
                $.each($("main .panel .pane input[data-jscolor]"), function(index, element){
                    element.jscolor.fromString($(element).val()); // Update for JSColor
                });
                this.centerScrollView();
            }, 0);
        },
        deleteTimeline(baseName, cancelConfirm){
            let r = true;
            if(cancelConfirm !== true) r = confirm("This action will delete \"" + (baseName ? baseName : this.ui.timelineName) + "\" for ever.");
            if(r === true){
                let name = baseName;
                this.updateTimelines();
                let index = findElementIndex(this.ui.timelines, name);
                if(baseName === undefined || name === this.ui.timelineName){
                    baseName = undefined;
                    name = this.ui.timelineName;
                    this.timeline.dateevents = {};
                    this.timeline.periodevents = {};

                    // Load another timeline
                    index = findElementIndex(this.ui.timelines, name);
                    if(this.ui.timelines.length === 1){
                        this.createTimeline();
                    }else{
                        if(index - 1 < 0) this.loadTimeline(this.ui.timelines[index + 1]);
                        else this.loadTimeline(this.ui.timelines[index - 1]);
                    }
                }
                this.ui.timelines.splice(index, 1);
                delete_cookie('timeline-timeline-' + encode64(name));
                this.saveTimelines();
            }
        },
        createTimeline(baseName){
            if(baseName === undefined) baseName = "unnamed timeline";
            this.updateTimelines();
            let count = 1;
            let name = baseName;
            while(findElementIndex(this.ui.timelines, name) !== undefined){
                name = baseName + " (" + count + ")";
                count++;
            }
            this.ui.timelines.push(name);
            this.saveTimelines();
            this.loadTimeline(name);
        },
        cloneTimeline(){
            const data = read_cookie('timeline-timeline-' + encode64(this.ui.timelineName));
            this.createTimeline(this.ui.timelineName + ' (copy)');
            if(data != null){
                this.timeline = data.timeline;
                this.settings = data.settings;
            }
        },
        saveTimelines(){
            bake_cookie('timeline-timelines', this.ui.timelines);
        },
        saveTimeline(){
            const data = {
                timeline: this.timeline,
                settings: this.settings
            };
            bake_cookie('timeline-timeline-' + encode64(this.ui.timelineName), data);
            if(findElementIndex(this.ui.timelines, this.ui.timelineName) === undefined){
                this.ui.timelines.push(this.ui.timelineName);
                this.saveTimelines();
            }
        },
        renameTimeline(oldName, newName){
            this.renderData.timelineNameTarget = newName;
            setTimeout(() => {
                if(newName === this.renderData.timelineNameTarget){
                    this.ui.timelineName = newName;
                    this.deleteTimeline(oldName, true);
                    this.saveTimeline();
                    bake_cookie('timeline-lastopened', newName);
                }
            }, 1000);
        },
        fireFullScreen(){
            if(!this.browserFullScreen || !isFullScreen()){
                openFullscreen(document.getElementById('body'));
            }else{
                exitFullscreen();
            }
            this.browserFullScreen = !this.browserFullScreen;

        },


        importTimeline(){
            $('#file-input').trigger('click');
            document.getElementById('file-input').onchange = e => {
                for(let file of document.getElementById('file-input').files){
                    this.importTimelineFile(file);
                }
            }
        },
        importTimelineFile(file){
            if(file !== undefined){
                console.log('Loading ' + file.name);
                const name = String(file.name.split('.').slice(0, -1).join('.'));

                const reader = new FileReader();
                displayLoader();
                reader.onload = function(e){
                    hideLoader();
                    const data = JSON.parse(e.target.result);
                    app.createTimeline(name);
                    app.timeline = data.timeline;
                    app.settings = data.settings;
                    app.saveTimeline();
                };
                reader.readAsText(file);
            }
        },
        clickToShowDownloadMenu(event){
            const x = event.pageX < window.innerWidth - 200 ? event.pageX : window.innerWidth - 300;
            this.showDownloadMenu(x);
        },
        showDownloadMenu(x){
            this.ui.downloadMenu = true;
            this.ui.dropMenuX = x;
        },
        downloadJSON(){
            const data = {timeline: this.timeline, settings: this.settings};
            downloadObjectAsJson(data, this.ui.timelineName);
        },
        downloadImage(){
            this.ui.selectedYear = undefined;
            this.ui.selectedIndex = undefined;
            this.ui.selectedIndex = undefined;
            $("#timeline").css("overflow", "visible");
            displayLoader();
            this.sortTimeline();
            setTimeout(() => {
                domtoimage.toPng(document.querySelector("#timeline .timelinecontent"))
                    .then(function(dataUrl){
                        app.ui.downloadImageMenu = true;
                        app.renderData.renderedCanvas = dataUrl;

                        $("#previewrendercanvas").attr('src', dataUrl);
                        $("#timeline").css("overflow", "scroll");
                        hideLoader();
                    })
                    .catch(function(error){
                        console.error('oops, something went wrong!', error);
                    });
            }, 0);
        },
        closeDownloadImageMenu(){
            this.ui.downloadImageMenu = false;
        },
        downloadImagePng(){
            this.downloadImageMenu = false;
            const imgageData = this.renderData.renderedCanvas;//.toDataURL("image/png");
            const newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
            $("a#downloadpreview").attr("download", app.ui.timelineName + ".png").attr("href", newData);
        },
        downloadImageShowPng(){
            $("a#showpreview").attr("href", this.renderData.renderedCanvas);
        }
    },
    watch: {
        timeline: {
            deep: true,
            handler: function(val, oldVal){
                this.sortTimeline();

                const key = Math.floor(Math.random() * 1020);
                this.lastTimelineDataChanged = key;
                setTimeout(() => {
                    if(this.lastTimelineDataChanged === key) this.saveTimeline();
                }, 4000);

            }
        },
        sortedTimeline: {
            deep: true,
            handler: function(val, oldVal){
                this.updateYearPx();
            }
        },
        settings: {
            deep: true,
            handler: function(val, oldVal){
                this.updateYearPx();
                setTimeout(() => {
                    this.sortTimeline();
                }, 0);

                const key = Math.floor(Math.random() * 1020);
                this.lastTimelineDataChanged = key;
                setTimeout(() => {
                    if(this.lastTimelineDataChanged === key) this.saveTimeline();
                }, 4000);
            }
        },
        // START WATCHER (immediate)
        'ui.currentTab': {
            immediate: true,
            handler: function(val, oldVal){
                if(this.settings.global === undefined) this.settings = this.generateSettings(this.settingsDetails);

                bake_cookie('timeline-ui-lasttab', val);
            }
        },
        'ui.fullScreen': {
            handler: function(val, oldVal){
                //if(val) openFullscreen(document.getElementById("body"));
            }
        },
        'ui.timelineName': {
            handler: function(){
                setTimeout(() => {
                    updateTimelineNameInputWidth()
                }, 0)
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

window.onresize = function resize(){
    app.updateYearPx();
};

// RESTORE LAST
if(read_cookie('timeline-lastopened')){
    app.ui.timelineName = read_cookie('timeline-lastopened');
    const data = read_cookie('timeline-timeline-' + encode64(app.ui.timelineName));
    if(data){
        app.timeline = data.timeline;
        app.settings = data.settings;
        setTimeout(() => {
            app.centerScrollView();
        }, 0);
    }else{
        app.loadDefaultSettings();
    }
}else{
    app.createTimeline();
}
//app.timeline.periodevents = constants.defaultPeriodEvents;
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

let dropbox;
dropbox = document.getElementById("app");

function dragCheck(e){
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    for(let file of files){
        if(file.type === "application/json"){
            e.dataTransfer.effectAllowed = "copy";
            return;
        }
    }
    e.dataTransfer.effectAllowed = "copyMove";
}
dropbox.addEventListener("dragenter", dragCheck, false);
dropbox.addEventListener("dragstart", dragCheck, false);
dropbox.addEventListener("dragover", dragCheck, false);
dropbox.addEventListener("drop", (e) => {
    e.stopPropagation(); e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    for(let file of files){
        if(file.type === "application/json"){
            app.importTimelineFile(file);
        }
    }

}, false);
