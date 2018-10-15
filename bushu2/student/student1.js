/*
问题：1.（在线列表）教师重名，应换成更可靠的id
       4.可能可以合并请求来减少请求次数
       6.可以根据新邮件来减少checkhoemworkevaluaion
进度：
*/

//-----------------控制台--------------------
//查询反馈和任务邮件的间隔
var getEmailInterval = 6000;
//小组学生数
var groupstunumber = 4;
//获取聊天信息的间隔
var getChatmsgInterval = 3000;
//更新在线用户列表的间隔
var updateOnlineInterval = 10000;
//小组共分享文件列表的更新间隔
var shareListInterval = 10000;

//-----------------设置变量---------------------
//-----------------信息存储---------------------
//info_开头的全局数组用于存储各种信息，可以在控制台查看initialize()函数的返回数据查看结构和内容
//原则上应减少所有非必要的对数据库的查询，所以将信息都如此缓存在客户端
//组内教师和学生信息
var info_group = [];
//发出的邮件
var info_report = [];
//用户信息
var info_user = [];
//feedback和taskemail合并后按时间排序的数组
var info_email = [];
//从pro.xml获得的信息
var info_pro = [];
//任务数
var TASKNUM=0;

//当前的taskid
var taskidnow;
//作业评价状态改变的可能性，为1时checkevaluation()函数会查询数据库，为0时仅会查询客户端的信息
var evaluationchange = 1;
//当前最新report评价
var evaluation = '';
//sid以get方式传值，从网址中获得参数
var sid = getQueryString("sid");

//-----------------发件箱------------
//记录最后一次点击的发件列表项是否为最后一封,可为'other'和'last'
var lastclick = 'other';
//用于生成上传按钮的变量
var attachname = "attach";
var attachnum = 1;
//-----------------收件箱------------
//收件列表邮件的最大时间戳，每次收到邮件时更新为最新一封邮件的时间，从数据库查询时只查询最大时间戳之后的时间，避免获取重复的信息
var maxEmailTimeStamp = '1000-01-01 00:00:00';
//-----------------聊天室------------
// 同上，服务器只返回maxtimeStamp以后的聊天信息
var maxChattimeStamp = '1000-01-02 00:00:00';
//上次发出查询聊天的ajax已返回
var LASTCHATAJAXEND=true;
//聊天室自动滚动功能是否开启
var chatautoflow = 1;
//-----------------执行部分----------------------------------------------
initialize();
prepareAllTable();

window.onbeforeunload = function () {
    //关闭页面前保存草稿
    saveDraft();
    return "确认离开？";
};
setInterval("getNewEmail()", getEmailInterval);
setInterval("showmessage()", getChatmsgInterval);
setInterval("updateGetOnlineuser()", updateOnlineInterval);
setInterval("shareListData()", shareListInterval);


//-----------------函数定义部分----------------------------------------------
//-----------------获取信息及相应处理----------------------------------------------
//初始所有一开始即可获得的信息,(js控制台中可查看相应的数据结构）
function initialize() {
    $.ajax({
        url: "info.php",
        data: {sid: sid},
        success: function (data) {
            var info = JSON.parse(data);
            info_group = info['group'];
            info_report = info['report'];
            info_user = info['user'];
            info_pro = info['pro'];
            TASKNUM=objectLength(info['pro']);
            //根据task数组长度计算taskidnow，-1为减去checked项
            taskidnow = objectLength(info['task']) - 1;
            //合并任务邮件，反馈邮件的信息，按时间排序存入info_eamil数组
            sortEmailarr(info['task'], info['feedback'], 0);
            //计算小组成员数，-1为减去tutor
            groupstunumber = objectLength(info_group['userid']) - 1;
            console.log('initialize info');
            console.log(info);
            console.log('info_email');
            console.log(info_email);

            //补充最后一封邮件的信息，（此处补充的信息可能没有被使用）
            var lasttask = getLastTaskEmail(info_email.length - 1);
            lasttask['taskid'] = taskidnow;
            lasttask['checked'] = info['task']['checked'];

            //创建一些依赖数据的界面
            createUI();
            //更新在线用户列表
            updateGetOnlineuser();
            //生成新消息提醒
            reminder(info['feedback'], info['task']);
        }
    });
}

//此处使用的排序方法较为令人费解，且功能独立，如果出现了问题难以修改建议直接用别的思路重写
//将接收到的feedback和taskemail数组合并为info_email，按timestamp排序，使用了递归
function sortEmailarr(task, feedback, taskindex) {
    if (typeof (task[taskindex]) === 'undefined') {
        return 0;
    }
    info_email.push(task[taskindex]);

    testFeedback(feedback, taskindex, taskindex + 1);
    sortEmailarr(task, feedback, taskindex + 1);
}

//形成info_email的规则：从task1开始，先将taskemail加进数组，再将feedback加入数组，由于同一taskid可能有多封feedback，所以用递归算法找出符合的feedback
function testFeedback(feedback, index, taskid) {
    if (typeof (feedback[index]) === 'undefined') {
        return 0;
    }
    if (feedback[index]['taskid'] < taskid) {
        testFeedback(feedback, index + 1, taskid);
        return 0;
    }
    if (feedback[index]['taskid'] == taskid) {
        info_email.push(feedback[index]);
        testFeedback(feedback, index + 1, taskid);
        return 0;
    }
    if (feedback[index]['taskid'] > taskid) {
        return 0;
    }
}

