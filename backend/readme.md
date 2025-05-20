
# 📦 API Gửi Danh Sách Ảnh và Script

API này cho phép frontend gửi danh sách các URL ảnh và các đoạn script tương ứng để xử lý văn bản thành giọng nói, với tuỳ chọn điều chỉnh tốc độ, cao độ và số dòng hiển thị.

---

## 📤 POST `"http://localhost:4000/user/api_video"`

### 🔧 Headers

http
Content-Type: application/json

🧾 Mô tả các trường

Trường	Kiểu dữ liệu	Bắt buộc	Mô tả

images	Array<string>	❌	Danh sách URL ảnh. Mặc định là [].
scripts	Array<string>	❌	Danh sách câu sẽ được đọc. Mặc định: ["xin chào tôi là Minh", "á đù vip quá bro"].
voice	string	❌	Giọng đọc sử dụng. Mặc định: "vi-VN-HoaiMyNeural (vi-VN, Female)".
rate	number	❌	Tốc độ đọc. Mặc định: 0.
pitch	number	❌	Cao độ giọng. Mặc định: 0.
num_lines	number	❌	Số dòng script hiển thị cùng lúc. Mặc định: 1.

# 📦 API TTS

API này cho phép frontend gửi text để ren ra mp3 voice nghe thử

---

## 📤 POST `"http://localhost:4000/user/api_voice"`

---
Thông số đầu vào:
text, (string)
voice,(string) - Mặc định: "vi-VN-HoaiMyNeural (vi-VN, Female)".
rate,(float)
pitch,(float)
num_lines,(1)