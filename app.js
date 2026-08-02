// ========================================
// SWIFTPAY APP.JS
// ========================================


// ========================================
// SPLASH SCREEN
// ========================================

if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);
    });
}


// ========================================
// SIGN UP
// ========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const fullName =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const signupButton =
            document.getElementById("signupButton");

        const signupMessage =
            document.getElementById("signupMessage");


        if (password !== confirmPassword) {

            signupMessage.textContent =
                "Passwords do not match.";

            signupMessage.style.color =
                "red";

            return;
        }


        if (password.length < 6) {

            signupMessage.textContent =
                "Password must be at least 6 characters.";

            signupMessage.style.color =
                "red";

            return;
        }


        signupButton.disabled = true;

        signupButton.textContent =
            "Creating Account...";


        try {

            const { error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            full_name: fullName,

                            phone: phone

                        }

                    }

                });


            if (error) {

                throw error;

            }


            signupMessage.textContent =
                "Account created successfully! Please check your email to verify your account.";

            signupMessage.style.color =
                "#00a844";


            signupForm.reset();


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 3000);


        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );


            signupMessage.textContent =
                error.message ||
                "Something went wrong. Please try again.";

            signupMessage.style.color =
                "red";


        } finally {

            signupButton.disabled =
                false;

            signupButton.textContent =
                "Create Account";

        }

    });

}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const loginButton =
                document.getElementById("loginButton");


            const loginMessage =
                document.getElementById("loginMessage");


            loginButton.disabled =
                true;

            loginButton.textContent =
                "Signing In...";


            try {

                const {
                    error
                } =
                    await supabaseClient.auth.signInWithPassword({

                        email: email,

                        password: password

                    });


                if (error) {

                    throw error;

                }


                loginMessage.textContent =
                    "Login successful! Redirecting...";

                loginMessage.style.color =
                    "#00a844";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                loginMessage.textContent =
                    error.message ||
                    "Invalid email or password.";

                loginMessage.style.color =
                    "red";


            } finally {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";

            }

        }
    );

}


// ========================================
// DASHBOARD AUTHENTICATION
// ========================================

const userNameElement =
    document.getElementById("userName");

if (userNameElement) {

    async function loadDashboard() {

        const {
            data: {
                user
            },
            error
        } =
            await supabaseClient.auth.getUser();


        if (error || !user) {

            window.location.href =
                "login.html";

            return;

        }


        const fullName =
            user.user_metadata?.full_name;


        userNameElement.textContent =
            fullName ||
            "SwiftPay User";

    }


    loadDashboard();

}


// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            logoutButton.disabled =
                true;

            logoutButton.textContent =
                "Logging out...";


            const {
                error
            } =
                await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                logoutButton.disabled =
                    false;

                logoutButton.textContent =
                    "🚪 Logout";

                return;

            }


            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// LOAD WALLET BALANCE
// ========================================

const walletBalanceElement =
    document.getElementById("walletBalance");

if (walletBalanceElement) {

    async function loadWalletBalance() {

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (userError || !user) {

            window.location.href =
                "login.html";

            return;

        }


        const {
            data: wallet,
            error: walletError
        } =
            await supabaseClient
                .from("wallets")
                .select("balance")
                .eq(
                    "user_id",
                    user.id
                )
                .single();


        if (walletError) {

            console.error(
                "Wallet Error:",
                walletError
            );


            walletBalanceElement.textContent =
                "₦0.00";

            return;

        }


        const balance =
            Number(
                wallet.balance || 0
            );


        walletBalanceElement.textContent =
            "₦" +
            balance.toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    loadWalletBalance();

}


// ========================================
// SEND MONEY BUTTON
// ========================================

const sendMoneyButton =
    document.getElementById(
        "sendMoneyButton"
    );

if (
    sendMoneyButton &&
    !document.getElementById("sendMoneyForm")
) {

    sendMoneyButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "send-money.html";

        }
    );

}


// ========================================
// SEND MONEY FORM
// ========================================

const sendMoneyForm =
    document.getElementById("sendMoneyForm");

