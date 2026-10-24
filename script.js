/* =========================================================
   JOBNEST
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   LOCATION DATA
========================================================= */

const locations = [

    "Hyderabad",
    "Bengaluru",
    "Mumbai",
    "Chennai",
    "Delhi",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Noida",
    "Gurugram",
    "Visakhapatnam",
    "Vijayawada",
    "Bhimavaram",
    "Kochi",
    "Coimbatore",
    "Mysuru",
    "Jaipur",
    "Lucknow",
    "Indore",
    "Bhopal"

];


/* =========================================================
   DEFAULT JOBS
========================================================= */

const defaultJobs = [

    {
        id: 1,
        company: "Google",
        title: "Software Engineer",
        location: "Bengaluru",
        category: "technology",
        salary: "₹12 LPA - ₹18 LPA",
        type: "Full Time",
        mode: "Onsite",
        logo: "G",
        logoClass: "google"
    },

    {
        id: 2,
        company: "Amazon",
        title: "Frontend Developer",
        location: "Hyderabad",
        category: "technology",
        salary: "₹8 LPA - ₹12 LPA",
        type: "Full Time",
        mode: "Hybrid",
        logo: "a",
        logoClass: "amazon"
    },

    {
        id: 3,
        company: "Microsoft",
        title: "Data Analyst",
        location: "Bengaluru",
        category: "technology",
        salary: "₹6 LPA - ₹10 LPA",
        type: "Full Time",
        mode: "Hybrid",
        logo: "M",
        logoClass: "microsoft"
    },

    {
        id: 4,
        company: "TCS",
        title: "System Engineer",
        location: "Chennai",
        category: "technology",
        salary: "₹3 LPA - ₹6 LPA",
        type: "Full Time",
        mode: "Onsite",
        logo: "TCS",
        logoClass: "tcs"
    }

];


/* =========================================================
   INITIALIZE JOBS
========================================================= */

function initializeJobs() {

    if (!localStorage.getItem("jobnest_jobs")) {

        localStorage.setItem(
            "jobnest_jobs",
            JSON.stringify(defaultJobs)
        );

    }

}


/* =========================================================
   GET JOBS
========================================================= */

function getJobs() {

    try {

        return JSON.parse(
            localStorage.getItem("jobnest_jobs") || "[]"
        );

    } catch (error) {

        return [];

    }

}


/* =========================================================
   SAVE JOBS
========================================================= */

