<?php
//导师发送反馈邮件的后台处理
/*

*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//选择数据库
mysqli_query($link,'use database1');

//-----------------获取接口变量----------------------------------------------
$emailcontent=$_GET["emailcontent"];
//获取time
$time=date('Y-m-d H:i:s',time());
$taskid=$_GET['taskid'];
$numberingroup=$_GET['numberingroup'];
$groupid=$_GET['groupid'];
$evaluation=$_GET['evaluation'];

//-----------------对应插入新纪录----------------------------------------------
$query="SELECT userid,username,classid FROM account WHERE groupid='$groupid' AND numberingroup='$numberingroup'";
$ret=mysqli_query($link,$query);
$stu_info=mysqli_fetch_assoc($ret);
$classid=$stu_info['classid'];
$username=$stu_info['username'];
$userid=$stu_info['userid'];



$query="INSERT into email_history(time,classid,userid,username,emailcontent,taskid) values('$time'
          ,'$classid','$userid','$username','$emailcontent','$taskid')";
mysqli_query($link,$query);

$query="UPDATE homework_history SET evaluation='$evaluation' WHERE userid='$userid' AND taskid='$taskid'";
mysqli_query($link,$query);

//回显发送成功提示
echo("success");
