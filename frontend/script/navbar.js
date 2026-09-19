var logout = document.getElementById("logout");
var groupLogin = document.getElementById("group-login");
var groupUser = document.getElementById("group-user");

logout.addEventListener("click", function () {
  firebase
    .auth()
    .signOut()
    .then(function () {
      alert("Đăng xuất thành công!");
    })
    .catch(function (error) {
      console.error("Error signing out:", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại!");
    });
});

firebase.auth().onAuthStateChanged(function (user) {
  showAuthButtons(user);
  if (!user) {
    if (
      window.location.pathname === "/FrontEnd/admin.html" ||
      window.location.pathname === "/FrontEnd/user-profile.html"
    )
      window.location.href = "./login.html";
    else return;
  }
  if (
    user.email == "admin@quangthanh.com" &&
    window.location.pathname !== "/FrontEnd/admin.html"
  ) {
    window.location.href = "./admin.html";
  }
});

function showAuthButtons(user) {
  if (user) {
    groupLogin.style.display = "none";
    groupUser.style.display = "inline-block";
    document.getElementById("user-name").textContent = user.email;
  } else {
    groupUser.style.display = "none";
    groupLogin.style.display = "inline-block";
  }
}
