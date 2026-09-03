// ==========================================
// EXPENSEFLOW - ADVANCED EXPENSE TRACKER
// ==========================================


// ---------- DOM ELEMENTS ----------

const expenseForm = document.getElementById("expenseForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const expenseList = document.getElementById("expenseList");
const payableList = document.getElementById("payableList");
const receivableList = document.getElementById("receivableList");
const emiList = document.getElementById("emiList");

const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

const totalExpense = document.getElementById("totalExpense");
const todayExpense = document.getElementById("todayExpense");
const monthlyExpense = document.getElementById("monthlyExpense");
const transactionCount = document.getElementById("transactionCount");
const duePayableTotal = document.getElementById("duePayableTotal");
const duePayableCount = document.getElementById("duePayableCount");
const dueReceivableTotal = document.getElementById("dueReceivableTotal");
const dueReceivableCount = document.getElementById("dueReceivableCount");
const emiDueThisMonth = document.getElementById("emiDueThisMonth");
const emiDueCount = document.getElementById("emiDueCount");
const emiReminder = document.getElementById("emiReminder");

const aiInsights = document.getElementById("aiInsights");

const spendingPace = document.getElementById("spendingPace");
const projectedSpend = document.getElementById("projectedSpend");
const focusCategory = document.getElementById("focusCategory");
const paceProgress = document.getElementById("paceProgress");

const budgetInput = document.getElementById("budgetInput");
const saveBudgetButton = document.getElementById("saveBudget");
const budgetStatus = document.getElementById("budgetStatus");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgressText = document.getElementById("budgetProgressText");
const budgetProgress = document.getElementById("budgetProgress");
const exportExpensesButton = document.getElementById("exportExpenses");
const printBillButton = document.getElementById("printBill");

const categorySummary = document.getElementById("categorySummary");

const expenseCountLabel =
    document.getElementById("expenseCountLabel");

const currentDate =
    document.getElementById("currentDate");

const themeToggle =
    document.getElementById("themeToggle");

const chartPeriod =
    document.getElementById("chartPeriod");

const navigationLinks =
    document.querySelectorAll(".nav-link[data-view]");

const viewSections =
    document.querySelectorAll("[data-view-section]");

const showAddExpenseButton =
    document.getElementById("showAddExpense");


// ---------- VARIABLES ----------

let currentUser = null;
let firebaseUser = null;
let expenses = [];
let payables = [];
let receivables = [];
let emis = [];

let editingId = null;

let expenseChart = null;

let monthlyBudget = 0;

const firebaseConfig = window.EXPENSEFLOW_FIREBASE_CONFIG || {};
const firebaseConfigured = typeof firebase !== "undefined" &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.startsWith("PASTE_") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.startsWith("PASTE_");
const firebaseApp = firebaseConfigured
    ? firebase.initializeApp(firebaseConfig)
    : null;
const auth = firebaseApp ? firebase.auth() : null;
const db = firebaseApp ? firebase.database() : null;


// ---------- SINGLE-PAGE VIEWS ----------

function showView(viewName) {

    viewSections.forEach(function(section) {

        const isActive =
            section.dataset.viewSection === viewName;

        section.hidden = !isActive;
        section.classList.toggle("view-enter", isActive);

    });

    navigationLinks.forEach(function(link) {

        link.classList.toggle(
            "active",
            link.dataset.view === viewName
        );

    });

}


navigationLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();
        showView(link.dataset.view);

    });

});


showAddExpenseButton.addEventListener("click", function() {

    showView("expenses");
    descriptionInput.focus();

});

function normalizeUsername(username) {
    return String(username || "").trim().toLowerCase();
}

function showAuthScreen() {
    const authScreen = document.getElementById("authScreen");
    const appContainer = document.getElementById("app");

    if (authScreen) authScreen.hidden = false;
    if (appContainer) appContainer.hidden = true;
}

function showAppScreen() {
    const authScreen = document.getElementById("authScreen");
    const appContainer = document.getElementById("app");

    if (authScreen) authScreen.hidden = true;
    if (appContainer) appContainer.hidden = false;
}

function updateUserDisplay() {
    const userDisplayName = document.getElementById("userDisplayName");
    const userAccountType = document.getElementById("userAccountType");
    const userAvatar = document.getElementById("userAvatar");

    if (!currentUser) return;

    if (userDisplayName) {
        userDisplayName.textContent = currentUser;
    }

    if (userAccountType) {
        userAccountType.textContent = "Personal Account";
    }

    if (userAvatar) {
        userAvatar.textContent = currentUser.charAt(0).toUpperCase();
    }
}

const authTabs = document.querySelectorAll(".auth-tab");
const authForm = document.getElementById("authForm");
const authUsername = document.getElementById("authUsername");
const authPassword = document.getElementById("authPassword");
const authMessage = document.getElementById("authMessage");
const logoutBtn = document.getElementById("logoutBtn");
const appContainer = document.getElementById("app");
const forgotPasswordButton = document.getElementById("forgotPassword");
const googleLoginButton = document.getElementById("googleLogin");
const languageSelects = document.querySelectorAll("[data-language-select]");
const budgetAlertModal = document.getElementById("budgetAlertModal");
const budgetAlertTitle = document.getElementById("budgetAlertTitle");
const budgetAlertMessage = document.getElementById("budgetAlertMessage");
const closeBudgetAlert = document.getElementById("closeBudgetAlert");

