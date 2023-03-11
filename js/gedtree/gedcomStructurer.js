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
        couples: [
            {
                ...coupleToData(rootCouple)
            }
        ]
    })
    if (middleCol.showBrothers) {
        let brothers = root.getFamilyAsChild().getChild().arraySelect().map(child => child.getIndividualRecord())
            .filter(ind => ind[0].pointer !== root[0].pointer);

        let brotherCouples = brothers.map(brother => coupleToData(constituteCouple(brother)));
        columns[0].couples = columns[0].couples.concat(brotherCouples);
    }

    return {columns};
}

function constituteCouple(record) {
    let isMen = record.getSex()[0].value === "M";
    let family = record.getFamilyAsSpouse();
    let husband;
    let wife;
    if (isMen) {
        husband = record;
        wife = family.getWife().getIndividualRecord();
    } else {
        husband = family.getHusband().getIndividualRecord();
        wife = record;
    }
    return {
        wasMen: isMen,
        husband,
        wife
    }
}

function coupleToData(couple) {
    return {
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

