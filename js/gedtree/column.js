window.columnComp = {
    name: "column",
    template: `
        <div ref="column" :class="colClasses" :style="colStyle">
            <div class="family" v-for="(childGroups, i1) in data.childGroups" :key="i1">
                <div class="couple" v-for="(ind, i2) in childGroups.couples" :key="i2">
                    <individual v-if="ind.husband" :gedcom="gedcom" :settings="settings" :data="ind.husband" :layout="data.layout"></individual>
                    <individual v-if="ind.wife" :gedcom="gedcom" :settings="settings" :data="ind.wife" :layout="data.layout"></individual>
                </div>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data"],
    data: function(){
        return {
            colHeight: 0,
        };
    },
    computed: {
        colClasses: function(){
            return {
                column: true,
                big: this.verticalDisplay,
                small: !this.verticalDisplay,
            };
        },
        colStyle: function(){
            return {

            };
        },
        verticalDisplay: function(){
            return this.data.layout.verticalDisplay;
        },
        showPictures: function(){
            return this.data.layout.showPictures;
        },
    },
    mounted: function(){
        // column height is constant
        // this.colHeight = this.$refs.column.clientHeight;
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
