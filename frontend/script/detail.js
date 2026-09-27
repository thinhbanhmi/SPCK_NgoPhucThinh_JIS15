// Lấy các phần tử trên trang
var message = document.getElementById("detail-message");
var content = document.getElementById("detail-content");
var detailImage = document.getElementById("detail-image");
var detailName = document.getElementById("detail-name");
var detailPrice = document.getElementById("detail-price");
var detailDescription = document.getElementById("detail-description");
var quantityInput = document.getElementById("detail-quantity");
var btnAddCart = document.getElementById("btn-add-cart");
var btnBuyNow = document.getElementById("btn-buy-now");

// Sản phẩm đang xem, lấy được từ Firestore
var currentProduct = null;

// Lấy id sản phẩm trên thanh địa chỉ, ví dụ detail.html?id=abc123
function getProductId() {
  var params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Lấy số lượng người dùng nhập, ít nhất là 1
function getQuantity() {
  var quantity = Number(quantityInput.value);
  if (!quantity || quantity < 1) {
    quantity = 1;
  }
  return quantity;
}

// Đổ thông tin sản phẩm ra trang
function showProduct(product) {
  detailImage.src = product.imageUrl || NO_IMAGE;
  detailImage.alt = product.name;
  detailName.textContent = product.name;
  detailPrice.textContent = formatPrice(product.price);
  detailDescription.textContent = product.description;

  document.title = product.name;

  message.classList.add("d-none");
  content.classList.remove("d-none");
}

// Tải sản phẩm theo id
function loadProduct() {
  var id = getProductId();

  if (!id) {
    message.textContent = "Không tìm thấy sản phẩm.";
    return;
  }

  db.collection("products")
    .doc(id)
    .get()
    .then(function (doc) {
      if (!doc.exists) {
        message.textContent = "Không tìm thấy sản phẩm.";
        return;
      }

      currentProduct = doc.data();
      currentProduct.id = doc.id;
      showProduct(currentProduct);
    })
    .catch(function (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      message.textContent = "Không tải được sản phẩm.";
    });
}

btnAddCart.addEventListener("click", function () {
  if (!currentProduct) {
    return;
  }

  addToCart(currentProduct, getQuantity());
  alert("Đã thêm vào giỏ hàng!");
});

btnBuyNow.addEventListener("click", function () {
  if (!currentProduct) {
    return;
  }

  addToCart(currentProduct, getQuantity());
  window.location.href = "./cart.html";
});

loadProduct();
