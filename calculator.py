from sanic import Sanic
from sanic.response import json, text
from sanic_cors import CORS
import math

app = Sanic(__name__)
CORS(app)


@app.route("/")
async def test_request_args(request):
    return json({
        "parsed": True,
        "url": request.url,
        "query_string": request.query_string,
        "args": request.args,
        "raw_args": request.raw_args,
        "query_args": request.query_args,
    })


# 数字区处理: 包括数字、小数点、𝜋
@app.route("/num", methods=["POST"])
async def num(request):
    num = request.form.get('num')
    if num.isdigit():
        return json({"result": switcher.get('number')(num)})
    return json({"result": switcher.get(num)()})


# 控制区:包括C、CE、DEL、=、（、）
@app.route("/control", methods=["POST"])
async def control(request):
    operation = request.form.get('operation')
    switcher.get(operation)()
    return json({"result": cal.display})


# 一元运算处理
@app.route("/unary", methods=["POST"])
async def unary_operate(request):
    operation = request.form.get('operation')
    num = toNumber(request.form.get('num'))
    if cal.numBuffer != "":
        cal.numBuffer = "0"
    cal.display = switcher.get(operation)(num)
    return json({"result": cal.display})


# 二元运算处理
@app.route("/binary", methods=["POST"])
async def binary_oprate(request):
    """
    若操作区无操作，改变操作，清空缓冲区
    若操作区有操作：1。若缓冲区无数，则改变操作；2。若缓冲区有数，则将计算（前数 操作 展示数）存到前数中并展示，改变操作，清空缓冲区
    """
    operation = request.form.get('operation')
    if cal.operation == "":
        cal.operation = operation
        cal.numBuffer = ""
    else:
        if cal.numBuffer == "":
            cal.operation = operation
        else:
            display = toNumber(request.form.get('display'))
            cal.display = str(switcher.get(cal.operation)(cal.present, display))
            cal.operation = operation
            cal.numBuffer = ""
    return json({"result": cal.display})


# 计算器类的定义
class Calculator:
    display = "0"   # 显示屏的展示
    numBuffer = "0"  # 用户输入数字的缓冲
    present = 0     # 前一数字
    operation = ""      # 操作区
    bracketCount = 0    # 记录（的数量,可省略
    pre_ope = []        # 前数与前操作的整合栈，有（）时使用

    def __init__(self):
        pass


# 数字区
# 数字：若输入时缓冲区为空，应先将展示数存入前数，再进行更新缓冲区，刷新展示数
def number(num):
    if cal.numBuffer == "":
        cal.present = toNumber(cal.display)
        cal.numBuffer += num
    else:
        if cal.numBuffer == "0":
            cal.numBuffer = num
        else:
            cal.numBuffer += num
    refresh()
    return cal.display


# 输入小数点逻辑与上面输入数字类似
def point():
    if cal.numBuffer == "":
        cal.present = toNumber(cal.display)
        cal.numBuffer = "0."
    elif '.' not in cal.numBuffer:
        cal.numBuffer += "."
    refresh()
    return cal.display


# 𝜋相当于输入数字，若缓冲区为空，应将展示数存入前数，刷新展示数，再刷新缓冲区为0
def pii():
    if cal.numBuffer == "":
        cal.present = toNumber(cal.display)
    cal.numBuffer = "0"
    cal.display = "3.141592653589793"
    return cal.display




# 一元运算区
def sin(num):
    return math.sin(num / 180 * math.pi)


def cos(num):
    return math.cos(num / 180 * math.pi)


def tan(num):
    return math.tan(num / 180 * math.pi)


def square(num):
    return math.pow(num, 2)


def sqrt(num):
    return math.sqrt(num)

def power10(num):
    return math.pow(10, num)

def log(num):
    return math.log(num)

def exp(num):
    return math.exp(num)

def factorial(num):
    return math.factorial(num)

def changeSign(num):
    return -num


