window.individualComp = {
    name: "individual",
    template: `
        <div :class="individualClasses" :style="individualStyle">
            <div v-if="layout.verticalDisplay" class="virtual-top"></div>
            <div v-if="layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
            <div v-if="isImageVisible" class="img" :style="imgStyle"></div>
            <div class="content" :style="contentStyle">
                <div class="top" :style="topStyle">
                    <p class="name" :style="nameStyle">{{firstNames + ' ' + lastName}}</p>
                    <p class="occupation" v-if="data?.occupation" :style="occupationStyle">{{data?.occupation}}</p>
                </div>
                <div v-if="!layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
                <div class="bottom" :style="bottomStyle">
                    <p class="date" :style="dateStyle"></p>
                </div>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data", "layout", "chGroupCount", "hasChild"],
    computed: {
        firstNames: function(){
            if (this.settings.individual.displayName.cutMiddleNames){
                let firstName = ""
                let nameParts = this.data?.firstName.split(' ');
                if (nameParts.length >= 1){
                    firstName = nameParts.shift()
                    nameParts.forEach(part => {
                        if (part.length > 1 && part.charAt(0) !== '(') firstName += ' ' + part.charAt(0) + '.';
                    })
                }
                return firstName
            }else return this.data?.firstName;
        },
        lastName: function(){
            if (this.settings.individual.displayName.pascalCaseSurname){
                let lastName = ""
                let nameParts = this.data?.lastName.split(' ');
                nameParts.forEach(part => {
                    lastName += part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() + ' ';
                })
                return lastName
            }else if (this.settings.individual.displayName.upperCaseSurname){
                return this.data?.lastName?.toUpperCase();
            }else return this.data?.lastName;
        },
        individualClasses: function(){
            return {
                individual: true,
            };
        },
        individualStyle: function(){
            return {
                'padding-left': (!this.layout.verticalDisplay && this.isImageVisible) ? this.convertMargin(this.settings.margins.horizontalLayout.imageLeftMargin) : false,
            };
        },
        contentStyle: function(){
            return {
                gap: !this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.horizontalLayout.linkLineMargin*2) : false,
            };
        },
        topStyle: function(){
            return {
                gap: !this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.horizontalLayout.nameOccupationSpacing) : false,
                'padding-left': !this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.horizontalLayout.textLeftMargin) : false,

            };
        },
        bottomStyle: function(){
            return {
                'padding-left': !this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.horizontalLayout.textLeftMargin) : false,

            };
        },
        imgStyle: function(){
            let height = 70;
            if (!this.layout.verticalDisplay){
                height = 50 * Math.pow(0.75, Math.log2(this.chGroupCount/4));
            }
            height *= this.layout.pictureSize/100
            return {
                background: 'url(https://www.gravatar.com/avatar/bonjour) center center/cover no-repeat',
                width: this.convertLength(height * 0.7),
                height: this.convertLength(height),
                border: this.linkLinesWidth + 'px solid ' + this.settings.individual.linkLines.color,
            };
        },
        nameStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.displayName.fontSize),
                'font-weight': this.settings.individual.displayName.fontWeight,
                'color': this.settings.individual.displayName.color,
                'width': this.layout.forceWrapOccupation ? '100%' : false,
                'margin-top': this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.verticalLayout.imageNameSpacing) : false,
            };
        },
        occupationStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.occupation.fontSize, this.settings.individual.occupation.decreaseDifference),
                'font-weight': this.settings.individual.occupation.fontWeight,
                'color': this.settings.individual.occupation.color,
                'margin-top': this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.verticalLayout.nameOccupationSpacing) : false,
            };
        },
        dateStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.date.fontSize, this.settings.individual.date.decreaseDifference),
                'font-weight': this.settings.individual.date.fontWeight,
                'color': this.settings.individual.date.color,
                'margin-top': this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.verticalLayout.occupationDateSpacing) : false,
            };
        },
        hlineStyle: function(){
            let widthPercent = 100;
            if (this.layout.verticalDisplay && !this.hasChild) widthPercent = 50;
            return {
                'right': this.linkLinesWidth/2 + 'px',
                'width': 'calc(' + widthPercent + '% - ' + this.linkLinesWidth + 'px)',
                'border-bottom': this.linkLinesWidth + 'px solid ' + this.settings.individual.linkLines.color,
            };
        },
        linkLinesWidth: function () {
            // Returns an even number of pixels so it can be divided by 2 safely
            return Math.ceil(this.settings.individual.linkLines.width / 1000 * this.settings.size.width / 2) * 2;
        },
        isImageVisible: function(){
            return this.layout.showPictures || this.layout.verticalDisplay
        }
    },
    methods: {
        convertLength(length){
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length/1000 * this.settings.size.width+ 'px';
        },
        convertMargin(length){
            // Margins depends on the font size (expressed in per fifty of font size in px)
            return length * this.getFontSizeRaw()/50 + 'px';
        },
        getFontSize(scale = 100, decreaseDifference= false){
            return this.getFontSizeRaw(scale, decreaseDifference) + 'px';
        },
        getFontSizeRaw(scale = 100, decreaseDifference= false){
            let size = 23;
            if (!this.layout.verticalDisplay){
                size = 23 * 2/3 * Math.pow(0.9, Math.log2(this.chGroupCount/4));
            }
            if (decreaseDifference){
                let a = 23/(scale * (1 - Math.log(0.23 * scale)/Math.log(23)));
                // a is the coefficient we are adjusting to make sure the size stays the same at 23 px
                // see https://www.desmos.com/calculator/pb6g2alicm
                return Math.max(Math.pow(size, 1-size/(a*scale)), size * scale/100) * this.settings.size.width/2000 * this.layout.fontSize/100;
            }
            return size * this.settings.size.width/2000 * scale/100 * this.layout.fontSize/100;
        }
    }
}
