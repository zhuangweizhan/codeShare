/*
    1.创建一个对象
    2.对象指向同一个原型
    3.改变this的指向
    4.返回新对象
*/

function createThis( proto ){
    var obj = new Object;
    obj.__proto__ = proto.prototype;
    let [ constructor,  ...args] = [ ...arguments ];
    let result = constructor.apply( obj, args );
    return typeof result === 'object' ? result : obj;
}

function People(name, age){
    this.name = name;
    this.age = age;
}

let peo = createNew(People,'ZWZ',18);
console.log(peo.name)
console.log(peo.age)