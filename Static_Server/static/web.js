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

	  
