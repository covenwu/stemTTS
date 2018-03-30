<?php
/*
接口：1.教师对应小组数固定，通过$group_num设置
      2.返回存储聊天信息的json编码相关数组（）
提示：1.暂定使用id作为身份标识
      2.session中用id字段记录id
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
/*
//从session取得id
session_start();
$teacher_id=$_SESSION['id'];*/
//测试
$teacher_id=1;
//取得maxid
$maxid=$_GET["maxid"];
//测试                                            1111
//$maxid=0;

//查询教师管理的小组的groupid
$query="select * from teacher_group where id='$teacher_id' limit 1";
$result=mysqli_query($link,$query);
$row=mysqli_fetch_assoc($result);


//$chat_data数组用来存放聊天信息
$chat_data=array();

//依据groupid取聊天数据存入$chat_data
for($i=0;$i<$group_num;$i++){
    $groupid=$row["group".(string)$i];
    $query="select * from message where groupid='$groupid'and id>'$maxid'";
    $result=mysqli_query($link,$query);
    //$data=mysqli_fetch_all($result,1);
    //$data=mysqli_fetch_array($result,1);
    $info = array();
    while($rst =mysqli_fetch_assoc($result)){
        $info[] = $rst;
    }
    $chat_data[$i]=$info;
    unset($info);
}

echo (json_encode($chat_data));


?>