function saveJobs(jobs) {

    localStorage.setItem(
        "jobnest_jobs",
        JSON.stringify(jobs)
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   ESCAPE JAVASCRIPT
========================================================= */

function escapeJS(text) {

    return String(text ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================================================
   DISPLAY FEATURED JOBS
========================================================= */

function displayFeaturedJobs() {

    const container =
        document.getElementById("featuredJobs");

    if (!container) return;

    const jobs = getJobs();

    if (jobs.length === 0) {

        container.innerHTML = `
            <div class="no-jobs">
                No jobs available.
            </div>
        `;

        return;

    }


    container.innerHTML = jobs
        .slice(0, 8)
        .map(job => {

            return `

                <div class="job-card">

                    <div class="company-row">

                        <div
                            class="company-logo ${escapeHTML(job.logoClass || "")}">

                            ${escapeHTML(
                                job.logo ||
                                (job.company || "").charAt(0)
                            )}

                        </div>

                        <span>
                            ${escapeHTML(job.company)}
                        </span>

                    </div>


                    <h3>
                        ${escapeHTML(job.title)}
                    </h3>


                    <div class="job-tags">

                        <span class="tag green">
                            ${escapeHTML(
                                job.type || "Full Time"
                            )}
                        </span>

                        <span class="tag blue">
                            ${escapeHTML(
                                job.mode || "Onsite"
                            )}
                        </span>

                    </div>


                    <p class="job-info">

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeHTML(job.location)}, India

                    </p>


                    <p class="job-info">

                        <i class="fa-solid fa-indian-rupee-sign"></i>

                        ${escapeHTML(job.salary)}

                    </p>


                    <button
                        type="button"
                        class="apply-btn"
                        onclick="applyJob('${escapeJS(
                            job.title
                        )}')">

                        Apply Now

                    </button>

                </div>

            `;

        })
        .join("");

}


/* =========================================================
   LOCATION AUTOCOMPLETE
========================================================= */

let locationInput = null;
let locationSuggestions = null;


function initializeLocationSearch() {

    locationInput =
        document.getElementById("locationInput");

    locationSuggestions =
        document.getElementById("locationSuggestions");


    if (!locationInput || !locationSuggestions) {
        return;
    }


    locationInput.addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .trim()
                    .toLowerCase();


            locationSuggestions.innerHTML = "";


            if (value === "") {

                locationSuggestions.style.display =
                    "none";

                return;

            }


            const matches =
                locations.filter(
                    location =>
                        location
                            .toLowerCase()
                            .includes(value)
                );


            if (matches.length === 0) {

                locationSuggestions.style.display =
                    "none";

                return;

            }


            matches.forEach(location => {

                const option =
                    document.createElement("div");


                option.className =
                    "location-option";


                option.innerHTML = `

                    <i class="fa-solid fa-location-dot"></i>

                    <span>
                        ${escapeHTML(location)}
                    </span>

                `;


                option.addEventListener(
                    "click",
                    function () {

                        locationInput.value =
                            location;

                        locationSuggestions.style.display =
                            "none";

                    }
                );


                locationSuggestions.appendChild(
                    option
                );

            });


            locationSuggestions.style.display =
                "block";

        }
    );

}


/* =========================================================
   SEARCH JOBS
========================================================= */

function searchJobs() {

    const keywordElement =
        document.getElementById("jobKeyword");

    const locationElement =
        document.getElementById("locationInput");

    const categoryElement =
        document.getElementById("jobCategory");


    const keyword =
        keywordElement
            ? keywordElement.value.trim()
            : "";


    const location =
        locationElement
            ? locationElement.value.trim()
            : "";


    const category =
        categoryElement
            ? categoryElement.value
            : "";


    const params =
        new URLSearchParams();


    if (keyword) {

        params.set(
            "keyword",
            keyword
        );

    }


    if (location) {

        params.set(
            "location",
            location
        );

    }


    if (category) {

        params.set(
            "category",
            category
        );

    }


    window.location.href =
        "jobs.html" +
        (
            params.toString()
                ? "?" + params.toString()
                : ""
        );

}


/* =========================================================
   CATEGORY SEARCH
========================================================= */

function searchCategory(category) {

    window.location.href =
        "jobs.html?category=" +
        encodeURIComponent(category);

}


/* =========================================================
   FOCUS SEARCH
========================================================= */

function focusSearch() {

    const search =
        document.getElementById("jobKeyword");


    if (!search) return;


    search.focus();


    search.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/* =========================================================
   SHOW ALL JOBS
========================================================= */

function showAllJobs() {

    window.location.href =
        "jobs.html";

}


/* =========================================================
   APPLY FOR JOB
========================================================= */

function applyJob(jobTitle) {

    const jobs =
        getJobs();


    const selectedJob =
        jobs.find(
            job =>
                job.title === jobTitle
        );


    if (selectedJob) {

        localStorage.setItem(
            "selected_job",
            JSON.stringify(selectedJob)
        );

    }


    /*
       If you already have registration.html,
       open that page for the application.
    */

    window.location.href =
        "registration.html";

}


/* =========================================================
   USER AUTHENTICATION
========================================================= */

let authMode = "login";


/* =========================================================
   GET USERS
========================================================= */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "jobnest_users"
            ) || "[]"
        );

    } catch (error) {

        return [];

    }

}


/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(users) {

    localStorage.setItem(
        "jobnest_users",
        JSON.stringify(users)
    );

}


/* =========================================================
   GET CURRENT USER
========================================================= */

function getCurrentUser() {

    const storedUser =
        localStorage.getItem(
            "jobnest_current_user"
        );


    if (!storedUser) {

        return null;

    }


    try {

        return JSON.parse(
            storedUser
        );

    } catch (error) {

        localStorage.removeItem(
            "jobnest_current_user"
        );

        return null;

    }

}


/* =========================================================
   OPEN LOGIN
========================================================= */

