/*
提示：1.处理按钮颜色及可用
*/
var homework=[];
var user_info_array=[];
var GROUPNUM=4;
//-----------------执行部分----------------------------------------------
getUserInfo();
getHomework();
/*
$("#sendemail").click(function () {
    sendTaskEmail();
});
*/

//-----------------函数定义部分----------------------------------------------
/*function sendTaskEmail() {
    //获取id为emailcontent的输入框中的内容
    var emailcontent=document.getElementById("emailcontent").value;
    //ajax请求将数据送往后台
    $.get("php/teacher_feedback_email.php",{id:student_id,taskid:taskid,emailcontent:emailcontent},function(data){
        //php文件运行成功返回的data为success
        alert(data);
    })
}*/

//取得作业表存入homework数组
function getHomework() {
    $.get("get_homework.php",function (data) {
        //此处解析不能通过alert来查看，但可以直接使用
        homework=eval(data);
        buttonControl();

    })
}


//开关查看学生作业界面
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
