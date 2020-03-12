/*
	本代码来自weizhan
*/
class wzVue {
	constructor(options){
		this.$options = options;
		console.log("this.$options===" + JSON.stringify(this.$options) );
		this.$data = options.data;
		this.$el = options.el;
		this.observer( this.$data );//添加observer监听
		new wzCompile( options.el, this);//添加文档解析
		if ( options.created ) {
			options.created.call(this);
		}
	}
	
	observer( data ){//监听data数据，双向绑定
		if( !data || typeof(data) !== 'object'){
			return;
		}
		Object.keys(data).forEach(key => {//如果是对象进行解析
			this.observerSet(key, data, data[key]);//监听data对象
			this.proxyData(key);//本地代理服务
		});
	}
	
	observerSet( key, obj, value ){
		this.observer(key);
		const dep = new Dep();
		Object.defineProperty( obj, key, {
			get(){
				Dep.target && dep.addDep(Dep.target);
				return value;
			},
			set( newValue ){
				if (newValue === value) {
				  return;
				}
				value = newValue;
				//通知变化
				dep.notiyDep();
			}
		})
	}
	
	proxyData(key){
		Object.defineProperty( this, key, {
			get(){
				return this.$data[key];
			},
			set( newVal ){
				this.$data[key] = newVal;
			}
		})
	}
	
}

//存储数据数组
class Dep{
	constructor(){
		this.deps = [];
	}
	
	addDep(dep){
		this.deps.push(dep);
	}
	
	notiyDep(){
		this.deps.forEach(dep => {
			dep.update();
		})
	}
}

//个人编译器
class wzCompile{
	constructor(el, vm){
		this.$el = document.querySelector(el);
		
		this.$vm = vm;
		if (this.$el) {
			this.$fragment = this.getNodeChirdren( this.$el );
			this.compile( this.$fragment);
			this.$el.appendChild(this.$fragment);
		}
	}
	
	getNodeChirdren(el){
		const frag = document.createDocumentFragment();
		
		let child;
		while( (child = el.firstChild )){
			frag.appendChild( child );
		}
		return frag;
	}
	
	compile( el ){
		const childNodes = el.childNodes;
		Array.from(childNodes).forEach( node => {
			if( node.nodeType == 1 ) {//1为元素节点
				const nodeAttrs = node.attributes;
				Array.from(nodeAttrs).forEach( attr => {
					const attrName = attr.name;//属性名称
					const attrVal = attr.value;//属性值
					if( attrName.slice(0,3) === 'wz-' ){
						var tagName = attrName.substring(3);
						switch( tagName ){
							case "model":
								this.wzDir_model( node, attrVal );
							break;
							case "html":
								this.wzDir_html( node, attrVal );
							break;
						}
					}
					if( attrName.slice(0,1) === '@'  ){
						var tagName = attrName.substring(1);
						this.wzDir_click( node, attrVal );
					}
				})
			} else if( node.nodeType == 2 ){//2为属性节点
				console.log("nodeType=====22");
			} else if( node.nodeType == 3 ){//3为文本节点
				this.compileText( node );
			}
			
			// 递归子节点
			if (node.childNodes && node.childNodes.length > 0) {
				this.compile(node);
			}
		})
	}
	
	wzDir_click(node, attrVal){
		var fn = this.$vm.$options.methods[attrVal];
		node.addEventListener( 'click', fn.bind(this.$vm));
	}
	
	wzDir_model( node, value ){
		const vm = this.$vm;
		this.updaterAll( 'model', node, node.value );
		node.addEventListener("input", e => {
		  vm[value] = e.target.value;
		});
	}
	
	wzDir_html( node, value ){
		this.updaterHtml( node, this.$vm[value] );
	}
	
	updaterHtml( node, value ){
		node.innerHTML = value;
	}
	
	compileText( node ){
		if( typeof( node.textContent ) !== 'string' ) {
			return "";
		}
		const reg = /({{(.*)}})/;
		const reg2 = /[^/{/}]+/;
		const key = String((node.textContent).match(reg)).match(reg2);//获取监听的key
		this.updaterAll( 'text', node, key );
	}
	
	updaterAll( type, node, key ) {
		switch( type ){
			case 'text':
				if( key ){
					const updater = this.updateText;
					const initVal = node.textContent;//记录原文本第一次的数据
					updater( node, this.$vm[key], initVal);
					new Watcher( this.$vm, key, initVal, function( value, initVal ){
						updater( node, value, initVal  );
					});
				}
				break;
			case 'model':
				const updater = this.updateModel;
				new Watcher( this.$vm, key, null, function( value, initVal ){
					updater( node, value );
				});
				break;
		}
	}

	updateModel( node, value ){
		node.value = value;
	}
	
	updateText( node, value, initVal ){
		var reg = /{{(.*)}}/ig;
		var replaceStr = String( initVal.match(reg) );
		var result = initVal.replace(replaceStr, value );
		node.textContent = result;
	}
	
}

class Watcher{
	
	constructor( vm, key, initVal, cb ){
		this.vm = vm;
		this.key = key;
		this.cb = cb;
		this.initVal = initVal;
		Dep.target = this;
		this.vm[this.key];
		Dep.target = null;
	}
	
	update(){
		this.cb.call( this.vm, this.vm[this.key], this.initVal );
	}

}