if (sendMoneyForm) {

    sendMoneyForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const beneficiaryName =
                document
                    .getElementById("beneficiaryName")
                    .value
                    .trim();

            const receiverAccountNumber =
                document
                    .getElementById("receiverAccountNumber")
                    .value
                    .trim();

            const amount =
                Number(
                    document
                        .getElementById("amount")
                        .value
                );

            const descriptionElement =
                document.getElementById("description");

            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";

            const button =
                document.getElementById(
                    "sendMoneyButton"
                );

            const message =
                document.getElementById(
                    "sendMoneyMessage"
                );


            // ==============================
            // VALIDATION
            // ==============================

            if (
                !beneficiaryName ||
                !receiverAccountNumber ||
                !amount
            ) {

                message.textContent =
                    "Please enter the beneficiary name, SwiftPay account number and amount.";

                message.style.color = "red";

                return;
            }


            if (
                !/^\d{10}$/.test(
                    receiverAccountNumber
                )
            ) {

                message.textContent =
                    "Please enter a valid 10-digit SwiftPay account number.";

                message.style.color = "red";

                return;
            }


            if (amount <= 0) {

                message.textContent =
                    "Enter a valid amount.";

                message.style.color = "red";

                return;
            }


            // ==============================
            // CHECK LOGIN
            // ==============================

            button.disabled = true;

            button.textContent =
                "Processing...";

            message.textContent =
                "Processing your transfer...";

            message.style.color = "#555";


            try {

                const {
                    data: {
                        user
                    },
                    error: userError
                } =
                    await supabaseClient.auth.getUser();


                if (
                    userError ||
                    !user
                ) {

                    throw new Error(
                        "Your session has expired. Please log in again."
                    );

                }


                // ==============================
                // SEND MONEY BY ACCOUNT NUMBER
                // ==============================

                const {
                    error: transferError
                } =
                    await supabaseClient.rpc(
                        "send_money_by_account_number",
                        {
                            receiver_account_number:
                                receiverAccountNumber,

                            transfer_amount:
                                amount,

                            transfer_description:
                                description ||
                                `Transfer to ${beneficiaryName}`
                        }
                    );


                if (transferError) {

                    throw transferError;

                }


                // ==============================
                // SUCCESS
                // ==============================

                message.textContent =
                    "Transfer successful!";

                message.style.color =
                    "#00a844";


                sendMoneyForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Transfer Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Transfer failed. Please try again.";

                message.style.color =
                    "red";


            } finally {

                button.disabled = false;

                button.textContent =
                    "Continue";

            }

        }
    );

}
// ========================================
// FORGOT PASSWORD
// ========================================

const forgotPasswordForm =
    document.getElementById(
        "forgotPasswordForm"
    );

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "forgotEmail"
                    )
                    .value
                    .trim();


            const button =
                document.getElementById(
                    "forgotPasswordButton"
                );


            const message =
                document.getElementById(
                    "forgotPasswordMessage"
                );


            button.disabled =
                true;

            button.textContent =
                "Sending...";


            message.textContent =
                "Sending password reset link...";


            try {

                const {
                    error
                } =
                    await supabaseClient.auth.resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                window.location.origin +
                                "/reset-password.html"
                        }
                    );


                if (error) {

                    throw error;

                }


                message.textContent =
                    "Password reset link sent! Check your email.";

                message.style.color =
                    "#00a844";


                forgotPasswordForm.reset();


            } catch (error) {

                console.error(
                    "Forgot Password Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Unable to send reset link.";

                message.style.color =
                    "red";


            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "Send Reset Link";

            }

        }
    );

}


// ========================================
// RESET PASSWORD
// ========================================

const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );

if (resetPasswordForm) {

    resetPasswordForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const newPassword =
                document
                    .getElementById(
                        "newPassword"
                    )
                    .value;


            const confirmNewPassword =
                document
                    .getElementById(
                        "confirmNewPassword"
                    )
                    .value;


            const button =
                document.getElementById(
                    "resetPasswordButton"
                );


            const message =
                document.getElementById(
                    "resetPasswordMessage"
                );


            if (newPassword.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                message.style.color =
                    "red";

                return;

            }


            if (
                newPassword !==
                confirmNewPassword
            ) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color =
                    "red";

                return;

            }


            button.disabled =
                true;

            button.textContent =
                "Updating...";


            try {

                const {
                    error
                } =
                    await supabaseClient.auth.updateUser({

                        password:
                            newPassword

                    });


                if (error) {

                    throw error;

                }


                message.textContent =
                    "Password updated successfully!";

                message.style.color =
                    "#00a844";


                resetPasswordForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 2000);


            } catch (error) {

                console.error(
                    "Reset Password Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Unable to update password.";

                message.style.color =
                    "red";


            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "Update Password";

            }

        }
    );

}


