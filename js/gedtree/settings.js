window.appSettingComp = {
    name: "appsetting",
    template: `
        <tr style="width:100%">
            <td>{{title}}</td>
            
            <td v-if="type == 0">
                <input :value="setting" ref="value" @input="updateRawValue()" data-jscolor="" placeholder="rgba(r, g, b, a)">
            </td>
            <td v-if="type == 1" class="double">
                <input :value="setting" ref="value" @input="updateNumberValueFromSlider()" type="range" :min="min" :max="max" :step="step"><input :value="numberStringValue" ref="numbervalue" @input="updateNumberValueFromField()" type="text" :placeholder="min + ' - ' + max">
            </td>
            <td v-if="type == 2">
               <input :value="setting" ref="value" @input="updateRawValue()" type="text" :placeholder="placeholder">
            </td>
            <td v-if="type == 3" style="padding-left: 15px">
               <input :checked="setting" ref="value" @input="updateBoolValue()" type="checkbox" style="width: 25px">
            </td>
        </tr>`,
    props: ["setting", "title", "section", "sectionId", "name", "subname", "type", "min", "max", "step", "placeholder", "isfloat", "isdirectory", "auto", "rindex"],
    computed: {
        numberStringValue: {
            get: function(){
                if(this.auto){
                    if(this.setting == this.min){
                        return "Auto";
                    }
                }
                return this.setting;
            }
        }
    },
    methods: {
        editSetting(value){
            if(this.subname !== undefined){
                if(this.rindex !== undefined){
                    this.$emit('edit-setting', {
                        value: value,
                        section: this.sectionId,
                        name: this.name,
                        rindex: this.rindex,
                        subname: this.subname
                    });
                }
                else this.$emit('edit-setting', {
                    value: value,
                    section: this.sectionId,
                    name: this.name,
                    subname: this.subname
                });
            }
            else this.$emit('edit-setting', {value: value, section: this.sectionId, name: this.name});
        },
        updateRawValue(){
            this.editSetting(this.$refs.value.value);
        },
        updateBoolValue(){
            this.editSetting(this.$refs.value.checked);
        },
        updateNumberValueFromSlider(){
            this.updateNumberValue(this.$refs.value.value);
        },
        updateNumberValueFromField(){
            this.updateNumberValue(this.$refs.numbervalue.value);
        },
        updateNumberValue(value){
            if (this.isfloat){
                if(!isNaN(parseFloat(value)) && parseFloat(value) !== undefined && parseFloat(value) >= this.min && parseFloat(value) <= this.max){
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
                    <template v-else-if="section[name].repeat != undefined">
                        <!-- REPEATED SUBSECTION -->
                        <template v-for="rindex in settings[section[name].repeat.section]?.[section[name].repeat.name]">
                            <tr><td><h4>{{section[name].name + ' #' + rindex}}</h4></td><td></td></tr>
                            <template v-for="(subname, subindex) in Object.keys(section[name])"
                                    v-if="typeof section[name][subname] == 'object' && section[name][subname].type != undefined">
                                <tr :key="index + '.' + subindex + '.' + rindex" is="app-setting"
                                    :rindex="rindex"
                                    v-on:edit-setting="editSetting"
                                    :setting="settings[sectionName][name]?.['n' + rindex]?.[subname] ? settings[sectionName][name]['n' + rindex][subname] : section[name][subname].value" 
                                    :section="section" :name="name" :subname="subname"
                                    :section-id="sectionName"
                                    :type="section[name][subname].type"
                                    :title="section[name][subname].name"
                                    :min="section[name][subname].min" :max="section[name][subname].max"
                                    :step="section[name][subname].step" :auto="section[name][subname].auto"
                                    :isfloat="section[name][subname].isFloat"
                                    :placeholder="section[name][subname].placeholder"
                                    :isdirectory="section[name][subname].isDirectory"
                                    v-show="!isRepeatedSectionItemDisabled(name, rindex, subname)"/>
    
                                <tr v-if="section[name][subname].separator"><td><hr></td><td></td></tr>
    
                            </template>
                        </template>
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
                                    :isdirectory="section[name][subname].isDirectory"
                                    v-show="section[name][subname].require ? settings[sectionName][name][section[name][subname].require] : true" />
    
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
        },
        isRepeatedSectionItemDisabled: function(name, rindex, subname){
            if(this.section[name][subname].require){
                if (!this.settings[this.sectionName][name]['n' + rindex]){
                    this.$set(this.settings[this.sectionName][name], 'n' + rindex, {})
                    this.$set(this.settings[this.sectionName][name]['n' + rindex], this.section[name][subname].require, this.section[name][this.section[name][subname].require].value)
                }
                return !this.settings[this.sectionName][name]?.['n' + rindex]?.[this.section[name][subname].require];
            }
            return false;

        }
    }
}
