/* =========================================
   PLANETS ESPORT - COMPLETE SCRIPT.JS
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
        localStorage.getItem(
            "planetsRegisteredTournaments"
        ) || "[]"
    );


/* =========================================
   STARTUP
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    addLoginStyles();
    removeBlueTapEffect();

    updateWallet();
    renderTransactions();
    renderMyTournaments();
    updateLoginStatus();
    renderAccountInformation();

    setupModeButtons();
});


/* =========================================
   PAGE NAVIGATION
   ========================================= */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });


    const page =
        document.getElementById(pageId);

    if (!page) return;

    page.classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (pageId === "account-info") {
        renderAccountInformation();
    }


    if (pageId === "my-tournaments") {
        renderMyTournaments();
    }


    if (pageId === "wallet") {
        updateWallet();
        renderTransactions();
    }


    document
        .querySelectorAll(".hub-item")
        .forEach(item => {
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
   MODES
   ========================================= */

function getModes() {

    return {

        battle: {
            name: TOURNAMENTS.battleRoyale.name,
            icon: TOURNAMENTS.battleRoyale.icon,

            formats: [
                TOURNAMENTS.battleRoyale.solo,
                TOURNAMENTS.battleRoyale.duo,
                TOURNAMENTS.battleRoyale.squad
            ]
        },

        clash: {
            name: TOURNAMENTS.clashSquad.name,
            icon: TOURNAMENTS.clashSquad.icon,

            formats: [
                TOURNAMENTS.clashSquad.standard
            ]
        },

        lone: {
            name: TOURNAMENTS.loneWolf.name,
            icon: TOURNAMENTS.loneWolf.icon,

            formats: [
                TOURNAMENTS.loneWolf.oneVsOne
            ]
        },

        headshot: {
            name: TOURNAMENTS.headshotOnly.name,
            icon: TOURNAMENTS.headshotOnly.icon,

            formats: [
                TOURNAMENTS.headshotOnly.oneVsOne
            ]
        }
    };
}


/* =========================================
   MODE BUTTON SETUP
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

    selectors.forEach(selector => {

        document
            .querySelectorAll(selector)
            .forEach(element => {

                if (!buttons.includes(element)) {
                    buttons.push(element);
                }
            });
    });


    buttons.forEach(button => {

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

            } else if (
                text.includes("clash")
            ) {
                mode = "clash";

            } else if (
                text.includes("lone")
            ) {
                mode = "lone";

            } else if (
                text.includes("headshot")
            ) {
                mode = "headshot";
            }
        }


        if (mode) {

            button.dataset.modeBound = "true";

            button.addEventListener(
                "click",
                function(event) {

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

    const modes = getModes();

    if (!modes[mode]) return;

    currentMode = mode;

    const data = modes[mode];


    const title =
        document.getElementById("format-mode");

    if (title) {
        title.textContent = data.name;
    }


    const container =
        document.getElementById(
            "format-container"
        );

    if (!container) {
        showPage("formats");
        return;
    }


    container.innerHTML = "";


    data.formats.forEach(format => {

        const card =
            document.createElement("div");

        card.className = "format-card";


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


        card
            .querySelector(
                ".format-select-button"
            )
            .addEventListener(
                "click",
                () => {
                    openTournamentList(
                        format.name
                    );
                }
            );


        container.appendChild(card);
    });


    showPage("formats");
}


/* =========================================
   TOURNAMENT LIST
   ========================================= */

function openTournamentList(format) {

    const modes = getModes();

    const data = modes[currentMode];

    if (!data) return;

    currentFormat = format;


    const formatData =
        data.formats.find(
            item => item.name === format
        );


    if (!formatData) return;


    setText("list-mode", data.name);

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


    timings.forEach((time, index) => {

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
                    <small>ENTRY</small>
                    <strong>
                        ₹${formatData.entryFee}
                    </strong>
                </div>

                <div>
                    <small>PRIZE</small>
                    <strong>
                        ₹${formatData.prizePool}
                    </strong>
                </div>

                <div>
                    <small>PLAYERS</small>
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


        card
            .querySelector(".view-btn")
            .addEventListener(
                "click",
                () => {
                    viewTournament(
                        index,
                        time
                    );
                }
            );


        container.appendChild(card);
    });


    showPage("tournament-list");
}


/* =========================================
   TOURNAMENT DETAILS
   ========================================= */

function viewTournament(index, time) {

    const modes = getModes();

    const data = modes[currentMode];

    if (!data) return;


    const formatData =
        data.formats.find(
            item =>
                item.name === currentFormat
        );


    if (!formatData) return;


    currentTournament = {

        mode: data.name,

        format: currentFormat,

        entry:
            Number(formatData.entryFee),

        prize:
            Number(formatData.prizePool),

        players:
            formatData.players,

        time: time
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


        setTimeout(() => {

            closeMessage();

            showPage("login");

        }, 4000);

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


        setTimeout(() => {

            closeMessage();

            showPage("wallet");

        }, 4000);

        return;
    }


    const alreadyRegistered =
        registeredTournaments.some(
            tournament =>
                tournament.mode ===
                    currentTournament.mode &&
                tournament.format ===
                    currentTournament.format &&
                tournament.time ===
                    currentTournament.time
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

        id: Date.now(),

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
   LOGIN STATUS
   ========================================= */

function updateLoginStatus() {

    const selectors = [
        ".login-status",
        "#login-status",
        ".login-dot",
        ".login-btn",
        ".top-login",
        "#login-btn"
    ];


    document
        .querySelectorAll(
            selectors.join(",")
        )
        .forEach(element => {

            if (isLoggedIn) {

                element.textContent =
                    "✓ LOGGED IN";

                element.classList.remove(
                    "planets-login"
                );

                element.classList.add(
                    "planets-logged-in"
                );


                /*
                   Clicking LOGGED IN opens
                   Personal Details.
                */

                element.onclick =
                    function(event) {

                        event.preventDefault();

                        openPersonalDetails();
                    };

            } else {

                element.textContent =
                    "LOGIN";

                element.classList.remove(
                    "planets-logged-in"
                );

                element.classList.add(
                    "planets-login"
                );


                /*
                   Clicking LOGIN opens
                   login page.
                */

                element.onclick =
                    function(event) {

                        event.preventDefault();

                        showPage("login");
                    };
            }
        });
}


/* =========================================
   PERSONAL DETAILS
   ========================================= */

function openPersonalDetails() {

    if (!isLoggedIn) {

        showPage("login");

        return;
    }


    renderAccountInformation();

    showPage("account-info");
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

            <div style="
                text-align:center;
            ">

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
                    onclick="
                        showPage('login')
                    ">

                    LOGIN

                </button>

            </div>
        `;

        return;
    }


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


                <h2 style="
                    margin:0;
                ">
                    Personal Details
                </h2>


                <div style="
                    display:inline-flex;
                    align-items:center;
                    gap:6px;
                    margin-top:9px;
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
                    ACCOUNT STATUS
                </small>

                <strong>
                    Active
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
                onclick="
                    switchAccount()
                ">

                ⇄ &nbsp; SWITCH ACCOUNT

            </button>

        </div>
    `;
}


/* =========================================
   SWITCH ACCOUNT
   ========================================= */

function switchAccount() {

    const popup =
        document.createElement("div");


    popup.id = "pe-message";

    popup.className = "pe-popup";


    popup.innerHTML = `

        <div class="pe-popup-card">

            <div class="pe-popup-icon">
                ⇄
            </div>

            <h2>
                Switch Account?
            </h2>

            <p>
                You'll be logged out of this
                account and taken to the login page.
            </p>

            <div class="pe-popup-actions">

                <button
                    type="button"
                    onclick="
                        confirmSwitchAccount()
                    ">

                    SWITCH

                </button>


                <button
                    type="button"
                    class="cancel"
                    onclick="
                        closeMessage()
                    ">

                    CANCEL

                </button>

            </div>

        </div>
    `;


    document
        .getElementById("pe-message")
        ?.remove();


    document.body.appendChild(popup);
}


function confirmSwitchAccount() {

    isLoggedIn = false;


    localStorage.setItem(
        "planetsLoggedIn",
        "false"
    );


    updateLoginStatus();

    renderAccountInformation();

    closeMessage();

    showPage("login");
}


/* =========================================
   LOGIN
   ========================================= */

function loginSubmit(event) {

    event.preventDefault();


    isLoggedIn = true;


    localStorage.setItem(
        "planetsLoggedIn",
        "true"
    );


    updateLoginStatus();

    renderAccountInformation();


    const returnPage =
        localStorage.getItem(
            "returnAfterLogin"
        );


    localStorage.removeItem(
        "returnAfterLogin"
    );


    showLoginSuccessPopup();


    setTimeout(() => {

        if (
            returnPage === "details" &&
            currentTournament
        ) {

            showPage("details");

        } else {

            showPage("home");
        }

    }, 5000);
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


    isLoggedIn = true;


    localStorage.setItem(
        "planetsLoggedIn",
        "true"
    );


    updateLoginStatus();

    renderAccountInformation();


    showLoginSuccessPopup();


    setTimeout(() => {

        showPage("home");

    }, 5000);
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
        document.createElement("div");


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
                onclick="
                    closeLoginSuccessPopup()
                ">

                CONTINUE

            </button>

        </div>
    `;


    document.body.appendChild(popup);


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
   MY TOURNAMENTS
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


    container.innerHTML = "";


    if (
        registeredTournaments.length === 0
    ) {

        container.innerHTML = `

            <div
                class="details-box"
                style="
                    text-align:center;
                ">

                <div style="
                    font-size:45px;
                    margin-bottom:15px;
                ">
                    🏆
                </div>

                <h2>
                    NO TOURNAMENTS YET
                </h2>

                <p style="
                    margin:12px 0 22px;
                    opacity:.7;
                ">
                    You haven't registered
                    for any tournaments yet.
                </p>

                <button
                    class="battle-button"
                    type="button"
                    onclick="
                        showPage('tournaments')
                    ">

                    FIND A TOURNAMENT

                </button>

            </div>
        `;

        return;
    }


    registeredTournaments.forEach(
        tournament => {

            const card =
                document.createElement("div");


            card.className =
                "tournament-card";


            card.innerHTML = `

                <div>

                    <small>
                        ${tournament.mode}
                    </small>

                    <h3>
                        ${tournament.format}
                    </h3>

                    <p>
                        🕒 ${tournament.time}
                    </p>

                </div>


                <div class="tournament-info">

                    <div>

                        <small>
                            ENTRY
                        </small>

                        <strong>
                            ₹${tournament.entry}
                        </strong>

                    </div>


                    <div>

                        <small>
                            PRIZE
                        </small>

                        <strong>
                            ₹${tournament.prize}
                        </strong>

                    </div>


                    <div>

                        <small>
                            STATUS
                        </small>

                        <strong>
                            ${tournament.status}
                        </strong>

                    </div>

                </div>
            `;


            container.appendChild(card);
        }
    );
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
   TRANSACTIONS
   ========================================= */

function addTransaction(
    icon,
    title,
    description
) {

    transactions.unshift({

        icon: icon,

        title: title,

        description: description
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


    if (transactions.length === 0) {

        container.innerHTML = `

            <div
                class="empty-transactions">

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
        transaction => {

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
                        ${transaction.title}
                    </strong>

                    <small>
                        ${transaction.description}
                    </small>

                </div>
            `;


            container.appendChild(item);
        }
    );
}


/* =========================================
   POPUP
   ========================================= */

function showMessage(
    title,
    message,
    type = "info"
) {

    closeMessage();


    const icons = {

        info: "ℹ",

        success: "✓",

        warning: "!",

        error: "×"
    };


    const popup =
        document.createElement("div");


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
                ${title}
            </h2>

            <p>
                ${message}
            </p>

            <button
                class="pe-popup-button"
                type="button"
                onclick="
                    closeMessage()
                ">

                OK

            </button>

        </div>
    `;


    document.body.appendChild(popup);
}


function closeMessage() {

    document
        .getElementById(
            "pe-message"
        )
        ?.remove();
}


/* =========================================
   HELPERS
   ========================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;
    }
}


/* =========================================
   REMOVE BLUE TAP BOX
   ========================================= */

function removeBlueTapEffect() {

    const style =
        document.createElement("style");


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


    document.head.appendChild(style);
}


/* =========================================
   EXTRA ACCOUNT / POPUP STYLES
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
        document.createElement("style");


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

            box-shadow:
                0 0 15px
                rgba(34,197,94,.08);
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


        .pe-popup-actions .cancel {

            opacity:.7;
        }
    `;


    document.head.appendChild(style);
}