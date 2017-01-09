//global variables!!!
var GAME_WIDTH = 4;
var GAME_HEIGHT = 4;
var GRID_CHANGED_SINCE_LAST_KEY_PRESSED = true;
 
 
function get_fg_color(value) {
        if (value < 8) return '#333333';
        return '#ffffff';
}
 
function get_bg_color(value) {
        switch (value) {
                case 0: return '#888888';
                case 2: return '#cccccc';
                case 4: return '#ddccbb';
                case 8: return '#ff8800';
                case 16: return '#ff4400';
                case 32: return '#ff1111';
                case 64: return '#ff0000';
                case 128: return '#dddd22';
                case 256: return '#ffff00';
                default: return '#ffff00';
        }
}
 
 
function print(stuff) {
        document.getElementById('print_output').innerHTML += "" + stuff;
}
 
function createGrid(width, height) { //this is a list of columns
    var columns = [];
    for (var x = 0; x < width; ++x) {
        var column = [];
        for (var y = 0; y < height; ++y) {
            column.push(0);
        }
        columns.push(column);
    }
    return columns;
}
 
function createTable(grid, width, height) {
        var tableCode = '';
        for (var row = 0; row < height; ++row) {
                var rowCode = '';
                for (var col = 0; col < width; ++col) {
                        value = grid[col][row];
                        bg = get_bg_color(value);
                        fg = get_fg_color(value);
                        num = value == 0 ? '' : ('' + value);
                        rowCode += '<td style="font-family: &quot;Trebuchet MS&quot;, sans-serif;width:100px; height:100px; font-size:48px; font-weight:bold;text-align:center; background-color:' + bg + '; color:' + fg + '">' + num + '</td>';
                }
                tableCode += '<tr>' + rowCode + '</tr>';
        }
        document.getElementById('originalTable').innerHTML = '<table cellspacing="12" bgcolor="#444444">' + tableCode + '</table>';
}
 
function initializeGame() {
 
    gameGrid = createGrid(GAME_WIDTH, GAME_HEIGHT); // should this line be here?
    addNumberToGrid (gameGrid, GAME_WIDTH,GAME_HEIGHT)
    createTable(gameGrid, GAME_WIDTH, GAME_HEIGHT);
 
    window.gamestate = {}; //TODO add gamestate vars
   
    window.onkeydown = keydownHandler;
    window.onkeyup = keyupHandler; //TODO write function or delete this line
}
 
function addNumberToGrid (grid, GAME_WIDTH,GAME_HEIGHT) {
    x = Math.floor(Math.random()*GAME_WIDTH);
    y = Math.floor(Math.random()*GAME_HEIGHT);
    if (grid[x][y] == 0) {
        grid[x][y] = 2;
    } else {
        addNumberToGrid (grid, GAME_WIDTH,GAME_HEIGHT)
    }
   
}
 
function keydownHandler() {
    if (window.event.keyCode == 37) { // 37==left
        leftPressed(gameGrid, GAME_WIDTH, GAME_HEIGHT);
        if (GRID_CHANGED_SINCE_LAST_KEY_PRESSED) {
            addNumberToGrid (gameGrid, GAME_WIDTH,GAME_HEIGHT)
        }
        createTable(gameGrid, GAME_WIDTH,GAME_HEIGHT);
    } else if (window.event.keyCode == 39) { // 39==right
        rightPressed(gameGrid, GAME_WIDTH, GAME_HEIGHT);
        if (GRID_CHANGED_SINCE_LAST_KEY_PRESSED) {
            addNumberToGrid (gameGrid, GAME_WIDTH,GAME_HEIGHT)
        }
        createTable(gameGrid, GAME_WIDTH,GAME_HEIGHT);
    } else if (window.event.keyCode == 38) { //38==up
        upPressed(gameGrid, GAME_WIDTH, GAME_HEIGHT);
        if (GRID_CHANGED_SINCE_LAST_KEY_PRESSED) {
            addNumberToGrid (gameGrid, GAME_WIDTH,GAME_HEIGHT)
        }
        createTable(gameGrid, GAME_WIDTH,GAME_HEIGHT);
    } else if (window.event.keyCode == 40) { //40==down
        downPressed(gameGrid, GAME_WIDTH, GAME_HEIGHT);
        if (GRID_CHANGED_SINCE_LAST_KEY_PRESSED) {
            addNumberToGrid (gameGrid, GAME_WIDTH,GAME_HEIGHT)
        }
        createTable(gameGrid, GAME_WIDTH,GAME_HEIGHT);
    }
}
 
