<?php
//导师发送反馈邮件的后台处理
/*

*/
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//-----------------常量设置----------------------------------------------
$NUMBERINGROUP=4;
$TASKNUM=10;

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_SESSION['classid'];
$emailcontent=$_GET["emailcontent"];
$time=date('Y-m-d H:i:s',time());
$taskid=$_GET['taskid'];
$numberingroup=$_GET['numberingroup'];
$groupid=$_GET['groupid'];
$evaluation=$_GET['evaluation'];
//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//选择数据库
mysqli_query($link,'use database1');
//-----------------对应插入新纪录----------------------------------------------
$query="SELECT userid,username FROM account WHERE groupid='$groupid' AND numberingroup='$numberingroup'";
$ret=mysqli_query($link,$query);
$stu_info=mysqli_fetch_assoc($ret);
$username=$stu_info['username'];
$userid=$stu_info['userid'];

$query="SELECT oknumber,taskidnow FROM group_attr WHERE groupid='$groupid'";
mysqli_query($link,$query);
$ret=mysqli_query($link,$query);
$info_array=mysqli_fetch_assoc($ret);
$oknumber=$info_array['oknumber'];
$taskidnow=$info_array['taskidnow'];
if($evaluation=='通过'){

    //如果通过数等于小组人数，小组当前任务号加1，当前任务通过人数归0
    if($oknumber==$NUMBERINGROUP-1){
        if($taskidnow<=$TASKNUM){
            $query="UPDATE group_attr SET taskidnow='$taskidnow'+1,oknumber=0 WHERE classid='$classid'AND groupid='$groupid'";
            mysqli_query($link,$query);
            //发送下一个任务
            $nexttaskid=$taskidnow+1;
            $taskcontetnt='任务内容'.$nexttaskid;
            $query="INSERT INTO log(timeStamp,classid,groupid,actiontype,content,taskid) VALUES ('$time','$classid','$groupid','TaskEmail','$taskcontetnt','$nexttaskid')";
            mysqli_query($link,$query);

        }
    }
    //通过数小于组员数，当前通过人数+1
    elseif ($oknumber<$NUMBERINGROUP-1){
        $query="UPDATE group_attr SET oknumber=oknumber+1 WHERE classid='$classid'AND groupid='$groupid'";
        mysqli_query($link,$query);
    }
}
//插入反馈邮件
$query="INSERT INTO log(timeStamp,classid,groupid,groupNO,userid,username,actiontype,content,taskid) VALUES ('$time','$classid',
          '$groupid','$numberingroup','$userid','$username','ReportFeedback','$emailcontent','$taskidnow')";
mysqli_query($link,$query);
//更改作业的评价状态
$query="UPDATE homework_mood SET evaluation='$evaluation' WHERE userid='$userid' AND taskid='$taskid'";
mysqli_query($link,$query);

mysqli_close($link);
//回显发送成功提示
echo("success");
