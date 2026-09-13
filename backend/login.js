import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Đăng nhập thành công!");
    window.location.href = "admin.html";
  } catch (error) {
    alert("Lỗi đăng nhập: " + error.message);
  }
});