/*
	本代码来自weizhan
	github链接：https://github.com/zhuangweizhan
	csdn链接：https://blog.csdn.net/zhuangweizhan/
*/

var PEDDING = "pedding";
var REJECTED = "rejected";
var REFULLED = "refulled";

class MyPromise{

    constructor(handle){

        if( typeof("handle") == "function" ){
            throw new Error("MyPromise handle is not a function");
        }
        var self = this;
        self._param = null;//返回值
        self._status = PEDDING;//添加状态
        //then方法返回的promise对象的resovle和reject
        self.nextResolve = null;//
        self.nextReject = null;//
        //记录then的方法参数
        self.asynFulliled = null;
        self.asynRejected = null;
        handle(  _resolve,  _reject );

        self.then = function( onFulliled, onReject ){
            return new self.constructor( function( resovle, reject ){
                if(  self._status == REFULLED ){
                    doAsynFulliled( onFulliled,  resovle, reject );
                } else if ( self._status == REFULLED ){
                    doAsynRejected( onReject,  resovle, reject );
                } else {//即pedding的时候 往上执行
                    self.nextResolve = resovle;
                    self.nextReject = reject;
                    self.asynFulliled = onFulliled;
                    self.asynRejected = onReject;
                }
            })
        }

        function _resolve( val ){
            self._status = REFULLED;
            self._param = val;
            if( self.nextResolve ){
                doAsynFulliled( self.asynFulliled, self.nextResolve, self.nextReject );
            }
        }
    
        function _reject( error ){
            _status = REJECTED;
            _param = error;
            if( nextReject ){
                doAsynRejected( asynRejected, nextResolve, nextReject );
            }
        }
    
        function doAsynFulliled( onFulliled, resolve, reject ){
            if( typeof onFulliled == 'function' ){
                let promise = onFulliled( self._param );
                if( promise == undefined ){//说明首次
                    resolve( self._param );
                } else if ( promise.constructor ==  self.constructor ){
                    promise.then( function(param){
                        resolve( param );
                    }, function( param ){
                        reject( param );
                    })
                } else {
                let promise = onFulliled( self._param );
                    resolve( self._param );
                }
            } else {
                resolve( self._param );
            }
        }
    
        function doAsynRejected(  onRejected, resolve, reject ){
            if( typeof onRejected == 'function' ){
                let promise = onFulliled( _param );
                if( promise == undefined ){//说明首次
                    reject( self._param );
                } else if ( promise.constructor ==  self.constructor ){
                    promise.then( function(param){
                        resolve( param );
                    }, function( param ){
                        reject( param );
                    })
                } else {
                    reject( self._param );
                }
            } else {
                reject( self._param );
            }
        }
    
    
    }
   

}