const translations = {
    "hi": {
        "Username": "यूज़रनेम",
        "Password": "पासवर्ड",
        "Login": "लॉग इन",
        "Sign Up": "साइन अप",
        "Create Account": "खाता बनाएं",
        "Continue with Google": "Google से जारी रखें",
        "Forgot password? Send reset email": "पासवर्ड भूल गए? रीसेट ईमेल भेजें",
        "Track every payment smartly": "हर भुगतान को स्मार्ट तरीके से ट्रैक करें",
        "Personal Finance": "व्यक्तिगत वित्त",
        "Light Mode": "लाइट मोड",
        "Dark Mode": "डार्क मोड",
        "↓ Export CSV": "↓ CSV एक्सपोर्ट करें",
        "🖨 Print Bill": "🖨 बिल प्रिंट करें",
        "Select category": "श्रेणी चुनें",
        "Expenses": "खर्चे",
        "Dashboard": "डैशबोर्ड",
        "Analytics": "विश्लेषण",
        "Logout": "लॉग आउट",
        "Welcome back 👋": "वापसी पर स्वागत है 👋",
        "Financial Dashboard": "वित्तीय डैशबोर्ड",
        "Total Spending": "कुल खर्च",
        "All recorded expenses": "सभी दर्ज खर्चे",
        "Today's Spending": "आज का खर्च",
        "Expenses today": "आज के खर्चे",
        "This Month": "इस महीने",
        "Current month": "वर्तमान महीना",
        "Transactions": "लेन-देन",
        "Total transactions": "कुल लेन-देन",
        "Monthly Budget": "मासिक बजट",
        "Set a limit and keep your spending on track": "सीमा तय करके खर्च पर नज़र रखें",
        "Budget limit": "बजट सीमा",
        "Save budget": "बजट सेव करें",
        "AI Spending Insights": "AI खर्च विश्लेषण",
        "Smart comparison of this month with last month": "इस महीने और पिछले महीने की स्मार्ट तुलना",
        "Monthly Pulse": "मासिक स्थिति",
        "A quick read on where your money is going": "आपका पैसा कहाँ जा रहा है, इसकी झलक",
        "Daily pace": "दैनिक गति",
        "Month projection": "महीने का अनुमान",
        "Focus category": "मुख्य श्रेणी",
        "Spending Overview": "खर्च का अवलोकन",
        "Category-wise expense distribution": "श्रेणी के अनुसार खर्च का वितरण",
        "All Time": "सभी समय",
        "Categories": "श्रेणियाँ",
        "Your spending breakdown": "आपके खर्च का विवरण",
        "Add New Expense": "नया खर्च जोड़ें",
        "Record your spending details": "अपने खर्च का विवरण दर्ज करें",
        "Description": "विवरण",
        "Amount": "राशि",
        "Category": "श्रेणी",
        "Date": "तारीख",
        "+ Add Expense": "+ खर्च जोड़ें",
        "Recent Expenses": "हाल के खर्चे",
        "Manage your transactions": "अपने लेन-देन प्रबंधित करें",
        "ExpenseFlow © 2026 • Personal Expense Management": "ExpenseFlow © 2026 • व्यक्तिगत खर्च प्रबंधन",
        "Search expenses...": "खर्च खोजें..."
    }
};

let currentLanguage = localStorage.getItem("language") || "en";

function getTranslation(text) {
    return currentLanguage === "hi" && translations.hi[text]
        ? translations.hi[text]
        : text;
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach(function(element) {
        element.textContent = getTranslation(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(element) {
        element.placeholder = getTranslation(element.dataset.i18nPlaceholder);
    });

    languageSelects.forEach(function(select) {
        select.value = currentLanguage;
    });

    applyTheme();
}

let authMode = "login";

function setAuthMode(mode) {
    authMode = mode;

    authTabs.forEach(function(tab) {
        tab.classList.toggle("active", tab.dataset.authMode === mode);
    });

    const submitButton = document.querySelector(".auth-submit");
    if (submitButton) {
        submitButton.textContent = getTranslation(
            mode === "login" ? "Login" : "Create Account"
        );
    }

    if (forgotPasswordButton) {
        forgotPasswordButton.hidden = mode !== "login";
    }

    if (authMessage) {
        authMessage.textContent = "";
        authMessage.classList.remove("success");
    }
}

async function handleAuthSubmit(event) {
    event.preventDefault();

    const submitButton = document.querySelector(".auth-submit");
    if (submitButton && submitButton.disabled) return;

    const username = normalizeUsername(authUsername.value);
    const password = authPassword.value.trim();

    if (!username || !password) {
        authMessage.textContent = "Please enter username and password.";
        authMessage.classList.remove("success");
        return;
    }

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
        authMessage.textContent = "Username must be 3-30 characters: letters, numbers, dot, dash, or underscore.";
        authMessage.classList.remove("success");
        return;
    }

    if (!firebaseConfigured) {
        authMessage.textContent = "Add your Firebase web config in index.html first.";
        authMessage.classList.remove("success");
        return;
    }

    const email = `${username}@expenseflow.app`;

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = authMode === "login"
                ? "Signing in..."
                : "Creating account...";
        }

        if (authMode === "signup") {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await result.user.updateProfile({ displayName: username });
            await db.ref(`users/${result.user.uid}`).set({
                username: username,
                expenses: [],
                budget: 0
            });
            authMessage.textContent = "Account created successfully.";
            authMessage.classList.add("success");
        } else {
            await auth.signInWithEmailAndPassword(email, password);
        }
    } catch (error) {
        authMessage.textContent = getAuthErrorMessage(error);
        authMessage.classList.remove("success");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = getTranslation(
                authMode === "login" ? "Login" : "Create Account"
            );
        }
    }
}