// ========================================
// LOAD ALL TRANSACTIONS
// ========================================

const allTransactionsElement =
    document.getElementById(
        "allTransactions"
    );

if (allTransactionsElement) {

    async function loadAllTransactions() {

        try {

            const {
                data: {
                    user
                },
                error: userError
            } =
                await supabaseClient.auth.getUser();


            if (
                userError ||
                !user
            ) {

                window.location.href =
                    "login.html";

                return;

            }


            const {
                data: transactions,
                error: transactionError
            } =
                await supabaseClient
                    .from("tranasctions")
                    .select("*")
                    .eq(
                        "user_id",
                        user.id
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (transactionError) {

                console.error(
                    "Transaction Error:",
                    transactionError
                );


                allTransactionsElement.innerHTML = `
                    <p class="empty-transactions">
                        Unable to load transactions.
                    </p>
                `;

                return;

            }


            if (
                !transactions ||
                transactions.length === 0
            ) {

                allTransactionsElement.innerHTML = `
                    <p class="empty-transactions">
                        No transactions yet.
                    </p>
                `;

                return;

            }


            allTransactionsElement.innerHTML =
                transactions
                    .map(transaction => {

                        const isReceived =
                            transaction.type === "received";


                        const sign =
                            isReceived
                                ? "+"
                                : "-";


                        const amount =
                            Number(
                                transaction.amount || 0
                            ).toLocaleString(
                                "en-NG",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            );


                        const date =
                            new Date(
                                transaction.created_at
                            ).toLocaleString(
                                "en-NG"
                            );


                        return `

                            <div class="transaction-item">

                                <div class="transaction-icon">
                                    ${
                                        isReceived
                                            ? "📥"
                                            : "📤"
                                    }
                                </div>


                                <div class="transaction-details">

                                    <h3>
                                        ${
                                            isReceived
                                                ? "Money Received"
                                                : "Money Sent"
                                        }
                                    </h3>


                                    <p>
                                        ${
                                            transaction.description ||
                                            "SwiftPay transaction"
                                        }
                                    </p>


                                    <small>
                                        ${date}
                                    </small>

                                </div>


                                <div class="transaction-amount">

                                    <strong>
                                        ${sign}₦${amount}
                                    </strong>


                                    <small>
                                        ${
                                            transaction.status ||
                                            "successful"
                                        }
                                    </small>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        } catch (error) {

            console.error(
                "Load Transactions Error:",
                error
            );


            allTransactionsElement.innerHTML = `
                <p class="empty-transactions">
                    Unable to load transactions.
                </p>
            `;

        }

    }


    loadAllTransactions();

}


// ========================================
// LOAD RECENT TRANSACTIONS ON DASHBOARD
// ========================================

const recentTransactionsElement =
    document.getElementById(
        "recentTransactions"
    );

if (
    recentTransactionsElement &&
    window.location.pathname.includes(
        "dashboard.html"
    )
) {

    async function loadRecentTransactions() {

        try {

            const {
                data: {
                    user
                },
                error: userError
            } =
                await supabaseClient.auth.getUser();


            if (
                userError ||
                !user
            ) {

                window.location.href =
                    "login.html";

                return;

            }


            const {
                data: transactions,
                error: transactionError
            } =
                await supabaseClient
                    .from("tranasctions")
                    .select("*")
                    .eq(
                        "user_id",
                        user.id
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    )
                    .limit(5);


            if (transactionError) {

                console.error(
                    "Recent Transactions Error:",
                    transactionError
                );


                recentTransactionsElement.innerHTML = `
                    <p class="empty-transactions">
                        Unable to load transactions.
                    </p>
                `;

                return;

            }


            if (
                !transactions ||
                transactions.length === 0
            ) {

                recentTransactionsElement.innerHTML = `
                    <p class="empty-transactions">
                        No transactions yet.
                    </p>
                `;

                return;

            }


            recentTransactionsElement.innerHTML =
                transactions
                    .map(transaction => {

                        const isReceived =
                            transaction.type === "received";


                        const sign =
                            isReceived
                                ? "+"
                                : "-";


                        const amount =
                            Number(
                                transaction.amount || 0
                            ).toLocaleString(
                                "en-NG",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            );


                        return `

                            <div class="transaction-item">

                                <div class="transaction-icon">

                                    ${
                                        isReceived
                                            ? "📥"
                                            : "📤"
                                    }

                                </div>


                                <div class="transaction-details">

                                    <h3>

                                        ${
                                            isReceived
                                                ? "Money Received"
                                                : "Money Sent"
                                        }

                                    </h3>


                                    <p>

                                        ${
                                            transaction.description ||
                                            "SwiftPay transaction"
                                        }

                                    </p>

                                </div>


                                <div class="transaction-amount">

                                    <strong>

                                        ${sign}₦${amount}

                                    </strong>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        } catch (error) {

            console.error(
                "Recent Transactions Load Error:",
                error
            );


            recentTransactionsElement.innerHTML = `
                <p class="empty-transactions">
                    Unable to load transactions.
                </p>
            `;

        }

    }


    loadRecentTransactions();

}


// ========================================
// LOAD USER PROFILE
// ========================================

const profileNameElement =
    document.getElementById(
        "profileName"
    );

if (profileNameElement) {

    async function loadUserProfile() {

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (
            userError ||
            !user
        ) {

            window.location.href =
                "login.html";

            return;

        }


        // Load profile data from profiles table

        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "full_name, phone, account_number"
                )
                .eq(
                    "id",
                    user.id
                )
                .single();


        if (profileError) {

            console.error(
                "Profile Error:",
                profileError
            );

        }


        const fullName =
            profile?.full_name ||
            user.user_metadata?.full_name ||
            "SwiftPay User";


        const email =
            user.email ||
            "No email available";


        const phone =
            profile?.phone ||
            user.user_metadata?.phone ||
            "No phone number";


        const accountNumber =
            profile?.account_number ||
            "Not assigned yet";


        const profileEmail =
            document.getElementById(
                "profileEmail"
            );

        const profilePhone =
            document.getElementById(
                "profilePhone"
            );

        const profileFullName =
            document.getElementById(
                "profileFullName"
            );

        const profileEmailInfo =
            document.getElementById(
                "profileEmailInfo"
            );

        const profilePhoneInfo =
            document.getElementById(
                "profilePhoneInfo"
            );

        const profileAccountNumber =
            document.getElementById(
                "profileAccountNumber"
            );


        document.getElementById(
            "profileName"
        ).textContent =
            fullName;


        if (profileEmail) {

            profileEmail.textContent =
                email;

        }


        if (profilePhone) {

            profilePhone.textContent =
                phone;

        }


        if (profileFullName) {

            profileFullName.textContent =
                fullName;

        }


        if (profileEmailInfo) {

            profileEmailInfo.textContent =
                email;

        }


        if (profilePhoneInfo) {

            profilePhoneInfo.textContent =
                phone;

        }


        if (profileAccountNumber) {

            profileAccountNumber.textContent =
                accountNumber;

        }

    }


    loadUserProfile();

}


// ========================================
// CHANGE PASSWORD
// ========================================

const changePasswordButton =
    document.getElementById(
        "changePasswordButton"
    );

if (changePasswordButton) {

    changePasswordButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "reset-password.html";

        }
    );

}


