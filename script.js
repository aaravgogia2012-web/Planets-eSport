/* =========================================
   PLANETS ESPORT - SCRIPT.JS
   FIXED VERSION
   ========================================= */

let currentMode = "";
let currentFormat = "";
let currentTournament = null;

let walletBalance =
    Number(localStorage.getItem("planetsWallet")) || 0;

let isLoggedIn =
    localStorage.getItem("planetsLoggedIn") === "true";

let transactions =
    JSON.parse(
        localStorage.getItem("planetsTransactions") || "[]"
    );

let registeredTournaments =
    JSON.parse(
        localStorage.getItem("planetsRegisteredTournaments") || "[]"
    );


const HELP_FEEDBACK_URL =
    "https://forms.gle/7MCFtkPN4bV3vq6j6";


/* =========================================
   ACCOUNT MEMORY
   ========================================= */

let currentAccount =
    JSON.parse(
        localStorage.getItem("planetsCurrentAccount") || "null"
    );

let previousAccount =
    JSON.parse(
        localStorage.getItem("planetsPreviousAccount") || "null"
    );


/* =========================================
   STARTUP
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /*
       Prevent the page from remaining blank if
       another function has an error.
    */

    document.documentElement.style.visibility = "visible";
    document.body.style.visibility = "visible";

    addLoginStyles();
    removeBlueTapEffect();

    updateWallet();
    renderTransactions();
    renderMyTournaments();
    updateLoginStatus();
    renderAccountInformation();

    setupModeButtons();
    setupProfileOptions();
    setupHelpFeedback();

    /*
       Make sure the correct initial page is shown.
    */

    const activePage =
        document.querySelector(".page.active");

    if (!activePage) {
        showPage("home");
    }

});


/* =========================================
   PAGE NAVIGATION
   ========================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.classList.remove("active");
    });


    const page =
        document.getElementById(pageId);

    if (!page) {

        /*
           If an old/missing page is requested,
           don't leave the website blank.
        */

        const home =
            document.getElementById("home");

        if (home) {
            home.classList.add("active");
        }

        return;
    }


    page.classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (pageId === "account-info") {
        renderAccountInformation();
    }


    if (
        pageId === "my-tournaments" ||
        pageId === "profile"
    ) {
        renderMyTournaments();
    }


    if (pageId === "wallet") {

        updateWallet();
        renderTransactions();

    }


    updateHub(pageId);
}


/* =========================================
   BOTTOM HUB
   ========================================= */

function updateHub(pageId) {

    document
        .querySelectorAll(".hub-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    if (pageId === "home") {

        document
            .querySelector(".hub-item:nth-child(1)")
            ?.classList.add("active");

    }


    if (
        pageId === "tournaments" ||
        pageId === "formats" ||
        pageId === "tournament-list" ||
        pageId === "details"
    ) {

        document
            .querySelector(".hub-item:nth-child(2)")
            ?.classList.add("active");

    }


    if (pageId === "wallet") {

        document
            .querySelector(".hub-item:nth-child(4)")
            ?.classList.add("active");

    }


    if (
        pageId === "profile" ||
        pageId === "account-info" ||
        pageId === "my-tournaments"
    ) {

        document
            .querySelector(".hub-item:nth-child(5)")
            ?.classList.add("active");

    }

}


/* =========================================
   TOURNAMENT MODES
   ========================================= */

function getModes() {

    if (
        typeof TOURNAMENTS === "undefined"
    ) {

        console.error(
            "tournaments.js was not loaded."
        );

        return {};

    }


    return {

        battle: {

            name:
                TOURNAMENTS.battleRoyale.name,

            icon:
                TOURNAMENTS.battleRoyale.icon,

            formats: [

                TOURNAMENTS.battleRoyale.solo,

                TOURNAMENTS.battleRoyale.duo,

                TOURNAMENTS.battleRoyale.squad

            ]

        },


        clash: {

            name:
                TOURNAMENTS.clashSquad.name,

            icon:
                TOURNAMENTS.clashSquad.icon,

            formats: [

                TOURNAMENTS.clashSquad.standard

            ]

        },


        lone: {

            name:
                TOURNAMENTS.loneWolf.name,

            icon:
                TOURNAMENTS.loneWolf.icon,

            formats: [

                TOURNAMENTS.loneWolf.oneVsOne

            ]

        },


        headshot: {

            name:
                TOURNAMENTS.headshotOnly.name,

            icon:
                TOURNAMENTS.headshotOnly.icon,

            formats: [

                TOURNAMENTS.headshotOnly.oneVsOne

            ]

        }

    };

}


/* =========================================
   MODE BUTTONS
   ========================================= */

