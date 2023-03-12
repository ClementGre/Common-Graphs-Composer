window.columnComp = {
    name: "column",
    template: `
        <div class="column" :style="colStyle">
            <div class="couple"
                v-for="(ind, i) in data.couples">
                <individual v-if="ind.husband" :gedcom="gedcom" :settings="settings" :data="ind.husband"></individual>
                <individual v-if="ind.wife" :gedcom="gedcom" :settings="settings" :data="ind.wife"></individual>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data"],
    computed: {
        colStyle: function(){
            return {

            };
        }
    },
    methods: {
        convertLength(length){
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length/1000 * this.settings.size.width + 'px';
        }
    },
    components: {
        "individual": individualComp,
    }
}
