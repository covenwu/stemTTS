/*
1.numberingroup的计算可能出现问题
2.在使用中分组可能出现问题
 */


//-----------------参数设置----------------------------------------------
var GROUPNUM=4;
var MAXSTUNUM=5;
//-----------------全局变量----------------------------------------------
//存储学生信息的数组（未分组默认为0班0组） classid和groupid与数组索引对应 例：一班一组 info_stu[1][1]
var info_stu=[];
//存储班级名信息的数组 索引从0开始，为classid-1，从一班开始
var info_class=[];
//记录当前正在编辑的班级的classid 值为0时约定为没有打开编辑任何班级
var classidnow=0;
//使用一次便会自加的全局变量，用于获取一个不会重复的数字，配套noSame()函数使用
var NOSAMECOUNT=1000;
//-----------------执行部分----------------------------------------------
getStuInfo();
/*
document.getElementById('test').onclick=function (ev) {
    var datesdiv=document.getElementById('datesdiv');
    document.getElementById('datesdiv').innerHTML='';
    var ul=document.createElement('ul');
    ul.id='dates';
    var li=document.createElement('li');
    var a=document.createElement('a');
    a.innerHTML='banji';
    li.appendChild(a);
    ul.appendChild(li);
    datesdiv.appendChild(ul);
    li=document.createElement('li');
    a=document.createElement('a');
    a.innerHTML='班级2';
    li.appendChild(a);
    ul.appendChild(li);
    $().timelinr({
    })


};*/

/*数组结构：info_arr[0][userid]=>1
                        [username]=>name1
                        [classid]=>null
                        [groupid]=>null
                    [1][userid]=>2
                        [username]=>name2
                        [classid]=>3
                        [groupid]=>1
*/
/*
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
*/

/*1.班级索引从1开始，0班为未分班的学生班级号*/

