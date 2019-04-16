const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/data', express.static('./data'));
if(process.argv.length>2){
  app.listen(process.argv[2]);  
} else {
  app.listen(80);
}

app.post('/', function(req, res) {
  (async () => {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    const page = await browser.newPage();
    await page.setViewport({width: 600, height: 400});
    await page.goto(req.body.url);
    var date = new Date() ;
    await page.screenshot({ path: "./data/"+date.getTime()+'.png' });
    browser.close();
    res.redirect('/');
  })();
});

app.get('/',function(req, res){
  res.writeHead(200, {'Content-Type' : 'text/html'});
  var data = "<!doctype html><html><head><title>SS</title><body><form method='POST'><input type='text' name='url' size='100'><input type='submit'></form>"
  fs.readdir('./data/', function(err, files){
    if (err) throw err;
    var fileList = files.map(function(file){
        if(fs.statSync("./data/"+file).isFile() && /.*\.png$/.test(file)){
          data += "<img src='./data/"+file+"'><a href='./data/"+file+"'>"+file+"</a><br />";
        }
    })
    data += "</body></html>"
    res.write(data);
    res.end()
  });
});

console.log("server start");

var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
reader.on('close', function () {
  process.exit();
});
