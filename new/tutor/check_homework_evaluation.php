<?php
/*
 * 只需要获取userid
 * */
//header("Content-Type:application/json");

//-----------------获取接口变量----------------------------------------------
$sid=$_GET['sid'];
session_id($sid);
session_start();
$classid=$_SESSION['classid'];
$groupid=$_GET['groupid'];
$taskid=$_GET['taskid'];
$numberingroup=$_GET['numberingroup'];

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
mysqli_query($link,'use database1');
//查询userid
$query="SELECT userid FROM account WHERE classid='$classid' AND groupid='$groupid' AND numberingroup='$numberingroup'";
$ret=mysqli_query($link,$query);
$stu_info=mysqli_fetch_assoc($ret);
$userid=$stu_info['userid'];
//查询评价状态
$query="SELECT evaluation FROM homework_mood WHERE userid='$userid' AND taskid='$taskid'";
$ret=mysqli_query($link,$query);
$evaluaion_array=mysqli_fetch_assoc($ret);

//查询作业内容
$query="SELECT content,url,urlname FROM report WHERE userid='$userid'AND taskid='$taskid'";
$ret=mysqli_query($link,$query);
mysqli_close($link);
$homeworkcontent_arr=mysqli_fetch_assoc($ret);
$info_arr['content']=$homeworkcontent_arr['content'];
$url_str=$homeworkcontent_arr['url'];
$url_arr=explode(",",$url_str);
$url_arr = array_filter($url_arr);
$info_arr['url']=[];
$info_arr['url']=$url_arr;
$urlname_str=$homeworkcontent_arr['urlname'];
$urlname_arr=explode('@!',$urlname_str);
$urlname_arr = array_filter($urlname_arr);
$info_arr['urlname']=[];
$info_arr['urlname']=$urlname_arr;


//此处可移至前端
$evaluaion=$evaluaion_array['evaluation'];
if($evaluaion=='通过'){
    $evaluaion='作业已通过！';
}
else if ($evaluaion=='待修改') {
    $evaluaion='作业待学生修改！';
}
$info_arr['evaluation']=$evaluaion;
echo(json_encode($info_arr));
/*
$evaluaion_array=mysqli_fetch_assoc($ret);
$evaluaion=$evaluaion_array['evaluation'];
*/
/*
if($evaluaion=='通过'){
    echo(json_encode('作业已通过！'));
    exit();
}
else if ($evaluaion=='待修改') {
    echo(json_encode('作业待学生修改！'));
}
*/
