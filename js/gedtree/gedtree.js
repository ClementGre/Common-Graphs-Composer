const app = new Vue({
    el: "#app",
    name: "gedtree",
    data: {
        gedcom: null,
        renderData: {

        },
        settings: !get_local_data('gedtree-settings') ? {} : get_local_data('gedtree-settings'),
        settingsDetails: constants.settingsDetails,
        ui: {
            currentTab:  !get_local_data('gedtree-ui-lasttab') ? "settings" : get_local_data('gedtree-ui-lasttab'),
            search_query: "grennerat",
        },
        temp: {
            settingsEditCount: 0,
        },
        dump: "no.."
    },
    created: function(){
        const promise = fetch('example.ged')
            .then(r => r.arrayBuffer())
            .then(Gedcom.readGedcom);

        promise.then(gedcom => {
            this.gedcom = gedcom;
        });
    },
    computed: {
        gedcom_search_html: function(){
            if (this.gedcom === null) return "";

            let query = this.ui.search_query;
            let data = "";
            if(query.length >= 3){
                const results = this.search_someone(query);
                for (let i = 0; i < results.length; i++) {
                    let result = results.arraySelect()[i];
                    data += result.getName().valueAsParts()[0][0] + " " + result.getName().valueAsParts()[0][1] +  " (" + gedDateToString(result.getEventBirth().getDate()) + ") <br>";
                }
            }
            return data;
        },
    },
    methods: {
        search_someone(query){
            const tokenize = name => name.trim().toLowerCase().split(/ +/);
            const queryTokens = tokenize(query);

            return this.gedcom.getIndividualRecord().filterSelect(individual => {
                const names = individual.getName().valueAsParts()[0];
                if(names !== null) {
                    const namesTokens = names.filter(v => v).flatMap(tokenize);
                    return queryTokens.every(s => namesTokens.some(n => utf8ToAscii(n.toLowerCase()).includes(utf8ToAscii(s.toLowerCase()))));
                }
                return false;
            });
        },

        //     SETTINGS
        manageSettings: function(action, data){
            switch (action) {
                case "edit-setting":
                    this.editSetting(data);
                    break;
                case "reset-section":
                    this.resetSection(data);
                    break;
                case "load-default-section":
                    this.loadDefaultSection(data);
                    break;
                case "set-default-section":
                    this.setDefaultSection(data);
                    break;
            }
        },
        editSetting: function(data){
            if(data.subname !== undefined){
                if(data.rindex !== undefined){
                    if(!this.settings[data.section][data.name]['n' + data.rindex]) this.settings[data.section][data.name]['n' + data.rindex] = {};
                    this.$set(this.settings[data.section][data.name]['n' + data.rindex], data.subname, data.value);
                }
                else this.$set(this.settings[data.section][data.name], data.subname, data.value);
            }
            else this.$set(this.settings[data.section], data.name, data.value);
            this.saveSettings()
        },
        saveSettings: function() {
            this.temp.settingsEditCount++;
            const lastEditCount = this.temp.settingsEditCount;
            setTimeout(() => {
                if (lastEditCount === this.temp.settingsEditCount) {
                    set_local_data('gedtree-settings', this.settings);
                }
            }, 1000);
        },
        resetSection: function(section){
            this.settings[section] = this.generateSettings(this.settingsDetails[section]);
            setTimeout(() => {
                $.each($("main .panel .pane input[data-jscolor]"), function(index, element){
                    element.jscolor.fromString($(element).val()); // Update for JSColor
                });
            }, 0);
        },
        loadDefaultSection: function(section){
            const data = get_local_data('gedtree-settings-' + section);
            if(!data) this.settings[section] = this.generateSettings(this.settingsDetails[section]);
            else this.settings[section] = data;
            setTimeout(() => {
                $.each($("main .panel .pane input[data-jscolor]"), function(index, element){
                    element.jscolor.fromString($(element).val()); // Update for JSColor
                });
            }, 0);
        },
        setDefaultSection: function(section){
            set_local_data('gedtree-settings-' + section, this.settings[section]);
            displayCheckFloater();
        },
        generateSettings: function(source){
            const result = {};
            Object.keys(source).forEach(name => {
                if(typeof source[name] == 'object'){
                    if(source[name].type !== undefined){
                        result[name] = source[name].value;
                    }else{
                        result[name] = this.generateSettings(source[name]);
                    }
                }
            });
            return result;
        },
    },
    watch: {
        settings: {
            immediate: true,
            handler: function(){
                if(_.isEmpty(this.settings)) this.settings = this.generateSettings(this.settingsDetails);
            }
        },
        'ui.currentTab': {
            handler: function(val){
                set_local_data('gedtree-ui-lasttab', val);
            }
        },

    },
    components: {
        "app-settings-group": appSettingsGroupComp,
    }
});
