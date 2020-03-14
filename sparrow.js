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
       this.successCallback=null;
       this.failedCallback=null;
       this.contentLength=0;
       this.progress=null;
       this.progressComplete=null;//感觉没有需求，可能废弃

       this.setSuccessCallbak(function (data) {});
       this.setFailedCallbak(function (e) {console.log(e)});
       this.setProgress(function(received,totalLength){console.log(received)});
       this.setProgressComplete(function(){});
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

    setSuccessCallbak(successCallback){
        this.successCallback=successCallback;
        return this;
    }

    setFailedCallbak(failedCallback){
        this.failedCallback=failedCallback;
        return this;
    }

    setProgress(progress){
        this.progress=progress;
        return this;
    }

    setProgressComplete(progressComplete){
        this.progressComplete=progressComplete;
        return this;
    }

    __runfetch(url,option){
        return fetch(url,option);
    }

    __runTimeOut(){
        return new Promise((resolve, reject) => {
              setTimeout(() => {
                       resolve(new Response("timeout", { status: 504, statusText: this.option['method']+' '+this.url+" is timeout " }));
                       this.controller.abort();
              }, this.timeout);
        });
    }

    __createReject(status,statusText){
        return  Promise.reject({
                        status: status,
                        statusText: statusText
                    });
    }

    run(successCallback,failedCallback){
        this.setBody();
        Promise.race([this.__runTimeOut(), this.__runfetch(this.url,this.option)])
        .then(response => {
            if (response.ok) {
                    this.contentLength=response.headers.get('Content-Length');
                    return response.body
            }else{
                    return this.__createReject(response.status,response.statusText);
            }

        })
        .then(body => {
              const reader = body.getReader();
              let bytesReceived = 0;
              let progressFunc=this.progress;
              let contentLength=this.contentLength;
              let progressCompleteFunc=this.progressComplete;
              return new ReadableStream({
                start(controller) {
                  return pump();

                  function pump() {
                    return reader.read().then(({ done, value }) => {

                      if (done) {
                        progressCompleteFunc();
                        controller.close();
                        return;
                      }

                      controller.enqueue(value);
                      bytesReceived += value.length;
                      progressFunc(bytesReceived,contentLength)
                      return pump();
                    });
                  }
                }
              })
        })
        .then(stream => new Response(stream))
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
                            return this.__createReject(400,'Sorry, Response type '+this.responseType+' is not supported');
                  }
            }else{
                    return this.__createReject(response.status,response.statusText);
            }
        })
        .then(data => {
            if (this.vDefined(successCallback)) {
                this.setSuccessCallbak(successCallback);
            }
            this.successCallback(data);
        })
        .catch(e => {
             if (this.vDefined(failedCallback)) {
                this.setFailedCallbak(failedCallback);
            }
            this.failedCallback(e);
        })
    }

}