async function handleForgotPassword() {
    const username = normalizeUsername(authUsername.value);

    if (!username) {
        authMessage.textContent = "Enter your username first to receive a reset email.";
        authMessage.classList.remove("success");
        authUsername.focus();
        return;
    }

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
        authMessage.textContent = "Enter a valid username before requesting a reset email.";
        authMessage.classList.remove("success");
        authUsername.focus();
        return;
    }

    if (!firebaseConfigured) {
        authMessage.textContent = "Add your Firebase web config in index.html first.";
        authMessage.classList.remove("success");
        return;
    }

    try {
        forgotPasswordButton.disabled = true;
        forgotPasswordButton.textContent = "Sending reset email...";
        await auth.sendPasswordResetEmail(`${username}@expenseflow.app`);
        authMessage.textContent = "Reset email sent. Check your inbox and spam folder.";
        authMessage.classList.add("success");
    } catch (error) {
        authMessage.textContent = error.code === "auth/operation-not-allowed"
            ? "Google sign-in is disabled. Enable Google in Firebase Authentication settings."
            : getAuthErrorMessage(error);
        authMessage.classList.remove("success");
    } finally {
        forgotPasswordButton.disabled = false;
        forgotPasswordButton.textContent = getTranslation("Forgot password? Send reset email");
    }
}

async function handleGoogleLogin() {
    if (!firebaseConfigured) {
        authMessage.textContent = "Add your Firebase web config in index.html first.";
        authMessage.classList.remove("success");
        return;
    }

    try {
        googleLoginButton.disabled = true;
        googleLoginButton.textContent = "Opening Google...";
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const userSnapshot = await db.ref(`users/${result.user.uid}`).once("value");

        if (!userSnapshot.exists()) {
            await db.ref(`users/${result.user.uid}`).set({
                username: result.user.displayName || result.user.email.split("@")[0],
                expenses: [],
                budget: 0
            });
        }
    } catch (error) {
        authMessage.textContent = getAuthErrorMessage(error);
        authMessage.classList.remove("success");
    } finally {
        googleLoginButton.disabled = false;
        googleLoginButton.textContent = getTranslation("Continue with Google");
    }
}

function getAuthErrorMessage(error) {
    const messages = {
        "auth/email-already-in-use": "Username already exists. Please log in instead.",
        "auth/invalid-credential": "Invalid username or password.",
        "auth/invalid-login-credentials": "Invalid username or password.",
        "auth/user-not-found": "Account not found. Sign up first or check the username.",
        "auth/wrong-password": "Invalid username or password.",
        "auth/operation-not-allowed": "This sign-in method is disabled in Firebase Authentication settings.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/network-request-failed": "Network error. Check your internet connection.",
        "auth/invalid-email": "The username is not linked to a valid email address.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/popup-closed-by-user": "Google sign-in was cancelled.",
        "auth/popup-blocked": "Allow popups in your browser to sign in with Google.",
        "auth/account-exists-with-different-credential": "This email already uses another sign-in method.",
        "auth/unauthorized-domain": "Add this website domain to Firebase Authentication Authorized domains.",
        "auth/invalid-api-key": "The Firebase API key is invalid. Check the Firebase web configuration.",
        "auth/internal-error": "Google sign-in could not start. Check the Firebase Google provider settings."
    };

    return messages[error.code] || "Could not complete authentication. Please try again.";
}

function showDatabaseError(error) {
    console.error("ExpenseFlow database error:", error);

    if (!authMessage) return;

    authMessage.textContent = error && error.code === "PERMISSION_DENIED"
        ? "Database access denied. Publish database.rules.json in Firebase Console, then reload."
        : "Could not load your saved data. Check your Firebase connection and try again.";
    authMessage.classList.remove("success");
}

authTabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
        setAuthMode(tab.dataset.authMode);
    });
});

if (authForm) {
    authForm.addEventListener("submit", handleAuthSubmit);
}

if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener("click", handleForgotPassword);
}

if (googleLoginButton) {
    googleLoginButton.addEventListener("click", handleGoogleLogin);
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        if (auth) auth.signOut();
    });
}

showAuthScreen();
showView("dashboard");

if (auth) {
    auth.onAuthStateChanged(async function(user) {
        firebaseUser = user;
        currentUser = user ? (user.displayName || user.email.split("@")[0]) : null;

        if (!user) {
            expenses = [];
            payables = [];
            receivables = [];
            emis = [];
            monthlyBudget = 0;
            authForm.reset();
            setAuthMode("login");
            showAuthScreen();
            return;
        }

        updateUserDisplay();
        showAppScreen();
        showView("dashboard");
        displayExpenses();
        updateDashboard();
        updateCategorySummary();
        updateChart();

        try {
            const snapshot = await Promise.race([
                db.ref(`users/${user.uid}`).once("value"),
                new Promise(function(_, reject) {
                    setTimeout(function() {
                        reject({ code: "database-timeout" });
                    }, 8000);
                })
            ]);
            const data = snapshot.val() || {};
            expenses = Array.isArray(data.expenses) ? data.expenses : [];
            payables = Array.isArray(data.payables) ? data.payables : [];
            receivables = Array.isArray(data.receivables) ? data.receivables : [];
            emis = Array.isArray(data.emis) ? data.emis : [];
            monthlyBudget = Number(data.budget) || 0;
            displayExpenses();
            updateDashboard();
            updateCategorySummary();
            updateChart();
            renderDueSections();
            authForm.reset();
            authMessage.textContent = "";
            authMessage.classList.remove("success");
        } catch (error) {
            showDatabaseError(error);
        }
    });
} else {
    authMessage.textContent = "Add your Firebase web config in index.html first.";
}


// ---------- TODAY'S DATE ----------

const today =
    new Date().toISOString().split("T")[0];

dateInput.value = today;


// ---------- CURRENT DATE DISPLAY ----------

currentDate.textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


// ==========================================
// SAVE DATA
// ==========================================

