<?php
//导师发送反馈邮件的后台处理
/*

*/

//-----------------连接mysql服务器----------------------------------------------
$link =mysqli_connect('localhost:3306','root','12345678') ;
//var_dump($link);
$res=mysqli_set_charset($link,'utf8');
//设置时区保证时间戳正确
date_default_timezone_set('PRC');

//选择数据库
mysqli_query($link,'use database1');

//-----------------提取ajax请求附带信息----------------------------------------------
$text=$_GET["emailcontent"];
//获取id
$id=$_GET['id'];
//获取time
$time=date('Y-m-d H:i:s',time());


//-----------------对应插入新纪录----------------------------------------------
//单独进行一些子查询以缩短insert指令，增强可读性
$classid="(select(classid) from account where account.id='$id' limit 1)";
$name="(select(name) from account where account.id='$id' limit 1)";

$query="insert into email_history(time,classid,id,name,emailcontent) values('$time'
          ,$classid,'$id',$name,'$text')";

mysqli_query($link,$query);

//回显发送成功提示
echo("success");
