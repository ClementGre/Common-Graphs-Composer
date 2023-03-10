window.treeComp = {
    name: "tree",
    template: `
        <div id="tree" :style="rootStyle">
            
        </div>
        `,
    props: ["gedcom", "settings", "renderData"],
    computed: {
        rootStyle: function(){
            let styles = {
                background: this.settings.background.backgroundColor + ' url(' + this.settings.background.backgroundImage + ') no-repeat',
                width: this.settings.size.width + 'px',
                height: this.settings.size.width*this.settings.size.aspectRatio + 'px',
            };
            // 50% = center
            styles['background-position-x'] = 'calc(50% + ' + (this.settings.background.backgroundImageX/100 * this.settings.size.width) + 'px)';
            styles['background-position-y'] = 'calc(50% + ' + (this.settings.background.backgroundImageY/100 * this.settings.size.width*this.settings.size.aspectRatio) + 'px)';

            if(this.settings.background.backgroundSize == 0){
                styles['background-size'] = 'cover';
            }else{
                styles['background-size'] = this.settings.background.backgroundSize + '%';
            }

            return styles;
        }
    },
    methods: {

    }
}
