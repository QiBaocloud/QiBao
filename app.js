// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyA4HP6jNQdR1m3cQaAfyi9fXar15v1n29Q",
  authDomain: "qibao-91f3c.firebaseapp.com",
  projectId: "qibao-91f3c",
  storageBucket: "qibao-91f3c.firebasestorage.app",
  messagingSenderId: "506177155217",
  appId: "1:506177155217:web:077555f03999eff86fcf30",
  measurementId: "G-ET5GWR87LZ"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

// 登录功能
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('error-message').innerText = error.message;
    }
});

// 注册功能
document.getElementById('registerForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('register-error-message').innerText = error.message;
    }
});

// 发布文章
document.getElementById('postForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const user = auth.currentUser;

    if (user) {
        await firestore.collection('posts').add({
            title: title,
            content: content,
            author: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        window.location.href = 'index.html';
    }
});

// 获取当前用户状态
auth.onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById('userStatus').innerText = `欢迎，${user.email}`;
    } else {
        document.getElementById('userStatus').innerText = '未登录';
    }
});
