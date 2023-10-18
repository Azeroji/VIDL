import express from 'express'
import cors from 'cors';
import { logIn, register, info, follow, unfollow, followers, following, post, posts, infoId, feed, search } from './database.js';
import authenticateToken from './middlewares/authMiddleware.js';
import upload from './middlewares/uploadMiddleware.js';

const app = express();

app.use(
    cors({
        origin: "*"
    })
);

app.use(express.json());

app.use(express.static('uploads'));

/*
        AUTH
                   */

app.post('/api/login', async(req,res)=>{
    const { log } = req.body
    const result = await logIn(log)
    console.log("REQUEST")
    res.status(200).json(result)
});

app.post('/api/register', async(req,res)=>{
    const { log } = req.body
    const result = await register(log)
    console.log("REQUEST")
    res.status(200).json(result)
});

/* ELSE */

app.get('/api/info/:username', authenticateToken, async(req, res) => {
    const userId = req.userId
    const username = req.params.username
    const result = await info(username, userId)
    res.status(200).json(result)
});

app.get('/api/info', authenticateToken, async(req, res) => {
    const userId = req.userId
    const result = await infoId(userId)
    console.log(result)
    res.status(200).json(result)
});

app.post('/api/follow', authenticateToken, async(req, res) => {
    const userId = req.userId
    const { username } = req.body
    const result = await follow(userId, username)
    res.status(200).json(result)
})

app.post('/api/unfollow', authenticateToken, async(req, res) => {
    const userId = req.userId
    const { username } = req.body
    const result = await unfollow(userId, username)
    res.status(200).json(result)
})

app.get('/api/followers/:username', async(req, res) => {
    const username = req.params.username
    const result = await followers(username)
    console.log("REQUEST")
    res.status(200).json(result)
})

app.get('/api/following/:username', async(req, res) => {
    const username = req.params.username
    const result = await following(username)
    console.log("REQUEST")
    res.status(200).json(result)
})

app.get('/api/posts/:username', async(req, res) => {
    const username = req.params.username
    const result = await posts(username)
    res.status(200).json(result)
})

app.get('/api/feed', async(req,res) => {
    const result = await feed(25)
    res.status(200).json(result)
})

app.get('/api/search/:username', async(req,res) => {
    const username = req.params.username
    const result = await search(username)
    res.status(200).json(result)
})

/*
    UPLOAD
            */

app.post('/api/uploadpost', authenticateToken, upload.single('fileName'), async(req, res) => {
    const userId = req.userId
    const { caption } = req.body
    const profilePictureUrl = req.file.path
    const result = await post( userId, profilePictureUrl, caption )
    res.status(200).json(result)
});

app.listen(5000,()=>{
  console.log("Server listening on port: 5000");
});