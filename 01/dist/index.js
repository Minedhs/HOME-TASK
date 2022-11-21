"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
let videos = [];
const validResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
app.get('/videos', (req, res) => {
    res.status(200).send(videos);
});
app.get('/videos/:id', (req, res) => {
    let video = videos.find(p => p.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.send(404);
    }
});
app.delete('/testing/all-data', (req, res) => {
    res.status(204).send("All data is deleted");
});
app.delete('/videos/:id', (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
app.post('/videos', (req, res) => {
    let title = req.body.title;
    let error = { "errorsMessages": [] };
    if (!title || !title.trim() || title.length > 40) {
        error.errorsMessages.push({ "message": "Incorrect title", "field": "title" });
    }
    let author = req.body.author;
    if (!author || !author.trim() || author.length > 20) {
        error.errorsMessages.push({ "message": "Incorrect author", "field": "author" });
    }
    let resolutions = req.body.availableResolutions;
    if (resolutions) {
        if (!Array.isArray(resolutions)) {
            error.errorsMessages.push({ "message": "Incorrect resolution", "field": "availableResolutions" });
        }
        else {
            resolutions.forEach(resolution => {
                !validResolutions.includes(resolution) && error.errorsMessages.push({ "message": "Incorrect resolution", "field": "availableResolutions" });
            });
        }
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error);
        return;
    }
    const newDay = new Date(new Date().setDate(new Date().getDate() + 1));
    const newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: newDay.toISOString(),
        availableResolutions: resolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
    return;
});
app.put('/videos/:id', (req, res) => {
    let title = req.body.title;
    let error = { "errorsMessages": [] };
    if (!title || !title.trim() || title.length > 40) {
        error.errorsMessages.push({ "message": "Incorrect title", "field": "title" });
    }
    let author = req.body.author;
    if (!author || !author.trim() || author.length > 20) {
        error.errorsMessages.push({ "message": "Incorrect author", "field": "author" });
    }
    let resolutions = req.body.availableResolutions;
    if (resolutions) {
        if (!Array.isArray(resolutions)) {
            error.errorsMessages.push({ "message": "Incorrect resolution", "field": "availableResolutions" });
        }
        else {
            resolutions.forEach(resolution => {
                !validResolutions.includes(resolution) && error.errorsMessages.push({ "message": "Incorrect resolution", "field": "availableResolutions" });
            });
        }
    }
    let download = req.body.canBeDownloaded;
    if (download !== true && download !== false) {
        error.errorsMessages.push({ "message": "Incorrect download", "field": "canBeDownloaded" });
    }
    let minAge = req.body.minAgeRestriction;
    if (minAge < 1 || minAge > 18) {
        error.errorsMessages.push({ "message": "Incorrect minAgeRestriction", "field": "minAgeRestriction" });
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error);
        return;
    }
    let video = videos.find(p => p.id === +req.params.id);
    if (video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = resolutions;
        video.canBeDownloaded = download;
        video.minAgeRestriction = minAge || null;
        video.publicationDate = new Date().toISOString();
        res.send(204);
        return;
    }
    else {
        res.send(404);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
