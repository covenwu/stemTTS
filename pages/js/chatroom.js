/**/

//-----------------执行部分----------------------------------------------
//-----------------设置变量---------------------
// 记录当前获取到的消息id的最大值，防止获取到重复的信息
// 服务器只返回maxid以后的消息
var maxId = 0;

//-----------------设置事件------------------
// 设置onload事件
window.onload = function(){
    // 轮询以实现自动的页面更新
    setInterval("showmessage()",1500);
};


//-----------------函数定义部分----------------------------------------------
//显示聊天内容的函数
function showmessage(){
    //ajax请求
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if(ajax.readyState==4) {
            // 将获取到的字符串存入data变量
            eval('var data = '+ajax.responseText);
            // 遍历data数组，把内部的信息一个个的显示到页面上
            var s = "";
            for(var i = 0 ; i < data.length;i++){
                //data[i];
                s += "("+data[i].add_time+") >>>";
                s += "<p style='color:"+data[i].color+";'>";
                s += data[i].sender +"&nbsp;对&nbsp;" + data[i].receiver +"&nbsp;&nbsp;"+ data[i].biaoqing+"说：" + data[i].msg;
                s += "</p>";
                // 把已经获得的最大信息id更新
                maxId = data[i].id;
            }
            // 显示聊天内容（onload事件）
            var showmessage = document.getElementById("up");
            showmessage.innerHTML += s;
            //showmessage.scrollTop 可以实现div底部最先展示
            // divnode.scrollHeight而已获得div的高度包括滚动条的高度
            showmessage.scrollTop = showmessage.scrollHeight-showmessage.style.height;
        }
    };
    ajax.open('get','./chatroom.php?maxId='+maxId);
    ajax.send(null);
}

//发送聊天消息的函数
function send(){
    var form = document.getElementsByTagName('form')[0];
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(form);
    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4) {
            //提示区会提示success表示发送成功
            document.getElementById("result").innerHTML = xhr.responseText;
            //2秒后提示信息消失
            setTimeout("hideresult()",2000);
        }
    };
    xhr.open('post','./chatroom_insert.php');
    xhr.send(formdata);
    //自动清空输入框
    document.getElementById("msg").value="";
}

// 清楚提示发送成功的消息
function hideresult(){
    document.getElementById('result').innerHTML = "";
}