//用获得数据生成依赖数据的界面，依赖于initialize()取得的数据
function createUI() {
    //生成各列表
    shareListData();
    reportAttachmentData();
    checkAndCreate();
    //createEmailTable('emailtable', info_email, 'emailtbody');
    createHomeworkTable(info_report, 'homeworktbody');
    urlList();
    //聊天室名字
    document.getElementById('chatroom_headline').innerHTML = 'NO.' + info_user['groupid'] + '小组聊天室';
    //填写抄送一栏的内容
    /*
    var str = info_group['username'][0];
    for (var j = 1; j < groupstunumber; j++) {
        str += ';' + info_group['username'][j];
    }
    document.getElementById("r_copy").innerHTML = '抄送:' + str;
    */
    //填写收件人，右上角登录用户名
    document.getElementById('user').innerHTML = info_user['username'];
    //document.getElementById('r_receiver').innerHTML='收件人:'+info_user['username'];
    document.getElementById('s_receiver').innerHTML = '收件人:' + info_user['username'];
}

//控制收件列表邮件相关信息显示
function emailUI(type) {
    console.log('emailUI');
    document.getElementById('sender').style.display = "block";
    document.getElementById('r_receiver').innerHTML = '收件人:' + info_user['username'];
    if (type == 'feedback') {
        document.getElementById("r_copy").innerHTML = '';
    } else if (type == 'task') {
        //填写抄送一栏的内容
        var str = info_group['username'][0];
        for (var j = 1; j < groupstunumber; j++) {
            str += ';' + info_group['username'][j];
        }
        document.getElementById("r_copy").innerHTML = '抄送:' + str;
    }

}

//轮询取得新收到的邮件
function getNewEmail() {
    maxEmailTimeStamp = info_email[info_email.length - 1]['timeStamp'];
    $.ajax({
        url: "new_email.php",
        data: {sid: sid, maxtimestamp: maxEmailTimeStamp},
        success: function (data) {
            var info = JSON.parse(data);
            //getdata记录本次是否获查询到了新邮件
            var getdata = 0;
            if (typeof (info['feedback'][0]['content']) != 'undefined') {
                info_email.push(info['feedback'][0]);
                //提醒未读消息
                var subject = 'RE:Report' + info['feedback'][0]['taskid'] + '<br/>' + info['feedback'][0]['timeStamp'];
                spop(subject);
                getdata = 1;
            }
            //取得当前已获得的最后一封taskemail
            var lasttaskemail = getLastTaskEmail(info_email.length - 1);
            var lasttimestamp = lasttaskemail['timeStamp'];
            //比较接收的taskemail更新时间与当前的最后一封taskemail是否相同，若不同说明收到了新taskemail
            if (info['task'][0]['timeStamp'] != lasttimestamp) {
                taskidnow += 1;
                info['task'][0]['taskid'] = taskidnow;
                info_email.push(info['task'][0]);
                //提醒未读消息
                subject = 'task' + taskidnow + '<br/>' + info['task'][0]['timeStamp'];
                spop(subject);
                getdata = 1;
            }
            if (getdata) {
                if(taskidnow==TASKNUM){
                    checkAndCreate()
                }else{
                    checkEvaluation();
                    hideButton('response');
                    //刷新收件和发件列表
                    createEmailTable('emailtable', info_email, 'emailtbody');
                }



                createHomeworkTable(info_report, 'homeworktbody');
                urlList();
            }

        }
    });
}

//利用递归算法找出info_email中taskid最大的taskemail，参数index为info_email的最后一个索引，即从数组最后一项开始向前检查
//参数：info_email的最后一个索引
function getLastTaskEmail(index) {
    //如果[content]未定义，说明这是任务邮件
    if (typeof(info_email[index]['content']) == 'undefined') {
        return info_email[index];
    }
    else {
        return getLastTaskEmail(index - 1);
    }
}

//初始化信息后，第一次生成pop提醒，依赖initialize()取得的数据，pop提醒在点击查看邮件后才会关闭对这封邮件的提醒（更改数据库），只关闭气泡，下次登录仍会提醒
//参数：initialize获得的feedback，task数组
function reminder(feedback, task) {
    for (var i = 0; i < feedback.length; i++) {
        if (feedback[i]['checked'] == 0) {
            var subject = 'RE:Report' + feedback[i]['taskid'] + '<br/>' + feedback[i]['timeStamp'];
            spop(subject);
        }
    }
    if (task['checked'] == 0) {
        //最后一封任务邮件的索引，task数组中有checked索引所以多减一
        var index = taskidnow - 1;
        var timeStamp = task[index]['timeStamp'];
        var taskid = index + 1;
        subject = 'task' + taskid + '<br/>' + timeStamp;
        spop(subject);
    }
}

//更新在线用户列表
function updateGetOnlineuser() {
    $.get("update_get_onlineuser.php", {sid: sid}, function (data) {
        //返回json数据
        var data_array = eval(data);
        var select = document.getElementById('online');
        select.innerHTML = '<option>在线列表</option>';
        var str = "";
        var len = info_group['userid'].length;
        for (var k = 0; k < len - 1; k++) {
            //检查所有同组学生是否在在线的清单中
            var option = document.createElement('option');
            if (jQuery.inArray(info_group['userid'][k], data_array['userid']) != -1) {
                str = info_group['username'][k] + '(在线）<br/>';
            } else {
                str = info_group['username'][k] + '<br/>';
            }
            option.innerHTML = str;
            select.appendChild(option);
        }
        //检查tutor是否在在线清单中
        option = document.createElement('option');
        if (jQuery.inArray(info_group['userid'][len - 1], data_array['userid']) != -1) {
            str = '导师&nbsp' + '张华' + '(在线）';
        } else {
            str = '导师&nbsp' + '张华';
        }
        option.innerHTML = str;
        select.appendChild(option);
    })
}

