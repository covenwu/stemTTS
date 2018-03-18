<?php
//学生提交作业的后台处理
/*
1.获取taskid
*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
//var_dump($link);
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//选择数据库
mysqli_query($link,'use database1');
//将上传的聊天信息json格式化会导致乱码
$text=$_GET["text"];
//获取id
$id=$_GET['id'];
//获取taskid              //1111 应为动态获取
$taskid=155;
//获取time
$time=date('Y-m-d H:i:s',time());


//删除对应taskid旧记录
$query="delete from homework_history where taskid='$taskid' AND id='$id' ";
mysqli_query($link,$query);

//-----------------对应插入新纪录----------------------------------------------
//单独进行一些子查询以缩短insert指令，增强可读性
$classid="(select(classid) from account where account.id='$id' limit 1)";
$name="(select(name) from account where account.id='$id' limit 1)";

$query="insert into homework_history(time,classid,id,name,taskid,homeworkcontent) values('$time'
          ,$classid,'$id',$name,'$taskid','$text')";

mysqli_query($link,$query);

//回显发送成功提示
echo("success");

