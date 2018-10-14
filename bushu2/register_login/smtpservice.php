<?php
//******************** smtp配置信息 ********************************
$smtpserver = "smtp.126.com";//SMTP服务器
$smtpserverport = 25;//SMTP服务器端口
$smtpusermail = "xihaoyi@126.com";//SMTP服务器的用户邮箱
$smtpuser = "xihaoyi@126.com";//SMTP服务器的用户帐号，注：部分邮箱只需@前面的用户名
$smtppass = "xx99hh10yy16";//SMTP服务器的用户密码
$mailtitle = "恭喜您注册成功！";//邮件主题
$mailcontent = "欢迎您成为虚拟实习系统的一员！" . "<br>" . "您的邮箱是：" . $_GET['emailaddress'] . "<br>" . "您的密码是：" . $_GET['password'];//邮件内容
$mailtype = "HTML";//邮件格式（HTML/TXT）,TXT为文本邮件

//$emailaddress=$_GET['emailaddress'];

//邮箱发送
$smtp = new Smtp($smtpserver, $smtpserverport, true, $smtpuser, $smtppass);
$smtp->debug = true;
$state = $smtp->sendmail($emailaddress, $smtpusermail, $mailtitle, $mailcontent, $mailtype);