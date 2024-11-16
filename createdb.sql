CREATE DATABASE face_recognition;

USE face_recognition;

CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255), -- Lưu đường dẫn ảnh
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);