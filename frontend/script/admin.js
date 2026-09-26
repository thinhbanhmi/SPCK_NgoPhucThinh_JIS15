// Địa chỉ backend (server Node.js dùng để upload ảnh lên Cloudinary)
var API_URL = "http://localhost:3000";

// Ảnh xám hiện tạm khi sản phẩm chưa có ảnh
var NO_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23dee2e6'/%3E%3C/svg%3E";


// Lấy các phần tử trên trang
var form = document.getElementById("product-form");
var nameInput = document.getElementById("product-name");
var priceInput = document.getElementById("product-price");
var descriptionInput = document.getElementById("product-description");
var imageInput = document.getElementById("product-image");
var previewImg = document.getElementById("preview-img");
var formTitle = document.getElementById("form-title");
var btnSubmit = document.getElementById("btn-submit");
var btnCancel = document.getElementById("btn-cancel");
var tableBody = document.getElementById("product-table-body");

// editingId = null nghĩa là đang THÊM mới.
// Nếu khác null thì đang SỬA sản phẩm có id đó.
var editingId = null;
// Nhớ lại link ảnh cũ để khi sửa mà không chọn ảnh mới thì vẫn giữ ảnh cũ
var editingImageUrl = "";
// Danh sách sản phẩm đang hiển thị, dùng khi bấm nút "Sửa"
var products = [];

// Đổi 100000 thành "100.000đ" cho dễ đọc
function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}

// Cho người dùng xem trước ảnh vừa chọn
imageInput.addEventListener("change", function () {
  var file = imageInput.files[0];
  if (!file) {
    return;
  }

  var reader = new FileReader();
  reader.addEventListener("load", function () {
    previewImg.src = reader.result;
    previewImg.classList.remove("d-none");
  });
  reader.readAsDataURL(file);
});

// Đổi tiêu đề và chữ trên nút tuỳ theo đang thêm hay đang sửa
function updateFormMode() {
  if (editingId) {
    formTitle.textContent = "Sửa sản phẩm";
    btnSubmit.textContent = "Cập nhật";
    btnCancel.classList.remove("d-none");
  } else {
    formTitle.textContent = "Thêm sản phẩm";
    btnSubmit.textContent = "Thêm sản phẩm";
    btnCancel.classList.add("d-none");
  }
}

// Xoá trắng form và quay về chế độ thêm mới
function resetForm() {
  form.reset();
  editingId = null;
  editingImageUrl = "";
  previewImg.src = "";
  previewImg.classList.add("d-none");
  updateFormMode();
}

btnCancel.addEventListener("click", function () {
  resetForm();
});

// Gửi file ảnh sang backend, backend trả về link ảnh (url)
function uploadImage(file) {
  var formData = new FormData();
  formData.append("image", file);

  return fetch(API_URL + "/upload", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.url) {
        throw new Error(data.message || "Upload ảnh thất bại");
      }
      return data.url;
    });
}

// Vẽ một dòng trong bảng cho một sản phẩm
function createRow(product) {
  var tr = document.createElement("tr");

  var tdImage = document.createElement("td");
  var img = document.createElement("img");
  img.src = product.imageUrl || NO_IMAGE;
  img.alt = product.name;
  img.className = "img-thumbnail";
  img.style.width = "60px";
  tdImage.appendChild(img);

  var tdName = document.createElement("td");
  tdName.textContent = product.name;

  var tdPrice = document.createElement("td");
  tdPrice.className = "text-danger fw-bold";
  tdPrice.textContent = formatPrice(product.price);

  var tdDescription = document.createElement("td");
  tdDescription.textContent = product.description;

  var tdAction = document.createElement("td");

  var btnEdit = document.createElement("button");
  btnEdit.className = "btn btn-sm btn-warning me-1";
  btnEdit.textContent = "Sửa";
  btnEdit.addEventListener("click", function () {
    editProduct(product);
  });

  var btnDelete = document.createElement("button");
  btnDelete.className = "btn btn-sm btn-danger";
  btnDelete.textContent = "Xóa";
  btnDelete.addEventListener("click", function () {
    deleteProduct(product);
  });

  tdAction.appendChild(btnEdit);
  tdAction.appendChild(btnDelete);

  tr.appendChild(tdImage);
  tr.appendChild(tdName);
  tr.appendChild(tdPrice);
  tr.appendChild(tdDescription);
  tr.appendChild(tdAction);

  return tr;
}

