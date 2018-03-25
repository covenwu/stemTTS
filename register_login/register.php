<!DOCTYPE html>
<html>
<head>
    <title>注册</title>
    <meta name="content-type"; charset=UTF-8">
</head>
<body>
<div class="content" align="center">
    <!--头部-->
    <div class="header">
        <h1>注册页面</h1>
    </div>
    <!--中部-->
    <div class="middle">
        <form action="registeraction.php" method="post">
            <table border="0">
                <tr>
                    <td>用户名：</td>
                    <td><input type="text" id="id_name" name="username" required="required"></td>
                </tr>
                <tr>
                    <td>密&nbsp;&nbsp;&nbsp;码：</td>
                    <td><input type="password" id="password" name="password" required="required"></td>
                </tr>
                <tr>
                    <td>重复密码：</td>
                    <td><input type="password" id="re_password" name="re_password" required="required"></td>
                </tr>
                <tr>
                    <td>身&nbsp;&nbsp;&nbsp;份：</td>
                    <td>
                        <input type="radio" id="role" name="role" value="admin">管理员
                        <input type="radio" id="role" name="role" value="tutor">教师
                        <input type="radio" id="role" name="role" value="studnt">学生
                    </td>
                </tr>
                <tr>
                    <td>姓&nbsp;&nbsp;&nbsp;名：</td>
                    <td><input type="text" id="name" name="name" required="required"></td>
                </tr>
                <tr>
                    <td>Email：</td>
                    <td><input type="email" id="email" name="email" required="required"></td>
                </tr>
                <tr>
                    <td>重复Email：</td>
                    <td><input type="email" id="re_email" name="re_email" required="required"></td>
                </tr>
                <tr>
                    <td colspan="2" align="center" style="color:red;font-size:10px;">
                        <!--提示信息-->
                        <?php
                        header("content-type:text/html;charset=utf-8");//防止文字乱码
                        $err=isset($_GET["err"])?$_GET["err"]:"";
                        switch($err) {
                            case 1:
                                echo "用户名已存在！";
                                break;
                            case 2:
                                echo "密码与重复密码不一致！";
                                break;
                            case 3:
                                echo "注册成功！";
                                break;
                            case 4:
                                echo "两次输入的邮箱不一致！";
                                break;
                            case 5:
                                echo "邮箱已被注册！";
                                break;
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <input type="submit" id="register" name="register" value="注册">
                        <input type="reset" id="reset" name="reset" value="重置">
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        如果已有账号，快去<a href="login.php">登录</a>吧！
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <!--脚部-->
    <div class="footer">
        <small>Copyright &copy; 版权所有·欢迎翻版
    </div>
</div>
</body>
</html>