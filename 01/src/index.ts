import express,{Request, Response} from 'express'
import bodyParser from  'body-parser'
import {isBooleanObject, isNumberObject} from "util/types";
const app = express()
const port = process.env.PORT || 5000

let videos: any[] = []
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
    let error: {"errorsMessages": any[]} = {"errorsMessages": [ ]}
    if(!title || !title.trim() || title.length > 40) {
        error.errorsMessages.push({"message": "Incorrect title", "field": "title"})
    }
    let author: string = req.body.author
    if(!author || !author.trim() || author.length > 20) {
        error.errorsMessages.push({"message": "Incorrect author", "field": "author"})
    }
    let availableResolutions = req.body.availableResolutions
    if (availableResolutions) {
        if (!Array.isArray(availableResolutions)) {
        error.errorsMessages.push({"message": "Incorrect resolution", "field": "availableResolutions"})
    } else {
            availableResolutions.forEach(resolution => {
                !availableResolutions.includes(resolution) && error.errorsMessages.push({
                    "message": "Incorrect resolution", "field": "availableResolutions"})
            })
        }
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return;
    }
    const newDay = new Date(new Date().setDate(new Date().getDate() + 1))
    const newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: newDay.toISOString(),
        availableResolutions: availableResolutions
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
    return;
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
    let availableResolutions = req.body.availableResolutions
    if (availableResolutions) {
        if (!Array.isArray(availableResolutions)) {
            error.errorsMessages.push({"message": "Incorrect resolution", "field": "availableResolutions"})
        } else {
            availableResolutions.forEach(resolution => {
                !availableResolutions.includes(resolution) && error.errorsMessages.push({
                    "message": "Incorrect resolution", "field": "availableResolutions"})
            })
        }
    }
    let download: boolean = req.body.canBeDownloaded
    if (!download) {
        error.errorsMessages.push({"message": "Incorrect download", "field": "canBeDownloaded"})
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return;
    }
    let video = videos.find(p => p.id === +req.params.id)
    if(video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = availableResolutions;
        video.canBeDownloaded = Boolean(req.body.canBeDownloaded);
        video.minAgeRestriction = download;
        video.publicationDate = req.body.publicationDate;
        res.send(204)
        return;
    } else {
        res.send(404)
    }

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})