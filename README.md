# AutoPro – cấu trúc website

```
index.html                  ← TRANG CHỦ DUY NHẤT
trang/                      ← trang chức năng (3)
    bo-suu-tap.html         lọc / sắp xếp / tìm kiếm toàn bộ xe
    dich-vu.html
    lien-he.html
thuong-hieu/                ← mỗi hãng một trang (6)
    lamborghini.html  rolls-royce.html  mclaren.html
    ferrari.html  bugatti.html  apollo.html
xe/                         ← chi tiết từng xe (11)
    <hang>-<ten-xe>.html    vd: lamborghini-revuelto.html
css/style.css
js/main.js
anh/                        ← ảnh, tên dạng <hang>-<ten-xe>.jpg
```

Quy ước đặt tên: chữ thường, không dấu, không khoảng trắng, nối bằng dấu gạch ngang.

**Thêm trang chi tiết cho xe mới:** copy một file trong `xe/`, đổi nội dung, rồi trỏ nút "Chi tiết" của xe đó tới file mới.
Xe chưa có trang chi tiết sẽ có nút "Nhận báo giá" dẫn tới trang liên hệ và tự điền tên xe.
