const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const result = document.getElementById('result');

function encodeImageFileAsURL(element) {
    const file = element.files[0];
    if (!file) {
        alert('Vui lòng chọn một file ảnh');
        return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
        alert('File quá lớn, vui lòng chọn file nhỏ hơn 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const base64Image = reader.result.split(',')[1];
        uploadImage(base64Image);
    };
    reader.readAsDataURL(file);
}
//Thay localhost bằng địa chỉ IP máy nhận
function uploadImage(base64Image) {
    fetch('http://localhost:3000/api/upload-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_base64: base64Image })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                result.textContent = data.message;
            }
            if (data.filePath) {
                console.log('File đã lưu tại:', data.filePath);
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu:', error);
            result.textContent = 'Đã có lỗi xảy ra!';
        });
}

fileInput.addEventListener('change', function () {
    encodeImageFileAsURL(this);
});

uploadButton.addEventListener('click', function () {
    if (fileInput.files.length === 0) {
        alert('Vui lòng chọn một file ảnh trước!');
    } else {
        encodeImageFileAsURL(fileInput);
    }
});
