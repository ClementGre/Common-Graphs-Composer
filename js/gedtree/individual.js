window.individualComp = {
    name: "individual",
    template: `
        <div :class="individualClasses" :style="individualStyle">
            <div v-if="layout.verticalDisplay" class="virtual-top"></div>
            <div v-if="layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
            <div v-if="isImageVisible" class="img" :style="imgStyle"></div>
            <div class="content" :style="contentStyle">
                <div class="top" :style="topStyle">
                    <p class="name" :style="nameStyle">{{firstNames}} {{lastName}}</p>
                    <p class="occupation" v-if="data?.occupation" :style="occupationStyle">{{data?.occupation}}</p>
                </div>
                <div v-if="!layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
                <div class="bottom" :style="bottomStyle">
                    <p class="datesAndPlaces" :style="datesAndPlacesStyle" v-html="date"></p>
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
                return this.toTitleCase(this.data?.lastName);
            }else if (this.settings.individual.displayName.upperCaseSurname){
                return this.data?.lastName?.toUpperCase();
            }else return this.data?.lastName;
        },
        date: function(){
            let birthDate = this.formatDate(this.data?.birth)
            let birthPlace = this.formatPlace(this.data?.birthPlace)
            let birthSeparator = birthDate && birthPlace ? " - " : ""
            let deathDate = this.formatDate(this.data?.death)
            let deathPlace = this.formatPlace(this.data?.deathPlace)
            let deathSeparator = deathDate && deathPlace ? " - " : ""

            let separator = ""
            if((birthDate || birthPlace) && (deathDate || deathPlace)){
                separator = this.layout.inlineDate ? " ➞ " : "<br>"
            }

            return birthDate + birthSeparator + birthPlace + separator + deathDate + deathSeparator + deathPlace
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
            let url = this.imageUrl;
            return {
                background: 'url("' + url + '") center center/cover no-repeat',
                width: url === undefined && !this.settings.individual.image.keepAlignmentWhenNoImage ? "0" : this.convertLength(height * 0.7),
                height: url === undefined ? 0 : this.convertLength(height),
                border: url === undefined ? "none" : (this.linkLinesWidth * this.settings.individual.image.borderRelativeWidth / 100.0) + 'px solid ' + this.settings.individual.linkLines.color,
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
        datesAndPlacesStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.datesAndPlaces.fontSize, this.settings.individual.datesAndPlaces.decreaseDifference),
                'font-weight': this.settings.individual.datesAndPlaces.fontWeight,
                'color': this.settings.individual.datesAndPlaces.color,
                'margin-top': this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.verticalLayout.occupationDateSpacing) : false,
                'line-height': this.settings.individual.datesAndPlaces.lineHeight + "%",
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
        },
        imageUrl: function(){
            return this.data?.multimediaPaths?.[0]
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
        },
        toTitleCase(str) {
            if(!str) return "";
            return str.toString().replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        },
        formatDate(date){
            const options = {year: 'numeric', month: 'long', day: 'numeric'};
            try{
                return this.toTitleCase(date?.toLocaleDateString(this.settings.individual.dates.formatLanguage, options));
            }catch (e) {
                return this.toTitleCase(date?.toLocaleDateString("en", options));
            }
        },
        formatPlace(place){
            let result = "";
            if(place?.[3] && this.settings.individual.places.showCity) result += this.toTitleCase(place[3]);

            if(place?.[4] && this.settings.individual.places.showDepartment) result += (result ? ", " : "") + this.toTitleCase(place[4]);
            if(place?.[5] && this.settings.individual.places.countryDifferentFrom !== place[5]) result += (result ? ", " : "") + this.toTitleCase(place[5]);
            return result;
        }
    }
}
