function GetAsyncData() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var params = new URLSearchParams(request.responseText);
      if (params.has("CLOCK")) {
        document.getElementById("CLOCK").innerHTML = params.get("CLOCK");
      }
      if (params.has("DEBUG")) {
        document.getElementById("DEBUG").innerHTML = params.get("DEBUG");
      }
      if (params.has("DEBUG2")) {
        document.getElementById("DEBUG2").innerHTML = params.get("DEBUG2");
      }
      if (params.has("refreshTimeout")) {
        document.getElementById("refreshTimeout").innerHTML = params.get("refreshTimeout");
      }
      if (params.has("PRENOM")) {
        document.getElementsByName("PRENOM")[0].value = params.get("PRENOM");
      }
      if (params.has("DATE")) {
        document.getElementsByName("DATE")[0].value = params.get("DATE");
      }
      if (params.has("DUREE")) {
        document.getElementsByName("DUREE")[0].value = params.get("DUREE");
      }
      if (params.has("RESULTAT")) {
        document.getElementById("RESULTAT").innerHTML = params.get("RESULTAT");
      }
      if (params.has("server_stopped")) {
        document.getElementById("refreshTimeout").innerHTML = "server stopped";
      }
    }
  }
  request.open("GET", "/", true);
  request.send(null);
  setTimeout(GetAsyncData, 30000);
}
function formSubmit() {
  var request = new XMLHttpRequest();
  var params = "PRENOM=" + document.getElementsByName("PRENOM")[0].value + "&DATE=" + document.getElementsByName("DATE")[0].value + "&DUREE=" + document.getElementsByName("DUREE")[0].value;
  request.open("POST", "/", true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(params);
}
window.onload = function() {
  var form = document.getElementsByTagName("form")[0];
  form.onsubmit = function(event) {
    event.preventDefault();
    formSubmit();
  }
}
document.addEventListener("DOMContentLoaded", function() {
  GetAsyncData();
});

self.addEventListener('fetch', event => {
  const requestURL = event.request.url;

  // Check if the request is for a style or script file
  if (isStyleOrScriptRequest(requestURL)) {
    // Serve the file from the localhost
    const localURL = serveFromLocalhost(requestURL);

    // Remove any URL parameters and cache keys from the local URL
    const cleanedURL = removeURLParams(removeCacheKey(localURL));

    console.info('Fetching: ', cleanedURL);

    event.respondWith(
      fetch(cleanedURL)
        .catch(error => {
          console.error('Error:', error);
          return new Response("Service Unavailable", {
            status: 500,
            statusText: `Asset is unavailable on ${LOCALHOST_URL}`,
            headers: new Headers({ "Content-Type": "text/plain"})
          });
        })
    );
  }
  // Check if the request is for an asset served from the localhost
  else if (isAssetServedFromLocalhost(requestURL)) {
    // Serve the asset from the localhost
    const localURL = serveFromLocalhost(requestURL);
    console.info('Fetching local asset from localhost: ', localURL);
    event.respondWith(fetch(localURL));
  }
  // Otherwise, use the default behavior and fetch the resource from the network
  else {
    event.respondWith(fetch(event.request));
  }
});

// Update the LOCALHOST_URL and PRODUCTION_URL variables if needed
self.addEventListener('message', event => {
  const { action, localhostUrl, productionUrl } = event.data;

  if (action === 'updateVariables') {
    LOCALHOST_URL = localhostUrl;
    PRODUCTION_URL = productionUrl;
  }
});

// Precache specified assets when the service worker is installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('asset-cache').then(cache => {
      return cache.addAll([
        'http://localhost:3000/service-worker.js',
        'http://localhost:3000/service-worker1.js',
        'http://localhost:3000/qrcode.js',
        // etc.
      ]);
    })
  );
});

// Delete any old caches that are no longer needed
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Keep the asset-cache but delete all other caches
          return cacheName !== 'asset-cache';
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

function serveFromLocalhost(url) {
  return url.replace(PRODUCTION_URL, LOCALHOST_URL);
}

