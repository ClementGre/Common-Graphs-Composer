Vue.component("app-nav", {
    template: `<header>
        <div><img src="img/icon.png"></img><h2>Common Graphs Composer [BETA]</h2></div>
        <nav><ul><li><a href="index.html">Home</a></li><li><a href="timeline.html">Timeline</a></li></ul></nav>
    </header>`,

    props: [],
    methods: {
        
    }
});

Vue.component("app-footer", {
    template: `<footer><h5>Copyright &copy Common Graphs Composer 2020</h5><h5>Developed by Clément Grennerat</h5></footer>`,
    props: [],
    methods: {
        
    }
});

var appEventComp = {
    name: "appevent",
    template: `
        <div v-bind:class="'event event-' + index" v-bind:style="'margin-left:' + getshiftpx() + 'px;' + 
            'margin-bottom:' + (getMarginBottom(yearindex, yearindex-1, yearpx, marginright, settings, years, index, true)+settings.events.margin) + 'px;' +
            'width: ' + settings.events.width + 'px;' +
            'padding: ' + settings.events.padding + 'px;' +
            'border-radius: ' + settings.events.borderRadius + 'px;' +
            'backgroundColor: ' + settings.events.backgroundColor + ';' +
            'width: ' + settings.events.width + 'px;'">

            <div style="position: relative; width: 0; height: 0; display: block;">
                <div class="linker" v-bind:style="'background-color:' + settings.events.linkerColor + ';' +
                    'width:' + settings.events.linkerWidth + 'px;' +
                    'left: -' + (settings.events.padding+(settings.events.linkerWidth/2.0)) + 'px;'"></div>
            </div>

            <h4 class="title" v-bind:style="'color :' + settings.events.title.color + ';' + 
                'font-size :' + settings.events.title.fontSize + 'px;' + 
                'font-weight :' + settings.events.title.fontWeight + ';'">{{event.title}}</h4>
            <h4 class="date" v-bind:style="'color :' + settings.events.date.color + ';' + 
                'font-size :' + settings.events.date.fontSize + 'px;' + 
                'font-weight :' + settings.events.date.fontWeight + ';'">{{event.date}}</h4>
            <p class="description" v-bind:style="'color :' + settings.events.description.color + ';' + 
                'font-size :' + settings.events.description.fontSize + 'px;' + 
                'font-weight :' + settings.events.description.fontWeight + ';'">{{event.description}}</p>
        </div>`,
    props: ["index", "event", "yearindex", "yearpx", "marginright", "settings", "years"],
    methods: {
        getshiftpx: function() {
            this.shiftPx = this.yearpx / 12.0 * (this.event.month-1);
            return this.shiftPx;
        },
        getMarginBottom(yearIndex, lastYearIndex, yearpx, marginRight, settings, years, index, canSkip){
            //console.log("----- PROCESS EVENT " + index + " WITH A SHIFT OF " + (yearIndex-lastYearIndex) + " -----")

            if(years[lastYearIndex] == undefined) return 0; // If this is the last year, we dont have any constraint
            var finalMarginRight = marginRight - settings.events.width - this.shiftPx + yearpx; // space between end of this event and start of the next

            // If the space between the end of this event and the start of the next year is > min event margin : we can ignore this process : no margin bottom
            if(finalMarginRight > settings.events.minMargin) return 0;

            // Calculate the height of this event
            var eventStartHeight = 0; // length between the bottom of this event and the top of the timeline
            var eventHeight = settings.events.margin; // height of the event Box With margin bottom
            $(".timeline .events .year-" + years[yearIndex] + " .event").each((i, item) => { // Foreach bottom events, increment the eventStartHeight
                if(this.getEventIndex($(item)) < index){ // Loop event is at the BOTTOM of current event
                    eventStartHeight += this.getEventFullHeight($(item)); // Increment eventStartHeight
                }else if(this.getEventIndex($(item)) == index){ // Loop event is SAME as current event
                    eventHeight += $(item).height()+(2*settings.events.padding); // define eventHeight (we add 10 witch is the padding)
                }
            });

            // SKIP UNDER THE LAST YEAR SECTION (next year)
            // OR
            // ADD MARGIN BOTTOM TO BE ABOVE LAST YEAR EVENTS

            // canSkip : 
            var marginBottom = 0; // Future marginBottom
            var lastYearHeight = 0; // Height increamented bit by bit when the foreach occurs
            var skip = false; // Skip = move under the lastYear events. When skip == true, 
            $(".timeline .events .year-" + years[lastYearIndex] + " .event").each((i, item) => { // Foreach last year event
                ///// SKIP UNDER SYSTEM ///// (Only occurs at the first iteration)
                if(skip) return; // When skip == true, we return definitively so we leave the each loop.
                // i == 0 : We can decide to skip only with the bottom event : with his margin bottom.
                // eventHeight > 10 : The event height needs to don't have the default value to measure if the free height is enough.
                // canSkip : can be false when a skip is canceled (by re-call) when the width is too small (not enough space)
                if(i == 0 && eventHeight > 0 && canSkip){ // This event can skip under
                    // The margin bottom of the last bottom event is bigger than the event height + others same year events that has maybe already skipped.
                    // (If others same year event has already skipped, we need to take them in account).
                    // We have to take in account the top margin of the event
                    if(this.getMargin($(item), "Bottom") >= eventHeight+eventStartHeight+10){ // This event can skip -> process skiping under
                        skip = true; return; // Set skip to true : cancel all process of the each loop since a skip will occurs
                    }
                }

                ///// ADD MARGIN TO BE ABOVE SYSTEM /////
                lastYearHeight += this.getEventFullHeight($(item)); // Increment lastYearHeight with the event height (measure the lsstYear events height)
                // When the height of the lastYear is higher than the event start height, this mind there is not enought space for the current event
                // When this condition is true, all the nexts of the loop will be logicaly true too.
                if(lastYearHeight >= eventStartHeight){
                    if(finalMarginRight < settings.events.minMargin){ // There is not enought place only if the space between the end of this event and the start of the next year is < minMargin
                        marginBottom += this.getEventFullHeight($(item)); // Increment marginBottom with the height of the loop event.
                    }
                }
            });
            // if this is not the bottom event and marginBootom != 0, this means the last event has skipped but no this one (Only the bottom event can has margin bottom)
            // So we remove the eventStartHeight (= height of all under events) to the marginBottom
            if(index != 0 && marginBottom != 0) marginBottom -= eventStartHeight;
            // If we have skipped under, we repeat the action to check if there is enough place :
            // YES : Try to skip one more year
            // NO : cancel the skipping (next line)
            if(skip) return this.getMarginBottom(yearIndex, lastYearIndex-1, yearpx, marginRight+this.getYearFreeWidth(years[lastYearIndex]), settings, years, index, true);
            // case of NO : when a skip has occured and the marginBottom != 0
            // if marginBottom != 0, this means the function has added a margin bottom so there is not enough space to enter 
            if(marginBottom != 0 && yearIndex-1 != lastYearIndex) return this.getMarginBottom(yearIndex, yearIndex-1, yearpx, marginRight, settings, years, index, false);
            return marginBottom;
        },
        getMargin(element, side){
            return parseInt(element.css("margin" + side).replace('px', ''));
        },
        getPadding(element, side){
            return parseInt(element.css("padding" + side).replace('px', ''));
        },
        getEventFullHeight(element){
            return element.height() + this.getMargin(element, "Bottom") + this.getPadding(element, "Bottom") + this.getPadding(element, "Top");
        },
        getEventIndex(element){
            return parseInt(element.attr('class').replace('event event-', ''));
        },
        getYearFreeWidth(year){
            return $(".timeline .events .year-" + year).width() + parseInt(this.getMargin($(".timeline .events .year-" + year), "Right"));
        }
    },
    data:  () => {
        return {
            shiftPx: 0,
        }
    },
}
var appPeriodComp = {
    name: "appperiod",
    template: `
        <div class="period">
            <h4 class="title">{{event.title}}</h4>
            <h4 class="title">{{event.startdate}} - {{event.enddate}}</h4>
            <p class="title">{{event.description}}</p>
        </div>`,
    props: ["event"],
    methods: {
        
    }
}
var appYearComp = {
    name: "appyear",
    template: `
    <div class="year" v-bind:class="'year-'+year" v-bind:style="
        'order: ' + index + ';' +
        'width:' + getWidth(yearpx, yeardividefactor, type) + 'px;' +
        'margin-right:' + getMarginRight(year, index, years, type, yearpx) + 'px;' +
        ((type == 1) ? 'backgroundColor: ' + settings.years.backgroundColor + '; border-right: ' + settings.years.borderWidth + 'px solid ' + settings.years.borderColor + ';' + 'height: ' + settings.years.height + 'px;' : '') + ';' +
        'z-index: ' + index + ';'">
        
        <h4 class="title" v-if="type == 1" v-bind:style="'color: ' + settings.years.textColor + ';' +
            'line-height: ' + settings.years.height + 'px;' +
            'font-weight: ' + settings.years.fontWeight + ';'">{{year}}</h4>

        <app-event v-if="type == 0" v-for="(event, eventIndex) in events"
            v-bind:key="eventIndex" v-bind:index="eventIndex" v-bind:event="event" v-bind:yearindex="index" v-bind:yearpx="yearpx" v-bind:marginright="marginRight" v-bind:settings="settings" v-bind:years="years"></app-event>

        <app-period v-if="type == 2" v-for="(event, index) in events"
            v-bind:key="index" v-bind:event="event" v-bind:settings="settings"></app-period>
    </div>`,
    props: ["year", "index", "years", "events", "type", "yearpx", "yeardividefactor", "settings"],
    components: {
        "app-event": appEventComp,
        "app-period": appPeriodComp
    },
    data: () => {
        return {
            marginRight: 0
        }
    },
    methods: {
        getWidth: function(yearpx, yeardividefactor, type){
            return (type == 1) ? yearpx*yeardividefactor : yearpx;
        },
        getMarginRight: function(year, index, years, type, yearpx){
            switch(type){
                case 1: // YEARS LINE //
                return 0;
                case 0: // EVENTS (Top) //
                //console.log("////////// PROCESSING YEAR " + year + " //////////");
                if(years[index-1] == undefined) return 0;
                var margin = (years[index-1]-year-1) * yearpx;
                this.marginRight = (margin >= 0) ? margin : 0;
                return this.marginRight;
                break;  ///////////////////////
                case 2: // PERIODES (Bottom) //

                break;  ///////////////////////
            }
        }
    }
}


