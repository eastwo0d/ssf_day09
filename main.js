//load lib
const express = require('express');
const hbs = require('express-handlebars');
const request = require('request');
const keys = require('./keys.json')

//tunables
const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000);

//create an instance of the application
const app = express();

app.engine('hbs', hbs());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views')

//route handling
app.get('/search', (req, res) => {
    const name = req.query.searchTerm || req.query.name
    const numRes = parseInt(req.query.numRes)
    console.log(name)
    console.log(numRes)
    const offset = parseInt(req.query.offset) || 0
    console.log(offset)

    const params = {
        q : name,
        limit : numRes,
        offset : offset,
        api_key : keys.api_key
    }
    console.log(params)

    request.get('http://api.giphy.com/v1/gifs/search',
    { qs : params },
    (err, gipRes, body) => {
        if (err){
            res.status(400);
            res.type('text/plain');
            res.send(err);
            return;
        }
        results = JSON.parse(body)
        console.log(results.data)
        res.status(200);
        res.type('text/html');
        //res.send(results.data)
        res.render('search', {
             layout : false,
             name : name,
             image : results.data,
             next_offset: offset + numRes,
             prev_offset: offset - numRes,
             numRes : numRes

         })
    })   
})


app.get(/.*/, express.static(__dirname + '/public'));

//start the server
app.listen(PORT, () => {
    console.log(`Application is started on ${new Date()} at port ${PORT}`)
})