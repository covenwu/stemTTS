<?php
header("content-type:text/html;charset=utf-8");
//******************** smtp配置信息 ********************************
$smtpserver = "smtp.126.com";//SMTP服务器
$smtpserverport = 25;//SMTP服务器端口
$smtpusermail = "xihaoyi@126.com";//SMTP服务器的用户邮箱
$smtpuser = "xihaoyi@126.com";//SMTP服务器的用户帐号，注：部分邮箱只需@前面的用户名
$smtppass = "xx99hh10yy16";//SMTP服务器的用户密码
$mailtitle = "恭喜您注册成功！";//邮件主题
$mailcontent = "欢迎您成为虚拟实习系统的一员！"."<br>"."您的账号是：".$_POST['username']."<br>"."您的密码是：".$_POST['password'];//邮件内容
$mailtype = "HTML";//邮件格式（HTML/TXT）,TXT为文本邮件
//************************ 配置信息 ****************************
//声明变量
$password = isset($_POST['password'])?$_POST['password']:"";
$re_password = isset($_POST['re_password'])?$_POST['re_password']:"";
$email = isset($_POST['email'])?$_POST['email']:"";
$name=isset($_POST['name'])?$_POST['name']:"";
$username = isset($_POST['username'])?$_POST['username']:"";
$role=isset($_POST['role'])?$_POST['role']:"";
$re_email=isset($_POST['re_email'])?$_POST['re_email']:"";
//引用邮件类
require_once "Smtp.class.php";
if($email!=$re_email){
    header("Location:register.php?err=4");
}
else if($password == $re_password) {
    //建立连接
    $conn =mysqli_connect('localhost:3306','root','12345678') ;
    $res=mysqli_set_charset($conn,'utf8');
    //选择数据库
    mysqli_query($conn,'use database1');
    //准备SQL语句,查询用户名
    $sql_select="SELECT account FROM account WHERE account = '$username'";
    $sql_select1="SELECT email FROM account WHERE email='$email'";
    //执行SQL语句
    $ret = mysqli_query($conn,$sql_select);
    $ret1=mysqli_query($conn,$sql_select1);
    $row = mysqli_fetch_array($ret);
    $row1= mysqli_fetch_array($ret1);
    //判断用户名是否已存在
    if($username == $row['account']) {
        //反馈用户名已存在
        header("Location:register.php?err=1");
    }
    else if($email==$row1['email']){
        header("Location:register.php?err=5");
    }
    else{
        //用户名不存在，插入数据语句
        $sql_insert = "INSERT INTO account(account,password,name,email,role) VALUES('$username','$password','$name','$email','$role')";
        //邮箱发送
        $smtp = new Smtp($smtpserver, $smtpserverport, true, $smtpuser, $smtppass);
        $smtp->debug = true;
        $state = $smtp->sendmail($email, $smtpusermail, $mailtitle, $mailcontent, $mailtype);
        //执行数据插入
        mysqli_query($conn, $sql_insert);
        //反馈注册成功情况
        header("Location:register.php?err=3");
    }
    //关闭数据库
    mysqli_close($conn);
} else {
    //反馈密码不一致情况
    header("Location:register.php?err=2");
}

?>