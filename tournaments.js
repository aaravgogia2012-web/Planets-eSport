/* =========================================
   PLANETS ESPORT - TOURNAMENT SETTINGS
   EDIT TOURNAMENT DETAILS ONLY HERE
   ========================================= */

const TOURNAMENTS = {

    battleRoyale: {

        name: "BATTLE ROYALE",
        icon: "🎯",

        solo: {
            name: "SOLO",
            players: 50,

            entryFee: 5000000000,
            prizePool: 1000,

            firstPrize: 650,
            secondPrize: 250,
            thirdPrize: 100,

            timings: [
                "3:00 PM",
                "3:15 PM",
                "3:30 PM",
                "3:45 PM",
                "4:00 PM",
                "4:15 PM",
                "4:30 PM",
                "4:45 PM",
                "5:00 PM",
                "5:15 PM",
                "5:30 PM",
                "5:45 PM",
                "6:00 PM",
                "6:15 PM",
                "6:30 PM",
                "6:45 PM",
                "7:00 PM",
                "7:15 PM",
                "7:30 PM",
                "7:45 PM",
                "8:00 PM",
                "8:15 PM",
                "8:30 PM",
                "8:45 PM",
                "9:00 PM",
                "9:15 PM",
                "9:30 PM",
                "9:45 PM",
                "10:00 PM"
            ]
        },

        duo: {
            name: "DUO",
            players: 50,

            entryFee: 25,
            prizePool: 950,

            firstPrize: 500,
            secondPrize: 350,
            thirdPrize: 100,

            timings: [
                "3:00 PM",
                "3:15 PM",
                "3:30 PM",
                "3:45 PM",
                "4:00 PM",
                "4:15 PM",
                "4:30 PM",
                "4:45 PM",
                "5:00 PM",
                "5:15 PM",
                "5:30 PM",
                "5:45 PM",
                "6:00 PM",
                "6:15 PM",
                "6:30 PM",
                "6:45 PM",
                "7:00 PM",
                "7:15 PM",
                "7:30 PM",
                "7:45 PM",
                "8:00 PM",
                "8:15 PM",
                "8:30 PM",
                "8:45 PM",
                "9:00 PM",
                "9:15 PM",
                "9:30 PM",
                "9:45 PM",
                "10:00 PM"
            ]
        },

        squad: {
            name: "SQUAD",
            players: 50,

            entryFee: 20,
            prizePool: 800,

            firstPrize: 450,
            secondPrize: 250,
            thirdPrize: 100,

            timings: [
                "3:00 PM",
                "3:15 PM",
                "3:30 PM",
                "3:45 PM",
                "4:00 PM",
                "4:15 PM",
                "4:30 PM",
                "4:45 PM",
                "5:00 PM",
                "5:15 PM",
                "5:30 PM",
                "5:45 PM",
                "6:00 PM",
                "6:15 PM",
                "6:30 PM",
                "6:45 PM",
                "7:00 PM",
                "7:15 PM",
                "7:30 PM",
                "7:45 PM",
                "8:00 PM",
                "8:15 PM",
                "8:30 PM",
                "8:45 PM",
                "9:00 PM",
                "9:15 PM",
                "9:30 PM",
                "9:45 PM",
                "10:00 PM"
            ]
        }
    },


    clashSquad: {

        name: "CLASH SQUAD",
        icon: "⚔️",

        standard: {

            name: "CLASH SQUAD",

            players: 8,

            entryFee: 20,
            prizePool: 120,

            firstPrize: 70,
            secondPrize: 30,
            thirdPrize: 20,

            timings: [
                "3:00 PM",
                "3:15 PM",
                "3:30 PM",
                "3:45 PM",
                "4:00 PM",
                "4:15 PM",
                "4:30 PM",
                "4:45 PM",
                "5:00 PM",
                "5:15 PM",
                "5:30 PM",
                "5:45 PM",
                "6:00 PM",
                "6:15 PM",
                "6:30 PM",
                "6:45 PM",
                "7:00 PM",
                "7:15 PM",
                "7:30 PM",
                "7:45 PM",
                "8:00 PM",
                "8:15 PM",
                "8:30 PM",
                "8:45 PM",
                "9:00 PM",
                "9:15 PM",
                "9:30 PM",
                "9:45 PM",
                "10:00 PM"
            ]
        }
    },


    loneWolf: {

        name: "LONE WOLF",
        icon: "🐺",

        oneVsOne: {

            name: "1V1",

            players: 2,

            entryFee: 20,
            prizePool: 100,

            firstPrize: 70,
            secondPrize: 30,

            timings: [
                "3:00 PM",
                "3:15 PM",
                "3:30 PM",
                "3:45 PM",
                "4:00 PM",
                "4:15 PM",
                "4:30 PM",
                "4:45 PM",
                "5:00 PM",
                "5:15 PM",
                "5:30 PM",
                "5:45 PM",
                "6:00 PM",
                "6:15 PM",
                "6:30 PM",
                "6:45 PM",
                "7:00 PM",
                "7:15 PM",
                "7:30 PM",
                "7:45 PM",
                "8:00 PM",
                "8:15 PM",
                "8:30 PM",
                "8:45 PM",
                "9:00 PM",
                "9:15 PM",
                "9:30 PM",
                "9:45 PM",
                "10:00 PM"
            ]
        }
    },


    headshotOnly: {

        name: "HEADSHOT ONLY",
        icon: "🎯",

        oneVsOne: {

            name: "1V1",

            players: 2,

            entryFee: 20,
            prizePool: 100,

            firstPrize: 70,
            secondPrize: 30,

            timings: [
                "3:00 PM",
                "3:15 PM",
                "3:30 PM",
                "3:45 PM",
                "4:00 PM",
                "4:15 PM",
                "4:30 PM",
                "4:45 PM",
                "5:00 PM",
                "5:15 PM",
                "5:30 PM",
                "5:45 PM",
                "6:00 PM",
                "6:15 PM",
                "6:30 PM",
                "6:45 PM",
                "7:00 PM",
                "7:15 PM",
                "7:30 PM",
                "7:45 PM",
                "8:00 PM",
                "8:15 PM",
                "8:30 PM",
                "8:45 PM",
                "9:00 PM",
                "9:15 PM",
                "9:30 PM",
                "9:45 PM",
                "10:00 PM"
            ]
        }
    }

};