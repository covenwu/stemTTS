/*
提示：初始化info_pop,应对taskid更新情况
步骤:1.修改class获取方式
*/

var buttonInterval=5000;
var chatInterval=2000;
var onlineuserInterval=7000;
//-----------------常量设置----------------------------------------------
var EVALUATIONNUM = 4;
var homework = [];
var user_info_array = [];
var group_num=4;
var maxtimeStamp='1000-01-01 00:00:00';
var tasknum=10;
//小组成员数
var membernum=5;
var sid = getQueryString("sid");
//存储xml中的信息
var info_pro=[];
//各小组当前taskid
var info_taskid=[];
//记录已发送的预定语句
var info_pop=[];
//记录教师对应的班级
var info_classid=[];
//当前classid
var classidnow=0;
//控制是否刷新聊天信息,0不刷新，1刷新
var chatupdatecontrol=0;
//控制是否刷新作业图标状态,0不刷新，1刷新
var buttoncontrol=0;

//--------评价作业时的学生信息
var stu_group = 0;
var stu_taskid = 0;
var stu_numberingroup = 0;

//-----------------执行部分----------------------------------------------
//getUserInfo();
//getHomework();
initialize();
setInterval("buttonControl()", buttonInterval);

window.onload = function(){
    // 轮询以实现自动的页面更新
    setInterval(function () {get_chat_data();},chatInterval);
};
setInterval("updateGetOnlineuser()",onlineuserInterval);

//-----------------函数定义部分------------------------------------------------------------------------
//-----------------功能小函数----------------------------------------------
//获取get传值的方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
//取得$_SESSION中的用户信息
function getUserInfo() {
    $.get("../all/get_user_info.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进user_info_array
        user_info_array = eval(data);
    })
}

//-----------------初始化----------------------------------------------
//初始化所有内容
function initialize() {
    $.get("initialize.php", {sid:sid}, function (data) {
        var info = JSON.parse(data);
        //var homeworkmood=info['homeworkmood'];
        info_pro=info['pro'];
        info_taskid=info['taskid'];
        info_classid=info['classid'];
        /*
        //第一次处理作业图标状态
        for(var i=0;i<homeworkmood.length;i++){
            var numberingroup=homeworkmood[i]['numberingroup'];
            //按规则求出按钮的id，规则为：id三位命名数字分别为：组号，taskid，numberingroup
            var id=homeworkmood[i]['groupid'].toString()+homeworkmood[i]['taskid']+numberingroup;
            var button=document.getElementById(id);
            var evaluation=homeworkmood[i]['evaluation'];
            //button.setAttribute('evaluation',evaluation);
            if(evaluation=='通过'){
                button.innerHTML='<img border="0" src="image/1.png">';
                button.style.display='inline';
            }
            else if(evaluation=='批改中'){
                button.innerHTML='<img border="0" src="image/2.png">';
                button.style.display='inline';
            }else if(evaluation=='未提交'||evaluation=='待修改'){
                button.innerHTML='<img border="0" src="image/3.png">';
                button.style.display='inline';
            }
        }
        */
        //initializepop();
        //initializeSentence();
        classSelect();
        console.log('initialize');
        console.log(info);
    })
}

