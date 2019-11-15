

export const LocalCache = (key, value)=>{
    let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'))  || {};
    let mergedCache;
    
    if (key && value) {
    	//Create timeStamp
    	var timeStamp = new Date();
        value['timeStamp'] = timeStamp.getTime();

    	if (cachedEntyties[key]) {
    	    mergedCache = Object.assign( cachedEntyties[key], value)
   	    
   	    }else{
   	    	cachedEntyties[key] = value
   	    }
   	    if (mergedCache) {
   	       cachedEntyties[key] = mergedCache
   	    }
   	}
   	    
   	console.log(cachedEntyties, value)
    localStorage.setItem('@@CachedEntyties',JSON.stringify(cachedEntyties))
    return cachedEntyties;
}