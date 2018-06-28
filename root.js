window.onload = function() {
    var thead = $('#table_head');
    $('<tr>'+
        '<th class="text-center">Device #</th>' +
        '<th class="text-center">Port 1</th>' +
        '<th class="text-center">Port 2</th>' +
        '<th class="text-center">Port 3</th>' + 
        '<th class="text-center">Port 4</th>' +
        '<th class="text-center">Port 5</th>' + 
    '</tr>').appendTo(thead);

    var thead = $('#counts_head');
    $('<tr>'+
        '<th class="text-center">Device #</th>' +
        '<th class="text-center">Port 1</th>' +
        '<th class="text-center">Port 2</th>' +
        '<th class="text-center">Port 3</th>' + 
        '<th class="text-center">Port 4</th>' +
        '<th class="text-center">Port 5</th>' + 
    '</tr>').appendTo(thead);

    function writeValues (data) {
        var tbody = $('#table_body');
        tbody.empty();
        data.forEach(item => {
            var tr = $('<tr/>').appendTo(tbody);
            tr.append('<td class="text-center">' + item.id + '</td>');
            item.values.forEach(value => {
                if (value > 550)
                    tr.append('<td class="text-center bg-danger">' + value + '</td>');
                else
                    tr.append('<td class="text-center">' + value + '</td>');
            })
        })
    }

    function writeCounts (data) {
        var tbody = $('#counts_body');
        tbody.empty();
        data.forEach(item => {
            var tr = $('<tr/>').appendTo(tbody);
            tr.append('<td class="text-center">' + item.id + '</td>');
            item.counts.forEach(value => {
                if (value > 550)
                    tr.append('<td class="text-center bg-danger">' + value + '</td>');
                else
                    tr.append('<td class="text-center">' + value + '</td>');
            })
        })
    }

    function loadData() {
        $.ajax({
            url: "/data",
        }).done(function(data) {
            let grid = [
                {id: 10, values: [], counts: []},
                {id: 11, values: [], counts: []},
                {id: 12, values: [], counts: []},
                {id: 21, values: [], counts: []},
                {id: 22, values: [], counts: []},
                {id: 23, values: [], counts: []}
            ];
            
            data.forEach(element => {
                let id = Math.floor(element.device_id/100),
                    port = element.device_id - id*100,
                    value = element.value;
                item = grid.find(item=>item.id==id);
                if (port >= 5) 
                    item.values[port - 5] = value;
                else
                    item.counts[port] = value;
            });
            writeValues(grid)
            writeCounts(grid)
        });
    }
    
    function timeout() {
        setTimeout(function () {
            loadData();
            timeout();
        }, 500);
    }
    loadData();
    timeout();
}