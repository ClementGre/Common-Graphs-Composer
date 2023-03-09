window.appSettingComp = {
    name: "appsetting",
    template: `
        <tr style="width:100%">
            <td v-if="type == 3" style="width:100%; padding-bottom: 5px;">
                {{title}}<br>
               <input v-if="!isdirectory" v-bind:value="setting" ref="value" @input="updateFileValue()" type="file" accept=".ged,.gdz">
               <input v-else v-bind:value="setting" ref="value" @input="updateFileValue()" type="file" accept="*" webkitdirectory directory multiple>
            </td>
        
            <td v-else >{{title}}</td>
            <td v-if="type == 0">
                <input v-bind:value="setting" ref="value" @input="updateRgbValue()" data-jscolor="" placeholder="rgba(r, g, b, a)">
            </td>
            <td v-if="type == 1" class="double">
                <input v-bind:value="setting" ref="value" @input="updateNumberValue()" type="range" v-bind:min="min" v-bind:max="max" v-bind:step="step"><input v-bind:value="stringValue" ref="stringvalue" @input="updateNumberStringValue()" type="text" v-bind:placeholder="min + ' - ' + max">
            </td>
            <td v-if="type == 2">
               <input v-bind:value="setting" ref="value" @input="updateStringValue()" type="text" :placeholder="placeholder">
            </td>
        </tr>`,
    props: ["setting", "title", "section", "name", "subname", "type", "min", "max", "step", "placeholder", "isfloat", "isdirectory", "auto"],
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
                section: this.section,
                name: this.name,
                subname: this.subname
            });
            else this.$emit('edit-setting', {value: value, section: this.section, name: this.name});
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
window.appSettingsComp = {
    name: "appsetting",
    template: `
        <div class="pane settings-pane" >
            <div v-for="(section) in Object.keys(settingsdetails)">
                <div class="content">
                    <div>
                        <button @click="loadDefaultSection(section)">Load Default</button>
                        <button @click="setDefaultSection(section)">Save As Default</button>
                        <button @click="resetSection(section)">Reset</button>
                    </div>
                    <h3>{{settingsdetails[section].name}}</h3>
                    <table>
                        <template v-for="(name, index) in Object.keys(settingsdetails[section])"
                            v-if="typeof settingsdetails[section][name] == 'object'">
                            
                            <template v-if="settingsdetails[section][name].type != undefined">
                            
                                <tr v-bind:key="index" is="app-setting" v-if="settingsdetails[section][name].type == 0"
                                    v-bind:setting="settings[section][name]" v-on:edit-setting="editSetting"
                                    v-bind:section="section" v-bind:name="name" v-bind:type="0"
                                    v-bind:title="settingsdetails[section][name].name"/>
                                
                                <tr v-bind:key="index" is="app-setting" v-if="settingsdetails[section][name].type == 1"
                                    v-bind:setting="settings[section][name]" v-on:edit-setting="editSetting"
                                    v-bind:section="section" v-bind:name="name" v-bind:type="1"
                                    v-bind:title="settingsdetails[section][name].name"
                                    v-bind:min="settingsdetails[section][name].min" v-bind:max="settingsdetails[section][name].max"
                                    v-bind:step="settingsdetails[section][name].step" v-bind:auto="settingsdetails[section][name].auto"
                                    v-bind:placeholder="settingsdetails[section][name].placeholder"
                                    v-bind:isfloat="settingsdetails[section][name].isFloat"/>
                                    
                                <tr v-bind:key="index" is="app-setting" v-if="settingsdetails[section][name].type == 2"
                                    v-bind:setting="settings[section][name]" v-on:edit-setting="editSetting"
                                    v-bind:section="section" v-bind:name="name" v-bind:type="2"
                                    v-bind:title="settingsdetails[section][name].name"
                                    v-bind:placeholder="settingsdetails[section][name].placeholder" />
                                    
                                <tr v-bind:key="index" is="app-setting" v-if="settingsdetails[section][name].type == 3"
                                    v-bind:setting="settings[section][name]" v-on:edit-setting="editSetting"
                                    v-bind:section="section" v-bind:name="name" v-bind:type="3"
                                    v-bind:isdirectory="settingsdetails[section][name].isDirectory"
                                    v-bind:title="settingsdetails[section][name].name" />

                                <tr v-if="settingsdetails[section][name].separator"><td><hr></td><td></td></tr>

                            </template>
                            <template v-else>
                                <tr><td><h4>{{settingsdetails[section][name].name}}</h4></td><td></td></tr>
                                <template v-for="(subname, subindex) in Object.keys(settingsdetails[section][name])"
                                        v-if="typeof settingsdetails[section][name][subname] == 'object' && settingsdetails[section][name][subname].type != undefined">
                                
                                    <tr v-bind:key="index + '.' + subindex" is="app-setting" v-if="settingsdetails[section][name][subname].type == 0"
                                        v-bind:setting="settings[section][name][subname]" v-on:edit-setting="editSetting"
                                        v-bind:section="section" v-bind:name="name" v-bind:subname="subname" v-bind:type="0"
                                        v-bind:title="settingsdetails[section][name][subname].name"
                                        v-bind:placeholder="settingsdetails[section][name][subname].placeholder"
                                        v-bind:isfloat="settingsdetails[section][name][subname].isFloat"/>
                                    
                                    <tr v-bind:key="index + '.' + subindex" is="app-setting" v-if="settingsdetails[section][name][subname].type == 1"
                                        v-bind:setting="settings[section][name][subname]" v-on:edit-setting="editSetting"
                                        v-bind:section="section" v-bind:name="name" v-bind:subname="subname" v-bind:type="1"
                                        v-bind:title="settingsdetails[section][name][subname].name"
                                        v-bind:min="settingsdetails[section][name][subname].min" v-bind:max="settingsdetails[section][name][subname].max"
                                        v-bind:step="settingsdetails[section][name][subname].step" v-bind:auto="settingsdetails[section][name][subname].auto"
                                        v-bind:isfloat="settingsdetails[section][name][subname].isFloat"/>
                                        
                                    <tr v-bind:key="index" is="app-setting" v-if="settingsdetails[section][name][subname].type == 2"
                                        v-bind:setting="settings[section][name][subname]" v-on:edit-setting="editSetting"
                                        v-bind:section="section" v-bind:name="name" v-bind:type="2"
                                        v-bind:title="settingsdetails[section][name][subname].name"
                                        v-bind:placeholder="settingsdetails[section][name][subname].placeholder" />
                                        
                                    <tr v-bind:key="index" is="app-setting" v-if="settingsdetails[section][name][subname].type == 3"
                                        v-bind:setting="settings[section][name][subname]" v-on:edit-setting="editSetting"
                                        v-bind:section="section" v-bind:name="name" v-bind:type="3"
                                        v-bind:isdirectory="settingsdetails[section][name][subname].isDirectory"
                                        v-bind:title="settingsdetails[section][name][subname].name" />

                                    <tr v-if="settingsdetails[section][name][subname].separator"><td><hr></td><td></td></tr>

                                </template>
                            </template>

                        </template>

                    </table>
                </div>
            </div>
        </div>`,
    props: ["settings", "settingsdetails"],
    components: {
        "app-setting": appSettingComp,
    },
    methods: {
        editSetting(data){
            this.$emit('edit-setting', data);
        },
        resetSection(section){
            this.$emit('reset-section', section);
        },
        loadDefaultSection(section){
            this.$emit('load-default-section', section);
        },
        setDefaultSection(section){
            this.$emit('set-default-section', section);
        }

    }
}
