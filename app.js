// Create server
const express = require('express');
const app = express();
const PORT = 3000;
app.listen(PORT, () => console.log('server is running on :' + PORT));
app.use(express.json());
app.use(express.static('front_end'));
app.use(express.urlencoded());

const fs = require('fs');
let all_posts = JSON.parse(fs.readFileSync('data.json'));

// Get data from json file
app.get('/post', (req, res) => {
    res.send(all_posts);
});

// Post data into json file
app.post('/post', (req, res) => {
    let lastId = 1;
    if (all_posts.length > 0) {
        lastId += parseInt(all_posts[0].id)
    };
    let user = {
        id : lastId,
        name : req.body.name,
        date: req.body.date,
        content : req.body.text,
        image : req.body.img
    };
    all_posts.unshift(user);
    fs.writeFileSync('data.json', JSON.stringify(all_posts));
    res.send(all_posts);
});

// Edit data in json file
app.put('/post/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let content = req.body.text;
    let image = req.body.image;
    let index = all_posts.findIndex( post => post.id === parseInt(id));

    if (index >= 0){
        let user = all_posts[index];
        user.name = name;
        user.content = content;
        user.image = image;
        fs.writeFileSync('data.json', JSON.stringify(all_posts));
        res.send(all_posts);
    } else {
        res.send({error : '404 not found!!!'});
    };
});

// Delete object in json file
app.delete('/post/:id', (req, res) => {
    let id = req.params.id;
    let index = all_posts.findIndex( post => post.id === parseInt(id));
    if (index >= 0 ){
        all_posts.splice(index, 1);
        fs.writeFileSync('data.json', JSON.stringify(all_posts));
        res.send(all_posts);
    } else {
        res.send({error : '404 not found!!!'})
    };
});
