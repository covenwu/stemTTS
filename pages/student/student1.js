/*//1111部分为未完成部分，请忽略
1.邮件列表css设置交给凌志威
2.计划在页面功能基本实现时再设置定时刷新
*/

//-----------------设置变量---------------------
//listMood是下拉栏状态，初始为“主页”
var listMood = "主页";
//从url获取sid
var sid = getQueryString("sid");
var evaluation='';
//PDFObject.embed('test.pdf',"#pdf");
var attachname ="attach";
var attachnum=1;
//-----------------执行部分----------------------------------------------
//取得用户信息
//getUserInfo();
//getEmailData();
setInterval("getEmailData();", 3000);
setInterval("updateGetOnlineuser()", 5000);
homeworkList();
urlList();
//-----------------设置点击事件------------------
//下拉菜单的选项被点击时listMood变量会改变为点击的按钮名（innerHTML),借此区分状态
$(".listButton").click(function () {
    changeListMood(this.innerHTML)
});
//设置切换到笔记本模式时输入框清空，依据当前作业评价状态提示“请输入”，或禁止输入
$("#笔记本").click(function () {
    $.get("get_homework_evaluation.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进user_info_array
        //alert(data)
        //var evaluation = eval(data);
        evaluation = eval(data);
        var submitbutton = document.getElementById('提交作业');
        //alert(evaluation_array)
        //var evaluation=evaluation_array['evaluation'];      //111
        var textarea = document.getElementById('emailcontent');
        if (evaluation == '未提交' || evaluation == '待修改') {
            //document.getElementById("emailcontent").value="请输入作业内容";
            textarea.value = "请输入作业内容";
            textarea.removeAttribute('readonly');
            submitbutton.removeAttribute('disabled');
        }
        else if (evaluation == '批改中') {
            //document.getElementById("emailcontent").value="作业待教师批改";
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = "作业待教师批改";
            submitbutton.setAttribute('disabled', 'disabled');
        }
        else if (evaluation == '通过') {
            //document.getElementById("emailcontent").value="您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.value = "您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');

        }
    })
});
$("#提交作业").click(function () {
    if (listMood == "笔记本") {
        submitHomework();
    }
});

//-----------------函数定义部分----------------------------------------------
//获取get传值的方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
/*
//从session中取得用户信息到js
function getUserInfo() {
    $.get("get_user_info.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进user_info_array
        user_info_array = eval(data);
    })
}
*/
//从数据库取得邮件数据并生成列表的函数
function getEmailData() {
    $.get("student_get_email.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        //eamil为显示邮件列表的div元素
        var email = document.getElementById("emaillist");
        //创建表格
        createTable(email, data_array,'emailtable');
    })
}

//动态生成列表的函数
function createTable(parent,datas,tablename) {
    /*
    var child=document.getElementById(tablename);
    if(child){
        parent.removeChild(child);
    }

    var table = document.createElement("table");
    table.id = tablename;
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    */
    var tbody=prepareTable(parent,tablename);

    //创建‘邮件n'的单元列
    for (var i = 0; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            /*在新创建的行内创建'邮件n'的单元格，附加点击展示邮件内容的功能*/
            //设置新建的td元素
            var display = document.createElement("td");

            //处理显示的邮件主题
            var taskid=datas[i]['taskid'];
            var timeStamp=datas[i]['timeStamp'];
            var actiontype=datas[i]['actiontype'];

            if(actiontype=='ReportFeedback'){
                var title='教师反馈任务'+taskid+' '+timeStamp;
            }
            else if(actiontype='TaskEmail'){
                title='任务邮件'+taskid+' '+timeStamp;
            }
            display.innerHTML = title;


            tr.appendChild(display);
            display.setAttribute('id', 'display' + i);
            //取得emailcontent内容
            var content = datas[i]['content'];
            //设置点击展示邮件内容的功能
            var disp = document.getElementById('display' + i);
            disp.onclick = function () {
                document.getElementById("emailcontent").value = content;
            }
        })(i)
    }
}

/*
//动态生成列表的函数
function creatTable(parent,datas) {

    var table = document.createElement("table");
    table.id = "tb";
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    //创建‘邮件n'的单元列
    for (var i = 0; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            //在新创建的行内创建'邮件n'的单元格，附加点击展示邮件内容的功能
            //设置新建的td元素
            var display = document.createElement("td");
            //命名'邮件n'时n要相对数组索引加1
            var emailnum = i + 1;
            display.innerHTML = "email" + emailnum;
            tr.appendChild(display);
            display.setAttribute('id', 'display' + i);
            //取得emailcontent内容
            var content = datas[i]['content'];
            //设置点击展示邮件内容的功能
            var disp = document.getElementById('display' + i);
            disp.onclick = function () {
                document.getElementById("emailcontent").value = content;
            }
        })(i)
    }
}
*/
//切换笔记本和主页的函数,参数为代表状态的字符串
function changeListMood(mood) {
    listMood = mood;
}

