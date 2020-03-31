cal = {};
cal.display = "0";  // 显示屏的展示
cal.numBuffer = "0";   // 用户输入数字的缓冲
cal.present = 0;    // 前一数字
cal.operation = ""; // 操作区
cal.bracketCount = 0;   // 记录（的数量
cal.pres = [];  // 前数栈，有（）时使用
cal.operas = [];    // 操作栈，有（）时使用
maxLength = 20; // 显示屏最大长度


// 内部函数区
function refresh() {    // 刷新显示数为缓冲区的数字
    if (!cal.numBuffer.length)
        cal.display = "0";
    else cal.display = cal.numBuffer;
    document.getElementById("screen").innerText = String(cal.display);
}


// 数字区：若输入时缓冲区为空，应先将展示数存入前数，再进行更新缓冲区，刷新展示数
function num(val) {
    if (cal.numBuffer === ""){
        cal.present = Number(cal.display);
        cal.numBuffer += String(val);
    }
    else{
        if (cal.numBuffer.length >= maxLength)
            alert("数字长度最多为20");
        else{
            if (cal.numBuffer === "0")
                cal.numBuffer = String(val);
            else
                cal.numBuffer += String(val);
        }
    }
    refresh();
}

function point() {  // 输入小数点逻辑与上面输入数字类似
    if (cal.numBuffer === ""){
        cal.present = Number(cal.display);
        cal.numBuffer = "0.";
    }
    else {
        if (cal.numBuffer.indexOf('.') > 0) // 若已经为小数模式,不做任何操作
            return;
        if (cal.numBuffer.length >= maxLength)
            alert("数字长度最多为20");
        else
            cal.numBuffer += ".";
    }
    refresh();
}

function pi() { // 𝜋相当于输入数字，若缓冲区为空，应将展示数存入前数，刷新展示数，再刷新缓冲区为0
    if (cal.numBuffer === "") {
        cal.present = Number(cal.display);
    }
    cal.numBuffer = "3.141592653589793";
    refresh();
    cal.numBuffer = "0";
}


// 控制区
function clearc() {
    cal.display = "0";
    cal.numBuffer = "0";
    cal.operation = "";
    cal.present = 0;
    cal.bracketCount = 0;
    cal.pres = [];
    cal.operas = [];
    refresh();
}

function clearEntry() {
    cal.numBuffer = "0";
    refresh();
}

function deletion() {
    if (cal.numBuffer.length > 1) {
        cal.numBuffer = cal.numBuffer.substr(0, cal.numBuffer.length - 1);
    }
    else
        cal.numBuffer = "0";
    refresh();
}


