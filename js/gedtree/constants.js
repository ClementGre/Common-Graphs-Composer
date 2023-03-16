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
                    type: 3, value: true,
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
                    type: 1, value: 2, isFloat: true,
                    min: 0, max: 10, step: 0.25
                }
            },
            date: {
                name: "Date Text",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(231,0,0,0.75)"
                },
                fontSize: {
                    name: "Font Size",
                    type: 1, value: 14,
                    min: 10, max: 30
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 400,
                    min: 100, max: 900, step: 100,
                    separator: true
                }
            },
            description: {
                name: "Description Text",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(0,0,0,0.89)"
                },
                fontSize: {
                    name: "Font Size",
                    type: 1, value: 14,
                    min: 10, max: 30
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 400,
                    min: 100, max: 900, step: 100
                }
            }
        }
    }
}
