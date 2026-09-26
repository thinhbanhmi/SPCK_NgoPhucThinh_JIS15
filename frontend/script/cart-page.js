// Code riêng cho trang cart.html.
// Các hàm getCart, changeQuantity, removeFromCart... nằm trong script/cart.js

var cartEmpty = document.getElementById("cart-empty");
var cartContent = document.getElementById("cart-content");
var cartTableBody = document.getElementById("cart-table-body");
var cartTotalText = document.getElementById("cart-total");

// Vẽ một dòng trong bảng giỏ hàng
function createCartRow(item) {
  var tr = document.createElement("tr");

  var tdImage = document.createElement("td");
  var img = document.createElement("img");
  img.src = item.imageUrl || NO_IMAGE;
  img.alt = item.name;
  img.className = "img-thumbnail";
  img.style.width = "60px";
  tdImage.appendChild(img);

  var tdName = document.createElement("td");
  tdName.textContent = item.name;

  var tdPrice = document.createElement("td");
  tdPrice.textContent = formatPrice(item.price);

  // Ô nhập số lượng, đổi số là tính lại tiền ngay
  var tdQuantity = document.createElement("td");
  var quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.className = "form-control form-control-sm";
  quantityInput.min = "1";
  quantityInput.value = item.quantity;
  quantityInput.addEventListener("change", function () {
    changeQuantity(item.id, Number(quantityInput.value));
    showCart();
  });
  tdQuantity.appendChild(quantityInput);

  var tdSubtotal = document.createElement("td");
  tdSubtotal.className = "text-danger fw-bold";
  tdSubtotal.textContent = formatPrice(item.price * item.quantity);

  var tdAction = document.createElement("td");
  var btnRemove = document.createElement("button");
  btnRemove.className = "btn btn-sm btn-danger";
  btnRemove.textContent = "Xóa";
  btnRemove.addEventListener("click", function () {
    if (confirm("Xóa " + item.name + " khỏi giỏ hàng?")) {
      removeFromCart(item.id);
      showCart();
    }
  });
  tdAction.appendChild(btnRemove);

  tr.appendChild(tdImage);
  tr.appendChild(tdName);
  tr.appendChild(tdPrice);
  tr.appendChild(tdQuantity);
  tr.appendChild(tdSubtotal);
  tr.appendChild(tdAction);

  return tr;
}

// Vẽ lại toàn bộ giỏ hàng
function showCart() {
  var items = getCart();

  // Giỏ trống thì chỉ hiện lời nhắn, giấu bảng và nút thanh toán
  if (items.length === 0) {
    cartEmpty.classList.remove("d-none");
    cartContent.classList.add("d-none");
    return;
  }

  cartEmpty.classList.add("d-none");
  cartContent.classList.remove("d-none");

  cartTableBody.innerHTML = "";
  for (var i = 0; i < items.length; i++) {
    cartTableBody.appendChild(createCartRow(items[i]));
  }

  cartTotalText.textContent = formatPrice(cartTotal());
}

showCart();
