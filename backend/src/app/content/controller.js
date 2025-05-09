const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const key = process.env.GOOGLE_API_KEY;
const pixaiToken =
    "eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJsZ2EiOjE3NDY4MDQ5OTUsImlhdCI6MTc0NjgwNDk5NSwiZXhwIjoxNzQ3NDA5Nzk1LCJpc3MiOiJwaXhhaSIsInN1YiI6IjE4Nzc2MDM1ODMxNDIzNDk1NzMiLCJqdGkiOiIxODc3NjAzNTg0ODMyNjU0MTA2In0.ADncS_MethJOXVgwhk6uCXu9AzNEn_5xUZg1aB7LhfKa7gyaUj99_mMVDlYjPEtOSuot-NNH2h-kZkOL0GlV39h7AZr3XFgNHQe7ByU3FJEk_nDwQtbJ2fjSMQ9PZMEB1F-QJb94nY-O1yqULw6iSUS1oHP8GbL4NTKCo8MwjASgx_gs";
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
Hãy tạo ra nội dung bài viết phải đạt 20 chữ:  một phân tích(nghị luận) hoặc truyện thật hấp dẫn(bạn hãy đọc và đánh giá chủ đề cho nó ví dụ như chủ đề về nỗi sợ AI thì là 1 bài phân tích có luận điểm, luận cứ rõ ràng, nếu người dùng mong muốn truyện thì hãy viết truyện, nếu người dùng đã viết kịch bản thì bạn hãy hoàn thiện nó giúp người dùng). Ngôn ngữ câu trả lời dựa theo ngôn ngữ của Chủ đề(ví dụ chủ đề được viết theo tiếng anh thì bạn trả về tiếng anh, tiếng viết thì bạn trả về tiếng việt) đầu vào.
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
async function generateImage(
    prompt,
    modelId,
    token,
    i,
    content,
    negativePrompt = "worst quality, low quality, easynegative, blurry, deformed, deformed hands, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, disfigured, extra limbs, missing limbs, floating limbs, disconnected limbs, malformed limbs, ugly, disgusting, bad anatomy, bad proportions, gross proportions, text, error, missing fingers, missing arms, missing legs, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark"
) {
    try {
        // 1. Gửi yêu cầu tạo tác vụ tạo ảnh sử dụng GraphQL với variables
        const query = `
  mutation createGenerationTask($parameters: JSONObject!) {
    createGenerationTask(parameters: $parameters) {
      id
      status
      moderationAction {
        promptsModerationAction
      }
    }
  }
`;

        const variables = {
            parameters: {
                prompts: prompt,
                negativePrompts: negativePrompt,
                width: 512,
                height: 768,
                modelId: modelId,
                cfgScale: 6,
                samplingSteps: 25,
                samplingMethod: "DPM++ 2M Karras",
                seed: "",
                clipSkip: 2,
                controlNets: [],
                extra: {},
                priority: 1000,
                lightning: false,
            },
        };

        const createResponse = await fetch("https://api.pixai.art/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const createData = await createResponse.json();
        console.log(createData);
        const taskId = createData.data?.createGenerationTask?.id;
        if (!taskId) throw new Error("Không tạo được task");

        // 2. Kiểm tra trạng thái liên tục đến khi ảnh được tạo xong
        let mediaUrl = null;
        for (let i = 0; i < 100; i++) {
            await new Promise((res) => setTimeout(res, 6000));
            const statusRes = await fetch(
                `https://api.pixai.art/v1/task/${taskId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const statusData = await statusRes.json();
            console.log(statusData);
            if (statusData.status === "completed" && statusData.outputs) {
                mediaUrl = statusData.outputs.mediaUrls[0];
                break;
            }
        }

        if (!mediaUrl)
            throw new Error("❌ Không thể lấy được ảnh sau 100 lần kiểm tra.");

        return {
            url: mediaUrl,
            index: i,
            prompt: prompt,
            content: content,
        };
    } catch (error) {
        return {
            url: "",
            index: i,
            prompt: prompt,
            content: content,
        };
    }
}
async function generateImagesFromSegments(segments, modelId, token) {
    const tasks = [];
    for (let i = 0; i < segments.length; i++) {
        tasks.push(
            generateImage(
                segments[i].imagePrompt,
                modelId,
                token,
                i,
                segments[i].text
            )
        );
    }
    const res = await Promise.all(tasks);
    console.log("ĐÃ XONG HÌNH ẢNH");
    const images = [];
    for (let i = 0; i < res.length; i++) {
        if (res[i]) {
            images.push(res[i]);
        }
    }
    images.sort((a, b) => a.index - b.index);
    const result = images.map(({ index, ...rest }) => rest);
    console.log("KẾT QUẢ", result);
    return result;
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
        const { content } = req.body;
        try {
            const imagePrompts = await enrichScriptWithImagePrompts(content);
            const result = await generateImagesFromSegments(
                imagePrompts,
                "1648918127446573124",
                pixaiToken
            );
            res.json({
                mes: "success",
                status: 200,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching content data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    getReGenerateImage: async (req, res) => {
        const { prompt, index, content } = req.body;
        try {
            const result = await generateImage(
                prompt,
                "1648918127446573124",
                pixaiToken,
                index,
                content
            );
            res.json({
                mes: "success",
                status: 200,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching content data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = contentController;