//-----------------功能小函数----------------------------------------------
//在本地保存草稿，实质是用发件箱输入的内容更新info_report最后一封邮件的['content]
function saveDraftLocal() {
    info_report[info_report.length - 1]['content'] = $.trim(document.getElementById("sendemail").value);
}

//获取get传值的方法,（利用正则表达式从链接中获取）
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//隐藏按钮(实际上可以隐藏任意元素）
function hideButton(id) {
    document.getElementById(id).style.display = 'none';
}

//隐藏发件箱所有按钮
function hideAllButton() {
    hideButton('提交作业');
    hideButton('addfile');
    hideButton('save');
    hideButton('upload')
}

//显示按钮
function showButton(id) {
    document.getElementById(id).style.display = 'inline';
}

//显示发件箱所有按钮
function showAllButton() {
    showButton('提交作业');
    showButton('addfile');
    showButton('save');
    showButton('upload')
}

//计算类型为object的数组的长度
function objectLength(obj) {
    var arr = Object.keys(obj);
    return arr.length;
}

//-----------------发件箱部分----------------------------------------------
//提交作业到后台写入数据库的函数
function submitHomework() {
    //获取上传的文件的文件名，按顺序加进info_report数组（此处的存储可能并没用到）
    var input_arr = document.getElementById('upload').children;
    var len = info_report.length;
    for (var i = 0; i < input_arr.length; i++) {
        if (input_arr[i].files != null && typeof (input_arr[i].files[0]) != 'undefined') {
            var name = input_arr[i].files[0].name;
            info_report[len - 1]['urlname'].push(name);
        }
    }
    hideAllButton();
    saveDraftLocal();

    //获取发件内容
    var text = document.getElementById("sendemail").value;
    text=n2t(text);
    //获取上传文件的表单元素
    var fileform = document.getElementById('upload');
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(fileform);
    document.getElementById('upload').innerHTML = '';
    formdata.append('sid', sid);
    formdata.append('text', text);
    formdata.append('evaluation', evaluation);
    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText)
            info_report[info_report.length - 1]['url'] = JSON.parse(xhr.responseText);
            //将evaluationchange置为1，保证checkevaluation（）会查询数据库
            console.log('subm suc')
            evaluationchange = 1;
            checkHomeworkEvaluation();
            reportAttachmentData();
        }
    };
    xhr.open('post', './student_submit_homework.php');
    xhr.send(formdata);

}

//向数据库保存草稿
function saveDraft() {
    //如果发件箱页面最后点击的是可编辑的发件（当前任务），直接从输入框中获得内容
    if (lastclick == 'last') {
        var text = $.trim(document.getElementById("sendemail").value);
    }
    //如果发件箱页面最后点击的是以前的发件（非当前任务），从info_report中获得内容，
    //（编辑完当前report，再点击查看之前的report内容时，会用saveDraftLocal（）将当前report保存到info_report）
    else {
        text = info_report[info_report.length - 1]['content']
    }
    //如果是不需保存的情况则不保存，及输入为空或为自动显示的默认信息
    if (text != '' && text != '作业待教师批改' && text != '您的作业已通过，等待小组其他成员通过后系统将下发下一个任务' && text != '请输入作业内容') {
        console.log('saveDraft()');
        console.log(text);
        $.get("save_draft.php", {sid: sid, text: text, taskidnow: taskidnow}, function (data) {
        })
    }
}

//根据作业批改状态显示相应内容（这个函数功能过于耦合，将查询评价与显示作业内容混在了一起，应重构拆分）
function checkHomeworkEvaluation() {
    //如果作业批改状态并无改变的可能性，不查询数据库，查看本地记录的状态
    if (evaluationchange == 0) {
        var submitbutton = document.getElementById('提交作业');
        //发件内容输入区
        var textarea = document.getElementById('sendemail');
        if (evaluation == '未提交' || evaluation == '待修改') {
            var content = info_report[info_report.length - 1]['content'];
            showAllButton();
            if (content != '') {
                textarea.value = content;
            }
            else {
                textarea.value = "请输入作业内容";
            }
            textarea.removeAttribute('readonly');
            submitbutton.removeAttribute('disabled');
            return true;
        }
        else if (evaluation == '批改中') {
            content = info_report[info_report.length - 1]['content'];
            textarea.value = content;
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');
        }
        else if (evaluation == '通过') {
            content = info_report[info_report.length - 1]['content'];
            textarea.value = content;
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');

        }
        //查询客户端信息后直接结束，不查数据库
        return;
    }
    //向数据库查询作业评价状态
    $.get("get_homework_evaluation.php", {sid: sid}, function (data) {
        evaluationchange = 0;
        evaluation = eval(data);
        var submitbutton = document.getElementById('提交作业');
        var textarea = document.getElementById('sendemail');
        if (evaluation == '未提交' || evaluation == '待修改') {
            showAllButton();
            var content = info_report[info_report.length - 1]['content'];
            if (content != '' && content != "作业待教师批改") {
                textarea.value = content;
            }
            else {
                textarea.value = "请输入作业内容";
            }
            textarea.removeAttribute('readonly');
            submitbutton.removeAttribute('disabled');
            return true;
        }
        else if (evaluation == '批改中') {
            textarea.setAttribute('readonly', 'readonly');
            content = info_report[info_report.length - 1]['content'];
            textarea.value = content;
            submitbutton.setAttribute('disabled', 'disabled');
        }
        else if (evaluation == '通过') {
            content = info_report[info_report.length - 1]['content'];
            textarea.value = content;
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');
        }
        return false;
    })
}