function setupModeButtons() {

    const selectors = [

        "[data-mode]",
        ".mode-card",
        ".mode-option",
        ".battle-mode",
        ".mode-button",
        ".game-mode"

    ];


    const buttons = [];


    selectors.forEach(function (selector) {

        document
            .querySelectorAll(selector)
            .forEach(function (element) {

                if (!buttons.includes(element)) {
                    buttons.push(element);
                }

            });

    });


    buttons.forEach(function (button) {

        if (
            button.dataset.modeBound === "true"
        ) {
            return;
        }


        let mode =
            button.dataset.mode;


        if (!mode) {

            const text =
                button.innerText.toLowerCase();


            if (
                text.includes("battle") ||
                text.includes("br")
            ) {
                mode = "battle";
            }

            else if (
                text.includes("clash")
            ) {
                mode = "clash";
            }

            else if (
                text.includes("lone")
            ) {
                mode = "lone";
            }

            else if (
                text.includes("headshot")
            ) {
                mode = "headshot";
            }

        }


        if (mode) {

            button.dataset.modeBound =
                "true";


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    openMode(mode);

                }
            );

        }

    });

}


/* =========================================
   OPEN MODE
   ========================================= */

function openMode(mode) {

    const modes =
        getModes();


    if (!modes[mode]) {

        showMessage(
            "Tournament",
            "Tournament modes are currently unavailable.",
            "warning"
        );

        return;

    }


    currentMode = mode;


    const data =
        modes[mode];


    setText(
        "format-mode",
        data.name
    );


    const container =
        document.getElementById(
            "format-container"
        );


    if (!container) {

        showPage("formats");

        return;

    }


    container.innerHTML = "";


    data.formats.forEach(
        function (format) {

            if (!format) return;


            const card =
                document.createElement("div");


            card.className =
                "format-card";


            card.innerHTML = `

                <div class="format-icon">
                    ${data.icon}
                </div>

                <h3>
                    ${format.name}
                </h3>

                <p>
                    ${format.players} players
                </p>

                <button
                    type="button"
                    class="format-select-button">

                    VIEW TOURNAMENTS

                </button>

            `;


            const button =
                card.querySelector(
                    ".format-select-button"
                );


            if (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openTournamentList(
                            format.name
                        );

                    }
                );

            }


            container.appendChild(card);

        }
    );


    showPage("formats");

}


/* =========================================
   TOURNAMENT LIST
   ========================================= */

function openTournamentList(format) {

    const modes =
        getModes();


    const data =
        modes[currentMode];


    if (!data) return;


    currentFormat =
        format;


    const formatData =
        data.formats.find(
            function (item) {

                return item &&
                    item.name === format;

            }
        );


    if (!formatData) return;


    setText(
        "list-mode",
        data.name
    );


    setText(
        "list-title",
        format + " TOURNAMENTS"
    );


    const container =
        document.getElementById(
            "tournament-container"
        );


    if (!container) return;


    container.innerHTML = "";


    const timings =
        formatData.timings || [];


    if (timings.length === 0) {

        container.innerHTML = `

            <div class="my-tournaments-empty">

                <div class="empty-tournament-icon">
                    🏆
                </div>

                <h2>
                    NO TOURNAMENTS AVAILABLE
                </h2>

                <p>
                    There are currently no tournaments
                    available for this format.
                </p>

            </div>

        `;

    }


    timings.forEach(
        function (time, index) {

            const card =
                document.createElement("div");


            card.className =
                "tournament-card";


            card.innerHTML = `

                <div>

                    <small>
                        ${data.name}
                    </small>

                    <h3>
                        ${format} BATTLE
                    </h3>

                    <p>
                        🕒 ${time}
                    </p>

                </div>

                <div class="tournament-info">

                    <div>

                        <small>
                            ENTRY
                        </small>

                        <strong>
                            ₹${formatData.entryFee}
                        </strong>

                    </div>

                    <div>

                        <small>
                            PRIZE
                        </small>

                        <strong>
                            ₹${formatData.prizePool}
                        </strong>

                    </div>

                    <div>

                        <small>
                            PLAYERS
                        </small>

                        <strong>
                            ${formatData.players}
                        </strong>

                    </div>

                    <button
                        type="button"
                        class="view-btn">

                        VIEW

                    </button>

                </div>

            `;


            const viewButton =
                card.querySelector(".view-btn");


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function () {

                        viewTournament(
                            index,
                            time
                        );

                    }
                );

            }


            container.appendChild(card);

        }
    );


    showPage("tournament-list");

}


/* =========================================
   TOURNAMENT DETAILS
   ========================================= */