function saveExpenses() {
    if (!firebaseUser) return Promise.resolve();
    return db.ref(`users/${firebaseUser.uid}`).update({
        expenses: expenses,
        payables: payables,
        receivables: receivables,
        emis: emis
    }).catch(showDatabaseError);
}

function saveBudgetToUser() {
    if (!firebaseUser) return Promise.resolve();
    return db.ref(`users/${firebaseUser.uid}`).update({
        budget: monthlyBudget
    }).catch(showDatabaseError);
}

function getMonthKeyForDate(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue + "T00:00:00");
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

function updateDueSummary() {
    const pendingPayables = payables.filter(function(item) { return !item.paid; });
    const pendingReceivables = receivables.filter(function(item) { return !item.paid; });
    const activeEmis = emis.filter(function(item) { return !item.paid; });

    const payableTotal = pendingPayables.reduce(function(sum, item) {
        return sum + Number(item.amount || 0);
    }, 0);

    const receivableTotal = pendingReceivables.reduce(function(sum, item) {
        return sum + Number(item.amount || 0);
    }, 0);

    const monthKey = getMonthKeyForDate(today);
    const emiMonthTotal = activeEmis
        .filter(function(item) {
            const isThisMonth = item.month === monthKey || item.dueMonth === monthKey;
            return isThisMonth && Number(item.amount || 0) > 0;
        })
        .reduce(function(sum, item) {
            return sum + Number(item.amount || 0);
        }, 0);

    if (duePayableTotal) duePayableTotal.textContent = formatCurrency(payableTotal);
    if (duePayableCount) duePayableCount.textContent = `${pendingPayables.length} pending`;
    if (dueReceivableTotal) dueReceivableTotal.textContent = formatCurrency(receivableTotal);
    if (dueReceivableCount) dueReceivableCount.textContent = `${pendingReceivables.length} pending`;
    if (emiDueThisMonth) emiDueThisMonth.textContent = formatCurrency(emiMonthTotal);
    if (emiDueCount) emiDueCount.textContent = `${activeEmis.length} active`;

    if (emiReminder) {
        if (emiMonthTotal > 0) {
            emiReminder.textContent = `Reminder: pay ${formatCurrency(emiMonthTotal)} in EMI this month.`;
            emiReminder.classList.add("warning");
        } else {
            emiReminder.textContent = "No EMI due this month.";
            emiReminder.classList.remove("warning");
        }
    }
}

function renderInlineList(target, items, type) {
    if (!target) return;
    target.innerHTML = "";

    if (!items.length) {
        target.innerHTML = '<div class="empty-state">No records yet.</div>';
        return;
    }

    items.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "inline-item";

        const title = type === "payable" ? item.name : type === "receivable" ? item.name : item.title;
        const meta = type === "emi"
            ? `${item.month || "Monthly"} • ${formatCurrency(item.amount)}`
            : `${formatDate(item.date)} • ${formatCurrency(item.amount)}`;

        row.innerHTML = `
            <div>
                <strong>${escapeHTML(title)}</strong>
                <span>${escapeHTML(meta)}</span>
            </div>
            <div class="inline-actions">
                ${type === "emi" ? `<button class="mark-paid" type="button">${item.paid ? "Unmark" : "Paid"}</button>` : `<button class="mark-paid" type="button">${item.paid ? "Reopen" : "Mark paid"}</button>`}
                <button class="delete-item" type="button">Delete</button>
            </div>
        `;

        const markButton = row.querySelector(".mark-paid");
        const deleteButton = row.querySelector(".delete-item");

        markButton.addEventListener("click", function() {
            if (type === "payable") {
                togglePayablePaid(item.id);
            } else if (type === "receivable") {
                toggleReceivablePaid(item.id);
            } else {
                toggleEmiPaid(item.id);
            }
        });

        deleteButton.addEventListener("click", function() {
            if (type === "payable") {
                deletePayable(item.id);
            } else if (type === "receivable") {
                deleteReceivable(item.id);
            } else {
                deleteEmi(item.id);
            }
        });

        target.appendChild(row);
    });
}

function renderDueSections() {
    renderInlineList(payableList, payables, "payable");
    renderInlineList(receivableList, receivables, "receivable");
    renderInlineList(emiList, emis, "emi");
    updateDueSummary();
}

function addPayable(event) {
    event.preventDefault();
    const name = document.getElementById("payableName").value.trim();
    const amount = Number(document.getElementById("payableAmount").value);
    const date = document.getElementById("payableDate").value;

    if (!name || amount <= 0 || !date) {
        alert("Please enter valid payable details.");
        return;
    }

    payables.push({
        id: Date.now(),
        name: name,
        amount: amount,
        date: date,
        paid: false
    });

    document.getElementById("payableForm").reset();
    saveExpenses();
    renderDueSections();
}

function addReceivable(event) {
    event.preventDefault();
    const name = document.getElementById("receivableName").value.trim();
    const amount = Number(document.getElementById("receivableAmount").value);
    const date = document.getElementById("receivableDate").value;

    if (!name || amount <= 0 || !date) {
        alert("Please enter valid receivable details.");
        return;
    }

    receivables.push({
        id: Date.now(),
        name: name,
        amount: amount,
        date: date,
        paid: false
    });

    document.getElementById("receivableForm").reset();
    saveExpenses();
    renderDueSections();
}

function addEmi(event) {
    event.preventDefault();
    const title = document.getElementById("emiTitle").value.trim();
    const amount = Number(document.getElementById("emiAmount").value);
    const month = document.getElementById("emiMonth").value;

    if (!title || amount <= 0 || !month) {
        alert("Please enter valid EMI details.");
        return;
    }

    emis.push({
        id: Date.now(),
        title: title,
        amount: amount,
        month: month,
        dueMonth: month,
        paid: false
    });

    document.getElementById("emiForm").reset();
    saveExpenses();
    renderDueSections();
}

