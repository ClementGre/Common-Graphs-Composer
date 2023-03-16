// Converts the gedcom raw data from read-gedcom to a structured, directly displayable format

window.structureGedcomData = function structureGedcomData(gedcom, rootIndPtr, leftCols, middleCol, rightCols) {
    let root = gedcom.getIndividualRecord(rootIndPtr).arraySelect()[0]

    // example
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
                    {
                        ...rootCouple
                    }
                ]
            }
        ],
        layout: {
            verticalDisplay: middleCol.verticalDisplay,
            showPictures: middleCol.showPictures
        }
    })
    if (middleCol.showBrothers) {
        let brothers = root.getFamilyAsChild().getChild().arraySelect().map(child => child.getIndividualRecord())
            .filter(ind => ind[0].pointer !== root[0].pointer);

        let brotherCouples = brothers.map(brother => constituteCouple(brother, !middleCol.showBrothersChildren,
            false, true, middleCol.showBrothersChildren && leftCols.length > 0));
        columns[0].childGroups[0].couples = columns[0].childGroups[0].couples.concat(brotherCouples);

        // Sort brothers by birth date
        columns[0].childGroups[0].couples = _.sortBy(columns[0].childGroups[0].couples, [function(c) {
            return c.wasMen ? getDateToJSDate(c.husband?.getEventBirth().getDate()) : getDateToJSDate(c.wife?.getEventBirth().getDate());
        }]);
    }

    ///////////////////
    // RIGHT COLUMNS //
    ///////////////////

    for (let rightCol of rightCols) {
        let rightColumn = generateRightColumn(gedcom, columns.slice(-1)[0], rightCol);
        columns.push(rightColumn);
    }

    //////////////////
    // LEFT COLUMNS //
    //////////////////



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
        childGroups : [],
        layout: {
            verticalDisplay: rightCol.verticalDisplay ?? false,
            showPictures: rightCol.showPictures ?? false
        }
    }

    for (let fam of previousColData.childGroups) {
        for (let couple of fam.couples) {
            if (!couple){
                rightColumn.childGroups.push({couples: [undefined]})
                rightColumn.childGroups.push({couples: [undefined]})
                continue;
            }
            if (couple.isBrother) continue; // don't ascend brothers

            let husbandParentCouple = getParentCouple(couple.husband);
            let wifeParentCouple = getParentCouple(couple.wife);

            if(couple.doAscendSpouse || couple.wasMen){
                if(husbandParentCouple) rightColumn.childGroups.push({couples: [husbandParentCouple]})
                else rightColumn.childGroups.push({couples: [undefined]})
            }
            if(couple.doAscendSpouse || !couple.wasMen){
                if(wifeParentCouple) rightColumn.childGroups.push({couples: [wifeParentCouple]})
                else rightColumn.childGroups.push({couples: [undefined]})
            }
        }
    }

    return rightColumn;
}
function getParentCouple(record) {
    let husband = record?.getFamilyAsChild().arraySelect()?.[0]?.getHusband()?.getIndividualRecord();
    if (!husband || husband.length === 0) return null;
    return constituteCouple(husband);
}

function constituteCouple(record, disableSpouse = false, doAscendSpouse = true, isBrother = false, hasChild = true) {
    let isMen = record.getSex()[0].value === "M";
    let family = record.getFamilyAsSpouse();
    let husband;
    let wife;
    if (isMen) {
        husband = record;
        if(!disableSpouse) wife = family.getWife().getIndividualRecord();
    } else {
        if(!disableSpouse) husband = family.getHusband().getIndividualRecord();
        wife = record;
    }
    return {
        wasMen: isMen,
        isBrother: isBrother,
        doAscendSpouse: doAscendSpouse,
        hasChild: hasChild && family.getChildrenCount() > 0,
        husband,
        wife
    }
}

function coupleToData(couple) {
    if(!couple) return undefined;
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

