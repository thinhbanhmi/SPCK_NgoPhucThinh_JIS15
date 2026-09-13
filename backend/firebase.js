import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Cấu hình Firebase lấy từ Console
const firebaseConfig = {
  apiKey: "AIzaSyDSf54v-Y8bmCkBBher3FcJuFICt8xH8vw",
  authDomain: "quan-ao-a181b.firebaseapp.com",
  projectId: "quan-ao-a181b",
  storageBucket: "quan-ao-a181b.firebasestorage.app",
  messagingSenderId: "37816212306",
  appId: "1:37816212306:web:566265addb39130b05388b",
  measurementID: "G-E1L8PKM4Z9",
};

// Khởi tạo ứng dụng
const app = initializeApp(firebaseConfig);

// Xuất các dịch vụ cần dùng
export const auth = getAuth(app);
export const db = getFirestore(app);