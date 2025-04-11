 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA4HP6jNQdR1m3cQaAfyi9fXar15v1n29Q",
    authDomain: "qibao-91f3c.firebaseapp.com",
    projectId: "qibao-91f3c",
    storageBucket: "qibao-91f3c.firebasestorage.app",
    messagingSenderId: "506177155217",
    appId: "1:506177155217:web:077555f03999eff86fcf30",
    measurementId: "G-ET5GWR87LZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 身份验证状态监听
onAuthStateChanged(auth, (user) => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (user) {
        logoutBtn.style.display = 'block';
        if (window.location.pathname === '/dashboard.html') initDashboard();
    } else {
        logoutBtn.style.display = 'none';
    }
});

// 文章加载
const articlesDiv = document.getElementById('articles');
const q = query(collection(db, "articles"));

onSnapshot(q, (snapshot) => {
    articlesDiv.innerHTML = '';
    snapshot.forEach(doc => {
        const article = doc.data();
        articlesDiv.innerHTML += `
            <div class="article">
                <h3>${article.title}</h3>
                <p>${article.content}</p>
                <small>作者：${article.author} - ${new Date(article.timestamp).toLocaleDateString()}</small>
            </div>
        `;
    });
});

// 登录/注册功能
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.email.value;
        const password = form.password.value;

        try {
            if (form.id === 'loginForm') {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            window.location.href = '/dashboard.html';
        } catch (error) {
            alert(error.message);
        }
    });
});

// 登出功能
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    signOut(auth);
});
 