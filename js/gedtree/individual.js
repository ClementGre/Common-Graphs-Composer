window.individualComp = {
    name: "individual",
    template: `
        <div :class="individualClasses" :style="individualStyle">
            <div v-if="layout.verticalDisplay" class="virtual-top"></div>
            <div v-if="layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
            <div v-if="layout.showPictures || layout.verticalDisplay" class="img" :style="imgStyle"></div>
            <div class="content">
                <div class="top">
                    <p>{{data?.firstName}} {{data?.lastName}}</p>
                </div>
                <div v-if="!layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
                <div class="bottom">
                    <p></p>
                </div>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data", "layout"],
    computed: {
        individualClasses: function(){
            return {
                individual: true,
            };
        },
        individualStyle: function(){
            return {

            };
        },
        imgStyle: function(){
            return {
                background: 'url(https://www.gravatar.com/avatar/bonjour) center center/cover no-repeat',
                width: this.convertLength(30),
                height: this.convertLength(40),
                border: this.convertLength(this.settings.individual.linkLines.width) + ' solid ' + this.settings.individual.linkLines.color,
            };
        },
        hlineStyle: function(){
            return {
                'right': this.convertLength(this.settings.individual.linkLines.width/2),
                'width': 'calc(100% - ' + this.convertLength(this.settings.individual.linkLines.width) + ')',
                'border-bottom': this.convertLength(this.settings.individual.linkLines.width) + ' solid ' + this.settings.individual.linkLines.color,
                //'border-radius': this.convertLength(this.settings.individual.linkLines.width*2),
            };
        }
    },
    methods: {
        convertLength(length){
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length/1000 * this.settings.size.width + 'px';
        }
    }
}