function openLogin() {

    authMode =
        "login";


    updateAuthModal();


    const modal =
        document.getElementById(
            "authModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   OPEN SIGN UP
========================================================= */

function openSignup() {

    /*
       If user is already logged in,
       open Account instead.
    */

    if (getCurrentUser()) {

        openAccount();

        return;

    }


    authMode =
        "signup";


    updateAuthModal();


    const modal =
        document.getElementById(
            "authModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   CLOSE AUTH MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   SWITCH LOGIN / SIGN UP
========================================================= */

function toggleAuthMode() {

    authMode =
        authMode === "login"
            ? "signup"
            : "login";


    updateAuthModal();

}


/* =========================================================
   UPDATE AUTH MODAL
========================================================= */

function updateAuthModal() {

    const title =
        document.getElementById(
            "authTitle"
        );

    const subtitle =
        document.getElementById(
            "authSubtitle"
        );

    const submit =
        document.getElementById(
            "authSubmit"
        );

    const switchText =
        document.getElementById(
            "authSwitchText"
        );

    const switchButton =
        document.getElementById(
            "authSwitchButton"
        );

    const nameField =
        document.getElementById(
            "nameField"
        );

    const nameInput =
        document.getElementById(
            "authName"
        );


    if (
        !title ||
        !subtitle ||
        !submit ||
        !switchText ||
        !switchButton
    ) {

        return;

    }


    /* =====================================================
       LOGIN MODE
    ===================================================== */

    if (authMode === "login") {

        title.textContent =
            "Welcome to JobNest";


        subtitle.textContent =
            "Login to continue";


        submit.textContent =
            "Login";


        switchText.textContent =
            "Don't have an account?";


        switchButton.textContent =
            "Sign Up";


        if (nameField) {

            nameField.style.display =
                "none";

        }


        if (nameInput) {

            nameInput.required =
                false;

            nameInput.value =
                "";

        }

    }


    /* =====================================================
       SIGN UP MODE
    ===================================================== */

    else {

        title.textContent =
            "Create your JobNest account";


        subtitle.textContent =
            "Join thousands of job seekers";


        submit.textContent =
            "Create Account";


        switchText.textContent =
            "Already have an account?";


        switchButton.textContent =
            "Login";


        if (nameField) {

            nameField.style.display =
                "block";

        }


        if (nameInput) {

            nameInput.required =
                true;

        }

    }

}


/* =========================================================
   HANDLE LOGIN / SIGN UP
========================================================= */

function handleAuth(event) {

    event.preventDefault();


    const emailInput =
        document.getElementById(
            "authEmail"
        );

    const passwordInput =
        document.getElementById(
            "authPassword"
        );


    if (!emailInput || !passwordInput) {

        return;

    }


    const email =
        emailInput.value
            .trim()
            .toLowerCase();


    const password =
        passwordInput.value;


    /* =====================================================
       SIGN UP
    ===================================================== */

    if (authMode === "signup") {

        const nameInput =
            document.getElementById(
                "authName"
            );


        const name =
            nameInput
                ? nameInput.value.trim()
                : "";


        if (!name) {

            alert(
                "Please enter your full name."
            );

            return;

        }


        if (!email) {

            alert(
                "Please enter your email."
            );

            return;

        }


        if (password.length < 6) {

            alert(
                "Password must contain at least 6 characters."
            );

            return;

        }


        const users =
            getUsers();


        const existingUser =
            users.find(
                user =>
                    user.email === email
            );


        if (existingUser) {

            alert(
                "An account with this email already exists. Please login."
            );


            authMode =
                "login";


            updateAuthModal();


            return;

        }


        const newUser = {

            id:
                Date.now(),

            name:
                name,

            email:
                email,

            password:
                password,

            role:
                "Job Seeker",

            createdAt:
                new Date().toLocaleDateString()

        };


        users.push(
            newUser
        );


        saveUsers(
            users
        );


        /*
           Automatically login the new user.
        */

        localStorage.setItem(
            "jobnest_current_user",
            JSON.stringify(newUser)
        );


        alert(
            "Account created successfully!"
        );


        closeModal();


        event.target.reset();


        updateNavbar();


        return;

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    const users =
        getUsers();


    const user =
        users.find(
            storedUser =>
                storedUser.email === email &&
                storedUser.password === password
        );


    if (!user) {

        alert(
            "Invalid email or password."
        );

        return;

    }


    localStorage.setItem(
        "jobnest_current_user",
        JSON.stringify(user)
    );


    alert(
        "Login successful!"
    );


    closeModal();


    event.target.reset();


    updateNavbar();

}


/* =========================================================
   UPDATE NAVBAR
========================================================= */

/* =========================================================
   UPDATE NAVBAR LOGIN / SIGNUP / ACCOUNT
========================================================= */

function updateNavbar() {

    const loginButton =
        document.getElementById("loginNavBtn");

    const signupButton =
        document.getElementById("signupNavBtn");

    const accountButton =
        document.getElementById("accountNavBtn");

    const accountName =
        document.getElementById("accountNavName");

    const currentUser =
        getCurrentUser();


    /* =====================================================
       USER IS LOGGED IN
    ===================================================== */

    if (currentUser) {

        /*
           Hide Login button
        */
        if (loginButton) {

            loginButton.style.setProperty(
                "display",
                "none",
                "important"
            );

        }


        /*
           Hide Sign Up button
        */
        if (signupButton) {

            signupButton.style.setProperty(
                "display",
                "none",
                "important"
            );

        }


        /*
           Show Account button
        */
        if (accountButton) {

            accountButton.style.setProperty(
                "display",
                "inline-flex",
                "important"
            );

        }


        /*
           Show user's name on Account button
        */
        if (accountName) {

            accountName.textContent =
                currentUser.name || "Account";

        }

    }


    /* =====================================================
       USER IS LOGGED OUT
    ===================================================== */

    else {

        /*
           Show Login button
        */
        if (loginButton) {

            loginButton.style.setProperty(
                "display",
                "inline-flex",
                "important"
            );

        }


        /*
           Show Sign Up button
        */
        if (signupButton) {

            signupButton.style.setProperty(
                "display",
                "inline-flex",
                "important"
            );

        }


        /*
           Hide Account button
        */
        if (accountButton) {

            accountButton.style.setProperty(
                "display",
                "none",
                "important"
            );

        }

    }

}

/* =========================================================
   OPEN ACCOUNT
========================================================= */

function openAccount() {

    const user =
        getCurrentUser();


    if (!user) {

        openLogin();

        return;

    }


    const accountModal =
        document.getElementById(
            "accountModal"
        );


    const accountName =
        document.getElementById(
            "accountName"
        );


    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    const accountDate =
        document.getElementById(
            "accountDate"
        );


    if (accountName) {

        accountName.textContent =
            user.name ||
            "User";

    }


    if (accountEmail) {

        accountEmail.textContent =
            user.email ||
            "-";

    }


    if (accountDate) {

        accountDate.textContent =
            user.createdAt ||
            "-";

    }


    if (accountModal) {

        accountModal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   CLOSE ACCOUNT
========================================================= */

function closeAccount() {

    const accountModal =
        document.getElementById(
            "accountModal"
        );


    if (accountModal) {

        accountModal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    localStorage.removeItem(
        "jobnest_current_user"
    );


    closeAccount();


    updateNavbar();


    alert(
        "You have been logged out successfully."
    );

}


/* =========================================================
   CLOSE AUTH MODAL BY CLICKING OUTSIDE
========================================================= */

function initializeAuthModal() {

    const authModal =
        document.getElementById(
            "authModal"
        );


    if (!authModal) {

        return;

    }


    authModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                authModal
            ) {

                closeModal();

            }

        }
    );

}


/* =========================================================
   CLOSE ACCOUNT MODAL BY CLICKING OUTSIDE
========================================================= */

function initializeAccountModal() {

    const accountModal =
        document.getElementById(
            "accountModal"
        );


    if (!accountModal) {

        return;

    }


    accountModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                accountModal
            ) {

                closeAccount();

            }

        }
    );

}


/* =========================================================
   ENTER KEY SEARCH
========================================================= */

function initializeSearchKeyboard() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter"
            ) {

                return;

            }


            const activeElement =
                document.activeElement;


            if (
                activeElement &&
                (
                    activeElement.id ===
                        "jobKeyword" ||

                    activeElement.id ===
                        "locationInput"
                )
            ) {

                searchJobs();

            }

        }
    );

}


/* =========================================================
   CLOSE LOCATION SUGGESTIONS
========================================================= */

function initializeOutsideClick() {

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".location-field"
                )
            ) {

                if (locationSuggestions) {

                    locationSuggestions.style.display =
                        "none";

                }

            }

        }
    );

}


/* =========================================================
   ADMIN PORTAL
========================================================= */

function openAdminPortal() {

    window.location.href =
        "admin.html";

}


/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeJobs();

        initializeLocationSearch();

        initializeAuthModal();

        initializeAccountModal();

        initializeSearchKeyboard();

        initializeOutsideClick();

        displayFeaturedJobs();

        updateNavbar();

    }
);
document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeJobs();

        initializeLocationSearch();

        initializeAuthModal();

        initializeAccountModal();

        initializeSearchKeyboard();

        initializeOutsideClick();

        displayFeaturedJobs();

        /*
           Check login status whenever page loads
        */
        updateNavbar();

    }
);