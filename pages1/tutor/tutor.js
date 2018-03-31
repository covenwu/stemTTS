//教师页面的js文件
/*
1.暂定进入反馈邮件界面时绑定了特定学生id,taskid
2.测试使用了'聊天信息'框和'输入聊天信息'按钮
*/

//-----------------执行部分----------------------------------------------
//1111  id需要动态设置
var student_id=1;
//1111  taskid需要动态设置
var taskid=155;

$("#sendemail").click(function () {
    sendTaskEmail();
});


//-----------------函数定义部分----------------------------------------------
function sendTaskEmail() {
    //获取id为emailcontent的输入框中的内容
    var emailcontent=document.getElementById("emailcontent").value;
    //ajax请求将数据送往后台
    $.get("php/teacher_feedback_email.php",{id:student_id,taskid:taskid,emailcontent:emailcontent},function(data){
        //php文件运行成功返回的data为success
        alert(data);
    })
}

