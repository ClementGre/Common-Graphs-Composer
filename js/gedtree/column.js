window.columnComp = {
    name: "column",
    template: `
        <div class="column" :style="colStyle">
            <div class="family" v-for="(childGroups, i1) in data.childGroups" :key="i1">
                <div class="couple" v-for="(ind, i2) in childGroups.couples" :key="i2">
                    <individual v-if="ind.husband" :gedcom="gedcom" :settings="settings" :data="ind.husband"></individual>
                    <individual v-if="ind.wife" :gedcom="gedcom" :settings="settings" :data="ind.wife"></individual>
                </div>
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