function viewTournament(index, time) {

    const modes =
        getModes();


    const data =
        modes[currentMode];


    if (!data) return;


    const formatData =
        data.formats.find(
            function (item) {

                return item &&
                    item.name === currentFormat;

            }
        );


    if (!formatData) return;


    currentTournament = {

        mode:
            data.name,

        format:
            currentFormat,

        entry:
            Number(formatData.entryFee),

        prize:
            Number(formatData.prizePool),

        players:
            formatData.players,

        time:
            time

    };


    setText(
        "details-mode",
        data.name
    );


    setText(
        "details-name",
        currentFormat +
        " TOURNAMENT"
    );


    setText(
        "details-format",
        currentFormat +
        " • " +
        time
    );


    setText(
        "details-entry",
        "₹" +
        formatData.entryFee
    );


    setText(
        "details-prize",
        "₹" +
        formatData.prizePool
    );


    setText(
        "details-players",
        formatData.players
    );


    setText(
        "details-time",
        time
    );


    showPage("details");

}


/* =========================================
   JOIN TOURNAMENT
   ========================================= */

function joinTournament() {

    if (!currentTournament) {

        showMessage(
            "Tournament",
            "Please select a tournament first.",
            "warning"
        );

        return;

    }


    if (!isLoggedIn) {

        localStorage.setItem(
            "returnAfterLogin",
            "details"
        );


        showMessage(
            "Login Required",
            "Please login or create an account before joining.",
            "warning"
        );


        setTimeout(
            function () {

                closeMessage();

                showPage("login");

            },
            3000
        );


        return;

    }


    const entryFee =
        Number(currentTournament.entry);


    if (walletBalance < entryFee) {

        showMessage(
            "Insufficient Balance",
            "Entry Fee: ₹" +
            entryFee +
            "\nYour Balance: ₹" +
            walletBalance.toFixed(2),
            "warning"
        );


        setTimeout(
            function () {

                closeMessage();

                showPage("wallet");

            },
            3000
        );


        return;

    }


    const alreadyRegistered =
        registeredTournaments.some(
            function (tournament) {

                return (

                    tournament.mode ===
                    currentTournament.mode &&

                    tournament.format ===
                    currentTournament.format &&

                    tournament.time ===
                    currentTournament.time

                );

            }
        );


    if (alreadyRegistered) {

        showMessage(
            "Already Registered",
            "You are already registered for this tournament.",
            "info"
        );

        return;

    }


    walletBalance -= entryFee;


    registeredTournaments.push({

        id:
            Date.now(),

        mode:
            currentTournament.mode,

        format:
            currentTournament.format,

        entry:
            currentTournament.entry,

        prize:
            currentTournament.prize,

        players:
            currentTournament.players,

        time:
            currentTournament.time,

        status:
            "REGISTERED"

    });


    saveRegisteredTournaments();


    addTransaction(
        "🎮",
        "Tournament Entry",
        currentTournament.format +
        " • " +
        currentTournament.time +
        " • -₹" +
        entryFee
    );


    saveWallet();

    updateWallet();

    renderMyTournaments();


    showMessage(
        "Tournament Joined!",
        "You have successfully registered for " +
        currentTournament.format +
        " at " +
        currentTournament.time +
        ".",
        "success"
    );

}


/* =========================================
   REGISTERED TOURNAMENTS
   ========================================= */

function saveRegisteredTournaments() {

    localStorage.setItem(
        "planetsRegisteredTournaments",
        JSON.stringify(
            registeredTournaments
        )
    );

}


