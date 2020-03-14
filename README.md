# Sparrow
一款基于Fetch Api的封装包。

## 如何使用
```html
	<script type="text/javascript" src="../sparrow.js"></script>
```

## 基础示例

### GET
```javascript
	let sp = new Sparrow('you need to visit URL');
	sp.run(function (data) {
		console.log(data)
	},function(e){
		console.log(e)
	})
```
### POST
```javascript
	let sp = new Sparrow('you need to visit URL');
	sp.setMethod('POST');
	sp.setField('key1','val1').setField('key2','val2');
	sp.run(function (data) {
		console.log(data)
	},function(e){
		console.log(e)
	})
```

## option参数默认值
| params | default   | optional |
| ----- | --------- | --------- |
| method | GET | POST, GET, PUT, DELETE, HEAD |
| body  | ''     | --------- |
| mode  | cors     | cors, no-cors, same-origin |
| credentials  | same-origin     | omit, same-origin, include |
| cache  | default     | default, no-store, reload, no-cache, force-cache, only-if-cached |
| redirect  | follow     | follow, error, manual|
| referrerPolicy  | origin     | no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, unsafe-url  |

## type参数可选值

type参数用于设置request的Content-Type字段

| value | note		|
| ----- | ---------- |
| JSON |	默认值	|
| URLENCODE  |      |
| DEFAULT  |  采用浏览器使用的默认方式，当需要上传文件时必须使用此值    |

## responseType参数可选值

responseType参数用于控制response的Content-Type字段，从而解析返回的格式

| value | note   |
| ----- | --------- |
| JSON |	默认值	|
| TEXT  |      |
| BLOB  |     |
| FORMDATA  |     |
| ARRAYBUFFER  |     |

## 跨域
Sparrow默认即是跨域的，但需要注意的是跨域并不会发送cookie到非本地服务器。

## public 方法

| method | params   | note |
| ----- | --------- | --------- |
| setUrl |	url:String	| 请求的URL |
| setOption  |   option:Object,cover:Boolen   | option为一个JSON对象，其值可参考[Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)以及option参数默认值,cover为一个Boolen变量，当其为false时将使用option中的值完全覆盖之前的option参数，否则为合并option参数 |
| setMethod  |  method:String   | 请求的方法 |
| setField  |  key:String,val: Mix  | key为请求的表单name参数，val为一个混合型参数，可传递文件 |
| setType  |  type:String   | 参考type参数可选值 |
| setResponseType  |   responseType:String  | 参考responseType参数可选值 |
| setBody  |   body:Object  | body为一个JSON对象，将覆盖之前的body值 |
| setTimeOut  |  timeout:Int   | 单位为ms |
| setSuccessCallbak  |   successCallbak:Function  | 请求成功回调函数 |
| setFailedCallbak  |  failedCallbak:Function   | 请求失败回调函数 |
| setProgress  |  progress:Function   | 请求进度回调函数 |
| setProgressComplete  |   progressComplete:Function  | 请求进度完成回调函数，当进度完成，数据尚未解析时调用，因暂无此场景需求，未来可能废弃 |
| run  |  successCallbak:Function,failedCallbak:Function   | 当使用successCallbak和failedCallbak时，相应之前的setSuccessCallbak和setFailedCallbak设置将失效 |