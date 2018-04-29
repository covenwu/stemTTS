
window.onload=function (ev) {
    setInterval("updateGetOnlineuser()",2000);
};

function updateGetOnlineuser() {
    //ajax请求
    $.get("update_get_onlineuser.php",function(data){
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        var onlineuserlist=$("#onlineuserlist");
        onlineuserlist.empty();
        var onlineusername="";
        /*for(var k in data_array){
            onlineusername=data_array[k]["username"];
            onlineuserlist.append("<option value=''>"+onlineusername+"</option>");
        }*/

    })
}