function renderMyTournaments() {

    const container =
        document.getElementById(
            "my-tournaments-container"
        );


    if (!container) return;


    try {

        registeredTournaments =
            JSON.parse(
                localStorage.getItem(
                    "planetsRegisteredTournaments"
                ) || "[]"
            );

    }

    catch (error) {

        registeredTournaments = [];

    }


    if (!Array.isArray(registeredTournaments)) {
        registeredTournaments = [];
    }


    container.innerHTML = "";


    if (
        registeredTournaments.length === 0
    ) {

        container.innerHTML = `

            <div class="my-tournaments-empty">

                <div class="empty-tournament-icon">
                    🏆
                </div>

                <h2>
                    NO TOURNAMENTS YET
                </h2>

                <p>
                    You haven't joined any tournaments yet.
                </p>

                <p class="empty-subtext">
                    Please join a tournament and it will
                    appear here automatically.
                </p>

                <button
                    type="button"
                    class="battle-button"
                    onclick="showPage('tournaments')">

                    🎮 JOIN A TOURNAMENT

                </button>

            </div>

        `;

        return;

    }


    registeredTournaments.forEach(
        function (tournament) {

            const card =
                document.createElement("div");


            card.className =
                "my-tournament-card";


            card.innerHTML = `

                <div class="my-tournament-top">

                    <div>

                        <span class="my-tournament-mode">
                            ${tournament.mode || "TOURNAMENT"}
                        </span>

                        <h3>
                            ${tournament.format || "Tournament"}
                        </h3>

                    </div>

                    <span class="registered-badge">
                        ✓ REGISTERED
                    </span>

                </div>

                <div class="my-tournament-details">

                    <div>

                        <small>
                            🕒 TIME
                        </small>

                        <strong>
                            ${tournament.time || "TBA"}
                        </strong>

                    </div>

                    <div>

                        <small>
                            💰 ENTRY
                        </small>

                        <strong>
                            ₹${Number(tournament.entry || 0)}
                        </strong>

                    </div>

                    <div>

                        <small>
                            🏆 PRIZE
                        </small>

                        <strong>
                            ₹${Number(tournament.prize || 0)}
                        </strong>

                    </div>

                    <div>

                        <small>
                            👥 PLAYERS
                        </small>

                        <strong>
                            ${tournament.players || "TBA"}
                        </strong>

                    </div>

                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* =========================================
   LOGIN STATUS
   ========================================= */

function updateLoginStatus() {

    const selectors = [

        ".login-status",
        "#login-status",
        ".login-btn",
        ".top-login",
        "#login-btn"

    ];


    document
        .querySelectorAll(
            selectors.join(",")
        )
        .forEach(
            function (element) {

                if (isLoggedIn) {

                    element.textContent =
                        "✓ LOGGED IN";


                    element.classList.remove(
                        "planets-login"
                    );


                    element.classList.add(
                        "planets-logged-in"
                    );


                    element.onclick =
                        function (event) {

                            event.preventDefault();

                            openPersonalDetails();

                        };

                }

                else {

                    element.textContent =
                        "LOGIN";


                    element.classList.remove(
                        "planets-logged-in"
                    );


                    element.classList.add(
                        "planets-login"
                    );


                    element.onclick =
                        function (event) {

                            event.preventDefault();

                            showPage("login");

                        };

                }

            }
        );

}


/* =========================================
   PERSONAL DETAILS
   ========================================= */

function openPersonalDetails() {

    if (!isLoggedIn) {

        showPage("login");

        return;

    }


    /*
       If the HTML has the page, use it.
    */

    const accountPage =
        document.getElementById(
            "account-info"
        );


    if (accountPage) {

        renderAccountInformation();

        showPage("account-info");

        return;

    }


    /*
       Fallback: open profile if the older
       HTML doesn't contain account-info.
    */

    showPage("profile");

}


/* =========================================
   ACCOUNT INFORMATION
   ========================================= */

function renderAccountInformation() {

    const container =
        document.getElementById(
            "account-details-content"
        );


    if (!container) return;


    if (!isLoggedIn) {

        container.innerHTML = `

            <div style="text-align:center;">

                <div style="
                    font-size:42px;
                    margin-bottom:12px;
                ">
                    👤
                </div>

                <h2>
                    LOGIN REQUIRED
                </h2>

                <p style="
                    opacity:.7;
                    margin:10px 0 20px;
                ">
                    Login to view your personal details.
                </p>

                <button
                    class="battle-button"
                    type="button"
                    onclick="showPage('login')">

                    LOGIN

                </button>

            </div>

        `;

        return;

    }


    const accountName =
        currentAccount?.firstName ||
        currentAccount?.name ||
        "Player";


    const accountEmail =
        currentAccount?.email ||
        "Account email";


    container.innerHTML = `

        <div style="
            display:flex;
            flex-direction:column;
            gap:18px;
        ">

            <div style="
                text-align:center;
                margin-bottom:8px;
            ">

                <div style="
                    width:72px;
                    height:72px;
                    margin:0 auto 12px;
                    border-radius:50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:32px;
                    background:rgba(255,255,255,.06);
                    border:1px solid rgba(255,255,255,.12);
                ">
                    👤
                </div>

                <h2>
                    Personal Details
                </h2>

                <div style="
                    display:inline-flex;
                    align-items:center;
                    gap:6px;
                    padding:6px 11px;
                    border-radius:10px;
                    background:rgba(34,197,94,.10);
                    border:1px solid rgba(34,197,94,.30);
                    color:#63e887;
                    font-size:11px;
                    font-weight:800;
                ">

                    ✓ LOGGED IN

                </div>

            </div>


            <div class="account-info-row">

                <small>
                    NAME
                </small>

                <strong>
                    ${escapeHTML(accountName)}
                </strong>

            </div>


            <div class="account-info-row">

                <small>
                    EMAIL
                </small>

                <strong>
                    ${escapeHTML(accountEmail)}
                </strong>

            </div>


            <div class="account-info-row">

                <small>
                    TOURNAMENTS JOINED
                </small>

                <strong>
                    ${registeredTournaments.length}
                </strong>

            </div>


            <div class="account-info-row">

                <small>
                    WALLET BALANCE
                </small>

                <strong>
                    ₹${walletBalance.toFixed(2)}
                </strong>

            </div>


            <button
                class="switch-account-button"
                type="button"
                onclick="switchAccount()">

                ⇄ &nbsp; SWITCH ACCOUNT

            </button>

        </div>

    `;

}


/* =========================================
   PROFILE OPTIONS
   ========================================= */

function setupProfileOptions() {

    /*
       Personal details
    */

    document
        .querySelectorAll(
            ".personal-details, [data-profile='personal'], [data-profile='details']"
        )
        .forEach(
            function (element) {

                element.onclick =
                    function (event) {

                        event.preventDefault();

                        openPersonalDetails();

                    };

            }
        );


    /*
       My tournaments
    */

    document
        .querySelectorAll(
            ".my-tournaments, [data-profile='tournaments']"
        )
        .forEach(
            function (element) {

                element.onclick =
                    function (event) {

                        event.preventDefault();

                        openMyTournaments();

                    };

            }
        );


    /*
       Help and feedback
    */

    setupHelpFeedback();

}


/* =========================================
   MY TOURNAMENTS
   ========================================= */

function openMyTournaments() {

    renderMyTournaments();


    if (
        document.getElementById(
            "my-tournaments"
        )
    ) {

        showPage("my-tournaments");

        return;

    }


    /*
       If the old HTML does not contain
       a separate My Tournaments page,
       show it inside the profile page
       without changing the overall GUI.
    */

    showPage("profile");


    const container =
        document.getElementById(
            "my-tournaments-container"
        );


    if (container) {

        container.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================
   HELP & FEEDBACK
   ========================================= */

function setupHelpFeedback() {

    document
        .querySelectorAll(
            ".help-feedback, [data-profile='help'], [data-profile='feedback']"
        )
        .forEach(
            function (element) {

                element.removeAttribute("onclick");


                if (
                    element.tagName.toLowerCase() === "a"
                ) {

                    element.href =
                        HELP_FEEDBACK_URL;

                    element.target =
                        "_blank";

                    element.rel =
                        "noopener noreferrer";

                }


                element.onclick =
                    function (event) {

                        event.preventDefault();

                        openHelpFeedback();

                    };

            }
        );

}


function openHelpFeedback() {

    /*
       Direct navigation is more reliable
       on mobile than window.open().
    */

    const link =
        document.createElement("a");


    link.href =
        HELP_FEEDBACK_URL;


    link.target =
        "_blank";


    link.rel =
        "noopener noreferrer";


    document.body.appendChild(link);


    link.click();


    setTimeout(
        function () {

            link.remove();

        },
        1000
    );

}


/* =========================================
   ACCOUNT SWITCHING
   ========================================= */

function switchAccount() {

    closeMessage();


    const popup =
        document.createElement("div");


    popup.id =
        "pe-message";


    popup.className =
        "pe-popup";


    popup.innerHTML = `

        <div class="pe-popup-card">

            <div class="pe-popup-icon">
                ⇄
            </div>

            <h2>
                Switch Account?
            </h2>

            <p>
                You can log into another account.
                Your current account will be saved
                so you can switch back later.
            </p>

            <div class="pe-popup-actions">

                <button
                    type="button"
                    onclick="confirmSwitchAccount()">

                    SWITCH

                </button>

                <button
                    type="button"
                    class="cancel"
                    onclick="closeMessage()">

                    CANCEL

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(popup);

}


function confirmSwitchAccount() {

    /*
       Save the current account so it can be
       restored later.
    */

    if (currentAccount) {

        previousAccount =
            currentAccount;

        localStorage.setItem(
            "planetsPreviousAccount",
            JSON.stringify(
                previousAccount
            )
        );

    }


    isLoggedIn = false;


    localStorage.setItem(
        "planetsLoggedIn",
        "false"
    );


    updateLoginStatus();

    renderAccountInformation();

    closeMessage();

    showPage("login");

    showSwitchBackOption();

}


/* =========================================
   SWITCH BACK TO PREVIOUS ACCOUNT
   ========================================= */

function showSwitchBackOption() {

    if (!previousAccount) return;


    setTimeout(
        function () {

            const loginPage =
                document.getElementById(
                    "login"
                );


            if (!loginPage) return;


            let existing =
                document.getElementById(
                    "switch-back-account"
                );


            if (existing) {
                existing.remove();
            }


            existing =
                document.createElement("div");


            existing.id =
                "switch-back-account";


            existing.style.cssText = `
                margin-top:18px;
                padding:16px;
                border-radius:16px;
                background:rgba(255,255,255,.035);
                border:1px solid rgba(255,255,255,.09);
                text-align:center;
            `;


            existing.innerHTML = `

                <div style="
                    font-size:12px;
                    opacity:.65;
                    margin-bottom:8px;
                ">
                    PREVIOUS ACCOUNT
                </div>

                <strong>
                    ${escapeHTML(
                        previousAccount.email ||
                        previousAccount.name ||
                        "Saved account"
                    )}
                </strong>

                <button
                    type="button"
                    class="battle-button full"
                    style="margin-top:12px;"
                    onclick="switchBackToPreviousAccount()">

                    ↩ SWITCH BACK

                    <span>→</span>

                </button>

            `;


            const authBox =
                loginPage.querySelector(
                    ".auth-box"
                );


            if (authBox) {

                authBox.appendChild(
                    existing
                );

            }

        },
        100
    );

}


function switchBackToPreviousAccount() {

    if (!previousAccount) {

        showPage("login");

        return;

    }


    currentAccount =
        previousAccount;


    isLoggedIn = true;


    localStorage.setItem(
        "planetsCurrentAccount",
        JSON.stringify(
            currentAccount
        )
    );


    localStorage.setItem(
        "planetsLoggedIn",
        "true"
    );


    /*
       Remove the previous account after
       successfully switching back.
    */

    previousAccount = null;


    localStorage.removeItem(
        "planetsPreviousAccount"
    );


    updateLoginStatus();

    renderAccountInformation();


    document
        .getElementById(
            "switch-back-account"
        )
        ?.remove();


    showLoginSuccessPopup();

}


/* =========================================
   LOGIN
   ========================================= */

function loginSubmit(event) {

    event.preventDefault();


    const form =
        event.target;


    const emailInput =
        form.querySelector(
            'input[type="email"]'
        );


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    /*
       Save a simple account profile locally.
       This keeps the existing frontend system
       working without changing the GUI.
    */

    currentAccount = {

        email:
            email,

        name:
            email.split("@")[0] ||
            "Player"

    };


    isLoggedIn = true;


    localStorage.setItem(
        "planetsLoggedIn",
        "true"
    );


    localStorage.setItem(
        "planetsCurrentAccount",
        JSON.stringify(
            currentAccount
        )
    );


    updateLoginStatus();

    renderAccountInformation();


    /*
       Remove switch-back box after login.
    */

    document
        .getElementById(
            "switch-back-account"
        )
        ?.remove();


    const returnPage =
        localStorage.getItem(
            "returnAfterLogin"
        );


    localStorage.removeItem(
        "returnAfterLogin"
    );


    showLoginSuccessPopup();


    setTimeout(
        function () {

            if (
                returnPage === "details" &&
                currentTournament
            ) {

                showPage("details");

            }

            else {

                showPage("home");

            }

        },
        5000
    );

}


/* =========================================
   SIGN UP
   ========================================= */

function signupSubmit(event) {

    event.preventDefault();


    const form =
        event.target;


    const passwords =
        form.querySelectorAll(
            'input[type="password"]'
        );


    if (
        passwords.length >= 2 &&
        passwords[0].value !==
        passwords[1].value
    ) {

        showMessage(
            "Password Error",
            "The passwords do not match.",
            "error"
        );

        return;

    }


    const inputs =
        form.querySelectorAll(
            "input"
        );


    let firstName = "";
    let lastName = "";
    let email = "";


    inputs.forEach(
        function (input) {

            const placeholder =
                (
                    input.placeholder ||
                    ""
                ).toLowerCase();


            if (
                placeholder.includes(
                    "first name"
                )
            ) {

                firstName =
                    input.value.trim();

            }


            if (
                placeholder.includes(
                    "last name"
                )
            ) {

                lastName =
                    input.value.trim();

            }


            if (
                input.type === "email"
            ) {

                email =
                    input.value.trim();

            }

        }
    );


    currentAccount = {

        firstName:
            firstName,

        lastName:
            lastName,

        name:
            (
                firstName +
                " " +
                lastName
            ).trim() ||
            "Player",

        email:
            email

    };


    isLoggedIn = true;


    localStorage.setItem(
        "planetsLoggedIn",
        "true"
    );


    localStorage.setItem(
        "planetsCurrentAccount",
        JSON.stringify(
            currentAccount
        )
    );


    updateLoginStatus();

    renderAccountInformation();


    showLoginSuccessPopup();


    setTimeout(
        function () {

            showPage("home");

        },
        5000
    );

}


/* =========================================
   LOGIN SUCCESS
   ========================================= */

function showLoginSuccessPopup() {

    document
        .getElementById(
            "pe-login-success"
        )
        ?.remove();


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "pe-login-success";


    popup.className =
        "pe-popup";


    popup.innerHTML = `

        <div class="pe-popup-card">

            <div class="pe-popup-icon">
                ✓
            </div>

            <h2>
                Login Successful
            </h2>

            <p>
                Welcome to Planets Esport.
                <br>
                You're ready to join tournaments.
            </p>

            <button
                class="pe-popup-button"
                type="button"
                onclick="closeLoginSuccessPopup()">

                CONTINUE

            </button>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    setTimeout(
        closeLoginSuccessPopup,
        8000
    );

}


function closeLoginSuccessPopup() {

    document
        .getElementById(
            "pe-login-success"
        )
        ?.remove();

}


/* =========================================
   WALLET
   ========================================= */

function saveWallet() {

    localStorage.setItem(
        "planetsWallet",
        walletBalance.toString()
    );


    localStorage.setItem(
        "planetsTransactions",
        JSON.stringify(
            transactions
        )
    );

}


function updateWallet() {

    const balance =
        document.getElementById(
            "wallet-balance"
        );


    if (balance) {

        balance.textContent =
            "₹" +
            walletBalance.toFixed(2);

    }

}


/* =========================================
   WALLET DEMO
   ========================================= */

function showWalletDemo() {

    showMessage(
        "Wallet",
        "Wallet deposits and withdrawals are not connected yet. This is currently a frontend demo.",
        "info"
    );

}


/* =========================================
   TRANSACTIONS
   ========================================= */

function addTransaction(
    icon,
    title,
    description
) {

    transactions.unshift({

        icon:
            icon,

        title:
            title,

        description:
            description

    });


    saveWallet();

    renderTransactions();

}


function renderTransactions() {

    const container =
        document.getElementById(
            "transactions"
        );


    if (!container) return;


    if (
        transactions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-transactions">

                <div>
                    💰
                </div>

                <p>
                    No transactions yet
                </p>

                <small>
                    Wallet activity will appear here.
                </small>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    transactions.forEach(
        function (transaction) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "transaction";


            item.innerHTML = `

                <div class="transaction-icon">
                    ${transaction.icon}
                </div>

                <div class="transaction-info">

                    <strong>
                        ${escapeHTML(
                            transaction.title
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            transaction.description
                        )}
                    </small>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================
   POPUPS
   ========================================= */

function showMessage(
    title,
    message,
    type = "info"
) {

    closeMessage();


    const icons = {

        info:
            "ℹ",

        success:
            "✓",

        warning:
            "!",

        error:
            "×"

    };


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "pe-message";


    popup.className =
        "pe-popup";


    popup.innerHTML = `

        <div class="pe-popup-card">

            <div class="pe-popup-icon">
                ${icons[type] || "ℹ"}
            </div>

            <h2>
                ${escapeHTML(title)}
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                class="pe-popup-button"
                type="button"
                onclick="closeMessage()">

                OK

            </button>

        </div>

    `;


    document.body.appendChild(
        popup
    );

}


function closeMessage() {

    document
        .getElementById(
            "pe-message"
        )
        ?.remove();

}


/* =========================================
   HELPER
   ========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================
   ESCAPE HTML
   ========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   REMOVE BLUE TAP EFFECT
   ========================================= */

function removeBlueTapEffect() {

    if (
        document.getElementById(
            "planets-tap-style"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "planets-tap-style";


    style.textContent = `

        * {
            -webkit-tap-highlight-color:
                transparent;
        }

        button,
        a,
        input,
        select,
        textarea {
            outline:none !important;
        }

        button:focus,
        button:active,
        a:focus,
        a:active {
            outline:none !important;
        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================
   EXTRA STYLES
   ========================================= */

function addLoginStyles() {

    if (
        document.getElementById(
            "planets-account-style"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "planets-account-style";


    style.textContent = `

        .planets-login {

            display:inline-flex !important;

            align-items:center;

            justify-content:center;

            padding:7px 13px;

            border-radius:10px;

            font-size:12px;

            font-weight:700;

            white-space:nowrap;

            cursor:pointer;

        }


        .planets-logged-in {

            display:inline-flex !important;

            align-items:center;

            justify-content:center;

            gap:6px;

            padding:7px 12px;

            border-radius:11px;

            background:
                rgba(34,197,94,.10);

            border:
                1px solid
                rgba(34,197,94,.30);

            color:#63e887 !important;

            font-size:11px;

            font-weight:800;

            white-space:nowrap;

            cursor:pointer;

        }


        .account-info-row {

            display:flex;

            align-items:center;

            justify-content:space-between;

            padding:15px 16px;

            border-radius:14px;

            background:
                rgba(255,255,255,.035);

            border:
                1px solid
                rgba(255,255,255,.08);

        }


        .account-info-row small {

            opacity:.55;

            font-size:10px;

            font-weight:700;

        }


        .account-info-row strong {

            font-size:14px;

            max-width:60%;

            text-align:right;

        }


        .switch-account-button {

            width:100%;

            padding:13px;

            margin-top:5px;

            border-radius:13px;

            border:
                1px solid
                rgba(255,255,255,.12);

            background:
                rgba(255,255,255,.06);

            color:inherit;

            font-weight:800;

            cursor:pointer;

        }


        .my-tournaments-empty {

            text-align:center;

            padding:35px 20px;

            border-radius:20px;

            background:
                rgba(255,255,255,.035);

            border:
                1px solid
                rgba(255,255,255,.08);

        }


        .empty-tournament-icon {

            font-size:50px;

            margin-bottom:12px;

        }


        .my-tournaments-empty h2 {

            margin:0 0 10px;

            font-size:20px;

        }


        .my-tournaments-empty p {

            margin:7px 0;

            opacity:.75;

            font-size:13px;

        }


        .my-tournaments-empty
        .empty-subtext {

            opacity:.5;

            margin-bottom:22px;

        }


        .my-tournament-card {

            padding:18px;

            margin-bottom:14px;

            border-radius:18px;

            background:
                rgba(255,255,255,.035);

            border:
                1px solid
                rgba(255,255,255,.09);

        }


        .my-tournament-top {

            display:flex;

            align-items:flex-start;

            justify-content:space-between;

            gap:10px;

            margin-bottom:17px;

        }


        .my-tournament-mode {

            font-size:10px;

            opacity:.5;

            text-transform:uppercase;

        }


        .my-tournament-card h3 {

            margin:5px 0 0;

            font-size:17px;

        }


        .registered-badge {

            padding:6px 8px;

            border-radius:8px;

            background:
                rgba(34,197,94,.10);

            border:
                1px solid
                rgba(34,197,94,.25);

            color:#63e887;

            font-size:9px;

            font-weight:800;

            white-space:nowrap;

        }


        .my-tournament-details {

            display:grid;

            grid-template-columns:
                repeat(2,1fr);

            gap:10px;

        }


        .my-tournament-details > div {

            padding:11px;

            border-radius:11px;

            background:
                rgba(255,255,255,.035);

        }


        .my-tournament-details small {

            display:block;

            opacity:.5;

            font-size:9px;

            margin-bottom:5px;

        }


        .my-tournament-details strong {

            font-size:12px;

        }


        .pe-popup {

            position:fixed;

            inset:0;

            display:flex;

            align-items:center;

            justify-content:center;

            padding:20px;

            background:
                rgba(0,0,0,.78);

            backdrop-filter:
                blur(8px);

            -webkit-backdrop-filter:
                blur(8px);

            z-index:99999;

        }


        .pe-popup-card {

            width:
                min(380px,100%);

            padding:28px 23px 22px;

            border-radius:22px;

            background:
                linear-gradient(
                    145deg,
                    #191919,
                    #0b0b0b
                );

            border:
                1px solid
                rgba(255,255,255,.12);

            text-align:center;

            box-shadow:
                0 25px 80px
                rgba(0,0,0,.65);

        }


        .pe-popup-icon {

            width:64px;

            height:64px;

            margin:
                0 auto 15px;

            display:flex;

            align-items:center;

            justify-content:center;

            border-radius:50%;

            background:
                rgba(34,197,94,.10);

            border:
                1px solid
                rgba(34,197,94,.30);

            color:#63e887;

            font-size:30px;

            font-weight:900;

        }


        .pe-popup-card h2 {

            margin:
                0 0 8px;

            font-size:21px;

        }


        .pe-popup-card p {

            margin:0;

            opacity:.72;

            line-height:1.5;

            font-size:13px;

            white-space:pre-line;

        }


        .pe-popup-button {

            width:100%;

            margin-top:20px;

            padding:12px;

            border:none;

            border-radius:12px;

            font-weight:800;

            cursor:pointer;

        }


        .pe-popup-actions {

            display:flex;

            gap:10px;

            margin-top:20px;

        }


        .pe-popup-actions button {

            flex:1;

            padding:12px;

            border:none;

            border-radius:12px;

            font-weight:800;

            cursor:pointer;

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================
   WHITE SCREEN PROTECTION
   ========================================= */

/*
   This does NOT replace your CSS.
   It only prevents JavaScript from leaving
   the site without a visible page.
*/

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Planets Esport error:",
            event.error || event.message
        );


        const pages =
            document.querySelectorAll(".page");


        let visiblePage = false;


        pages.forEach(function (page) {

            if (
                page.classList.contains(
                    "active"
                )
            ) {

                visiblePage = true;

            }

        });


        if (!visiblePage) {

            const home =
                document.getElementById(
                    "home"
                );


            if (home) {

                home.classList.add(
                    "active"
                );

            }

        }

    }
);


/* =========================================
   END
   ========================================= */