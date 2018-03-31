<?php
/*
 功能：1.处理注册信息，注册失败时返回错误码
 接口：1.$_POST接收'配置信息'中‘获取变量’部分中的变量
 提示：1.初始任务id设置为1

 */
header("content-type:text/html;charset=utf-8");
//******************** smtp配置信息 ********************************
$smtpserver = "smtp.126.com";//SMTP服务器
$smtpserverport = 25;//SMTP服务器端口
$smtpusermail = "xihaoyi@126.com";//SMTP服务器的用户邮箱
$smtpuser = "xihaoyi@126.com";//SMTP服务器的用户帐号，注：部分邮箱只需@前面的用户名
$smtppass = "xx99hh10yy16";//SMTP服务器的用户密码
$mailtitle = "恭喜您注册成功！";//邮件主题
$mailcontent = "欢迎您成为虚拟实习系统的一员！"."<br>"."您的邮箱是：".$_POST['emailaddress']."<br>"."您的密码是：".$_POST['password'];//邮件内容
$mailtype = "HTML";//邮件格式（HTML/TXT）,TXT为文本邮件
//************************ 配置信息 ****************************
//获取变量
$password = isset($_POST['password'])?$_POST['password']:"";
$re_password = isset($_POST['re_password'])?$_POST['re_password']:"";
$emailaddress = isset($_POST['emailaddress'])?$_POST['emailaddress']:"";
$username = isset($_POST['username'])?$_POST['username']:"";
$role=isset($_POST['role'])?$_POST['role']:"";
$re_emailaddress=isset($_POST['re_emailaddress'])?$_POST['re_emailaddress']:"";
//引用邮件类
require_once "Smtp.class.php";
if($emailaddress!=$re_emailaddress){
    header("Location:register.php?err=4");
}
else if($password == $re_password) {
    //-----------------连接mysql服务器----------------------------------------------
    $conn =mysqli_connect('localhost:3306','root','12345678') ;
    $res=mysqli_set_charset($conn,'utf8');
    //选择数据库
    mysqli_query($conn,'use database1');

    //准备SQL语句,查询用户名
    $sql_select="SELECT username FROM account WHERE username = '$username'";
    $sql_select1="SELECT emailaddress FROM account WHERE emailaddress='$emailaddress'";
    //执行SQL语句
    $ret = mysqli_query($conn,$sql_select);
    $ret1=mysqli_query($conn,$sql_select1);
    $row = mysqli_fetch_array($ret);
    $row1= mysqli_fetch_array($ret1);
    //判断用户名是否已存在
    if($username == $row['username']) {
        //反馈用户名已存在
        header("Location:register.php?err=1");
    }
    else if($emailaddress==$row1['emailaddress']){
        header("Location:register.php?err=5");
    }
    else{
        //用户名不存在，插入数据语句
        $sql_insert = "INSERT INTO account(username,password,emailaddress,role,taskidnow) VALUES('$username','$password','$emailaddress','$role',1)";
        //邮箱发送
        $smtp = new Smtp($smtpserver, $smtpserverport, true, $smtpuser, $smtppass);
        $smtp->debug = true;
        $state = $smtp->sendmail($emailaddress, $smtpusermail, $mailtitle, $mailcontent, $mailtype);
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