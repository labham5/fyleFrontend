const CacheName= "V1"
const CacheAssets=["index.html"]

self.addEventListener("install",event=>{
    console.log("Installed successfullly")
    event.waitUntil(
        caches.open(CacheName)
            .then(caches=>caches.addAll(CacheAssets))
            .then(()=>self.skipWaiting())
    );
})

self.addEventListener("activate",event=>{
    console.log("Activated successfully");
})

self.addEventListener("fetch", event => {
    if (event.request.url.includes("/api/")) {
      event.respondWith(
          caches.open(CacheName).then(function(cache) {
            return cache.match(event.request).then(function (response) {
              return response || fetch(event.request).then(function(response) {
                cache.put(event.request, response.clone());
                return response;
              });
            });
          })
        );
    }
    else 
    {
      event.respondWith(
        caches
          .match(event.request) 
          .then(cached => 
            {
                if(cached != undefined)
                {
                    return cached;
                } 
                return fetch(event.request);
            }) 
      );
    }
  });
