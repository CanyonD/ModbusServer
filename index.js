var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8080;
var React = require('react');

http.createServer(function (request, response) {
    console.log(request.url);
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);
    if (request.url === '/test_upload/fileupload') {
        console.log('start fileuploading...');
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
            if (typeof(files.filetoupload.path) !== "undefined") {
                router.post('/test_upload/index.html');
                // return;
            }
            var oldpath = files.filetoupload.path;
            var newpath = '/opt/web/tmp_upload/' +
                Math.random()*100000 + '_' + files.filetoupload.name ;
            fs.rename(oldpath, newpath, function (err) {
                console.log('saving a file...');
                if(err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }
                response.writeHead(200);
                response.write('File uploaded and moved!');
                response.end();
            });
        });
    }

    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhist:" + port + "/\nCTRL + C to shutdown");