//-----------------切换班级部分-----------------------------------------------------------------------
//生成班级选择的下拉框
function classSelect() {
    var ul=document.getElementById('class_select');
    for(var i=0;i<info_classid.length;i++){
        (function () {
            var li=document.createElement('li');
            ul.appendChild(li);
            var a=document.createElement('a');
            li.appendChild(a);
            var classid=info_classid[i];
            var text=classid+'班';
            var textnode=document.createTextNode(text);
            a.appendChild(textnode);
            a.setAttribute('classid',classid);
            a.onclick=function (ev) {
                var classid=this.getAttribute('classid');
                changeClass(classid);
            }
        })(i)
    }
}
//选择班级后重新初始化数据和界面
function changeClass(classid) {
    //更改classid
    classidnow=classid;
    //重置聊天室
    resetChatroom();
    //启动作业图标状态自动刷新
    buttoncontrol=1;
    //重置所有作业状态图标
    resetButton();
    //立刻将作业图标状态刷新为新切换的班级的
    buttonControl();

}
//重置聊天室
function resetChatroom() {
    //停止聊天消息刷新
    chatupdatecontrol=0;
    //清空聊天室旧聊天信息
    resetChatMsg();
    //重置聊天参数
    maxtimeStamp='1000-01-01 00:00:00';
    //启动聊天信息自动刷新
    chatupdatecontrol=1;
    //重置预定语弹出数组
    initializepop();
    //重置各聊天室预定语
    initializeSentence();
}
//清空所有聊天室的聊天信息
function resetChatMsg() {
    for (var k = 1; k <= group_num; k++) {
        var showmessage = document.getElementById("chatcontent" + k);
        showmessage.innerHTML = '';

        //showmessage.scrollTop 可以实现div底部最先展示
        // divnode.scrollHeight而已获得div的高度包括滚动条的高度
        //showmessage.scrollTop = showmessage.scrollHeight-showmessage.style.height;
    }
}
//将所有按钮重置回初始隐藏状态
function resetButton(){
    for(var i=1;i<=group_num;i++){
        for(var j=1;j<=membernum;j++){
            for(var k=1;k<=tasknum;k++){
                var id=i.toString()+k+j;
                console.log("id:"+id)
                var button=document.getElementById(id);
                button.style.display='none';
            }
        }
    }
}


