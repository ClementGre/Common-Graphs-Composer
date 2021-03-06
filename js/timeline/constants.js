window.constants = {
    defaultPeriodEvents: {
        1812: [
            {
                date: "11 Janvier 1812", day: 11, month: 1,
                enddate: "20 Septembre 1819", endday: 20, endmonth: 9, yearsLength: 7,
                title: "Répercusions du congrès de Vienne", description: ""
            }
        ],
        1811: [
            {
                date: "Septembre 1811",
                day: 0,
                month: 9,
                enddate: "Juin 1823",
                endday: 0,
                endmonth: 6,
                yearsLength: 12,
                title: "Congrès de viennes",
                description: "Remise en état de l'europe et blabla des familles , réequilibration des puissances."
            }
        ],
        1821: [
            {
                date: "1 Décembre 1821",
                day: 1,
                month: 12,
                enddate: "3 Février 1835",
                endday: 3,
                endmonth: 2,
                yearsLength: 14,
                title: "Révolte Grecque",
                description: "Les Grecques se révoltent pour obtenir leurs indépendance. La Sainte aliance n'intervient pas et au contraire, des pays viennent rétablir la paix. Elle obtient son indépendance en 1830."
            }
        ],
        1810: [
            {
                date: "1810",
                day: 1,
                month: 1,
                enddate: "1812",
                endday: 1,
                endmonth: 1,
                yearsLength: 2,
                title: "Petite pèriode courte pour tester",
                description: "Les Grecques se révoltent pour obtenir leurs indépendance."
            }
        ],
        1830: [
            {
                date: "1830", day: 1, month: 1,
                enddate: "1835", endday: 1, endmonth: 1, yearsLength: 5,
                title: "TEST", description: ""
            }
        ]
    },
    defaultDateEvents: {
        1830: [
            {
                date: "3 Juin 1830",
                day: 3,
                month: 6,
                title: "test test test test test test test test test test test",
                description: "Des journalistes se révoltent dans Paris car Charles X a supprimé la liberté d'expression -> révolution, Louis Phillipe au pouvoir. De plus, Louis 16 est"
            },
        ],
        1834: [
            {
                date: "3 Juin 1830",
                day: 3,
                month: 6,
                title: "Les trois glorieuses",
                description: "Des journalistes se révoltent dans Paris car Charles X a supprimé la liberté d'expression -> révolution, Louis Phillipe au pouvoir."
            },
        ],
        1838: [
            {date: "3 Juin 1830", day: 3, month: 6, title: "Les trois glorieuses", description: ""},
        ],
        1820: [
            {
                date: "1820",
                day: 1,
                month: 1,
                title: "Révolte Espagnole",
                description: "Petite desctription qui permet de décrire l'évènement, comme son nom l'indique... de plus, il se passa des choses"
            },
            {
                date: "1820",
                day: 1,
                month: 1,
                title: "Révolte Espagnole",
                description: "Petite desctription qui permet de décrire l'évènement, comme son nom l'indique..."
            },
            {
                date: "3 Aout 1820",
                day: 16,
                month: 8,
                title: "Commencement de la révolte Grecque",
                description: "Le massacre de Chaos commence cette année, massacre des grecques sur l'île de Chaos"
            },
        ],
        1826: [
            {
                date: "1 Janvier 1821",
                day: 1,
                month: 1,
                title: "Révolte Allemande",
                description: "(Ceci est un faux élènement...) mais cet evenement est auqnd meme"
            },
            {
                date: "1 Janvier 1821",
                day: 1,
                month: 6,
                title: "Révolte Allemande",
                description: "(Ceci est un faux élènement...)"
            }
        ],
        1848: [
            {date: "1848", day: 31, month: 12, title: "2em révolution Française", description: ""}
        ]

    },
    settingsDetails: {
        global: {
            name: "Global Settings",
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgba(255, 255, 255, 0)",
            },
            timelineWidth: {
                name: "Timeline Width",
                type: 1, value: 499,
                min: 499, max: 10000, auto: true
            }
        },
        years: {
            name: "Years Settings",
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
        events: {
            name: "Events Settings",
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
        },
        periods: {
            name: "Periods Settings",
            minWidth: {
                name: "Minimum Width",
                type: 1, value: 170,
                min: 0, max: 500, step: 10
            },
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgba(51,139,255,0.27)"
            },
            overflowBackgroundColor: {
                name: "Overflow Background Color",
                type: 0, value: "rgba(51,139,255,0.1)",
                separator: true
            },

            padding: {
                name: "Padding",
                type: 1, value: 3,
                min: 0, max: 30
            },
            margin: {
                name: "Margin",
                type: 1, value: 10,
                min: 0, max: 30
            },
            minMargin: {
                name: "Minimum Margin",
                type: 1, value: 5,
                min: 0, max: 30,
                separator: true
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
    },
    lastSettingsDetails: {
        global: {
            name: "Global Settings",
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgba(255, 255, 255, 0)",
            },
            timelineWidth: {
                name: "Timeline Width",
                type: 1, value: 499,
                min: 499, max: 10000, auto: true
            }
        },
        years: {
            name: "Years Settings",
            height: {
                name: "Height",
                type: 1, value: 50,
                min: 20, max: 100, step: 5
            },
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "#e74c3c",
                separator: true
            },

            textColor: {
                name: "Text Color",
                type: 0, value: "rgba(0, 0, 0, 1)"
            },
            fontWeight: {
                name: "Font Weight",
                type: 1, value: 400,
                min: 100, max: 900, step: 100,
                separator: true
            },

            borderColor: {
                name: "Border Color",
                type: 0, value: "rgba(0, 0, 0, 1)"
            },
            borderWidth: {
                name: "Border Width",
                type: 1, value: 1,
                min: 0, max: 10
            }
        },
        events: {
            name: "Events Settings",
            width: {
                name: "Width",
                type: 1, value: 200,
                min: 50, max: 900, step: 10
            },
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgba(170, 170, 170, 0.6)",
                separator: true
            },

            padding: {
                name: "Padding",
                type: 1, value: 5,
                min: 0, max: 30
            },
            margin: {
                name: "Margin",
                type: 1, value: 10,
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
                type: 0, value: "rgba(170, 170, 170, 0.6)"
            },
            linkerWidth: {
                name: "Linker Width",
                type: 1, value: 1,
                min: 0, max: 10
            },
            borderRadius: {
                name: "Round Corner Radius",
                type: 1, value: 5,
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
                    type: 1, value: 700,
                    min: 100, max: 900, step: 100,
                    separator: true
                }
            },
            date: {
                name: "Date Text",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(0, 0, 0, 1)"
                },
                fontSize: {
                    name: "Font Size",
                    type: 1, value: 14,
                    min: 10, max: 30
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 300,
                    min: 100, max: 900, step: 100,
                    separator: true
                }
            },
            description: {
                name: "Description Text",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(0, 0, 0, 1)"
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
        },
        periods: {
            name: "Periods Settings",
            minWidth: {
                name: "Minimum Width",
                type: 1, value: 100,
                min: 0, max: 500, step: 10
            },
            backgroundColor: {
                name: "Background Color",
                type: 0, value: "rgba(170, 170, 170, 0.6)"
            },
            overflowBackgroundColor: {
                name: "Overflow Background Color",
                type: 0, value: "rgba(170, 170, 170, 0.3)",
                separator: true
            },

            padding: {
                name: "Padding",
                type: 1, value: 5,
                min: 0, max: 30
            },
            margin: {
                name: "Margin",
                type: 1, value: 10,
                min: 0, max: 30
            },
            minMargin: {
                name: "Minimum Margin",
                type: 1, value: 5,
                min: 0, max: 30,
                separator: true
            },

            borderRadius: {
                name: "Round Corner Radius",
                type: 1, value: 5,
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
                    type: 1, value: 700,
                    min: 100, max: 900, step: 100,
                    separator: true
                }
            },
            date: {
                name: "Date Text",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(0, 0, 0, 1)"
                },
                fontSize: {
                    name: "Font Size",
                    type: 1, value: 14,
                    min: 10, max: 30
                },
                fontWeight: {
                    name: "Font Weight",
                    type: 1, value: 300,
                    min: 100, max: 900, step: 100,
                    separator: true
                }
            },
            description: {
                name: "Description Text",
                color: {
                    name: "Color",
                    type: 0, value: "rgba(0, 0, 0, 1)"
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