// utils/editAudio.js
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import fs from 'fs-extra';
import path from 'path';
import { uploadAudio } from './uploadAudio.js'; // Assuming you have this utility
import { fileURLToPath } from 'url';

ffmpeg.setFfmpegPath(ffmpegPath);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, '../tmp');

// Function to trim audio and upload to cloud
export async function trimAudio(inputPath, outputPath, start, end) {
  await fs.ensureDir(tempDir);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start) // Start time in seconds
      .setDuration(end - start) // Duration in seconds
      .audioCodec('libmp3lame') // Ensure MP3 output
      .audioBitrate('128k')
      .outputOptions(['-y']) // Overwrite output file if exists
      .on('end', async () => {
        console.log(`Trimmed audio saved to ${outputPath}`);
        try {
          // Upload to cloud
          const cloudUrl = await uploadAudio(outputPath);
          // Clean up local file
          await fs.unlink(outputPath).catch(err => console.error(`Failed to delete ${outputPath}: ${err.message}`));
          resolve(cloudUrl);
        } catch (uploadErr) {
          reject(new Error(`Upload failed: ${uploadErr.message}`));
        }
      })
      .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
      .save(outputPath);
  });
}

