window.treeComp = {
    name: "tree",
    template: `
        <div id="tree" :style="rootStyle">
            <div id="tree-content" :style="contentStyle">
                <div class="header" v-if="settings.decoration.title.titleText">
                    <p class="title" :style="titleStyle">{{settings.decoration.title.titleText}}</p>
                    <p class="subtitle" :style="subtitleStyle">{{settings.decoration.title.subtitleText}}</p>
                </div>
                <div id="tree-columns">
                    <column v-for="(col, i) in data.columns" :key="i" :gedcom="gedcom" :settings="settings" :data="col" :colCount="i - settings.size.leftColumns" :gedcom_data="data.gedcom_data" :selected="selected" @update-selected="updateSelected"></column>
                </div>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data", "selected"],
    emits: ["update-selected"],
    computed: {
        rootStyle: function(){
            let styles = {
                padding: this.convertLength(this.settings.decoration.margins.rootMargin),
                background: this.settings.decoration.background.backgroundColor + ' url(' + this.settings.decoration.background.backgroundImage + ') no-repeat',
                width: this.settings.size.width + 'px',
                height: this.settings.size.width*this.settings.size.aspectRatio + 'px',
            };
            // 50% = center
            styles['background-position-x'] = 'calc(50% + ' + (this.settings.decoration.background.backgroundImageX/100 * this.settings.size.width) + 'px)';
            styles['background-position-y'] = 'calc(50% + ' + (this.settings.decoration.background.backgroundImageY/100 * this.settings.size.width*this.settings.size.aspectRatio) + 'px)';

            if(this.settings.decoration.background.backgroundSize == 0){
                styles['background-size'] = 'cover';
            }else{
                styles['background-size'] = this.settings.decoration.background.backgroundSize + '%';
            }

            return styles;
        },
        contentStyle: function(){
            return {
                padding: this.convertLength(this.settings.decoration.margins.innerMargin),
                border: this.convertLength(this.settings.decoration.border.borderWidth) + ' solid ' + this.settings.decoration.border.borderColor,
                'border-radius': this.convertLength(this.settings.decoration.border.borderBorderRadius),
            };
        },
        titleStyle: function(){
            return {
                color: this.settings.decoration.title.titleColor,
                fontFamily: this.settings.decoration.title.titleFont,
                fontWeight: this.settings.decoration.title.titleFontWeight,
                fontStyle: this.settings.decoration.title.titleFontStyle,
                fontSize: this.convertLength(this.settings.decoration.title.titleFontSize),
                fontVariant: this.settings.decoration.title.titleSmallCaps ? 'small-caps' : 'normal',
                lineHeight: this.settings.decoration.title.titleLineHeight + '%',
                marginBottom: this.convertLength(this.settings.decoration.title.titleSubTitleSpacing),
            };
        },
        subtitleStyle: function(){
            return {
                color: this.settings.decoration.title.subtitleColor,
                fontFamily: this.settings.decoration.title.subtitleFont,
                fontWeight: this.settings.decoration.title.subtitleFontWeight,
                fontStyle: this.settings.decoration.title.subtitleFontStyle,
                fontSize: this.convertLength(this.settings.decoration.title.subtitleFontSize),
                fontVariant: this.settings.decoration.title.subtitleSmallCaps ? 'small-caps' : 'normal',
                lineHeight: this.settings.decoration.title.subtitleLineHeight + '%',
            };
        }
    },
    methods: {
        convertLength(length){
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length/1000 * this.settings.size.width + 'px';
        },
        updateSelected: function (selected){
            this.$emit('update-selected', selected);
        }
    },
    components: {
        "column": columnComp,
    }
}
