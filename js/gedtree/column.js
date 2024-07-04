window.columnComp = {
    name: "column",
    template: `
        <div ref="column" :class="colClasses" :style="colStyle">
            <div class="child-group" v-for="(childGroup, i1) in data.childGroups" :key="i1">
                <template v-if="childGroup">
                    <div v-if="childGroup.couples.length > 1" class="vline" :style="childGroupVlineStyle(childGroup)"></div>
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
        childGroupVlineStyle: function (childGroup) {
            let topCouple = childGroup.couples[0];
            let bottomCouple = childGroup.couples[childGroup.couples.length - 1];
            let isTopSpouseVisible = (topCouple.wasMen && topCouple.wife !== null) || (!topCouple.wasMen && topCouple.husband !== null);
            let isBottomSpouseVisible = (bottomCouple.wasMen && bottomCouple.wife !== null) || (!bottomCouple.wasMen && bottomCouple.husband !== null);

            let shouldExpandTop = isTopSpouseVisible && topCouple.wasMen
            let shouldContractTop = isTopSpouseVisible && !topCouple.wasMen
            let shouldExpandBottom = isBottomSpouseVisible && !bottomCouple.wasMen
            let shouldContractBottom = isBottomSpouseVisible && bottomCouple.wasMen

            let barHeight =  100 - 100 / childGroup.couples.length * (1 + 0.25 * (shouldContractTop + shouldContractBottom - shouldExpandBottom - shouldExpandTop))
            let barTop = 50 + 100 / childGroup.couples.length * 0.125 * (shouldContractTop + shouldExpandBottom - shouldExpandTop - shouldContractBottom)

            console.log('barHeight', barHeight, 'barTrY', barTop, 'shouldExpandTop', shouldExpandTop, 'shouldContractTop', shouldContractTop, 'shouldExpandBottom', shouldExpandBottom, 'shouldContractBottom', shouldContractBottom)

            return {
                'height': 'calc(' + barHeight + '% + ' + this.linkLinesWidth + 'px)',
                'border-left': this.linkLinesWidth + 'px solid ' + this.settings.individual.linkLines.color,
                'border-radius': '0 ' + this.linkLinesWidth*2 + 'px ' + this.linkLinesWidth*2 + 'px 0',
                'top': 'calc(' + barTop + '%)',
            };
        },
        convertLength(length) {
            // Lengths are expressed in ‰ (per thousand) of the width of the tree
            return length / 1000 * this.settings.size.width + 'px';
        }
    },
    components: {
        "individual": individualComp,
    }
}
