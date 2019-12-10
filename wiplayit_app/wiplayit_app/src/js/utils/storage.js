

export const LocalCache = (key, value, isStoreUpdate=false)=>{
    let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'))  || {};
    let mergedCache;
    
    if (key && value) {

        let cachedKeys = cachedEntyties[key];
    	    	
    	if (cachedEntyties[key] && isStoreUpdate) {
            //console.log(cachedKeys, value, key)

            for(var valueKeys in value){
                
                cachedKeys  = cachedKeys && cachedKeys[valueKeys]
                let values  = value && value[valueKeys]
                
                if (cachedKeys && values) {
                    //console.log(valueKeys, cachedKeys, values) 
                  
                    mergedCache = Object.assign( cachedKeys, {...values});

                    mergedCache = Object.defineProperty({}, valueKeys, {
                                               value : mergedCache,
                                               writable     : true,
                                               configurable : true,
                                               enumerable   : true,
                                            });
                }
            }

        }else{

            value['timeStamp'] = GetTimeStamp(value)
   	    	cachedEntyties[key] = cachedEntyties[key] && Object.assign(cachedEntyties[key], value)
                                                      || value;
   	    }

   	    if (mergedCache) {
            //console.log(mergedCache, cachedEntyties[key]);

            mergedCache['timeStamp'] = GetTimeStamp(value)
   	        cachedEntyties[key] = Object.assign(cachedEntyties[key], mergedCache)
   	    }
           	
        //Create timeStamp 
        

        //console.log(cachedEntyties, value, key)

        localStorage.setItem('@@CachedEntyties',JSON.stringify(cachedEntyties));
    }
   	
};

export const UpdateLocalCache =()=> {

 
};

const GetTimeStamp = (value) =>{

        var timeStamp = new Date();
        let timer = {}
        timeStamp.getTime();

        for(var valueKeys in value){
            if (valueKeys != 'timeStamp' && valueKeys != 'byId') {
                timer[valueKeys] = timeStamp ;
            }
        }

       return timer 
};