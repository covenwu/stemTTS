<?php
/*
接口：1.教师对应小组数固定，通过$group_num设置
      2.从GET,session,见下方源代码‘获取接口变量’
        3.$_SESSION['group0'],$_SESSION['group1']...
待办：1.groupid等信息由session获取
*/
header("Content-Type:application/json");
//常量设置
//教师对应小组数
$group_num=4;


//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
$res=mysqli_set_charset($link,'utf8');
//选择数据库
mysqli_query($link,'use database1');

session_start();
//-----------------获取接口变量----------------------------------------------
$userid=$_SESSION['userid'];
$maxid=$_GET["maxid"];



//$chat_data数组用来存放聊天信息
$chat_data=array();

//依据groupid取聊天数据存入$chat_data
for($i=0;$i<$group_num;$i++){
    $groupid=$_SESSION["group".(string)$i];
    $query="select * from message where groupid='$groupid'and messageid>'$maxid'";
    $result=mysqli_query($link,$query);

    $info = array();
    while($rst =mysqli_fetch_assoc($result)){
        $info[] = $rst;
    }
    $chat_data[$i]=$info;
    unset($info);
}

echo (json_encode($chat_data));



