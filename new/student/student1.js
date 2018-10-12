/*
问题：1.（在线列表）教师重名，应换成更可靠的id
       3.将changelistmood改为changemood
       4.可能可以合并请求来减少请求次数
       6.可以根据新邮件来减少checkhoemworkevaluaion
进度：
*/

//-----------------控制台--------------------
var getEmailInterval=6000;
//小组学生数
var groupstunumber=4;
var getChatmsgInterval=3000;
var updateOnlineInterval=10000;
var shareListInterval=10000;

//-----------------设置变量---------------------
//-----------------信息存储---------------------
//组内教师和学生信息
var info_group=[];
//发出的邮件
var info_report=[];
//用户信息
var info_user=[];
//feedback和taskemail
var info_email=[];
//当前的taskid
var taskidnow;
//feedback未读数
var uncheckedfeedbacknum=0;
//作业评价状态改变的可能性，每次收到新feedback置1，每次checkhomeworkevaluation()后置0,由于可能离线期间收到feedback，登录时默认为1
var evaluationchange=1;
//当前最新report评价
var evaluation='';
//从pro.xml获得的信息
var info_pro=[];

//listMood是下拉栏状态，初始为“主页”
var listMood = "mainmenu";
//sid以get方式传值，从网址中获得参数
var sid = getQueryString("sid");

//-----------------发件箱------------
//记录最后一次点击的发件列表项是否为最后一封,可为'other'和'last'
var lastclick='other';
//记录上一次查询的作业评价状态
var lastevaluation='';
//生成上传按钮部分
var attachname ="attach";
var attachnum=1;
//-----------------收件箱------------
//收件列表邮件的最大时间戳
var maxEmailTimeStamp='1000-01-01 00:00:00';
//-----------------聊天室------------
// 记录当前获取到的聊天消息id的最大值，防止获取到重复的信息
// 服务器只返回maxtimeStamp以后的聊天信息
var maxChattimeStamp='1000-01-01 00:00:00';
var chatautoflow=1;
//-----------------执行部分----------------------------------------------
initialize();
prepareAllTable();
window.onbeforeunload = function(){
    saveDraft();
    return "确认离开？" ;
};
setInterval("getNewEmail()",getEmailInterval);
setInterval("showmessage()", getChatmsgInterval);
setInterval("updateGetOnlineuser()", updateOnlineInterval);
setInterval("shareListData()",shareListInterval);


