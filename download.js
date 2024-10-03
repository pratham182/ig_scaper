const fs = require('fs');
const axios = require('axios');

const downloadVideo = async (videoUrl, outputPath) => {
    try {
        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream'
        });

        // Create a write stream to save the video
        const writer = fs.createWriteStream(outputPath);

        // Pipe the response data to the file
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading video:', error);
    }
};

// Usage example
const videoUrl = 'blob:https://www.instagram.com/e04558a1-e4c6-442d-bba5-67af2e3ac2f1'; // Replace with your video URL
const outputPath = 'downloaded_video.mp4'; // Path where the video will be saved

downloadVideo(videoUrl, outputPath)
    .then(() => console.log('Video downloaded successfully!'))
    .catch(err => console.error('Error:', err));