//提交作业到后台写入数据库的函数
function submitHomework() {
    //先禁用按钮，防止重复提交
    document.getElementById('提交作业').setAttribute('disabled', 'disabled');
    var text = document.getElementById("emailcontent").value;

    var fileform = document.getElementById('upload');
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(fileform);
    formdata.append('sid', sid);
    formdata.append('text', text);
    formdata.append('evaluation', evaluation);
    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            //提示区会提示success表示发送成功
            //document.getElementById("result").innerHTML = xhr.responseText;
            alert(xhr.responseText)
        }
    };
    xhr.open('post', './student_submit_homework.php');
    xhr.send(formdata);

    /*
    $.get("student_submit_homework.php", {text:text, sid:sid,evaluation:evaluation}, function (data) {
        //php文件运行成功返回的data为success
        alert(data);
    })*/
}

//更新在线用户列表的函数
function updateGetOnlineuser() {
    //ajax请求
    $.get("update_get_onlineuser.php", {sid: sid}, function (data) {
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        var onlineuserlist_str = "";
        for (var k = 0; k < data_array['student_name'].length; k++) {
            if (jQuery.inArray(data_array['student_name'][k], data_array['onlineuser_name']) != -1) {
                onlineuserlist_str += data_array['student_name'][k] + '(在线）<br/>';
            } else {
                onlineuserlist_str += data_array['student_name'][k] + '<br/>';
            }
        }
        if (jQuery.inArray(data_array['tutor_name'], data_array['onlineuser_name']) != -1) {
            onlineuserlist_str += '导师&nbsp' + data_array['tutor_name'] + '(在线）';
        } else {
            onlineuserlist_str += '导师&nbsp' + data_array['tutor_name'];
        }
        document.getElementById("在线列表").innerHTML = onlineuserlist_str;
    })
}

//生成作业列表
function homeworkList() {
    $.get("stu_homework_list.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进data_array

        var homework_array = eval(data);
        //eamil为显示邮件列表的div元素

        var homeworkdiv = document.getElementById("homeworklist");
        //创建表格

        createTable2(homeworkdiv, homework_array,'homeworktable');
    })
}

function createTable2(parent,datas,tablename) {
    /*var child=document.getElementById(tablename);
    if(child){
        parent.removeChild(child);
    }

    var table = document.createElement("table");
    table.id = tablename;
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    */

    var tbody=prepareTable(parent,tablename);
    //创建‘邮件n'的单元列
    for (var i = 0; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            /*在新创建的行内创建'邮件n'的单元格，附加点击展示邮件内容的功能*/
            //设置新建的td元素
            var display = document.createElement("td");

            //处理显示的邮件主题
            var content=datas[i]['content'];
            var timeStamp=datas[i]['timeStamp'];

            display.innerHTML = 'report'+i+' '+timeStamp;


            tr.appendChild(display);
            display.setAttribute('id', 'homework' + i);
            //设置点击展示邮件内容的功能
            var disp = document.getElementById('homework' + i);
            disp.onclick = function () {
                document.getElementById("emailcontent").value = content;
            }
        })(i)
    }
}

function prepareTable(parent,tablename) {
    var child=document.getElementById(tablename);
    if(child){
        parent.removeChild(child);
    }

    var table = document.createElement("table");
    table.id = tablename;
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    return(tbody);
}

function urlList() {
    $.get("stu_url_list.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进data_array
        //alert(data)
        var url_array = eval(data);
        //eamil为显示邮件列表的div元素
        var urldiv = document.getElementById("urllist");
        //创建表格

        createUrlTable(urldiv, url_array,'urltable');
        //alert(1)
    })
}

function createUrlTable(parent,datas,tablename) {
    var tbody=prepareTable(parent,tablename);
    //创建‘邮件n'的单元列
    for (var i = 0; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            /*在新创建的行内创建'邮件n'的单元格，附加点击展示邮件内容的功能*/
            //设置新建的td元素
            var display = document.createElement("td");

            //处理显示的邮件主题
            var href=datas[i]['url'];
            var hreftag=document.createElement('a');
            var node = document.createTextNode(datas[i]['url']);
            hreftag.appendChild(node);
            //hreftag.setAttribute('href',datas[i]['url']);
            //display.innerHTML = datas[i]['url'];
            display.appendChild(hreftag);
            hreftag.onclick=function (ev) {
                PDFObject.embed(href,"#pdf")
            }

            tr.appendChild(display);
            /*

            display.setAttribute('id', 'href' + i);
            //设置点击展示邮件内容的功能
            var disp = document.getElementById('href' + i);
            disp.onclick = function () {
                document.getElementById("emailcontent").value = content;
            }*/
        })(i)
    }
}

//-----------------上传附件部分----------------------------------------------


function addInput(){
    if(attachnum>0){
        var attach = attachname + attachnum ;
        if(createInput(attach))
            attachnum=attachnum+1;
    }
}
function deleteInput(){
    if(attachnum>1){
        attachnum=attachnum-1;
        if(!removeInput())
            attachnum=attachnum+1;
    }
}
function createInput(nm){
    var aElement=document.createElement("input");
    aElement.name=nm;
    aElement.id=nm;
    aElement.type="file";
    aElement.size="50";
//aElement.value="thanks";
//aElement.onclick=Function("asdf()");
    if(document.getElementById("upload").appendChild(aElement) == null)
        return false;
    return true;
}
function removeInput(nm){
    var aElement = document.getElementById("upload");
    if(aElement.removeChild(aElement.lastChild) == null)
        return false;
    return true;
}