"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const videos = [
    { id: 1,
        title: "Work",
        author: "Sasha",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2022-11-10",
        publicationDate: "2022-11-10",
        availableResolutions: ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
    }
];
const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
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
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorsMessages: [{ "message": "Incorrect title", "field": "title" }],
        });
        return;
    }
    let author = req.body.author;
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        res.status(400).send({
            errorsMessages: [{ "message": "Incorrect author", "field": "author" }],
        });
        return;
    }
    let resolutions = req.body.availableResolutions;
    if (Array.isArray(resolutions) && resolutions.length < 1) {
        res.status(400).send({
            errorsMessages: [{ "message": "Incorrect resolution", "field": "availableResolutions" }],
        });
    }
    if (resolutions.length > 0) {
        for (let i = 0; i < resolutions.length; i++) {
            const isIncludes = availableResolutions.includes(resolutions[i]);
            if (!isIncludes) {
                res.status(400).send({
                    errorsMessages: [{ "message": "Incorrect resolution", "field": "availableResolutions" }],
                });
                break;
            }
        }
    }
    const newVideo = {
        id: req.body.id,
        title: title,
        author: author,
        canBeDownloaded: req.body.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction,
        createdAt: req.body.createdAt,
        publicationDate: req.body.publicationDate,
        availableResolutions: resolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
app.put('/videos/:id', (req, res) => {
    let title = req.body.title;
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorsMessages: [{ "message": "Incorrect title", "field": "title" }], resultCode: 1
        });
        return;
    }
    let author = req.body.author;
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        res.status(400).send({
            errorsMessages: [{ "message": "Incorrect author", "field": "author" }],
        });
        return;
    }
    let resolutions = req.body.availableResolutions;
    if (Array.isArray(resolutions) && resolutions.length < 1) {
        res.status(400).send({
            errorsMessages: [{ "message": "Incorrect resolution", "field": "availableResolutions" }],
        });
    }
    if (resolutions.length > 0) {
        for (let i = 0; i < resolutions.length; i++) {
            const isIncludes = availableResolutions.includes(resolutions[i]);
            if (!isIncludes) {
                res.status(400).send({
                    errorsMessages: [{ "message": "Incorrect resolution", "field": "availableResolutions" }],
                });
                break;
            }
        }
    }
    let video = videos.find(p => p.id === +req.params.id);
    if (video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = resolutions;
        video.canBeDownloaded = req.body.canBeDownloaded;
        video.minAgeRestriction = req.body.minAgeRestriction;
        video.publicationDate = req.body.publicationDate;
        res.send(204);
    }
    else {
        res.send(404);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
