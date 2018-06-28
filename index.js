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
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);
    if (uri === '/data') {
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
        
    } else if (
        uri === '/agents/api/automation/log/v1/5929efbd2a2de5239c103884' 
        || uri === '/agents/api/automation/settings/v1/5929efbd2a2de5239c103884'
        || uri === '/agents/api/automation/conf/v1/5929efbd2a2de5239c103884'
        || uri === '/agents/api/automation/jobs/v1/5929efbd2a2de5239c103884'
    ) {
        response.writeHead(200);
        response.write("Ping\n");
        response.end();
    } else {
        console.log(request.url);
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
    }
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");