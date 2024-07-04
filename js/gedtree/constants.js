// Types :
// 0 : color
// 1 : number
// 2 : text
// 3 : checkbox
window.constants = {
    settingsDetails: {
        hidden: {
            name: "Hidden",
            rootIndividualId: {
                name: "Root individual ID",
                type: 2,
                value: '',
            }
        },
        size: {
            name: "Render dimensions",
            width: {
                name: "Width (px)",
                type: 1, value: 750,
                min: 20, max: 5000, step: 10,
            },
            aspectRatio: {
                name: "Aspect ratio",
                type: 1, isFloat: true, value: 0.75,
                min: 0.1, max: 10, step: 0.05,
                separator: true
            },
            leftColumns: {
                name: "Left columns (descending)",
                type: 1, value: 0,
                min: 0, max: 8, step: 1,
            },
            rightColumns: {
                name: "Right columns (ascending)",
                type: 1, value: 5,
                min: 0, max: 8, step: 1,
            }
        },
        columns: {
            name: "Columns",
            leftColumns: {
                name: "Left cloumn",
                repeat: {section: 'size', name: 'leftColumns'},
                showBrothers: {
                    name: "Show brothers",
                    type: 3, value: false,
                },
                showBrothersChildren: {
                    name: "Show brothers children",
                    type: 3, value: false,
                    require: 'showBrothers'
                },
                verticalDisplay: {
                    name: "Vertical display",
                    type: 3, value: false
                },
                showPictures: {
                    name: "Show pictures",
                    type: 3, value: false
                },
                forceWrapOccupation: {
                    name: "Force wrap occupation",
                    type: 3, value: false
                },
                fontSize: {
                    name: "Relative font size",
                    type: 1, value: 100,
                    min: 1, max: 300, step: 2,
                },
                pictureSize: {
                    name: "Relative picture size",
                    type: 1, value: 100,
                    min: 1, max: 300, step: 2
                },
                inlineDate: {
                    name: "Inline date",
                    type: 3, value: false,
                    separator: true
                }
            },
            middleColumn: {
                name: "Middle cloumn",
                showBrothers: {
                    name: "Show brothers",
                    type: 3, value: false,
                },
                showBrothersChildren: {
                    name: "Show brothers children",
                    type: 3, value: false,
                    require: 'showBrothers'
                },
                verticalDisplay: {
                    name: "Vertical display",
                    type: 3, value: true
                },
                showPictures: {
                    name: "Show pictures",
                    type: 3, value: true
                },
                forceWrapOccupation: {
                    name: "Force wrap occupation",
                    type: 3, value: false
                },
                fontSize: {
                    name: "Relative font size",
                    type: 1, value: 100,
                    min: 1, max: 300, step: 2,
                },
                pictureSize: {
                    name: "Relative picture size",
                    type: 1, value: 100,
                    min: 1, max: 300, step: 2
                },
                inlineDate: {
                    name: "Inline date",
                    type: 3, value: false,
                    separator: true
                }
            },
            rightColumns: {
                name: "Right cloumn",
                repeat: {section: 'size', name: 'rightColumns'},
                showBrothers: {
                    name: "Show brothers",
                    type: 3, value: false,
                },
                showBrothersChildren: {
                    name: "Show brothers children",
                    type: 3, value: false,
                    require: 'showBrothers'
                },
                verticalDisplay: {
                    name: "Vertical display",
                    type: 3, value: false
                },
                showPictures: {
                    name: "Show pictures",
                    type: 3, value: false
                },
                forceWrapOccupation: {
                    name: "Force wrap occupation",
                    type: 3, value: false
                },
                fontSize: {
                    name: "Relative font size",
                    type: 1, value: 100,
                    min: 1, max: 300, step: 2,
                },
                pictureSize: {
                    name: "Relative picture size",
                    type: 1, value: 100,
                    min: 1, max: 300, step: 2
                },
                inlineDate: {
                    name: "Inline date",
                    type: 3, value: false,
                    separator: true
                }
            },
        },

        decoration: {
            name: "Decoration",
            background: {
                name: "Background",
                backgroundColor: {
                    name: "Background Color",
                    type: 0, value: "rgba(249,246,232,1)",
                },
                backgroundImage: {
                    name: "Background image",
                    type: 2, value: "img/tree.svg", placeholder: "https://example.com/image.png",
                },
                backgroundSize: {
                    name: "Background size (%)",
                    type: 1, value: 124, isFloat: true,
                    min: 0, max: 300, step: 1, auto: true
                },
                backgroundImageX: {
                    name: "Background image x (%)",
                    type: 1, value: -4, isFloat: true,
                    min: -200, max: 200, step: 1
                },
                backgroundImageY: {
                    name: "Background image y (%)",
                    type: 1, value: 8, isFloat: true,
                    min: -200, max: 200, step: 1,
                    separator: true
                }
            },
            margins: {
                name: "Margins",
                rootMargin: {
                    name: "Poster margin",
                    type: 1, value: 32,
                    min: 0, max: 50, step: 0
                },
                innerMargin: {
                    name: "Inner margin",
                    type: 1, value: 16,
                    min: 0, max: 50, step: 0,
                    separator: true
                },
            },
            border: {
                name: "Border",
                borderWidth: {
                    name: "Width",
                    type: 1, value: 1, isFloat: true,
                    min: 0, max: 10, step: 0.25
                },
                borderColor: {
                    name: "Color",
                    type: 0, value: "rgba(106,104,95,1)"
                },
                borderBorderRadius: {
                    name: "Border radius",
                    type: 1, value: 5,
                    min: 0, max: 20, step: 1,
                    separator: true
                }
            },
            title: {
                name: "Title",
                titleText: {
                    name: "Title text",
                    type: 2, value: "Family tree", placeholder: "Empty for no title",
                },
                titleColor: {
                    name: "Title color",
                    type: 0, value: "rgba(73,71,63,1)"
                },
                titleFont: {
                    name: "Title font",
                    type: 2, value: "Apple Chancery", placeholder: "Font name",
                },
                titleFontWeight: {
                    name: "Title font weight",
                    type: 1, value: 400,
                    min: 100, max: 900, step: 100
                },
                titleFontStyle: {
                    name: "Title font style",
                    type: 2, value: "italic", placeholder: "normal, italic, oblique"
                },
                titleFontSize: {
                    name: "Title font size (px)",
                    type: 1, value: 33,
                    min: 1, max: 300, step: 2
                },
                titleLineHeight: {
                    name: "Title line height (%)",
                    type: 1, value: 50, isFloat: true,
                    min: 10, max: 200, step: 1
                },
                titleSmallCaps: {
                    name: "Title small caps",
                    type: 3, value: true,
                    separator: true
                },
                subtitleText: {
                    name: "Subtitle text",
                    type: 2, value: "", placeholder: "Empty for no subtitle",
                },
                subtitleColor: {
                    name: "Subtitle color",
                    type: 0, value: "rgba(73,71,63,1)"
                },
                subtitleFont: {
                    name: "Subtitle font",
                    type: 2, value: "Apple Chancery", placeholder: "Font name",
                },
                subtitleFontWeight: {
                    name: "Subtitle font weight",
                    type: 1, value: 400,
                    min: 100, max: 900, step: 100
                },
                subtitleFontStyle: {
                    name: "Subtitle font style",
                    type: 2, value: "italic", placeholder: "normal, italic, oblique"
                },
                subtitleFontSize: {
                    name: "Subtitle font size (px)",
                    type: 1, value: 17,
                    min: 1, max: 300, step: 2
                },
                subtitleLineHeight: {
                    name: "Subtitle line height (%)",
                    type: 1, value: 50, isFloat: true,
                    min: 10, max: 200, step: 1
                },
                subtitleSmallCaps: {
                    name: "Subtitle small caps",
                    type: 3, value: false,
                    separator: true
                },
                titleSubTitleSpacing: {
                    name: "Title-Subtitle spacing (px)",
                    type: 1, value: 14,
                    min: 0, max: 50, step: 0
                }
            }
        },
        individual: {
            name: "Individual",
            linkLines: {
                name: "Link lines",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(163,160,151,1)"
                },
                width: {
                    name: "Width",
                    type: 1, value: 1, isFloat: true,
                    min: 0, max: 10, step: 0.25,
                    separator: true
                }
            },
            image: {
                name: "Image",
                borderRelativeWidth: {
                    name: "Border relative width (%)",
                    type: 1, value: 50, isFloat: false,
                    min: 0, max: 200, step: 1
                },
                keepAlignmentWhenNoImage: {
                    name: "Keep alignment when no image",
                    type: 3, value: true,
                    separator: true
                }
            },
            displayName: {
                name: "Name",
                cutMiddleNames: {
                    name: "Cut middle names",
                    type: 3, value: true
                },
                pascalCaseSurname: {
                    name: "Title case Surname",
                    type: 3, value: true
                },
                upperCaseSurname: {
                    name: "Upper case Surname",
                    type: 3, value: false
                },
                smallCapsSurname: {
                    name: "Small caps Surname",
                    type: 3, value: true
                },
                color: {
                    name: "Color",
                    type: 0, value: "rgba(73,71,63,1)"
                },
                fontSize: {
                    name: "Relative font size",
                    type: 1, value: 100,
                    min: 1, max: 300, step: 2
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 700,
                    min: 400, max: 700, step: 100,
                    separator: true
                }
            },
            occupation: {
                name: "Occupation",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(73,71,63,1)"
                },
                fontSize: {
                    name: "Relative font size",
                    type: 1, value: 80,
                    min: 1, max: 300, step: 2
                },
                decreaseDifference: {
                    name: "Limit scale when font size decreases",
                    type: 3, value: true
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 400,
                    min: 400, max: 700, step: 100,
                    separator: true
                }
            },
            datesAndPlaces: {
                name: "Dates and Places",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(73,71,63,1)"
                },
                fontSize: {
                    name: "Relative font size",
                    type: 1, value: 80,
                    min: 1, max: 300, step: 2
                },
                decreaseDifference: {
                    name: "Limit scale when font size decreases",
                    type: 3, value: true
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 400,
                    min: 400, max: 700, step: 100
                },
                lineHeight: {
                    name: "Line height (%)",
                    type: 1, value: 108, isFloat: true,
                    min: 50, max: 200, step: 1,
                    separator: true
                }
            },
            dates: {
                name: "Dates",
                formatLanguage: {
                    name: "Format language code",
                    type: 2, value: "fr", placeholder: "en",
                    separator: true
                },
            },
            places: {
                name: "Places",
                placeFormat: {
                    name: "Places format (use keys among the ones configured in the gedcom head)",
                    type: 2, value: "Commune, Département, Pays",
                    placeholder: "Commune, Code_INSEE, Code_Postal, Département, Région, Pays"
                },
                countryKey: {
                    name: "Country key",
                    type: 2, value: "Pays", placeholder: "Pays",
                    separator: true
                },
                countryDifferentFrom: {
                    name: "Show country if different from",
                    type: 2, value: "France", placeholder: "France",
                    separator: true
                },
                departmentKey: {
                    name: "Department key",
                    type: 2, value: "Département", placeholder: "Département",
                },
                departmentDifferentFrom: {
                    name: "Show department if different from",
                    type: 2, value: "Paris", placeholder: "Paris",
                    separator: true
                },
            }
        },
        margins: {
            name: "Margins (relative to font size)",
            verticalLayout: {
                name: "Vertical Layout",
                imageNameSpacing: {
                    name: "Image-Name spacing",
                    type: 1, value: 17,
                    min: 0, max: 100, step: 1
                },
                nameOccupationSpacing: {
                    name: "Name-Occupation spacing",
                    type: 1, value: 7,
                    min: 0, max: 100, step: 1
                },
                occupationDateSpacing: {
                    name: "Occupation-Date spacing",
                    type: 1, value: 10,
                    min: 0, max: 100, step: 1,
                    separator: true
                }
            },
            horizontalLayout: {
                name: "Horizontal Layout",
                imageLeftMargin: {
                    name: "Image left margin",
                    type: 1, value: 60,
                    min: 0, max: 100, step: 1
                },
                textLeftMargin: {
                    name: "Text left margin",
                    type: 1, value: 17,
                    min: 0, max: 100, step: 1
                },
                nameOccupationSpacing: {
                    name: "Name-Occupation spacing",
                    type: 1, value: 10,
                    min: 0, max: 100, step: 1
                },
                linkLineMargin: {
                    name: "Link line margin",
                    type: 1, value: 17,
                    min: 0, max: 100, step: 1,
                }
            }
        }
    }
}