// Hiện một dòng thông báo giữa bảng (đang tải / chưa có sản phẩm / lỗi)
function showMessage(message) {
  tableBody.innerHTML = "";

  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.colSpan = 5;
  td.className = "text-center text-muted";
  td.textContent = message;

  tr.appendChild(td);
  tableBody.appendChild(tr);
}

// Lấy toàn bộ sản phẩm từ Firestore rồi đổ ra bảng
function loadProducts() {
  showMessage("Đang tải...");

  db.collection("products")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (snapshot) {
      products = [];
      snapshot.forEach(function (doc) {
        var product = doc.data();
        product.id = doc.id;
        products.push(product);
      });

      if (products.length === 0) {
        showMessage("Chưa có sản phẩm nào.");
        return;
      }

      tableBody.innerHTML = "";
      for (var i = 0; i < products.length; i++) {
        tableBody.appendChild(createRow(products[i]));
      }
    })
    .catch(function (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      showMessage("Không tải được danh sách sản phẩm.");
    });
}

// Bấm "Sửa": điền dữ liệu cũ lên form
function editProduct(product) {
  editingId = product.id;
  editingImageUrl = product.imageUrl || "";

  nameInput.value = product.name;
  priceInput.value = product.price;
  descriptionInput.value = product.description;
  imageInput.value = "";

  if (editingImageUrl) {
    previewImg.src = editingImageUrl;
    previewImg.classList.remove("d-none");
  } else {
    previewImg.classList.add("d-none");
  }

  updateFormMode();
  window.scrollTo(0, 0);
}

// Bấm "Xóa": hỏi lại cho chắc rồi xoá khỏi Firestore
function deleteProduct(product) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm " + product.name + " không?")) {
    return;
  }

  db.collection("products")
    .doc(product.id)
    .delete()
    .then(function () {
      alert("Đã xóa sản phẩm!");
      // Nếu đang sửa đúng sản phẩm vừa xoá thì xoá trắng form
      if (editingId === product.id) {
        resetForm();
      }
      loadProducts();
    })
    .catch(function (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Xóa thất bại: " + error.message);
    });
}

// Bấm "Thêm sản phẩm" hoặc "Cập nhật"
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Ngăn trang tải lại

  var name = nameInput.value.trim();
  var price = priceInput.value;
  var description = descriptionInput.value.trim();
  var file = imageInput.files[0];

  // Khi thêm mới thì bắt buộc phải có ảnh
  if (!editingId && !file) {
    alert("Vui lòng chọn hình ảnh cho sản phẩm!");
    return;
  }

  // Nhớ lại đang thêm hay đang sửa, vì resetForm() sẽ xoá editingId
  var isEditing = editingId !== null;

  btnSubmit.disabled = true;
  btnSubmit.textContent = "Đang lưu...";

  // Có chọn ảnh mới thì upload, không thì dùng lại link ảnh cũ
  var imagePromise;
  if (file) {
    imagePromise = uploadImage(file);
  } else {
    imagePromise = Promise.resolve(editingImageUrl);
  }

  imagePromise
    .then(function (imageUrl) {
      var product = {
        name: name,
        price: Number(price),
        description: description,
        imageUrl: imageUrl,
      };

      if (isEditing) {
        return db.collection("products").doc(editingId).update(product);
      }

      product.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      return db.collection("products").add(product);
    })
    .then(function () {
      alert(isEditing ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
      resetForm();
      loadProducts();
    })
    .catch(function (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert("Lưu thất bại: " + error.message);
    })
    .finally(function () {
      btnSubmit.disabled = false;
      updateFormMode();
    });
});

// Tải danh sách sản phẩm ngay khi mở trang
loadProducts();
