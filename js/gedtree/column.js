window.columnComp = {
    name: "column",
    template: `
        <div ref="column" :class="colClasses" :style="colStyle">
            <div class="child-group" v-for="(childGroup, i1) in data.childGroups" :key="i1">
                <template v-if="childGroup">
                    <div v-if="childGroup.couples.length > 1" class="vline" :style="childGroupVlineStyle(childGroup, false)"></div>
                    <div v-if="childGroup.couples.length > 1 && colCount > 0" class="vline" :style="childGroupVlineStyle(childGroup, true)"></div>
                    <div class="couple" v-for="(couple, i2) in childGroup.couples" :key="i2" :style="coupleStyle(couple)">
                        <template v-if="couple">
                            <div v-if="couple.hasChild" class="vline" :style="colVlineStyle"></div>
                            <individual v-if="couple.husband" :gedcom="gedcom" :settings="settings" :data="couple.husband" :gedcom_data="gedcom_data"
                                :layout="data.layout" :individualCount="individualCount" :hasChild="couple.hasChild" :hasParents="!couple.isBrother || couple.wasMen" :selected="selected" @update-selected="updateSelected"></individual>
                            <individual v-if="couple.wife" :gedcom="gedcom" :settings="settings" :data="couple.wife" :gedcom_data="gedcom_data"
                                :layout="data.layout" :individualCount="individualCount" :hasChild="couple.hasChild" :hasParents="!couple.isBrother || !couple.wasMen" :selected="selected" @update-selected="updateSelected"></individual>
                        </template>
                    </div>
                </template>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data", "gedcom_data", "selected", "colCount"],
    data: function () {
        return {
            colHeight: 0,
            selectedIndividual: undefined
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
        individualCount: function () {
              return this.data.childGroups.map(childGroup =>
                childGroup.couples.map(couple => couple.husband && couple.wife ? 2 : 1).reduce((a, b) => a + b, 0)
              ).reduce((a, b) => a + b, 0);
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
        childGroupVlineStyle: function (childGroup, isSecondLine) {
            let barHeight, barTop
            if(this.colCount > 0){
                // Right column: one line for each spouse

                let originalCouple = childGroup.couples.find(couple => !couple.isBrother)
                let originalCoupleIndex = childGroup.couples.indexOf(originalCouple)

                let topCoupleIndex = isSecondLine ? originalCoupleIndex : 0
                let bottomCoupleIndex = isSecondLine ? childGroup.couples.length - 1 : originalCoupleIndex
                let topCouple = childGroup.couples[topCoupleIndex]
                let bottomCouple = childGroup.couples[bottomCoupleIndex]

                let totalIndividualCount = childGroup.couples.map(couple => couple.husband && couple.wife ? 2 : 1).reduce((a, b) => a + b, 0)
                let individualCount = childGroup.couples.filter((_, i) => i >= topCoupleIndex && i <= bottomCoupleIndex)
                    .map(couple => couple.husband && couple.wife ? 2 : 1).reduce((a, b) => a + b, 0)
                let individualTopCount = isSecondLine ? totalIndividualCount - individualCount : 0

                let isTopSpouseVisible = (topCouple.wasMen && topCouple.wife !== null) || (!topCouple.wasMen && topCouple.husband !== null);
                let isBottomSpouseVisible = (bottomCouple.wasMen && bottomCouple.wife !== null) || (!bottomCouple.wasMen && bottomCouple.husband !== null);

                let shouldContractTop = isSecondLine || isTopSpouseVisible && !topCouple.wasMen
                let shouldContractBottom = !isSecondLine || isBottomSpouseVisible && bottomCouple.wasMen
                console.log('-------------- isSecondLine', isSecondLine)
                console.log('topCouple.wasMen', topCouple.wasMen)
                console.log('shouldContractTop', shouldContractTop)
                console.log('shouldContractBottom', shouldContractBottom)
                console.log('individualCount', individualCount)
                console.log('totalIndividualCount', totalIndividualCount)
                console.log('individualTopCount', individualTopCount)

                barHeight = 100 - 100 / totalIndividualCount * (1 + (totalIndividualCount - individualCount) + (shouldContractTop + shouldContractBottom))
                barTop = 100 / totalIndividualCount * (0.5 + individualTopCount + shouldContractTop)

            }else{
                let topCouple = childGroup.couples[0];
                let bottomCouple = childGroup.couples[childGroup.couples.length - 1];
                let isTopSpouseVisible = (topCouple.wasMen && topCouple.wife !== null) || (!topCouple.wasMen && topCouple.husband !== null);
                let isBottomSpouseVisible = (bottomCouple.wasMen && bottomCouple.wife !== null) || (!bottomCouple.wasMen && bottomCouple.husband !== null);

                let shouldContractTop = isTopSpouseVisible && !topCouple.wasMen
                let shouldContractBottom = isBottomSpouseVisible && bottomCouple.wasMen

                let individualCount = childGroup.couples.map(couple => couple.husband && couple.wife ? 2 : 1).reduce((a, b) => a + b, 0)

                barHeight =  100 - 100 / individualCount * (1 + (shouldContractTop + shouldContractBottom))
                barTop = 100 / individualCount * (0.5 + shouldContractTop)
            }
            return {
                'transform': 'translateX(50%)',
                'height': 'calc(' + barHeight + '% + ' + this.linkLinesWidth + 'px)',
                'top': 'calc(' + barTop + '% - ' + this.linkLinesWidth/2 + 'px)',
                'border-left': this.linkLinesWidth + 'px solid ' + this.settings.individual.linkLines.color,
                'border-radius': '0 ' + this.linkLinesWidth*2 + 'px ' + this.linkLinesWidth*2 + 'px 0',
            };
        },
        coupleStyle: function (couple) {
            return {
                'flex-basis':  couple && couple.husband && couple.wife ? '200%' : '100%',
            };
        },
        convertLength(length) {
            // Lengths are expressed in ‰ (per thousand) of the width of the tree
            return length / 1000 * this.settings.size.width + 'px';
        },
        updateSelected: function (selected){
            this.$emit('update-selected', selected);
        }
    },
    components: {
        "individual": individualComp,
    }
}