# 二元运算区
def add(present, display):
    return present + display

def delete(present, display):
    return present - display

def multiply(present, display):
    return present * display

def divide(present, display):
    # 使用除法结果会自动变为float,故判断是否要转化为int
    result = present / display
    return int(result) if int(result) == result else result

def mod(present, display):
    return present % display

def power(present, display):
    return math.pow(present, display)


# 控制区
def clearC():
    cal.numBuffer = "0"
    cal.display = "0"
    cal.operation = ""
    cal.present = 0
    cal.bracketCount = 0
    cal.pre_ope.clear()
    return cal.display


def clearEntry():
    cal.numBuffer = "0"
    cal.display = "0"
    return cal.display


def deletion():
    if len(cal.numBuffer) > 1:
        cal.numBuffer = cal.numBuffer[:-1]
    else:
        cal.numBuffer = "0"
    refresh()
    return cal.display


def equall():
    """等号：若操作区无操作：则只需刷新展示数；
          若操作区有操作：1。若缓冲区为空：刷新展示数，清空操作区；
                        2。若缓冲区不为空：计算（前数 操作 展示数）并展示，清空缓冲区、操作区、前数
          若无右括号，则执行以上步骤，若有则将缺的左括号补上，再执行以上步骤"""
    while len(cal.pre_ope):
        rightBracket()
    if cal.operation != "":
        if cal.numBuffer == "":
            cal.operation = ""
        else:
            cal.display = str(switcher.get(cal.operation)(cal.present, toNumber(cal.display)))
            cal.operation = ""
            cal.numBuffer = "0"
            cal.present = 0


def leftBracket():
    """（：若操作区无操作：无视；
        若有操作：1。若有缓冲数：无视；（数字后面不可直接接括号
                2。若无缓冲数：加入(成功，(数++，将展示数，操作存入栈中，初始化前数、操作"""
    if cal.operation != "" and cal.numBuffer == "":
        present, operation = toNumber(cal.display), cal.operation
        pre_ope = (present, operation)
        cal.pre_ope.append(pre_ope)
        cal.present = 0
        cal.operation = ""


def rightBracket():
    """）：若（数为0则无视；
        若（数>0：1。操作区无操作：若缓冲区无数，[弹栈恢复前数、操作]；若缓冲区有数：展示数存入缓冲数，refresh，[←]
              2。有操作：若缓冲区无数，则与右上角↗︎步骤同；若缓冲区有数：计算(前数 操作 展示)存入缓冲数，refresh，[↖︎]"""
    if len(cal.pre_ope):
        if cal.operation == "":
            if cal.numBuffer != "":
                cal.numBuffer = cal.display
        else:
            if cal.numBuffer == "":
                cal.numBuffer = cal.display
            else:
                cal.numBuffer = str(switcher.get(cal.operation)(cal.present, toNumber(cal.display)))
            refresh()
        cal.present, cal.operation = cal.pre_ope.pop()


# 内部函数区
def toNumber(num):
    """将字符串转化为数字"""
    return float(num) if '.' in num else int(num)


def refresh():
    """刷新显示数为缓冲区的数字"""
    cal.display = "0" if cal.numBuffer == "" else cal.numBuffer


switcher = {
    'number': number,
    'point': point,
    'pi': pii,
    'clearC': clearC,
    'clearEntry': clearEntry,
    'deletion': deletion,
    'sin': sin,
    'cos': cos,
    'tan': tan,
    'square': square,
    'sqrt': sqrt,
    'power10': power10,
    'log': log,
    'exp': exp,
    'factorial': factorial,
    'changeSign': changeSign,
    'add': add,
    'delete': delete,
    'multiply': multiply,
    'divide': divide,
    'mod': mod,
    'power': power,
    'equal': equall,
    'leftBracket': leftBracket,
    'rightBracket': rightBracket
}

# 计算器的实例
cal = Calculator()


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)