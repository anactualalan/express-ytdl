const express = require('express');
const app = express();
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const path = require('path');
const HttpsProxyAgent = require('https-proxy-agent');
const fetch = require('node-fetch');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req,res) => {
  try {
  var query = "";
  if(req.query.q) query = req.query.q;
  res.render('home', { url: `/audio/${(`${query}`).split(" ").join("+")}`, query: `${query}`});
  }catch(e) {
        res.send('Something Went Wrong')
  }
}) 

app.get('/info/:id', async (req,res) => {
  try {
    var query = req.params.id;
    if(!query)return res.send({
      title: 'Rythm'
    });
    var result = await yts(`${query} lyrics`);
    if(!result?.videos)return res.send({
      title: '404 Not Found'
    });
    var video = result?.videos[0];
    if(!video || !video.url)return res.send({
      title: '404 Not Found'
    });
    res.send(video);
  }catch(e) {
    return res.send({
      title: 'Something Went Wrong'
    });
  }
})

app.get('/audio/:id', async (req,res) => {
  try {
    var query = req.params.id;
    if(!query)return res.send(400).send({
      message: 'Please provide a query'
    });
    var result = await yts(`${query} lyrics`);
    if(!result?.videos)return res.send(404).send({
      message: '404 Not Found'
    });
    var video = result?.videos[0];
    if(!video || !video.url)return res.send(404).send({
      message: '404 Not Found'
    });
   ytdl(video.url, {
     filter: 'audioonly'
   }).pipe(res);
      }catch(e) {
    return res.status(404).send({
      message: 'Something Went Wrong'
    })
  }
})

app.listen(3000)
