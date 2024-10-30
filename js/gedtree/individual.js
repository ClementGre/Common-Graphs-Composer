window.individualComp = {
    name: "individual",
    template: `
        <div :class="individualClasses" :style="individualStyle" @click="selectIndividual">
            <div v-if="layout.verticalDisplay" class="virtual-top"></div>
            <div v-if="layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
            <div v-if="doShowImage" class="img" :style="imgStyle"></div>
            <div class="content" :style="contentStyle">
                <div class="top" :style="topStyle">
                    <p class="name" :style="nameStyle">{{firstNames}} <span :style="lastNameStyle">{{lastName}}</span></p>
                    <p class="occupation" v-if="data?.occupation" :style="occupationStyle">{{data?.occupation}}</p>
                </div>
                <div v-if="!layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
                <div class="bottom" :style="bottomStyle">
                    <p class="datesAndPlaces" :style="datesAndPlacesStyle" v-html="date"></p>
                </div>
            </div>
        </div>
        `,
    props: ["gedcom", "settings", "data", "gedcom_data", "layout", "individualCount", "hasChild", "hasParents", "selected"],
    emits: ['update-selected'],
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
                selected: this.selected?.id === this.data?.id,
            };
        },
        individualStyle: function(){
            // The left padding is either the one of the image if an image is visible or should be with the
            // keepAlignmentWhenNoImage option, or the text left margin.
            const has_gap = this.isImageVisible || (this.doShowImage && this.settings.individual.image.keepAlignmentWhenNoImage);
            return this.layout.verticalDisplay ? {} : {
                'padding-left': this.convertMargin(this.doShowImage
                    ? this.settings.margins.horizontalLayout.imageLeftMargin
                    : this.settings.margins.horizontalLayout.textLeftMargin),
                'gap': has_gap ? this.convertMargin(this.settings.margins.horizontalLayout.textLeftMargin) : 0,
            };
        },
        contentStyle: function(){
            return {
                gap: !this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.horizontalLayout.linkLineMargin*2) : 0,
            };
        },
        topStyle: function(){
            return {
                gap: !this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.horizontalLayout.nameOccupationSpacing) : 0,
            };
        },
        bottomStyle: function(){
            return {
            };
        },
        imgStyle: function(){
            return {
                background: this.settings.decoration.background.backgroundColor + ' url("' + this.imageUrl + '") center center/cover no-repeat',
                width: !this.isImageVisible && !this.settings.individual.image.keepAlignmentWhenNoImage ? "0" : this.convertLength(this.getImageWidth()),
                height: !this.isImageVisible ? 0 : this.convertLength(this.getImageHeight()),
                border: !this.isImageVisible ? "none" : (this.linkLinesWidth * this.settings.individual.image.borderRelativeWidth / 100.0) + 'px solid ' + this.settings.individual.linkLines.color,
            };
        },
        nameStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.displayName.fontSize),
                'letter-spacing': this.getLetterSpacing(this.settings.individual.displayName.letterSpacing),
                'font-weight': this.settings.individual.displayName.fontWeight,
                'color': this.settings.individual.displayName.color,
                'width': this.layout.forceWrapOccupation ? '100%' : false,
                'margin-top': this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.verticalLayout.imageNameSpacing) : 0,
            };
        },
        lastNameStyle: function(){
            return {
                'font-variant-caps': this.settings.individual.displayName.smallCapsSurname ? 'small-caps' : 'normal',
            };
        },
        occupationStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.occupation.fontSize, this.settings.individual.occupation.decreaseDifference),
                'letter-spacing': this.getLetterSpacing(this.settings.individual.occupation.letterSpacing),
                'font-weight': this.settings.individual.occupation.fontWeight,
                'color': this.settings.individual.occupation.color,
                'margin-top': this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.verticalLayout.nameOccupationSpacing) : 0,
            };
        },
        datesAndPlacesStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.datesAndPlaces.fontSize, this.settings.individual.datesAndPlaces.decreaseDifference),
                'letter-spacing': this.getLetterSpacing(this.settings.individual.datesAndPlaces.letterSpacing),
                'font-weight': this.settings.individual.datesAndPlaces.fontWeight,
                'color': this.settings.individual.datesAndPlaces.color,
                'margin-top': this.layout.verticalDisplay ? this.convertMargin(this.settings.margins.verticalLayout.occupationDateSpacing) : 0,
                'line-height': this.settings.individual.datesAndPlaces.lineHeight + "%",
            };
        },
        hlineStyle: function(){
            let rightShift = !this.hasParents ? this.convertMargin(60) : '0px'
            let width = 'calc(100% - ' + this.linkLinesWidth + 'px - ' + rightShift + ')'
            if (!this.hasChild) {
                if(this.layout.verticalDisplay) width = 'calc(50% - ' + this.linkLinesWidth + 'px - ' + rightShift + ')'
                else{
                    if(this.isImageVisible){
                        // Has a visible image
                        width = 'calc(100% - ' + this.linkLinesWidth + 'px - '
                            + this.convertMargin(this.settings.margins.horizontalLayout.imageLeftMargin)
                            + ' - ' + this.convertLength(this.getImageWidth()/2) + ' - ' + rightShift + ')'
                    }else if(this.doShowImage && this.settings.individual.image.keepAlignmentWhenNoImage){
                        // Has no image but have the left padding
                        width = 'calc(100% - ' + this.linkLinesWidth + 'px - '
                            + this.convertMargin(this.settings.margins.horizontalLayout.imageLeftMargin)
                            + ' - ' + this.convertLength(this.getImageWidth()) + ' - ' + rightShift + ')'
                    }else{
                        width = 'calc(100% - ' + this.linkLinesWidth + 'px - '
                            + this.convertMargin(this.settings.margins.horizontalLayout.textLeftMargin)
                            + ' - ' + rightShift + ')'
                    }

                }
            }
            return {
                'right': 'calc(' + this.linkLinesWidth/2 + 'px + ' + rightShift + ')',
                'width': width,
                'border-bottom': this.linkLinesWidth + 'px solid ' + this.settings.individual.linkLines.color,
            };
        },
        linkLinesWidth: function () {
            // Returns an even number of pixels so it can be divided by 2 safely
            return Math.ceil(this.settings.individual.linkLines.width / 1000 * this.settings.size.width / 2) * 2;
        },
        doShowImage: function(){
            return this.layout.showPictures || this.layout.verticalDisplay;
        },
        isImageVisible: function(){
            return this.doShowImage && this.imageUrl !== undefined;
        },
        imageUrl: function(){
            return this.data?.picturePath
        }
    },
    methods: {
        getImageHeight(){
            let height = 70;
            if (!this.layout.verticalDisplay){
                height = 50 * Math.pow(0.75, Math.log2(this.individualCount/8));
            }
            return height * this.layout.pictureSize/100;
        },
        getImageWidth(){
            return this.getImageHeight() * 0.7;
        },
        convertLength(length){
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length/1000 * this.settings.size.width + 'px';
        },
        convertMargin(length){
            // Margins depends on the font size (expressed in per fifty of font size in px)
            return length * this.getFontSizeRaw()/50 + 'px';
        },
        getFontSize(scale = 100, decreaseDifference= false){
            return this.getFontSizeRaw(scale, decreaseDifference) + 'px';
        },
        getLetterSpacing(font_spacing){
            return (font_spacing / 100.0) + 'em';
        },
        getFontSizeRaw(scale = 100, decreaseDifference= false){
            let size = 23;
            if (!this.layout.verticalDisplay){
                size = 23 * 2/3 * Math.pow(0.9, Math.log2(this.individualCount/8));
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
            if(!place) return ""

            let format = this.settings.individual.places.placeFormat;
            const  gedcom_format = this.gedcom_data.place_format;
            let last_replace_length = 0;
            let is_last_empty = false;
            let result = "";

            while(format.length > 0){
                let i = gedcom_format.findIndex(f => format.startsWith(f))
                if(i !== -1){
                    format = format.substring(gedcom_format[i].length);
                    if(!place[i]
                        || (gedcom_format[i] === this.settings.individual.places.countryKey
                                        && this.settings.individual.places.countryDifferentFrom === place[i])
                        || (gedcom_format[i] === this.settings.individual.places.departmentKey
                            && this.settings.individual.places.departmentDifferentFrom === place[i])){

                        // Removing characters between the last replacement
                        result = result.substring(0, last_replace_length)
                        is_last_empty = true;
                    }else{
                        result += place[i]
                        is_last_empty = false;
                    }
                    last_replace_length = result.length
                }else{
                    if (!is_last_empty) result += format.charAt(0);
                    format = format.substring(1);
                }
            }

            return result;
        },
        selectIndividual(e){
            e.stopPropagation();
            this.$emit('update-selected', this.data)
        }
    }
}
