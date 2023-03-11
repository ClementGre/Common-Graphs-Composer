window.treeComp = {
    name: "tree",
    template: `
        <div id="tree" :style="rootStyle">
            <div class="content" :style="contentStyle">
                {{JSON.stringify(data)}}
                <column v-for="(col, i) in data.columns" :key="i" :gedcom="gedcom" :settings="settings" :data="col"></column>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data"],
    computed: {
        rootStyle: function(){
            let styles = {
                padding: this.convertLength(this.settings.decoration.rootMargin),
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
        },
        contentStyle: function(){
            return {
                padding: this.convertLength(this.settings.decoration.innerMargin),
                border: this.convertLength(this.settings.decoration.border.borderWidth) + ' solid ' + this.settings.decoration.border.borderColor,
                'border-radius': this.convertLength(this.settings.decoration.border.borderBorderRadius),
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
        "column": columnComp,
    }
}