//-----------------获取信息----------------------------------------------
//得到有所有学生的信息，存入全局数组info_stu
function getStuInfo() {
    $.ajax({
        url:'get_stu_info.php',
        success:function (data) {
            var info=JSON.parse(data);
            info_class=info['classinfo'];
            //初始化info_stu
            initializeStu(info_class,info_stu);
            //将信息处理后存入info_stu
            divide(info['stu'],info_stu);
            makeUI();
            console.log('getStuinfo(): ');
            console.log(info)
        }
    })
}
//根据班级信息初始化info_stu 参数：info_class,info_stu
function initializeStu(classinfo,stuinfo) {
    var len=classinfo.length;
    for(var i=0;i<len;++i){
        var classid=classinfo[i]['classid'];
        stuinfo[classid]=[];
        initializeGroup(classid,info_stu);
    }
    //只有0班有0组
    stuinfo[0]=[];
    stuinfo[0][0]=[];
}
//初始化info_stu中一个空班级下的所有小组   参数：info_stu中的班级 例：info_stu[1]
function initializeGroup(classid,stuinfo) {
    info_stu[classid]=[];
    for(var i=0;i<GROUPNUM;++i){
        //索引换算
        info_stu[classid][i+1]=[];
    }
}
//将服务器返回的学生信息数组整理成新结构 参数：后台获取的学生信息数组，info_stu
function divide(info,stuinfo) {

    console.log('divide stuinfo')
    console.log(info)
    var len=info.length;
    for(var i=0;i<len;i++){
        var classid=info[i]['classid'];
        var groupid=info[i]['groupid'];
        stuinfo[classid][groupid].push(info[i]);
    }
    console.log('divide():');
    console.log(stuinfo);
}
//生成依赖数据的界面                                                                                     1111
function makeUI(){
    noClassList('noclass',info_stu[0][0]);
    classManageUI('l1',info_class);
    //classSelectUI('dates',info_class);
    classSelectUI('classlist',info_class);
    var button=document.getElementById('newclass');
    button.onclick=function (ev) {
        createClass(info_class);
        document.getElementById('i1').value='';
    }
}
//生成未分班学生的界面 参数：父元素id，未分班学生的数组(0班0组）
function noClassList(parentid,stuarr) {
    var ul=document.getElementById(parentid);
    ul.innerHTML='<li >报名学员</li>';
    var len=stuarr.length;
    for (var i=0;i<len;++i){
        var id='drag'+noSame();
        var li=li_stu(stuarr[i]['username'],id,stuarr[i]['classid'],stuarr[i]['groupid'],stuarr[i]['userid']);
        //将学生在0班数组中的索引存储下来
        //li.setAttribute('index',i);
        //绑定元素
        ul.appendChild(li);
    }
}
//生成一个学生可拖块的li标签  参数：显示的文字,id  返回值：li标签
function li_stu(text,id,classid,groupid,userid) {
    var li=document.createElement('li');
    li.setAttribute('class','stu');
    li.setAttribute('style','margin:0;background-color: #F0F8FF');
    li.setAttribute('draggable','true');
    li.setAttribute('ondragstart',"drag(event)");
    li.setAttribute('classid',classid);
    li.setAttribute('groupid',groupid);
    li.setAttribute('userid',userid)
    li.innerHTML=text;
    li.id=id;
    return li;
}
//生成新建和删除班级的界面  参数：父元素id，info_class
function classManageUI(parentid,classarr){
    var parent=document.getElementById(parentid);
    parent.innerHTML='';
    var len=classarr.length;
    for(var i=0;i<len;++i){
        //创建button标签
        var button=document.createElement('button');
        button.style="border-radius:5px;height:50px;width:200px;text-align:center;font-size:16px;line-height:40px;";
        var classid=classarr[i]['classid'];
        button.innerHTML=classarr[i]['classname'];
        //创建a标签
        var a=document.createElement('a');
        a.setAttribute('classid',classid);
        a.style="float:right";
        a.onclick= function (ev) {
            //注意变量名
            var clasid=this.getAttribute('classid');
            deleteClass(clasid);
        };
        //创建img标签
        var img=document.createElement('img');
        img.setAttribute('border','0');
        img.src='image/1.png';
        //绑定元素
        a.appendChild(img);
        button.appendChild(a);
        parent.appendChild(button);
    }
}
//生成班级选择时间轴的界面  参数：父元素id，info_class                                                 1111
function classSelectUI(parentid,classinfo) {
    var parent=document.getElementById(parentid);
    var len=classinfo.length;
    parent.innerHTML='<li >班级列表</li>';
    for(var i=0;i<len;++i){
        var li=li_class(classinfo[i]['classname'],classinfo[i]['classid']);
        parent.appendChild(li);
    }
    $().timelinr({
    })
}
//生成一个班级选择时间轴所需的li标签 参数：班级名，classid  返回值：li标签
function li_class(text,classid) {
    var li=document.createElement('li');
    var a=document.createElement('a');
    a.innerHTML=text;
    a.setAttribute('classid',classid);
    a.onclick=function (ev) {
        groupUI(classid,info_stu);
        classidnow=Number(this.getAttribute('classid'));
        console.log('classidnow')
        console.log(classidnow)
    };
    li.appendChild(a);
    return li;
}
//组一到四的界面  参数：ckassid, info_stu
function groupUI(classid,stuarr) {
    resetGroup();
    //得到班级在info_stu中的索引
    var index=ctoi_stu(classid);
    for(var i=0;i<GROUPNUM;++i){
        //解决测试数据不完整的问题
        if(typeof (stuarr[index][i+1])=='undefined'){
            continue;
        }
        var div=document.getElementById('groupdiv'+(i+1));
        //注意组号索引换算
        var group=stuarr[index][i+1];
        var len=group.length;
        for(var j=0;j<len;++j){
            var id='drag'+noSame();
            var li=li_stu(group[j]['username'],id,group[j]['classid'],group[j]['groupid'],group[j]['userid']);
            div.appendChild(li);
        }
    }
}
//清除组一到四的内容
function resetGroup() {
    for(var i=0;i<GROUPNUM;++i){
        var div=document.getElementById('groupdiv'+(i+1));
        div.innerHTML='';
    }
}

