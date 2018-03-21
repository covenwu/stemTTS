var student_id=1;

window.onload=function (ev) {
    setInterval("updateGetOnlineuser()",2000);
};

function updateGetOnlineuser() {
    //ajax请求
    $.get("update_get_onlineuser.php",{id:student_id},function(data){
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        //测试显示id表
        document.getElementById("id").value=null;
        var s="";
        for(var k in data_array){
            s+=data_array[k]["id"];
        }
        document.getElementById("id").value=s;

    })
}


