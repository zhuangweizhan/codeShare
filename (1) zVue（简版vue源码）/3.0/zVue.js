/*
	本代码来自weizhan
	github链接：https://github.com/zhuangweizhan
	csdn链接：https://blog.csdn.net/zhuangweizhan/
*/
class zVue {
	constructor(options){
		this.$options = options;
		this.$data = options.data;
		this.$el = options.el;
		this.$binding = {};//替换原来的dep
		this.proxyData( this.$data );//添加observer监听
		new zCompile( options.el, this);//添加文档解析
	}
	
	pushWatch( watcher ){
		if( !this.$binding[watcher.key] ){
			this.$binding[watcher.key] = [];
		}
		this.$binding[watcher.key].push(watcher);
	}

	proxyData( data ){//监听data数据，双向绑定
		if( !data || typeof(data) !== 'object'){
			return;
		}
		const _this = this;
		const handler  = {
			set( target, key, value ) {
				const rest = Reflect.set(target, key, value);
				_this.$binding[key].map( item =>  {
					item.update();
				})
				return rest;
			}
		}
		this.$data = new Proxy( data, handler );
	}

}

//个人编译器
class zCompile{
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
					if( attrName.slice(0,2) === 'z-' ){
						var tagName = attrName.substring(2);
						switch( tagName ){
							case "model":
								this.zDir_model( node, attrVal );
							break;
							case "html":
								this.zDir_html( node, attrVal );
							break;
						}
					}
					if( attrName.slice(0,1) === '@'  ){
						var tagName = attrName.substring(1);
						this.zDir_click( node, attrVal );
					}
				})
			} else if( node.nodeType == 2 ){//2为属性节点
			} else if( node.nodeType == 3 ){//3为文本节点
				this.compileText( node );
			}
			
			// 递归子节点
			if (node.childNodes && node.childNodes.length > 0) {
				this.compile(node);
			}
		})
	}
	
	zDir_click(node, attrVal){
		var fn = this.$vm.$options.methods[attrVal];
		node.addEventListener( 'click', fn.bind(this.$vm));
	}
	
	zDir_model( node, value ){
		const vm = this.$vm;
		this.updaterAll( 'model', node, node.value );
		node.addEventListener("input", e => {
		  vm.$data[value] = e.target.value;
		});
	}
	
	zDir_html( node, value ){
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
					updater( node, this.$vm.$data[key], initVal);
					this.$vm.pushWatch(
						new Watcher( this.$vm, key, initVal, function( value, initVal ){
							updater( node, value, initVal  );
						})
					);
				}
				break;
			case 'model':
				const updater = this.updateModel;
				this.$vm.pushWatch(
					new Watcher( this.$vm, key, null, function( value, initVal ){
						updater( node, value );
					})
				);
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
	}
	
	update(){
		this.cb.call( this.vm, this.vm.$data[this.key], this.initVal );
	}

}
