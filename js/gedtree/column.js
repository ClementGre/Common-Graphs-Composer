window.columnComp = {
    name: "column",
    template: `
        <div ref="column" :class="colClasses" :style="colStyle">
            <div class="child-group" v-for="(childGroup, i1) in data.childGroups" :key="i1">
                <template v-if="childGroup">
                    <div v-if="childGroup.couples.length > 1" class="vline" :style="childGroupVlineStyle(childGroup.couples.length)"></div>
                    <div class="couple" v-for="(couple, i2) in childGroup.couples" :key="i2">
                        <template v-if="couple">
                            <div v-if="couple.hasChild" class="vline" :style="colVlineStyle"></div>
                            <individual v-if="couple.husband" :gedcom="gedcom" :settings="settings" :data="couple.husband" :gedcom_data="gedcom_data"
                                :layout="data.layout" :chGroupCount="chGroupCount" :hasChild="couple.hasChild"></individual>
                            <individual v-if="couple.wife" :gedcom="gedcom" :settings="settings" :data="couple.wife" :gedcom_data="gedcom_data"
                                :layout="data.layout" :chGroupCount="chGroupCount" :hasChild="couple.hasChild"></individual>
                        </template>
                    </div>
                </template>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data", "gedcom_data"],
    data: function () {
        return {
            colHeight: 0,
        };
    },
    computed: {
        colClasses: function () {
            return {
                column: true,
                big: this.verticalDisplay,
                small: !this.verticalDisplay,
            };
        },
        colStyle: function () {
            return {};
        },
        colVlineStyle: function () {
            return {
                'height': 'calc(50% + ' + this.linkLinesWidth + 'px)',
                'border-left': this.linkLinesWidth + 'px solid ' + this.settings.individual.linkLines.color,
                'border-radius': this.linkLinesWidth*2 + 'px 0 0 ' + this.linkLinesWidth*2 + 'px'
            };
        },
        chGroupCount: function () {
              return this.data.childGroups.length;
        },
        verticalDisplay: function () {
            return this.data.layout.verticalDisplay;
        },
        showPictures: function () {
            return this.data.layout.showPictures;
        },
        linkLinesWidth: function () {
            // Returns an even number of pixels so it can be divided by 2 safely
            return Math.ceil(this.settings.individual.linkLines.width / 1000 * this.settings.size.width / 2) * 2;
        }
    },
    mounted: function () {
        // column height is constant
        // this.colHeight = this.$refs.column.clientHeight;
    },
    methods: {
        childGroupVlineStyle: function (childrenCount) {
            return {
                'height': 'calc(' + (100 - 100 / childrenCount) + '% + ' + this.linkLinesWidth + 'px)',
                'border-left': this.linkLinesWidth + 'px solid ' + this.settings.individual.linkLines.color,
                'border-radius': '0 ' + this.linkLinesWidth*2 + 'px ' + this.linkLinesWidth*2 + 'px 0'
            };
        },
        convertLength(length) {
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length / 1000 * this.settings.size.width + 'px';
        }
    },
    components: {
        "individual": individualComp,
    }
}