// 一元运算区：只改变显示数，若缓冲区不为空则缓冲区置0；（可进行优化：重复代码较多，可合并
function cos() {
    const num = Number(cal.display);
    cal.display = String(Math.cos(num / 180 * Math.PI));    // 要将角度转化为弧度
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function sin() {
    const num = Number(cal.display);
    cal.display = String(Math.sin(num / 180 * Math.PI));
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function tan() {
    const num = Number(cal.display);
    cal.display = String(Math.tan(num / 180 * Math.PI));
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function changeSign() {
    let num = Number(cal.display);
    cal.display = String(-num);
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function sqrt() {
    let num = Number(cal.display);
    cal.display = String(Math.sqrt(num));
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function log() {    // 返回ln()
    let num = Number(cal.display);
    cal.display = String(Math.log(num));
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function exp() {    // 返回e的x次方
    let num = Number(cal.display);
    cal.display = String(Math.exp(num));
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function factorial() {  // 阶乘
    let num = Number(cal.display);
    if (num < 0 || Math.round(num) !== num || num > 100) // 负数和小数和大数不给阶乘
        num = NaN;
    else {
        let result = 1;
        for (let i = 1; i <= num; i++)
            result *= num;
        num = result;
    }
    cal.display = String(num);
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function power10() {
    let num = Number(cal.display);
    cal.display = String(Math.pow(10, num));
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}

function square() {
    let num = Number(cal.display);
    cal.display = String(Math.pow(num, 2));
    document.getElementById("screen").innerText = cal.display;
    if (cal.numBuffer !== "")
        cal.numBuffer = "0";
}


// 二元运算区：若操作区无操作，改变操作，清空缓冲区
//          若操作区有操作：1。若缓冲区无数，则改变操作；2。若缓冲区有数，则将计算（前数 操作 展示数）存到前数中并展示，改变操作，清空缓冲区
function dyadicOperation(opera) {
    const operation = opera[0];
    if (cal.operation === "") {
        cal.operation = operation;
        cal.numBuffer = "";
    }
    else {
        if (cal.numBuffer === "") {
            cal.operation = operation;
        }
        else {
            switch (cal.operation) {
                case "+":
                    cal.present = cal.present + Number(cal.display);
                    break;
                case "-":
                    cal.present = cal.present - Number(cal.display);
                    break;
                case "*":
                    cal.present = cal.present * Number(cal.display);
                    break;
                case "/":
                    cal.present = cal.present / Number(cal.display);
                    break;
                case 'M':
                    cal.present = cal.present % Number(cal.display);
                    break;
                case 'y':   // 求指数
                    cal.present = Math.pow(cal.present, cal.display);
                    break;
                default:
                    break;
            }
            cal.display = String(cal.present);
            document.getElementById("screen").innerText = cal.display;
            cal.operation = operation;
            cal.numBuffer = "";
        }
    }
}


// 其他区
// 等号：若操作区无操作：则只需刷新展示数；
//      若操作区有操作：1。若缓冲区为空：刷新展示数，清空操作区；2。若缓冲区不为空：计算（前数 操作 展示数）并展示，清空缓冲区、操作区、前数
//      若无右括号，则执行以上步骤，若有则将缺的左括号补上，再执行以上步骤
function equal() {
    while (cal.bracketCount > 0)
        rightBracket();
    if (cal.operation === ""){
        document.getElementById("screen").innerText = cal.display;
    }
    else {
        if (cal.numBuffer === ""){
            document.getElementById("screen").innerText = cal.display;
            cal.operation = "";
        }
        else {
            switch (cal.operation) {
                case "+":
                    cal.display = String(cal.present + Number(cal.display));
                    break;
                case "-":
                    cal.display = String(cal.present - Number(cal.display));
                    break;
                case "*":
                    cal.display = String(cal.present * Number(cal.display));
                    break;
                case "/":
                    cal.display = String(cal.present / Number(cal.display));
                    break;
                case 'M':
                    cal.display = String(cal.present % Number(cal.display));
                    break;
                case 'y':   // 求指数
                    cal.display = String(Math.pow(cal.present, Number(cal.display)));
                    break;
                default:
                    break;
            }
            document.getElementById("screen").innerText = cal.display;
            cal.operation = "";
            cal.numBuffer = "0";
            cal.present = 0;
        }
    }
}

// （：若操作区无操作：无视；
//    若有操作：1。若有缓冲数：无视；（数字后面不可直接接括号
//            2。若无缓冲数：加入(成功，(数++，将展示数，操作存入栈中，初始化前数、操作
function leftBracket() {
    if (cal.operation !== "" && cal.numBuffer === "") {
        cal.bracketCount++;
        cal.pres.push(Number(cal.display));
        cal.operas.push(cal.operation);
        cal.present = 0;
        cal.operation = "";
    }
}

// ）：若（数为0则无视；
//    若（数>0：（数-1，1。操作区无操作：若缓冲区无数，[弹栈恢复前数、操作]；若缓冲区有数：展示数存入缓冲数，refresh，[←]
//                    2。有操作：若缓冲区无数，则与右上角↗︎步骤同；若缓冲区有数：计算(前数 操作 展示)存入缓冲数，refresh，[↖︎]
function rightBracket() {
    if (cal.bracketCount > 0) {
        cal.bracketCount--;
        if (cal.operation === "") {
            if (cal.numBuffer !== ""){
                cal.numBuffer = cal.display;
                refresh();
            }
        }
        else {
            if (cal.numBuffer === ""){
                cal.numBuffer = cal.display;
            }
            else {
                switch (cal.operation) {
                    case "+":
                        cal.numBuffer = String(cal.present + Number(cal.display));
                        break;
                    case "-":
                        cal.numBuffer = String(cal.present - Number(cal.display));
                        break;
                    case "*":
                        cal.numBuffer = String(cal.present * Number(cal.display));
                        break;
                    case "/":
                        cal.numBuffer = String(cal.present / Number(cal.display));
                        break;
                    case 'M':
                        cal.numBuffer = String(cal.present % Number(cal.display));
                        break;
                    case 'y':   // 求指数
                        cal.numBuffer = String(Math.pow(cal.present, Number(cal.display)));
                        break;
                    default:
                        break;
                }
            }
            refresh();
        }
        cal.present = cal.pres.pop();
        cal.operation = cal.operas.pop();
    }
}