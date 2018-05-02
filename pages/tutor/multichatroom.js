/*
功能：在教师页面显示多个聊天室
接口：1.需要获得teacher的id
      2.接受服务器端传回的存于相关数组的聊天记录（json）
      3.每个教师管理的小组为固定个数var group_num
      4.将前端聊天信息显示的元素id设为chatcontent0,chatcontent1....
      5.需要jquery
      6.每个聊天室有chatroomid（0-3）来做区分，其每个子模块的id均为模块名+chatroomid，例如result0，chatcontent2
      7.发送聊天信息时提供chatroomid给后端，
提示：1.teacher_id暂定保存在服务器端
待办：1.get列表用id
 */

var maxid=0;
var group_num=4;

//-----------------设置事件------------------
// 设置onload事件
window.onload = function(){
    // 轮询以实现自动的页面更新
    setInterval(function () {get_chat_data();},1500);
    setInterval("updateGetOnlineuser()",2000);

};


function get_chat_data(){
    //ajax请求
    $.get("get_chat_data.php",{sid:sid,maxid:maxid},function(data){
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        var s="";
        for(var k=0;k<group_num;k++){
            for(var i=0;i<data[k].length;i++){
                s += "("+data_array[k][i].add_time+") >>>";
                s += "<p>";
                s += data_array[k][i].sender +"&nbsp;"+"说：" + data_array[k][i].msg;
                s += "</p>";
            }
            //maxid增加这一组这一次接收的聊天信息条数
            maxid+=data[k].length;
            // 显示聊天内容（onload事件）
            var showmessage = document.getElementById("chatcontent"+k);
            showmessage.innerHTML += s;
            //重置s
            s="";
            //showmessage.scrollTop 可以实现div底部最先展示
            // divnode.scrollHeight而已获得div的高度包括滚动条的高度
            showmessage.scrollTop = showmessage.scrollHeight-showmessage.style.height;
        }

    })
}

//发送聊天消息的函数
function send(chatroomid) {
    var form =document.getElementById('chatform'+chatroomid);
    //将取得的表单数据转换为formdata形式，在php中以$_POST['name']形式引用
    var formdata = new FormData(form);
    formdata.append('chatroomid',chatroomid);
    formdata.append('sid',sid);

    //ajax请求
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4) {
            //提示区会提示success表示发送成功
            document.getElementById("result"+chatroomid).innerHTML = xhr.responseText;
            //2秒后提示信息消失
            setTimeout(function () { hideresult(chatroomid) },2000);
        }
    };
    xhr.open('post','./multichatroom_insert.php');
    xhr.send(formdata);
}

// 清除提示发送成功的消息
function hideresult(chatroomid){
    document.getElementById('result'+chatroomid).innerHTML = "";
}


function updateGetOnlineuser() {
    var chatroomid;
    for (chatroomid=0;chatroomid<4;chatroomid++){
        (function (chatid) {
            //ajax请求
            $.get("update_get_onlineuser.php",{sid:sid,chatroomid:chatid},function(data){
                //返回的json数据解码，数据存进data_array
                var data_array=eval(data);
                var onlineuserlist=$("#onlineuserlist"+chatid);
                onlineuserlist.empty();
                var onlineusername="";
                for(var k in data_array){
                    onlineusername=data_array[k]["username"];
                    onlineuserlist.append("<option value=''>"+onlineusername+"</option>");
                }
            })
        })(chatroomid)
    }
}