var app = new Vue({
    el: "#app",
    name: "timeline",
    data: {
        user: "Clement",
        timeline: {
            periodevents: {
                1820: [
                    {startdate: "11 Janvier 1815", startday: 11, startmonth: 1,
                        enddate: "20 Septembre 1817", endday: 20, endmonth: 9, title: "Répercusions du congrès de Vienne", description: "La tension monte, certains pays cherchent à se révolter."}
                ],
                1814: [
                    {startdate: "Septembre 1814", startday: 0, startmonth: 9,
                        enddate: "Juin 1815", endday: 0, endmonth: 6,
                        title: "Congrès de viennes", description: "Remise en état de l'europe, réequilibration des puissances.\nLouis 18 au pouvoir."}
                ],
                1830: [
                    {startdate: "1 Décembre 1821", startday: 1, startmonth: 12,
                        enddate: "3 Février 1830", endday: 3, endmonth: 2, endYear: 1830,
                        title: "Révolte Grecque", description: "Les Grecques se révoltent pour obtenir leurs indépendance. La Sainte aliance n'intervient pas et au contraire, des pays viennent rétablir la paix. Elle obtient son indépendance en 1830."}
                ]
            },
            dateevents: {
                1830: [
                    {date: "3 Juin 1830", day: 3, month: 6, title: "test test test test test test test test test test test", description: "Des journalistes se révoltent dans Paris car Charles X a supprimé la liberté d'expression -> révolution, Louis Phillipe au pouvoir. De plus, Louis 16 est"},
                ],
                1834: [
                    {date: "3 Juin 1830", day: 3, month: 6, title: "Les trois glorieuses", description: "Des journalistes se révoltent dans Paris car Charles X a supprimé la liberté d'expression -> révolution, Louis Phillipe au pouvoir."},
                ],
                1838: [
                    {date: "3 Juin 1830", day: 3, month: 6, title: "Les trois glorieuses"},
                ],
                1820: [
                    {date: "1820", day: 1, month: 1, title: "Révolte Espagnole", description: "Petite desctription qui permet de décrire l'évènement, comme son nom l'indique... de plus, il se passa des choses"},
                    {date: "1820", day: 1, month: 1, title: "Révolte Espagnole", description: "Petite desctription qui permet de décrire l'évènement, comme son nom l'indique..."},
                    {date: "3 Aout 1820", day: 16, month: 8, title: "Commencement de la révolte Grecque", description: "Le massacre de Chaos commence cette année, massacre des grecques sur l'île de Chaos"},
                ],
                1826: [
                    {date: "1 Janvier 1821", day: 1, month: 1, title: "Révolte Allemande", description: "(Ceci est un faux élènement...) mais cet evenement est auqnd meme"},
                    {date: "1 Janvier 1821", day: 1, month: 6, title: "Révolte Allemande", description: "(Ceci est un faux élènement...)"}
                ],
                1848: [
                    {date: "1848", day: 31, month: 12, title: "2em révolution Française", description: ""}
                ]
                
            }
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
        },
        settings: {
            global: {
                backgroundColor: "rgba(255, 255, 255, 1)",
                timelineWidth: 0
            },
            years: {
                height: 50,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 1)",
                backgroundColor: "#e74c3c",
                textColor: "rgba(0, 0, 0, 1)",
                fontWeight: 400,
                fontSize: 14
            },
            events: {
                width: 200,
                padding: 5,
                margin: 10,
                minMargin: 5,
                backgroundColor: "rgba(170, 170, 170, 0.6)",
                linkerColor: "rgba(170, 170, 170, 0.6)",
                linkerWidth: 1,
                borderRadius: 5,
                title: {
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: 16,
                    fontWeight: 700
                },
                date: {
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: 14,
                    fontWeight: 300
                },
                description: {
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: 14,
                    fontWeight: 400
                }
            },
            periods: {

            }
        },
        defaultSettings: {
            global: {
                backgroundColor: "rgba(255, 255, 255, 1)",
                timelineWidth: 0
            },
            years: {
                height: 50,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 1)",
                backgroundColor: "#e74c3c",
                textColor: "rgba(0, 0, 0, 1)",
                fontWeight: 400,
                fontSize: 14
            },
            events: {
                width: 200,
                padding: 5,
                margin: 10,
                minMargin: 5,
                backgroundColor: "rgba(170, 170, 170, 0.6)",
                linkerColor: "rgba(170, 170, 170, 0.6)",
                linkerWidth: 1,
                borderRadius: 5,
                title: {
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: 16,
                    fontWeight: 700
                },
                date: {
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: 14,
                    fontWeight: 300
                },
                description: {
                    color: "rgba(0, 0, 0, 1)",
                    fontSize: 14,
                    fontWeight: 400
                }
            },
            periods: {

            }
        },
        project: {
            name: "unnamed timeline"
        },
        ui: {
            currentTab: "settings"
        }
    },
    computed: {
        orderedDateEvents: function (){
            this.timeline.dateevents = _.orderBy(this.timeline.dateevents, 'year');
        },
        orderedPeriodEvents: function (){
            this.timeline.periodevents = _.orderBy(this.timeline.periodevents, 'year');
        },
        timelineWidthString: {
            get: function(){
                if(parseInt(this.settings.global.timelineWidth, 10) < 500){
                    return "Auto";
                }
                return this.settings.global.timelineWidth;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 500 || parseInt(value, 10) > 10000){
                    this.settings.global.timelineWidth = 499;
                }else{
                    this.settings.global.timelineWidth = parseInt(value, 10);
                }
            }
        },
        eventsWidthString: {
            get: function(){
                return this.settings.events.width;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 50 || parseInt(value, 10) > 1000){
                    this.settings.events.width = 200;
                }else{
                    this.settings.events.width = parseInt(value, 10);
                }
            }
        },
        yearsBorderWidthString: {
            get: function(){
                return this.settings.years.borderWidth;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 0 || parseInt(value, 10) > 5){
                    this.settings.years.borderWidth = 1;
                }else{
                    this.settings.years.borderWidth = parseInt(value, 10);
                }
            }
        },
        yearsFontWeightString: {
            get: function(){
                return this.settings.years.fontWeight;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 100 || parseInt(value, 10) > 900){
                    this.settings.years.fontWeight = 400;
                }else{
                    this.settings.years.fontWeight = parseInt(value, 10);
                }
            }
        },
        yearsHeightString: {
            get: function(){
                return this.settings.years.height;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 20 || parseInt(value, 10) > 100){
                    this.settings.years.height = 40;
                }else{
                    this.settings.years.height = parseInt(value, 10);
                }
            }
        },
        eventsBorderRadiusString: {
            get: function(){
                return this.settings.events.borderRadius;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 0 || parseInt(value, 10) > 30){
                    this.settings.events.borderRadius = 5;
                }else{
                    this.settings.events.borderRadius = parseInt(value, 10);
                }
            }
        },
        eventsPaddingString: {
            get: function(){
                return this.settings.events.padding;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 0 || parseInt(value, 10) > 30){
                    this.settings.events.padding = 10;
                }else{
                    this.settings.events.padding = parseInt(value, 10);
                }
            }
        },
        eventsMarginString: {
            get: function(){
                return this.settings.events.margin;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 0 || parseInt(value, 10) > 30){
                    this.settings.events.margin = 10;
                }else{
                    this.settings.events.margin = parseInt(value, 10);
                }
            }
        },
        eventsMinMarginString: {
            get: function(){
                return this.settings.events.minMargin;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 0 || parseInt(value, 10) > 30){
                    this.settings.events.minMargin = 10;
                }else{
                    this.settings.events.minMargin = parseInt(value, 10);
                }
            }
        },
        eventsLinkerWidthString: {
            get: function(){
                return this.settings.events.linkerWidth;
            },
            set: function(value){
                if(isNaN(parseInt(value, 10)) || parseInt(value, 10) == undefined || parseInt(value, 10) < 1 || parseInt(value, 10) > 10){
                    this.settings.events.linkerWidth = 1;
                }else{
                    this.settings.events.linkerWidth = parseInt(value, 10);
                }
            }
        }
    },
    methods: {
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
            }
        }
    },
    components: {
        "app-year": appYearComp,
        "app-event": appEventComp,
        "app-period": appPeriodComp
    }
});

window.onresize = function resize() {
    app.updateYearPx();
};

$(document).ready(function() { 
          
    var getCanvas;
    $("button#exporttimeline").on('click', function() { 
        html2canvas($("#timeline .timelinecontent"), {
            onrendered: function(canvas){
                $("div#rendercanvas").html(canvas);
                $(".filter").attr('style', 'display: block;');
                $(".filter .export").attr('style', 'display: block;');
                getCanvas = canvas;
            }
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
    //app.timeline.dateevents[1820] = app.timeline.dateevents[1820].splice(0, 1);
    //Vue.set(app.timeline.dateevents, 1814, []);
    //app.timeline.dateevents[1814].push({date: "12 Avril 1820", day: 12, month: 4, title: "test", description: ":aucune:"});
    //app.timeline.dateevents[1830][1] = {date: "13 Décembre 1830", day: 13, month: 12, title: "test 2", description: "Ceci est un event de test"};
    
}, 1000);

setTimeout(() => {
    //app.timeline.dateevents[1820].push({date: "12 Avril 1820", day: 12, month: 4, title: "test", description: ":aucune:"});
}, 5000);

