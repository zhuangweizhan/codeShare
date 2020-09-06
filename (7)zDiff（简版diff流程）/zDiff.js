/*
	本代码来自weizhan
	github链接：https://github.com/zhuangweizhan
	csdn链接：https://blog.csdn.net/zhuangweizhan/
*/

const stateType = {
    Change: 'Change',//表示元素有变化
    Move: 'Move',//表示移动了位置
    Add: 'Add',//表示元素是新增的
    Del: 'Del',//表示元素给删除了
    DiffPropsList: 'DiffPropsList',//表示元素对应的属性列表有变动
    DelProps: 'DelProps',//表示该属性给删除
    ChangeProps: 'ChangeProps',//表示该属性有变化
    AddProps: 'AddProps',//表示该属性是新增的
};

class zElement {

    /*
        tag('string'):标签的名称
        props('object'):属性与属性的值{ class: 'a', type: 'hidden'}
        children('array'):子属性
        key('string'):表示元素的唯一标识 'nowKeys'
    */
    constructor(tag, props, children, key) {
        this.tag = tag;
        this.props = props;
        this.children = children;
        this.key = key;
    }

    render() {
        //获取属性
        var root = this._createDom(
            this.tag,
            this.props,
            this.children,
            this.key,
        );
        document.body.appendChild(root);
        return root;
    }

    create(){
        return this._createDom(this.tag, this.props, this.children, this.key)
    }

    //创建dom
    _createDom(tag, props, children = [], key) {
        let dom = document.createElement(tag);
        for (let propKey in props) {
            dom.setAttribute(propKey, props[propKey]);
        }
        if (!key) {
            dom.setAttribute("key", key);
        }
        if (children.length > 0) {
            children.forEach(item => {
                if (item instanceof zElement) {//
                    var root = this._createDom(
                        item.tag,
                        item.props,
                        item.children,
                        item.key
                    )
                    dom.appendChild( root );
                } else {
                    var childNode = document.createTextNode(item);
                    dom.appendChild(childNode);
                }
            });
        }
        return dom;
    }

}

//判断两个dom差异的地方
// index 表示第几层的意思 
// patches 表示返回的数组

function diff(oldElement, newElement) {
    var index = 0;
    var patches = {};
    dfs(oldElement, newElement, index, patches);
    return patches;
}

//判断当前对象
function dfs(oldElement, newElement, index, patches) {
    //如果新的对象为空，无需要对比
    //如果新的对象，key跟tag都不同，说明元素变了，直接替换。
    //如果新的对象，key跟tag都相同，则遍历子集，观察子集是否不同,观察元素属性是否不同
    var curPatches = [];
    if (!newElement) {
    } else if (oldElement.key != newElement.key || oldElement.tag != newElement.tag) {
        curPatches.push({
            type: stateType.Change,
            node: newElement
        });
    } else {
        var propsDiff = diffProps(oldElement.props, newElement.props);
        if (propsDiff.length > 0) {
            curPatches.push({
                type: stateType.DiffPropsList,
                node: newElement
            });
        }
        diffChildren(oldElement.children,  newElement.children,index, patches);//对比子集是否不同
    }
    if (curPatches.length > 0) {
        if (!patches[index]) {
            patches[index] = []
        }
        patches[index] = patches[index].concat(curPatches);
    }
    return patches;
}

//判断两个diff的算法
function diffProps(oldProps, newProps) {
    //先判断是否有删除
    //再判断是否有修改，新增的
    let change = [];
    for (let key in oldProps) {
        if ( !newProps.hasOwnProperty(key) ) {//说明新的没有,则删除了
            change.push({
                key: key,
                type: stateType.DelProps
            });
        } else {
        }
    }
    for (let keys in newProps) {
        if ( !oldProps.hasOwnProperty(keys) ) {//说明旧的是没有，是新增的属性
            change.push({
                key: keys,
                type: stateType.AddProps,
                value: newProps[keys]
            });
        } else {
            if (oldProps[keys] != newProps[keys]) {
                change.push({
                    key: keys,
                    type: stateType.ChangeProps,
                    value: newProps[keys]
                });
            }
        }
    }
    return change;
}

