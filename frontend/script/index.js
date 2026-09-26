// Nơi để đổ các card sản phẩm vào.
// Các hàm formatPrice, NO_IMAGE nằm trong script/cart.js
var productList = document.getElementById("product-list");

// Tạo một card sản phẩm
function createCard(product) {
  var col = document.createElement("div");
  col.className = "col-6 col-md-3";

  var card = document.createElement("div");
  card.className = "card h-100";

  // Bấm vào ảnh là sang trang chi tiết
  var imageLink = document.createElement("a");
  imageLink.href = "./detail.html?id=" + product.id;

  var img = document.createElement("img");
  img.src = product.imageUrl || NO_IMAGE;
  img.alt = product.name;
  img.className = "card-img-top";
  img.style.height = "200px";
  img.style.objectFit = "cover";
  imageLink.appendChild(img);

  var body = document.createElement("div");
  body.className = "card-body p-2 text-center";

  var title = document.createElement("h6");
  title.textContent = product.name;

  var price = document.createElement("p");
  price.className = "text-danger fw-bold mb-2";
  price.textContent = formatPrice(product.price);

  var button = document.createElement("a");
  button.className = "btn btn-sm btn-primary w-100";
  button.href = "./detail.html?id=" + product.id;
  button.textContent = "Xem chi tiết";

  body.appendChild(title);
  body.appendChild(price);
  body.appendChild(button);

  card.appendChild(imageLink);
  card.appendChild(body);
  col.appendChild(card);

  return col;
}

// Lấy sản phẩm từ Firestore rồi hiển thị ra trang
function loadProducts() {
  db.collection("products")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (snapshot) {
      productList.innerHTML = "";

      if (snapshot.empty) {
        productList.innerHTML =
          '<p class="text-muted">Chưa có sản phẩm nào.</p>';
        return;
      }

      snapshot.forEach(function (doc) {
        var product = doc.data();
        product.id = doc.id; // Cần id để tạo link sang trang chi tiết
        productList.appendChild(createCard(product));
      });
    })
    .catch(function (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      productList.innerHTML =
        '<p class="text-danger">Không tải được danh sách sản phẩm.</p>';
    });
}

loadProducts();
