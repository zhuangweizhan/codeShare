class zVueRouter{
	
	constructor( option ){
		this.$option = option;
		this.routerMap = {};
		this.init();//初始化方法
	}
	
	//初始化方法
	init(){
		this.bindEvent();//监听路由
		this.createRouterMap( this.$option );//创建路由对象
		this.initComponent();//创建组件
	}
	
	bindEvent(){
		window.addEventListener( 'load', ()=>{
			this.hashChangeFun.bind(this);
		}, false);
		window.addEventListener( 'hashChange', ()=>{
			this.hashChangeFun.bind(this);
		}, false);
	}

	createRouterMap( option ){
		option.routers.forEach( item => {
			this.routerMap[ item.path ] = item;
		})
	}
	
	initComponent(){
		vue.component( 'router-link', {
			props: {
				to: 'String'
			},
			render: h => {
				return `<a href="{this.to}">{this.$slot.default}</a>`
			},
		});
		vue.component( 'router-view', {
			render: h => {
				return h( this.routerMap( this.currentPage).component );
			},
		});
	}
	
	hashChangeFun(){
		const name = window.location.hash.sincl(1) : '';
		this.currentPage = name;
	}
	
}