import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username") ? document.getElementById("username").value : "";

    try {
      // Lưu tài khoản vào Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lưu thêm thông tin chi tiết người dùng vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        username: username,
        role: "user", // Hoặc "admin"
        createdAt: new Date().toISOString()
      });

      alert("Đăng ký tài khoản thành công!");
      window.location.href = "login.html"; // Chuyển sang trang đăng nhập
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Đăng ký thất bại: " + error.message);
    }
  });
}