function keyupHandler() { //is this necessary?
}
 
function compress(list) {
    var output = [];
    var last_is_compressed = true;
    for (var i = 0; i < list.length; ++i) {
        var num = list[i];
        if (num > 0) {
            if (!last_is_compressed && output[output.length - 1] == num) {
                output[output.length - 1] *= 2;
            } else {
                output.push(num);
            }
            last_is_compressed = output[output.length - 1] != num;
        }
    }
 
    while (output.length < list.length) {
        output.push(0);
    }
    return output;
}

 
//TODO replace createTables with document.getElementById('r' + row + '_c' + col).innerHTML = grid[col][row]
 

function upPressed(grid, gridWidth, gridHeight) {
    GRID_CHANGED_SINCE_LAST_KEY_PRESSED = false;
    for (var x = 0; x < gridWidth; ++x) {
        var input = [];
        for (var y = 0; y < gridHeight; ++y) {
            input.push(grid[x][y]);
        }
        
        output = compress(input);
        
        //hacky way to do it b/c you can compare strings but not lists
        if ("" + input != "" + output) {
            GRID_CHANGED_SINCE_LAST_KEY_PRESSED = true;
        }
 
        var i = 0;
        for (var y = 0; y < gridHeight; ++y) {
            grid[x][y] = output[i];
            ++i;
        }
    }
    return grid;  
}
 
 
function downPressed(grid, gridWidth, gridHeight) {
    GRID_CHANGED_SINCE_LAST_KEY_PRESSED = false;
    for (var x = 0; x < gridWidth; ++x) {
        var input = [];
        for (var y = (gridHeight-1); y >= 0; --y) {
            input.push(grid[x][y]);
        }
       
        output = compress(input);

        //hacky way to do it b/c you can compare strings but not lists
        if ("" + input != "" + output) {
            GRID_CHANGED_SINCE_LAST_KEY_PRESSED = true;
        }
 
        var i = 0;
        for (var y = (gridHeight-1); y >= 0; --y) {
            grid[x][y] = output[i];
            ++i;
        }
    }
    return grid;  
}
 
function leftPressed(grid, gridWidth, gridHeight) {
    GRID_CHANGED_SINCE_LAST_KEY_PRESSED = false;
    for (var y = 0; y < gridHeight; ++y) {
        var input = [];
        for (var x = 0; x < gridWidth; ++x) {
            input.push(grid[x][y]);
        }
 
        output = compress(input);
 
        //hacky way to do it b/c you can compare strings but not lists
        if ("" + input != "" + output) {
            GRID_CHANGED_SINCE_LAST_KEY_PRESSED = true;
        }
 
        var i = 0;
        for (var x = 0; x < gridWidth; ++x) {
            grid[x][y] = output[i];
            ++i;
        }
    }
    return grid;  
}
 
function rightPressed(grid, gridWidth, gridHeight) {
    GRID_CHANGED_SINCE_LAST_KEY_PRESSED = false;
    for (var y = 0; y < gridHeight; ++y) {
        var input = [];
        for (var x = (gridWidth-1); x >= 0; --x) {
            input.push(grid[x][y]);
        }
 
        output = compress(input);
 
        //hacky way to do it b/c you can compare strings but not lists
        if ("" + input != "" + output) {
            GRID_CHANGED_SINCE_LAST_KEY_PRESSED = true;
        }
 
        var i = 0;
        for (var x = (gridWidth-1); x >= 0; --x) {
            grid[x][y] = output[i];
            ++i;
        }
    }
    return grid;  
}