// ========================================
// EDIT PROFILE
// ========================================

const editProfileForm =
    document.getElementById(
        "editProfileForm"
    );

if (editProfileForm) {

    async function loadEditProfileData() {

        const {
            data: {
                user
            },
            error
        } =
            await supabaseClient.auth.getUser();


        if (
            error ||
            !user
        ) {

            window.location.href =
                "login.html";

            return;

        }


        const {
            data: profile
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "full_name, phone"
                )
                .eq(
                    "id",
                    user.id
                )
                .single();


        const editFullName =
            document.getElementById(
                "editFullName"
            );

        const editPhone =
            document.getElementById(
                "editPhone"
            );


        if (editFullName) {

            editFullName.value =
                profile?.full_name ||
                user.user_metadata?.full_name ||
                "";

        }


        if (editPhone) {

            editPhone.value =
                profile?.phone ||
                user.user_metadata?.phone ||
                "";

        }

    }


    loadEditProfileData();


    editProfileForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const fullName =
                document
                    .getElementById(
                        "editFullName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "editPhone"
                    )
                    .value
                    .trim();


            const saveButton =
                document.getElementById(
                    "saveProfileButton"
                );


            const message =
                document.getElementById(
                    "editProfileMessage"
                );


            if (!fullName) {

                message.textContent =
                    "Please enter your full name.";

                message.style.color =
                    "red";

                return;

            }


            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";


            try {

                // Update Supabase Auth metadata

                const {
                    error: authError
                } =
                    await supabaseClient.auth.updateUser({

                        data: {

                            full_name:
                                fullName,

                            phone:
                                phone

                        }

                    });


                if (authError) {

                    throw authError;

                }


                // Update profiles table

                const {
                    error: profileError
                } =
                    await supabaseClient
                        .from("profiles")
                        .update({

                            full_name:
                                fullName,

                            phone:
                                phone

                        })
                        .eq(
                            "id",
                            (
                                await supabaseClient.auth.getUser()
                            ).data.user.id
                        );


                if (profileError) {

                    throw profileError;

                }


                message.textContent =
                    "Profile updated successfully!";

                message.style.color =
                    "#00a844";


                const profileName =
                    document.getElementById(
                        "profileName"
                    );

                if (profileName) {

                    profileName.textContent =
                        fullName;

                }


                const profileFullName =
                    document.getElementById(
                        "profileFullName"
                    );

                if (profileFullName) {

                    profileFullName.textContent =
                        fullName;

                }


                const profilePhone =
                    document.getElementById(
                        "profilePhone"
                    );

                if (profilePhone) {

                    profilePhone.textContent =
                        phone ||
                        "No phone number";

                }


                const profilePhoneInfo =
                    document.getElementById(
                        "profilePhoneInfo"
                    );

                if (profilePhoneInfo) {

                    profilePhoneInfo.textContent =
                        phone ||
                        "No phone number";

                }


            } catch (error) {

                console.error(
                    "Profile Update Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Unable to update profile.";

                message.style.color =
                    "red";

            } finally {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "Save Changes";

            }

        }
    );

}


