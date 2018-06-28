const http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8080;

const PythonShell = require('python-shell');
const sqlite3 = require('sqlite3').verbose();

PythonShell.run('modbus_reader.py', function (err) {
    if (err) throw err;
    console.log('finished python script');
});

let db = new sqlite3.Database('./database_server.db');

http.createServer(function (request, response) {
    console.log(request.url);
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);
    // if (request.url === '/test_upload/fileupload') {
    //     console.log('start fileuploading...');
    //     var form = new formidable.IncomingForm();
    //     form.parse(request, function (err, fields, files) {
    //         if (typeof(files.filetoupload.path) !== "undefined") {
    //             router.post('/test_upload/index.html');
    //             // return;
    //         }
    //         var oldpath = files.filetoupload.path;
    //         var newpath = '/opt/web/tmp_upload/' +
    //             Math.random()*100000 + '_' + files.filetoupload.name ;
    //         fs.rename(oldpath, newpath, function (err) {
    //             console.log('saving a file...');
    //             if(err) {
    //                 response.writeHead(500, {"Content-Type": "text/plain"});
    //                 response.write(err + "\n");
    //                 response.end();
    //                 return;
    //             }
    //             response.writeHead(200);
    //             response.write('File uploaded and moved!');
    //             response.end();
    //         });
    //     });
    // }

    // fs.exists(filename, function(exists) {
    //     if(!exists) {
    //         response.writeHead(404, {"Content-Type": "text/plain"});
    //         response.write("404 Not Found\n");
    //         response.end();
    //         return;
    //     }

    //     if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    //     fs.readFile(filename, "binary", function(err, file) {
    //         if(err) {
    //             response.writeHead(500, {"Content-Type": "text/plain"});
    //             response.write(err + "\n");
    //             response.end();
    //             return;
    //         }

    //         response.writeHead(200);
    //         response.write(file, "binary");
    //         response.end();
    //     });
    // });
    if (request.url === '/') {
        fs.readFile(path.join(__dirname+'/index.html'), function (err, data) {
            if (!err) {
                response.writeHead(200);
                response.write(data.toString());
                response.end();
            } else {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }
        });
    }
    if (request.url === '/root.js') {
        fs.readFile(path.join(__dirname+'/root.js'), function (err, data) {
            if (!err) {
                response.writeHead(200);
                response.write(data.toString());
                response.end();
            } else {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }
        });
    }

    if (request.url === '/data') {
        let sql = `SELECT * FROM server_values ORDER BY id DESC LIMIT 100;`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/html'});
                response.write(err.message);
                response.end();
                throw err;
            }
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(rows));
            response.end();
        });
    }
 
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");