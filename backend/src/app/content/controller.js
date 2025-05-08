const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const key = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(key);

async function enrichScriptWithImagePrompts(topic) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const prompt = `
Hãy dựa vào bài viết "${topic}" bạn hãy tạo ra câu trả lời
Tuân thủ yêu cầu sau:
1. Tách bài viết thành đoạn 1 câu, 2 câu hoặc 3 câu có nghĩa và dễ mô tả bằng ảnh kiểu như câu đó có thể dễ dàng miêu tả bằng 1 tấm ảnh
2. Gợi ý prompt hình ảnh phù hợp (nội dung ảnh, cảm xúc, background, tông màu...).
3. Đảm bảo tất cả các ảnh tuân theo 1 bố cục thống nhất (ví dụ: cổ điển, nhân vật giống nhau qua các tấm ảnh, màu nâu vintage, ánh sáng mềm, nền mờ nhẹ,, kiểu tranh vẽ hoặc 3D animation...).
4. Bạn hãy viết trước promt về các nhân vật, các đồ vật, cây cối, động vật để truyền nó vào mọi imagePrompt mà các sự vật có liên quan được nhắc đến. Vì tôi sẽ sử dụng từng imagePrompt riêng biệt để tạo từng ảnh nên tôi cần nhắc lại các hình ảnh của sự vật liên quan ở mọi imagePrompt để tạo ảnh đồng nhất(phần nội dung thì không cần miêu tả kĩ chỉ cần làm như bình thường chỉ phần imagePrompt mới miêu tả thật kĩ). Mỗi lần nhắc tên nhân vật đồ vật, con vật đều mở ngoặc () để ghi chú đặc điểm ví dụ young man(tall, blue eyes, white skin, skinny, handsome, young, ...) tôi muốn bạn miêu tả thật kĩ những đặc điểm của con người như họ mặc áo mặc quần gì(thật cụ thể nhất là màu sắc, kiểu dáng), vóc dáng, tóc, mắt. 

Trả về kết quả dạng JSON array(bắt buộc phải là array JSON không được khác, bắt buộc phải bắt đầu bằng [ và kết thúc bằng ] ) với mỗi phần tử có cấu trúc:
{
  "text": "đây là nội dung của bước tranh được lấy nguyên bản từ phần nội dung tôi gửi cho bạn, bạn TUYỆT ĐỐI không được thay đổi nội dung này",
  "imagePrompt": "prompt để tạo ảnh thật chỉnh chu nếu là câu miêu tả hành động thì nhớ miêu tả thật kĩ, thật chi tiết. Các nhân vật thì phải miêu tả kĩ ngoại hình, ở mọi tấm ảnh đều phải miêu tả lại cho thật kĩ lưỡng chi tiết, nam hay nữ và đồng nhất qua các tấm ảnh. Trong các đoạn văn thì nhắc lại ví dụ(chỉ là ví dụ , không liên quan đến phần nội dung) nhân vật Tom, đàn ông, tuổi trẻ, cao, mắt xanh, da trắng, đô con, vạm vỡ. Bà Hat cao tuổi, tóc đen dài, mắt xanh, thấp người,... Phải miêu tả như vậy"
}

`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        console.log(rawText);

        // Trích xuất JSON từ response
        let match = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        let jsonText = "";
        if (!match) {
            // Nếu không tìm thấy định dạng markdown, thử tìm mảng JSON trực tiếp
            match = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (match) {
                jsonText = match[0];
            } else {
                throw new Error("Không tìm thấy JSON hợp lệ trong phản hồi");
            }
        } else {
            jsonText = match[1].trim();
        }

        // Chuẩn hóa JSON
        try {
            // Thử phân tích trực tiếp
            return JSON.parse(jsonText);
        } catch (initialError) {
            return enrichScriptWithImagePrompts(topic);
        }
    } catch (error) {
        console.error("Lỗi:", error.message);
        return [];
    }
}

async function generateScript(topic) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const prompt = `
Hãy tạo ra nội dung bài viết phải đạt 300 chữ:  một phân tích(nghị luận) hoặc truyện thật hấp dẫn(bạn hãy đọc và đánh giá chủ đề cho nó ví dụ như chủ đề về nỗi sợ AI thì là 1 bài phân tích có luận điểm, luận cứ rõ ràng, nếu người dùng mong muốn truyện thì hãy viết truyện, nếu người dùng đã viết kịch bản thì bạn hãy hoàn thiện nó giúp người dùng). Ngôn ngữ câu trả lời dựa theo ngôn ngữ của Chủ đề(ví dụ chủ đề được viết theo tiếng anh thì bạn trả về tiếng anh, tiếng viết thì bạn trả về tiếng việt) đầu vào.
Lưu ý rằng bạn chỉ cần viết nội dung mà không cần thêm bất kì từ ngữ gì khác(kiểu như "Sau đây là nội dung,..")
Chủ đề: "${topic}"
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        return rawText;
    } catch (error) {
        console.error("Lỗi:", error.message);
    }
}
const contentController = {
    getContentData: async (req, res) => {
        const { topic } = req.body;
        try {
            const contentData = await generateScript(topic);
            res.json({
                mes: "success",
                status: 200,
                data: contentData,
            });
        } catch (error) {
            console.error("Error fetching content data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    getContentDataWithImage: async (req, res) => {
        const { topic } = req.body;
        try {
            const imagePrompts = await enrichScriptWithImagePrompts(topic);
            res.json({
                mes: "success",
                status: 200,
                data: imagePrompts,
            });
        } catch (error) {
            console.error("Error fetching content data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = contentController;
