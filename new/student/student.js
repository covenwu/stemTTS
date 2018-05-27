/*
问题：1.（在线列表）教师重名，应换成更可靠的id
       2.（在线列表）获取小组信息为异步，可能导致在线列表无法执行
       3.将changelistmood改为changemood
       3.改变taskid更新方式可能能减少查询
       4.可能可以合并请求来减少请求次数
       5.可以去掉同步请求
       6.可以减少checkhoemworkevaluaion
进度：

*/


//-----------------控制台--------------------
var getEmailInterval=5000;
var onlineuserInterval=5000;
//小组学生数
var groupstunumber=4;

//-----------------设置变量---------------------
//listMood是下拉栏状态，初始为“主页”
var listMood = "mainmenu";
//记录最后一次点击的发件列表项是否为最后一封,可为'other'和'last'
var lastclick='other';
var sid = getQueryString("sid");
//当前作业评价状态
var evaluation='';
//个人信息  目前存储组员姓名
var groupmemmber=[];
//发件箱正在显示的是不是最后一封report
var lastonshow=false;
//当前获取邮件的最大时间戳
var maxEmailTimeStamp='1000-01-01 00:00:00';
//存储taskname,url相关信息的数组,索引对应taskid
var taskname_url_arr;
//存储用户信息的数组
var user_info_arr;
//存储教师和系统邮件的数组
var receive_data=[];
//存储作业信息的数组
var homework_data=[];
//存储草稿
//var draft='';
//生成上传按钮部分
var attachname ="attach";
var attachnum=1;
//-----------------执行部分----------------------------------------------
getGroupInfo();
//取得用户信息
getUserInfo();
prepareAllTable();
taskname_url();
getEmailData();
updateGetOnlineuser();
setInterval("getEmailDataConstantly()", getEmailInterval);
setInterval("updateGetOnlineuser()", onlineuserInterval);



//-----------------设置点击事件------------------

//-----------------函数定义部分----------------------------------------------
//-----------------获取要维持的信息----------------------------------------------
function saveDraftLocal() {
    homework_data[homework_data.length-1]['content']=$.trim(document.getElementById("sendemail").value);
}

//获取taskname，url
function taskname_url() {
    $.ajax({ url: "taskname_resurl.php",
        async:false,
        success: function (data) {
            taskname_url_arr=JSON.parse(data);
        }
    });
}
//从session中取得用户信息到js
function getUserInfo() {
    $.get("../all/get_user_info.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进user_info_array
        user_info_arr= eval(data);
        document.getElementById('r_receiver').innerHTML='收件人：'+user_info_arr['username'];
    })
}
//获得教师名和小组成员名
function getGroupInfo() {
    $.get("get_group_info.php", {sid: sid}, function (data) {
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        groupmemmber['stuname']=[];
        var len=data_array.length;
        //循环减一次是去掉教师
        for(var i=0;i<len-1;i++){
            groupmemmber['stuname'][i+1]=data_array[i];
        }
        groupmemmber['tutorname']=data_array[len-1];
        //alert(groupmemmber['stuname'][4]+groupmemmber['tutorname'])
    });
}
//更新在线用户列表;
function updateGetOnlineuser() {
    getGroupInfo();
    $.get("update_get_onlineuser.php", {sid: sid}, function (data) {
        //返回的json数据解码，数据存进data_array
        var data_array = eval(data);
        var onlineuserlist_str = "";
        for (var k = 1; k <= groupstunumber; k++) {
            if (jQuery.inArray(groupmemmber['stuname'][k], data_array['onlineuser_name']) != -1) {
                onlineuserlist_str += groupmemmber['stuname'][k] + '(在线）<br/>';
            } else {
                onlineuserlist_str += groupmemmber['stuname'][k] + '<br/>';
            }
        }
        if (jQuery.inArray(groupmemmber['tutorname'], data_array['onlineuser_name']) != -1) {
            onlineuserlist_str += '导师&nbsp' + '张华' + '(在线）';
        } else {
            onlineuserlist_str += '导师&nbsp' + '张华';
        }
        document.getElementById("在线列表").innerHTML = onlineuserlist_str;
    })
}

