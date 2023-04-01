window.individualComp = {
    name: "individual",
    template: `
        <div :class="individualClasses" :style="individualStyle">
            <div v-if="layout.verticalDisplay" class="virtual-top"></div>
            <div v-if="layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
            <div v-if="layout.showPictures || layout.verticalDisplay" class="img" :style="imgStyle"></div>
            <div class="content">
                <div class="top">
                    <p class="name" :style="nameStyle">{{firstNames + ' ' + lastName}}</p>
                    <p class="occupation" :style="occupationStyle">{{data?.occupation}}</p>
                </div>
                <div v-if="!layout.verticalDisplay" class="hline" :style="hlineStyle"></div>
                <div class="bottom">
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

            };
        },
        imgStyle: function(){
            let height = 70;
            if (!this.layout.verticalDisplay){
                height = 50 * Math.pow(0.75, Math.log2(this.chGroupCount/4));
            }
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
            };
        },
        occupationStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.occupation.fontSize),
                'font-weight': this.settings.individual.occupation.fontWeight,
                'color': this.settings.individual.occupation.color,
            };
        },
        dateStyle: function(){
            return {
                'font-size': this.getFontSize(this.settings.individual.date.fontSize),
                'font-weight': this.settings.individual.date.fontWeight,
                'color': this.settings.individual.date.color,
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
        }
    },
    methods: {
        convertLength(length){
            // Lengths are expressed in ‰ (per mille) of the width of the tree
            return length/1000 * this.settings.size.width+ 'px';
        },
        getFontSize(scale = 100){
            let size = 23;
            if (!this.layout.verticalDisplay){
                size = 23 * 2/3 * Math.pow(0.9, Math.log2(this.chGroupCount/4));
            }
            return size/2000 * this.settings.size.width * scale/100 + 'px';
        }
    }
}