//向数据库查询作业批改状态
function checkEvaluation() {
    $.get("get_homework_evaluation.php", {sid: sid}, function (data) {
        evaluationchange = 0;
        evaluation = eval(data);
    })
}

//查询作业批改状态，得到结果后创建emailtable
function checkAndCreate() {
    $.get("get_homework_evaluation.php", {sid: sid}, function (data) {
        evaluationchange = 0;
        evaluation = eval(data);
        hideButton('response');
        //刷新收件和发件列表
        createEmailTable('emailtable', info_email, 'emailtbody');
    })
}

//-----------------收件箱部分----------------------------------------------
//如果当前有未创建的report，创建并跳转到发件箱，若无则只跳转
function createAndJump() {
    createReport();
    //模拟点击发件箱->最后一封邮件
    document.getElementById('sendbox').click();
    document.getElementById('lastreport').click();
}

//创建新report
function createReport() {
    //如果有未创建的report才会创建（收到新任务邮件后第一点击回复邮件按钮时）
    if (info_report.length < taskidnow) {
        //在info_report中添加这个report的信息
        var report = [];
        report['content'] = '';
        report['urlname'] = [];
        report['url'] = [];
        info_report.push(report);
        //刷新发件列表
        createHomeworkTable(info_report, 'homeworktbody');
        showAllButton();
        $.ajax({
            url: "create_report.php",
            data: {sid: sid, taskidnow: taskidnow},
            success: function (data) {
                console.log('createReport():' + data)
            }
        });
    }
}

//-----------------列表部分----------------------------------------------
//生成表格的tbody
function prepareTable(parent, tablename, tbodyid) {
    var child = document.getElementById(tablename);
    if (child) {
        parent.removeChild(child);
    }

    var table = document.createElement("table");
    table.id = tablename;
    table.rules = 'rows';
    parent.appendChild(table);
    //生成表头（似乎没用到）
    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    tbody.id = tbodyid;
    return (tbody);
}

//准备所有表格的tbody
function prepareAllTable() {
    var email = document.getElementById("emaillist");
    prepareTable(email, 'emailtable', 'emailtbody');
    var urldiv = document.getElementById("urllist");
    prepareTable(urldiv, 'urltable', 'urltbody');
    var homeworkdiv = document.getElementById("homeworklist");
    prepareTable(homeworkdiv, 'homeworktable', 'homeworktbody');
}