//-----------------功能小函数----------------------------------------------
//获取get传值的方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
//隐藏按钮
function hideButton(id) {
    document.getElementById(id).style.display='none';
}
//隐藏所有按钮
function hideAllButton() {
    hideButton('提交作业');
    hideButton('addfile');
    hideButton('deletefile');
    hideButton('save');
}
//显示按钮
function showButton(id) {
    document.getElementById(id).style.display='block';
}
//显示所有按钮
function showAllButton(){
    showButton('提交作业');
    showButton('addfile');
    showButton('deletefile');
    showButton('save');
}

//返回当前最大taskid，思路：最后一封收到的邮件的taskid一定是当前的taskid
function getTaskidNow(data) {
    return(receive_data[receive_data.length-1]['taskid']);
}
//切换笔记本和主页的函数,参数为代表状态的字符串
function changeListMood(mood) {
    listMood = mood;
}
//改变记录状态的变量
function changemood(target,mood) {
    target=mood;
}

//-----------------提交和浏览作业部分----------------------------------------------
//提交作业到后台写入数据库的函数
function submitHomework() {
    //先禁用按钮，防止重复提交
    //document.getElementById('提交作业').setAttribute('disabled', 'disabled');
    hideAllButton();
    saveDraftLocal();
    var text = document.getElementById("sendemail").value;
    //
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
}
//保存草稿
function saveReport() {
    //先禁用按钮，防止重复提交
    var text = $.trim(document.getElementById("sendemail").value);

    if(text!=''&&text!='未提交'&&text!='待修改'&&text!='请输入作业内容'){
        $.get("save_report.php", {sid:sid,text:text}, function (data) {
            var info = eval(data);
            alert(info)
        })
    }
    homework_data[homework_data.length-1]['content']=text;
}
//检查作业是不是可修改状态，并显示提示语，如果可修改返回true,不可修改返回false
function checkHomeworkEvaluation() {
    $.get("get_homework_evaluation.php", {sid:sid}, function (data) {
        evaluation = eval(data);
        var submitbutton = document.getElementById('提交作业');
        var textarea = document.getElementById('sendemail');
        if (evaluation == '未提交' || evaluation == '待修改') {
            var draft=homework_data[homework_data.length-1]['content'];
            if(draft!=''){
                textarea.value = draft;
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

//-----------------生成列表部分----------------------------------------------
//生成列表的通用部分
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
function prepareAllTable() {
    var email = document.getElementById("emaillist");
    prepareTable(email,'emailtable','emailtbody');
    var urldiv = document.getElementById("urllist");
    prepareTable(urldiv,'urltable','urltbody');
    var homeworkdiv = document.getElementById("homeworklist");
    prepareTable(homeworkdiv,'homeworktable','homeworktbody');
}
//在表格中添加一行
function addLine(parentid) {
    var tr = document.createElement("tr");
    var parent=document.getElementById(parentid);
    parent.appendChild(tr);
    var display = document.createElement("td");
    tr.appendChild(display);
    return display;
}

function addSendLine(taskid) {
    homework_data[taskid-1]=[];
    homework_data[taskid-1]['content']='';
    var td=addLine('homeworktbody');
    td.id='homework'+taskid;
    processLastSend(taskid,td);
    //变更前一封邮件的onclick事件
    var oldtaskid=taskid-1;
    var old=document.getElementById('homework'+oldtaskid);
    //可重构函数
    old.onclick=function () {
        //可优化
        var text=homework_data[oldtaskid-1]['content'];
        if(lastclick=='other'){
            document.getElementById("sendemail").value = text;
            document.getElementById("s_title").innerHTML=taskname_url_arr[oldtaskid]['taskname'];
        }
        else if(lastclick=='last'){
            saveDraftLocal();
            document.getElementById("sendemail").value = text;
            document.getElementById("s_title").innerHTML=taskname_url_arr[oldtaskid]['taskname'];
        }
        lastclick='other';
    }


}
//对最后一封发件(撰写中)的处理
function processLastSend(taskid,td){
    td.innerHTML='report'+taskid;
    td.onclick=function () {
        if(lastclick='other'){
            document.getElementById("s_title").innerHTML=taskname_url_arr[taskid]['taskname'];
            checkHomeworkEvaluation();
        }
        lastclick='last';
    }
}

//从后台取得邮件数据的函数
function getEmailData() {
    $.ajax({ url: "student_get_email.php",
        data:{sid:sid,maxtimestamp:maxEmailTimeStamp},
        async:false,
        success: function (data) {
            //如果无新数据，结束
            if(!data){
                return false;
            }
            //返回的json数据解码，数据存进data_array
            var data_array = eval(data);
            receive_data=eval(data);
            /*
            var taskid=data_array[data_array.length-1]['taskid'];
            addSendLine(taskid);
            */

            maxEmailTimeStamp=data_array[data_array.length-1]['timeStamp'];
            //eamil为显示邮件列表的div元素
            var email = document.getElementById("emaillist");
            //创建表格
            createEmailTable(email, data_array,'emailtable','emailtbody');

            //ajax异步请求必须注意顺序影响

            urlList(1);
            homeworkList();
        }
    });

}
function getEmailDataConstantly() {
    $.ajax({ url: "student_get_email.php",
        data:{sid:sid,maxtimestamp:maxEmailTimeStamp},
        async:false,
        success: function (data) {
            var data_array = eval(data);
            //如果无新数据，结束
            if(data_array=='noresult'){
                return false;
            }
            var len=data_array.length;
            for(var i=0;i<len;i++){
                receive_data.push(data_array[i])
            }
            //receive_data=eval(data);
            for(var i=0;i<data_array.length;i++){
                if(data_array[i]['actiontype']=='TaskEmail'){
                    lastclick='other';
                    var taskid=data_array[i]['taskid'];
                    addSendLine(taskid);
                    showAllButton();
                    urlList(getTaskidNow());

                }
            }



            maxEmailTimeStamp=data_array[data_array.length-1]['timeStamp'];
            //eamil为显示邮件列表的div元素
            var email = document.getElementById("emaillist");
            //创建表格
            createEmailTable(email, data_array,'emailtbody');

            //ajax异步请求必须注意顺序影响
        }
    });
}

//动态生成系统和教师邮件列表的函数
function createEmailTable(parent,datas,tbodyid) {
    var tbody=document.getElementById(tbodyid);
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
                var title='RE:Report'+taskid+' '+timeStamp;
            }
            else if(actiontype='TaskEmail'){
                title=taskname_url_arr[taskid]['taskname']+' '+timeStamp;
            }
            display.innerHTML = title;


            tr.appendChild(display);

            //取得emailcontent内容
            var content = datas[i]['content'];
            //设置点击展示邮件内容的功能
            //var disp = document.getElementById('display' + i);
            display.onclick = function () {
                document.getElementById("receiveemail").value = content;
                $.get("read_task_log.php", {sid:sid,taskid:taskid}, function (data) {
                    alert(data);
                })
                document.getElementById("r_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                document.getElementById('r_time').innerHTML='时间:'+timeStamp;
                var str=groupmemmber['stuname'][1];
                for(var j=2;j<=groupstunumber;j++){
                    str+=';'+groupmemmber['stuname'][j];
                }
                document.getElementById("r_copy").innerHTML='抄送:'+str;
            }
        })(i)
    }
}
function getDraft(taskid) {
    //可优化减少一次查询
    $.ajax({ url: "get_draft.php",
        data:{sid:sid},
        async:false,
        success: function (data) {
            homework_data[taskid-1]=[];
            homework_data[taskid-1]['content']=eval(data);
        }
    });
}
//取得发件列表所需数据
function homeworkList() {
    $.get("stu_homework_list.php", {sid:sid}, function (data) {
        //数组多出一项
        console.log(data)
        var data_array=eval(data);
        if(data_array=='noresult'){
            console.log('noresult')
            homework_data[0]=[];
            homework_data[0]['content']='';
            createHomeworkTable(homework_data,'homeworktbody');
        }
        else {
            homework_data=data_array;
            var taskidnow = receive_data[receive_data.length - 1]['taskid'];
            if (homework_data.length < taskidnow) {
                getDraft(taskidnow);
            }
            console.log(homework_data)
            createHomeworkTable(homework_data, 'homeworktbody');


        }


    })
}
//生成发件列表
function createHomeworkTable(datas,tbodyid) {
    var tbody=document.getElementById(tbodyid);
    var len=datas.length;
    //创建‘邮件n'的单元列
    for (var i = 0; i < len; i++) {
        //此处如不使用匿名函数封装，直接写进循环会报错'mutable variable accessing closure
        (function () {
            //新建一行
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var display = document.createElement("td");

            //实际对应的的taskid是i+1
            var taskid=i+1;
            var content=datas[i]['content'];
            var timeStamp=datas[i]['timeStamp'];
            if ( typeof(timeStamp) != "undefined" ) {
                display.innerHTML = 'report'+taskid+' '+timeStamp;
            }
            else{
                display.innerHTML = 'report'+taskid+' '+'just now';
            }



            tr.appendChild(display);
            display.setAttribute('id', 'homework' + taskid);
            //设置点击展示邮件内容的功能
            var disp = document.getElementById('homework' + taskid);
            disp.onclick = function () {
                if(lastclick=='other'){
                    document.getElementById("sendemail").value = content;
                    document.getElementById("s_title").innerHTML=taskname_url_arr[taskid]['taskname'];
                }
                else if(lastclick=='last'){
                    saveDraftLocal();
                    document.getElementById("sendemail").value = content ;
                    document.getElementById("s_title").innerHTML=taskname_url_arr[taskid]['taskname'];

                }
                lastclick='other';
            }
        })(i);
    }
    var taskid=receive_data[receive_data.length-1]['taskid'];
    //如果有已在本地创建但还未提交的任务（上方代码只生成提交过的，两者最多可能差一）
    if(len<taskid){
        addSendLine(taskid);
    }else{
        //最后一项发件
        document.getElementById('homework'+len).onclick=function () {
            if(lastclick='other'){
                document.getElementById("s_title").innerHTML=taskname_url_arr[len]['taskname'];
                checkHomeworkEvaluation();
            }
            lastclick='last';
        }
        //document.getElementById('homework'+len).onclick=lastOnclick(len);
    }

}
//取得资源列表所需数据
function urlList(starttaskid) {
    var taskidnow = getTaskidNow();
    var url_arr = [];
    url_arr['intro'] = [];
    url_arr['url'] = [];
    /*for (var i = starttaskid; i <= taskidnow; i++) {
        (function () {
            var resource_arr = taskname_url_arr[i]['resource'];
            for (var k = 0; k < resource_arr.length; k++) {
                (function () {
                    url_arr['intro'].push(resource_arr[k]['intro']);
                    url_arr['url'].push(resource_arr[k]['url'])
                })(k)
            }
        })(i);
        alert('urllist')
        createUrlTable(url_arr, 'urltbody');

    }*/
    for (var i = starttaskid; i <= taskidnow; i++) {
        var resource_arr = taskname_url_arr[i]['resource'];
        for (var k = 0; k < resource_arr.length; k++) {
            url_arr['intro'].push(resource_arr[k]['intro']);
            url_arr['url'].push(resource_arr[k]['url'])
        }
    }

    createUrlTable(url_arr, 'urltbody');


}

//生成资源列表
function createUrlTable(datas, tbodyid) {
        var tbody = document.getElementById(tbodyid);
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
                //hreftag.setAttribute('href',datas[i]['url']);
                //display.innerHTML = datas[i]['url'];
                display.appendChild(hreftag);
                hreftag.onclick = function (ev) {
                    PDFObject.embed(href, "#pdf")
                };

                tr.appendChild(display);

            })(i)
        }
    }
function lastOnclick(taskid) {
    if(lastclick='other'){
        document.getElementById("s_title").innerHTML=taskname_url_arr[taskid]['taskname'];
        checkHomeworkEvaluation();
    }
    lastclick='last';
}
//-----------------上传附件部分----------------------------------------------
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
//aElement.value="thanks";
//aElement.onclick=Function("asdf()");
        if (document.getElementById("upload").appendChild(aElement) == null)
            return false;
        return true;
    }
function removeInput(nm) {
        var aElement = document.getElementById("upload");
        if (aElement.removeChild(aElement.lastChild) == null)
            return false;
        return true;
    }


