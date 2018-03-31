<!DOCTYPE html>
<html>
<!--
 功能：1.登录成功时，将所有该用户的帐号数据（account表）加载到session，以避免之后对数据库中账户信息的反复查询
       2.出错跳转到本页面会显示“你无权访问”
       3.根据用户身份跳转到不同页面
 接口：1.由'loginaction.php'在登录成功时跳转到本页
       2.需要获取$_SESSION['emailaddress']
       3.依据身份跳转到student.html, teacher.html
 提示：1.去掉html部分
        2.未对$_SESSION["role']检查是否存在

 -->
<head>
    <title>登录成功</title>
    <meta name="content-type"  charset=UTF-8">
</head>
<body>
<div>
    <?php
    header("content-type:text/html;charset=utf-8");
    //-----------------连接mysql服务器----------------------------------------------------------
    $link =mysqli_connect('localhost:3306','root','12345678') ;
    $res=mysqli_set_charset($link,'utf8');
    //选择数据库
    mysqli_query($link,'use database1');


    //开启session
    session_start();
    //获取变量
    $emailaddress= isset($_SESSION['emailaddress'])?$_SESSION['emailaddress']:"";
    //判断session是否为空
    if(!empty($emailaddress)){
        ?>
        <h1>登录成功！</h1>
        欢迎您！
        <?php
        echo $emailaddress;
        //-----------------获取所有用户信息，存入session-----------------------------------------
        $query_select="SELECT * FROM account WHERE emailaddress='$emailaddress' limit 1";
        $ret=mysqli_query($link,$query_select);
        $row=mysqli_fetch_assoc($ret);
        //可能出现不能引用的错误                                                                   11111
        //将信息存储到session
        foreach ($row as $key => $value){
            $_SESSION[$key]=$value;
        }
        //根据用户身份跳转到不同页面
        if($_SESSION['role']=='student'){
            header("Location:../student/student.html");
        }
        elseif ($_SESSION['role']=="tutor"){
            $userid=$_SESSION['userid'];
            $query_select="SELECT * FROM teacher_group WHERE userid='$userid'";
            $ret=mysqli_query($link,$query_select);
            $row=mysqli_fetch_assoc($ret);
            //将信息存储到session
            foreach ($row as $key => $value){
                $_SESSION[$key]=$value;
            }
            header("Location:../tutor/tutor.html");
        }

        ?>
        <br/>
        <?php
    }else {
        //未登录，无权访问
        ?>
        <h1>你无权访问！！！</h1>
        <?php
    }
    ?>
</div>
</body>
</html>