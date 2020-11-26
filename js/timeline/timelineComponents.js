window.appEventComp = {
    name: "appevent",
    template: `
        <div v-bind:class="'event event-' + index" v-bind:style="'margin-left:' + getshiftpx() + 'px;' + 
            'margin-bottom:' + (getMarginBottom(yearindex, yearindex-1, yearpx, marginright, settings, years, index, true)+settings.events.margin) + 'px;' +
            'width: ' + settings.events.width + 'px;' +
            'padding: ' + settings.events.padding + 'px;' +
            'border-radius: ' + settings.events.borderRadius + 'px;' +
            'backgroundColor: ' + settings.events.backgroundColor + ';' +
            'width: ' + settings.events.width + 'px;' + 
            (isSelected(ui, event.index, years[yearindex]) ? ('box-shadow:inset 0px 0px 0px 2px #81b3ff;' ): '')"
            @click="selectEvent(years[yearindex], index)">

            <div style="position: relative; width: 0; height: 0; display: block;">
                <div class="linker" v-bind:style="'background-color:' + settings.events.linkerColor + ';' +
                    'width:' + settings.events.linkerWidth + 'px;' +
                    'left: -' + (settings.events.padding+(settings.events.linkerWidth/2.0)) + 'px;'"></div>
            </div>

            <h4 class="title" v-bind:style="'color :' + settings.events.title.color + ';' + 
                'font-size :' + settings.events.title.fontSize + 'px;' + 
                'font-weight :' + settings.events.title.fontWeight + ';'">{{event.title}}</h4>
            <h4 class="date" v-bind:style="'color :' + settings.events.date.color + ';' + 
                'font-size :' + settings.events.date.fontSize + 'px;' + 
                'font-weight :' + settings.events.date.fontWeight + ';'">{{event.date}}</h4>
            <p class="description" v-bind:style="'color :' + settings.events.description.color + ';' + 
                'font-size :' + settings.events.description.fontSize + 'px;' + 
                'font-weight :' + settings.events.description.fontWeight + ';' +
                'white-space: pre-line;'">{{event.description}}</p>
        </div>`,
    props: ["index", "event", "yearindex", "yearpx", "marginright", "settings", "years", "ui"],
    methods: {
        isSelected: function(ui, index, year) {
            return ui.fullScreen == false && ui.selectedType === 0 && ui.selectedYear === year && ui.selectedIndex === index;
        },
        getshiftpx: function() {
            this.shiftPx = this.yearpx / 12.0 * (this.event.month-1);
            return this.shiftPx;
        },
        getMarginBottom(yearIndex, lastYearIndex, yearpx, marginRight, settings, years, index, canSkip){
            //console.log("----- PROCESS EVENT " + index + " WITH A SHIFT OF " + (yearIndex-lastYearIndex) + " -----")

            if(years[lastYearIndex] == undefined) return 0; // If this is the last year, we dont have any constraint
            var finalMarginRight = marginRight - settings.events.width - this.shiftPx + yearpx; // space between end of this event and start of the next

            // If the space between the end of this event and the start of the next year is > min event margin : we can ignore this process : no margin bottom
            if(finalMarginRight > settings.events.minMargin) return 0;

            // Calculate the height of this event
            var eventStartHeight = 0; // length between the bottom of this event and the top of the timeline
            var eventHeight = settings.events.margin; // height of the event Box With margin bottom
            $(".timeline .events .year-" + years[yearIndex] + " .event").each((i, item) => { // Foreach bottom events, increment the eventStartHeight
                if(this.getEventIndex($(item)) < index){ // Loop event is at the BOTTOM of current event
                    eventStartHeight += this.getEventFullHeight($(item)); // Increment eventStartHeight
                }else if(this.getEventIndex($(item)) == index){ // Loop event is SAME as current event
                    eventHeight += $(item).height()+(2*settings.events.padding); // define eventHeight (we add 10 witch is the padding)
                }
            });

            // SKIP UNDER THE LAST YEAR SECTION (next year)
            // OR
            // ADD MARGIN BOTTOM TO BE ABOVE LAST YEAR EVENTS

            // canSkip : 
            var marginBottom = 0; // Future marginBottom
            var lastYearHeight = 0; // Height increamented bit by bit when the foreach occurs
            var skip = false; // Skip = move under the lastYear events. When skip == true, 
            $(".timeline .events .year-" + years[lastYearIndex] + " .event").each((i, item) => { // Foreach last year event
                ///// SKIP UNDER SYSTEM ///// (Only occurs at the first iteration)
                if(skip) return; // When skip == true, we return definitively so we leave the each loop.
                // i == 0 : We can decide to skip only with the bottom event : with his margin bottom.
                // eventHeight > settings.events.margin : The event height needs to don't have the default value to measure if the free height is enough.
                // canSkip : can be false when a skip is canceled (by re-call) when the width is too small (not enough space)
                if(i == 0 && eventHeight > settings.events.margin && canSkip){ // This event can skip under
                    // The margin bottom of the last bottom event is bigger than the event height + others same year events that has maybe already skipped.
                    // (If others same year event has already skipped, we need to take them in account).
                    // We have to take in account the top margin of the event
                    if(this.getMargin($(item), "Bottom") >= (eventHeight-settings.events.margin+settings.events.minMargin)+eventStartHeight+settings.events.minMargin){ // This event can skip -> process skiping under
                        skip = true; return; // Set skip to true : cancel all process of the each loop since a skip will occurs
                    }
                }

                ///// ADD MARGIN TO BE ABOVE SYSTEM /////
                lastYearHeight += this.getEventFullHeight($(item)); // Increment lastYearHeight with the event height (measure the lsstYear events height)
                // When the height of the lastYear is higher than the event start height, this mind there is not enought space for the current event
                // When this condition is true, all the nexts of the loop will be logicaly true too.
                if(lastYearHeight >= eventStartHeight){
                    if(finalMarginRight < settings.events.minMargin){ // There is not enought place only if the space between the end of this event and the start of the next year is < minMargin
                        marginBottom += this.getEventFullHeight($(item)); // Increment marginBottom with the height of the loop event.
                    }
                }
            });
            // if this is not the bottom event and marginBootom != 0, this means the last event has skipped but no this one (Only the bottom event can has margin bottom)
            // So we remove the eventStartHeight (= height of all under events) to the marginBottom
            if(index != 0 && marginBottom != 0) marginBottom -= eventStartHeight;
            // If we have skipped under, we repeat the action to check if there is enough place :
            // YES : Try to skip one more year
            // NO : cancel the skipping (next line)
            if(skip) return this.getMarginBottom(yearIndex, lastYearIndex-1, yearpx, marginRight+this.getYearFreeWidth(years[lastYearIndex]), settings, years, index, true);
            // case of NO : when a skip has occured and the marginBottom != 0
            // if marginBottom != 0, this means the function has added a margin bottom so there is not enough space to enter 
            if(marginBottom != 0 && yearIndex-1 != lastYearIndex) return this.getMarginBottom(yearIndex, yearIndex-1, yearpx, marginRight, settings, years, index, false);
            return marginBottom;
        },
        getMargin(element, side){
            return parseInt(element.css("margin" + side).replace('px', ''));
        },
        getPadding(element, side){
            return parseInt(element.css("padding" + side).replace('px', ''));
        },
        getEventFullHeight(element){
            return element.height() + this.getMargin(element, "Bottom") + this.getPadding(element, "Bottom") + this.getPadding(element, "Top");
        },
        getEventIndex(element){
            return parseInt(element.attr('class').replace('event event-', ''));
        },
        getYearFreeWidth(year){
            return $(".timeline .events .year-" + year).width() + parseInt(this.getMargin($(".timeline .events .year-" + year), "Right"));
        },
        selectEvent(year, index){
            this.$emit('select-event', year, index);
        }
    },
    data:  () => {
        return {
            shiftPx: 0,
        }
    },
}
window.appPeriodComp = {
    name: "appperiod",
    template: `
        <div v-bind:class="'period period-' + index" v-bind:style="'margin-left:' + getshiftpx() + 'px;' + 
            'margin-top:' + (getMarginTop(yearindex, yearindex-1, yearpx, marginright, settings, years, index, true)+settings.events.margin) + 'px;' +
            'width: ' + settings.events.width + 'px;' +
            'padding: ' + settings.events.padding + 'px;' +
            'border-radius: ' + settings.events.borderRadius + 'px;' +
            'backgroundColor: ' + settings.events.backgroundColor + ';' +
            'width: ' + getWidth() + 'px;' + 
            (isSelected(ui, event.index, years[yearindex]) ? ('box-shadow:inset 0px 0px 0px 2px #81b3ff;' ): '')"
            @click="selectEvent(years[yearindex], index)">

            <h4 class="title" v-bind:style="'color :' + settings.events.title.color + ';' + 
                'font-size :' + settings.events.title.fontSize + 'px;' + 
                'font-weight :' + settings.events.title.fontWeight + ';'">{{event.title}}</h4>
            <h4 class="date" v-bind:style="'color :' + settings.events.date.color + ';' + 
                'font-size :' + settings.events.date.fontSize + 'px;' + 
                'font-weight :' + settings.events.date.fontWeight + ';'">{{event.date}} - {{event.enddate}}</h4>
            <p class="description" v-bind:style="'color :' + settings.events.description.color + ';' + 
                'font-size :' + settings.events.description.fontSize + 'px;' + 
                'font-weight :' + settings.events.description.fontWeight + ';' +
                'white-space: pre-line;'">{{event.description}}</p>
        </div>`,
    props: ["index", "event", "yearindex", "yearpx", "marginright", "settings", "years", "ui"],
    methods: {
        isSelected: function(ui, index, year) {
            return ui.fullScreen == false && ui.selectedType === 1 && ui.selectedYear === year && ui.selectedIndex === index;
        },
        getshiftpx: function() {
            this.shiftPx = this.yearpx / 12.0 * (this.event.month-1);
            return this.shiftPx;
        },
        getWidth: function(){
            return this.event.yearsLength*this.yearpx - this.yearpx/12.0*(this.event.month-1) + this.yearpx/11.0*(this.event.endmonth-1);
        },
        getMarginTop(yearIndex, lastYearIndex, yearpx, marginRight, settings, years, index, canSkip){
            if(years[yearIndex] == 1810) console.log("----- PROCESS EVENT " + index + " WITH A SHIFT OF " + (yearIndex-lastYearIndex) + " -----")

            if(years[lastYearIndex] == undefined) return 0; // If this is the last year, we dont have any constraint
            var finalMarginRight = marginRight - this.getWidth() - this.shiftPx + yearpx; // space between end of this event and start of the next
            
            // If the space between the end of this event and the start of the next year is > min event margin : we can ignore this process : no margin bottom
            if(finalMarginRight > settings.events.minMargin) return 0;

            // Calculate the height of this event
            var eventStartHeight = 0; // length between the bottom of this event and the top of the timeline
            var eventHeight = settings.events.margin; // height of the event Box With margin bottom
            $(".timeline .periods .year-" + years[yearIndex] + " .period").each((i, item) => { // Foreach bottom events, increment the eventStartHeight
                if(this.getEventIndex($(item)) > index){ // Loop event is at the BOTTOM of current event
                    eventStartHeight += this.getEventFullHeight($(item)); // Increment eventStartHeight
                }else if(this.getEventIndex($(item)) == index){ // Loop event is SAME as current event
                    eventHeight += $(item).height()+(2*settings.events.padding); // define eventHeight (we add 10 witch is the padding)
                }
            });
            //if(years[yearIndex] == 1810) console.log("" +);

            // SKIP UNDER THE LAST YEAR SECTION (next year)
            // OR
            // ADD MARGIN BOTTOM TO BE ABOVE LAST YEAR EVENTS

            // canSkip : 
            var marginBottom = 0; // Future marginBottom
            var skip = false; // Skip = move under the lastYear events. When skip == true, 
            $(".timeline .periods .year-" + years[lastYearIndex] + " .period").each((i, item) => { // Foreach last year event
                if(years[yearIndex] == 1812) console.log("LOOP " + years[lastYearIndex]);
                ///// SKIP UNDER SYSTEM ///// (Only occurs at the first iteration)
                if(skip) return; // When skip == true, we return definitively so we leave the each loop.
                // i == 0 : We can decide to skip only with the bottom event : with his margin bottom.
                // eventHeight > settings.events.margin : The event height needs to don't have the default value to measure if the free height is enough.
                // canSkip : can be false when a skip is canceled (by re-call) when the width is too small (not enough space)
                if(i == 0 && eventHeight >= settings.events.minMargin && canSkip){ // This event can skip under
                    // The margin bottom of the last bottom event is bigger than the event height + others same year events that has maybe already skipped.
                    // (If others same year event has already skipped, we need to take them in account).
                    // We have to take in account the top margin of the event
                    if(this.getMargin($(item), "Top") >= (eventHeight-settings.events.margin+settings.events.minMargin)+eventStartHeight+settings.events.minMargin){ // This event can skip -> process skiping under
                        skip = true; return; // Set skip to true : cancel all process of the each loop since a skip will occurs
                    }
                }
            });


            if(skip == false){

                var pxToCheck = this.getWidth() + this.shiftPx + settings.events.minMargin;

                $(".timeline .periods .year").each((i, yearItem) => {
                    var year = $(yearItem).attr('class').replace("year year-", "");

                    if(year <= years[yearIndex] || (pxToCheck - (year-years[yearIndex])*yearpx) <= 0) return;
                    pxToCheck -= yearpx;

                    var lastYearHeight = 0;
                    
                    $(".timeline .periods .year-" + year + " .period").each((i, item) => {
                        lastYearHeight += this.getEventFullHeight($(item));
                        if(years[yearIndex] == 1810) console.log("lastYearHeight += " + this.getEventFullHeight($(item)) );
                        if(lastYearHeight >= eventStartHeight+marginBottom){
                            if(finalMarginRight < settings.events.minMargin){
                                if(years[yearIndex] == 1810) console.log("add from " + year + "-" + i + " : " + eventStartHeight);
                                if(years[yearIndex] == 1810) console.log("marginBottom now = " + (lastYearHeight - (eventStartHeight+marginBottom)));
                                marginBottom = (lastYearHeight);
                            }
                        }
                    });
                    
                });
            }



            if(years[yearIndex] == 1812) console.log("SKIPPED " + skip + " - MARGIN TOP " + marginBottom );
            // if this is not the bottom event and marginBootom != 0, this means the last event has skipped but no this one (Only the bottom event can has margin bottom)
            // So we remove the eventStartHeight (= height of all under events) to the marginBottom
            if(index != 0 && marginBottom != 0) marginBottom -= eventStartHeight;
            // If we have skipped under, we repeat the action to check if there is enough place :
            // YES : Try to skip one more year
            // NO : cancel the skipping (next line)
            if(skip) return this.getMarginTop(yearIndex, lastYearIndex-1, yearpx, marginRight+this.getYearFreeWidth(years[lastYearIndex]), settings, years, index, true);
            // case of NO : when a skip has occured and the marginBottom != 0
            // if marginBottom != 0, this means the function has added a margin bottom so there is not enough space to enter 
            if(marginBottom != 0 && yearIndex-1 != lastYearIndex) return this.getMarginTop(yearIndex, yearIndex-1, yearpx, marginRight, settings, years, index, false);
            return marginBottom;
        },
        getMargin(element, side){
            return parseInt(element.css("margin" + side).replace('px', ''));
        },
        getPadding(element, side){
            return parseInt(element.css("padding" + side).replace('px', ''));
        },
        getEventFullHeight(element){
            return element.height() + this.getMargin(element, "Top") + this.getPadding(element, "Top") + this.getPadding(element, "Bottom");
        },
        getEventIndex(element){
            return parseInt(element.attr('class').replace('period period-', ''));
        },
        getYearFreeWidth(year){
            return $(".timeline .periods .year-" + year).width() + parseInt(this.getMargin($(".timeline .periods .year-" + year), "Right"));
        },
        selectEvent(year, index){
            this.$emit('select-period', year, index);
        }
    }
}
window.appYearComp = {
    name: "appyear",
    template: `
    <div v-bind:class="'year year-'+year" v-bind:style="
        'order: ' + index + ';' +
        'width:' + getWidth(yearpx, yeardividefactor, type) + 'px !important;' +
        'margin-right:' + getMarginRight(year, index, years, type, yearpx) + 'px;' +
        ((type == 1) ? 'backgroundColor: ' + settings.years.backgroundColor + '; border-right: ' + settings.years.borderWidth + 'px solid ' + settings.years.borderColor + ';' + 'height: ' + settings.years.height + 'px;' : '') + ';' +
        'z-index: ' + index + ';'">
        
        <h4 class="title" v-if="type == 1" v-bind:style="'color: ' + settings.years.textColor + ';' +
            'line-height: ' + settings.years.height + 'px;' +
            'font-weight: ' + settings.years.fontWeight + ';'">{{year}}</h4>

        <app-event v-if="type == 0" v-for="(event, eventIndex) in events"
            v-bind:key="eventIndex + '' + events.length"
            v-bind:index="eventIndex"
            v-bind:event="event"
            v-bind:yearindex="index"
            v-bind:yearpx="yearpx"
            v-bind:marginright="marginRight"
            v-bind:settings="settings"
            v-bind:years="years"
            v-bind:ui="ui"
            v-on:select-event="selectEvent"></app-event>

        <app-period v-if="type == 2" v-for="(event, eventIndex) in events"
            v-bind:key="eventIndex + '' + events.length"
            v-bind:index="eventIndex"
            v-bind:event="event"
            v-bind:yearindex="index"
            v-bind:yearpx="yearpx"
            v-bind:marginright="marginRight"
            v-bind:settings="settings"
            v-bind:years="years"
            v-bind:ui="ui"
            v-on:select-period="selectPeriod"></app-period>

    </div>`,
    props: ["year", "index", "years", "events", "type", "yearpx", "yeardividefactor", "settings", "ui"],
    components: {
        "app-event": appEventComp,
        "app-period": appPeriodComp
    },
    data: () => {
        return {
            marginRight: 0
        }
    },
    methods: {
        getWidth: function(yearpx, yeardividefactor, type){
            return (type == 1) ? yearpx*yeardividefactor : yearpx;
        },
        getMarginRight: function(year, index, years, type, yearpx){
            switch(type){
                case 1: // YEARS LINE //
                return 0;
                case 0: // EVENTS (Top) //
                //console.log("////////// PROCESSING YEAR " + year + " //////////");
                if(years[index-1] == undefined) return 0; // First year
                var margin = (years[index-1]-year-1) * yearpx; // calculate margin with the years difference
                this.marginRight = (margin >= 0) ? margin : 0; // clamp margin
                return this.marginRight;
                break;  ///////////////////////
                case 2: // PERIODES (Bottom) //
                if(years[index-1] == undefined) return 0;
                var margin = (years[index-1]-year-1) * yearpx;
                this.marginRight = (margin >= 0) ? margin : 0;
                return this.marginRight;
                break;  ///////////////////////
            }
        },
        selectEvent(year, index){
            this.$emit('select-event', year, index);
        },
        selectPeriod(year, index){
            this.$emit('select-period', year, index);
        }
    }
}