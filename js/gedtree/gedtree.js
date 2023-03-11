const app = new Vue({
    el: "#app",
    name: "gedtree",
    data: {
        gedcom: null,
        renderData: {},
        settings: !get_local_data('gedtree-settings') ? {} : get_local_data('gedtree-settings'),
        settingsDetails: constants.settingsDetails,
        ui: {
            currentTab:  !get_local_data('gedtree-ui-lasttab') ? "settings" : get_local_data('gedtree-ui-lasttab'),
            search_query: "",
        },
        temp: {
            settingsEditCount: 0,
        }
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
        gedcom_search: function(){
            if (this.gedcom === null) return "";

            let query = this.ui.search_query;
            let data = [];
            if(query.length >= 3){
                return this.gedcom_search_structured(query);
            }
            return data;
        },
        rootIndividual: function(){
            if (this.gedcom === null) return null;
            return this.gedcom.getIndividualRecord(this.settings.hidden.rootIndividualId).arraySelect()[0];
        },
        gedcomStructuredData: function(){
            if(!this.rootIndividual) return null;

            let leftCols = {
                count: this.settings.size.leftColumns,
                ...this.settings.columns.leftColumns
            }
            let middleCol = {
                ...this.settings.columns.middleColumn
            }
            let rightCols = {
                count: this.settings.size.rightColumns,
                ...this.settings.columns.rightColumn
            }
            return structureGedcomData(this.gedcom, this.settings.hidden.rootIndividualId, leftCols, middleCol, rightCols);
        }
    },
    methods: {
        gedcom_search_structured(query){
            const tokenize = name => name.trim().toLowerCase().split(/ +/);
            const queryTokens = tokenize(query);

            let individuals = this.gedcom.getIndividualRecord().filterSelect(individual => {
                const names = individual.getName().valueAsParts()[0];
                if(names !== null) {
                    const namesTokens = names.filter(v => v).flatMap(tokenize);
                    return queryTokens.every(s => namesTokens.some(n => utf8ToAscii(n.toLowerCase()).includes(utf8ToAscii(s.toLowerCase()))));
                }
                return false;
            });

            let results = [];
            for (let i = 0; i < individuals.length; i++) {
                let result = individuals.arraySelect()[i];
                results.push({
                    lastname: result.getName().valueAsParts()[0][1].toUpperCase(),
                    firstname: result.getName().valueAsParts()[0][0],
                    birth: getDateToJSDate(result.getEventBirth().getDate())?.getFullYear(),
                    death: getDateToJSDate(result.getEventDeath().getDate())?.getFullYear(),
                    pointer: result.pointer()[0],
                });
            }
            return results;
        },
        select_root_individual: function(pointer){
            this.ui.search_query = "";
            this.settings.hidden.rootIndividualId = pointer;
            this.saveSettings();
        },
        format_individual_name: function(individual){
            if (!individual) return undefined;
            return individual.getName().valueAsParts()[0][1].toUpperCase() + ' ' + individual.getName().valueAsParts()[0][0];
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
        "tree": treeComp,
    }
});
