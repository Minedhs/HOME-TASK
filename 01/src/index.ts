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
        minAgeRestriction: null,
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
app.delete('/ht_01/api/testing/all-data', (req: Request, res: Response) => {
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
    let error: {"errorsMessages": any[]} = {"errorsMessages": [ ]};
    if(!title || !title.trim() || title.length > 40) {
        error.errorsMessages.push({"message": "Incorrect title", "field": "title"})
    }
    let author: string = req.body.author
    if(!author || !author.trim() || author.length > 20) {
        error.errorsMessages.push({"message": "Incorrect author", "field": "author"})
    }
    let resolutions: Array<string> = req.body.availableResolutions
    if (Array.isArray(resolutions) && resolutions.length < 1) {
        error.errorsMessages.push({"message": "Incorrect resolution", "field": "availableResolutions"})
    }
    if(resolutions.length > 0) {
        for (let i = 0; i < resolutions.length; i++) {
            const isIncludes = availableResolutions.includes(resolutions[i])
            if (!isIncludes) {
                    error.errorsMessages.push({"message": "Incorrect resolution", "field": "availableResolutions"})
                }
                break;
            }
        }
    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return;
    }
    const newDay = (date:any) => {
        const newDate = date.toISOString()
        return new Date(Date.parse(newDate) + 1440 * 60000).toISOString()
    }
    const newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: newDay.toString(),
        availableResolutions: resolutions
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})
app.put('/videos/:id', (req: Request, res: Response) => {
    let title: string = req.body.title
    let error: {"errorsMessages": any[]} = {"errorsMessages": [ ]};
    if(!title || !title.trim() || title.length > 40) {
        error.errorsMessages.push({"message": "Incorrect title", "field": "title"})
    }
    let author: string = req.body.author
    if(!author || !author.trim() || author.length > 20) {
        error.errorsMessages.push({"message": "Incorrect author", "field": "author"})
    }
    let resolutions: Array<string> = req.body.availableResolutions
    if (Array.isArray(resolutions) && resolutions.length < 1) {
        error.errorsMessages.push({"message": "Incorrect resolution", "field": "availableResolutions"})
    }
    if(resolutions.length > 0) {
        for (let i = 0; i < resolutions.length; i++) {
            const isIncludes = availableResolutions.includes(resolutions[i])
            if (!isIncludes) {
                error.errorsMessages.push({"message": "Incorrect resolution", "field": "availableResolutions"})
            }
            break;
        }
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return;
    }
    let video = videos.find(p => p.id === +req.params.id)
    if(video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = resolutions;
        video.canBeDownloaded = false;
        video.minAgeRestriction = null;
        video.publicationDate = new Date().toISOString();
        res.send(204)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})