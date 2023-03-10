window.appSettingComp = {
    name: "appsetting",
    template: `
        <tr style="width:100%">
            <td>{{title}}</td>
            
            <td v-if="type == 0">
                <input :value="setting" ref="value" @input="updateRgbValue()" data-jscolor="" placeholder="rgba(r, g, b, a)">
            </td>
            <td v-if="type == 1" class="double">
                <input :value="setting" ref="value" @input="updateNumberValue()" type="range" :min="min" :max="max" :step="step"><input :value="stringValue" ref="stringvalue" @input="updateNumberStringValue()" type="text" :placeholder="min + ' - ' + max">
            </td>
            <td v-if="type == 2">
               <input :value="setting" ref="value" @input="updateStringValue()" type="text" :placeholder="placeholder">
            </td>
        </tr>`,
    props: ["setting", "title", "section", "sectionId", "name", "subname", "type", "min", "max", "step", "placeholder", "isfloat", "isdirectory", "auto"],
    computed: {
        stringValue: {
            get: function(){
                if(this.auto){
                    if(this.setting === this.min){
                        return "Auto";
                    }
                }
                return this.setting;
            }
        }
    },
    methods: {
        editSetting(value){
            if(this.subname !== undefined) this.$emit('edit-setting', {
                value: value,
                section: this.sectionId,
                subname: this.subname,
                name: this.name
            });
            else this.$emit('edit-setting', {value: value, section: this.sectionId, name: this.name});
        },
        updateFileValue(){
            this.editSetting(this.$refs.value.value);
        },
        updateStringValue(){
            this.editSetting(this.$refs.value.value);
        },
        updateNumberValue(){
            if(this.isfloat) this.editSetting(parseFloat(this.$refs.value.value));
            else this.editSetting(parseInt(this.$refs.value.value, 10));
        },
        updateRgbValue(){
            this.editSetting(this.$refs.value.value);
        },
        updateNumberStringValue(){
            let value = this.$refs.stringvalue.value
            if (this.isfloat){
                if(!isNaN(parseFloat(value)) && parseFloat(value) !== undefined && parseFloat(value) <= this.min && parseFloat(value) <= this.max){
                    this.editSetting(parseFloat(value));
                }else if(this.auto && isNaN(parseFloat(value))){
                    this.editSetting(parseFloat(this.min));
                }
            }else{
                if(!isNaN(parseInt(value, 10)) && parseInt(value, 10) !== undefined && !(parseInt(value, 10) < this.min || parseInt(value, 10) > this.max)){
                    this.editSetting(parseInt(value, 10));
                }else if(this.auto && isNaN(parseInt(value, 10))){
                    this.editSetting(parseInt(this.min, 10));
                }
            }
        }
    }
}
window.appSettingsGroupComp = {
    name: "appsettingsgroup",
    template: `
        <div class="content">
            <div>
                <button @click="loadDefaultSection(sectionName)">Load Default</button>
                <button @click="setDefaultSection(sectionName)">Save As Default</button>
                <button @click="resetSection(sectionName)">Reset</button>
            </div>
            <h3>{{section.name}}</h3>
            <table>
                <template v-for="(name, index) in Object.keys(section)"
                    v-if="typeof section[name] == 'object'">
                    
                    <template v-if="section[name].type != undefined">
                    
                        <tr :key="index" is="app-setting"
                            v-on:edit-setting="editSetting"
                            :setting="settings[sectionName][name]" 
                            :section="section" :name="name"
                            :section-id="sectionName"
                            :type="section[name].type"
                            :title="section[name].name"
                            :min="section[name].min" :max="section[name].max"
                            :step="section[name].step" :auto="section[name].auto"
                            :isfloat="section[name].isFloat"
                            :placeholder="section[name].placeholder"
                            :isdirectory="section[name].isDirectory" />

                        <tr v-if="section[name].separator"><td><hr></td><td></td></tr>

                    </template>
                    <template v-else>
                        <tr><td><h4>{{section[name].name}}</h4></td><td></td></tr>
                        <template v-for="(subname, subindex) in Object.keys(section[name])"
                                v-if="typeof section[name][subname] == 'object' && section[name][subname].type != undefined">
                            
                            <tr :key="index + '.' + subindex" is="app-setting"
                                v-on:edit-setting="editSetting"
                                :setting="settings[sectionName][name][subname]" 
                                :section="section" :name="name" :subname="subname"
                                :section-id="sectionName"
                                :type="section[name][subname].type"
                                :title="section[name][subname].name"
                                :min="section[name][subname].min" :max="section[name][subname].max"
                                :step="section[name][subname].step" :auto="section[name][subname].auto"
                                :isfloat="section[name][subname].isFloat"
                                :placeholder="section[name][subname].placeholder"
                                :isdirectory="section[name][subname].isDirectory" />

                            <tr v-if="section[name][subname].separator"><td><hr></td><td></td></tr>

                        </template>
                    </template>

                </template>

            </table>
        </div>`,
    props: ["settings", "section-name", "section"],
    components: {
        "app-setting": appSettingComp,
    },
    methods: {
        editSetting(data){
            console.log(data)
            this.$emit('manage', 'edit-setting', data);
        },
        resetSection(section){
            this.$emit('manage', 'reset-section', section);
        },
        loadDefaultSection(section){
            this.$emit('manage', 'load-default-section', section);
        },
        setDefaultSection(section){
            this.$emit('manage', 'set-default-section', section);
        }

    }
}
