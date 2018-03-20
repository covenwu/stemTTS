
// 记录当前获取到的id的最大值，防止获取到重复的信息
var maxId = 0;
function showmessage(){
    var ajax = new XMLHttpRequest();
    // 从服务器获取并处理数据
    ajax.onreadystatechange = function(){
        if(ajax.readyState==4) {
            //alert(ajax.responseText);
            // 将获取到的字符串转换成实体
            eval('var data = '+ajax.responseText);
            // 遍历data数组，把内部的信息一个个的显示到页面上
            var s = "";
            for(var i = 0 ; i < data.length;i++){
                data[i];
                s += "("+data[i].add_time+") >>>";
                s += "<p style='color:"+data[i].color+";'>";
                s += data[i].sender +"&nbsp;对&nbsp;" + data[i].receiver +"&nbsp;&nbsp;"+ data[i].biaoqing+"说：" + data[i].msg;
                s += "</p>";
                // 把已经获得的最大的记录id更新
                maxId = data[i].id;
            }
            // 开始向页面时追加信息
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

// 更新信息的执行时机
window.onload = function(){
        //showmessage();
        // 制作轮询,实现自动的页面更新
        setInterval("showmessage()",3000);
    };
