const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json({ limit: '10mb' })); 
app.use(cors()); 

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678', 
    database: 'face_recognition'
});

db.connect(err => {
    if (err) {
        console.error('Không thể kết nối MySQL:', err);
        process.exit(1);
    }
    console.log('Đã kết nối MySQL');
});


app.post('/api/upload-image', (req, res) => {
    const { image_base64 } = req.body;

   
    if (!image_base64) {
        return res.status(400).json({ message: 'Thiếu thông tin image_base64' });
    }

    try {
      
        const imageBuffer = Buffer.from(image_base64, 'base64');

       
        const fileName = `${Date.now()}.jpg`;
        const filePath = path.join(uploadDir, fileName);

      
        fs.writeFile(filePath, imageBuffer, (err) => {
            if (err) {
                console.error('Lỗi lưu file ảnh:', err);
                return res.status(500).json({ message: 'Lỗi lưu ảnh trên server' });
            }

           
            const query = `INSERT INTO images (image_path) VALUES (?)`;
            db.query(query, [fileName], (err) => {
                if (err) {
                    console.error('Lỗi lưu vào database:', err);
                    return res.status(500).json({ message: 'Lỗi lưu dữ liệu vào database' });
                }
                res.status(200).json({
                    message: 'Tải lên thành công!',
                    filePath: `/uploads/${fileName}` 
                });
            });
        });
    } catch (error) {
        console.error('Lỗi xử lý ảnh:', error);
        res.status(500).json({ message: 'Lỗi xử lý ảnh' });
    }
});

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
