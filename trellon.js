import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
//import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-4CUzVTziJCX1RTW1eRWdhfYB-IDGYIg",
  authDomain: "trellonpay.firebaseapp.com",
  projectId: "trellonpay",
  storageBucket: "trellonpay.firebasestorage.app",
  messagingSenderId: "249844932711",
  appId: "1:249844932711:web:a90459c84cfa137216f4c2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function displayMessage(message, type = 'info') {
    let messageEl = document.getElementById('message');
    if (!messageEl) {
        // Create a message element dynamically if it doesn't exist
        messageEl = document.createElement('div');
        messageEl.id = 'message';
        // Basic styling (you can override this with your CSS)
        messageEl.style.position = 'absolute';
        messageEl.style.bottom = '20px';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translateX(-80%)';
        messageEl.style.padding = '10px 20px';
        messageEl.style.borderRadius = '9px';
        messageEl.style.fontFamily = 'Poppins';
        messageEl.style.zIndex = '1200';
        document.body.appendChild(messageEl);
    }
    // Set background and text colors based on the type of message
    if (type === 'error') {
        messageEl.style.backgroundColor = 'none';
        messageEl.style.color = 'red';
        messageEl.style.border = 'none';
        messageEl.style.fontSize = '18px';
        messageEl.style.fontWeight = '600';
    } else if (type === 'success') {
        messageEl.style.backgroundColor = '#d4edda';
        messageEl.style.color = '#155724';
        messageEl.style.border = '1px solid #c3e6cb';
        messageEl.style.fontSize = '18px'
        messageEl.style.borderRadius = '9px';
        messageEl.style.fontWeight = '600';
    } else {
        messageEl.style.backgroundColor = '#d1ecf1';
        messageEl.style.color = '#0c5460';
        messageEl.style.border = '1px solid #bee5eb';
    }
    messageEl.innerText = message;
    // Clear the message after 1 second
    setTimeout(() => {
        messageEl.innerText = '';
    }, 1000);
}

// --- Signup ---
const signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const username = document.getElementById('signupFullName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,  // optional if you want to store the email too
                amount: 0
            });

            // Display a success message then redirect after a short delay
            displayMessage('Created Successfully....!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            displayMessage('Invalid Credentials', 'error');
        }
    });
}

// --- Login ---
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            displayMessage('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            displayMessage('No account found', 'error');
        }
    });
}

// --- Dashboard (Show username, points, and uid) ---
if (document.getElementById('fullName')) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                document.getElementById('fullName').innerText = `${userData.username}`;
                document.getElementById('pointsDisplay').innerText = `Wallet Balance ${userData.amount}`;
                document.getElementById('userIdDisplay').innerText = user.uid;

                // Add copy user ID functionality
                const copyBtn = document.getElementById('copyUserIdBtn');
                if (copyBtn) {
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(user.uid).then(() => {
                            displayMessage("User ID copied to clipboard!", 'success');
                        }).catch(err => {
                            displayMessage("Failed to copy User ID", 'error');
                        });
                    });
                }
            } else {
                displayMessage('User data not found!', 'error');
            }
        } else {
            window.location.href = 'auth.html';
        }
    });

    // --- Logout ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await signOut(auth);
            window.location.href = 'auth.html';
        });
    }
}