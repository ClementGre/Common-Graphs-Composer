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
        <div class="event" v-bind:style="'margin-left:' + getshiftpx() + 'px;'">
            <h4 class="title">{{event.title}}</h4>
            <h4 class="date">{{event.date}}</h4>
            <p class="description">{{event.description}}</p>
        </div>`,
    props: ["event", "yearpx"],
    methods: {
        getshiftpx: function() {
            return this.yearpx / 12.0 * (this.event.month-1);
        }
    }
}
var appPeriodeComp = {
    name: "appperiode",
    template: `
        <div class="periode">
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
        'order:' + year + ';' +
        'max-width:' + yearpx + 'px;' +
        'z-index: ' + getIndex(index) + ';'">
        
        <h4 class="title" v-if="showyear">{{year}}</h4>

        <app-event v-if="!showyear && !periode" v-for="(event, index) in events"
            v-bind:key="index" v-bind:event="event" v-bind:yearpx="yearpx"></app-event>

        <app-periode v-if="!showyear && periode" v-for="(event, index) in events"
            v-bind:key="index" v-bind:event="event"></app-periode>

        <div class="space" v-bind:style="'height:' +  + 'px;'"></div>

    </div>`,
    props: ["events", "year", "index", "showyear", "periode", "yearpx"],
    components: {
        "app-event": appEventComp,
        "app-periode": appPeriodeComp
    },
    methods: {
        getIndex: function(index){
            return 99999-index;
        }
    }
}


var app = new Vue({
    el: "#app",
    name: "timeline",
    data: {
        user: "Clement",
        timeline: {
            periodeevents: {
                1815: [
                    {startdate: "11 Janvier 1815", startday: 11, startmonth: 1,
                        enddate: "20 Septembre 1817", endday: 20, endmonth: 9, title: "Répercusions du congrès de Vienne", description: "La tension monte, certains pays cherchent à se révolter."}
                ],
                1814: [
                    {startdate: "Septembre 1814", startday: 0, startmonth: 9,
                        enddate: "Juin 1815", endday: 0, endmonth: 6,
                        title: "Congrès de viennes", description: "Remise en état de l'europe, réequilibration des puissances.\nLouis 18 au pouvoir."}
                ],
                1821: [
                    {startdate: "1 Décembre 1821", startday: 1, startmonth: 12,
                        enddate: "3 Février 1830", endday: 3, endmonth: 2, endYear: 1830,
                        title: "Révolte Grecque", description: "Les Grecques se révoltent pour obtenir leurs indépendance. La Sainte aliance n'intervient pas et au contraire, des pays viennent rétablir la paix. Elle obtient son indépendance en 1830."}
                ]
            },
            dateevents: {
                1830: [
                    {date: "3 Juin 1830", day: 3, month: 6, title: "Les trois glorieuses", description: "Des journalistes se révoltent dans Paris car Charles X a supprimé la liberté d'expression -> révolution, Louis Phillipe au pouvoir."},
                ],
                1820: [
                    {date: "1820", day: 0, month: 1, title: "Révolte Espagnole"},
                    {date: "3 Aout 1820", day: 16, month: 8, title: "Commencement de la révolte Grecque", description: "Le massacre de Chaos commence cette année, massacre des grecques sur l'île de Chaos"}
                ],
                1821: [
                    {date: "1 Janvier 1821", day: 1, month: 1, title: "Révolte Allemande", description: "(Ceci est un faux élènement...)"}
                ]
                
            }
        },
        sortedTimeline: {dateevents: {}, periodeevents: {}},
        renderData: {
            dateEventsOccuped: [],
            yearPx: 0
        },
        settings: {

        }
    },
    computed: {
      orderedDateEvents: function (){
        this.timeline.dateevents = _.orderBy(this.timeline.dateevents, 'year');
      },
      orderedPeriodeEvents: function (){
        this.timeline.periodeevents = _.orderBy(this.timeline.periodeevents, 'year');
      }
    },
    methods: {
        getPreviewYearPx: function(){
            return document.getElementById("events").offsetWidth / Object.keys(this.sortedTimeline.dateevents).length;
        },
        getSortedTimeLine: function (){
            var orderedDateEventsYears = _.sortBy(Object.keys(this.timeline.dateevents));
            var orderedPeriodeEventsYears = _.sortBy(Object.keys(this.timeline.periodeevents));
            var firstYear = orderedDateEventsYears[0] < orderedPeriodeEventsYears[0] ? orderedDateEventsYears[0] : orderedPeriodeEventsYears[0];
            var lastYear = orderedDateEventsYears[orderedDateEventsYears.length-1] > orderedPeriodeEventsYears[orderedPeriodeEventsYears.length-1] ? orderedDateEventsYears[orderedDateEventsYears.length-1] : orderedPeriodeEventsYears[orderedPeriodeEventsYears.length-1]

            if(firstYear == undefined) firstYear = lastYear;
            if(lastYear == undefined){
                if(firstYear == undefined){
                    lastYear = 0;
                    firstYear = 0;
                }else{
                    lastYear = firstYear;
                }
            }
            var dateevents = {};
            var periodeevents = {};
            console.log('Define ends : ' + firstYear + ' < ' + lastYear);
            for(var year = firstYear; year <= lastYear; year++){
                dateevents[year] = [];
                periodeevents[year] = [];
                if(this.timeline.dateevents[year] != undefined){
                    var orderedEvents = _.orderBy(this.timeline.dateevents[year], ['month', 'day']);
                    for(let i in orderedEvents){
                        dateevents[year].push(orderedEvents[i]);
                    }
                }
                if(this.timeline.periodeevents[year] != undefined){
                    var orderedEvents = _.orderBy(this.timeline.periodeevents[year], ['startmonth', 'startday']);
                    for(let i in orderedEvents){
                        periodeevents[year].push(orderedEvents[i]);
                    }
                }
            }
            return {dateevents: dateevents, periodeevents: periodeevents};
        }
    },
    watch: {
        timeline: {
            handler: function (val, oldVal) {
                var sorted = this.getSortedTimeLine();
                this.sortedTimeline.dateevents = sorted.dateevents;
                this.sortedTimeline.periodeevents = sorted.periodeevents;
            },
            deep: true
        },
        sortedTimeline: {
            handler: function (val, oldVal) {
                console.log('sorted timeline data changed');
                this.renderData.yearPx = this.getPreviewYearPx();
            },
            deep: true
        }
    },
    components: {
        "app-year": appYearComp,
        "app-event": appEventComp,
        "app-periode": appPeriodeComp
    }
});

app.timeline.dateevents[1830].push({date: "12 Avril 1815", day: 12, month: 4, title: "test", description: ":aucune:"});

