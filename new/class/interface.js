/*数组结构：info_arr[0][userid]=>1
                        [username]=>name1
                        [classid]=>null
                        [groupid]=>null
                    [1][userid]=>2
                        [username]=>name2
                        [classid]=>3
                        [groupid]=>1
*/
//给出如上信息数组
function getStuInfo() {
    var info_arr=[];
    for(var i=0;i<=4;i++){
        info_arr[i]=[];
        info_arr[i]['userid']='userid'+i;
        info_arr[i]['username']='username'+i;
        info_arr[i]['classid']=null;
        info_arr[i]['groupid']=null;
    }
    for(i=5;i<=10;i++){
        info_arr[i]=[];
        info_arr[i]['userid']='userid'+i;
        info_arr[i]['username']='username'+i;
        info_arr[i]['classid']=i;
        info_arr[i]['groupid']=i;
    }
    console.log(info_arr);
    return info_arr;
}

//接受给定参数后将所给id的学生分入指定的班和组
function assignGroup(userid,classid,groupid) {
    return 0;
}

//将指定id的学生变回未分组状态
function resetGroup(userid) {
    return 0;
}