window.individualComp = {
    name: "individual",
    template: `
        <div class="individual" :style="individualStyle">
            {{data.firstName}}
        </div>
        `,
    props: ["gedcom", "settings", "data"],
    computed: {
        individualStyle: function(){
            return {

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