//-----------------聊天室部分--------------------------------------------------------------------------
//-----------------聊天消息----------------------------------------------
//获取所有聊天室的聊天信息
function get_chat_data(){
    if(!chatupdatecontrol){
        return 0;
    }
    //ajax请求
    $.get("get_chat_data.php",{sid:sid,maxtimeStamp:maxtimeStamp,classid:classidnow},function(data){
        if(!chatupdatecontrol){
            return 0;
        }
        console.log('get_chat_data():');
        console.log(data);
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        var s="";
        for(var k=1;k<=group_num;k++){
            for(var i=0;i<data[k].length;i++){
                s += "("+data_array[k][i].timeStamp+") >>>";
                s += "<p>";
                s += data_array[k][i].username +"&nbsp;"+"说：" + data_array[k][i].content;
                s += "</p>";
            }
            //maxid增加这一组这一次接收的聊天信息条数
            //maxid+=data[k].length;
            var lastmessage=data_array[k].length-1;
            if(lastmessage!=-1){
                var lasttimeStamp=data_array[k][lastmessage]['timeStamp'];
                if(lasttimeStamp>maxtimeStamp){
                    maxtimeStamp=lasttimeStamp;
                }
            }

            // 显示聊天内容（onload事件）
            var showmessage = document.getElementById("chatcontent"+k);
            showmessage.innerHTML += s;
            //重置s
            s="";
            //showmessage.scrollTop 可以实现div底部最先展示
            // divnode.scrollHeight而已获得div的高度包括滚动条的高度
            //showmessage.scrollTop = showmessage.scrollHeight-showmessage.style.height;
        }

    })
}
//发送聊天消息的函数
function send(chatroomid) {
    var content=document.getElementById('msg'+chatroomid).value;
    $.ajax({ url: "multichatroom_insert.php",
        data:{sid:sid,chatroomid:chatroomid,msg:content,classid:classidnow},
        success: function (data) {
            console.log('send msg '+data)
        }
    });
}
//-----------------预定语----------------------------------------------
//初始化所有聊天室的'预定语'
function initializeSentence() {
    for(var i=1;i<=group_num;i++){
        (function () {
            var id='sentence'+i;
            sentence(id,0,info_taskid[i-1]['taskidnow'])
        })(i);
    }
    console.log('Sentence initialized')
}
//创建记录'预定语'被使用的情况的数组（被使用过的会记录在相应数组）
function initializepop() {
    info_pop=[];
    for(var i=0;i<group_num;i++){
        info_pop[i]=[];
        for(var k=info_taskid[i]['taskidnow']-1;k<tasknum;k++){
            /*for(var j=0;j<info_pro[k]['chatMsg'].length;j++){
                info_pop[i][j]
            }*/
            info_pop[i][k]=[];
        }
    }
}
//填充预定回复的函数，接受 目标id, 语句在数组中的索引,任务id 作为参数
function sentence(targetid,index,taskid) {
    var target=document.getElementById(targetid);
    var chatname=info_pro[taskid-1]['chatName'][index];
    var chatmsg=info_pro[taskid-1]['chatMsg'][index];
    //console.log(chatname);
    //console.log(index)
    target.value=chatname;
    target.setAttribute('index',index);
    target.setAttribute('chatmsg',chatmsg);
}
//改变指定聊天室当前'预定语',(上一条，下一条)
function changesentence(chatroomid,change) {
    console.log('change sentence begin')
    var target=document.getElementById('sentence'+chatroomid);
    var taskid=info_taskid[chatroomid-1]['taskidnow'];
    var oldindex=Number(target.getAttribute('index'));
    var newindex=oldindex+change;
    newindex=checkpop(newindex,taskid,chatroomid,change);
    console.log('change sentence result: '+newindex)
    if(newindex=='无'){
        target.value='没有啦';
        return false;
    }
    /*
    if(newindex==info_pro[taskid-1]['chatName'].length){
        newindex=0
    }
    else if (newindex==-1){
        newindex=info_pro[taskid-1]['chatName'].length-1;
    }*/
    else{
        var id='sentence'+chatroomid;
        sentence(id,newindex,taskid);
    }
}
//在指定id的聊天室发送当前'预定语'
function sendSentence(chatroomid) {

    var target=document.getElementById('sentence'+chatroomid);
    var text=target.value;
    if(text=='没有啦'){
        return;
    }
    var content=target.getAttribute('chatmsg');

    $.ajax({ url: "multichatroom_insert.php",
        data:{sid:sid,chatroomid:chatroomid,msg:content,classid:classidnow},
        success: function (data) {
            console.log('send msg '+data);
            popSentence(chatroomid)
        }
    });
}
//弹出指定id的聊天室当前'预定语'
function popSentence(chatroomid) {
    var target=document.getElementById('sentence'+chatroomid);
    var taskid=info_taskid[chatroomid-1]['taskidnow'];
    var index=Number(target.getAttribute('index'));
    var len=info_pop[chatroomid-1][taskid-1].length;
    info_pop[chatroomid-1][taskid-1][len]=index;
    changesentence(chatroomid,1)
}
//检查预定语句是否已发送过，如果已发送过，将index变为合适的值
function checkpop(index,taskid,chatroomid,change) {
    console.log('check pop begin');
    console.log('total chats length: '+info_pro[taskid - 1]['chatName'].length);
    console.log('info_pop length: '+info_pop[chatroomid-1][taskid-1].length);
    if(info_pop[chatroomid-1][taskid-1].length==info_pro[taskid - 1]['chatName'].length){
        console.log('pop out');
        return '无';
    }
    if (index == info_pro[taskid - 1]['chatName'].length) {
        index = 0
    }
    else if (index == -1) {
        index = info_pro[taskid - 1]['chatName'].length - 1;
    }
    if(jQuery.inArray(index, info_pop[chatroomid-1][taskid-1]) != -1) {
        var newindex = index + change;
        console.log('poped index changed to: '+newindex);
        return(checkpop(newindex, taskid, chatroomid, change));
    }
    else {
        console.log('checkpop result '+index);
        return index;
    }
}
//taskid变动时更改对应聊天室的'预定语'
function updateTaskid(newarr) {
    for(var i=0;i<group_num;i++){
        if(info_taskid[i]['taskidnow']!=newarr[i]['taskidnow']){
            //计算chatroomid
            var number=i+1;
            var targetid='sentence'+number;
            sentence(targetid,0,newarr[i]['taskidnow'])
        }
    }
}
//-----------------在线用户----------------------------------------------
//更新在线用户列表
function updateGetOnlineuser() {
    //ajax请求
    $.get("update_get_onlineuser.php", {sid: sid}, function (data) {
        console.log(data)
    })
}


