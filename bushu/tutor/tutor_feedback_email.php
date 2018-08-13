<?php
//导师发送反馈邮件的后台处理
/*
1.evaluation待处理
*/
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//-----------------常量设置----------------------------------------------
$NUMBERINGROUP=4;
$TASKNUM;

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_GET['classid'];
$emailcontent=$_GET["emailcontent"];
$time=date('Y-m-d H:i:s',time());
$taskid=$_GET['taskid'];
$numberingroup=$_GET['numberingroup'];
$groupid=$_GET['groupid'];
$evaluation=$_GET['evaluation'];
$TASKNUM=$_GET['tasknum'];
//-----------------mysql参数----------------------------------------------
$servername = "47.96.146.26";
$usern = "root";
$passw = "B4F393c91945";
$dbname = "mysql";
//-----------------连接mysql服务器----------------------------------------------
$link = mysqli_connect($servername,$usern ,$passw);;
$res = mysqli_set_charset($link, 'utf8');
//选择数据库
mysqli_query($link, 'use '.$dbname);
//-----------------对应插入新纪录----------------------------------------------
$query="SELECT userid FROM account WHERE groupid='$groupid' AND classid='$classid'";
$ret=mysqli_query($link,$query);
$num=0;
while($temp=mysqli_fetch_assoc($ret)){
    $num++;
}
$NUMBERINGROUP=$num;


$query="SELECT userid,username FROM account WHERE groupid='$groupid' AND numberingroup='$numberingroup' AND classid='$classid' limit 1";
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
//向log插入反馈邮件
$query="INSERT INTO log(timeStamp,classid,groupid,groupNO,userid,username,actiontype,content,taskid) VALUES ('$time','$classid',
          '$groupid','$numberingroup','$userid','$username','ReportFeedback','$emailcontent','$taskidnow')";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo($classid);
    echo ('error 1');
}

//向feedback插入反馈邮件
$query="INSERT INTO feedback VALUES ('$time','$userid','$taskidnow','$emailcontent','$evaluation',0)";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 2');
}

//更改作业的评价状态
$query="UPDATE homework_mood SET evaluation='$evaluation' WHERE userid='$userid' AND taskid='$taskid'";
$ret=mysqli_query($link,$query);
if(!$ret){
    echo ('error 3');
}

if($evaluation=='通过'){

    //如果通过数等于小组人数，小组当前任务号加1，当前任务通过人数归0
    if($oknumber==$NUMBERINGROUP-1){
        //倒数第二个及其之前任务的处理，下发新任务，重置任务状态
        if($taskidnow<$TASKNUM){
            $query="UPDATE group_attr SET taskidnow='$taskidnow'+1,oknumber=0 WHERE classid='$classid'AND groupid='$groupid'";
            mysqli_query($link,$query);
            //发送下一个任务
            $nexttaskid=$taskidnow+1;
            $taskcontetnt='任务内容'.$nexttaskid;
            $query="INSERT INTO log(timeStamp,classid,groupid,actiontype,content,taskid) VALUES ('$time','$classid','$groupid','TaskEmail','$taskcontetnt','$nexttaskid')";
            mysqli_query($link,$query);

            //更新小组成员task时间
            $time_added=','.$time;
            $query="UPDATE task SET timeStamp=CONCAT(timeStamp,'$time_added'),checked=0 WHERE userid IN (SELECT userid FROM account WHERE classid='$classid' AND groupid='$groupid')";
            mysqli_query($link,$query);

            //查询小组学生的userid
            $query="SELECT * FROM account WHERE classid='$classid' AND groupid='$groupid'";
            $ret=mysqli_query($link,$query);
            $userid_arr=[];
            while($userid=mysqli_fetch_assoc($ret)){
                $userid_arr[]=$userid['userid'];
            }

            //更新学生作业状态为‘未提交’
            foreach ($userid_arr as $key=>$value){
                $query="INSERT INTO homework_mood VALUES ('$value','$nexttaskid','未提交')";
                if(!mysqli_query($link,$query)){
                    echo("error: failed to insert into (table)homework_mood in tutor_feedback_email.php");
                }
            }

        }
    }
    //通过数小于组员数，当前通过人数+1
    elseif ($oknumber<$NUMBERINGROUP-1){
        $query="UPDATE group_attr SET oknumber=oknumber+1 WHERE classid='$classid'AND groupid='$groupid'";
        mysqli_query($link,$query);
    }
}



mysqli_close($link);
//回显发送成功提示
echo("success");
