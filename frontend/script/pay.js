// Code riêng cho trang pay.html.
// Trang này bắt buộc đăng nhập (navbar.js lo việc đá về login.html nếu chưa đăng nhập).

var payEmpty = document.getElementById("pay-empty");
var payContent = document.getElementById("pay-content");
var payItems = document.getElementById("pay-items");
var payTotal = document.getElementById("pay-total");
var payForm = document.getElementById("pay-form");
var phoneInput = document.getElementById("pay-phone");
var addressInput = document.getElementById("pay-address");
var btnOrder = document.getElementById("btn-order");

// Người đang đăng nhập, lấy được sau khi Firebase kiểm tra xong.
// Firebase cần một lúc mới biết ai đang đăng nhập, nên nút "Đặt hàng"
// bị khoá sẵn trong pay.html và chỉ mở ra ở đây. Nếu không khoá, người
// bấm nhanh sẽ bị hiểu nhầm là chưa đăng nhập và bị đá về trang login.
var currentUser = null;

firebase.auth().onAuthStateChanged(function (user) {
  currentUser = user;

  if (user) {
    btnOrder.disabled = false;
    btnOrder.textContent = "Đặt hàng";
  }
  // Nếu chưa đăng nhập thì navbar.js đã lo việc chuyển sang login.html
});

// Hiện danh sách sản phẩm sẽ mua, lấy từ giỏ hàng trong localStorage
function showOrderItems() {
  var items = getCart();

  // Giỏ trống thì không cho thanh toán
  if (items.length === 0) {
    payEmpty.classList.remove("d-none");
    payContent.classList.add("d-none");
    return;
  }

  payEmpty.classList.add("d-none");
  payContent.classList.remove("d-none");

  payItems.innerHTML = "";
  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    var li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    var left = document.createElement("span");
    left.textContent = item.name + " x " + item.quantity;

    var right = document.createElement("span");
    right.textContent = formatPrice(item.price * item.quantity);

    li.appendChild(left);
    li.appendChild(right);
    payItems.appendChild(li);
  }

  payTotal.textContent = formatPrice(cartTotal());
}

// Lấy phương thức thanh toán đang được chọn
function getPaymentMethod() {
  var selected = document.querySelector('input[name="payment"]:checked');
  return selected.value;
}

payForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Ngăn trang tải lại

  if (!currentUser) {
    alert("Bạn cần đăng nhập để đặt hàng!");
    window.location.href = "./login.html";
    return;
  }

  var items = getCart();
  if (items.length === 0) {
    alert("Giỏ hàng đang trống!");
    return;
  }

  var order = {
    userId: currentUser.uid,
    userEmail: currentUser.email,
    phone: phoneInput.value.trim(),
    address: addressInput.value.trim(),
    paymentMethod: getPaymentMethod(),
    items: items,
    total: cartTotal(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  btnOrder.disabled = true;
  btnOrder.textContent = "Đang đặt hàng...";

  db.collection("orders")
    .add(order)
    .then(function () {
      clearCart();
      alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
      window.location.href = "./index.html";
    })
    .catch(function (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đặt hàng thất bại: " + error.message);
      btnOrder.disabled = false;
      btnOrder.textContent = "Đặt hàng";
    });
});

showOrderItems();