//-----------------函数定义部分----------------------------------------------
//-----------------获取信息及相应处理----------------------------------------------
//初始所有一开始即可获得的信息,(js控制台中可查看相应的数据结构）
function initialize() {
    $.ajax({ url: "info.php",
        data:{sid:sid},
        success: function (data) {
            console.log(data);
            var info=JSON.parse(data);
            info_group=info['group'];
            info_report=info['report'];
            info_user=info['user'];
            info_pro=info['pro'];
            //减去checked项
            taskidnow=objectLength(info['task'])-1;
            sortEmailarr(info['task'],info['feedback'],0);
            groupstunumber=objectLength(info_group['userid'])-1;

            console.log('group stu num :'+groupstunumber);
            console.log('initialize info');
            console.log(info);
            console.log('info_email');
            console.log(info_email);
            console.log('taskidnow '+taskidnow);

            //feedback从零索引，所以从taskidnow-1开始检查
            countUncheckedFeedback(info['feedback'],taskidnow-1);

            console.log('uncheckedfeedbacknum '+uncheckedfeedbacknum);

            var lasttask=getLastTaskEmail(info_email.length-1);
            lasttask['taskid']=taskidnow;
            lasttask['checked']=info['task']['checked'];

            createUI();
            updateGetOnlineuser();
            reminder(info['feedback'],info['task']);
        }
    });
}
//将接收到的feedback和taskemail数组合并为info_email，按timestamp排序，使用了递归
function sortEmailarr(task,feedback,taskindex) {
    if(typeof (task[taskindex])==='undefined') {
        console.log('sort end');
        return 0;
    }
    info_email.push(task[taskindex]);

    testFeedback(feedback,taskindex,taskindex+1);
    sortEmailarr(task,feedback,taskindex+1);
}
//形成info_email的规则：从task1开始，先将taskemail加进数组，再将feedback加入数组，由于同一taskid可能有多封feedback，所以用递归算法找出符合的feedback
function testFeedback(feedback,index,taskid){
    if(typeof (feedback[index])==='undefined'){
        return 0;
    }
    if(feedback[index]['taskid']<taskid){
        testFeedback(feedback,index+1,taskid);
        return 0;
    }
    if(feedback[index]['taskid']==taskid){
        info_email.push(feedback[index]);
        testFeedback(feedback,index+1,taskid);
        return 0;
    }
    if(feedback[index]['taskid']>taskid){
        return 0;
    }
}
//用获得数据生成依赖数据的界面，依赖于initialize()取得的数据
function createUI() {
    shareListData();
    reportAttachmentData();
    createEmailTable('emailtable',info_email,'emailtbody');
    createHomeworkTable(info_report,'homeworktbody');
    urlList();
    document.getElementById('chatroom_headline').innerHTML='NO.'+info_user['groupid']+'小组聊天室';
    //填写抄送
    var str=info_group['username'][0];
    for(var j=1;j<groupstunumber;j++){
        str+=';'+info_group['username'][j];
    }
    document.getElementById("r_copy").innerHTML='抄送:'+str;
}
//检查未读feedback数目，（好像没用到）
function countUncheckedFeedback(feedback,startindex) {
    for(var i=startindex;i<feedback.length;i++){
        if(feedback[i]['checked']==0){
            uncheckedfeedbacknum+=1;
        }
    }
}
//轮询取得新收到的邮件
function getNewEmail() {
    maxEmailTimeStamp=info_email[info_email.length-1]['timeStamp'];
    $.ajax({ url: "new_email.php",
        data:{sid:sid,maxtimestamp:maxEmailTimeStamp},
        success: function (data) {
            var info=JSON.parse(data);
            console.log(info);
            //getdata记录本次是否获取到了新邮件
            var getdata=0;
            if(typeof (info['feedback'][0]['content'])!='undefined'){
                info_email.push(info['feedback'][0]);
                //提醒未读消息
                var subject='RE:Report'+info['feedback'][0]['taskid']+'<br/>'+info['feedback'][0]['timeStamp'];
                spop(subject);

                getdata=1;

                evaluationchange=1;
                console.log("evaluation change to ");
                console.log(evaluationchange);
            }
            var lasttaskemail=getLastTaskEmail(info_email.length-1);
            var lasttimestamp=lasttaskemail['timeStamp'];
            if(info['task'][0]['timeStamp']!=lasttimestamp){
                taskidnow+=1;
                info['task'][0]['taskid']=taskidnow;
                info_email.push(info['task'][0]);
                //提醒未读消息
                subject='task'+taskidnow+'<br/>'+info['task'][0]['timeStamp'];
                spop(subject);

                getdata=1;
            }
            if(getdata){
                hideButton('response');
                createEmailTable('emailtable',info_email,'emailtbody');
                createHomeworkTable(info_report,'homeworktbody');
                urlList();
                console.log("getNewEmail(): new email comes");
            }
            console.log('info_email');
            console.log(info_email);
        }
    });
}
//利用递归算法找出info_email中taskid最大的taskemail，参数index为info_email的最后一个索引，即从数组最后一项开始向前检查
function getLastTaskEmail(index) {
    if(typeof(info_email[index]['content'])=='undefined'){
        return info_email[index];
    }
    else {
        return getLastTaskEmail(index-1);
    }
}
//初始化信息后，第一次生成提醒，依赖initialize()取得的数据
function reminder(feedback,task) {
    for(var i=0;i<feedback.length;i++){
        if(feedback[i]['checked']==0){
            var subject='RE:Report'+feedback[i]['taskid']+'<br/>'+feedback[i]['timeStamp'];
            spop(subject);
        }
    }
    if(task['checked']==0){
        //最后一封任务邮件的索引，task数组中有checked索引所以多减一
        var index=taskidnow-1;
        var timeStamp=task[index]['timeStamp'];
        var taskid=index+1;
        subject='task'+taskid+'<br/>'+timeStamp;
        spop(subject);
    }
}
//更新在线用户列表
/*function updateGetOnlineuser() {
    $.get("update_get_onlineuser.php", {sid: sid}, function (data) {
        console.log('online user data: ');
        console.log(data);
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        var onlineuserlist_str = "";
        var len=info_group['userid'].length;
        for (var k = 0; k <len-1; k++) {
            if (jQuery.inArray(info_group['userid'][k], data_array['userid']) != -1) {
                onlineuserlist_str += info_group['username'][k] + '(在线）<br/>';
            } else {
                onlineuserlist_str += info_group['username'][k] + '<br/>';
            }
        }
        if (jQuery.inArray(info_group['userid'][len-1], data_array['userid']) != -1) {
            onlineuserlist_str += '导师&nbsp' + '张华' + '(在线）';
        } else {
            onlineuserlist_str += '导师&nbsp' + '张华';
        }
        document.getElementById("在线列表").innerHTML = onlineuserlist_str;
        console.log('online list updated!')
    })
}*/
function updateGetOnlineuser() {
    $.get("update_get_onlineuser.php", {sid: sid}, function (data) {
        console.log('online user data: ');
        console.log(data);
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        var select=document.getElementById('online');
        select.innerHTML='<option>在线列表</option>';
        var str = "";
        var len=info_group['userid'].length;
        for (var k = 0; k <len-1; k++) {
            var option=document.createElement('option');
            if (jQuery.inArray(info_group['userid'][k], data_array['userid']) != -1) {
                str = info_group['username'][k] + '(在线）<br/>';
            } else {
                str = info_group['username'][k] + '<br/>';
            }
            option.innerHTML=str;
            select.appendChild(option);
        }
        option=document.createElement('option');
        if (jQuery.inArray(info_group['userid'][len-1], data_array['userid']) != -1) {
            str = '导师&nbsp' + '张华' + '(在线）';
        } else {
            str = '导师&nbsp' + '张华';
        }
        option.innerHTML=str;
        select.appendChild(option);
        console.log('online list updated!')
    })
}
//-----------------功能小函数----------------------------------------------
//在本地保存草稿，实质是用发件箱输入的内容更新info_report最后一封邮件的['content]
function saveDraftLocal() {
    info_report[info_report.length-1]['content']=$.trim(document.getElementById("sendemail").value);
    console.log('saveDraftLocal');
    console.log('info_report');
    console.log(info_report);
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
    document.getElementById(id).style.display='none';
}
//隐藏发件箱所有按钮
function hideAllButton() {
    hideButton('提交作业');
    hideButton('addfile');
    //hideButton('deletefile');
    hideButton('save');
    hideButton('upload')
}
//显示按钮
function showButton(id) {
    document.getElementById(id).style.display='inline';
}
//显示发件箱所有按钮
function showAllButton(){
    showButton('提交作业');
    showButton('addfile');
    //showButton('deletefile');
    showButton('save');
    showButton('upload')
}
//计算类型为object的数组的长度
function objectLength(obj) {
    var arr=Object.keys(obj);
    return arr.length;
}
//改变当前所在页面（发件箱，收件箱...)的记录，（现在没用到）
function changeListMood(mood) {
    listMood = mood;
}
//改变记录状态的变量，（现在没用到）
function changemood(target,mood) {
    target=mood;
}

