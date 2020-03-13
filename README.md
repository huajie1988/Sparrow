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
