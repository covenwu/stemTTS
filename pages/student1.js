/*//1111部分为未完成部分，请忽略
1.邮件列表css设置交给凌志威
*/


var student_id=1;           //1111 需要动态获取学生id的方法
//headers数组设置邮件列表的表头
var headers = ["邮件列表"];
//初始时下拉栏状态记录为“主页”
var listMood="主页";
getData();


//下拉菜单的选项被点击时listMood变量会改变为点击的按钮名（innerHTML),借此区分状态
$(".listButton").click(function () {
    changeListMood(this.innerHTML)
});
//设置切换到笔记本模式时输入框清空，提示“请输入”
$("#笔记本").click(function () {
    document.getElementById("emailcontent").value="请输入作业内容";
});
//登录按钮暂用于测试,此处应换为提交作业按钮
$("#登录").click(function () {
    if(listMood=="笔记本"){
        submitHomework();
    }
});

//从数据库取得邮件数据并生成列表的函数
function getData(){
    //ajax请求
    $.get("student_get_email.php",{id:student_id},function(data){
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        //eamil为显示邮件列表的div元素
        var email=document.getElementById("email");
        //创建表格
        creatTable(email,headers,data_array);
    })
}

//动态生成列表的函数
function creatTable(parent, headers, datas) {

    var table = document.createElement("table");
    table.id = "tb";
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    /*for (var i = 0; i < headers.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = headers[i];
        tr.appendChild(th);
    }*/

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var i = 0; i < datas.length; i++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        //在新创建的行内填写除“操作”以外的列
        /*for (var k in datas[i]) {
            if(k!='emailcontent'){
                var td = document.createElement("td");
                td.innerHTML = datas[i][k];
                tr.appendChild(td);
            }
        }*/

        /*在新创建的行内填写“操作”列，附加点击展示邮件内容的功能*/
        //设置新建的td元素
        var display= document.createElement("td");
        //display.innerHTML = "<a href='javascript:'></a>";
        var emailnum=i+1;
        display.innerHTML ="email"+emailnum;
        tr.appendChild(display);
        display.setAttribute('id','display'+i)
        //取得emailcontent内容
        var content=datas[i]['emailcontent'];
        //设置点击展示邮件内容的功能
        var disp=document.getElementById('display'+i);
        disp.onclick = function () {
            document.getElementById("emailcontent").value=content;
        }
    }
}

//切换笔记本和主页的函数,参数为代表状态的字符串
function changeListMood(mood) {
    listMood=mood;
}

function submitHomework() {
    var text=document.getElementById("emailcontent").value;
    $.get("student_submit_homework.php",{id:student_id,text:text},function(data){
        //php文件运行成功返回的data为success
        alert(data);
    })
}