// ========================================
// RECEIVE MONEY BUTTON
// ========================================

const receiveMoneyButton =
    document.getElementById(
        "receiveMoneyButton"
    );

if (receiveMoneyButton) {

    receiveMoneyButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "receive-money.html";

        }
    );

}


// ========================================
// LOAD RECEIVE MONEY PAGE
// ========================================

const receiveEmailElement =
    document.getElementById(
        "receiveEmail"
    );

if (receiveEmailElement) {

    async function loadReceiveMoneyPage() {

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (
            userError ||
            !user
        ) {

            window.location.href =
                "login.html";

            return;

        }


        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "account_number"
                )
                .eq(
                    "id",
                    user.id
                )
                .single();


        if (profileError) {

            console.error(
                "Receive Profile Error:",
                profileError
            );

        }


        const accountNumber =
            profile?.account_number ||
            "Not assigned yet";


        // Support account number display

        const receiveAccountNumberElement =
            document.getElementById(
                "receiveAccountNumber"
            );


        if (receiveAccountNumberElement) {

            receiveAccountNumberElement.textContent =
                accountNumber;

        }


        // Keep email display if it exists

        receiveEmailElement.textContent =
            user.email ||
            "No email available";


        const copyAccountButton =
            document.getElementById(
                "copyAccountButton"
            );


        const copyAccountMessage =
            document.getElementById(
                "copyAccountMessage"
            );


        if (copyAccountButton) {

            copyAccountButton.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard.writeText(
                            accountNumber
                        );


                        if (copyAccountMessage) {

                            copyAccountMessage.textContent =
                                "Account number copied successfully!";

                            copyAccountMessage.style.color =
                                "#00a844";

                        }


                    } catch (error) {

                        console.error(
                            "Copy Account Error:",
                            error
                        );


                        if (copyAccountMessage) {

                            copyAccountMessage.textContent =
                                "Unable to copy account number.";

                            copyAccountMessage.style.color =
                                "red";

                        }

                    }

                }
            );

        }


        // Keep email copy button working if it exists

        const copyEmailButton =
            document.getElementById(
                "copyEmailButton"
            );


        const copyEmailMessage =
            document.getElementById(
                "copyEmailMessage"
            );


        if (copyEmailButton) {

            copyEmailButton.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard.writeText(
                            user.email
                        );


                        if (copyEmailMessage) {

                            copyEmailMessage.textContent =
                                "Email copied successfully!";

                            copyEmailMessage.style.color =
                                "#00a844";

                        }


                    } catch (error) {

                        console.error(
                            "Copy Email Error:",
                            error
                        );


                        if (copyEmailMessage) {

                            copyEmailMessage.textContent =
                                "Unable to copy email.";

                            copyEmailMessage.style.color =
                                "red";

                        }

                    }

                }
            );

        }

    }


    loadReceiveMoneyPage();

}


