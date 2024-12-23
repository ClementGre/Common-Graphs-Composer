// Converts the gedcom raw data from read-gedcom to a structured, directly displayable format

window.structureGedcomData = function structureGedcomData(gedcom, rootIndPtr, leftCols, middleCol, rightCols){
    let root = gedcom.getIndividualRecord(rootIndPtr).arraySelect()[0]

    let columns = []

    ///////////////////
    // MIDDLE COLUMN //
    ///////////////////

    let rootCouple = constituteCouple(root, !middleCol.showBrothersChildren, false, false, leftCols.length > 0);
    columns.push({
        // Child groups are only used when doing descendant trees
        childGroups: [
            {
                couples: [
                    rootCouple
                ]
            }
        ],
        layout: {
            verticalDisplay: middleCol.verticalDisplay,
            showPictures: middleCol.showPictures,
            forceWrapOccupation: middleCol.forceWrapOccupation,
            fontSize: middleCol.fontSize,
            pictureSize: middleCol.pictureSize,
            inlineDate: middleCol.inlineDate ?? false,
        }
    })
    if(middleCol.showBrothers){
        // Adding brother couples
        columns[0].childGroups[0].couples = columns[0].childGroups[0].couples.concat(
            getBrothers(root, middleCol.showBrothersChildren, middleCol.showBrothersChildren && leftCols.length > 0));

        // Sort brothers by birthdate
        columns[0].childGroups[0].couples = _.sortBy(columns[0].childGroups[0].couples, [function(c){
            return c.wasMen ? getDateToJSDate(c.husband?.getEventBirth().getDate()) : getDateToJSDate(c.wife?.getEventBirth().getDate());
        }]);
    }

    ///////////////////
    // RIGHT COLUMNS //
    ///////////////////

    for(let rightCol of rightCols){
        let rightColumn = generateRightColumn(gedcom, columns.slice(-1)[0], rightCol);
        columns.push(rightColumn);
    }

    //////////////////
    // LEFT COLUMNS //
    //////////////////

    for(let leftCol of leftCols){
        let leftColumn = generateLeftColumn(gedcom, columns[0], leftCol);
        console.log('Left column', leftColumn)
        columns.unshift(leftColumn);
    }


    ////////////////////////
    // ADDING GEDCOM DATA //
    ////////////////////////

    let gedcom_data = {
        file_name: gedcom.getHeader().getFilename().value()[0],
        place_format: gedcom.getHeader().get('PLAC').get('FORM').value()[0].split(",").map(s => s.trim())
    }

    /////////////////
    // FORMAT DATA //
    /////////////////

    console.log('Before conversion', columns)
    columns = columns.map(col => {
        col.childGroups = col.childGroups.map(fam => {
            fam.couples = fam.couples.map(couple => coupleToData(couple));
            return fam
        })
        return col;
    })
    console.log('After conversion', columns)

    return {gedcom_data, columns};
}

function generateRightColumn(gedcom, previousColData, rightCol){
    let rightColumn = {
        childGroups: [],
        layout: {
            verticalDisplay: rightCol.verticalDisplay ?? false,
            showPictures: rightCol.showPictures ?? false,
            forceWrapOccupation: rightCol.forceWrapOccupation ?? false,
            fontSize: rightCol.fontSize ?? 100,
            pictureSize: rightCol.pictureSize ?? 100,
            inlineDate: rightCol.inlineDate ?? false,
        }
    }

    for(let fam of previousColData.childGroups){
        for(let couple of fam.couples){
            if(!couple){
                rightColumn.childGroups.push({couples: [undefined]})
                rightColumn.childGroups.push({couples: [undefined]})
                continue;
            }
            if(couple.isBrother) continue; // don't ascend brothers

            let husbandParentCouple = getParentCouple(couple.husband);
            let wifeParentCouple = getParentCouple(couple.wife);

            if(couple.doAscendSpouse || couple.wasMen){ // Ascending men
                if(husbandParentCouple){
                    let couples = []
                    if(rightCol.showBrothers){
                        let husband_father = couple.husband?.getFamilyAsChild().arraySelect()?.[0]?.getHusband()?.getIndividualRecord()
                        let brothers = getBrothers(husband_father, rightCol.showBrothersChildren, false);
                        brothers = _.sortBy(brothers, [function(c){
                            return c.wasMen ? getDateToJSDate(c.husband?.getEventBirth().getDate()) : getDateToJSDate(c.wife?.getEventBirth().getDate());
                        }]);
                        couples = couples.concat(brothers);
                    }
                    couples.push(husbandParentCouple);
                    if(rightCol.showBrothers){
                        let husband_mother = couple.husband?.getFamilyAsChild().arraySelect()?.[0]?.getWife()?.getIndividualRecord()
                        let brothers = getBrothers(husband_mother, rightCol.showBrothersChildren, false);
                        brothers = _.sortBy(brothers, [function(c){
                            return c.wasMen ? getDateToJSDate(c.husband?.getEventBirth().getDate()) : getDateToJSDate(c.wife?.getEventBirth().getDate());
                        }]);
                        couples = couples.concat(brothers);
                    }
                    rightColumn.childGroups.push({couples});
                }else rightColumn.childGroups.push({couples: [undefined]})
            }
            if(couple.doAscendSpouse || !couple.wasMen){ // Ascending women
                if(wifeParentCouple){
                    let couples = []
                    if(rightCol.showBrothers){
                        let wife_father = couple.wife?.getFamilyAsChild().arraySelect()?.[0]?.getHusband()?.getIndividualRecord()
                        let brothers = getBrothers(wife_father, rightCol.showBrothersChildren, false);
                        brothers = _.sortBy(brothers, [function(c){
                            return c.wasMen ? getDateToJSDate(c.husband?.getEventBirth().getDate()) : getDateToJSDate(c.wife?.getEventBirth().getDate());
                        }]);
                        couples = couples.concat(brothers);
                    }
                    couples.push(wifeParentCouple);
                    if(rightCol.showBrothers){
                        let wife_mother = couple.wife?.getFamilyAsChild().arraySelect()?.[0]?.getWife()?.getIndividualRecord()
                        let brothers = getBrothers(wife_mother, rightCol.showBrothersChildren, false);
                        brothers = _.sortBy(brothers, [function(c){
                            return c.wasMen ? getDateToJSDate(c.husband?.getEventBirth().getDate()) : getDateToJSDate(c.wife?.getEventBirth().getDate());
                        }]);
                        couples = couples.concat(brothers);
                    }
                    rightColumn.childGroups.push({couples});
                }else rightColumn.childGroups.push({couples: [undefined]})
            }
        }
    }
    // remove first childgroup's couple

    return rightColumn;
}

