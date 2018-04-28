/*
提示：
*/
//-----------------常量设置----------------------------------------------
var GROUPNUM=4;
var EVALUATIONNUM=4;
var homework=[];
var user_info_array=[];

//--------评价作业时的学生信息
var stu_group=0;
var stu_taskid=0;
var stu_numberingroup=0;

//-----------------执行部分----------------------------------------------
getUserInfo();
getHomework();


//-----------------函数定义部分----------------------------------------------
function feedbackEmail() {
    var emailcontent=document.getElementById("教师反馈").value.trim();
    if(emailcontent==""){
        alert("您还没输入评价哦，orz");
        return(0);
    }
    /*
    alert(emailcontent)
    if (emailcontent.replace(/(^s*)|(s*$)/g, "").length ==0){
        alert('不能为空');
    }
    value = value.replace('\s+', '');
    if(value.length > 0) {
    } else {
        alert('shit , 全是空格');
    }
    check(emailcontent);
    */
    if(checkAllGood()){
        var evaluation="通过";
    }else{
        evaluation='待修改';
    }

    var groupid=user_info_array['group'+stu_group];
    //ajax请求将数据送往后台
    $.get("tutor_feedback_email.php",{groupid:groupid,numberingroup:stu_numberingroup,taskid:stu_taskid,emailcontent:emailcontent,evaluation:evaluation},function(data){
        //php文件运行成功返回的data为success
        alert(data);
    })
}

/*
function check(test) {
    var input  = /^[\s]*$/;
    if (input.test(tset)){
        alert("输入不能为空");
        return false;
    }
*/

function   checkGood(radioName)
{
    var obj = document.getElementsByName(radioName);  //这个是以标签的name来取控件
    for(var i=0; i<obj.length;i++)    {
        if(obj[i].checked)    {
            if(obj[i].nextSibling.nodeValue!="好"){
                //alert(obj[i].nextSibling.nodeValue);
                return false;
            }
        }
    }
    return true;
}

function checkAllGood() {
    for(var i=0;i<EVALUATIONNUM;i++){
        if(!checkGood("evaluation"+i)){
            return false;
        }
    }
    return true;
}
//取得作业表存入homework数组
function getHomework() {
    $.get("get_homework.php",function (data) {
        //此处解析不能通过alert来查看，但可以直接使用
        homework=eval(data);
        buttonControl();

    })
}


//开关评价学生作业界面
$(function(){
})
function openDialog(){
    document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block'
}
function closeDialog(){
    document.getElementById('light').style.display='none';
    document.getElementById('fade').style.display='none'
}

//点击按钮查看学生作业的处理
function dialog(group,taskid,numberingoup){
    for(var i=0;i<homework.length;i++){
        if(homework[i]['groupid']==user_info_array['group'+group]&&homework[i]['numberingroup']==numberingoup&&homework[i]['taskid']==taskid){
            document.getElementById('学生作业').value=homework[i]['homeworkcontent'];
        }
    }
    stu_group=group;
    stu_numberingroup=numberingoup;
    stu_taskid=taskid;
    //检查作业的批改状态
    var groupid=user_info_array['group'+stu_group];
    $.get("check_homework_evaluation.php",{groupid:groupid,numberingroup:stu_numberingroup,taskid:stu_taskid},function (data) {
        var message=eval(data);
        var button=$("#feedback");
        if(message=='作业已通过！'||message=='作业待学生修改！'){
            var textarea=document.getElementById("教师反馈");
            textarea.setAttribute('readonly','readonly');
            textarea.value=message;
            button.hide();
        }else{
            button.show();
        }


    });
    openDialog();

}

//取得$_SESSION中的用户信息
function getUserInfo() {
    $.get("../all/get_user_info.php",function(data){
        //返回的json数据解码，数据存进user_info_array
        user_info_array=eval(data);
    })
}

function buttonControl() {
    for(var i=0;i<homework.length;i++){
        var groupid=transferGroupid(homework[i]['groupid']);
        var taskid=homework[i]['taskid'];
        var numberingroup=homework[i]['numberingroup'];
        //var id=groupid+" "+taskid+" "+numberingroup;
        var id=String(groupid)+String(taskid)+String(numberingroup);
        var button=document.getElementById(id);
        button.removeAttribute("disabled");
        $("#"+id).css("background-color","blue");
    }
}

//将groupid转换为教师管理的小组编号，返回编号 例： 13->group1 ，return 1
function transferGroupid(groupid){
    for(var i=0;i<GROUPNUM;i++){
        if(user_info_array['group'+i]==groupid){
            return(i);
        }
    }
}
