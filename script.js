var board = new Array();//记录格子里的数字
var score = 0;
var mark = new Array(); 

window.onload = function(){
	new_game();
}

//开始新游戏
function new_game() {
    init();
    produce_number();
    produce_number();
}

//初始化
function init() {    
	document.getElementById("container").innerHTML = ""; //用于自动载入
	for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        mark[i] = new Array();
    }                         //board mark开成二维数组
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
			var cnode = document.createElement("div");  //cnode为新生成的结点，div类型
			cnode.className = "cell";
			document.getElementById("container").appendChild(cnode);
			cnode.id = "cell_" + i + j;
			cnode.style.zIndex = 0;    //置顶
			cnode.style.top = 15 + i * 115 + "px";
			cnode.style.left = 15 + j * 115 + "px"; //规定cnode的位置
			mark[i][j] = false;
            board[i][j] = 0;
		}
	}
	score = 0;
	document.getElementById("score").innerHTML = score;  //将score写入html
}

//更新棋局
function update_board(){
	document.getElementById("container").innerHTML = "";
	for (var i = 0; i < 4; i++) {      //更新时重新生成格子
        for (var j = 0; j < 4; j++) {
			var cnode = document.createElement("div");
			cnode.className = "cell";
			document.getElementById("container").appendChild(cnode);
			cnode.id = "cell_" + i + j;
			cnode.style.zIndex = 0;
			cnode.style.top = 15 + i * 115 + "px";
			cnode.style.left = 15 + j * 115 + "px";
			if (board[i][j] != 0) {   //按格子中的数字对应的样式生成格子,若数字为0，则为css中cell默认的样式
				cnode.style.backgroundColor = get_number_background_color(board[i][j]);
				cnode.style.color = get_number_color(board[i][j]);
				cnode.innerHTML = board[i][j];
			}
			mark[i][j] = false;
		}
	}
}

//随机在一个格子生成数字
function produce_number() {
    if (nospace(board)) {
        return false;
    }
    var randomx = Math.floor(Math.random() * 4);//floor函数：向下取整
    var randomy = Math.floor(Math.random() * 4);
    var time = 0;
    while (time < 50) 
	{			//如果随机生成的位置为0，则生成于该位置，若该位置原已有数字，则重新生成位置
        if (board[randomx][randomy] == 0) 
            break;
        randomx = Math.floor(Math.random() * 4);
        randomy = Math.floor(Math.random() * 4);
        time++;
    }
    if (time == 50) 	//若多次随机生成的位置皆已有数字，则遍历格子找第一个空格
        for (var i = 0; i < 4; i++) 
            for (var j = 0; j < 4; j++) 
                if (board[i][j] == 0)
				{
					randomx = i;
                    randomy = j;
				}					              
    var random_number = Math.random() < 0.9 ? 2 : 4;  //随机生成数字2和4的比例为9:1
    board[randomx][randomy] = random_number;
	var cell = document.getElementById("cell_" + randomx + randomy);
	cell.innerHTML = random_number; //将随机生成的数字对应的样式赋给cell
	cell.style.backgroundColor = get_number_background_color(random_number);
	cell.style.color = get_number_color(random_number);  
    return true;
}

//获得相应数字的背景色
function get_number_background_color(number) {
    switch (number) {
        case 2: return '#eee4da'; break;
        case 4: return '#ede0c8'; break;
        case 8: return '#f2b179'; break;
        case 16: return '#f59563'; break;
        case 32: return '#f67c5f'; break;
        case 64: return '#f65e3b'; break;
        case 128: return '#edcf72'; break;
        case 256: return '#edcc61'; break;
        case 512: return '#9c0'; break;
        case 1024: return '#33b5e5'; break;
        case 2048: return '#09c'; break;
        case 4096: return '#a6c'; break;
        case 8192: return '#93c'; break;
    }
}

//获得相应数字的颜色
function get_number_color(number) {
    if (number <= 4) return '#776e65';
    return 'white';
}

//平移一个div
function showmove(k,l,i,j){
	var cell = document.getElementById("cell_" + k + l);
	cell.style.zIndex = 5;   //将原位置的cell置底
	setTimeout(function(){
		cell.style.top = 15 + i * 115 + "px";
		cell.style.left = 15 + j * 115 + "px";
		var cnode = document.createElement("div");
		cnode.className = "cell";
		document.getElementById("container").appendChild(cnode);//在新位置生成新格子
		cnode.style.top = 15 + k * 115 + "px";
		cnode.style.left = 15 + l * 115 + "px";//css3中动画属性？
	},100)
}

document.onkeydown = keydown;//把keydown函数绑定给键盘事件

function keydown(event) {
    switch (event.keyCode) {
        case 37: //left
            if (move_left()) {  //如果向左移动成功，则生成新格子并判断是否游戏结束
                setTimeout('produce_number()', 220);
                setTimeout('is_gameover()', 220);
            }
            break;
        case 38: //up
            if (move_up()) {
                setTimeout('produce_number()', 220);
                setTimeout('is_gameover()', 220);
            }
            break;
        case 39: //right
            if (move_right()) {
                setTimeout('produce_number()', 220);
                setTimeout('is_gameover()', 220);
            }
            break;
        case 40: //down
            if (move_down()) {
                setTimeout('produce_number()', 220);
                setTimeout('is_gameover()', 220);
            }
            break;
        default:
            break;
    }
};

