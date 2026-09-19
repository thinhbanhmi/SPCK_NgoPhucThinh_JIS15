document.addEventListener("DOMContentLoaded", () => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    window.location.href = "home.html";
  }

  const btnSignUp = document.getElementById("btn-register");
  btnSignUp.addEventListener("click", async (e) => {
    e.preventDefault(); //Ngăn cho form submit lại trang
    let isValid = true;

    //Lấy dữ liệu từ form
    const fullName = document.getElementById("txt-fullname");
    const email = document.getElementById("txt-email");
    const password = document.getElementById("txt-password");
    const confirmPassword = document.getElementById("txt-confirm-password");


    if (password.value.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match.");
      return;
    }

    //Kiểm tra email đã tồn tại chưa
    console.log("Checking if email exists:", email.value);

    const methods = await firebase
      .auth()
      .fetchSignInMethodsForEmail(email.value.trim())
      .catch((error) => {
        console.error(error);
        alert("Error checking email. Please try again.");
        return [];
      });

    if (methods.length > 0) {
      alert("Email is already in use.");
      return; // dừng luôn hàm hiện tại
    }

    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email.value.trim(), password.value)
      .catch((error) => {
        console.error(error);
        // alert("Error signing up. Please try again.");
        return null;
      });

    if (userCredential) {
      var user = userCredential.user;
      db.collection("users").add({
        uid: user.uid,
        email: email.value.trim(),
        fullname: fullName.value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        console.log("Done!")
      })
      window.location.href = "index.html";
    } else {
      alert("Sign up failed. Please try again.");
      return;
    }
  });
});
