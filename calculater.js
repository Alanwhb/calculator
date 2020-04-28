$(document).ready(function () {
    let url = 'http://127.0.0.1:8000/';
    screen = $("#screen");
    let maxLength = 20; // 显示屏最大长度


    // 数字区: 包括数字、小数点、𝜋
    $(".num").click(function () {
        let val = $(this).val();
        if (val !== "pi" && screen.text().length >= maxLength) {
            alert("数字长度最多为20");
        }
        else {
            $.post(url + 'num',
                { num: val },
                function (res) {
                    screen.text(res.result);
                })
        }
    });


    // 控制区：包括C、CE、DEL、=、（、）
    $(".control").click(function() {
        $.post(url + 'control',
            { operation: $(this).val() },
            function (res) {
                screen.text(res.result);
            });
    });


    // 一元运算区：
    $(".unary").click(function () {
        $.post(url+'unary',
            {
                operation: $(this).val(),
                num: screen.text()
            },
            function (res) {
                screen.text(res.result);
            });
    });


    // 二元运算区：
    $(".binary").click(function () {
        $.post(url + 'binary',
            {
                operation: $(this).val(),
                display: screen.text()
            },
            function (res) {
                screen.text(res.result);
            });
    });
});
