import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Ngăn trang reload lại ngay lập tức

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username")?.value || "";

    try {
      // 1. Tạo user trên Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Lưu thông tin vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        role: "user",
        createdAt: new Date().toISOString()
      });

      alert("Đăng ký thành công!");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert("Đăng ký thất bại: " + error.message);
    }
  });
}