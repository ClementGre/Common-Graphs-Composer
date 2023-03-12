window.individualComp = {
    name: "individual",
    template: `
        <div :class="individualClasses" :style="individualStyle">
            <div v-if="big" class="virtual-top"></div>
            <div v-if="big" class="hline"></div>
            <div class="img" :style="imgStyle"></div>
            <div class="content">
                <div class="top">
                    <p>{{data?.firstName}}</p>
                </div>
                <div v-if="small" class="hline"></div>
                <div class="bottom">
                    <p>{{data?.lastName}}</p>
                </div>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data"],
    computed: {
        individualClasses: function(){
            return {
                individual: true,
                big: this.big,
                small: this.small
            };
        },
        individualStyle: function(){
            return {

            };
        },
        imgStyle: function(){
            return {
                background: 'url(https://www.gravatar.com/avatar/bonjour) center center/cover no-repeat',
                width: this.convertLength(50),
                height: this.convertLength(75),
            };
        },
        big: function(){ return true; },
        small: function(){ return false; }
    },
    methods: {
        convertLength(length){
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length/1000 * this.settings.size.width + 'px';
        }
    }
}