// ========================================
// ADD MONEY BUTTON
// ========================================

const addMoneyButton =
    document.getElementById(
        "addMoneyButton"
    );

if (
    addMoneyButton &&
    !document.getElementById(
        "addMoneyForm"
    )
) {

    addMoneyButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "add-money.html";

        }
    );

}


// ========================================
// TEST ADD MONEY
// ========================================

const addMoneyForm =
    document.getElementById(
        "addMoneyForm"
    );

if (addMoneyForm) {

    addMoneyForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const amount =
                Number(
                    document
                        .getElementById(
                            "addMoneyAmount"
                        )
                        .value
                );


            const button =
                document.getElementById(
                    "addMoneyButton"
                );


            const message =
                document.getElementById(
                    "addMoneyMessage"
                );


            if (
                !amount ||
                amount < 100
            ) {

                message.textContent =
                    "Please enter an amount of at least ₦100.";

                message.style.color =
                    "red";

                return;

            }


            button.disabled =
                true;

            button.textContent =
                "Adding Money...";


            message.textContent =
                "Adding money to your wallet...";


            try {

                const {
                    data: {
                        user
                    },
                    error: userError
                } =
                    await supabaseClient.auth.getUser();


                if (
                    userError ||
                    !user
                ) {

                    throw new Error(
                        "Please log in again."
                    );

                }


                const {
                    error: rpcError
                } =
                    await supabaseClient.rpc(
                        "test_add_money",
                        {

                            deposit_amount:
                                amount

                        }
                    );


                if (rpcError) {

                    throw rpcError;

                }


                message.textContent =
                    "₦" +
                    amount.toLocaleString(
                        "en-NG"
                    ) +
                    " added successfully!";

                message.style.color =
                    "#00a844";


                addMoneyForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "wallet.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Test Add Money Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Unable to add money. Please try again.";

                message.style.color =
                    "red";


            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "Continue";

            }

        }
    );

}


// ========================================
// AIRTIME BUTTON
// ========================================

const airtimeDashboardButton =
    document.getElementById(
        "airtimeButton"
    );

if (
    airtimeDashboardButton &&
    !document.getElementById(
        "airtimeForm"
    )
) {

    airtimeDashboardButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "airtime.html";

        }
    );

}


// ========================================
// AIRTIME PURCHASE
// ========================================

const airtimeForm =
    document.getElementById(
        "airtimeForm"
    );