//生成发件列表
function createHomeworkTable(datas, tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML = '';
    var len = datas.length;
    //第一封邮件还未创建时直接返回
    if (len == 0) {
        return;
    }
    //如果收到了一封新的任务邮件，但还没有创建对应的report，此时所有的按钮都应为
    if (info_report.length < taskidnow) {
        for (var i = 0; i < len; i++) {
            //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
            (function () {
                //新建一行
                var tr = document.createElement("tr");
                var hr = document.createElement('hr');
                tr.appendChild(hr);
                tbody.appendChild(tr);
                var td = document.createElement("td");
                td.setAttribute('class', 'homeworkentry');
                //td.setAttribute('class','homeworkentry');
                var taskid = i + 1;
                //规避闭包带来的问题
                var content = datas[i]['content'];
                td.setAttribute('index', i);
                td.innerHTML = 'report' + taskid;
                tr.appendChild(td);
                //设置点击展示邮件内容的功能
                td.onclick = function () {
                    //处理邮件链接
                    var urldiv = document.getElementById('attach');
                    urldiv.innerHTML = '';
                    var index = this.getAttribute('index');
                    //处理邮件文本内容
                    var textarea = document.getElementById("sendemail");
                    if (lastclick == 'other') {
                        textarea.value = content;
                        document.getElementById("s_title").innerHTML = '主题:' + info_pro[index]['taskname'];
                    }
                    else if (lastclick == 'last') {
                        //此处保存草稿的目的存疑，感觉可能导致bug
                        saveDraftLocal();
                        textarea.value = content;
                        document.getElementById("s_title").innerHTML = '主题:' + info_pro[index]['taskname'];
                    }
                    hideButton('提交作业');
                    hideButton('addfile');
                    hideButton('save');
                    if (lastclick == 'last') {
                        textarea.setAttribute('readonly', 'readonly')
                    }
                    var url_arr = info_report[index]['url'];
                    var urlname_arr = info_report[index]['urlname'];
                    for (var k = 0; k < url_arr.length; k++) {
                        var a = document.createElement('a');
                        a.href = url_arr[k];
                        a.download = urlname_arr[k];
                        var node = document.createTextNode(urlname_arr[k]);
                        a.appendChild(node);
                        urldiv.appendChild(a);
                        urldiv.innerHTML += '&nbsp&nbsp&nbsp';
                    }

                    lastclick = 'other';
                }
            })(i);
        }
        colorchange('homeworkentry');
        lastclick = 'other';
    }
    else {  //无未创建的report
        //处理最后一项以外的项
        for (i = 0; i < len - 1; i++) {
            //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
            (function () {
                //新建一行
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                var td = document.createElement("td");

                var taskid = i + 1;
                //规避闭包带来的问题
                var content = datas[i]['content'];
                td.setAttribute('index', i);
                td.innerHTML = 'report' + taskid;
                tr.appendChild(td);
                //设置点击展示邮件内容的功能
                td.onclick = function () {
                    //处理邮件链接
                    //var urldiv=document.getElementById('upload');
                    var urldiv = document.getElementById('attach');
                    urldiv.innerHTML = '';
                    document.getElementById('upload').innerHTML = '';

                    var index = this.getAttribute('index');
                    //处理邮件文本内容
                    var textarea = document.getElementById("sendemail");
                    if (lastclick == 'other') {
                        textarea.value = content;
                        document.getElementById("s_title").innerHTML = '主题:' + info_pro[index]['taskname'];

                    }
                    else if (lastclick == 'last') {
                        saveDraftLocal();
                        textarea.value = content;
                        document.getElementById("s_title").innerHTML = '主题:' + info_pro[index]['taskname'];
                    }
                    hideButton('提交作业');
                    hideButton('addfile');
                    hideButton('save');
                    if (lastclick == 'last') {
                        textarea.setAttribute('readonly', 'readonly')
                    }
                    var url_arr = info_report[index]['url'];
                    var urlname_arr = info_report[index]['urlname'];
                    urldiv.innerHTML = '';
                    console.log('make finish');
                    for (var k = 0; k < url_arr.length; k++) {
                        var a = document.createElement('a');
                        a.href = url_arr[k];
                        a.download = urlname_arr[k];
                        var node = document.createTextNode(urlname_arr[k]);
                        a.appendChild(node);
                        console.log(typeof urldiv);
                        urldiv.appendChild(a);
                        urldiv.innerHTML += '&nbsp&nbsp&nbsp';
                    }

                    lastclick = 'other';
                }
            })(i);
        }
        //处理最后一项
        i = len - 1;
        var index = i;
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var td = document.createElement("td");
        var taskid = i + 1;
        var content = datas[i]['content'];
        td.innerHTML = 'report' + taskid;
        //仅给最后一个report设置id（可能未用到）
        td.id = 'lastreport';
        tr.appendChild(td);
        //设置点击展示邮件内容的功能
        td.onclick = function () {
            if (lastclick == 'other') {
                document.getElementById('attach').innerHTML = '';
                console.log('last clear');
                document.getElementById("s_title").innerHTML = '主题:' + info_pro[i]['taskname'];
            }
            checkHomeworkEvaluation();
            if (evaluation != '待修改') {
                var urldiv = document.getElementById('attach');
                urldiv.innerHTML = '';
                var url_arr = info_report[index]['url'];
                var urlname_arr = info_report[index]['urlname'];
                for (var k = 0; k < url_arr.length; k++) {
                    var a = document.createElement('a');
                    a.href = url_arr[k];
                    a.download = urlname_arr[k];
                    var node = document.createTextNode(urlname_arr[k]);
                    a.appendChild(node);
                    //console.log(typeof urldiv);
                    urldiv.appendChild(a);
                    //插入空格
                    urldiv.innerHTML += '&nbsp&nbsp&nbsp';
                }
            }
            lastclick = 'last';
        };
        colorchange('homeworkentry');
        lastclick = 'other';
    }
}

//利用递归算法找出info_email中taskid最大的taskemail，参数index为info_email的最后一个索引，即从数组最后一项开始向前检查,返回值为taskemail的索引
function getLastTaskEmailIndex(index) {
    //content无定义的是taskemail
    if (typeof(info_email[index]['content']) == 'undefined') {
        return index;
    }
    else {
        return getLastTaskEmailIndex(index - 1);
    }
}


