const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// enable templates for 'part' of the website (e.g. header, footer, etc)
hbs.registerPartials(__dirname + '/views/partials');
console.log(__dirname + '/views/partials');

app.set('view engine', 'hbs');
// move the app.use for static so that it is 'blocked' by the maintenance middleware
//app.use(express.static(__dirname + '/public'));

// add middleware, this will be run for EVERY request and must call next.
app.use((req, res, next) => {
    // log requests
    const now = new Date().toString();
    const logstring = `${now}: ${req.method} ${req.url}`;

    // have access to all req and res properties, see expressjs.com.en.4x.api.html
    console.log(logstring);
    fs.appendFile('server.log', logstring + '\n', (err) => {
        if (err) {
            console.log('unable to append to server.log');
        }
    });

    next();
});

// challenge -- maintenance page
/*
app.use((req, res, next) => {
    res.render('maintenance.hbs');
});
*/

// Moved here so that it is blocked by the maintenance route above if it is activated. That
// piece of middleware blocks because it doesn't call next.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear',() =>  {
    return new Date().getFullYear();
});

// helpers can take parameters
hbs.registerHelper('shoutIt', (text) => {
    return text.toUpperCase();
});

app.get('/',  (req, res) => {
    //res.send('<h1>Hello Express!</h1>');
    res.render('home.hbs', {
        websiteName: 'Jims Jewels',
        pageTitle: 'Welcome Page',
        welcomeMessage: 'Welcome, I am Jim and this webpage contains some of my jewels laid out here for you to share.'
//        currentYear: new Date().getFullYear()
    })
});

app.get('/about', (req, res) => {
    // this is our first go
    //res.send('About Page');

    // now use handlebars (defaults to views folder)
    res.render('about.hbs', {
        pageTitle: 'About Page',
//        currentYear: new Date().getFullYear()
    });
});
 
app.get('/bad', (req, res) => {
    res.send( {
        errorMessage: 'that did not work!'
    });
});

app.listen(3001, () => {
    console.log('Server available on port 3001. Press ^C to exit.');
});