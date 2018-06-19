// 封装jsonp 
   /**
   JsonP(url, options)
   options是一个object
   在url中加入callback或者写在options里
   */
  var JsonP = (function(window,document){
    // 扩展对象方法
    function extend(){
        var i = 1,
        len =  arguments.length,
        target = arguments[0],
        j;
        //如果没有目标对象，那么扩展函数库自身
        if(i==len){
            target = this;
            i--;
        }
        //外层遍历对象，内层遍历对象的属性，并复制到target上
        for(;i<len;i++){
            for(j in arguments[i]){
                target[j] = arguments[i][j];
            }
        }
        return target;
    }
    //拼接URL方法
    function addURIParam(url,ob){
        url += url.indexOf('?')==-1 ? '?':'&';
        for (var index in ob){
            url += encodeURIComponent(index)+ '='+encodeURIComponent(ob[index])
        }
        return url;
    }
    /**
    options:{
        cb: 回调函数名称,
        error: 错误回调函数，
        complete：完成回调，
        timeout: 设置超时时间,
        params: 查询参数
    }
    */
    return function(url,options){
        var timer,
        $head = document.querySelector('head'),
        $script = document.createElement('script'),
        op = {
            timeout:0,
            error:function(){},
            complete:function(){},
            params:null
        };
        //扩展默认配置
        extend(op,options)
        //添加查询参数
        if(op.params != null){
            url = addURIParam(url,op.params)
        }

        var cb_ = op.cb;
        window[cb_] = function(data){
            op.complete(data);
            clearTimeout(timer);
            clean();
        }
        function clean(){
            $head.removeChild($script);
            delete window[cb_]
        }

        if(options.timeout>0){
            timer = setTimeout(() => {
                op.error('error');
                clean();
            }, options.timeout);
        }
        $script.src = url;
        $head.appendChild($script);
    }
})(window,document)

// options = {
//     cb: 'mycallback',
//     error: function(){
//         alert('错误')
//     },
//     complete: function(data){
//         alert('成功回调');
//         console.log(data)
//     },
//     timeout: 3000,
//     params: {
//         cb:'mycallback'
//     }
// }

// JsonP(url,options);