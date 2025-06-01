import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

// Hàm tải các file mp3 từ mảng urls, trả về mảng tên file mp3 đã tải về
async function downloadMp3Files(urls) {
  const downloadPromises = urls.map((url, i) => {
    const filename = `temp_audio_${i}.mp3`;
    const writer = fs.createWriteStream(filename);

    return axios({
      url,
      method: "GET",
      responseType: "stream",
    }).then(response => {
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on("finish", () => resolve());
        writer.on("error", reject);
      });
    }).then(() => filename);
  });

  return Promise.all(downloadPromises);
}

export async function mergeMp3Files(urls, output = "merged.mp3") {
  const files = await downloadMp3Files(urls);
   
  return new Promise((resolve, reject) => {
    // Tạo file danh sách cho ffmpeg concat
    const listFile = "audio_list.txt";
    const content = files.map((f) => `file '${path.resolve(f)}'`).join("\n");
    fs.writeFileSync(listFile, content);

    ffmpeg()
      .input(listFile)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .outputOptions(["-c", "copy"])
      .output(output)
      .on("end", () => {
        //fs.unlinkSync(listFile);
        // // Xóa các file âm thanh tạm
        // files.forEach((file) => {
        //   if (fs.existsSync(file)) fs.unlinkSync(file);
        // });
        resolve(output);
      })
      .on("error", (err) => {
        fs.unlinkSync(listFile);
        // Xóa các file âm thanh tạm nếu có lỗi
        // files.forEach((file) => {
        //   if (fs.existsSync(file)) fs.unlinkSync(file);
        // });
        reject(err);
      })
      .run();
  });
}