//将文本中的网址替换为超链接
function replaceurl(str) {
    var re=/(###)([^ ]+)/g;
    str=str.replace(re,"<a href=\'$2\'>$2</a>");
    console.log(str);
    return str;
}

//生成系统和教师邮件列表的函数
function createEmailTable(parent, datas, tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML = '';
    //取得最后一封taskemail的索引，这个索引及其之后的邮件会绑定显示‘回复邮件’按钮的功能
    var index = getLastTaskEmailIndex(info_email.length - 1);
    //如果已到达最后一个任务，且不需要回复
    console.log("createEmailTable:evaluation : "+evaluation)
    if(datas[index]['taskid']==TASKNUM && (evaluation=='通过' || evaluation=='批改中')){
        index=datas.length;
    }
    for (var i = 0; i < index; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td = document.createElement("td");
            td.setAttribute('class', 'emailentry');

            var taskid = datas[i]['taskid'];
            var timeStamp = datas[i]['timeStamp'];
            //taskemail
            if (typeof(info_email[i]['content']) == 'undefined') {
                title = info_pro[taskid - 1]['taskname'] + '<br>' + timeStamp;
                var content = '<p>' + info_user['username'] + ',你好！' + '</p>';
                //应读取的info_pro数组的索引是taskid-1
                var proind = taskid - 1;
                content += '<p>' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + info_pro[proind]['backgroundinfo'] + '</p>';
                content += '<p style="z-index:999">' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + replaceurl(info_pro[proind]['taskreq']) + '</p>';
                //  content += '<p style="z-index:999">' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + info_pro[proind]['taskreq']+ '</p>';
                content += '<p>' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + info_pro[proind]['deadline'] + '</p>';
                content += '<p align="right">祝好！</p>';
                content += '<p align="right">张华&nbsp&nbsp&nbsp&nbsp</p>';
                td.id = 'taskemail' + taskid

            }
            //feedback
            else {
                var title = 'RE:Report' + taskid + '<br>' + timeStamp;
                content = '<p>' + info_user['username'] + ',你好！' + '</p>';
                content +=formatTextInHtml( datas[i]['content']);

            }

            td.innerHTML = title;
            tr.appendChild(td);
            td.setAttribute('listindex', i);
            td.onclick = function () {
                hideButton('response');
                var index = this.getAttribute('listindex');
                //如果邮件未读，点击时置为已读
                if (typeof (info_email[index]['checked']) !== 'undefined' && info_email[index]['checked'] == 0) {
                    //任务邮件情况
                    if (typeof (info_email[index]['content']) == 'undefined') {
                        checkTaskemail();
                        info_email[index]['checked'] = 1;

                    }
                    //feedback情况
                    else {
                        checkFeedback(taskid);
                        info_email[index]['checked'] = 1;

                    }
                }
                //重置邮件附件资源
                var div = document.getElementById('shoujianurl');
                div.innerHTML = '';
                //任务邮件情况，显示附件链接
                if (typeof (info_email[index]['content']) == 'undefined') {
                    console.log('before emailui')
                    emailUI('task');
                    var len = info_pro[taskid - 1]['url'].length;
                    for (var k = 0; k < len; ++k) {
                        (function () {
                            var href = info_pro[taskid - 1]['url'][k];
                            console.log('taskid')
                            console.log(taskid)
                            var a = document.createElement('a');

                            var textnode = document.createTextNode(info_pro[taskid - 1]['intro'][k]);
                            a.appendChild(textnode);

                            a.onclick = function (ev) {
                                var target = document.getElementById('ziyuan');
                                target.click();
                                PDFObject.embed(href, "#pdf")
                            }

                            div.appendChild(a);
                        })(k)
                    }
                }
                //feedback情况
                else {
                    emailUI('feedback');
                }
                document.getElementById("receiveemail").innerHTML = content;
                $.get("read_task_log.php", {sid: sid, taskid: taskid}, function (data) {
                });
                document.getElementById("r_title").innerHTML = '主题:' + info_pro[taskid - 1]['taskname'];
                document.getElementById('r_time').innerHTML = '时间:' + timeStamp;

            }
        })(i)
    }
    for (i = index; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td = document.createElement("td");
            td.setAttribute('class', 'emailentry');
            var taskid = datas[i]['taskid'];
            var timeStamp = datas[i]['timeStamp'];
            //taskemail
            if (typeof(info_email[i]['content']) == 'undefined') {
                title = info_pro[taskid - 1]['taskname'] + '<br>' + timeStamp;
                var content = '<p>' + info_user['username'] + ',你好！' + '</p>';
                //应读取的info_pro数组的索引是taskid-1
                var proind = taskid - 1;
                content += '<p>' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + info_pro[proind]['backgroundinfo'] + '</p>';
               // content += '<p style="z-index:999">' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + info_pro[proind]['taskreq'] + '</p>';
                content += '<p style="z-index:999">' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + replaceurl(info_pro[proind]['taskreq']) + '</p>';
                content += '<p>' + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + info_pro[proind]['deadline'] + '</p>';
                content += '<p align="right">祝好！</p>';
                content += '<p align="right">张华&nbsp&nbsp&nbsp&nbsp</p>';
                td.id = 'taskemail' + taskid;
            }
            //feedback
            else {
                var title = 'RE:Report' + taskid + '<br>' + timeStamp;
                content = '<p>' + info_user['username'] + ',你好！' + '</p>';
                content += formatTextInHtml(datas[i]['content']);

            }

            td.innerHTML = title;
            tr.appendChild(td);
            td.setAttribute('listindex', i);
            td.onclick = function () {
                showButton('response');
                var index = this.getAttribute('listindex');
                if (typeof (info_email[index]['checked']) !== 'undefined' && info_email[index]['checked'] == 0) {
                    //任务邮件情况
                    if (typeof (info_email[index]['content']) == 'undefined') {
                        checkTaskemail();
                        info_email[index]['checked'] = 1;
                        console.log('before emailui')
                        emailUI('task');
                    }
                    //feedback情况
                    else {
                        checkFeedback(taskid);
                        info_email[index]['checked'] = 1;
                        emailUI('feedback');
                    }
                }
                //重置邮件附件资源
                var div = document.getElementById('shoujianurl');
                div.innerHTML = '';

                //任务邮件情况，显示附件链接
                if (typeof (info_email[index]['content']) == 'undefined') {
                    console.log(5)
                    var len = info_pro[taskid - 1]['url'].length;
                    console.log('url count:'+len)
                    for (var k = 0; k < len; ++k) {
                        (function () {
                            var href = info_pro[taskid - 1]['url'][k];
                            var a = document.createElement('a');
                            var textnode = document.createTextNode(info_pro[taskid - 1]['intro'][k]);

                            a.appendChild(textnode);

                            a.id = k;
                            a.onclick = function (ev) {
                                var target = document.getElementById('ziyuan');
                                target.click();
                                PDFObject.embed(href, "#pdf")
                            }
                            /*
                            console.log('after add onclick')
                            console.log('a')
                            console.log(a)
                            console.log('a.onclick')
                            console.log(a.onclick)*/
                            div.appendChild(a);
                        })(k)
                    }
                    emailUI('task');
                }
                //feedback
                else {
                    emailUI('feedback');
                }
                document.getElementById("receiveemail").innerHTML = content;
                $.get("read_task_log.php", {sid: sid, taskid: taskid}, function (data) {
                });

                document.getElementById("r_title").innerHTML = '主题:' + info_pro[taskid - 1]['taskname'];

                document.getElementById('r_time').innerHTML = '时间:' + timeStamp;

            }
        })(i)
    }
    colorchange('emailentry')
}

