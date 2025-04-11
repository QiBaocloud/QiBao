// 替换以下配置为你的Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyA4HP6jNQdR1m3cQaAfyi9fXar15v1n29Q",
  authDomain: "qibao-91f3c.firebaseapp.com",
  projectId: "qibao-91f3c",
  storageBucket: "qibao-91f3c.firebasestorage.app",
  messagingSenderId: "506177155217",
  appId: "077555f03999eff86fcf30"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById("login-btn").addEventListener("click", () => {
  const email = prompt("邮箱：");
  const password = prompt("密码：");
  auth.signInWithEmailAndPassword(email, password)
    .catch(() => auth.createUserWithEmailAndPassword(email, password))
    .then(() => alert("登录成功"));
});

document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut().then(() => alert("已登出"));
});

auth.onAuthStateChanged(user => {
  document.getElementById("login-btn").style.display = user ? "none" : "inline-block";
  document.getElementById("logout-btn").style.display = user ? "inline-block" : "none";
});

function submitPost() {
  const user = auth.currentUser;
  if (!user) return alert("请先登录");
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const tags = document.getElementById("tags").value.split(',').map(t => t.trim());
  db.collection("posts").add({
    title, content, tags, author: user.email,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("文章已发布");
    loadPosts();
  });
}

function loadPosts() {
  db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const post = doc.data();
      const postId = doc.id;
      const tags = post.tags ? post.tags.map(tag => `<span>#${tag}</span>`).join(" ") : '';
      postsDiv.innerHTML += `
        <div class="section">
          <h3>${post.title}</h3>
          <p>${marked.parse(post.content)}</p>
          <small>作者：${post.author}</small><br/>
          <div>${tags}</div>
          <div id="comments-${postId}"></div>
          <input type="text" id="comment-${postId}" placeholder="写评论..." />
          <button onclick="submitComment('${postId}')">评论</button>
        </div>`;
      loadComments(postId);
    });
  });
}

function submitComment(postId) {
  const user = auth.currentUser;
  if (!user) return alert("请先登录");
  const content = document.getElementById("comment-" + postId).value;
  db.collection("comments").add({
    postId, user: user.email, content,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    loadComments(postId);
  });
}

function loadComments(postId) {
  const commentsDiv = document.getElementById("comments-" + postId);
  db.collection("comments").where("postId", "==", postId).orderBy("timestamp")
    .onSnapshot(snapshot => {
      let html = "<div><b>评论：</b>";
      snapshot.forEach(doc => {
        const c = doc.data();
        html += `<p><strong>${c.user}：</strong>${c.content}</p>`;
      });
      html += "</div>";
      commentsDiv.innerHTML = html;
    });
}

loadPosts();

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.textContent = "切换主题";
  btn.onclick = () => document.body.classList.toggle("dark");
  document.querySelector(".auth-buttons").appendChild(btn);
});

function likePost(postId) {
  const user = auth.currentUser;
  if (!user) return alert("请先登录");
  db.collection("likes").add({ user: user.email, postId });
}

function favoritePost(postId) {
  const user = auth.currentUser;
  if (!user) return alert("请先登录");
  db.collection("favorites").add({ user: user.email, postId });
}
