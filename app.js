const express  = require('express');
const path = require('path');
const request = require('request');
const app = express();
const port = 3000;

app.get('/', (req, res) =>  {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

app.use(express.static('www'));

// proxy - because localhost working with pi web api is most likely not going to work unless your cors settings are configured correctly
app.use('/api', function(req, res){
    let url = req.url.replace('/', '');
    let r = null;
    
    // there is some streaming issues in pi web api when the cache-control header is involved - remove it
    delete req.headers["cache-control"];

    if(req.method === "POST") {
        r = request.post({uri: url, json: req.body});
    } else {
        r = request(url);
    }

    req.pipe(r).pipe(res);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));