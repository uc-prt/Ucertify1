let API  = {};
const servers = [
    'http://localhost/pe-gold3/', 
    'https://www.ucertify.com/', 
    'https://www.jigyaasa.info/',
    'http://172.10.195.203/pe-gold3/',
];
const REMOTE_API_URL = servers[1] + 'pe-api/1/index.php';
let client = {
	email: "pradeep.yadav@ucertify.com",
	password: "786pradeep",
	isSocial: "false",
	clientId: "040MA"
}
API.validateApp = function (checkExpired) {
	return new Promise((resolve, reject) => {
		let isExpired = checkExpired ? `&action=refresh_token&refresh_token=1` : "";
		let isSocial = client.isSocial ? '&social_login=1' : "";
		let url = `${REMOTE_API_URL}?func=cat2.authenticate&device_id=${client.clientId}&email=${client.email}&password=${client.password + isSocial + isExpired}`;
		let request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.onreadystatechange = (event) => {
			if (request.readyState == 4 && request.status === 200) {
				try {
					let responseBody = request.responseText;
					let responseObject = responseBody.match(/<jsonstring>(.*?)<\/jsonstring>/);
					resolve(JSON.parse(responseObject[1]));
				} catch (err) {
					reject(err);
				}
			} 
		};
		request.onerror = (requestError) => {
			reject(requestError);
		};
		if (checkExpired) {
			request.setRequestHeader("old-access-token", window.apiAccessToken);
		}
		request.send();
	});
}

API.getAPIDataJ = function(func, where, callback = function(){}) {
	let param = "";
	let message = true;
	let _param2 = {};
	let str = '';
	let ajax_info = where.ajax_info ||{};
	where = assignPartial(where, {}, 'ajax_info', true);
	// if (typeof where.redis == 'undefined') {
	// 	_param2.redis = 0;
    // }
	//----------- code for acces_token based validation --------//
	_param2.device_id = client.clientId;
	//----------------------------------------------------------//

	if (typeof (where) == 'object') {
		for (let k in where) {
			if (typeof where[k] != 'object') {
				param += "&" + k + "=" + where[k];
			}	
		}
	}
	if (typeof (func) !== "undefined" && func != "") {
		for (let k in _param2) {
			if (typeof _param2[k] != 'object') {
				str += "&" + k + "=" + _param2[k];
			}	
		}
		str += "&func="+func;
	}
	
	API.getAPIDataJSON(REMOTE_API_URL + "?" + str + "&debug=0&"+param, param, ajax_info, function(apidata) {
		if (apidata == 'Expired'){
			API.getAPIDataJ(func, where, callback);
		} else {
			callback(apidata);
		}
	}, func);
}

API.getAPIDataJSON = function (url, data, ajax_info, callback = function(){}, funcName) {
	let request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.onreadystatechange = (event) => {
		if (request.readyState == 4 && request.status === 200) {
			let responseBody = request.responseText;
			let responseData = {};
			try {
				let resStr = responseBody.match(/<jsonstring>(.*?)<\/jsonstring>/);
				if (resStr[1] != '') {
					let responseObject = JSON.parse(resStr[1]);
					if (responseObject.error && ['Expired', '-9'].includes(responseObject.error.error_id)) {
						console.log("Api Error = ", responseObject.error.error_id);
						API.validateApp (responseObject.error.error_id != -9).then((validRes) => {
							if (validRes.status == 'Success') {
								setAccessKey(validRes);
								callback("Expired");
							}
						}).catch((validateError)=> {
							//UI.storeError('Validate Error####no1:1####' + JSON.stringify(validateError || {}), true)
							console.log(validateError);
						});
						return;
					} else {
						if (responseObject['response']) {
							responseData = responseObject['response'];
							console.log("Api data J reponse <-- Received -->", responseObject);
						} else if(responseObject['response'] == undefined && responseObject.error == undefined) {
							responseData = responseObject;
							console.log("Api data J reponse <-- Received II-->", responseData);
						} else {
							responseData = undefined;
							console.log({"Response_error":responseObject.error});
						}
					}
				}
			} catch (error) {
				console.log("Please check your Internet connection.");
				console.log("Api data error = ", responseBody);
				if (data.includes('must_reply_override')) {
					responseData = undefined;
				} else {
					return (0);
				}
			}
			callback(responseData);
		}
	};
	if (!data.includes('no_access_token_required')) {
		request.setRequestHeader("access-token", window.apiAccessToken);
	}
	request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.setRequestHeader("Access-Control-Allow-Headers", "*");
	request.send();
}


function assignPartial(iObj, oObj = {}, str, unsetOnly = false ) {
	str = str.split(',');
	if ( !unsetOnly ) {
	  for ( let i in str ) {
		let index = str[i];
		if ( typeof iObj[index] != 'undefined') {
		  oObj[index] = iObj[index];
		}
	  }
	}
	else {
	  for ( let i in iObj ) {
		let index = str.indexOf( i ); 
		if ( index === -1) {
		  oObj[i] = iObj[i];
		}
	  }
	}
	return oObj;
}

function setAccessKey (api) {
	if (api.access_token && api.access_token.length > 50) {
		window.apiAccessToken = api.access_token;
	}
}

module.exports = API;