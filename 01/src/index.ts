import express,{Request, Response} from 'express'
import bodyParser from  'body-parser'
import {isNumberObject} from "util/types";
const app = express()
const port = process.env.PORT || 5000

const videos = [
    {   id: 1,
        title: "Work",
        author: "Sasha",
        canBeDownloaded: false,
        minAgeRestriction: 1,
        createdAt: "2022-11-12",
        publicationDate: "2022-11-13",
        availableResolutions: [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ]
    }]
const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
    })
app.get('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if(video) {
        res.status(200).send(video)
    } else {
        res.send(404)
    }
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    res.status(204).send("All data is deleted")
})
app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204)
            return;
        }
    }
    res.send(404)
})
app.post('/videos', (req: Request, res: Response) => {
    let title: string = req.body.title
    if(!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorsMessages: [{"message": "Incorrect title", "field": "title"}],
        })
        return;
    }
    let author: string = req.body.author
    if(!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        res.status(400).send({
            errorsMessages: [{"message": "Incorrect author", "field": "author"}],
        })
        return;
    }
    let resolutions: Array<string> = req.body.availableResolutions
    if (Array.isArray(resolutions) && resolutions.length < 1) {
        res.status(400).send({
            errorsMessages: [{"message": "Incorrect resolution", "field": "availableResolutions"}],
        })
    }
    if(resolutions.length > 0) {
        for (let i = 0; i < resolutions.length; i++) {
            const isIncludes = availableResolutions.includes(resolutions[i])
            if (!isIncludes) {
                res.status(400).send({
                    errorsMessages: [{"message": "Incorrect resolution", "field": "availableResolutions"}],
                })
                break;
            }
        }
    }
    const today = new Date();
    const nextDay = new Date(new Date().setDate(new Date().getDay() + 1));
    let download: boolean = req.body.canBeDownloaded;
    let ages: number = req.body.minAgeRestriction;
    const newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: download,
        minAgeRestriction: ages,
        createdAt: today.toISOString(),
        publicationDate: nextDay.toISOString(),
        availableResolutions: resolutions
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})
app.put('/videos/:id', (req: Request, res: Response) => {
    let title: string = req.body.title
    if(!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorsMessages: [{"message": "Incorrect title", "field": "title"}], resultCode: 1
        })
        return;
    }
    let author: string  = req.body.author
    if(!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        res.status(400).send({
            errorsMessages: [{"message": "Incorrect author", "field": "author"}],
        })
        return;
    }
    let resolutions: Array<string> = req.body.availableResolutions
    if (Array.isArray(resolutions) && resolutions.length < 1) {
        res.status(400).send({
            errorsMessages: [{"message": "Incorrect resolution", "field": "availableResolutions"}],
        })
    }
    if(resolutions.length > 0) {
        for (let i = 0; i < resolutions.length; i++) {
            const isIncludes = availableResolutions.includes(resolutions[i])
            if (!isIncludes) {
                res.status(400).send({
                    errorsMessages: [{"message": "Incorrect resolution", "field": "availableResolutions"}],
                })
                break;
            }
        }
    }
    let video = videos.find(p => p.id === +req.params.id)
    if(video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = resolutions;
        video.canBeDownloaded = req.body.canBeDownloaded;
        video.minAgeRestriction = req.body.minAgeRestriction;
        video.publicationDate = req.body.publicationDate;
        res.send(204)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})