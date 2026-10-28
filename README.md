# Học đường — 200 câu trắc nghiệm Nhập môn CNTT

Web tĩnh HTML/CSS/JavaScript, lấy cảm hứng từ sách giáo dục thế kỷ XVIII.

## Mở và sử dụng

1. Giải nén toàn bộ thư mục.
2. Mở `index.html` bằng trình duyệt hiện đại (Chrome, Edge, Firefox hoặc Safari).
3. Chọn đáp án rồi nhấn **Xác nhận đáp án** ở mỗi câu. Chỉ khi xác nhận web mới chấm điểm.
4. Khi sai, xem lý do lựa chọn đó sai, đáp án đúng và giải thích. Nút đối chiếu mở đúng trang PDF.
5. Dùng **Câu tiếp**, **Câu trước**, các chương hoặc **Sổ câu hỏi** để điều hướng.
6. **Làm lại** xóa toàn bộ lựa chọn, kết quả và tiến độ đã lưu trên trình duyệt này, sau bước xác nhận.

Web chạy không cần máy chủ, npm, framework, tài khoản hay kết nối Internet. Nếu trình duyệt chặn lưu trữ cục bộ khi mở file trực tiếp, bài vẫn dùng được trong lần mở hiện tại và sẽ thông báo không lưu được tiến độ. Có thể dùng một máy chủ tĩnh nếu cần địa chỉ web.

## Chức năng

- Đúng 200 câu riêng biệt, mỗi câu có 4 lựa chọn và 1 đáp án đúng.
- Giải thích cho cả ba lựa chọn sai và đáp án đúng; chấm riêng từng câu.
- Sau xác nhận, câu được khóa cho đến khi làm lại toàn bộ.
- 12 chương, mục lục 200 câu và lọc câu sai, câu đúng, câu chưa xác nhận.
- Thống kê, lưu tiến độ bằng localStorage, tương thích màn hình hẹp.
- Có PDF gốc để đối chiếu theo số trang (tính từ trang đầu PDF).

## Các tệp

- `index.html`: cấu trúc giao diện.
- `styles.css`: giao diện giấy ngà, mực nâu, chữ serif và bộ font Noto hỗ trợ đầy đủ tiếng Việt.
- `app.js`: chấm điểm, điều hướng, lọc, lưu tiến độ và làm lại.
- `questions.js`: toàn bộ 200 câu, lựa chọn, đáp án, lời giải và trang tham khảo.
- `fonts/`: Noto Serif và Noto Sans dạng WOFF, kèm giấy phép; dùng cả khi offline.
- `tai-lieu.pdf`: tài liệu `on_tap.pdf` đã cung cấp, giữ nguyên nội dung.

## Nội dung và chỉnh sửa

Câu hỏi được biên soạn từ tài liệu, không phải bộ đề thi chính thức. Một số mô tả giản lược trong PDF được diễn đạt chính xác hơn: phân biệt GB/GiB, quyền truy cập, tính an toàn của .gitignore, giới hạn của AI, giới hạn mỗi file FAT32 và rủi ro lưu các phân vùng trên cùng ổ đĩa.

Trong `questions.js`, mỗi câu có `id`, `chapter`, `page`, `question`, `options`, `answer`, `explanation`. `answer` là chỉ số từ 0 đến 3. Mỗi lựa chọn có `text` và `reason`. Nếu thay nội dung hoặc thứ tự ngân hàng câu hỏi, tăng `version` để tránh dùng lại tiến độ của bộ câu cũ.

Công thức Excel trong câu hỏi dùng dấu phẩy phân cách tham số; cài đặt vùng của một số máy dùng dấu chấm phẩy.

Mã nguồn và đáp án nằm ở phía trình duyệt theo yêu cầu web tĩnh. Phù hợp tự ôn tập; không có chức năng giám sát hay chống xem đáp án.

## Giao diện điện thoại

Câu hỏi được ưu tiên ở đầu trang, chọn chương bằng danh sách thu gọn, chữ và vùng chạm được tăng kích thước. Khối giới thiệu đã được bỏ. Font đi kèm có đủ dấu tiếng Việt ở cả kiểu thường, đậm và nghiêng.
