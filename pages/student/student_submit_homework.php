<?php
/*
功能：1.学生提交作业的后台处理
接口：1.从$_GET和$_SESSION,sid,见下方源代码‘获取接口变量’部分
        2.homework_history表
提示：有可移至前端完成的查询
*/

//设置时区保证时间戳正确
date_default_timezone_set('PRC');
//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$evaluation=$_GET['evaluation'];
$text=$_GET["text"];
$userid=$_SESSION['userid'];
//$taskidnow=$_SESSION['taskidnow'];
$classid=$_SESSION['classid'];
$username=$_SESSION['username'];
$time=date('Y-m-d H:i:s',time());
$groupid=$_SESSION['groupid'];
$numberingroup=$_SESSION['numberingroup'];
/*

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//-----------------对应插入新纪录---------------------------------------------
//此处可移至前端完成
$query="SELECT evaluation FROM homework_history WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
$ret=mysqli_query($link,$query);
$evaluation_array=mysqli_fetch_assoc($ret);
$evaluation=$evaluation_array['evaluation'];

//如果评价是‘待修改’，先删除旧记录
if($evaluation=='待修改'){
    $query="DELETE FROM homework_history WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
    mysqli_query($link,$query);
}
$query="insert into homework_history(time,classid,userid,username,taskid,homeworkcontent,evaluation,groupid,numberingroup) values('$time'
          ,'$classid','$userid','$username','$taskidnow','$text','批改中','$groupid','$numberingroup')";
mysqli_query($link,$query);
mysqli_close($link);
//回显发送成功提示
echo("作业提交成功！");
*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//-----------------对应插入新纪录---------------------------------------------
//取得当前taskid，为防止taskid变动，不保存在session中，每次现查
$query="SELECT taskidnow FROM group_attr WHERE classid='$classid' AND groupid='$groupid' limit 1";
$ret=mysqli_query($link,$query);
$taskid_arr=mysqli_fetch_assoc($ret);
$taskidnow=$taskid_arr['taskidnow'];

//插入提交作业记录到log
$query="INSERT INTO log(timeStamp,classid,groupid,groupNO,userid,username,actiontype,taskid,content) VALUES ('$time','$classid','$groupid','$numberingroup'
          ,'$userid','$username','ReportSubmit','$taskidnow','$text')";
mysqli_query($link,$query);

//更改作业状态记录
//如果评价是‘待修改’，修改旧记录
if($evaluation=='待修改'){
    //$query="DELETE FROM homework_mood WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
    $query="UPDATE homework_mood SET evaluation='批改中' WHERE userid='$userid' AND taskid='$taskidnow' limit 1";
    mysqli_query($link,$query);
}
//插入新作业状态纪录
else{
    $query="INSERT INTO homework_mood VALUES ('$userid','$taskidnow','批改中')";
    mysqli_query($link,$query);
}
mysqli_close($link);
//回显发送成功提示
echo("作业提交成功！");