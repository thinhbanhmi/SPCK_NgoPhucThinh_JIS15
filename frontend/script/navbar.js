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

// Kiểm tra xem đang ở trang nào (dùng endsWith để chạy được ở mọi thư mục)
function isPage(fileName) {
  return window.location.pathname.endsWith(fileName);
}

firebase.auth().onAuthStateChanged(function (user) {
  showAuthButtons(user);
  if (!user) {
    // Chưa đăng nhập mà vào trang admin thì đá về trang đăng nhập
    if (
      isPage("admin.html") ||
      isPage("user-profile.html") ||
      isPage("pay.html") ||
      isPage("history.html")
    ) {
      window.location.href = "./login.html";
    }
    return; // Chưa đăng nhập thì dừng ở đây, không chạy tiếp xuống dưới
  }
  if (user.email == "admin@quangthanh.com" && !isPage("admin.html")) {
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
