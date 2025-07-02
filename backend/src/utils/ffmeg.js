import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import sizeOf from 'image-size';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import rimraf from 'rimraf';
import dotenv from 'dotenv';

dotenv.config();

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const isRender = process.env.ENV === 'render';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../app/edit/outputs');
await fs.ensureDir(outputDir);

// Hàm bọc văn bản
function wrapText(text, maxWidth = 960, fontSize = 20) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).length * (fontSize / 2) <= maxWidth) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) lines.push(currentLine);
    return lines.join('\n').replace(/:/g, '\\:').replace(/'/g, "\\'");
}

// Hàm tính chiều cao văn bản
function calculateTextHeight(text, fontSize = 20, lineSpacing = 10) {
    const lines = text.split('\n').length;
    return lines * fontSize + (lines - 1) * lineSpacing;
}

// Hàm tạo video segment từ ảnh
async function createVideoSegment({ imagePath, duration, script, width, height, outputPath, fps = 120 }) {
    const text = script ? wrapText(script, width + 460, 20) : '';
    const textHeight = text ? calculateTextHeight(text, 20, 10) : 0;
    const yPosition = text ? height - textHeight - 30 : 0;
    const dFrames = Math.ceil(duration * (isRender ? 30 : fps));
    const sValue = `${width}x${height}`;

    return new Promise((resolve, reject) => {
        const command = ffmpeg()
            .input(imagePath)
            .loop(duration)
            .videoCodec('libx264')
            .outputOptions([
                '-vf',
                script
                    ? `scale=2400:-1,zoompan=z='min(zoom+0.0002,1.5)':x='floor(iw/2-(iw/zoom/2))':y='floor(ih/2-(ih/zoom/2))':d=${dFrames}:s=${sValue}:fps=${isRender ? 30 : fps},` +
                    `drawtext=text='${text}':fontsize=20:fontcolor=white:x=(w-text_w)/2:y=${yPosition}:` +
                    `fontfile='${path.join(__dirname, 'fonts', 'Roboto-VariableFont_wdth_wght.ttf').replace(/\\/g, '/')}':` +
                    `box=1:boxcolor=black@0.5:boxborderw=10:line_spacing=10`
                    : `scale=2400:-1,zoompan=z='min(zoom+0.0002,1.5)':x='floor(iw/2-(iw/zoom/2))':y='floor(ih/2-(ih/zoom/2))':d=${dFrames}:s=${sValue}:fps=${isRender ? 30 : fps}`,
                `-t ${duration}`,
                '-pix_fmt yuv420p',
                '-crf 24',
                '-an',
            ])
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject);
        command.run();
    });
}

// Hàm nối các video segments
async function concatVideoSegments(videoPaths, outputPath = path.join(outputDir, `temp_video_${Date.now()}.mp4`)) {
    const listFile = path.join(outputDir, 'video_list.txt');
    await fs.writeFile(listFile, videoPaths.map(file => `file '${path.resolve(file)}'`).join('\n'));

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(listFile)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .outputOptions(['-c:v', 'libx264', '-an'])
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .run();
    });
}

// Hàm ghép video với âm thanh
async function mergeWithAudio(videoPath, audioPath, outputPath = path.join(outputDir, `final_output_${Date.now()}.mp4`)) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions([
                '-c:v', 'libx264',
                '-preset', 'veryfast',
                '-crf', '24',
                '-c:a', 'aac',
                '-b:a', '128k',
                '-shortest',
            ])
            .save(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .run();
    });
}

// API 1: Tạo video từ ảnh, phụ đề, durations, và âm thanh
async function createVideoFromImages({ images, scripts = [], durations, audioPath, outputPath }) {
    const tempDir = path.join(outputDir, `temp_${Date.now()}`);
    await fs.ensureDir(tempDir);

    try {
        if (images.length !== durations.length || (scripts.length && scripts.length !== images.length)) {
            throw new Error('Số lượng ảnh, durations, và scripts phải bằng nhau');
        }

        const { width, height } = sizeOf(await fs.readFile(images[0]));

        const videoPaths = [];
        if (isRender) {
            for (let i = 0; i < images.length; i++) {
                const output = path.join(tempDir, `clip_${i}.mp4`);
                await createVideoSegment({
                    imagePath: images[i],
                    duration: durations[i],
                    script: scripts[i] || '',
                    width,
                    height,
                    outputPath: output,
                });
                videoPaths.push(output);
            }
        } else {
            const promises = images.map((image, i) =>
                createVideoSegment({
                    imagePath: image,
                    duration: durations[i],
                    script: scripts[i] || '',
                    width,
                    height,
                    outputPath: path.join(tempDir, `clip_${i}.mp4`),
                })
            );
            videoPaths.push(...await Promise.all(promises));
        }

        const mergedVideo = await concatVideoSegments(videoPaths);
        const finalOutput = await mergeWithAudio(mergedVideo, audioPath, outputPath);

        rimraf.sync(tempDir);
        await fs.unlink(mergedVideo);
        await fs.unlink(path.join(outputDir, 'video_list.txt'));

        return finalOutput;
    } catch (err) {
        rimraf.sync(tempDir);
        throw new Error(`Lỗi tạo video: ${err.message}`);
    }
}

