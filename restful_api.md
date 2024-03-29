## REST

### REST là gì?

REST là viết tắt của REpresentational State Transfer, là quy ước một số quy tắc ràng buộc khi thiết kế hệ thống mạng.

REST giúp client tương tác với server mà không cần biết cách hoạt động server như thế nào.

REST có một số ràng buộc:

- Uniform Interface (Giao diện thông nhất)

- Stateless (Không trạng thái)

- Cacheable (Dữ liệu có thể lưu vào bộ nhớ cache)

- Client-Server (Máy khách - Máy chủ)

- Layered System (Hệ thống phân lớp)

- Code on Demand (Code theo yêu cầu)

### API là gì?

API là cơ chế cho phép 2 thành phần phần mềm giao tiếp với nhau bằng một tập hợp các định nghĩa và giao thức.

Ví dụ: hệ thống phần mềm của cơ quan thời tiết chứa dữ liệu về thời tiết hàng ngày. Ứng dụng thời tiết trên điện thoại của bạn sẽ “trò chuyện” với hệ thống này qua API và hiển thị thông tin cập nhật về thời tiết hàng ngày trên điện thoại của bạn.

### RESTful API là gì?

RESTful API là một API chuẩn REST. Chuẩn REST đọc khá là khó hiểu, học thuật vậy nên API của bạn chỉ cần áp dụng những kỹ thuật dưới đây thì có thể coi là chuẩn REST.

### Sử dụng các phương thức HTTP để request có ý nghĩa

- GET: Đọc tài nguyên
- PUT: Cập nhật tài nguyên
- DELETE: Xóa tài nguyên
- POST: Tạo mới tài nguyên

### Sử dụng các HTTP response code để xác định trạng thái API trả về

- 200 OK: Thành công
- 201 CREATED: Tạo thành công (có thể từ method POST hoặc PUT)
- 204 NO CONTENT: Thành công nhưng không có gì trả về trong body cả, thường được dùng cho DELETE hoặc PUT
- 400 BAD REQUEST: Lỗi, có thể nguyên nhân từ validate lỗi, thiếu data,...
- 401 UNAUTHORIZED: Lỗi liên quan đến thiếu hoặc sai authentication token
- 403 FORBIDDEN: Lỗi liên quan đến không có quyền truy cập
- 404 NOT FOUND: Lỗi liên quan tài nguyên không tìm thấy
- 405 METHOD NOT ALLOWED: Lỗi liên quan method không được chấp nhận. Ví dụ API chỉ cho phép sử dụng GET, PUT, DELETE nhưng bạn dùng POST thì sẽ trả về lỗi này.
- 500 INTERNAL SERVER ERROR: Lỗi liên quan đến việc server bị lỗi khi xử lý một tác vụ nào đó (Server không cố ý trả về lỗi này cho bạn)
