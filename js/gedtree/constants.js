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
                min: 0, max: 15, step: 1,
            },
            rightColumns: {
                name: "Right columns (ascending)",
                type: 1, value: 5,
                min: 0, max: 15, step: 1,
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
                    require: 'showBrothers',
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
                    require: 'showBrothers',
                    separator: true
                }
            },
            rightColumn: {
                name: "Right cloumn",
                repeat: {section: 'size', name: 'rightColumns'},
                showBrothers: {
                    name: "Show brothers",
                    type: 3, value: false,
                },
                showBrothersChildren: {
                    name: "Show brothers children",
                    type: 3, value: false,
                    require: 'showBrothers',
                    separator: true
                }
            },
        },

        background: {
            name: "Colors",
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
                min: -200, max: 200, step: 1
            }
        },
        decoration: {
            name: "Decoration",
            rootMargin: {
                name: "Poster margin",
                type: 1, value: 32,
                min: 20, max: 100, step: 0
            },
            innerMargin: {
                name: "Inner margin",
                type: 1, value: 16,
                min: 20, max: 100, step: 0,
                separator: true
            },
            border: {
                name: "Border",
                borderWidth: {
                    name: "Width",
                    type: 1, value: 2, isFloat: true,
                    min: 0, max: 40, step: 0.25
                },
                borderColor: {
                    name: "Color",
                    type: 0, value: "rgba(106,104,95,1)"
                },
                borderBorderRadius: {
                    name: "Border radius",
                    type: 1, value: 5,
                    min: 0, max: 50, step: 1,
                }
            }
        },
        fonts: {
            name: "Fonts",
            width: {
                name: "Width",
                type: 1, value: 200,
                min: 50, max: 900, step: 10
            },
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgba(51,139,255,0.27)",
                separator: true
            },

            padding: {
                name: "Padding",
                type: 1, value: 3,
                min: 0, max: 30
            },
            margin: {
                name: "Margin",
                type: 1, value: 5,
                min: 0, max: 30
            },
            minMargin: {
                name: "Minimum Margin",
                type: 1, value: 5,
                min: 0, max: 30,
                separator: true
            },

            linkerColor: {
                name: "Linker Color",
                type: 0, value: "rgba(231,0,0,0.75)"
            },
            linkerWidth: {
                name: "Linker Width",
                type: 1, value: 1,
                min: 0, max: 10
            },
            borderRadius: {
                name: "Round Corner Radius",
                type: 1, value: 2,
                min: 0, max: 30,
                separator: true
            },
            title: {
                name: "Title Text",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(0, 0, 0, 1)"
                },
                fontSize: {
                    name: "Font Size",
                    type: 1, value: 16,
                    min: 10, max: 30
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 500,
                    min: 100, max: 900, step: 100,
                    separator: true
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