//-----------------发件箱部分----------------------------------------------
//提交作业到后台写入数据库的函数
function submitHomework() {
    //先禁用按钮，防止重复提交
    //document.getElementById('提交作业').setAttribute('disabled', 'disabled');

    var input_arr=document.getElementById('upload').children;
    var len=info_report.length;
    for(var i=0;i<input_arr.length;i++){
        if(input_arr[i].files!=null&&typeof (input_arr[i].files[0])!='undefined'){
            var name=input_arr[i].files[0].name;
            info_report[len-1]['urlname'].push(name);
        }
        /*
        if(input_arr[i].value.length){
            var name=input_arr[i].files[0].name;
            info_report[len-1]['urlname'].push(name);
        }*/

    }
    hideAllButton();
    saveDraftLocal();


    var text = document.getElementById("sendemail").value;
    //
    var fileform = document.getElementById('upload');
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(fileform);
    document.getElementById('upload').innerHTML='';

    formdata.append('sid', sid);
    formdata.append('text', text);
    console.log('submithomework evaluation');
    console.log(evaluation);
    formdata.append('evaluation', evaluation);
    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
            //提示区会提示success表示发送成功
            //document.getElementById("result").innerHTML = xhr.responseText;
            info_report[info_report.length-1]['url']=JSON.parse(xhr.responseText);
            console.log('info report: '+info_report);
            console.log('作业提交成功');
            evaluationchange=1;
            checkHomeworkEvaluation();
        }
    };
    xhr.open('post', './student_submit_homework.php');
    xhr.send(formdata);
}
//向数据库保存草稿
function saveDraft() {
    if(lastclick=='last'){
        var text=$.trim(document.getElementById("sendemail").value);
    }
    else{
        text=info_report[info_report.length-1]['content']
    }
    //如果是不需保存的情况则不保存
    if(text!=''&&text!='作业待教师批改'&&text!='您的作业已通过，等待小组其他成员通过后系统将下发下一个任务'&&text!='请输入作业内容'){
        $.get("save_draft.php", {sid:sid,text:text,taskidnow:taskidnow}, function (data) {
            var info = eval(data);
            //alert(info)
        })
    }
}
//根据作业批改状态显示相应内容
function checkHomeworkEvaluation() {
    console.log("check homework eva")
    if(evaluationchange==0){
        console.log('evaluation check escaped');

        var submitbutton = document.getElementById('提交作业');
        var textarea = document.getElementById('sendemail');
        if (evaluation == '未提交' || evaluation == '待修改') {
            var content=info_report[info_report.length-1]['content'];
            showAllButton();
            if(content!=''){
                textarea.value = content;
            }
            else{
                textarea.value = "请输入作业内容";
            }
            textarea.removeAttribute('readonly');
            submitbutton.removeAttribute('disabled');
            return true;
        }
        else if (evaluation == '批改中') {
            //document.getElementById("sendemail").value="作业待教师批改";
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = "作业待教师批改";
            submitbutton.setAttribute('disabled', 'disabled');
        }
        else if (evaluation == '通过') {
            //document.getElementById("sendemail").value="您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.value = "您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');

        }
        return;
    }
    $.get("get_homework_evaluation.php", {sid:sid}, function (data) {
        console.log('check homework evaluation()');
        evaluationchange=0;
        evaluation = eval(data);
        console.log("evaluation: ");
        console.log(evaluation);
        var submitbutton = document.getElementById('提交作业');
        var textarea = document.getElementById('sendemail');
        if (evaluation == '未提交' || evaluation == '待修改') {
            showAllButton();
            var content=info_report[info_report.length-1]['content'];
            if(content!=''&&content!="作业待教师批改"){
                textarea.value = content;
            }
            else{
                textarea.value = "请输入作业内容";
            }
            textarea.removeAttribute('readonly');
            submitbutton.removeAttribute('disabled');
            return true;
        }
        else if (evaluation == '批改中') {
            //document.getElementById("sendemail").value="作业待教师批改";
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = "作业待教师批改";
            submitbutton.setAttribute('disabled', 'disabled');
        }
        else if (evaluation == '通过') {
            //document.getElementById("sendemail").value="您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.value = "您的作业已通过，等待小组其他成员通过后系统将下发下一个任务";
            textarea.setAttribute('readonly', 'readonly');
            submitbutton.setAttribute('disabled', 'disabled');
        }
        return false;
    })
}
//
//-----------------收件箱部分----------------------------------------------
//如果符合条件，创建一封新发件，并跳转到发件箱
function createAndJump() {
    createReport();
    document.getElementById('sendbox').click();
    document.getElementById('lastreport').click();
}
//创建新report
function createReport() {
    if(info_report.length<taskidnow){
        var report=[];
        report['content']='';
        report['urlname']=[];
        info_report.push(report);
        console.log('report created');
        console.log(info_report);
        createHomeworkTable(info_report,'homeworktbody');
        showAllButton();
        $.ajax({ url: "create_report.php",
            data:{sid:sid,taskidnow:taskidnow},
            success: function (data) {
                console.log('report created in database')
            }
        });
    }
}
//-----------------列表部分----------------------------------------------
//生成表格的tbody
function prepareTable(parent,tablename,tbodyid) {
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
    tbody.id=tbodyid;
    return(tbody);
}
//准备所有表格的tbody
function prepareAllTable() {
    var email = document.getElementById("emaillist");
    prepareTable(email,'emailtable','emailtbody');
    var urldiv = document.getElementById("urllist");
    prepareTable(urldiv,'urltable','urltbody');
    var homeworkdiv = document.getElementById("homeworklist");
    prepareTable(homeworkdiv,'homeworktable','homeworktbody');
}
//生成发件列表
function createHomeworkTable(datas,tbodyid){
    var tbody=document.getElementById(tbodyid);
    tbody.innerHTML='';
    var len=datas.length;
    if(len==0){
        return;
    }
    //如果收到了一封新的任务邮件，但还没有创建对应的report
    if(info_report.length<taskidnow){
        console.log('收到了一封新的任务邮件，但还没有创建对应的report');
        for (var i = 0; i < len; i++) {
            //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
            (function () {
                //新建一行
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                var td = document.createElement("td");

                var taskid=i+1;
                //规避闭包带来的问题
                var content=datas[i]['content'];
                td.setAttribute('index',i);
                td.innerHTML = 'report'+taskid;
                tr.appendChild(td);
                //设置点击展示邮件内容的功能
                td.onclick = function () {
                    //处理邮件链接
                    var urldiv=document.getElementById('upload');
                    urldiv.innerHTML='';

                    var index=this.getAttribute('index');
                    //处理邮件文本内容
                    var textarea=document.getElementById("sendemail");
                    if(lastclick=='other'){
                        textarea.value = content;
                        document.getElementById("s_title").innerHTML= '主题:'+info_pro[index]['taskname'];

                    }
                    else if(lastclick=='last'){
                        console.log('onclick savedraft local');
                        saveDraftLocal();
                        textarea.value = content ;
                        document.getElementById("s_title").innerHTML= '主题:'+info_pro[index]['taskname'];
                    }
                    hideButton('提交作业');
                    hideButton('addfile');
                    hideButton('save');
                    if(lastclick=='last'){
                        textarea.setAttribute('readonly','readonly')
                    }
                    var url_arr=info_report[index]['url'];
                    var urlname_arr=info_report[index]['urlname'];
                    console.log('url_arr');
                    console.log(url_arr);
                    console.log('urlname');
                    console.log(urlname_arr);
                    for(var k=0;k<url_arr.length;k++){
                        var a=document.createElement('a');
                        a.href=url_arr[k];
                        a.download=urlname_arr[k];
                        var node = document.createTextNode(urlname_arr[k]);
                        a.appendChild(node);
                        urldiv.appendChild(a);
                    }
                    lastclick='other';
                    console.log('lastclick changed to :'+lastclick);
                }
            })(i);
        }
        lastclick='other';
        console.log('homeworktable created');
    }
    else {  //无未创建的report
        console.log('无未创建的report');
        //处理最后一项以外的项
        for (i = 0; i < len-1; i++) {
            //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
            (function () {
                //新建一行
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                var td = document.createElement("td");

                var taskid=i+1;
                //规避闭包带来的问题
                var content=datas[i]['content'];
                td.setAttribute('index',i);
                td.innerHTML = 'report'+taskid;
                tr.appendChild(td);
                //设置点击展示邮件内容的功能
                td.onclick = function () {
                    //处理邮件链接
                    var urldiv=document.getElementById('upload');
                    urldiv.innerHTML='';

                    var index=this.getAttribute('index');
                    //处理邮件文本内容
                    var textarea=document.getElementById("sendemail");
                    if(lastclick=='other'){
                        textarea.value = content;
                        document.getElementById("s_title").innerHTML= '主题:'+info_pro[index]['taskname'];

                    }
                    else if(lastclick=='last'){
                        console.log('onclick savedraft local');
                        saveDraftLocal();
                        textarea.value = content ;
                        document.getElementById("s_title").innerHTML= '主题:'+info_pro[index]['taskname'];
                    }
                    hideButton('提交作业');
                    hideButton('addfile');
                    hideButton('save');
                    if(lastclick=='last'){
                        textarea.setAttribute('readonly','readonly')
                    }
                    var url_arr=info_report[index]['url'];
                    var urlname_arr=info_report[index]['urlname'];
                    console.log('url_arr');
                    console.log(url_arr);
                    console.log('urlname');
                    console.log(urlname_arr);
                    for(var k=0;k<url_arr.length;k++){
                        var a=document.createElement('a');
                        a.href=url_arr[k];
                        a.download=urlname_arr[k];
                        var node = document.createTextNode(urlname_arr[k]);
                        a.appendChild(node);
                        urldiv.appendChild(a);
                    }
                    lastclick='other';
                    console.log('lastclick changed to :'+lastclick);
                }
            })(i);
        }
        //处理最后一项
        i=len-1;
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var td = document.createElement("td");
        var taskid=i+1;
        var content=datas[i]['content'];
        td.innerHTML = 'report'+taskid;
        //仅给最后一个report设置id
        td.id='lastreport';
        tr.appendChild(td);
        //设置点击展示邮件内容的功能
        td.onclick = function () {
            if (lastclick =='other') {
                document.getElementById('upload').innerHTML='';
                document.getElementById("s_title").innerHTML = '主题:'+info_pro[i]['taskname'];
                //document.getElementById("s_title").innerHTML = 'last report';
            }
            checkHomeworkEvaluation();

            //document.getElementById('sendemail').removeAttribute('readonly');
            lastclick = 'last';
            console.log('lastclick changed to :'+lastclick);
        };

        lastclick='other';
        console.log('homeworktable created');
    }
}
//利用递归算法找出info_email中taskid最大的taskemail，参数index为info_email的最后一个索引，即从数组最后一项开始向前检查,返回值为taskemail的索引
function getLastTaskEmailIndex(index) {
    if(typeof(info_email[index]['content'])=='undefined'){
        return index;
    }
    else {
        return getLastTaskEmailIndex(index-1);
    }
}
//生成系统和教师邮件列表的函数
function createEmailTable(parent,datas,tbodyid) {
    console.log('info_email');
    console.log(info_email);
    var tbody=document.getElementById(tbodyid);
    tbody.innerHTML='';
    //取得最后一封taskemail的索引，这个索引及其之后的邮件会绑定显示‘回复邮件’按钮的功能
    var index=getLastTaskEmailIndex(info_email.length-1);
    //console.log(index)
    for (var i = 0; i < index; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td= document.createElement("td");

            var taskid=datas[i]['taskid'];
            var timeStamp=datas[i]['timeStamp'];
            //taskemail
            if(typeof(info_email[i]['content'])=='undefined'){
                //title=taskname_url_arr[taskid]['taskname']+'\n'+timeStamp;
                /*title=info_pro[taskid-1]['taskname']+'<br>'+timeStamp;
                var content=info_user['username']+',你好！';
                content+=info_pro[i]['backgroundinfo'];
                content+=info_pro[i]['taskreq'];
                content+=info_pro[i]['deadline'];
                content+='\n'+'祝好!'+'\n'+'张华';*/
                title=info_pro[taskid-1]['taskname']+'<br>'+timeStamp;
                //var content=info_user['username']+',你好！';
                var content='<p>'+info_user['username']+',你好！'+'</p>';

                //应读取的info_pro数组的索引是taskid-1
                var proind=taskid-1;
                content+='<p>'+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+info_pro[proind]['backgroundinfo']+'</p>';
                content+='<p>'+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+info_pro[proind]['taskreq']+'</p>';
                content+='<p>'+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+info_pro[proind]['deadline']+'</p>';
                //content+=info_pro[i]['taskreq'];
                //content+=info_pro[i]['deadline'];
                //content+='\n'+'祝好!'+'\n'+'张华';
                content+='<p align="right">祝好！</p>';
                content+='<p align="right">张华&nbsp&nbsp&nbsp&nbsp</p>';
                td.id='taskemail'+taskid
            }
            //feedback
            else
            {
                var title='RE:Report'+taskid+'<br>'+timeStamp;
                content = datas[i]['content'];

            }
            td.innerHTML = title;
            tr.appendChild(td);
            td.setAttribute('listindex',i);
            td.onclick = function () {
                hideButton('response');
                var index=this.getAttribute('listindex');
                if(typeof (info_email[index]['checked'])!=='undefined'&&info_email[index]['checked']==0){
                    //任务邮件情况
                    if(typeof (info_email[index]['content'])=='undefined'){
                        checkTaskemail();
                        info_email[index]['checked']=1;
                    }
                    //feedback情况
                    else{
                        checkFeedback(taskid);
                        info_email[index]['checked']=1;
                    }
                }
                document.getElementById("receiveemail").value = content;
                $.get("read_task_log.php", {sid:sid,taskid:taskid}, function (data) {
                    console.log(data);
                });

                //document.getElementById("r_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                document.getElementById("r_title").innerHTML= '主题:'+info_pro[taskid-1]['taskname'];

                document.getElementById('r_time').innerHTML='时间:'+timeStamp;

            }
        })(i)
    }
    for (i = index; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td= document.createElement("td");

            var taskid=datas[i]['taskid'];
            var timeStamp=datas[i]['timeStamp'];
            //taskemail
            if(typeof(info_email[i]['content'])=='undefined'){
                //title=taskname_url_arr[taskid]['taskname']+'\n'+timeStamp;
                title=info_pro[taskid-1]['taskname']+'<br>'+timeStamp;
                //var content=info_user['username']+',你好！';
                var content='<p>'+info_user['username']+',你好！'+'</p>';
                //应读取的info_pro数组的索引是taskid-1
                var proind=taskid-1;
                content+='<p>'+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+info_pro[proind]['backgroundinfo']+'</p>';
                content+='<p>'+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+info_pro[proind]['taskreq']+'</p>';
                content+='<p>'+'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+info_pro[proind]['deadline']+'</p>';
                //content+=info_pro[i]['taskreq'];
                //content+=info_pro[i]['deadline'];
                //content+='\n'+'祝好!'+'\n'+'张华';
                content+='<p align="right">祝好！</p>';
                content+='<p align="right">张华&nbsp&nbsp&nbsp&nbsp</p>';
                td.id='taskemail'+taskid;
            }
            //feedback
            else
            {
                var title='RE:Report'+taskid+'<br>'+timeStamp;
                content = datas[i]['content'];

            }
            td.innerHTML = title;
            tr.appendChild(td);
            td.setAttribute('listindex',i);
            td.onclick = function () {
                showButton('response');
                var index=this.getAttribute('listindex');
                if(typeof (info_email[index]['checked'])!=='undefined'&&info_email[index]['checked']==0){
                    //任务邮件情况
                    if(typeof (info_email[index]['content'])=='undefined'){
                        checkTaskemail();
                        info_email[index]['checked']=1;
                    }
                    //feedback情况
                    else{
                        checkFeedback(taskid);
                        info_email[index]['checked']=1;
                    }
                }
                //document.getElementById("receiveemail").value = content;
                document.getElementById("receiveemail").innerHTML = content;
                $.get("read_task_log.php", {sid:sid,taskid:taskid}, function (data) {
                    console.log(data);
                });

                //document.getElementById("r_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                document.getElementById("r_title").innerHTML= '主题:'+info_pro[taskid-1]['taskname'];

                document.getElementById('r_time').innerHTML='时间:'+timeStamp;

            }
        })(i)
    }
    /*
    for (var i = 0; i < datas.length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td= document.createElement("td");

            var taskid=datas[i]['taskid'];
            var timeStamp=datas[i]['timeStamp'];
            //taskemail
            if(typeof(info_email[i]['content'])=='undefined'){
                //title=taskname_url_arr[taskid]['taskname']+'\n'+timeStamp;
                title='taskemail'+taskid+'<br>'+timeStamp;
                var content='renwu';
                td.id='taskemail'+taskid
            }
            //feedback
            else
            {
                var title='RE:Report'+taskid+'<br>'+timeStamp;
                content = datas[i]['content'];

            }
            td.innerHTML = title;
            tr.appendChild(td);
            td.setAttribute('listindex',i);
            td.onclick = function () {
                var index=this.getAttribute('listindex');
                if(typeof (info_email[index]['checked'])!=='undefined'&&info_email[index]['checked']==0){
                    //任务邮件情况
                    if(typeof (info_email[index]['content'])=='undefined'){
                        checkTaskemail();
                        info_email[index]['checked']=1;
                    }
                    //feedback情况
                    else{
                        checkFeedback(taskid);
                        info_email[index]['checked']=1;
                    }
                }
                document.getElementById("receiveemail").value = content;
                $.get("read_task_log.php", {sid:sid,taskid:taskid}, function (data) {
                    console.log(data);
                });

                //document.getElementById("r_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                document.getElementById("r_title").innerHTML='taskname';

                document.getElementById('r_time').innerHTML='时间:'+timeStamp;

            }
        })(i)
    }*/
}
//处理生成资源列表所需的数据结构
function urlList() {
    var url_arr = [];
    url_arr['intro'] = [];
    url_arr['url'] = [];
    for (var i = 0; i <taskidnow; i++) {
        for (var k = 0; k < info_pro[i]['intro'].length; k++) {
            url_arr['intro'].push(info_pro[i]['intro'][k]);
            url_arr['url'].push(info_pro[i]['url'][k])
        }
    }
    console.log('url arr prepared');
    console.log(url_arr);
    createUrlTable(url_arr, 'urltbody');


}
//生成资源列表
function createUrlTable(datas, tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML='';
    //创建‘邮件n'的单元列
    for (var i = 0; i < datas['url'].length; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            /*在新创建的行内创建'邮件n'的单元格，附加点击展示邮件内容的功能*/
            //设置新建的td元素
            var display = document.createElement("td");

            //处理显示的邮件主题
            var href = datas['url'][i];
            var hreftag = document.createElement('a');
            var node = document.createTextNode(datas['intro'][i]);
            hreftag.appendChild(node);

            display.appendChild(hreftag);
            hreftag.onclick = function (ev) {
                PDFObject.embed(href, "#pdf")
            };

            tr.appendChild(display);

        })(i)
    }
    console.log('urltable created');

}
//将taskemail置为已读
function checkTaskemail() {
    $.ajax({ url: "check_taskemail.php",
        data:{sid:sid},
        success: function (data) {
            var info=eval(data);
            console.log(info);
        }
    });
}
//将feedback置为已读
function checkFeedback(taskid) {
    $.ajax({ url: "check_feedback.php",
        data:{sid:sid,taskid:taskid},
        success: function (data) {
            var info=eval(data);
            console.log(info);
        }
    });
}
//-----------------上传附件部分----------------------------------------------
function addInput(parentid) {
    if (attachnum > 0) {
        var attach = attachname + attachnum;
        if (createInput(attach,parentid))
            attachnum = attachnum + 1;
    }
}
function createInput(nm,parentid) {
    var aElement = document.createElement("input");
    aElement.name = nm;
    aElement.id = nm;
    aElement.type = "file";
    aElement.size = "50";
    var deleteinput=document.createElement('input');
    deleteinput.size = "50";
    deleteinput.type='button';
    deleteinput.value='删除';
    deleteinput.setAttribute('targetid',nm);
    deleteinput.onclick=function (ev) {
        var targetid=this.getAttribute('targetid');
        var target=document.getElementById(targetid);
        target.parentNode.removeChild(target);
        this.parentNode.removeChild(this);
    };
    if (document.getElementById(parentid).appendChild(aElement) == null||document.getElementById(parentid).appendChild(deleteinput)==null)
        return false;
    return true;
}

