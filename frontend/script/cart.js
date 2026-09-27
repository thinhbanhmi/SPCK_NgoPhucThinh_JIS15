// File dùng chung cho các trang index / detail / cart / pay.
// Giỏ hàng được lưu trong localStorage, KHÔNG lưu lên Firestore.

// Tên "ngăn" trong localStorage để lưu giỏ hàng
var CART_KEY = "cart";

// Ảnh xám hiện tạm khi sản phẩm chưa có ảnh
var NO_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23dee2e6'/%3E%3C/svg%3E";

// Đổi 100000 thành "100.000đ" cho dễ đọc
function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}

// Lấy giỏ hàng ra (luôn trả về một mảng)
function getCart() {
  var data = localStorage.getItem(CART_KEY);
  if (!data) {
    return [];
  }

  try {
    var items = JSON.parse(data);
    // Phòng trường hợp dữ liệu cũ bị hỏng, không phải mảng
    if (!Array.isArray(items)) {
      return [];
    }
    return items;
  } catch (error) {
    console.error("Giỏ hàng trong localStorage bị lỗi, tạo lại giỏ mới:", error);
    return [];
  }
}

// Lưu giỏ hàng xuống localStorage
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
}

// Tìm vị trí của một sản phẩm trong giỏ, không có thì trả về -1
function findIndexById(items, id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return i;
    }
  }
  return -1;
}

// Thêm sản phẩm vào giỏ. Nếu đã có rồi thì cộng dồn số lượng.
function addToCart(product, quantity) {
  var items = getCart();
  var index = findIndexById(items, product.id);

  if (index >= 0) {
    items[index].quantity = items[index].quantity + quantity;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl || "",
      quantity: quantity,
    });
  }

  saveCart(items);
}

// Đổi số lượng của một sản phẩm trong giỏ
function changeQuantity(id, quantity) {
  if (quantity < 1) {
    quantity = 1;
  }

  var items = getCart();
  var index = findIndexById(items, id);

  if (index >= 0) {
    items[index].quantity = quantity;
    saveCart(items);
  }
}

// Xoá một sản phẩm khỏi giỏ
function removeFromCart(id) {
  var items = getCart();
  var index = findIndexById(items, id);

  if (index >= 0) {
    items.splice(index, 1);
    saveCart(items);
  }
}

// Xoá sạch giỏ hàng (dùng sau khi đặt hàng thành công)
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

// Tổng số món trong giỏ (cộng cả số lượng)
function cartCount() {
  var items = getCart();
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].quantity;
  }
  return total;
}

// Tổng tiền của cả giỏ
function cartTotal() {
  var items = getCart();
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}

// Cập nhật con số nhỏ màu đỏ trên nút "Giỏ hàng" ở thanh menu
function updateCartBadge() {
  var badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = cartCount();
  }
}

// Hiện số lượng ngay khi mở trang
updateCartBadge();
