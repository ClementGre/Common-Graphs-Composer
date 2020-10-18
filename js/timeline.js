var appPreviewComp = {
    name: "apppreview",
    template: `<div>timeline</div>`,
    props: [],
    methods: {
        
    }
}
var appTimelineComp = {
    name: "apppanel",
    template: `<div>Panel</div>`,
    props: [],
    methods: {
        
    }
}

var app = new Vue({
    el: "#app-timeline",
    name: "timeline",
    data: {
        user: "Clement",
        timeline: {
            periodevents: [],
            dateevents: []
        },
        settings: {

        }
    },
    methods: {
        
    },
    components: {
        "app-preview": appPreviewComp,
        "app-panel": appTimelineComp
    }
});