// Hàm overlayVideo (đã sửa để sử dụng whole_dur)
async function overlayVideo({ videoPath, scripts = [], stickers = [], audioConfigs = [] }) {
    const tempDir = path.join(outputDir, `temp_${Date.now()}`);
    await fs.ensureDir(tempDir);
    const outputPath = path.join(outputDir, `output_with_subtitles_${Date.now()}.mp4`);

    try {
        if (stickers.length !== stickers.filter(s => s.file_path).length || audioConfigs.length !== audioConfigs.filter(a => a.file_path).length) {
            throw new Error('Tất cả nhãn dán và âm thanh phải có file_path');
        }

        const { streams, format } = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, data) => (err ? reject(err) : resolve(data)));
        });
        const videoStream = streams.find(s => s.codec_type === 'video');
        const width = videoStream.width;
        console.log(`Video width: ${width}, height: ${videoStream.height}, duration: ${format.duration}`);
        const height = videoStream.height;
        const videoDuration = parseFloat(format.duration);

        let filterComplex = [];
        let inputs = [videoPath];
        let audioFilters = [];
        let audioInputs = [];
        let currentVideoStream = '[0:v]';

        const fontRegular = path.join(__dirname, '../app/edit/fonts', 'Roboto-VariableFont_wdth,wght.ttf').replace(/\\/g, '/');
        for (let i = 0; i < scripts.length; i++) {
            const { text, start = 0, end = 1, style = {} } = scripts[i];
            console.log(`Style for subtitle ${i}:`, style);
            const {
                position = 'bottom',
                fontSize = 20,
                fontColor = 'white',
                backgroundColor = 'black@0.5',
                fontStyle = [],
                alignment = 'center',
                width: textWidth = width,
                shadow = {},
                outline = {},
            } = style;

            const fontPath = (
                fontStyle.includes('bold') && fontStyle.includes('italic') ? path.join(__dirname, '../app/edit/fonts', 'Roboto_Condensed-BoldItalic.ttf') :
                fontStyle.includes('bold') ? path.join(__dirname, '../app/edit/fonts', 'Roboto_Condensed-Bold.ttf') : fontRegular
            ).replace(/\\/g, '/');

            if (!fs.existsSync(fontPath)) {
                console.error(`Font file not found: ${fontPath}`);
                throw new Error(`Font file not found: ${fontPath}`);
            }

            console.log(`Processing subtitle ${i}: ${JSON.stringify(scripts[i])}`);
            const wrappedText = wrapText(text, textWidth - 100, fontSize).replace(/'/g, "\\'").replace(/:/g, "\\:").replace(/,/g, "\\,").replace(/=/g, "\\=").replace(/%/g, "\\%");
            const y = position === 'top' ? '30' : position === 'middle' ? '(h-text_h)/2' : 'h-text_h-30';
            const x = alignment === 'center' ? '(w-text_w)/2' : alignment === 'left' ? '10' : 'w-text_w-10';

            // Cấu hình shadow
            const shadowColor = shadow.color || '#000000';
            const shadowX = shadow.offsetX !== undefined ? Math.max(shadow.offsetX, 1) : 2;
            const shadowY = shadow.offsetY !== undefined ? Math.max(shadow.offsetY, 1) : 2;

            // Cấu hình outline
            const outlineColor = outline.color || '#FFFF00';
            const outlineWidth = outline.width !== undefined ? Math.max(outline.width, 2) : 2;

            // Xử lý fontColor
            const cleanFontColor = fontColor.split('@')[0];

            filterComplex.push(
                `${currentVideoStream}drawtext=text='${wrappedText}':fontsize=${fontSize}:fontcolor=${cleanFontColor}:` +
                `fontfile='${fontPath}':box=1:boxcolor=${backgroundColor}:boxborderw=10:line_spacing=10:` +
                `x=${x}:y=${y}:enable='between(t,${start},${end})':` +
                `shadowcolor=${shadowColor}:shadowx=${shadowX}:shadowy=${shadowY}:` +
                `borderw=${outlineWidth}:bordercolor=${outlineColor}[v${i}]`
            );
            console.log(`Drawtext filter for subtitle ${i}:`, filterComplex[filterComplex.length - 1]);
            currentVideoStream = `[v${i}]`;
        }

        for (let i = 0; i < stickers.length; i++) {
            const { file_path, start = 0, end = 1, width: sWidth = 100, height: sHeight = 100, position = {}, rotate = 0 } = stickers[i];
            console.log(`Processing sticker ${i}: ${file_path}, start=${start}, end=${end}`);
            inputs.push(file_path);
            const inputIdx = inputs.length - 1;
            const scaleFilter = `scale=${sWidth}:${sHeight}` + (rotate ? `,rotate=${rotate}*PI/180` : '');
            filterComplex.push(
                `[${inputIdx}:v]${scaleFilter}[sticker_${i}];${currentVideoStream}[sticker_${i}]overlay=${position.x || 0}:${position.y || 0}:enable='between(t,${start},${end})'[v_s${i}]`
            );
            currentVideoStream = `[v_s${i}]`;
        }

        const hasVideoAudio = streams.some(s => s.codec_type === 'audio');
        for (let i = 0; i < audioConfigs.length; i++) {
            const { file_path, start = 0, end = start + 1, volume = 1.0 } = audioConfigs[i];
            console.log(`Processing audio ${i}: ${file_path}, start=${start}, end=${end}, volume=${volume}`);
            const audioProbe = await new Promise((resolve, reject) => {
                ffmpeg.ffprobe(file_path, (err, data) => (err ? reject(err) : resolve(data)));
            });
            const audioDuration = parseFloat(audioProbe.format.duration);
            console.log(`Audio ${i} duration: ${audioDuration}`);

            if (start < 0 || end <= start || end - start > audioDuration) {
                throw new Error(`Cấu hình âm thanh ${i + 1} không hợp lệ: start=${start}, end=${end}, duration=${audioDuration}`);
            }

            inputs.push(file_path);
            const audioInputIdx = inputs.length - 1;
            audioFilters.push(
                `[${audioInputIdx}:a]atrim=0:${end - start},adelay=${Math.round(start * 1000)}|${Math.round(start * 1000)},volume=${volume}[audio_${i}]`
            );
            audioInputs.push(`[audio_${i}]`);
        }

        if (audioInputs.length) {
            if (hasVideoAudio) {
                audioFilters.push('[0:a]volume=1.0[original_audio]');
                audioInputs.push('[original_audio]');
            }
            audioFilters.push(`${audioInputs.join('')}amix=inputs=${audioInputs.length}[audio]`);
        } else if (hasVideoAudio) {
            audioFilters.push('[0:a]anull[audio]');
        } else {
            audioFilters.push(`anullsrc=channel_layout=stereo:sample_rate=44100:duration=${videoDuration}[audio]`);
        }

        return new Promise((resolve, reject) => {
            const command = ffmpeg();
            inputs.forEach(input => command.input(input));
            console.log(`Complex filter: ${[...filterComplex, ...audioFilters].join(';')}`);
            command
                .complexFilter([...filterComplex, ...audioFilters].join(';'))
                .outputOptions([
                    '-map', currentVideoStream, '-map', '[audio]',
                    '-c:v', 'libx264', '-c:a', 'aac', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'veryfast', '-t', videoDuration,
                ])
                .save(outputPath)
                .on('start', (commandLine) => {
                    console.log('FFmpeg command:', commandLine);
                })
                .on('end', () => {
                    console.log(`FFmpeg processing completed for ${outputPath}`);
                    resolve(outputPath);
                })
                .on('error', (err, stdout, stderr) => {
                    console.error(`FFmpeg error: ${err.message}`);
                    console.error(`FFmpeg stderr: ${stderr}`);
                    reject(err);
                })
                .run();
        });
    } catch (err) {
        rimraf.sync(tempDir);
        throw new Error(`Lỗi xử lý video: ${err.message}`);
    }
}

export { overlayVideo, createVideoSegment, concatVideoSegments, mergeWithAudio };