if (airtimeForm) {

    airtimeForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const phone =
                document
                    .getElementById(
                        "airtimePhone"
                    )
                    .value
                    .trim();

            const network =
                document
                    .getElementById(
                        "airtimeNetwork"
                    )
                    .value;

            const amount =
                Number(
                    document
                        .getElementById(
                            "airtimeAmount"
                        )
                        .value
                );

            const airtimePurchaseButton =
                document.getElementById(
                    "airtimeButton"
                );

            const message =
                document.getElementById(
                    "airtimeMessage"
                );


            if (
                !phone ||
                !network ||
                !amount
            ) {

                message.textContent =
                    "Please fill in all fields.";

                message.style.color =
                    "red";

                return;

            }


            if (amount < 50) {

                message.textContent =
                    "Minimum airtime purchase is ₦50.";

                message.style.color =
                    "red";

                return;

            }


            airtimePurchaseButton.disabled =
                true;

            airtimePurchaseButton.textContent =
                "Processing...";

            message.textContent =
                "Processing airtime purchase...";

            message.style.color =
                "#555";


            try {

                const {
                    error
                } =
                    await supabaseClient.rpc(
                        "buy_airtime",
                        {

                            airtime_phone:
                                phone,

                            airtime_network:
                                network,

                            airtime_amount:
                                amount

                        }
                    );


                if (error) {

                    throw error;

                }


                message.textContent =
                    "Airtime purchase successful!";

                message.style.color =
                    "#00a844";


                airtimeForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Airtime Purchase Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Airtime purchase failed.";

                message.style.color =
                    "red";


            } finally {

                airtimePurchaseButton.disabled =
                    false;

                airtimePurchaseButton.textContent =
                    "Buy Airtime";

            }

        }
    );

}


// ========================================
// DATA BUTTON
// ========================================

const dataDashboardButton =
    document.getElementById(
        "dataButton"
    );

if (
    dataDashboardButton &&
    !document.getElementById(
        "dataForm"
    )
) {

    dataDashboardButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "data.html";

        }
    );

}


// ========================================
// DATA PURCHASE
// ========================================

const dataForm =
    document.getElementById(
        "dataForm"
    );

if (dataForm) {

    dataForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const phone =
                document
                    .getElementById(
                        "dataPhone"
                    )
                    .value
                    .trim();


            const network =
                document
                    .getElementById(
                        "dataNetwork"
                    )
                    .value;


            const dataPlan =
                document
                    .getElementById(
                        "dataPlan"
                    )
                    .value;


            const dataButton =
                document.getElementById(
                    "dataButton"
                );


            const message =
                document.getElementById(
                    "dataMessage"
                );


            if (
                !phone ||
                !network ||
                !dataPlan
            ) {

                message.textContent =
                    "Please fill in all fields.";

                message.style.color =
                    "red";

                return;

            }


            let amount = 0;


            if (
                dataPlan ===
                "500MB - ₦150"
            ) {

                amount = 150;

            } else if (
                dataPlan ===
                "1GB - ₦300"
            ) {

                amount = 300;

            } else if (
                dataPlan ===
                "2GB - ₦600"
            ) {

                amount = 600;

            } else if (
                dataPlan ===
                "5GB - ₦1,500"
            ) {

                amount = 1500;

            } else if (
                dataPlan ===
                "10GB - ₦3,000"
            ) {

                amount = 3000;

            }


            dataButton.disabled =
                true;

            dataButton.textContent =
                "Processing...";


            message.textContent =
                "Processing data purchase...";

            message.style.color =
                "#555";


            try {

                const {
                    error
                } =
                    await supabaseClient.rpc(
                        "buy_data",
                        {

                            data_phone:
                                phone,

                            data_network:
                                network,

                            data_plan:
                                dataPlan,

                            data_amount:
                                amount

                        }
                    );


                if (error) {

                    throw error;

                }


                message.textContent =
                    "Data purchase successful!";

                message.style.color =
                    "#00a844";


                dataForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Data Purchase Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Data purchase failed.";

                message.style.color =
                    "red";


            } finally {

                dataButton.disabled =
                    false;

                dataButton.textContent =
                    "Buy Data";

            }

        }
    );

}


// ========================================
// ELECTRICITY BUTTON
// ========================================

const electricityDashboardButton =
    document.getElementById(
        "electricityButton"
    );

if (
    electricityDashboardButton &&
    !document.getElementById(
        "electricityForm"
    )
) {

    electricityDashboardButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "electricity.html";

        }
    );

}


// ========================================
// ELECTRICITY BILL PAYMENT
// ========================================

const electricityForm =
    document.getElementById(
        "electricityForm"
    );