//-----------------批改报告部分----------------------------------------------------------------------------
//-----------------界面总体处理---------------------------------------------
//控制所有任务按钮的状态（颜色，是否显示）
function buttonControl(classid) {
    if(!buttoncontrol){
        return 0;
    }
    $.get("button_control.php", {sid:sid,classid:classidnow}, function (data) {
        //此处解析不能通过alert来查看，但可以直接使用
        var info=JSON.parse(data);
        var homeworkmood = info['homeworkmood'];
        updateTaskid(info['taskid']);
        info_taskid=info['taskid'];
        for(var i=0;i<homeworkmood.length;i++){
            var numberingroup=homeworkmood[i]['numberingroup'];
            //按规则求出按钮的id，规则为：id三位命名数字分别为：组号，taskid，numberingroup
            var id=homeworkmood[i]['groupid'].toString()+homeworkmood[i]['taskid']+numberingroup;
            var button=document.getElementById(id);
            var evaluation=homeworkmood[i]['evaluation'];
            //button.setAttribute('evaluation',evaluation);
            if(evaluation=='通过'){
                button.innerHTML='<img border="0" src="image/1.png">';
                button.style.display='inline';
            }
            else if(evaluation=='批改中'){
                button.innerHTML='<img border="0" src="image/2.png">';
                button.style.display='inline';
            }else if(evaluation=='未提交'||evaluation=='待修改'){
                button.innerHTML='<img border="0" src="image/3.png">';
                button.style.display='inline';
            }
        }
        console.log('button control');
        console.log(info);
    })
}
//对点击任务按钮弹出的对话框的所有处理
function dialog(groupid, taskid, numberingroup) {
    stu_group = groupid;
    stu_numberingroup = numberingroup;
    stu_taskid = taskid;
    EVALUATIONNUM=info_pro[taskid-1]['rubrics'].length;
    document.getElementById("教师反馈").innerHTML='';
    $.get("check_homework_evaluation.php", {
        groupid: stu_group,
        numberingroup: stu_numberingroup,
        taskid: stu_taskid,
        sid:sid
    }, function (data) {
        console.log(data);
        var info_arr=JSON.parse(data);
        var message=info_arr['evaluation'];
        document.getElementById('学生作业').value =info_arr['content'];
        var urldiv=document.getElementById('url');
        urldiv.innerHTML='';
        for(var i=0;i<info_arr['url'].length;i++){
            var a=document.createElement('a');
            a.href=info_arr['url'][i];
            //a.innerText=info_arr['urlname'][i];
            a.download=info_arr['urlname'][i];
            //a.target="_blank";
            var node = document.createTextNode(info_arr['urlname'][i]);
            a.appendChild(node);
            urldiv.appendChild(a);
        }
        var button = $("#feedback");
        var textarea = document.getElementById("教师反馈");
        if (message == '作业已通过！' || message == '作业待学生修改！') {
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = message;
            button.hide();

        } else {
            //textarea.value = "";
            //textarea.setAttribute('readonly', 'readonly');
            textarea.removeAttribute('readonly');
            button.show();
            document.getElementById('feedback').removeAttribute('disabled');
            //评价按钮的点击功能
            for(i=0;i<info_pro[taskid-1]['rubrics'].length;i++){
                document.getElementById('通过'+i).onclick=function (ev) {
                    makeEmail()
                };
                document.getElementById('未通过'+i).onclick=function (ev) {
                    makeEmail()
                }
            }
        }
        console.log('dialog formed');
    });
    var parent=document.getElementById('rubrics');
    parent.innerHTML='';
    for(var i=0;i<info_pro[taskid-1]['rubrics'].length;i++){
        var div=document.createElement('div');
        div.setAttribute('style',"float:top;");
        div.innerHTML=info_pro[taskid-1]['rubrics'][i];
        parent.appendChild(div);
        var inputa=document.createElement('input');
        inputa.type='radio';
        inputa.name='evaluation'+i;
        inputa.id='通过'+i;
        parent.appendChild(inputa);
        parent.innerHTML+='通过';
        var inputb=document.createElement('input');
        inputb.type='radio';
        inputb.name='evaluation'+i;
        //inputb.onchange=makeEmail();
        inputb.id='未通过'+i;
        parent.appendChild(inputb);
        parent.innerHTML+='不通过';
    }
    /*
    //评价按钮的点击功能
    for(i=0;i<info_pro[taskid-1]['rubrics'].length;i++){
        document.getElementById('通过'+i).onclick=function (ev) {
            makeEmail()
        };
        document.getElementById('未通过'+i).onclick=function (ev) {
            makeEmail()
        }
    }
    */
    openDialog();
    console.log('dialog formed');
}
//-----------------反馈邮件形成----------------------------------------------
//形成反馈邮件
function makeEmail() {
    console.log('start makeemail');
    var check_result = checkAll();
    var checkallgood=check_result['result'];
    var choice_arr=check_result['arr'];
    var index=stu_taskid-1;
    var text=info_pro[index]['feedbackintro'].trim()+'\n';

    if(checkallgood==1){
        text+=info_pro[index]['allAcceptFeedback'].trim()+'\n';
    }
    else if(checkallgood == 0){
        text+=info_pro[index]['allReviseFeedback'].trim()+'\n';
    }
    for(var i=0;i<choice_arr.length;i++){
        if(choice_arr[i]==0){
            text+=info_pro[index]['feedback'][i].trim()+'\n';
        }
    }
    if(checkallgood==0){
        text+=info_pro[index]['reviseDeadline'].trim()+'\n';
    }
    text+='祝好！'+'\n'+'张华';
    document.getElementById('教师反馈').value=text;
}
//检查一项评价选择的是‘好中差’  0中或差  1好 2未选择
function checkGood(radioName) {
    var obj = document.getElementsByName(radioName);  //这个是以标签的name来取控件
    var uncheckednum = 0;
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].checked) {
            if (obj[i].nextSibling.nodeValue != "通过") {
                return 0;
            }
        } else {
            uncheckednum++;
            if (uncheckednum == 2) {
                return 2;
            }
        }
    }
    return 1;
}
//支持makeemail()的 检查rubrics选择情况的函数
function checkAll() {
    var checkresult=[];
    checkresult['arr']=[];
    checkresult['result']=1;
    for (var i = 0; i < EVALUATIONNUM; i++) {
        var result = checkGood("evaluation" + i);
        if (result == 2) {
            checkresult['result']=2;
            //2代表没选
            checkresult['arr'][i]=2;
        }
        else if (result == 0) {
            checkresult['arr'][i]=0;
            checkresult['result']=0;
        }
        else {
            checkresult['arr'][i]=1;
        }
    }
    return checkresult;
}