/*
function addInput() {
    if (attachnum > 0) {
        var attach = attachname + attachnum;
        if (createInput(attach))
            attachnum = attachnum + 1;
    }
}
function deleteInput() {
    if (attachnum > 1) {
        attachnum = attachnum - 1;
        if (!removeInput())
            attachnum = attachnum + 1;
    }
}
function createInput(nm) {
    var aElement = document.createElement("input");
    aElement.name = nm;
    aElement.id = nm;
    aElement.type = "file";
    aElement.size = "50";
    var deleteinput=document.createElement('input');
    deleteinput.size = "50";
    deleteinput.type='button';
    deleteinput.value='删除';
    deleteinput.setAttribute('targetid',nm);
    deleteinput.onclick=function (ev) {
        var targetid=this.getAttribute('targetid');
        var target=document.getElementById(targetid);
        target.parentNode.removeChild(target);
        this.parentNode.removeChild(this);
    };
    if (document.getElementById("upload").appendChild(aElement) == null||document.getElementById('upload').appendChild(deleteinput)==null)
        return false;
    return true;
}
function removeInput(nm) {
    var aElement = document.getElementById("upload");
    if (aElement.removeChild(aElement.lastChild) == null)
        return false;
    return true;
}
*/

//-----------------聊天室部分----------------------------------------------
//显示聊天内容的函数
function showmessage() {
    //ajax请求
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            // 将获取到的字符串存入data变量
            eval('var data = ' + ajax.responseText);
            // 遍历data数组，把内部的信息一个个的显示到页面上
            var username=info_user['username'];
            var s = "";
            /*
            for (var i = 0; i < data.length; i++) {
                s += "(" + data[i].timeStamp + ") >>>";
                s += "<p class='box'>";
                s += data[i].username + "&nbsp;" + "说：" + data[i].content;
                s += "</p>";
            }*/
            for (var i = 0; i < data.length; i++) {
                if(data[i].username==username){
                    s += "<p class='userbox'>";
                    //s += "(" + data[i].timeStamp + ") >>>"+'<br/>';
                    s += data[i].timeStamp+'<br/>';
                    s += data[i].username + "&nbsp;" + "说：" + data[i].content;
                    s += "</p>";
                }
                else{
                    s += "<p class='otherbox'>";
                    s += "(" + data[i].timeStamp + ") >>>"+'<br/>';
                    s += data[i].username + "&nbsp;" + "说：" + data[i].content;
                    s += "</p>";
                }

            }
            //记录最大的timeStamp
            if(data.length!==0){
                maxChattimeStamp=data[data.length-1].timeStamp;
            }
            // 显示聊天内容
            var showmessage = document.getElementById("up");
            showmessage.innerHTML += s;
            //showmessage.innerHTML = s;
            //showmessage.scrollTop 可以实现div底部最先展示
            //divnode.scrollHeight而已获得div的高度包括滚动条的高度
            //showmessage.scrollTop = showmessage.scrollHeight - showmessage.style.height;
            if(chatautoflow==1){
                autoflow('up');
            }
            console.log('chat message updated');
        }
    };
    ajax.open('get', './chatroom.php?maxtimeStamp=' + maxChattimeStamp+ '&sid=' + sid);
    ajax.send(null);
}

