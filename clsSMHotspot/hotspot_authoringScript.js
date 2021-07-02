import JUI from '../javscript_helper/JUI.js';
const JS = new JUI();
export default class HotspotAuthScript {
	constructor() {
		this.count = 0;
		this.drawstr = '';
	}

	// elemModal(type, _this, key) {
	// 	var htmlparent = "#hptmain";
	// 	var pos = [];
	// 	$('#authoring-modal .modal-body>.h').hide();
	// 	$('.addElement').unbind('click').bind("click", ()=>{
	// 		this.updateElem(type, _this, key)
	// 	});
	// 	switch(type) {
	// 		case "div":
	// 			$('#authoring-modal .title').text('Draggable - '+key);
	// 			$('#authoring-modal .div').show();
	// 			$('#authoring-modal #drag-top').val(pos[0]);
	// 			$('#authoring-modal #drag-left').val(pos[1]);
	// 			break;
	// 		case "base":
	// 			$('#authoring-modal .title').text('Base');
	// 			$('#authoring-modal .base').show();
	// 			break;
	// 	}
	// 	$('#authoring-modal').modal('show');
	// 	$('#authoring-modal .events:visible li:eq(0)').click();
	// 	var attributes = $('[id="'+key+'"]').data('attributes');
	// 	setTimeout(function(){
	// 		for(var i=0; i<attributes.length; i++)
	// 		{
	// 			var t = $('#authoring-modal .h:visible [name="'+attributes[i]['name']+'"]');
	// 			t.val(attributes[i]['value']);
	// 		}
	// 	}, 300);
	// }

	updateElem(type, _this, key, ui,xml) {
		let attributes = JS.serializeArray(JS.find('#authoring-modal','.h', 'visible'), 'input');
		let bgimg = "", attr = [], wd, hd, tp, lt, where, st;
		if (typeof(ui) !== "undefined") {
			attributes = JSON.parse(JS.select('#'+key).dataset['attributes']);
			if(!attributes) {
				let attributeArr = [];
				attributeArr[0] = {name:'id',value:key};
				attributeArr[1] = {name:'type', value: 'hotspot'};
				attributeArr[2] = {name:'top', value: parseInt(JS.select('#'+key).style.top.split('px')[0]) };
				attributeArr[3] = {name:'left', value: parseInt(JS.select('#'+key).style.left.split('px')[0]) };
				attributeArr[4] = {name:'width', value: parseInt(JS.select('#'+key).style.width.split('px')[0]) };
				attributeArr[5] = {name:'height', value: parseInt(JS.select('#'+key).style.height.split('px')[0]) };
				attributes = attributeArr;
			}
			attributes.forEach((_data, index, _orginalArr)=> {
				switch(_data.name) {
					case "width":
						_data.value = ui.clientWidth;
						break;
					case "height":
						_data.value = ui.clientHeight;
						break;
					case "top":
						_data.value = (+(_data.value)  + _this.offsetY) - (ui.clientHeight/2);
						break;
					case "left":
						_data.value = (+(_data.value) + _this.offsetX) - (ui.clientWidth/2);
						break;
				}
				_orginalArr[index] = _data;
			});
			console.log("after", attributes,_this);
		}
		attributes.forEach((value, index)=> {
			if( value.name == "width")  wd = value.value;
			if (value.name == "height") hd = value.value;
			if (value.name == "top")    tp = value.value;
			if (value.name == "left")   lt = value.value;
			if (value.name == "bgimg" && value.value.trim() != "") {
				bgimg = JS.select('#hptmain').getAttribute('path') + value.value.trim();
			}
			attr[value.name] = value.name;
		});
		switch (type) {
			case "div":
				where = `[id="${key}"]`;
				JS.select(`[id="${key}"]`, 'css', {width: wd+'px', height: hd+'px', top: tp+'px', left: lt+'px'}).dataset["attributes"] = JSON.stringify(attributes);
				break;
			case "base":
				where = "hptmain";
				JS.select('#hptmain').dataset["attributes"] = JSON.stringify(attributes);
				break;
		}
		if (type == "base") {
			let bgholder = (key=='hptmain') ? '#hptmain' : '#hptdraw';
			
			if (bgimg != "") {
				let img = new Image();
				img.src = bgimg;
				let img_ext = img.src.substr((img.src.lastIndexOf('.') + 1));
				setTimeout(()=> {
					img.width = img.width > 0 ? img.width : "600";
					img.height = img.height > 0 ? img.height : "250";
					JS.select('#option-toolbar', 'css', {width: img.width});
					if (img_ext != 'gif') {
						if (JS.selectAll(bgholder + '>img').length > 0) {
							JS.select(bgholder, 'css', {width: img.width, height: img.height});
							JS.selectAll(bgholder + '>img','attr', {src: bgimg});
						} else if(key == 'hptdraw') {
							JS.find(bgholder, 'canvas', {action: 'attr',actionData: {width: img.width, height: img.height} });
							JS.selectAll(JS.siblings(bgholder), 'css', {width: img.width});
							JS.select(bgholder,'css', {width: img.width, height: img.height, backgroundImage:'url(' + bgimg + ')'});
						} else {
							JS.insert(JS.select(bgholder, 'css', {width:img.width, height:img.height}), '<img src="'+bgimg+'" />', 'beforebegin');
						}
					}
				}, 100);
			} else {
				if (JS.selectAll(bgholder + '>img').length > 0) {
					JS.select(bgholder, 'css',{width: "600px", height: "250px"})
					JS.select(bgholder + '>img', 'remove');
				}
			}
		}
		if (type == "div") {
			return this.updateXML(type, where, attributes,tp,lt,xml);
		}
		if (img_ext != 'gif' && typeof img != "undefined"){
			return this.updateXML(type, where, attributes,img.width,img.height,xml);
		} else {
			JS.alert("Please Do not use Gif Image!!!");
		}
	}

	drawOnCanvasAuth(el,cord,color) {
		let c = document.getElementById(el);
		let ctx = c.getContext("2d");
		let len = Object.keys(cord).length;
		if (cord!='') {
			for (let i = 1; i <= len ; i++) {
				for (let j = 0; j <= cord[i]['x'].length; j++) {
					ctx.beginPath();              
					ctx.lineWidth   = "4";
					ctx.strokeStyle = window.color;
					ctx.moveTo(cord[i]['x'][j], cord[i]['y'][j]);
					ctx.lineTo(cord[i]['x'][j+1], cord[i]['y'][j+1]);
					ctx.stroke();
				}
			}
		}
	}

	updateXML(type, where, attributes,img_w,img_h,xml) {
		let xmlDom = JS.parseHtml(xml);
		let attr = '', val = '', insert;
		if (where == "hptmain") {
			insert = xmlDom;
		} else {
			insert = JS.find(xmlDom, where);
		}
		if (img_w > 0 && img_h > 0) {
			insert.setAttribute("width", img_w);
			insert.setAttribute("height", img_h);
		}
		if (attributes) {
			for (let _tempAttr of attributes ) {
				if (_tempAttr.value !== "") {
					insert.setAttribute(_tempAttr.name, _tempAttr.value);
					if (_tempAttr.name=='type') insert.setAttribute(_tempAttr.value, 'hotspot');
				} else {
					insert.removeAttribute(_tempAttr.name);
				}
			}
		}
		return formatXml(xmlDom.outerHTML);
		//	$('#special_module_xml').val(formatXml(xmlDom[0].outerHTML));
	} 
}