function togglePayablePaid(id) {
    payables = payables.map(function(item) {
        if (item.id === id) {
            return { ...item, paid: !item.paid };
        }
        return item;
    });
    saveExpenses();
    renderDueSections();
}

function toggleReceivablePaid(id) {
    receivables = receivables.map(function(item) {
        if (item.id === id) {
            return { ...item, paid: !item.paid };
        }
        return item;
    });
    saveExpenses();
    renderDueSections();
}

function toggleEmiPaid(id) {
    emis = emis.map(function(item) {
        if (item.id === id) {
            return { ...item, paid: !item.paid };
        }
        return item;
    });
    saveExpenses();
    renderDueSections();
}

function deletePayable(id) {
    payables = payables.filter(function(item) { return item.id !== id; });
    saveExpenses();
    renderDueSections();
}

function deleteReceivable(id) {
    receivables = receivables.filter(function(item) { return item.id !== id; });
    saveExpenses();
    renderDueSections();
}

function deleteEmi(id) {
    emis = emis.filter(function(item) { return item.id !== id; });
    saveExpenses();
    renderDueSections();
}


// ==========================================
// ADD / UPDATE EXPENSE
// ==========================================

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const description =
        descriptionInput.value.trim();

    const amount =
        Number(amountInput.value);

    const category =
        categoryInput.value;

    const date =
        dateInput.value;

    const previousMonthTotal = getCurrentMonthTotal();


    if (
        description === "" ||
        amount <= 0 ||
        category === "" ||
        date === ""
    ) {

        alert("Please enter valid expense details.");

        return;

    }


    // EDIT EXISTING EXPENSE

    if (editingId !== null) {

        expenses = expenses.map(function(expense) {

            if (expense.id === editingId) {

                return {

                    ...expense,

                    description: description,
                    amount: amount,
                    category: category,
                    date: date

                };

            }

            return expense;

        });

        editingId = null;

        document.querySelector(".submit-btn").textContent =
            "+ Add Expense";

    }


    // ADD NEW EXPENSE

    else {

        const newExpense = {

            id: Date.now(),

            description: description,

            amount: amount,

            category: category,

            date: date

        };

        expenses.push(newExpense);

    }


    saveExpenses();

    expenseForm.reset();

    dateInput.value = today;

    displayExpenses();

    updateDashboard();

    updateCategorySummary();

    updateChart();

    const newMonthTotal = getCurrentMonthTotal();
    if (
        monthlyBudget > 0 &&
        previousMonthTotal <= monthlyBudget &&
        newMonthTotal > monthlyBudget
    ) {
        notifyBudgetExceeded(newMonthTotal);
    }

});


// ==========================================
// DISPLAY EXPENSES
// ==========================================