function removeURLParams(url) {
  return url.replace(/\?.*/g, '');
}

function removeCacheKey(url) {
  return url.replace(/-[a-zA-Z0-9]{20,}\.(css|js)/g,'.$1');
}

function isAssetServedFromLocalhost(url) {
  return url.match(/.*\.(jpg|jpeg|woff|ttf|png|svg|mp3|mp4|wav)/);
}

function isStyleOrScriptRequest(url) {
  return url.match(/\.(css|js)/);
}
var req_data = null;
var refreshTimeout = 0;

function GetAsyncData() {
  console.log('Getting async data...');
  var refreshList = document.querySelectorAll('.refresh');
  console.log('refreshList:', refreshList);
  if (refreshList.length == 0) {
    console.warn('Aborting refresh - refreshList is empty');
    return;
  }
  
  var url = window.location;
  req_data = null;

  if (window.XMLHttpRequest) {
    req_data = new XMLHttpRequest();
    // 3 lignes pour windaube
  } else if (window.ActiveXObject) {
    req_data = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (req_data == null) {
    console.warn('Aborting refresh - req_data is null');
    return;
  }
  req_data.abort();
  req_data.onreadystatechange = GotAsyncData;
  req_data.open('POST', url, true);
  req_data.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  var refreshString = 'refresh='+ refreshTimeout;
  console.log('refreshString:', refreshString);
  for (var item of refreshList) {
    console.log('item:', item);
    if (item.innerHTML.length <= 100) {
      refreshString += '&' + item.id + '=' + encodeURIComponent(item.innerHTML);
    } else {
      refreshString += '&' + item.id + '_TOO_BIG';
    }
  }
  console.log('refreshString:', refreshString);
  req_data.send(refreshString);
}

function GotAsyncData() {
  console.log('Got async data:', req_data);
  if (req_data.readyState != 4 || req_data.status != 200) {
    console.warn('Aborting refresh - invalid readyState or status');
    return;
  }
  
  if (req_data.responseText.length > 1000) {
    console.warn('Aborting refresh - responseText is too long');
    return;
  }
  
  var refreshString = 'refresh='+ refreshTimeout;
  console.log('refreshString:', refreshString);
  for (var item of refreshList) {
    console.log('item:', item);
    if (item.innerHTML.length <= 100) {
      refreshString += '&' + item.id + '=' + encodeURIComponent(item.innerHTML);
    } else {
      refreshString += '&' + item.id + '_TOO_BIG';
    }
  }
  console.log('refreshString:', refreshString);
  req_data.send(refreshString);
}

function GotAsyncData() {
  console.log('Got async data:', req_data);
  if (req_data.readyState != 4 || req_data.status != 200) {
    console.warn('Aborting refresh - invalid readyState or status');
    return;
  }
  
  if (req_data.responseText.length > 1000) {
    console.warn('Aborting refresh - responseText is too long');
    return;
  }
  
  var urlParams = new URLSearchParams(req_data.responseText);
  console.log('urlParams:', urlParams);
  for (var item of urlParams) {
    console.log('item:', item);
    // Internal value refreshTimeout can be changed (or displayed too)
    if (item[0] == 'refresh') {
      refreshTimeout = item[1].valueOf();
    }
    // Document value changed with 100Byte limitation
    var aEle = document.getElementById(item[0]);
    if (aEle) {
      if (item[1].length <= 200) {
        aEle.innerHTML = item[1].trim();
      } else {
        // todo:  cut the size or warn user ?
        aEle.innerHTML = item[0] + '__TOO_BIG';
      }
    }
  }
  try {
    // callback to user js code to warn abour end of refresh
    refreshPage();
  } catch {		
  }
  // Next iteration
  if (refreshTimeout > 0 ) {
    if (refreshTimeout < 100) {
      refreshTimeout = 100
    }
    setTimeout("GetAsyncData()", refreshTimeout);
  }
  return;
}

	  
