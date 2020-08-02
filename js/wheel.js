// 无缝轮播图
// wins String 元素的选择器要放入轮播图的容器 或者窗口
// opts json 实现轮播图的各种选项
    // imgs 数组 要包含轮播图图片的数组
    // links 数组 图片链接的地址
    // imgColor 图片的颜色，用于全屏显示的颜色拼接
    // imgSize 数组第一个参数代表宽 第二个参数代表高度
    // btnColor String 按钮的颜色
    // btnActive String 获得焦点的按钮的颜色
    // btnPos 数组 第一个参数代表x轴位置 第二个参数代表y轴位置

function wheel(wins,opts,runOpts){
    // 参数初始化
    var wins=document.querySelector(wins);
    if(!((wins&&wins.nodeType==1))){
        console.error("没有找到窗口元素");
        return ;
    }
    var btnColor=opts.btnColor||"green";
    var btnActive=opts.btnActive||"red";
    var btnPos=opts.btnPos||["center","20"];
    var runOpts=runOpts||{};


    // 图片的地址添加一个
    opts.imgs.push(opts.imgs[0]);
    // 链接的地址添加一个
    // opts.links.push(opts.links[0]);
    // 图片的颜色
    opts.imgColor.push(opts.imgColor[0]);
    var imgLength=opts.imgs.length+1;
    if(imgLength==0){
        console.error("没有传入相应的轮播内容");
        return;
    }
    var imgSize=opts.imgSize;
    if(!(imgSize instanceof Array)){
        console.error("请传入合法的尺寸类型");
    }
    if(imgSize.length==0){
        imgSize[0]=document.documentElement.clientWidth;
        imgSize[1]=400;
    }
    if(imgSize.some(function(val){
        return val==0;
    })){
        for(var i=0;i<2;i++){
            if(imgSize[i]==0){
                imgSize[i]=500;
            }
        }
    }
    var time=0;
    if(runOpts.time){
        time=runOpts.time*1000;
    }else{
        time=5000;
    } 
    this.eachTime=0;//每张图片运行时间
    if(runOpts.eachTime){
        this.eachTime=runOpts.eachTime*1000;
    }else{
        this.eachTime=500;
    }
    this.runStyle=null;
    if(runOpts.runStyle=="linner"||!(runOpts.runStyle)){
        this.runStyle=Tween.Linear;
    }else if(runOpts.runStyle=="in"){
        this.runStyle=Tween.Quad.easeIn;
    }else if(runOpts.runStyle=="out"){
        this.runStyle=Tween.Quad.easeOut;
    }
    // 1.设置样式
    wins.style.cssText="width:100%;height:"+imgSize[1]+"px;overflow:hidden;position:relative;";
    // 2.添加容器
    var box=document.createElement("div");
    box.style.cssText="width:"+imgLength*100+"%;height:100%;";
    wins.appendChild(box);
    // 3.创建每一个轮播图
    for(var i=0;i<imgLength-1;i++){
        var divList=document.createElement("div");
        divList.style.cssText=`float:left;width:${100/imgLength}%;height:100%;background:${opts.imgColor[i]}`;
        var link=document.createElement("a");
        // link.href=opts.links[i];
        link.style.cssText="width:"+imgSize[0]+"px;height:"+imgSize[1]+"px;display:block;margin:auto;background:url("+opts.imgs[i]+") no-repeat 0 0";
        divList.appendChild(link);
        box.appendChild(divList);
    }
    
    var btnBox=document.createElement("div");
    btnBox.style.cssText="width:90px;height:20px;position:absolute;left:0;right:0;margin:auto;bottom:"+btnPos[1]+"px";
    var btns=[];
    for(var i=0;i<imgLength-2;i++){
        var bgcolor=(i==0?btnActive:btnColor);
        var btn=document.createElement("div");
        btn.style.cssText="width:10px;height:10px;background"+bgcolor+";border-radius:50%;margin:0 10px;cursor:pointer;float:left;";
        btnBox.appendChild(btn);
        btns.push(btn);
    }
    wins.appendChild(btnBox);

    // 进行轮播
    var winW=parseInt(getComputedStyle(wins,null).width);
    var num=0; 
    function move(){
        num++;
        if(num>btns.length-1){
            animate(box,{
                "margin-left":-num*winW
            },eachTime,runStyle,function(){
                box.style.marginLeft=0;
            })
            num=0;
        }else{
            animate(box,{
                "margin-left":-num*winW
            },eachTime,runStyle)
        }
        for(var i=0;i<btns.length;i++){
            btns[i].style.background=btnColor;
        }
        btns[num].style.background=btnActive;

    }
    var t=setInterval(move,time)
    for(let i=0;i<btns.length;i++){
        btns[i].onclick=function(){
            num=i;
            animate(box,{
                "margin-left":-num*winW
            },eachTime,runStyle)
            for(var j=0;j<btns.length;j++){
                btns[j].style.background=btnColor;
            }
            btns[num].style.background=btnActive;
        }
    }
    wins.onmouseover=function(){
        clearInterval(t);
    }
    wins.onmouseout=function(){
        t=setInterval(move,time)
    }
}

