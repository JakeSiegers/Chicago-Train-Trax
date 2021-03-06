Ext.define('AERP.Ajax', {
    //requires: ['Ext.Ajax','Ext.Msg'],	
    singleton: true,
    request:function(config){

        var requestObj = {
            url:'',
            params:{},
            method :'POST',
            errorTitle: 'Error!',
            errorMessage: 'Fatal Error! Please try again later.'
        };

        Ext.Object.merge(requestObj, config);

        requestObj.userSuccess = config.success || Ext.emptyFn;
        requestObj.userFailure = config.failure || Ext.emptyFn;
        requestObj.userScope = config.scope || Ext.emptyFn;

        requestObj.success = this.success;
        requestObj.failure = this.failure;
        requestObj.scope = this;

        if(config.jsonp && config.jsonp === true){
            return Ext.data.JsonP.request(requestObj);
        }else{
            return Ext.Ajax.request(requestObj);
        }

    },
    success:function(response, options){
        var result;

        try{
            result = Ext.decode(response.responseText);
        }catch(Err){
            Ext.Msg.alert(options.errorTitle, options.errorMessage);

            options.userFailure.call(options.userScope);
            return false;
        }

        if(result && result.success && result.success === true){
            options.userSuccess.call(options.userScope, result);
        }else{
            if(result && result.error){
                Ext.Msg.alert(options.errorTitle, result.error);
            }else{
                Ext.Msg.alert(options.errorTitle, options.errorMessage);
            }
            options.userFailure.call(options.userScope);
        }
    },
    failure:function(response, options){
        if(response.aborted && response.aborted === true){
            options.userFailure.call(options.userScope);
            return true;
        }

        var result;

        try{
            result = Ext.decode(response.responseText);
        }catch(Err){
            Ext.Msg.alert(options.errorTitle, options.errorMessage);

            options.userFailure.call(options.userScope);
            return false;
        }
        if(result && result.error){
            Ext.Msg.alert(options.errorTitle, result.error);
        }else{
            Ext.Msg.alert(options.errorTitle, options.errorMessage);
        }
        options.userFailure.call(options.userScope);
    }
});

AERP.AjaxRequest = AERP.Ajax.request.bind(AERP.Ajax);