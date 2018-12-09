
//-----------------控制台----------------------------------------------
var buttonInterval=5000;
var chatInterval=2000;
var onlineuserInterval=7000;
//-----------------常量设置----------------------------------------------
//report评价标准的数量，（可能没有必要使用全局变量）
var EVALUATIONNUM ;
//小组数
var group_num=4;
//聊天室的最大时间戳，每次查询只查时间戳以后的聊天信息
//var maxtimeStamp='1000-01-01 00:00:00';
//var maxtimeStamp=getNowFormatDate();
var maxtimeStamp=GetDateStr(-14);
//console.log(maxtimeStamp);
//任务数量，会在初始化时根据xml内容获取
var tasknum;
//小组成员最大数量
var membernum=5;
//sessionID
var sid = getQueryString("sid");
//存储xml中的信息
var info_pro=[];
//各小组当前taskid
var info_taskid=[];
//记录已发送的预定语句
var info_pop=[];
//记录教师对应的班级
var info_classid=[];
//tutor的username
var info_username='';
//班级信息
var info_classinfo=[];
//当前classid
var classidnow=0;
//控制是否刷新聊天信息,0不刷新，1刷新,（可能是用于防止在更换班级时，之前已发出的ajax请求造成干扰，但并不确定有用）
var chatupdatecontrol=0;
//控制是否刷新作业图标状态,0不刷新，1刷新（可能是用于防止在更换班级时，之前已发出的ajax请求造成干扰，但并不确定有用）
var buttoncontrol=0;
//进入新任务是否自动发送任务信息聊天
var AUTOSEND=0;
//聊天室内容是否自动滚动(第一个0占位）
var chatautoflow=[0,1,1,1,1];
//上次发出查询聊天的ajax已返回
var LASTCHATAJAXEND=true;

//--------评价作业时的学生信息
var stu_group = 0;
var stu_taskid = 0;
var stu_numberingroup = 0;

//-----------------执行部分----------------------------------------------
initialize();
setInterval("buttonControl()", buttonInterval);

window.onload = function(){
    // 轮询以实现自动的页面更新
    setInterval(function () {get_chat_data();},chatInterval);
};
setInterval("updateGetOnlineuser()",onlineuserInterval);

//-----------------函数定义部分------------------------------------------------------------------------
//-----------------功能小函数----------------------------------------------
//获取与当前时间差指定天数的时间戳
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
    return y+"-"+m+"-"+d;
}

//获取get传值的方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
//计算类型为object的数组的长度
function objectLength(obj) {
    var arr=Object.keys(obj);
    return arr.length;
}
//清空一个元素的value
function emptyElement(id) {
    var target=document.getElementById(id);
    target.value='';
}


//-----------------初始化----------------------------------------------
//初始化所有内容
function initialize() {
    var a=document.getElementById('classmanage');
    a.href="../group/group.html?sid="+sid;
    $.get("initialize.php", {sid:sid}, function (data) {
        console.log('initialize');
        console.log(data);
        var info = JSON.parse(data);
        info_pro=info['pro'];
        info_classid=info['classid'];
        info_username=info['username'];
        info_classinfo=info['classinfo'];
        tasknum=objectLength(info_pro);
        console.log('tasknum');
        console.log(tasknum);
        classSelect();
        createAllTaskbutton(group_num,tasknum);
        console.log('initialize');
        console.log(info);
    })
}