//发送聊天消息的函数
function send() {
    var form = document.getElementById('chatform');
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(form);
    formdata.append('sid', sid);
    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
        }
    };
    xhr.open('post', './chatroom_insert.php');
    xhr.send(formdata);
    //自动清空输入框
    document.getElementById("msg").value = "";
}
//调用使聊天室右侧滑块滚动至最下方的函数
function autoflow(id) {
    var target=document.getElementById(id);
    target.scrollTop = target.scrollHeight - target.style.height;
}
//改变聊天室自动滚动状态
function changeAutoflow() {
    if(chatautoflow==1){
        chatautoflow=0;
        document.getElementById('autocontrol').value='自动滚动';
    }
    else{
        chatautoflow=1;
        document.getElementById('autocontrol').value='停止自动滚动';
    }

}

//-----------------资源共享页面----------------------------------------------
//提交分享文件
function submitShareFile() {
    var fileform = document.getElementById('share_upload');
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(fileform);
    formdata.append('sid',sid);

    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log('submitShareFile() response: ');
            console.log(xhr.responseText);
            fileform.innerHTML='';
        }
    };
    xhr.open('post', 'share_file.php');
    xhr.send(formdata);
    console.log('formdata');
    console.log(formdata);
}
//从后台获取分享列表的数据
function shareListData() {
    $.ajax({
        url:'share_list_data.php',
        data:{sid:sid},
        success:function (data) {
            var info=JSON.parse(data);
            console.log('shareListData result: ');
            console.log(info);
            console.log(typeof (info['filename'][0]) )
            if(typeof (info['filename'][0]) !='undefined'){
                createShareTable(info,'sharelist')

            }
        }
    })
}
//根据数据创建共享列表
function createShareTable(data,tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML='小组共享';
    for(var i=0;i<objectLength(data);i++){
        (function () {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var filename=data['filename'][i];
            //正则表达式 取得文件扩展名 结果不包含'.'  形如  pdf
            var FileExt = filename.replace(/.+\./, "").toLowerCase();
            var sharefile=data['sharefile'][i];
            var sharetime=data['sharetime'][i];

            var a = document.createElement('a');
            if(FileExt=='pdf'){
                a.onclick=function () {
                    PDFObject.embed(sharefile, "#share_pdf")
                }
            }
            else{
                a.href=sharefile;
                a.download=filename;
            }
            var node=document.createElement('span');
            node.innerHTML=filename+'<br/>'+sharetime;
            a.appendChild(node);
            tr.appendChild(a);
        })(i)
    }
}
//获取历史report的附件的名字和路径
function reportAttachmentData() {
    $.ajax({
        url:'report_attachment.php',
        data:{sid:sid},
        success:function (data) {
            var info=JSON.parse(data);
            console.log('report_attachment result: ');
            console.log(info);
            createAttachmentTable(info,'attachment_history');
        }
    })
}
//根据数据创建历史report附件列表
function createAttachmentTable(data,tbodyid) {
    var tbody = document.getElementById(tbodyid);
    tbody.innerHTML='附件历史';
    for(var i=0;i<objectLength(data);i++){
        (function () {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var filename=data['urlname'][i];
            //正则表达式 取得文件扩展名 结果不包含'.'  形如  pdf
            var FileExt = filename.replace(/.+\./, "").toLowerCase();
            var sharefile=data['url'][i];
            var uploadtime=data['time'][i];
            var shared=data['shared'][i];
            var number=data['number'][i];
            var taskid=data['taskid'][i];
            //创建并设置a标签和文字node
            var a = document.createElement('a');
            if(FileExt=='pdf'){
                a.onclick=function () {
                    PDFObject.embed(sharefile, "#share_pdf")
                }
            }
            else{
                a.href=sharefile;
                a.download=filename;
            }
            var node=document.createElement('span');
            node.innerHTML=filename+'<br/>'+uploadtime;
            //绑定标签
            a.appendChild(node);
            tr.appendChild(a);
            //创建一键分享按钮
            var button=document.createElement('input');
            button.type='button';
            if(shared==0){
                button.value='分享';
                button.setAttribute('style',"width:60px;height:25px");
                button.onclick=function (ev) {
                    //alert(1);
                    shareAttachment(filename,sharefile,number,taskid);
                    button.value='已分享';
                }
            }
            else{
                button.value='已分享';
                button.setAttribute('disabled','disabled');
            }
            //tr.appendChild(button);
            tbody.appendChild(button);

        })(i)
    }
}
//分享report附件列表中的附件
function shareAttachment(filename,url,number,taskid) {

    $.ajax({
        url:'share_attachment.php',
        data:{sid:sid,filename:filename,url:url,taskid:taskid,number:number},
        success:function (data) {
            console.log(data);
        }
    })
}