<?php
/*
 功能：1.处理注册信息，注册失败时返回错误码
 接口：1.$_POST接收'配置信息'中‘获取变量’部分中的变量
 提示：1.初始任务id设置为1

 */
header("content-type:text/html;charset=utf-8");

//************************ 配置信息 ****************************
//获取变量
$password = isset($_POST['password']) ? $_POST['password'] : "";
$re_password = isset($_POST['re_password']) ? $_POST['re_password'] : "";
$emailaddress = isset($_POST['emailaddress']) ? $_POST['emailaddress'] : "";
$username = isset($_POST['username']) ? $_POST['username'] : "";
$role ='student';
$re_emailaddress = isset($_POST['re_emailaddress']) ? $_POST['re_emailaddress'] : "";
//引用邮件类
require_once "Smtp.class.php";
if ($emailaddress != $re_emailaddress) {
    echo 4;
} else if ($password == $re_password) {

    //-----------------连接mysql服务器----------------------------------------------
    require '../all/mysqllink.php';

    //准备SQL语句,查询用户名
    $sql_select = "SELECT username FROM account WHERE username = '$username' limit 1";
    $sql_select1 = "SELECT emailaddress FROM account WHERE emailaddress='$emailaddress' limit 1";
    //执行SQL语句
    $ret = mysqli_query($link, $sql_select);
    $ret1 = mysqli_query($link, $sql_select1);
    $row = mysqli_fetch_array($ret);
    $row1 = mysqli_fetch_array($ret1);
    //判断用户名是否已存在
    if ($username == $row['username']) {
        //反馈用户名已存在
        //header("Location:register.php?err=1");
        echo 1;
    } else if ($emailaddress == $row1['emailaddress']) {
        //header("Location:register.php?err=5");
        echo 5;
    } else {
        //用户名不存在，插入数据语句
        $sql_insert = "INSERT INTO account(username,password,emailaddress,role) VALUES('$username','$password','$emailaddress','$role')";
        //执行数据插入
        mysqli_query($link, $sql_insert);
        //反馈注册成功情况
        //header("Location:register.php?err=3");
        echo 3;
        mysqli_close($link);
        //header("Location:smtpservice.php?emailaddress=".$emailaddress."&password=".$password);
    }
    //关闭数据库
    mysqli_close($link);
} else {
    //反馈密码不一致情况
    header("Location:register.php?err=2");
}

?>