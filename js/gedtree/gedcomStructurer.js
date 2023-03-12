// Converts the gedcom raw data from read-gedcom to a structured, directly displayable format

window.structureGedcomData = function structureGedcomData(gedcom, rootIndPtr, leftCols, middleCol, rightCols) {
    let root = gedcom.getIndividualRecord(rootIndPtr).arraySelect()[0]

    // example
    let columns = []

    ///////////////////
    // MIDDLE COLUMN //
    ///////////////////

    console.log(root.getSex())

    let rootCouple = constituteCouple(root);
    columns.push({
        // Child groups are only used when doing descendant trees
        childGroups: [
            {
                couples: [
                    {
                        ...rootCouple
                    }
                ]
            }
        ]
    })
    if (middleCol.showBrothers) {
        let brothers = root.getFamilyAsChild().getChild().arraySelect().map(child => child.getIndividualRecord())
            .filter(ind => ind[0].pointer !== root[0].pointer);

        let brotherCouples = brothers.map(brother => constituteCouple(brother, !middleCol.showBrothersChildren, true));
        columns[0].childGroups[0].couples = columns[0].childGroups[0].couples.concat(brotherCouples);

        // Sort brothers by birth date
        // columns[0].childGroups[0].couples = _.sortBy(columns[0].childGroups[0].couples, [function(c) {
        //     return c.wasMen ? getDateToJSDate(c.husband?.getEventBirth().getDate()) : getDateToJSDate(c.wife?.getEventBirth().getDate());
        // }]);
    }

    ///////////////////
    // RIGHT COLUMNS //
    ///////////////////

    for (let rightCol of rightCols) {
        let rightColumn = generateRightColumn(gedcom, columns.slice(-1)[0], rightCol);
        columns.push(rightColumn);
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


    return {columns};
}

function generateRightColumn(gedcom, previousColData, rightCol){
    let rightColumn = {
        childGroups : []
    }

    for (let fam of previousColData.childGroups) {
        for (let couple of fam.couples) {
            if (couple.isBrother) continue; // don't ascend brothers

            let husband = couple.husband;
            let wife = couple.wife;

            let husbandFamilyHusband = husband?.getFamilyAsChild().arraySelect()?.[0]?.getHusband()?.getIndividualRecord();
            let wifeFamilyHusband = wife?.getFamilyAsChild().arraySelect()?.[0]?.getHusband()?.getIndividualRecord();

            if(husbandFamilyHusband) rightColumn.childGroups.push({couples: [constituteCouple(husbandFamilyHusband)]})
            if(wifeFamilyHusband) rightColumn.childGroups.push({couples: [constituteCouple(wifeFamilyHusband)]})
        }
    }

    return rightColumn;
}

function constituteCouple(record, disableSouse = false, isBrother = false) {
    let isMen = record.getSex()[0].value === "M";
    let family = record.getFamilyAsSpouse();
    let husband;
    let wife;
    if (isMen) {
        husband = record;
        if(!disableSouse) wife = family.getWife().getIndividualRecord();
    } else {
        if(!disableSouse) husband = family.getHusband().getIndividualRecord();
        wife = record;
    }
    return {
        wasMen: isMen,
        isBrother: isBrother,
        husband,
        wife
    }
}

function coupleToData(couple) {
    return {
        wasMen: couple.wasMen,
        husband: getIndividualData(couple.husband),
        wife: getIndividualData(couple.wife),
    }
}

function getIndividualData(record) {
    if (!record || record.length === 0) return null;
    return {
        firstName: record.getName().valueAsParts()[0][0],
        lastName: record.getName().valueAsParts()[0][1],
        birth: getDateToJSDate(record.getEventBirth().getDate()),
        death: getDateToJSDate(record.getEventDeath().getDate()),
    }
}