function displayExpenses() {

    expenseList.innerHTML = "";


    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        filterCategory.value;


    const filteredExpenses =
        expenses.filter(function(expense) {

            const matchesSearch =
                expense.description
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "All" ||
                expense.category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    expenseCountLabel.textContent =
        `${filteredExpenses.length} transactions`;


    // EMPTY STATE

    if (filteredExpenses.length === 0) {

        expenseList.innerHTML = `

            <div style="
                text-align:center;
                padding:45px 20px;
                color:#71717a;
            ">

                <div style="
                    font-size:40px;
                    margin-bottom:12px;
                ">
                    💸
                </div>

                <h3 style="margin-bottom:6px;">
                    No expenses found
                </h3>

                <p style="font-size:12px;">
                    Add an expense or change your filters.
                </p>

            </div>

        `;

        return;

    }


    // DISPLAY EXPENSES

    filteredExpenses
        .slice()
        .sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        )
        .forEach(function(expense) {

            const item =
                document.createElement("div");

            item.className = "expense-item";


            const icon =
                getCategoryIcon(expense.category);


            item.innerHTML = `

                <div class="expense-info">

                    <div class="expense-icon">
                        ${icon}
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(expense.description)}
                        </h3>

                        <p>
                            ${expense.category}
                            •
                            ${formatDate(expense.date)}
                        </p>

                    </div>

                </div>


                <div class="expense-amount">
                    ₹${expense.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                    })}
                </div>


                <div>

                    <button
                        class="edit-btn"
                        onclick="editExpense(${expense.id})"
                        title="Edit expense">
                        ✏️
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})"
                        title="Delete expense">
                        🗑️
                    </button>

                </div>

            `;


            expenseList.appendChild(item);

        });

}


// ==========================================
// EDIT EXPENSE
// ==========================================

function editExpense(id) {

    const expense =
        expenses.find(function(item) {

            return item.id === id;

        });


    if (!expense) return;


    descriptionInput.value =
        expense.description;

    amountInput.value =
        expense.amount;

    categoryInput.value =
        expense.category;

    dateInput.value =
        expense.date;


    editingId = id;


    document.querySelector(".submit-btn").textContent =
        "✓ Update Expense";


    descriptionInput.focus();


    window.scrollTo({

        top:
            document.querySelector(
                ".add-expense-panel"
            ).offsetTop - 20,

        behavior: "smooth"

    });

}


// ==========================================
// DELETE EXPENSE
// ==========================================

function deleteExpense(id) {

    const expense =
        expenses.find(function(item) {

            return item.id === id;

        });


    if (!expense) return;


    const confirmation =
        confirm(
            `Delete "${expense.description}" expense?`
        );


    if (!confirmation) return;


    expenses =
        expenses.filter(function(item) {

            return item.id !== id;

        });


    saveExpenses();

    displayExpenses();

    updateDashboard();

    updateCategorySummary();

    updateChart();

}


// ==========================================
// DASHBOARD CALCULATIONS
// ==========================================

function getCurrentMonthTotal() {
    const currentMonth = today.substring(0, 7);

    return expenses.reduce(function(sum, expense) {
        return getExpenseDate(expense).startsWith(currentMonth)
            ? sum + Number(expense.amount)
            : sum;
    }, 0);
}

function notifyBudgetExceeded(monthTotal) {
    const message = `Your spending is ${formatCurrency(monthTotal - monthlyBudget)} over budget.`;

    budgetAlertTitle.textContent = currentLanguage === "hi"
        ? "बजट से अधिक खर्च"
        : "Budget exceeded";
    budgetAlertMessage.textContent = currentLanguage === "hi"
        ? `आपका खर्च बजट से ${formatCurrency(monthTotal - monthlyBudget)} अधिक है।`
        : message;
    budgetAlertModal.hidden = false;
    closeBudgetAlert.focus();
}

closeBudgetAlert.addEventListener("click", function() {
    budgetAlertModal.hidden = true;
});

budgetAlertModal.addEventListener("click", function(event) {
    if (event.target === budgetAlertModal) {
        budgetAlertModal.hidden = true;
    }
});

function updateDashboard() {


    // TOTAL

    const total =
        expenses.reduce(function(sum, expense) {

            return sum + Number(expense.amount);

        }, 0);


    // TODAY

    const todayTotal =
        expenses.reduce(function(sum, expense) {

            if (getExpenseDate(expense) === today) {

                return sum + Number(expense.amount);

            }

            return sum;

        }, 0);


    // CURRENT MONTH

    const monthTotal = getCurrentMonthTotal();


    totalExpense.textContent =
        formatCurrency(total);

    todayExpense.textContent =
        formatCurrency(todayTotal);

    monthlyExpense.textContent =
        formatCurrency(monthTotal);

    transactionCount.textContent =
        expenses.length;

    updateMonthlyPulse(monthTotal);
    updateBudget(monthTotal);
    updateAIInsights();
    renderDueSections();

}


function updateBudget(monthTotal) {

    if (monthlyBudget <= 0) {

        budgetStatus.textContent = "No budget set";
        budgetStatus.className = "budget-status";
        budgetRemaining.textContent = "Set a budget to start";
        budgetProgressText.textContent = "Current month spending will appear here";
        budgetProgress.style.width = "0%";
        budgetProgress.className = "budget-progress";

        return;

    }

    const remaining = monthlyBudget - monthTotal;
    const percentage = Math.round((monthTotal / monthlyBudget) * 100);
    const isOver = remaining < 0;

    budgetStatus.textContent = isOver
        ? "Budget exceeded"
        : `${Math.min(percentage, 100)}% used`;
    budgetStatus.className = isOver
        ? "budget-status over"
        : "budget-status good";
    budgetRemaining.textContent = isOver
        ? `${formatCurrency(Math.abs(remaining))} over budget`
        : `${formatCurrency(remaining)} remaining`;
    budgetProgressText.textContent =
        `${formatCurrency(monthTotal)} of ${formatCurrency(monthlyBudget)} used`;
    budgetProgress.style.width = `${Math.min(percentage, 100)}%`;
    budgetProgress.className = isOver
        ? "budget-progress over"
        : "budget-progress";

}


saveBudgetButton.addEventListener("click", function() {

    const nextBudget = Number(budgetInput.value);

    if (nextBudget <= 0) {
        alert("Please enter a budget greater than zero.");
        return;
    }

    const monthTotal = getCurrentMonthTotal();
    const wasWithinBudget = monthTotal <= monthlyBudget;
    monthlyBudget = nextBudget;
    saveBudgetToUser();
    updateDashboard();

    if (wasWithinBudget && monthTotal > monthlyBudget) {
        notifyBudgetExceeded(monthTotal);
    }

});

const payableForm = document.getElementById("payableForm");
const receivableForm = document.getElementById("receivableForm");
const emiForm = document.getElementById("emiForm");

if (payableForm) payableForm.addEventListener("submit", addPayable);
if (receivableForm) receivableForm.addEventListener("submit", addReceivable);
if (emiForm) emiForm.addEventListener("submit", addEmi);


function exportExpensesAsCSV() {

    if (expenses.length === 0) {
        alert("Add at least one expense before exporting.");
        return;
    }

    const rows = [
        ["Description", "Amount", "Category", "Date"],
        ...expenses.map(function(expense) {
            return [
                expense.description,
                Number(expense.amount).toFixed(2),
                expense.category,
                getExpenseDate(expense)
            ];
        })
    ];

    const csv = rows.map(function(row) {
        return row.map(function(value) {
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(",");
    }).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expenseflow-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);

}


exportExpensesButton.addEventListener("click", exportExpensesAsCSV);

printBillButton.addEventListener("click", printExpenseBill);


function printExpenseBill() {

    if (expenses.length === 0) {
        alert("No transactions available to print.");
        return;
    }

    const sortedExpenses = [...expenses].sort(function(first, second) {
        return new Date(second.date) - new Date(first.date);
    });

    const total = sortedExpenses.reduce(function(sum, expense) {
        return sum + Number(expense.amount);
    }, 0);

    const rows = sortedExpenses.map(function(expense, index) {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(expense.description)}</td>
                <td>${escapeHTML(expense.category)}</td>
                <td>${formatDate(expense.date)}</td>
                <td>${formatCurrency(expense.amount)}</td>
            </tr>
        `;
    }).join("");

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>ExpenseFlow Bill</title>
            <style>
                * { box-sizing: border-box; }
                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #f7f7f7;
                    color: #1f2937;
                    padding: 32px;
                }
                .bill-container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
                    overflow: hidden;
                }
                .bill-header {
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    color: white;
                    padding: 28px 30px;
                }
                .bill-header h1 {
                    margin: 0 0 8px;
                    font-size: 30px;
                }
                .bill-header p {
                    margin: 0;
                    opacity: 0.9;
                }
                .bill-body {
                    padding: 28px 30px 10px;
                }
                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 22px;
                    font-size: 14px;
                }
                .meta-box {
                    flex: 1;
                    min-width: 180px;
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 12px 14px;
                }
                .meta-box strong {
                    display: block;
                    color: #6b7280;
                    margin-bottom: 6px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 8px;
                }
                th, td {
                    text-align: left;
                    padding: 12px 10px;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 14px;
                }
                th {
                    background: #f8fafc;
                    color: #374151;
                    font-weight: 700;
                }
                .total-row td {
                    border-bottom: none;
                    font-size: 16px;
                    font-weight: 700;
                    background: #f8fafc;
                }
                .total-row td:last-child {
                    color: #111827;
                }
                @media print {
                    body {
                        background: #fff;
                        padding: 0;
                    }
                    .bill-container {
                        box-shadow: none;
                        border: none;
                        border-radius: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="bill-container">
                <div class="bill-header">
                    <h1>ExpenseFlow Bill</h1>
                    <p>Personal expense summary and payment record</p>
                </div>
                <div class="bill-body">
                    <div class="meta-row">
                        <div class="meta-box">
                            <strong>Generated</strong>
                            ${new Date().toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            })}
                        </div>
                        <div class="meta-box">
                            <strong>Total Transactions</strong>
                            ${sortedExpenses.length}
                        </div>
                        <div class="meta-box">
                            <strong>Grand Total</strong>
                            ${formatCurrency(total)}
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td colspan="4">Grand Total</td>
                                <td>${formatCurrency(total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(function() {
        printWindow.print();
    }, 300);

}


function getExpenseDate(expense) {

    return typeof expense.date === "string"
        ? expense.date
        : "";

}


function updateMonthlyPulse(monthTotal) {

    const currentDate = new Date(today + "T00:00:00");
    const currentDay = currentDate.getDate();
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const dailyPace = currentDay > 0
        ? monthTotal / currentDay
        : 0;

    const projection = dailyPace * daysInMonth;

    const currentBreakdown =
        getMonthBreakdown(getMonthKey(0));

    const topCategory = Object.entries(currentBreakdown.categories)
        .sort(function(first, second) {
            return second[1] - first[1];
        })[0];

    spendingPace.textContent = formatCurrency(dailyPace);
    projectedSpend.textContent = formatCurrency(projection);
    focusCategory.textContent = topCategory
        ? `${getCategoryIcon(topCategory[0])} ${topCategory[0]}`
        : "No data yet";

    const progress = projection > 0
        ? Math.min((monthTotal / projection) * 100, 100)
        : 0;

    paceProgress.style.width = `${progress}%`;

}


// ==========================================
// AI SPENDING INSIGHTS
// ==========================================

function getMonthKey(monthOffset) {

    const date = new Date(today + "T00:00:00");

    date.setDate(1);
    date.setMonth(date.getMonth() + monthOffset);

    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${date.getFullYear()}-${month}`;

}


function getMonthBreakdown(monthKey) {

    const breakdown = {
        total: 0,
        categories: {}
    };

    expenses.forEach(function(expense) {

        if (!getExpenseDate(expense).startsWith(monthKey)) return;

        const amount = Number(expense.amount);

        breakdown.total += amount;
        breakdown.categories[expense.category] =
            (breakdown.categories[expense.category] || 0) + amount;

    });

    return breakdown;

}


function updateAIInsights() {

    const currentMonth =
        getMonthBreakdown(getMonthKey(0));

    const previousMonth =
        getMonthBreakdown(getMonthKey(-1));

    if (currentMonth.total === 0 && previousMonth.total === 0) {

        aiInsights.innerHTML = `
            <article class="insight-card">
                <span class="insight-label">Ready to learn</span>
                <h3>Add expenses to unlock insights</h3>
                <p>Your month-to-month spending patterns will appear here.</p>
            </article>
        `;

        return;

    }

    const hasPreviousData = previousMonth.total > 0;
    const totalDifference =
        currentMonth.total - previousMonth.total;

    let overallInsight;

    if (!hasPreviousData) {

        overallInsight = {
            type: "positive",
            label: "New spending baseline",
            title: `${formatCurrency(currentMonth.total)} spent`,
            text: "This is your first recorded month with spending, so there is no previous month to compare against."
        };

    } else {

        const totalChange =
            Math.round((totalDifference / previousMonth.total) * 100);

        if (totalDifference > 0) {
            overallInsight = {
                type: "warning",
                label: "Monthly reminder",
                title: `${formatCurrency(totalDifference)} more spent`,
                text: `You are spending ${Math.abs(totalChange)}% more than last month. Keep an eye on the remaining days.`
            };
        } else if (totalDifference < 0) {
            overallInsight = {
                type: "positive",
                label: "Monthly progress",
                title: `${formatCurrency(Math.abs(totalDifference))} saved`,
                text: `Your spending is ${Math.abs(totalChange)}% lower than last month.`
            };
        } else {
            overallInsight = {
                type: "positive",
                label: "Steady spend",
                title: "Spending is stable",
                text: "Your current month matches the previous month in total spend."
            };
        }

    }

    const categoryChanges =
        Object.entries(currentMonth.categories)
            .map(function([category, amount]) {

                const previousAmount =
                    previousMonth.categories[category] || 0;

                return {
                    category: category,
                    amount: amount,
                    difference: amount - previousAmount
                };

            })
            .filter(function(item) {
                return item.difference > 0;
            })
            .sort(function(first, second) {
                return second.difference - first.difference;
            });

    const extraSpend = categoryChanges[0];

    const extraInsight = extraSpend
        ? {
            type: "warning",
            label: "Extra spend detected",
            title: `${getCategoryIcon(extraSpend.category)} ${extraSpend.category}`,
            text: `${formatCurrency(extraSpend.difference)} above last month in this category.`
        }
        : {
            type: "positive",
            label: "Category check",
            title: hasPreviousData ? "No category spike" : "New spending mix",
            text: hasPreviousData
                ? "Your current category spending is not above last month."
                : "This month is being used as the baseline for your category trends."
        };

    const topCategory =
        Object.entries(currentMonth.categories)
            .sort(function(first, second) {
                return second[1] - first[1];
            })[0];

    const topInsight = topCategory
        ? {
            label: "Biggest current spend",
            title: `${getCategoryIcon(topCategory[0])} ${topCategory[0]}`,
            text: `${formatCurrency(topCategory[1])} spent this month in this category.`
        }
        : {
            label: "Current month",
            title: "No spending yet",
            text: "Add an expense to start tracking this month."
        };

    aiInsights.innerHTML = `
        <article class="insight-card ${overallInsight.type}">
            <span class="insight-label">${overallInsight.label}</span>
            <h3>${overallInsight.title}</h3>
            <p>${overallInsight.text}</p>
        </article>
        <article class="insight-card ${extraInsight.type}">
            <span class="insight-label">${extraInsight.label}</span>
            <h3>${extraInsight.title}</h3>
            <p>${extraInsight.text}</p>
        </article>
        <article class="insight-card">
            <span class="insight-label">${topInsight.label}</span>
            <h3>${topInsight.title}</h3>
            <p>${topInsight.text}</p>
        </article>
    `;

}


// ==========================================
// CATEGORY SUMMARY
// ==========================================

function updateCategorySummary() {

    categorySummary.innerHTML = "";


    if (expenses.length === 0) {

        categorySummary.innerHTML = `

            <p style="
                color:#71717a;
                font-size:12px;
                text-align:center;
                padding:20px;
            ">
                No category data yet.
            </p>

        `;

        return;

    }


    const totals = {};


    expenses.forEach(function(expense) {

        if (!totals[expense.category]) {

            totals[expense.category] = 0;

        }

        totals[expense.category] +=
            Number(expense.amount);

    });


    const total =
        Object.values(totals)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .forEach(function([category, amount]) {

            const percentage =
                total > 0
                    ? (amount / total) * 100
                    : 0;


            const row =
                document.createElement("div");

            row.className =
                "category-row";


            row.innerHTML = `

                <div class="category-top">

                    <span>
                        ${getCategoryIcon(category)}
                        ${category}
                    </span>

                    <strong>
                        ₹${amount.toLocaleString("en-IN")}
                    </strong>

                </div>

                <div class="category-bar">

                    <div
                        class="category-progress"
                        style="width:${percentage}%">
                    </div>

                </div>

            `;


            categorySummary.appendChild(row);

        });

}


// ==========================================
// CHART
// ==========================================

function updateChart() {

    const canvas =
        document.getElementById(
            "expenseChart"
        );


    if (!canvas) return;


    const period =
        chartPeriod.value;


    let chartExpenses = expenses;


    if (period === "month") {

        const currentMonth =
            today.substring(0, 7);


        chartExpenses =
            expenses.filter(function(expense) {

                return getExpenseDate(expense).startsWith(
                    currentMonth
                );

            });

    }


    const categoryTotals = {};


    chartExpenses.forEach(function(expense) {

        if (!categoryTotals[expense.category]) {

            categoryTotals[expense.category] = 0;

        }

        categoryTotals[expense.category] +=
            Number(expense.amount);

    });


    const labels =
        Object.keys(categoryTotals);


    const values =
        Object.values(categoryTotals);


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [{

                    data: values,

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "70%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            usePointStyle: true,

                            padding: 18

                        }

                    }

                }

            }

        });

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    displayExpenses
);