//处理生成资源列表所需的数据结构
function urlList() {
    var url_arr = [];
    url_arr['intro'] = [];
    url_arr['url'] = [];
    //因历史原因，将数组的结构变换一下
    for (var i = 0; i < taskidnow; i++) {
        for (var k = 0; k < info_pro[i]['intro'].length; k++) {
            url_arr['intro'].push(info_pro[i]['intro'][k]);
            info_pro[i]['url'][k] = 'xml_attachment/' + info_pro[i]['url'][k].trim();
            url_arr['url'].push(info_pro[i]['url'][k])
        }
    }
    createUrlTable(url_arr, 'urltbody');


}

//生成资源列表
function createUrlTable(datas, tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML = '';
    //创建‘邮件n'的单元列
    for (var i = 0; i < datas['url'].length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);

            //设置新建的td元素
            var display = document.createElement("td");

            //处理显示的资源主题
            var href = datas['url'][i];
            var hreftag = document.createElement('a');
            hreftag.setAttribute('class', 'urlentry');
            var node = document.createTextNode(datas['intro'][i]);
            hreftag.appendChild(node);

            display.appendChild(hreftag);
            hreftag.onclick = function (ev) {
                PDFObject.embed(href, "#pdf")
            };

            tr.appendChild(display);
        })(i)
    }
    colorchange('urlentry');
}

//将taskemail置为已读
function checkTaskemail() {
    $.ajax({
        url: "check_taskemail.php",
        data: {sid: sid},
        success: function (data) {
        }
    });
}

//将feedback置为已读
function checkFeedback(taskid) {
    $.ajax({
        url: "check_feedback.php",
        data: {sid: sid, taskid: taskid},
        success: function (data) {
        }
    });
}

//为列表项设置点击变色功能
function colorchange(classname) {
    /*console.log("." + classname)
    console.log($("." + classname))
    console.log(document.getElementsByClassName(classname))*/
    $("." + classname).click(function () {
        $("." + classname).css("color", "black");
        $(this).css("color", "blue");
    });
}

//-----------------上传附件部分----------------------------------------------
function addInput(parentid) {
    if (attachnum > 0) {
        var attach = attachname + attachnum;
        if (createInput(attach, parentid))
            attachnum = attachnum + 1;
    }
}

function createInput(nm, parentid) {
    var aElement = document.createElement("input");
    aElement.name = nm;
    aElement.id = nm;
    aElement.type = "file";
    aElement.size = "50";
    var deleteinput = document.createElement('input');
    deleteinput.size = "50";
    deleteinput.type = 'button';
    deleteinput.value = '删除';
    deleteinput.setAttribute('targetid', nm);
    deleteinput.onclick = function (ev) {
        var targetid = this.getAttribute('targetid');
        var target = document.getElementById(targetid);
        target.parentNode.removeChild(target);
        this.parentNode.removeChild(this);
    };
    if (document.getElementById(parentid).appendChild(aElement) == null || document.getElementById(parentid).appendChild(deleteinput) == null)
        return false;
    return true;
}


//-----------------聊天室部分----------------------------------------------

//显示聊天内容的函数
function showmessage() {
    //ajax请求
    if(!LASTCHATAJAXEND){
        return;
    }else{
        LASTCHATAJAXEND=false;
    }
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            LASTCHATAJAXEND=true;
            // 将获取到的字符串存入data变量
            eval('var data = ' + ajax.responseText);
            // 遍历data数组，把内部的信息一个个的显示到页面上
            var username = info_user['username'];
            var s = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].username == username) {
                    s+='<p class="userchatname" >'+data[i].username+'</p>'+'<br>';
                    s += '<p class="userchattime">' + "<<< (" + data[i].timeStamp + ")" + '<p/>' ;
                    s += "<p class='userbox'>";
                    s+=formatTextInHtml(data[i].content);
                    s += "</p>";
                }
                else {
                    if(data[i].username=='张华'){
                        s+='<p class="tutorchatname" >'+data[i].username+'</p>'+'<br>'
                    }else{
                        s+='<p class="otherchatname" >'+data[i].username+'</p>'+'<br>';
                    }
                    //s+='<p class="otherchatname" >'+data[i].username+'</p>'+'<br>';
                    s += '<p class="otherchattime">' + "(" + data[i].timeStamp + ") >>>" + '<p/>' ;

                    //s += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + "(" + data[i].timeStamp + ") >>>" ;
                    s += "<p class='otherbox'>";
                    s += formatTextInHtml(data[i].content);
                    s += "</p>";
                }

            }
            //记录最大的timeStamp
            if (data.length !== 0) {
                maxChattimeStamp = data[data.length - 1].timeStamp;
            }
            // 显示聊天内容
            var showmessage = document.getElementById("up");
            showmessage.innerHTML += s;
            //自动滚动功能
            if (chatautoflow == 1) {
                autoflow('up');
            }
        }
    };
    ajax.open('get', './chatroom.php?maxtimeStamp=' + maxChattimeStamp + '&sid=' + sid);
    ajax.send(null);
}

