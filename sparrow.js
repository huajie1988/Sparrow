/**
*  User: Huajie
*  Date: 2020/03/13
*  Time: 23:17
*
*/
class Sparrow{

	constructor(url, option){
	   this.controller = new AbortController();
	   this.signal=this.controller.signal
       this.url='';
       this.option={
	       	'method':'GET',
	       	'body':'',
	       	'mode':'cors',
	       	'credentials': 'same-origin',
	       	'cache':'default',
	       	'redirect':'follow',
	       	'referrerPolicy':'origin',
	       	'signal':this.signal
       };
       this.except=null;
       this.body="";
       this.fields={};
       this.type='JSON';
       this.responseType='JSON';
       this.timeout=30000;
       this.setUrl(url);
       this.setOption(option)
    }

    vDefined(v){
    	return typeof v != "undefined"?true:false;
    }

    setUrl(url){
		this.url = url;
		return this;
    }

    setOption(option,cover){
    	if(!this.vDefined(cover) ||  (this.vDefined(cover) && cover==true)){
     		for (let op in option) {
     			this.option[op]=option[op]
     		}
     	}else{
			this.option = option; 
		}
		return this;
    }

    setMethod(method){
    	this.option['method']=method;
    	return this;
    }

    setField(key,val){
		this.fields[key]=val;
		return this;
    }

    setType(type){
    	if (['JSON','URLENCODE','FORMDATA','DEFAULT'].indexOf(type.toUpperCase())<0) {
    		return false;
    	}
    	this.type=type.toUpperCase();
    	return this;
    }

	setResponseType(responseType){
	    	if (['JSON','BLOB','TEXT','FORMDATA','ARRAYBUFFER'].indexOf(responseType.toUpperCase())<0) {
	    		this.responseType='DEFAULT';
	    		return false;
	    	}
	    	this.responseType=responseType.toUpperCase();
	    	return this;
	    }

    setBody(body){
    	if (['GET','HEAD'].indexOf(this.option['method'])>=0) {
    		delete this.option.body;
    		return false;
    	}

    	if(this.vDefined(body)){
    		this.fields=body;
    	}

    	if (this.type=='JSON') {
    		this.option['body']=JSON.stringify(this.fields);
    	}else{
    		let formData = new FormData();
    		for (let k in this.fields) {
    			formData.append(k,this.fields[k]);
    		}
    		this.option['body']=formData;
    	}
    	this.__setContentType();
    	return this;
    }

   __setContentType(){
    		let ct='application/json'
    		if (!this.vDefined(this.option['headers'])) {
    			this.option['headers']={}
    		}
    		if ( this.type=='JSON') {
				ct='application/json';
    		}else if ( this.type=='URLENCODE') {
				ct='application/x-www-form-urlencoded';
    		}else if ( this.type=='FORMDATA') {
				ct='multipart/form-data';
    		}else if ( this.type=='DEFAULT') {
				ct='';
    		}
    		if (ct=='') {
    			delete this.option['headers']['Content-Type']
    		}else{
    			this.option['headers']['Content-Type']=ct
    		}
    }

    setTimeOut(timeout){
		this.timeout = timeout;
		return this;
    }

    __runfetch(url,option){
    	return fetch(url,option);
    }

    runTimeOut(){
    	return new Promise((resolve, reject) => {
			  setTimeout(() => {
					resolve(new Response("timeout", { status: 504, statusText: this.option['method']+' '+this.url+" is timeout " }));
			   		this.controller.abort();
			  }, this.timeout);
		});
    }

    run(successCallback,failedCallback){
    	this.setBody();
		Promise.race([this.runTimeOut(), this.__runfetch(this.url,this.option)])
		.then(response => {
			if (response.ok) {
				 if (this.responseType == 'JSON') {
				   		return response.json();
				  } else if (this.responseType == 'TEXT') {
				    	return response.text()
				  } else if (this.responseType == 'BLOB') {
				    	return response.blob()
				  } else if (this.responseType == 'ARRAYBUFFER') {
				    	return response.arrayBuffer()
				  }else if (this.responseType == 'FORMDATA') {
                        return response.formData()
                  } else {
					   	return Promise.reject({
				        	status: 400,
				        	statusText: 'Sorry, Response type '+this.responseType+' is not supported'
				      })
				  }
				
			}else{
				return Promise.reject({
			        status: response.status,
			        statusText: response.statusText
			      })
			}
		})
		.then(data => successCallback(data))
		.catch(e => failedCallback(e))    	
    }

}