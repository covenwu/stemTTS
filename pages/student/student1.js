/*//1111部分为未完成部分，请忽略
1.邮件列表css设置交给凌志威
2.计划在页面功能基本实现时再设置定时刷新
*/
//-----------------执行部分----------------------------------------------
//-----------------设置变量---------------------
//headers数组设置邮件列表的表头    1111可能被取消

var headers = ["邮件列表"];
//初始时下拉栏状态记录为“主页”
var listMood="主页";
//取得用户信息
getUserInfo();
getEmailData();
setInterval("updateGetOnlineuser()",2000);
//-----------------设置点击事件------------------
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


//-----------------函数定义部分----------------------------------------------
//从session中取得用户信息到js
function getUserInfo() {
    $.get("get_user_info.php",function(data){
        //返回的json数据解码，数据存进user_info_array
        user_info_array=eval(data);
    })
}

//从数据库取得邮件数据并生成列表的函数
function getEmailData(){
    //ajax请求
    $.get("student_get_email.php",function(data){
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        //eamil为显示邮件列表的div元素
        var email=document.getElementById("emaillist");
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

    //1111 暂被取消的表头
    /*for (var i = 0; i < headers.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = headers[i];
        tr.appendChild(th);
    }*/

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    //创建‘邮件n'的单元列
    for (var i = 0; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            /*在新创建的行内创建'邮件n'的单元格，附加点击展示邮件内容的功能*/
            //设置新建的td元素
            var display= document.createElement("td");
            //命名'邮件n'时n要相对数组索引加1
            var emailnum=i+1;
            display.innerHTML ="email"+emailnum;
            tr.appendChild(display);
            display.setAttribute('id','display'+i);
            //取得emailcontent内容
            var content=datas[i]['emailcontent'];
            //设置点击展示邮件内容的功能
            var disp=document.getElementById('display'+i);
            disp.onclick = function () {
                document.getElementById("emailcontent").value=content;
            }
        })(i)
    }
}

//切换笔记本和主页的函数,参数为代表状态的字符串
function changeListMood(mood) {
    listMood=mood;
}

//提交作业到后台写入数据库的函数
function submitHomework() {
    var text=document.getElementById("emailcontent").value;
    $.get("student_submit_homework.php",{text:text},function(data){
        //php文件运行成功返回的data为success
        alert(data);
    })
}

//更新在线用户列表的函数
function updateGetOnlineuser() {
    //ajax请求
    $.get("update_get_onlineuser.php",function(data){
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        var onlineuserlist=$("#onlineuserlist");
        onlineuserlist.empty();
        var onlineusername="";
        for(var k in data_array){
            onlineusername=data_array[k]["username"];
            onlineuserlist.append("<option value=''>"+onlineusername+"</option>");
        }

    })
}

