// Types :
// 0 : color
// 1 : number
// 2 : text
// 3 : file/dir
window.constants = {
    settingsDetails: {
        files: {
            name: "Source files",
            gedFile: {
                name: "Gedcom file",
                type: 3,
                isDirectory: false
            },
            imgDir: {
                name: "Images folder",
                type: 3,
                isDirectory: true
            }
        },
        size: {
            name: "Render dimensions",
            width: {
                name: "Width (px)",
                type: 1, value: 750,
                min: 20, max: 100000, step: 10,
            },
            aspectRatio: {
                name: "Aspect ratio",
                type: 1, isFloat: true, value: 0.75,
                min: 0.1, max: 10, step: 0.05,
                separator: true
            },
            leftColumns: {
                name: "Left columns (ascending)",
                type: 1, value: 5,
                min: 0, max: 15, step: 1,
            },
            rightColumns: {
                name: "Right columns (descending)",
                type: 1, value: 0,
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
                    type: 3, value: true,
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
                    name: "Show brothers childrens",
                    type: 3, value: false,
                    require: 'showBrothers'
                }
            },
        },

        global: {
            name: "Colors",
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgb(225, 221, 195)",
            },
            backgroundImage: {
                name: "background Image",
                type: 2, value: "", placeholder: "https://example.com/image.png",
            }
        },
        margins: {
            name: "Margins",
            height: {
                name: "Height",
                type: 1, value: 45,
                min: 20, max: 100, step: 5
            },
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgba(231,0,0,0.75)",
                separator: true
            },

            textColor: {
                name: "Text Color",
                type: 0, value: "rgba(0, 0, 0, 1)"
            },
            fontWeight: {
                name: "Font Weight",
                type: 1, value: 500,
                min: 100, max: 900, step: 100,
                separator: true
            },

            borderColor: {
                name: "Border Color",
                type: 0, value: "rgba(119,0,0,1)"
            },
            borderWidth: {
                name: "Border Width",
                type: 1, value: 1,
                min: 0, max: 10
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
