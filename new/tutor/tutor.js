/*
提示：
*/
//-----------------常量设置----------------------------------------------
var GROUPNUM = 4;
var EVALUATIONNUM = 4;
var homework = [];
var user_info_array = [];
var sid = getQueryString("sid");

//--------评价作业时的学生信息
var stu_group = 0;
var stu_taskid = 0;
var stu_numberingroup = 0;

//-----------------执行部分----------------------------------------------
getUserInfo();
//getHomework();
setInterval("buttonControl()", 5000);

//-----------------函数定义部分----------------------------------------------
//获取get传值的方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function feedbackEmail() {
    var button = document.getElementById('feedback');
    //禁用提交按钮，防止重复反馈
    button.setAttribute('disabled', 'disabled');
    var emailcontent = document.getElementById("教师反馈").value.trim();
    if (emailcontent == "") {
        alert("您还没输入评价哦，orz");
        button.removeAttribute('disabled');
        return (0);
    }
    // checkallgood 统计所有评价选项   0有中或差  1全为好 2评价没选全
    var checkallgood = checkAllGood();
    if (checkallgood == 1) {
        var evaluation = "通过";
    } else if (checkallgood == 0) {
        evaluation = '待修改';
    } else {
        return false;
    }


    //ajax请求将数据送往后台
    $.get("tutor_feedback_email.php", {
        groupid: stu_group,
        numberingroup: stu_numberingroup,
        taskid: stu_taskid,
        emailcontent: emailcontent,
        evaluation: evaluation,
        sid:sid
    }, function (data) {
        //php文件运行成功返回的data为success
        alert(data);
        buttonControl();
    })
}

//检查一项评价选择的是‘好中差’  0中或差  1好 2未选择
function checkGood(radioName) {
    var obj = document.getElementsByName(radioName);  //这个是以标签的name来取控件
    var uncheckednum = 0;
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].checked) {
            if (obj[i].nextSibling.nodeValue != "好") {
                return 0;
            }
        } else {
            uncheckednum++;
            if (uncheckednum == 3) {
                return 2;
            }
        }
    }
    return 1;
}

//统计所有评价选项   0有中或差  1全为好 2评价没选全
function checkAllGood() {
    var check_result = 0;
    for (var i = 0; i < EVALUATIONNUM; i++) {
        check_result = checkGood("evaluation" + i);
        if (check_result == 2) {
            alert("评价选项没选全哦，orz");
            return 2;
        } else if (check_result == 0) {
            return 0;
        }
    }
    return 1;
}
/*
//取得作业表存入homework数组
function getHomework() {
    $.get("get_homework.php", {sid:sid}, function (data) {
        //此处解析不能通过alert来查看，但可以直接使用
        homework = eval(data);
        buttonControl();
    })
}*/
/*
//控制任务按钮
function buttonControl() {
    for (var i = 0; i < homework.length; i++) {
        var groupid = transferGroupid(homework[i]['groupid']);
        var taskid = homework[i]['taskid'];
        var numberingroup = homework[i]['numberingroup'];
        var id = String(groupid) + String(taskid) + String(numberingroup);
        var button = document.getElementById(id);
        button.removeAttribute("disabled");
        $("#" + id).css("background-color", "blue");
    }
}


*/

//控制任务按钮
function buttonControl() {
    $.get("button_control.php", {sid:sid}, function (data) {
        //此处解析不能通过alert来查看，但可以直接使用
        var homeworkmood = eval(data);
        for(var i=0;i<homeworkmood.length;i++){
            var numberingroup=homeworkmood[i]['numberingroup'];
            //按规则求出按钮的id，规则为：id三位命名数字分别为：组号，taskid，numberingroup
            var id=homeworkmood[i]['groupid'].toString()+homeworkmood[i]['taskid']+numberingroup;
            var button=document.getElementById(id);
            var evaluation=homeworkmood[i]['evaluation'];
            if(evaluation=='通过'){
                button.removeAttribute("disabled");
                button.style.background='red';
            }
            else if(evaluation=='批改中'){
                button.removeAttribute("disabled");
                button.style.background='blue';
            }
        }
    })

}
/*
//将groupid转换为教师管理的小组编号，返回编号 例： 13->group1 ，return 1
function transferGroupid(groupid) {
    for (var i = 0; i < GROUPNUM; i++) {
        if (user_info_array['group' + i] == groupid) {
            return (i);
        }
    }
}
*/
/*
//点击按钮查看学生作业的处理
function dialog(group, taskid, numberingoup) {
    for (var i = 0; i < homework.length; i++) {
        if (homework[i]['groupid'] == user_info_array['group' + group] && homework[i]['numberingroup'] == numberingoup && homework[i]['taskid'] == taskid) {
            document.getElementById('学生作业').value = homework[i]['homeworkcontent'];
        }
    }
    stu_group = group;
    stu_numberingroup = numberingoup;
    stu_taskid = taskid;
    //检查作业的批改状态
    var groupid = user_info_array['group' + stu_group];
    $.get("check_homework_evaluation.php", {
        groupid: groupid,
        numberingroup: stu_numberingroup,
        taskid: stu_taskid
    }, function (data) {
        var message = eval(data);
        var button = $("#feedback");
        var textarea = document.getElementById("教师反馈");
        if (message == '作业已通过！' || message == '作业待学生修改！') {
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = message;
            button.hide();
        } else {
            textarea.value = "";
            textarea.removeAttribute('readonly')
            button.show();
            document.getElementById('feedback').removeAttribute('disabled');
        }
    });
    openDialog();

}
*/
function dialog(groupid, taskid, numberingroup) {
    stu_group = groupid;
    stu_numberingroup = numberingroup;
    stu_taskid = taskid;

    $.get("check_homework_evaluation.php", {
        groupid: stu_group,
        numberingroup: stu_numberingroup,
        taskid: stu_taskid,
        sid:sid
    }, function (data) {
        //alert(data)
        var info_arr=JSON.parse(data);

        //alert(info_arr['evaluation']);
        var message=info_arr['evaluation'];
        //alert(message)
        document.getElementById('学生作业').value =info_arr['content'];
        //var message = eval(data);
        var button = $("#feedback");
        var textarea = document.getElementById("教师反馈");
        if (message == '作业已通过！' || message == '作业待学生修改！') {
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = message;
            button.hide();
        } else {
            textarea.value = "";
            textarea.removeAttribute('readonly')
            button.show();
            document.getElementById('feedback').removeAttribute('disabled');
        }
    });
    openDialog();
}
/*
//开关评价学生作业界面
$(function () {
})
*/
function openDialog() {
    document.getElementById('light').style.display = 'block';
    document.getElementById('fade').style.display = 'block'
}

function closeDialog() {
    document.getElementById('light').style.display = 'none';
    document.getElementById('fade').style.display = 'none'
}

//取得$_SESSION中的用户信息
function getUserInfo() {
    $.get("../all/get_user_info.php", {sid:sid}, function (data) {
        //返回的json数据解码，数据存进user_info_array
        user_info_array = eval(data);
    })
}