//接受给定参数后将所给id的学生定的班和组
function assignStu(userid,classid,groupid,oldclassid,oldgroupid,stuinfo) {
    var nig=getNumberingroup(stuinfo[classid][groupid]);
    //数据库处理
    $.ajax({
        url:'assign_stu.php',
        data:{userid:userid,classid:classid,groupid:groupid,numberingroup:nig},
        success:function (data) {
            console.log('assignGroup() '+data);
        }
    });
    //前端数组处理
    var oldgroup=info_stu[oldclassid][oldgroupid];
    for(var i=0;i<oldgroup.length;i++){
        if(oldgroup[i]['userid']==userid){
            console.log('user found')
            //向被分入的小组添加数据
            info_stu[classid][groupid].push(oldgroup[i]);

            /*//计算numberingroup                                               //1111依赖索引的彻底清除
            var num=info_stu[classid][groupid].length;
            //修改numberingroup
            info_stu[classid][groupid][index]['numberingroup']=num;*/
            var index=info_stu[classid][groupid].length-1;
            info_stu[classid][groupid][index]['numberingroup']=nig;
            //删除旧数据
            info_stu[oldclassid][oldgroupid].splice(i,1);
            break;
        }
        console.log('error :user not found')
        console.log(oldgroup[i]['userid'])
        console.log(userid)
    }
    console.log('assignStu():');
    console.log(info_stu)
}
//计算分入某组的学生的numberingroup 参数：info_stu中的一个group  返回值:numberingingroup的值
function getNumberingroup(group) {
    var temparr=[];
    if(typeof (group)=='undefined'){
        group=[];
    }
    //将所有numberingourp存入一个数组，以便判断某个数字是否已被占用
    for(var i=0;i<MAXSTUNUM;++i){
        if(typeof(group[i])!='undefined'){
            temparr.push(Number(group[i]['numberingroup']));
        }
    }
    console.log('temparr')
    console.log(temparr)
    for(var j=1;j<=MAXSTUNUM;++j){
        if($.inArray(j, temparr)==-1){
            console.log('numberingroup return:'+j)
            return j;
        }
    }
    console.log('error :小组学生数量超标')
}
//
//将指定id的学生变回未分组状态
function resetStu(userid,oldclassid,oldgroupid) {
    //数据库处理
    $.ajax({
        url:'reset_stu.php',
        data:{userid:userid},
        success:function (data) {
            console.log('resetStu() '+data)
        }
    });
    //前端数组处理
    var oldgroup=info_stu[oldclassid][oldgroupid];
    var newgroup=info_stu[0][0];
    for(var i=0;i<oldgroup.length;i++){
        if(oldgroup[i]['userid']==userid){
            //向未分组添加数据
            newgroup.push(oldgroup[i]);
            //修改classid和groupid
            var index=newgroup.length-1;
            var target=newgroup[index];
            target['classid']=0;
            target['groupid']=0;
            //删除旧数据
            oldgroup.splice(i,1);
            console.log('resetStu():');
            console.log(info_stu);
            break;
        }
    }
}
//获取创建班级所需信息,然后创建班级 参数：info_class
function createClass(classinfo) {
    var len=classinfo.length;
    var lastclassid=Number(classinfo[len-1]['classid']);
    console.log('lastclassid');
    console.log(lastclassid);
    var newclassid=lastclassid+1;
    var classname=document.getElementById('i1').value;
    createClassAction(newclassid,classname);
}

