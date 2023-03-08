function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

const app = new Vue({
    el: "#app",
    name: "gedtree",
    data: {
        gedcom: null,
        renderData: {

        },
        settings: {
            backgroundColor: "#ffffff",
        },
        ui: {
            search_query: "grennerat",
        },
        dump: "no.."
    },
    created: function(){
        const promise = fetch('example.ged')
            .then(r => r.arrayBuffer())
            .then(Gedcom.readGedcom);

        promise.then(gedcom => {
            this.gedcom = gedcom;
        });
    },
    computed: {
        gedcom_search_html: function(){
            if (this.gedcom === null) return "";

            let query = this.ui.search_query;
            let data = "";
            if(query.length >= 3){
                const results = this.search_someone(query);
                for (let i = 0; i < results.length; i++) {
                    let result = results.arraySelect()[i];
                    console.log()
                    data += result.getName().valueAsParts()[0][0] + " " + result.getName().valueAsParts()[0][1] +  " (" + gedDateToString(result.getEventBirth().getDate()) + ") <br>";
                }
            }
            return data;
        },
    },
    methods: {
        search_someone(query){
            const tokenize = name => name.trim().toLowerCase().split(/ +/);
            const queryTokens = tokenize(query);

            return this.gedcom.getIndividualRecord().filterSelect(individual => {
                const names = individual.getName().valueAsParts()[0];
                if(names !== null) {
                    const namesTokens = names.filter(v => v).flatMap(tokenize);
                    return queryTokens.every(s => namesTokens.some(n => utf8ToAscii(n.toLowerCase()).includes(utf8ToAscii(s.toLowerCase()))));
                }
                return false;
            });
        }
    },
    watch: {
        settings: {
            deep: true,
            handler: function(val, oldVal){

            }
        },
        // START WATCHER (immediate)
        // 'ui.currentTab': {
        //     immediate: true,
        //     handler: function(val, oldVal){
        //
        //     }
        // }
    },
    components: {
        // "app-year": appYearComp,
    }
});