// ==========================================
// CATEGORY FILTER
// ==========================================

filterCategory.addEventListener(
    "change",
    displayExpenses
);


// ==========================================
// CHART FILTER
// ==========================================

chartPeriod.addEventListener(
    "change",
    updateChart
);


// ==========================================
// DARK MODE
// ==========================================

let darkMode =
    localStorage.getItem("darkMode") === "true";


function applyTheme() {

    if (darkMode) {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent =
            "☀️ " + getTranslation("Light Mode");

    }

    else {

        document.body.classList.remove(
            "dark-mode"
        );

        themeToggle.textContent =
            "🌙 " + getTranslation("Dark Mode");

    }

}


themeToggle.addEventListener(
    "click",
    function() {

        darkMode = !darkMode;

        localStorage.setItem(
            "darkMode",
            darkMode
        );

        applyTheme();

    }
);

languageSelects.forEach(function(select) {
    select.addEventListener("change", function() {
        currentLanguage = select.value;
        localStorage.setItem("language", currentLanguage);
        applyLanguage();
    });
});


// ==========================================
// CATEGORY ICON
// ==========================================

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Travel: "🚌",

        Shopping: "🛍️",

        Education: "📚",

        Bills: "💡",

        Other: "📦"

    };


    return icons[category] || "💰";

}


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// INITIALIZE APP
// ==========================================

applyLanguage();

displayExpenses();

renderDueSections();

updateDashboard();

updateCategorySummary();

updateChart();