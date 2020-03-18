
/*
	本代码来自weizhan
	github链接：https://github.com/zhuangweizhan
	csdn链接：https://blog.csdn.net/zhuangweizhan/
*/

class zRouter{
    constructor(){
        this.routes = {};
        this.init();
    }
    
    refresh(){
        let path = location.hash;
        this.routes[ path]();
    }

    init(){
        window.addEventListener( 'load', this.refresh.bind( this ), false );
        window.addEventListener( 'hashchange', this.refresh.bind( this ), false  );
    }

    route( path,  cb ){
        this.routes["#" + path] = cb || function(){};
    }

}