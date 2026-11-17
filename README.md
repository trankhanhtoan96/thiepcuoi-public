# Thiệp cưới online

Trang thiệp cưới tĩnh (HTML/CSS/JS thuần, không cần build) với:

- Link riêng cho từng khách mời: `https://ten-mien-cua-ban/<ID>` hiển thị tên khách.
- Xác nhận tham dự (RSVP) và gửi lời chúc, lưu vào Google Sheets.
- Sổ lưu bút hiển thị lời chúc của mọi người.
- Album ảnh, câu chuyện tình yêu, mã QR mừng cưới, nhạc nền.
- Ba ngôn ngữ: Tiếng Việt, English, 中文 (đổi bằng `?lang=vi|en|zh`).

## Cấu trúc

```
index.html        Nội dung trang
style.css         Giao diện
script.js         Logic, bản dịch, cấu hình API
apps-script.js    Code backend dán vào Google Apps Script
images/           Ảnh (cô dâu, chú rể, album, story, QR)
music/            Nhạc nền
Makefile          Tăng version để phá cache trình duyệt
```

## Cài đặt

### 1. Tạo Google Sheet

Tạo một Google Sheet có hai trang tính:

**Sheet1** — danh sách khách mời. Dòng 1 là tiêu đề, đúng thứ tự cột:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| STT | ID | Tên gọi | Số điện thoại | Ghi chú | Tham dự nhóm họ | Tham dự tiệc cưới | Lời chúc | Số tiền mừng cưới | Thời gian | (trống) | Số người |

Mỗi khách một dòng, cột `ID` là mã dùng trong link (ví dụ `anh-nam`).

**Sheet2** — lời chúc của khách vãng lai, tiêu đề: `Name | Wish | Timestamp`.

Bật chia sẻ **"Bất kỳ ai có đường liên kết đều có thể xem"** để trang đọc được dữ liệu
qua [opensheet](https://github.com/benborgers/opensheet). Lấy Sheet ID trong URL:
`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`.

> ⚠️ Sheet công khai nghĩa là ai có Sheet ID cũng đọc được toàn bộ dữ liệu (kể cả số
> điện thoại, tiền mừng). Không nên lưu thông tin nhạy cảm vào Sheet1, hoặc tắt chia sẻ
> ngay sau khi đám cưới xong.

### 2. Tạo Apps Script (ghi dữ liệu)

1. Trong Google Sheet: **Extensions → Apps Script**.
2. Dán toàn bộ nội dung `apps-script.js`, sửa `SHEET_ID` thành Sheet ID của bạn.
3. **Deploy → New deployment → Web app**, chọn *Execute as: Me*, *Who has access: Anyone*.
4. Copy URL Web App (dạng `https://script.google.com/macros/s/.../exec`).

Mỗi lần sửa code Apps Script phải deploy lại (Manage deployments → New version).

### 3. Cấu hình trang

Sửa `CONFIG` ở đầu `script.js`:

```js
API_URL: 'https://script.google.com/macros/s/.../exec',
SHEET_BASE: 'https://opensheet.elk.sh/<SHEET_ID>',
```

Sau đó thay nội dung cho đám cưới của bạn:

- Tên, ngày giờ, địa điểm, link bản đồ: trong `index.html` và bảng `TRANSLATIONS` trong `script.js`.
- Ảnh trong `images/` (giữ nguyên tên file hoặc sửa đường dẫn trong `index.html`).
- Nhạc nền `music/cuoithoi.mp3`.

### 4. Chạy thử local

```bash
python3 -m http.server 8000
```

Mở `http://localhost:8000`. Link theo ID (`/anh-nam`) cần server trả `index.html`
cho mọi đường dẫn, nên khi test local hãy dùng một server có SPA fallback, ví dụ:

```bash
npx serve -s .
```

### 5. Deploy

Đây là site tĩnh, deploy được lên bất kỳ đâu (Netlify, Vercel, Cloudflare Pages, Nginx,
Caddy...). Điều kiện duy nhất: **mọi đường dẫn không phải file phải trả về `index.html`**
để link khách mời hoạt động.

- Netlify: tạo file `_redirects` với nội dung `/*  /index.html  200`.
- Caddy: `try_files {path} /index.html`.
- Nginx: `try_files $uri /index.html;`.

Trước mỗi lần deploy, chạy `make build` để tăng version (`?v=`) cho ảnh, CSS, JS,
tránh khách thấy bản cũ do cache.

## Gửi thiệp

Gửi cho mỗi khách link `https://ten-mien-cua-ban/<ID>` tương ứng với dòng của họ trong
Sheet1. Link không có ID vẫn xem được thiệp và gửi lời chúc (lưu vào Sheet2).