//-----------------反馈邮件发送---------------------------------------------
//发送反馈邮件
function feedbackEmail() {
    var button = document.getElementById('feedback');
    //禁用提交按钮，防止重复反馈
    button.setAttribute('disabled', 'disabled');
    var emailcontent = document.getElementById("教师反馈").value.trim();
    if (emailcontent == "") {
        alert("您还没输入评价哦，orz");
        button.removeAttribute('disabled');
        return (0);
    }
    var check_result = checkAllGood();
    var checkallgood=check_result['result'];
    if (checkallgood == 1) {
        var evaluation = "通过";
    } else if (checkallgood == 0) {
        evaluation = '待修改';
    } else {
        return false;
    }
    /*
    //生成邮件内容
    var choice_arr=check_result['arr'];
    var index=stu_taskid-1;
    var text=info_pro[index]['feedbackintro'].trim()+'\n';
    if(checkallgood==1){
        text+=info_pro[index]['allAcceptFeedback'].trim()+'\n';
    }
    else if(checkallgood == 0){
        text+=info_pro[index]['allReviseFeedback'].trim()+'\n';
    }
    for(var i=0;i<choice_arr.length;i++){
        if(choice_arr[i]==0){
            text+=info_pro[index]['feedback'][i].trim()+'\n';
        }
    }
    text+=info_pro[index]['reviseDeadline'].trim()+'\n';
    */
    //ajax请求将数据送往后台
    $.get("tutor_feedback_email.php", {
        groupid: stu_group,
        numberingroup: stu_numberingroup,
        taskid: stu_taskid,
        emailcontent:emailcontent,
        evaluation: evaluation,
        sid:sid
    }, function (data) {
        //php文件运行成功返回的data为success
        alert(data);
        buttonControl();
    })
}
//统计所有评价选项   0有中或差  1全为好 2评价没选全
function checkAllGood() {
    var checkresult=[];
    checkresult['arr']=[];
    checkresult['result']=1;
    for (var i = 0; i < EVALUATIONNUM; i++) {
        var result = checkGood("evaluation" + i);
        if (result == 2) {
            alert("评价选项没选全哦，orz");
            checkresult['result']=2;
            //2代表没选
            checkresult['arr'][i]=2;
        }
        else if (result == 0) {
            checkresult['arr'][i]=0;
            checkresult['result']=0;
        }
        else {
            checkresult['arr'][i]=1;
        }
    }
    return checkresult;
}