//新建班级（信息获取后的前后端处理）
function createClassAction(classid,classname) {
    classname=classname.trim();
    if(classname==''){
        alert('班级名不能为空');
        return false;
    }
    //数据库处理
    $.ajax({
        url:'create_class.php',
        data:{classid:classid,classname:classname},
        success:function (data) {
            console.log('createClass() '+data);
        }
    });
    //前端处理
    createClassFront(classid,classname)
}
//新建班级的前端处理                                                                                     1111
function createClassFront(classid,classname){
    //数据处理
    //info_stu
    info_stu[classid]=[];
    initializeGroup(info_stu[classid]);
    //info_class
    var len=info_class.length;
    info_class[len]=[];
    info_class[len]['classid']=classid;
    info_class[len]['classname']=classname;
    //UI处理
    classManageUI('l1',info_class);
    //classSelectUI('dates',info_class);
    classSelectUI('classlist',info_class);
    //创建班级前未编辑任何一个班级的情况
    if(classidnow==0){
        return;
    }
    //编辑了某个班级的情况
    else{
        clickClass('dates',classidnow);
    }

    console.log('createClassFront():');
    console.log(info_stu);
}
//删除班级(删除所有小组信息,释放所有班级成员）
function deleteClass(classid){
    if(!confirm('确认删除？')){
        return false;
    }
    //数据库处理
    $.ajax({
        url:'delete_class.php',
        data:{classid:classid},
        success:function (data) {
            console.log('deleteClass() '+data);
        }
    });
    //前端处理
    deleteClassFront(classid)
}
//删除班级的前端处理                                                                                     1111
function deleteClassFront(classid) {
    //如果要删除的班级里有学生，info_stu[classid]未定义
    if(typeof (info_stu[classid])!='undefined'){
        //将学生分入0班0组
        var oldclass=info_stu[classid];
        for(var i=1;i<oldclass.length;i++){
            //解决测试时数据不完整的情况
            if(typeof (oldclass[i])=='undefined'){
                continue;
            }
            var group=oldclass[i];
            for(var j=0;j<group.length;j++){
                var stu=group[j];
                stu['classid']=0;
                stu['groupid']=0;
                info_stu[0][0].push(stu);
            }
        }
    }

    //清空原来班级的学生信息
    info_stu[classid]=[];
    initializeGroup(info_stu[classid]);
    console.log("deleteClassFront():");
    console.log(info_stu);
    //删除info_class中的相应班级
    var index=ctoi_class(classid);
    info_class.splice(index,1);
    //重新生成班级管理和界面
    classManageUI('l1',info_class);
    //重新生成待分班界面
    noClassList('noclass',info_stu[0][0]);
    //重新生成班级选择时间轴界面
    //classSelectUI('dates',info_class);
    classSelectUI('classlist',info_class);
    console.log('classidnow')
    console.log(classidnow)
    //当前未在编辑任何一个班级的情况
    if(classidnow==0){
        console.log(1)
        return;
    }
    //删除的不是当前正在编辑的班级的情况
    if(classid!=classidnow){
        clickClass('dates',classidnow);
    }
    //删除的是当前正在编辑的班级的情况
    else{
        //清空小组中的内容
        resetGroup();
        classidnow=0;
    }

}
//classid to index 根据classid返回相应info_class 中的索引
function ctoi_class(classid) {
    var len=info_class.length;
    for(var i=0;i<len;++i){
        if(classid==info_class[i]['classid']){
            return i;
        }
    }
    console.log('ctoi() failed');
}
//classid to index 根据classid返回相应info_stu 中的索引 目前此函数没有意义，用于强调接口，一旦需要改动索引计算方法更加方便
function ctoi_stu(classid) {
    return classid;
}
//获得一个不会重复的数字
function noSame(){
    ++NOSAMECOUNT;
    return NOSAMECOUNT;
}
//根据classid找到班级选择时间轴中的相应a标签 参数：父元素id，classid    返回值：a标签
function getA(parentid,classid) {
    var ul=document.getElementById(parentid);
    var ulchildren=ul.children;
    var len=ulchildren.length;
    for(var i=0;i<len;++i){
        var a=ulchildren[i].children[0];
        if(a.getAttribute('classid')==classid){
            return a;
        }
    }
    console.log('warning :getA() not found');
    console.log('classid:'+classid)
    console.log('classidnow:'+classidnow)
}
//根据classid模拟点击班级选择时间轴中对应的班级 参数：父元素id，classid
function clickClass(parentid,classid){
    var a=getA(parentid,classid);
    a.click();
}
function show12() {
    console.log('info_stu')
    console.log(info_stu)
    console.log('info_class')
    console.log(info_class)
}



