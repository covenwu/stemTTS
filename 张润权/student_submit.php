<?php
//学生提交作业的后台处理
/*1.获取时间方法有问题
2.插入语句调整
3.获取taskid
*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
//var_dump($link);
$res=mysqli_set_charset($link,'utf8');


//选择数据库
mysqli_query($link,'use database1');
//将上传的聊天信息json格式化会导致乱码
$msg=$_GET["msg"];
//获取id
$id=$_GET['id'];
//获取taskid
$taskid=123;
//获取time        此方法时区错误
$time=date('Y-m-d H:i:s',time());


//删除对应taskid旧记录
$query="delete from homework_history where taskid='$taskid' AND id='$id' ";
mysqli_query($link,$query);
//插入对应taskid新纪录             //1111 应使用limit1提高性能，应调整格式增强可读性
$query="insert into homework_history(time,classid,id,name,taskid,homeworkcontent) values('$time'
  ,(select(classid) from account where account.id='$id'),'$id',(select(name) from account where account.id='$id')
 ,'$taskid','$msg')";

mysqli_query($link,$query);

//回显发送成功提示
echo("success");

