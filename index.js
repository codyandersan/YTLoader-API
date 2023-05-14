const express = require("express");
const ytdl = require("ytdl-core");
const cloudinary = require('cloudinary').v2;

const app = express();

cloudinary.config({
    secure: true
});

const upload = async (url, id) => {
    console.log("uploading")
    try {
        let resp = await cloudinary.uploader.upload_large(url,
            {
                resource_type: "video",
                public_id: id,
                chunk_size: 6000000,
                eager_async: true,
                timeout: 120000
            }
        );
        console.log("uploaded")
        console.log(resp)
    } catch (error) {
        console.error(error)
    }



}

const merge = async () => {
    console.log("merging")
    resp = await cloudinary.video("jsvideo", {
        transformation: [
            {
                "overlay": "video:jsaudio",
                "flags": "layer_apply"
            }
        ]
    })
    console.log("merged")
    console.log(resp)
}

app.get("/download", async (req, res) => {

    // Get the YouTube video URL from the request body.
    const videoUrl = "7c3-Gei5j4w"

    const info = await ytdl.getInfo(videoUrl);
    const video = info.formats.find(format => format.qualityLabel === "1080p").url;
    const audio = info.formats.find(format => format.hasAudio && format.audioBitrate === 160).url;

    await upload(video, "jsvideo")
    await upload(audio, "jsaudio")
    // await merge()
    console.log("done")

    // Send a success response.
    res.status(200).send({ video: video, audio: audio, merged: "https://res.cloudinary.com/codyandersan/video/upload/fl_layer_apply,l_video:jsaudio/jsvideo.mp4" });
});

app.listen(3000, () => {
    console.log("App listening on port 3000.");
});
module.exports = app;