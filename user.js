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

auth.onAuthStateChanged(user => {
  if (!user) return alert("请先登录");
  loadUserPosts(user.email);
  loadFavorites(user.email);
});

function loadUserPosts(email) {
  db.collection("posts").where("author", "==", email).onSnapshot(snapshot => {
    const div = document.getElementById("my-posts");
    div.innerHTML = "";
    snapshot.forEach(doc => {
      const post = doc.data();
      div.innerHTML += `<div class="section"><h4>${post.title}</h4><p>${post.content}</p></div>`;
    });
  });
}

function loadFavorites(email) {
  db.collection("favorites").where("user", "==", email).onSnapshot(snapshot => {
    const div = document.getElementById("my-favorites");
    div.innerHTML = "";
    snapshot.forEach(doc => {
      const ref = doc.data().postId;
      db.collection("posts").doc(ref).get().then(postDoc => {
        const post = postDoc.data();
        div.innerHTML += `<div class="section"><h4>${post.title}</h4><p>${post.content}</p></div>`;
      });
    });
  });
}