

export const LocalCache = (key, value)=>{
    let cachedEntyties = JSON.parse(localStorage.getItem('@@CachedEntyties'))  || {};
    let mergedCache;
    let newCache;
    
    if (key && value) {
    	if (cachedEntyties[key]) {
    	    mergedCache = Object.assign( cachedEntyties[key], value)
   	    
   	    }else{
   	    	cachedEntyties[key] = value
   	    }
   	    if (mergedCache) {
   	       cachedEntyties[key] = mergedCache
   	    }
   	}
   	    
   	
    localStorage.setItem('@@CachedEntyties',JSON.stringify(cachedEntyties))
    return cachedEntyties;
}