function generateLeftColumn(gedcom, previousColData, leftCol, isLastLeftCol){
    let leftColumn = {
        childGroups: [],
        layout: {
            verticalDisplay: leftCol.verticalDisplay ?? false,
            showPictures: leftCol.showPictures ?? false,
            forceWrapOccupation: leftCol.forceWrapOccupation ?? false,
            fontSize: leftCol.fontSize ?? 100,
            pictureSize: leftCol.pictureSize ?? 100,
            inlineDate: leftCol.inlineDate ?? false,
        }
    }

    for(let fam of previousColData.childGroups){
        for(let couple of fam.couples){
            if(!couple){
                leftColumn.childGroups.push({couples: [undefined]})
                continue;
            }
            let childrens = getChildren(couple.husband, isLastLeftCol || leftCol.showSpouse);
            leftColumn.childGroups.push({couples: childrens});
        }
    }
    return leftColumn;
}

function getBrothers(root, showSpouse, hasChild){

    let brothers = root.getFamilyAsChild().getChild().arraySelect().map(child => child.getIndividualRecord())
        .filter(ind => ind[0].pointer !== root[0].pointer);

    return brothers.map(brother => constituteCouple(brother, !showSpouse,
        false, true, hasChild));
}

function getChildren(record, showSpouse = false){
    let family = record?.getFamilyAsSpouse();
    if(!family) return [];
    return family.getChild().arraySelect()
        .map(child => child.getIndividualRecord())
        .map(child => constituteCouple(child, !showSpouse, false, true, false));
}

function getParentCouple(record){
    let husband = record?.getFamilyAsChild().arraySelect()?.[0]?.getHusband()?.getIndividualRecord();
    if(!husband || husband.length === 0) return null;
    return constituteCouple(husband);
}

function constituteCouple(record, disableSpouse = false, doAscendSpouse = true, isBrother = false, hasChild = true){
    let isMen = record.getSex()[0].value === "M";
    let family = record.getFamilyAsSpouse();
    let husband;
    let wife;
    if(isMen){
        husband = record;
        if(!disableSpouse) wife = family.getWife().getIndividualRecord();
    }else{
        if(!disableSpouse) husband = family.getHusband().getIndividualRecord();
        wife = record;
    }
    return {
        wasMen: isMen,
        isBrother: isBrother,
        doAscendSpouse: doAscendSpouse,
        hasChild: hasChild && family.getChild().length > 0,
        husband,
        wife
    }
}

function coupleToData(couple){
    if(!couple) return undefined;
    return {
        wasMen: couple.wasMen,
        hasChild: couple.hasChild,
        isBrother: couple.isBrother,
        husband: getIndividualData(couple.husband),
        wife: getIndividualData(couple.wife),
    }
}

function getIndividualData(record){
    if(!record || record.length === 0) return null;
    return {
        id: record.pointer()[0],
        firstName: record.getName().valueAsParts()[0][0],
        lastName: record.getName().valueAsParts()[0][1],
        occupation: record.getAttributeOccupation()[0]?.value,
        birth: getDateToJSDate(record.getEventBirth().getDate()),
        death: getDateToJSDate(record.getEventDeath().getDate()),
        birthPlace: record.getEventBirth().getPlace()?.valueAsParts()?.[0],
        deathPlace: record.getEventDeath().getPlace()?.valueAsParts()?.[0],
        picturePath: record.getMultimedia()?.getMultimediaRecord().getFileReference()?.value()[0],
    }
}

