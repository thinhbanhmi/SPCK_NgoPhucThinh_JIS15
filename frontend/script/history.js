// Code riêng cho trang history.html.
// Trang này bắt buộc đăng nhập (navbar.js lo việc đá về login.html nếu chưa đăng nhập).

var historyMessage = document.getElementById("history-message");
var historyList = document.getElementById("history-list");

// Đổi createdAt của Firestore thành chữ ngày giờ dễ đọc
function formatDate(timestamp) {
  if (!timestamp) {
    return "";
  }
  return timestamp.toDate().toLocaleString("vi-VN");
}

// Lấy mốc thời gian để sắp xếp. Đơn chưa có ngày thì cho về 0 (xuống cuối).
function getTime(order) {
  if (!order.createdAt) {
    return 0;
  }
  return order.createdAt.toDate().getTime();
}

// Vẽ bảng các sản phẩm bên trong một đơn hàng
function createItemsTable(items) {
  var table = document.createElement("table");
  table.className = "table table-sm align-middle mb-0";

  var thead = document.createElement("thead");
  thead.innerHTML =
    "<tr><th>Ảnh</th><th>Tên</th><th>Giá</th><th>Số lượng</th><th>Thành tiền</th></tr>";

  var tbody = document.createElement("tbody");

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var tr = document.createElement("tr");

    var tdImage = document.createElement("td");
    var img = document.createElement("img");
    img.src = item.imageUrl || NO_IMAGE;
    img.alt = item.name;
    img.className = "img-thumbnail";
    img.style.width = "50px";
    tdImage.appendChild(img);

    var tdName = document.createElement("td");
    tdName.textContent = item.name;

    var tdPrice = document.createElement("td");
    tdPrice.textContent = formatPrice(item.price);

    var tdQuantity = document.createElement("td");
    tdQuantity.textContent = item.quantity;

    var tdSubtotal = document.createElement("td");
    tdSubtotal.textContent = formatPrice(item.price * item.quantity);

    tr.appendChild(tdImage);
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdSubtotal);
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

// Thêm một dòng thông tin kiểu "Điện thoại: 090..."
function addInfoLine(parent, label, value) {
  var p = document.createElement("p");
  p.className = "mb-1";

  var strong = document.createElement("strong");
  strong.textContent = label + ": ";

  p.appendChild(strong);
  p.appendChild(document.createTextNode(value || ""));
  parent.appendChild(p);
}

// Vẽ một đơn hàng thành một card
function createOrderCard(order) {
  var card = document.createElement("div");
  card.className = "card mb-3";

  // Phần đầu: mã đơn, ngày đặt, tổng tiền
  var header = document.createElement("div");
  header.className =
    "card-header d-flex justify-content-between align-items-center flex-wrap gap-2";

  var code = document.createElement("span");
  code.textContent = "Mã đơn: #" + order.id.substring(0, 8);

  var date = document.createElement("span");
  date.className = "text-muted";
  date.textContent = formatDate(order.createdAt);

  var total = document.createElement("span");
  total.className = "text-danger fw-bold";
  total.textContent = formatPrice(order.total);

  header.appendChild(code);
  header.appendChild(date);
  header.appendChild(total);

  // Phần thân: thông tin giao hàng + bảng sản phẩm
  var body = document.createElement("div");
  body.className = "card-body";

  addInfoLine(body, "Điện thoại", order.phone);
  addInfoLine(body, "Địa chỉ", order.address);
  addInfoLine(body, "Thanh toán", order.paymentMethod);

  var wrap = document.createElement("div");
  wrap.className = "table-responsive mt-3";
  wrap.appendChild(createItemsTable(order.items || []));
  body.appendChild(wrap);

  card.appendChild(header);
  card.appendChild(body);
  return card;
}

// Lấy các đơn hàng của người đang đăng nhập
function loadOrders(user) {
  // Chỉ lọc theo userId, KHÔNG dùng orderBy. Firestore bắt buộc phải tạo
  // composite index nếu where và orderBy nằm trên 2 field khác nhau, nên
  // ở đây lấy về rồi tự sắp xếp bằng JavaScript cho đơn giản.
  db.collection("orders")
    .where("userId", "==", user.uid)
    .get()
    .then(function (snapshot) {
      var orders = [];
      snapshot.forEach(function (doc) {
        var order = doc.data();
        order.id = doc.id;
        orders.push(order);
      });

      // Sắp xếp đơn mới nhất lên đầu
      orders.sort(function (a, b) {
        return getTime(b) - getTime(a);
      });

      if (orders.length === 0) {
        historyMessage.innerHTML =
          'Bạn chưa có đơn hàng nào. <a href="./index.html">Mua sắm ngay</a>';
        return;
      }

      historyMessage.classList.add("d-none");
      historyList.innerHTML = "";
      for (var i = 0; i < orders.length; i++) {
        historyList.appendChild(createOrderCard(orders[i]));
      }
    })
    .catch(function (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      historyMessage.textContent = "Không tải được lịch sử mua hàng.";
    });
}

// Phải đợi Firebase xác định xong ai đang đăng nhập rồi mới hỏi Firestore.
// Nếu đọc firebase.auth().currentUser ngay lúc trang vừa tải thì nó còn null.
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    loadOrders(user);
  }
  // Chưa đăng nhập thì navbar.js đã chuyển sang login.html
});
