/*//1111部分为未完成部分，请忽略
*/


var student_id=1;           //1111 需要动态获取学生id的方法
//headers数组设置邮件列表的表头
var headers = ["时间", "班级",'操作'];
getData();


function getData(){
    //ajax请求
    $.get("student_get_email.php",{id:student_id},function(data){
        //返回的json数据解码，数据存进data_array
        var data_array=eval(data);
        //eamil为显示邮件列表的div元素
        var email=document.getElementById("email");
        //创建表格
        creatTable(email,headers,data_array);
    })
}


//动态生成列表的函数
function creatTable(parent, headers, datas) {

    var table = document.createElement("table");
    table.id = "tb";
    parent.appendChild(table);

    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    for (var i = 0; i < headers.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = headers[i];
        tr.appendChild(th);
    }

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (var i = 0; i < datas.length; i++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        //在新创建的行内填写除“操作”以外的列
        for (var k in datas[i]) {
            if(k!='emailcontent'){
                var td = document.createElement("td");
                td.innerHTML = datas[i][k];
                tr.appendChild(td);
            }
        }

        /*在新创建的行内填写“操作”列，附加点击展示邮件内容的功能*/
        //设置新建的td元素
        var display= document.createElement("td");
        display.innerHTML = "<a href='javascript:'>显示</a>";
        tr.appendChild(display);
        display.setAttribute('id','display'+i)
        //取得emailcontent内容
        var content=datas[i]['emailcontent'];
        //设置点击展示邮件内容的功能
        var disp=document.getElementById('display'+i);
        disp.onclick = function () {
            document.getElementById("emailcontent").value=content;
        }
    }
}

