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
                    min: 1, max: 300, step: 2,
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
                    min: 1, max: 300, step: 2,
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
                    min: 1, max: 300, step: 2,
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
                    min: 20, max: 50, step: 0
                },
                innerMargin: {
                    name: "Inner margin",
                    type: 1, value: 16,
                    min: 20, max: 50, step: 0,
                    separator: true
                },
            },
            border: {
                name: "Border",
                borderWidth: {
                    name: "Width",
                    type: 1, value: 2, isFloat: true,
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
                    type: 1, value: 65,
                    min: 1, max: 300, step: 2
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 400,
                    min: 400, max: 700, step: 100,
                    separator: true
                }
            },
            date: {
                name: "Date",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(73,71,63,1)"
                },
                fontSize: {
                    name: "Relative font size",
                    type: 1, value: 72,
                    min: 1, max: 300, step: 2
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 400,
                    min: 400, max: 700, step: 100
                }
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
                    type: 1, value: 20,
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
                    type: 1, value: 20,
                    min: 0, max: 100, step: 1
                },
                nameOccupationSpacing: {
                    name: "Name-Occupation spacing",
                    type: 1, value: 10,
                    min: 0, max: 100, step: 1
                },
                linkLineMargin: {
                    name: "Link line margin",
                    type: 1, value: 20,
                    min: 0, max: 100, step: 1,
                }

            }
        }
    }
}