//替换换行符为<br>等html格式化
function formatTextInHtml(str) {
    var re=/\n/g;
    str=str.replace(re,"<br>");
    re=/&/g;
    str=str.replace(re,"<br>");
    re=/ /g;
    str=str.replace(re,"&nbsp");
    return str;
}
//发送聊天消息的函数

function send() {
    var msg=document.getElementById("msg").value;
    msg=n2t(msg);
    //自动清空输入框
    document.getElementById("msg").value = "";
    $.ajax({
        url:  './chatroom_insert.php',
        data: {sid: sid,msg:msg},
        type:"POST",
        success: function (data) {
        }
    })
}

//调用使聊天室右侧滑块滚动至最下方的函数
function autoflow(id) {
    var target = document.getElementById(id);
    target.scrollTop = target.scrollHeight - target.style.height;
}

//改变聊天室自动滚动状态
function changeAutoflow() {
    if (chatautoflow == 1) {
        chatautoflow = 0;
        document.getElementById('autocontrol').value = '自动滚动';
    }
    else {
        chatautoflow = 1;
        document.getElementById('autocontrol').value = '停止自动滚动';
    }
}
//发送消息前将\n替换为\t
function n2t(str) {
    var re=/\n/g;
    str=str.replace(re,"&");
    return str;
}
//-----------------资源共享页面----------------------------------------------
//提交分享文件
function submitShareFile() {
    var fileform = document.getElementById('share_upload');
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(fileform);
    formdata.append('sid', sid);

    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            fileform.innerHTML = '上传文件';
        }
    };
    xhr.open('post', 'share_file.php');
    xhr.send(formdata);
}

//从后台获取分享列表的数据（可以用时间戳优化一下，减少返回的数据量）
function shareListData() {
    $.ajax({
        url: 'share_list_data.php',
        data: {sid: sid},
        success: function (data) {
            var info = JSON.parse(data);
            //如果获取到了数据
            if (typeof (info['filename'][0]) != 'undefined') {
                createShareTable(info, 'sharelist')
            }
        }
    })
}

//根据数据创建共享列表
function createShareTable(data, tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML = '小组共享';
    for (var i = 0; i < objectLength(data); i++) {
        (function () {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var filename = data['filename'][i];
            //正则表达式 取得文件扩展名 结果不包含'.'  形如  pdf
            var FileExt = filename.replace(/.+\./, "").toLowerCase();
            var sharefile = data['sharefile'][i];
            var sharetime = data['sharetime'][i];

            var a = document.createElement('a');
            //pdf情况，点击功能为在网页端查看
            //采用了pdf插件（js/pdfboject.min.js,该文件下的某几个文件可能也是插件的一部分)
            if (FileExt == 'pdf') {
                a.onclick = function () {
                    PDFObject.embed(sharefile, "#share_pdf")
                }
            }
            //普通文件点击下载
            else {
                a.href = sharefile;
                a.download = filename;
            }
            var node = document.createElement('span');
            node.innerHTML = filename + '<br/>' + sharetime + '<hr/>';

            a.appendChild(node);
            tr.appendChild(a);
        })(i)
    }
}

//获取历史report的附件的名字和路径
function reportAttachmentData() {
    $.ajax({
        url: 'report_attachment.php',
        data: {sid: sid},
        success: function (data) {
            var info = JSON.parse(data);
            createAttachmentTable(info, 'attachment_history');
        }
    })
}

//根据数据创建历史report附件列表
function createAttachmentTable(data, tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML = '附件历史' + '<br/>';
    console.log('createAttachment')
    console.log(data)
    for (var i = 0; i < objectLength(data['urlname']); i++) {
        (function () {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var filename = data['urlname'][i];
            //正则表达式 取得文件扩展名 结果不包含'.'  形如  pdf
            var FileExt = filename.replace(/.+\./, "").toLowerCase();
            var sharefile = data['url'][i];
            var uploadtime = data['time'][i];
            var shared = data['shared'][i];
            var number = data['number'][i];
            var taskid = data['taskid'][i];
            //创建并设置a标签和文字node
            var a = document.createElement('a');
            if (FileExt == 'pdf') {
                a.onclick = function () {
                    PDFObject.embed(sharefile, "#share_pdf")
                }
            }
            else {
                a.href = sharefile;
                a.download = filename;
            }
            var node = document.createElement('span');
            node.innerHTML = filename + '<br/>' + uploadtime;
            //绑定标签
            a.appendChild(node);
            tr.appendChild(a);
            //创建一键分享按钮
            var button = document.createElement('button');
            button.type = 'button';
            if (shared == 0) {
                button.innerHTML = '分享';
                button.setAttribute('style', "width:60px;height:25px");
                console.log(5)
                button.onclick = function (ev) {
                    console.log('oncluck open')
                    shareAttachment(filename, sharefile, number, taskid);
                    button.innerHTML = '已分享';
                    button.setAttribute('disabled', 'disabled');
                }
            }
            else {
                console.log('no onclick')
                button.setAttribute('style', "width:60px;height:25px");
                button.innerHTML = '已分享';
                button.setAttribute('disabled', 'disabled');
            }
            tbody.appendChild(button);
            //tbody.innerHTML+='<hr/>';
            var hr = document.createElement('hr');
            tbody.appendChild(hr);


        })(i)
    }
}

//分享report附件列表中的附件
function shareAttachment(filename, url, number, taskid) {
    $.ajax({
        url: 'share_attachment.php',
        data: {sid: sid, filename: filename, url: url, taskid: taskid, number: number},
        success: function (data) {
            console.log(data)
        }
    })
}