//创建一个任务按钮
//参数为组号，taskid，numberingroup,索引均从一开始
function createButton(groupid,taskid,numberingroup,parentnode) {
    //创建button标签
    var button=document.createElement('button');
    button.id=''+groupid+taskid+numberingroup;
    button.onclick=function (ev) {
        dialog(groupid,taskid,numberingroup);
    };
    button.style='height:50px;width:50px;margin:0';
    button.style.display='none';
    //元素绑定
    parentnode.appendChild(button);
}
//创建一个任务div（任务图标），参数taskid从1开始索引
function createTaskdiv(taskid,parentnode,groupid) {
    //创建div
    var div=document.createElement('div');
    div.style="vertical-align:middle;";
    div.innerHTML='<span>'+'任务'+taskid+'</span>';
    //创建每一个button并绑定
    for (var i=0;i<membernum;++i){
        createButton(groupid,taskid,i+1,div)
    }
    //父节点绑定
    parentnode.appendChild(div)
}
//为指定id的父节点绑定任务
function appendTask(tasknum,parentid,groupid) {
    var parent=document.getElementById(parentid);
    for(var i=0;i<tasknum;++i){
        createTaskdiv(i+1,parent,groupid);
    }
}
//创建各组的任务图标
function createAllTaskbutton(groupnum,tasknum){
    for (var i=0;i<groupnum;++i){
        var groupid=i+1;
        var parentid='group'+groupid;
        appendTask(tasknum,parentid,groupid)
    }
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
            var text=getClassname(classid,info_classinfo);
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
//
function getClassname(classid,classinfo) {
    var len=classinfo.length;
    for(var i=0;i<len;++i){
        if(classinfo[i]['classid']==classid){
            return classinfo[i]['classname'];
        }
    }
    console.log('error:classname not found')
}
//选择班级后重新初始化数据和界面
function changeClass(classid) {
    //changeClassData()
    //更改classid
    classidnow=classid;

    //启动作业图标状态自动刷新
    buttoncontrol=1;
    //重置所有作业状态图标
    resetButton();
    document.getElementById('classnow').innerText='当前班级:'+getClassname(classid,info_classinfo);
    $.get("button_control.php", {sid:sid,classid:classidnow}, function (data) {
        console.log(data)
        //此处解析不能通过alert来查看，但可以直接使用
        var info=JSON.parse(data);
        console.log('button_control');
        console.log(info)
        //更新autosend
        AUTOSEND=info['autosend'];
        console.log('AUTO'+AUTOSEND)
        updateAutosend(AUTOSEND);

        var homeworkmood = info['homeworkmood'];
        info_taskid=info['taskid'];
        updateTaskid(info['taskid']);

        for(var i=0;i<homeworkmood.length;i++){
            var numberingroup=homeworkmood[i]['numberingroup'];
            //按规则求出按钮的id，规则为：id三位命名数字分别为：组号，taskid，numberingroup
            var id=homeworkmood[i]['groupid'].toString()+homeworkmood[i]['taskid']+numberingroup;
            var button=document.getElementById(id);
            var evaluation=homeworkmood[i]['evaluation'];
            //根据状态显示不同的图标
            if(evaluation=='通过'){
                button.style="background:url('image/4.png')no-repeat;width: 50px;height: 50px;border: none;padding:0;";
                button.style.display='inline';
                //任务图标可能在处于其他状态时被禁止过
                button.removeAttribute('disabled');
            }
            else if(evaluation=='批改中'){
                button.style="background:url('image/2.png')no-repeat;width: 50px;height: 50px;border: none;margin:0;padding:0;";
                button.style.display='inline';
                //任务图标可能在处于其他状态时被禁止过
                button.removeAttribute('disabled');
            }else if(evaluation=='未提交'||evaluation=='待修改'){
                button.style="background:url('image/3.png')no-repeat;width: 50px;height: 50px;border: none;padding:0;";
                button.style.display='inline';
                button.setAttribute('disabled','disabled');
            }
        }
        //重置聊天室
        resetChatroom();
    })


}
//刷新是否自动发送信息
function updateAutosend(value) {
    var select=document.getElementById('autosend');
    for(var i=0;i<select.options.length;++i){
        if(select.options[i].value == value){
            //console.log('found')
            select.options[i].selected = true;
            break;
        }
    }
}
//重置聊天室
function resetChatroom() {
    //停止聊天消息刷新
    chatupdatecontrol=0;
    //清空聊天室旧聊天信息
    resetChatMsg();
    //重置聊天参数
    //maxtimeStamp='1000-01-01 00:00:00';
    var maxtimeStamp=GetDateStr(-14);
    //启动聊天信息自动刷新
    chatupdatecontrol=1;
    //重置预定语弹出数组
    //initializepop();
    //重置各聊天室预定语
   // initializeSentence();
}
//清空所有聊天室的聊天信息
function resetChatMsg() {
    for (var k = 1; k <= group_num; k++) {
        var showmessage = document.getElementById("chatcontent" + k);
        showmessage.innerHTML = '';
    }
}
//将所有按钮重置回初始隐藏状态
function resetButton(){
    console.log('groupnum,membernum,tasknum');
    console.log(group_num)
    console.log(membernum)
    console.log(tasknum)
    for(var i=1;i<=group_num;i++){
        for(var j=1;j<=membernum;j++){
            for(var k=1;k<=tasknum;k++){
                var id=i.toString()+k+j;
                var button=document.getElementById(id);
                button.style.display='none';
            }
        }
    }
}


//-----------------聊天室部分--------------------------------------------------------------------------
//-----------------聊天消息----------------------------------------------
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

//发送消息前将\n替换为\t
function n2t(str) {
    var re=/\n/g;
    str=str.replace(re,"&");
    return str;
}

//获取所有聊天室的聊天信息
function get_chat_data(){
    if(!chatupdatecontrol){
        return 0;
    }
    if(!LASTCHATAJAXEND){
        return;
    }else{
        LASTCHATAJAXEND=false;
    }
    console.log(maxtimeStamp);
    //ajax请求
    $.get("get_chat_data.php",{sid:sid,maxtimeStamp:maxtimeStamp,classid:classidnow},function(data){
        LASTCHATAJAXEND=true;
        if(!chatupdatecontrol){
            return 0;
        }
        console.log('get_chat_data():');
        console.log(data);
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        var s="";
        for(var k=1;k<=group_num;k++){

            for (var i = 0; i < data[k].length; i++) {
                if(data_array[k][i].username=='张华'){
                    s+='<p class="userchatname" >'+'张华'+'</p>'+'<br>';
                    s += '<p class="userchattime">' + data_array[k][i].timeStamp + '<p/>' ;
                    s += "<p class='userbox'>";
                    s+=formatTextInHtml(data_array[k][i].content);
                    s += "</p>"+"<br/>";
                }
                else{
                    s+='<p class="otherchatname" >'+data_array[k][i].username+'</p>'+'<br>';
                    s += '<p class="otherchattime">' +data_array[k][i].timeStamp + '<p/>' ;
                    s += "<p class='otherbox'>";
                    s+=formatTextInHtml(data_array[k][i].content);
                    s += "</p>"+"<br/>";
                }

            }
            var lastmessage=data_array[k].length-1;
            //有新聊天信息
            if(lastmessage!=-1){
                var lasttimeStamp=data_array[k][lastmessage]['timeStamp'];
                if(lasttimeStamp>maxtimeStamp){
                    maxtimeStamp=lasttimeStamp;
                }
            }

            if(s!=''){
                // 显示聊天内容（onload事件）
                var showmessage = document.getElementById("chatcontent"+k);
                showmessage.innerHTML += s;
                if(chatautoflow[k]){
                    autoflow('chatcontent'+k)
                }
            }
            //重置s
            s="";
        }

    })
}
//调用使聊天室右侧滑块滚动至最下方的函数
function autoflow(id) {
    var target=$("#"+id);
    target.scrollTop(target[0].scrollHeight);
}

//改变聊天室自动滚动状态
function changeAutoflow(chatroomid) {
    if (chatautoflow[chatroomid] == 1) {
        chatautoflow[chatroomid] = 0;
        document.getElementById('autocontrol').innerHTML = '自动滚动';
    }
    else {
        chatautoflow[chatroomid] = 1;
        document.getElementById('autocontrol').innerHTML = '停止自动滚动';
    }
}
//发送聊天消息的函数
function send(chatroomid) {
    var content=document.getElementById('msg'+chatroomid).value;
    content=n2t(content);
    emptyElement('msg'+chatroomid);
    $.ajax({ url: "multichatroom_insert.php",
        data:{sid:sid,chatroomid:chatroomid,msg:content,classid:classidnow},
        success: function (data) {
        }
    });
}
//-----------------预定语----------------------------------------------
/*
//初始化所有聊天室的'预定语'
function initializeSentence() {
    for(var i=1;i<=group_num;i++){
        (function () {
            var id='sentence'+i;
            sentence(id,0,info_taskid[i-1]['taskidnow'])
        })(i);
    }
}
//创建记录'预定语'被使用的情况的数组（被使用过的会记录在相应数组）
function initializepop() {
    info_pop=[];
    for(var i=0;i<group_num;i++){
        info_pop[i]=[];
        for(var k=info_taskid[i]['taskidnow']-1;k<tasknum;k++){
            info_pop[i][k]=[];
        }
    }
}
//填充预定回复的函数，接受 目标id, 语句在数组中的索引,任务id 作为参数
function sentence(targetid,index,taskid) {
    var target=document.getElementById(targetid);
    var chatname=info_pro[taskid-1]['chatMsg'][index];
    var chatmsg=info_pro[taskid-1]['chatMsg'][index];

    target.value=chatname;
    target.setAttribute('index',index);
    target.setAttribute('chatmsg',chatmsg);
}
//改变指定聊天室当前'预定语',(上一条，下一条)
function changesentence(chatroomid,change) {
    var target=document.getElementById('sentence'+chatroomid);
    var taskid=info_taskid[chatroomid-1]['taskidnow'];
    var oldindex=Number(target.getAttribute('index'));
    var newindex=oldindex+change;
    newindex=checkpop(newindex,taskid,chatroomid,change);
    if(newindex=='无'){
        target.value='没有啦';
        return false;
    }
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
}*/
//检测小组taskid变动，如变化发送预定信息
function updateTaskid(newarr) {
    for(var i=0;i<group_num;i++){
        console.log('update taskid begin');
        if(info_taskid[i]['taskidnow']!=newarr[i]['taskidnow']){
            //计算chatroomid
            var chatroomid=i+1;
            //var targetid='sentence'+number;
            var taskid=newarr[i]['taskidnow'];
            var len=info_pro[taskid-1]['chatMsg'].length;
            if(AUTOSEND==1){
                for(var j=0;j<len;++j){
                    console.log('begin send');
                    sendSentence(chatroomid,info_pro[taskid-1]['chatMsg'][j])
                }
            }
        }
    }
}
//发送预定信息
function sendSentence(chatroomid,content) {
    console.log('send sentence begin')
    content=n2t(content);
    $.ajax({ url: "multichatroom_insert.php",
        data:{sid:sid,chatroomid:chatroomid,msg:content,classid:classidnow},
        success: function (data) {
            console.log('send msg '+data);
        }
    });
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
        console.log('button_control');
        console.log(info)
        var homeworkmood = info['homeworkmood'];
        updateTaskid(info['taskid']);
        info_taskid=info['taskid'];
        for(var i=0;i<homeworkmood.length;i++){
            var numberingroup=homeworkmood[i]['numberingroup'];
            //按规则求出按钮的id，规则为：id三位命名数字分别为：组号，taskid，numberingroup
            var id=homeworkmood[i]['groupid'].toString()+homeworkmood[i]['taskid']+numberingroup;
            var button=document.getElementById(id);
            var evaluation=homeworkmood[i]['evaluation'];
            //根据状态显示不同的图标
            if(evaluation=='通过'){
                button.style="background:url('image/4.png')no-repeat;width: 50px;height: 50px;border: none;padding:0;";
                button.style.display='inline';
                //任务图标可能在处于其他状态时被禁止过
                button.removeAttribute('disabled');
            }
            else if(evaluation=='批改中'){
                button.style="background:url('image/2.png')no-repeat;width: 50px;height: 50px;border: none;margin:0;padding:0;";
                button.style.display='inline';
                //任务图标可能在处于其他状态时被禁止过
                button.removeAttribute('disabled');
            }else if(evaluation=='未提交'||evaluation=='待修改'){
                button.style="background:url('image/3.png')no-repeat;width: 50px;height: 50px;border: none;padding:0;";
                button.style.display='inline';
                button.setAttribute('disabled','disabled');
            }
        }
    })
}
//将数据库的文本解码为textarea的格式
function decodeText2tt(str){
    /*var re=/\n/g;
    str=str.replace(re,"<br>");*/
    var re=/&/g;
    str=str.replace(re,"\n");
   /* re=/ /g;
    str=str.replace(re,"&nbsp");*/
    return str;
}
//展开作业评价面板前的准备处理
function dialog(groupid, taskid, numberingroup) {
    //将当前这在评价的作业的学生的信息存入全局变量
    stu_group = groupid;
    stu_numberingroup = numberingroup;
    stu_taskid = taskid;
    EVALUATIONNUM=info_pro[taskid-1]['rubrics'].length;
    //重置输入反馈内容的标签
    var textarea=document.getElementById("教师反馈");
    textarea.removeAttribute('readonly');
    textarea.value='';

    $.get("check_homework_evaluation.php", {
        groupid: stu_group,
        numberingroup: stu_numberingroup,
        taskid: stu_taskid,
        classid:classidnow,
        sid:sid
    }, function (data) {
        var info_arr=JSON.parse(data);
        console.log('dialog');
        console.log(info_arr)
        //学生作业评价状态
        var message=info_arr['evaluation'];
        console.log('dialog content')
        console.log(info_arr['content'])
        //显示学生作业内容
        document.getElementById('学生作业').value =decodeText2tt(info_arr['content']);
        //清空附件显示区
        var urldiv=document.getElementById('url');
        urldiv.innerHTML='';
        //将附件显示到附件显示区
        for(var i=0;i<info_arr['url'].length;i++){
            var a=document.createElement('a');
            a.href=info_arr['url'][i];
            a.download=info_arr['urlname'][i];
            var node = document.createTextNode(info_arr['urlname'][i]);
            a.appendChild(node);
            urldiv.appendChild(a);
            urldiv.innerHTML+='</br>';
        }
        //获取反馈按钮
        var button = $("#feedback");
        //通过或待修改时禁止编辑和提交反馈邮件
        if (message == '作业已通过！' || message == '作业待学生修改！') {
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = message;
            button.hide();
        }
        //未提交时
        else {
            textarea.removeAttribute('readonly');
            button.show();
            document.getElementById('feedback').removeAttribute('disabled');
            //评价按钮的点击功能
            for(i=0;i<info_pro[taskid-1]['rubrics'].length;i++){
                //点击评价的按钮时会动态生成反馈邮件内容
                document.getElementById('通过'+i).onclick=function (ev) {
                    makeEmail()
                };
                document.getElementById('未通过'+i).onclick=function (ev) {
                    makeEmail()
                }
            }
        }
    });
    //设置评价按钮
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
        inputb.id='未通过'+i;
        parent.appendChild(inputb);
        parent.innerHTML+='不通过';
    }
    //展开作业评价面板
    openDialog();
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
    emailcontent=n2t(emailcontent);
    //ajax请求将数据送往后台
    $.get("tutor_feedback_email.php", {
        groupid: stu_group,
        numberingroup: stu_numberingroup,
        taskid: stu_taskid,
        emailcontent:emailcontent,
        evaluation: evaluation,
        sid:sid,
        tasknum:tasknum,
        classid:classidnow
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