if (electricityForm) {

    electricityForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const provider =
                document
                    .getElementById(
                        "electricityProvider"
                    )
                    .value;


            const meterNumber =
                document
                    .getElementById(
                        "meterNumber"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "electricityAmount"
                        )
                        .value
                );


            const electricityButton =
                document.getElementById(
                    "electricityButton"
                );


            const message =
                document.getElementById(
                    "electricityMessage"
                );


            if (
                !provider ||
                !meterNumber ||
                !amount
            ) {

                message.textContent =
                    "Please fill in all fields.";

                message.style.color =
                    "red";

                return;

            }


            if (amount < 500) {

                message.textContent =
                    "Minimum electricity payment is ₦500.";

                message.style.color =
                    "red";

                return;

            }


            electricityButton.disabled =
                true;

            electricityButton.textContent =
                "Processing...";


            message.textContent =
                "Processing electricity payment...";

            message.style.color =
                "#555";


            try {

                const {
                    error
                } =
                    await supabaseClient.rpc(
                        "pay_electricity",
                        {

                            electricity_provider:
                                provider,

                            meter_number:
                                meterNumber,

                            electricity_amount:
                                amount

                        }
                    );


                if (error) {

                    throw error;

                }


                message.textContent =
                    "Electricity payment successful!";

                message.style.color =
                    "#00a844";


                electricityForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Electricity Payment Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Electricity payment failed.";

                message.style.color =
                    "red";


            } finally {

                electricityButton.disabled =
                    false;

                electricityButton.textContent =
                    "Pay Electricity Bill";

            }

        }
    );

}


// ========================================
// CABLE TV BUTTON
// ========================================

const cableDashboardButton =
    document.getElementById(
        "cableButton"
    );

if (
    cableDashboardButton &&
    !document.getElementById(
        "cableForm"
    )
) {

    cableDashboardButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "cable.html";

        }
    );

}


// ========================================
// CABLE TV PAYMENT
// ========================================

const cableForm =
    document.getElementById(
        "cableForm"
    );

if (cableForm) {

    cableForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const provider =
                document
                    .getElementById(
                        "cableProvider"
                    )
                    .value;


            const smartcardNumber =
                document
                    .getElementById(
                        "smartcardNumber"
                    )
                    .value
                    .trim();


            const cablePlan =
                document
                    .getElementById(
                        "cablePlan"
                    )
                    .value;


            const cableButton =
                document.getElementById(
                    "cableButton"
                );


            const message =
                document.getElementById(
                    "cableMessage"
                );


            let amount = 0;


            if (
                cablePlan ===
                "DStv Access - ₦2,000"
            ) {

                amount = 2000;

            } else if (
                cablePlan ===
                "DStv Family - ₦4,000"
            ) {

                amount = 4000;

            } else if (
                cablePlan ===
                "DStv Compact - ₦10,000"
            ) {

                amount = 10000;

            } else if (
                cablePlan ===
                "GOtv Smallie - ₦1,500"
            ) {

                amount = 1500;

            } else if (
                cablePlan ===
                "GOtv Jolli - ₦3,000"
            ) {

                amount = 3000;

            } else if (
                cablePlan ===
                "Startimes Basic - ₦2,000"
            ) {

                amount = 2000;

            }


            if (
                !provider ||
                !smartcardNumber ||
                !cablePlan
            ) {

                message.textContent =
                    "Please fill in all fields.";

                message.style.color =
                    "red";

                return;

            }


            cableButton.disabled =
                true;

            cableButton.textContent =
                "Processing...";


            message.textContent =
                "Processing cable subscription...";

            message.style.color =
                "#555";


            try {

                const {
                    error
                } =
                    await supabaseClient.rpc(
                        "pay_cable",
                        {

                            cable_provider:
                                provider,

                            smartcard_number:
                                smartcardNumber,

                            cable_plan:
                                cablePlan,

                            cable_amount:
                                amount

                        }
                    );


                if (error) {

                    throw error;

                }


                message.textContent =
                    "Cable TV subscription successful!";

                message.style.color =
                    "#00a844";


                cableForm.reset();
                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Cable Payment Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Cable TV payment failed.";

                message.style.color =
                    "red";


            } finally {

                cableButton.disabled =
                    false;

                cableButton.textContent =
                    "Pay Subscription";

            }

        }
    );

}