//获取数组的keys
function getKeys(list) {
    var reuslt = [];
    list.forEach( item => {
        reuslt.push(item.key);
    })
    return reuslt;
}

//
function diffChildren(oldChild, newChild, index, patches) {
    let { changeList, resultList } = listDiff(oldChild, newChild, index, patches);
    if (changeList.length > 0) {
        if (!patches[index]) {
            patches[index] = []
        }
        patches[index] = patches[index].concat(changeList);
    }
    let last = null;
    oldChild && oldChild.forEach((item, i) => {
        let child = item && item.children;
        if (child) {
            if ( last && last.children != null) {//有子节点
                index = index + last.children.length + 1;
            } else {
                index += 1;
            }
            let keyIndex = resultList.indexOf( item.key ) ;
            let node = newChild[keyIndex]
            //只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
            if ( node ) {
                dfs(item, node, index, patches)
            }
        } else {
            index += 1;
        }
        last = item
    });
}

function listDiff(oldList, newList, index, patches) {
    // 先算出删除，的数组
    // 再算出改动，或者插入的数据。
    let changeList = [];//改变的统计
    let resultList = [];//最后返回的顺序列表
    let oldKeys = getKeys(oldList);
    let newKeys = getKeys(newList);
    oldList && oldList.forEach((item, oIndex) => {
        if (newKeys.indexOf(item.key) == -1) {//说明新的数组没有。给删除了。
            changeList.push({
                type: stateType.Del,
                key: item.key,
                index: oIndex
            })
        } else {
            resultList.push(item.key);
        }
    })
    newList &&　newList.forEach((item, nIndex) => {
        if (resultList.indexOf(item.key) == -1) { //说明旧的没有，是新增的元素
            changeList.push({
                type: stateType.Add,
                key: item.key,
                node: item,
                index: index,
            })
            resultList.splice(nIndex, 0, item.key);
        } else {
            if (resultList.indexOf(item) == nIndex) {
                changeList.push({
                    type: stateType.Change,//说明是修改的元素
                    key: item.key,
                    node: item,
                    to: nIndex, //
                    from: resultList.indexOf(item.key), //
                })
            }
            //交换resultList的顺序
            resultList = moveDom(resultList, nIndex, resultList.indexOf(item.key));
        }
    });
    return { changeList, resultList };
}

//交换resultList的顺序
function moveDom(list, to, from) {
    var returnTag = list[to];
    list[to] = list[from];
    list[from] = returnTag;
    return list;
}


var num = 0;
function reloadDom( node, patchs ){
    var changes = patchs[ num ];
    let childNodes = node && node.childNodes;
    if (!childNodes) num += 1
    if( changes != null  ){
        changeDom( node, changes );
    }
    //保持更diff算法的num一直
    var last = null
    childNodes && childNodes.forEach(( item, i ) => {
        if( childNodes ){
            if ( last && last.children != null) {//有子节点
                num = num + last.children.length + 1;
            } else {
                num += 1;
            }
        }
        reloadDom( item, patchs );
        last = item;
    })
}

function changeDom( node, changes ){
    changes && changes.forEach( change => {
        let {type} = change;
        switch( type ){
            case stateType.Change:
                node.parentNode && node.parentNode.replaceChild( change.node.create() , node );
                break;
            case stateType.Move:
                let fromNode = node.childNodes[change.from];
                let toNode =  node.childNodes[change.to];
                let formClone = fromNode.cloneNode(true);
                let toClone = toNode.cloneNode(true);
                node.replaceChild( fromNode, toClone ) ;
                node.replaceChild( toNode, formClone ) ;
                break;
            case stateType.Add:
                node.insertBefore( change.node.create(),  node.childNodes[ change.index ]  )
                break;
            case stateType.Del:
                node.childNodes[change.index ].remove();
                break;
            case stateType.DiffPropsList:
                let {props} = change.node;
                for( let key in props ){
                    if( key == stateType.DelProps ){
                        node.removeAttribute( );
                    } else {
                        node.setAttribute( key, props[key] );
                    }
                }
                break;
            default:
                break;
        }
    });
}