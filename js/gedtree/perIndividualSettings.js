window.perIndividualSettingsComp = {
    name: "perindividualsettings",
    template: `
        <div class="pane individual-pane wide" >
            <div class="pane-filter" v-if="!selected">
                <div><h3>Click on someone to edit it specifically</h3></div>
            </div>
            <div class="content">
                <h3>Overwrite font size and letter spacing</h3>
                <table>
                    <tr>
                        <td>Font size multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.fontSize"><input type="text" v-model="sizes.fontSize"></td>
                    </tr>
                    <tr>
                        <td>Name font multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.nameFontSize"><input type="text" v-model="sizes.nameFontSize"></td>
                    </tr>
                    <tr>
                        <td>Occupation font multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.occupationFontSize"><input type="text" v-model="sizes.occupationFontSize"></td>
                    </tr>
                    <tr>
                        <td>Birth font multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.birthFontSize"><input type="text" v-model="sizes.birthFontSize"></td>
                    </tr>
                    <tr>
                        <td>Death font multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.deathFontSize"><input type="text" v-model="sizes.deathFontSize"></td>
                    </tr>
                    <tr>
                        <td><hr></td><td></td>
                    </tr>
                    <tr>
                        <td>Name letter spacing (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.nameLetterSpacing"><input type="text" v-model="sizes.nameLetterSpacing"></td>
                    </tr>
                    <tr>
                        <td>Occupation font multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.occupationLetterSpacing"><input type="text" v-model="sizes.occupationLetterSpacing"></td>
                    </tr>
                    <tr>
                        <td>Birth font multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.birthLetterSpacing"><input type="text" v-model="sizes.birthLetterSpacing"></td>
                    </tr>
                    <tr>
                        <td>Death font multiplier (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="sizes.deathLetterSpacing"><input type="text" v-model="sizes.deathLetterSpacing"></td>
                    </tr>
                    </table>
                </div>
            <div class="content">
                <h3>Overwrite content text</h3>
                <table>
                    <tr>
                        <td>Original first name</td>
                        <td>{{ individual?.getName().valueAsParts()[0][0] }}</td>
                    </tr>
                    <tr>
                        <td>Override first name</td>
                        <td><input type="text" v-model="texts.overrideFirstName"></td>
                    </tr>
                    <tr>
                        <td>Original last name</td>
                        <td>{{ individual?.getName().valueAsParts()[0][1] }}</td>
                    </tr>
                    <tr>
                        <td>Override last name</td>
                        <td><input type="text" v-model="texts.overrideLastName"></td>
                    </tr>
                    <tr>
                        <td>Original occupation</td>
                        <td>{{ individual?.getAttributeOccupation()[0]?.value }}</td>
                    </tr>
                    <tr>
                        <td>Override occupation</td>
                        <td><input type="text" v-model="texts.overrideOccupation"></td>
                    </tr>
                    <tr>
                        <td>Original birth date</td>
                        <td>{{ birthDate }}</td>
                    </tr>
                    <tr>
                        <td>Original birth place</td>
                        <td class="location-container"><div v-for="item in individual?.getEventBirth()?.getPlace()?.valueAsParts()?.[0]">{{item}}</div></td>
                    </tr>
                    <tr>
                        <td>Override birth</td>
                        <td><input type="text" v-model="texts.overrideBirth"></td>
                    </tr>
                    <tr>
                        <td>Original death date</td>
                        <td>{{ deathDate }}</td>
                    </tr>
                    <tr>
                        <td>Original death place</td>
                        <td>{{ individual?.getEventDeath()?.getPlace()?.valueAsParts()?.[0]?.join(" ") }}</td>
                    </tr>
                    <tr>
                        <td>Override death</td>
                        <td><input type="text" v-model="texts.overrideDeath"></td>
                    </tr>
                </table>
            </div>
            <div class="content">
                <h3>Picture scale/position</h3>
                <table>
                    <tr>
                        <td>Scale (%)</td>
                        <td class="double"><input type="range" min="0" max="200" step="1" v-model="picture.scale"><input type="text" v-model="picture.scale"></td>
                    </tr>
                    <tr>
                        <td>X (%)</td>
                        <td class="double"><input type="range" min="-100" max="100" step="1" v-model="picture.x"><input type="text" v-model="picture.x"></td>
                    </tr>
                    <tr>
                        <td>Y (%)</td>
                        <td class="double"><input type="range" min="-100" max="100" step="1" v-model="picture.y"><input type="text" v-model="picture.y"></td>
                    </tr>
                    <tr>
                        <td><hr></td><td></td>
                    </tr>
                </table>
                <h3>Select picture</h3>
                <table>
                    <tr>
                        <td>Override picture path</td>
                        <td><input type="text" v-model="picture.path"></td>
                    </tr>
                    <tr>
                        <td>{{availablePictures}}</td>
                    </tr>
                </table>
            </div>
        </div>`,
    props: ["ind-settings", "selected", "gedcom", "settings"],
    emits: ["update-ind-settings"],
    data: function () {
        return {
            individual: undefined,
            sizes: {
                fontSize: 100,
                nameFontSize: 100,
                occupationFontSize: 100,
                birthFontSize: 100,
                deathFontSize: 100,
                nameLetterSpacing: 100,
                occupationLetterSpacing: 100,
                birthLetterSpacing: 100,
                deathLetterSpacing: 100,
            },
            texts: {
                overrideFirstName: "",
                overrideLastName: "",
                overrideOccupation: "",
                overrideBirth: "",
                overrideDeath: "",
            },
            picture: {
                path: "",
                scale: 100,
                x: 50,
                y: 50
            }
        };
    },
    watch: {
        selected: function (val) {
            this.individual = this.gedcom?.getIndividualRecord(val?.id)?.arraySelect()[0];
        }
    },
    computed: {
        birthDate: function () {
            return this.formatDate(getDateToJSDate(this.individual?.getEventBirth().getDate()));
        },
        deathDate: function () {
            return this.formatDate(getDateToJSDate(this.individual?.getEventDeath().getDate()));
        },
        availablePictures: function () {
            return this.individual?.getMultimedia()?.getMultimediaRecord().getFileReference()?.value()
        }
    },
    methods: {
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
        }
    }
}