//向左移动
function move_left() {
    if (!can_move_left(board))//先判断是否可以移动，不能移动则返回
        return false;
    for (var i = 0; i < 4; i++) 
        for (var j = 1; j < 4; j++) //从第2列开始向左遍历，要移动的格子为（i，j）
            if (board[i][j] != 0) 
                for (var k = 0; k < j; k++) //用k遍历（i，j）左边的格子
				{
                    if (board[i][k] == 0 && no_block_horizontal(i, k, j, board)) 
					{           //若目标格子之前的格子（i，k）为空且与目标格子之间无其他格子
                        showmove(i, j, i, k);
                        board[i][k] = board[i][j];//把数字贴过去，update时根据数字生成样式
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && no_block_horizontal(i, k, j, board) && !mark[i][k])
						{  //若目标格子与之前的某一格子数字相同,之间没有其他格子，未发生过合并，则可合并
                        showmove(i, j, i, k);
                        board[i][k] += board[i][j];   //新格子数字加和
                        board[i][j] = 0;			  //旧格子数字置0
                        score += board[i][k];
						document.getElementById("score").innerHTML = score;
                        mark[i][k] = true;
                        break;
                    }
                }  	
    setTimeout('update_board()',230); //根据格子中的数字刷新全屏
    return true;
}

//向右移动
function move_right() {
    if (!can_move_right(board))
        return false;
    for (var i = 0; i < 4; i++) 
        for (var j = 2; j >= 0; j--) //从第3列开始向右遍历，要移动的格子为（i，j）
            if (board[i][j] != 0) 
                for (var k = 3; k > j; k--) 
				{           //遍历（i，j）右边的格子
                    if (board[i][k] == 0 && no_block_horizontal(i, j, k, board)) {
                        showmove(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && no_block_horizontal(i, j, k, board) && !mark[i][k]) {
                        showmove(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        document.getElementById("score").innerHTML = score;
                        mark[i][k] = true;
                        break;
                    }
                }
    setTimeout('update_board()', 230);
    return true;
}

//向上移动
function move_up() {
    if (!can_move_up(board)) 
        return false;
    for (var j = 0; j < 4; j++) 
        for (var i = 1; i < 4; i++) //从第2行开始向下遍历，要移动的格子为（i，j）
            if (board[i][j] != 0) 
                for (var k = 0; k < i; k++)
				{  //用k遍历（i，j）上方的格子（i，k）
                    if (board[k][j] == 0 && no_block_vertical(j, k, i, board)) {
                        showmove(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && no_block_vertical(j, k, i, board) && !mark[k][j]) {
                        showmove(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        document.getElementById("score").innerHTML = score;
                        mark[k][j] = true;
                        break;
                    }
                }
    setTimeout('update_board()', 230);
    return true;
}

//向下移动
function move_down() {
    if (!can_move_down(board)) 
        return false;
    for (var j = 0; j < 4; j++) 
        for (var i = 2; i >= 0; i--) // 从第3行开始向上遍历，要移动的格子为（i，j）
            if (board[i][j] != 0) 
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && no_block_vertical(j, i, k, board)) {
                        showmove(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && no_block_vertical(j, i, k, board) && !mark[k][j]) {
                        showmove(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        document.getElementById("score").innerHTML = score;
                        mark[k][j] = true;
                        break;
                    }
                }
    setTimeout('update_board()', 230);
    return true;    
}

//判断棋盘上是否还有空格子
function nospace(board) {
    for (var i = 0; i < 4; i++) 
        for (var j = 0; j < 4; j++) 
            if (board[i][j] == 0) 
                return false;
    return true;
}

//判断是否能向左移动，若格子左边有空格或左边有格子可以合并，则可移
function can_move_left(board) {
    for (var i = 0; i < 4; i++) 
        for (var j = 1; j < 4; j++) 
            if (board[i][j] != 0) 
                if (board[i][j - 1] == 0 || board[i][j] == board[i][j - 1]) 
                    return true;
    return false;
}

//判断是否能向右移动
function can_move_right(board) {
    for (var i = 0; i < 4; i++) 
        for (var j = 2; j >= 0; j--) 
            if (board[i][j] != 0) 
                if (board[i][j + 1] == 0 || board[i][j] == board[i][j + 1]) 
                    return true;
    return false;
}

//判断是否能向上移动
function can_move_up(board) {
    for (var j = 0; j < 4; j++) 
        for (var i = 1; i < 4; i++) 
            if (board[i][j] != 0) 
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) 
                    return true;
    return false;
}

//判断是否能向下移动
function can_move_down(board) {
    for (var j = 0; j < 4; j++) 
        for (var i = 2; i >= 0; i--) 
            if (board[i][j] != 0) 
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) 
                    return true;
    return false;
}

//判断水平方向上是否有空格子，row为行，col为列
function no_block_horizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) 
        if (board[row][i] != 0) 
            return false;
    return true;
}

//判断垂直方向上是否有空格子
function no_block_vertical(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) 
        if (board[i][col] != 0) 
            return false;   
    return true;
}

//判断游戏失败
function is_gameover() {
    if (nospace(board) && (!(can_move_down(board) || can_move_up(board) || can_move_right(board) || can_move_left(board)))) {
		alert("Game Over");
    }
}