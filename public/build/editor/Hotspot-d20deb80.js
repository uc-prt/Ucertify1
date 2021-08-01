
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { O as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, P as Dialog, Q as binding_callbacks, R as bind, T as Snackbar, v as validate_slots, o as onMount, A as AH, X as XMLToJSON, U as Draggable, V as Button, W as Checkbox, N as JSONToXML, y as l, w as writable, e as element, f as space, c as create_component, j as attr_dev, l as set_style, k as add_location, Y as src_url_equal, n as insert_dev, p as append_dev, m as mount_component, q as listen_dev, G as prop_dev, Z as add_flush_callback, t as transition_in, a as transition_out, x as detach_dev, b as destroy_component, H as run_all, h as text, _ as select_option, B as noop } from './main-6d74e2c9.js';

function Point(a, b) {
    if (true === isNaN(Number(a))) {
        this.x = 0;
    } else {
        this.x = a;
    }
    if (true === isNaN(Number(b))) {
        this.y = 0;
    } else {
        this.y = b;
    }
    return {
        "X": this.x,
        "Y": this.y
    };
}
const JS = new JUI();
class DooScribPlugin {
	constructor(options) {
		this.prevPoint = undefined;
		this.defaultOptions = {
			target: "",
			penSize:1,
			width: options.width,
			height: options.height,
			cssClass: '',
			onClick: (e)=> {},
			onMove: (e)=> {},
			onPaint: (e)=> {},
			onRelease: (e)=> {}
		};
		this.penWidth = 2;
		this.drawing = false;
		this.cap = 'round';
		this.ID = 'dooScribCanvas' + Math.floor((Math.random()*100) + 1);
		this.drawingSurface = "";
		if (options) this.Settings = {...this.defaultOptions, ...options};
		console.log(this.Settings);
		if (true === isNaN(this.Settings.height)) {
			this.Settings.height = 100;
		}
		if (true === isNaN(this.Settings.width)){
			this.Settings.width = 100;
		}

		this.init();
	}

	init() {
		let _this = this.Settings.target;
		if (_this) {
			if (_this.getAttribute('id') == "hptmain0")  JS.empty(_this);
			JS.insert(_this, `<canvas id='${this.ID}' tabindex='0' class='relative ${this.Settings.cssClass}' type='${this.Settings.type}' correctans='${this.Settings.correctans}' userans=''  height='${this.Settings.height}' width='${this.Settings.width}'></canvas>`, 'beforeend');
		    this.penSize(this.Settings.penSize);
		    this.drawingSurface = document.getElementById(this.ID).getContext('2d');
		    this.drawingSurface.lineWidth = this.penSize();
		    this.drawingSurface.lineCap = this.cap;
		    if (false === this.hasTouch()) {
		        document.getElementById(this.ID).addEventListener('mousedown', this.clickDown.bind(this), true);
		        document.getElementById(this.ID).addEventListener('mousemove', this.moved.bind(this), true);
		        document.getElementById(this.ID).addEventListener('mouseup', this.clickUp.bind(this), true);
		    }
		    else {
		        document.getElementById(this.ID).addEventListener('touchstart', this.clickDown.bind(this), true);
		        document.getElementById(this.ID).addEventListener('touchmove', this.moved.bind(this), true);
		        document.getElementById(this.ID).addEventListener('touchend', this.clickUp.bind(this), true);
		    }
		} else {
			console.error("Target not defined");
		}
	}

	normalizeTouch(e) {
		if (true === this.hasTouch()) {
			let st = window.scrollY;
			if (['touchstart', 'touchmove'].indexOf(e.type) > -1) {
				e.clientX = e.targetTouches[0].pageX;
				e.clientY = e.targetTouches[0].pageY - st;
			}
			if (['touchend'].indexOf(e.type) > -1) {
				e.clientX = e.changedTouches[0].pageX;
				e.clientY = e.changedTouches[0].pageY - st;
			   }
		}
		return e;
	}

	clickDown(e) {
		if (true === this.isDrawing()) {
			return;
		}
		if (!e) {
			e = window.event;
		}
		if (true === this.hasTouch()) {
			e.preventDefault();
			e = this.normalizeTouch(e);
		}
		let offset = JS.offset(this.Settings.target);
		let st = window.scrollY;
		let pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
		this.prevPoint = pt;
		this.drawing = true;
		this.Settings.onClick(pt);
		return false;
	}
	
	moved(e) {
		if (!e) {
			e = window.event;
		}
		if (true === this.hasTouch()) {
			e.preventDefault();
			e = this.normalizeTouch(e);
		}
		var offset = JS.offset(this.Settings.target);
		var st = window.scrollY;
		var pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
		if (true === this.isDrawing()) {
			this.drawLine(this.prevPoint.X, this.prevPoint.Y, pt.X, pt.Y);
			this.prevPoint = pt;
			this.Settings.onPaint(pt);
		}
		else {
			this.Settings.onMove(pt);
		}
		return false;
	}
	
	clickUp(e) {
		if (false === this.isDrawing()) {
			return;
		}
		if (true === this.hasTouch()) {
			e.preventDefault();
			e = this.normalizeTouch(e);
		}
		let offset = JS.offset(this.Settings.target);
		let st = window.scrollY;
		let pt = new Point(e.clientX - offset.left, e.clientY - (offset.top-st));
		this.Settings.onRelease(pt);		    
		this.drawing = false;

		return false;			
	}

	hasTouch() {
		return 'ontouchstart' in window;
	}

	penSize (e) {
		if (undefined !== e){
			if (false === isNaN(Number(e))) {
				this.penWidth = e;
			}
		}
		return this.penWidth;
	}

	isDrawing () {
		if (this.Settings.editable)
			return this.drawing;
	}

	lineCap(e) {
		if (undefined !== e) {
			switch(e){
				case 'butt':
				case 'round':
				case 'square':
					this.cap = e;
					break; 
			}
		}
		return this.cap;
	}

	//window.color = "#000000";
	lineColor(e) {
		if(undefined !== e) {
			let a = JS.parseHtml("<div id='stub' style='backgroundColor:white'></div>");
			a.style.backgroundColor = e;
			let b = a.style.backgroundColor;
			if ((undefined !== b) && ('' !== b)) {
				window.color = e;
			}
		}
		return window.color;
	}

	context() {
		return this.drawingSurface;
	}

	clearSurface() {
		let width = JS.find(document, 'canvas').getAttribute('width').replace('px','');
		let height = JS.find(document, 'canvas').getAttribute('height').replace('px','');
		this.drawingSurface.clearRect(0, 0,width,height);
	}
	
	drawLine(fromX, fromY, toX, toY) {
		if ((undefined !== fromX) && (undefined !== fromY) && (undefined !== toX) && (undefined !== toY)) {
			if((false === isNaN(Number(fromX))) && (false === isNaN(Number(fromY))) && (false === isNaN(Number(toX))) && (false === isNaN(Number(toY)))) {
				this.drawingSurface.lineCap = this.cap;	    
				this.drawingSurface.strokeStyle = window.color;		
				this.drawingSurface.lineWidth = this.penWidth;
				this.drawingSurface.beginPath();				    
				this.drawingSurface.moveTo(fromX, fromY);					
				this.drawingSurface.lineTo(toX, toY);
				this.drawingSurface.stroke();
			}
		}
	}
}

const JS$1 = new JUI();
class HotspotAuthScript {
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
		let attributes = JS$1.serializeArray(JS$1.find('#authoring-modal','.h', 'visible'), 'input');
		let bgimg = "", attr = [], wd, hd, tp, lt, where;
		if (typeof(ui) !== "undefined") {
			attributes = JSON.parse(JS$1.select('#'+key).dataset['attributes']);
			if(!attributes) {
				let attributeArr = [];
				attributeArr[0] = {name:'id',value:key};
				attributeArr[1] = {name:'type', value: 'hotspot'};
				attributeArr[2] = {name:'top', value: parseInt(JS$1.select('#'+key).style.top.split('px')[0]) };
				attributeArr[3] = {name:'left', value: parseInt(JS$1.select('#'+key).style.left.split('px')[0]) };
				attributeArr[4] = {name:'width', value: parseInt(JS$1.select('#'+key).style.width.split('px')[0]) };
				attributeArr[5] = {name:'height', value: parseInt(JS$1.select('#'+key).style.height.split('px')[0]) };
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
				bgimg = JS$1.select('#hptmain').getAttribute('path') + value.value.trim();
			}
			attr[value.name] = value.name;
		});
		switch (type) {
			case "div":
				where = `[id="${key}"]`;
				JS$1.select(`[id="${key}"]`, 'css', {width: wd+'px', height: hd+'px', top: tp+'px', left: lt+'px'}).dataset["attributes"] = JSON.stringify(attributes);
				break;
			case "base":
				where = "hptmain";
				JS$1.select('#hptmain').dataset["attributes"] = JSON.stringify(attributes);
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
					JS$1.select('#option-toolbar', 'css', {width: img.width});
					if (img_ext != 'gif') {
						if (JS$1.selectAll(bgholder + '>img').length > 0) {
							JS$1.select(bgholder, 'css', {width: img.width, height: img.height});
							JS$1.selectAll(bgholder + '>img','attr', {src: bgimg});
						} else if(key == 'hptdraw') {
							JS$1.find(bgholder, 'canvas', {action: 'attr',actionData: {width: img.width, height: img.height} });
							JS$1.selectAll(JS$1.siblings(bgholder), 'css', {width: img.width});
							JS$1.select(bgholder,'css', {width: img.width, height: img.height, backgroundImage:'url(' + bgimg + ')'});
						} else {
							JS$1.insert(JS$1.select(bgholder, 'css', {width:img.width, height:img.height}), '<img src="'+bgimg+'" />', 'beforebegin');
						}
					}
				}, 100);
			} else {
				if (JS$1.selectAll(bgholder + '>img').length > 0) {
					JS$1.select(bgholder, 'css',{width: "600px", height: "250px"});
					JS$1.select(bgholder + '>img', 'remove');
				}
			}
		}
		if (type == "div") {
			return this.updateXML(type, where, attributes,tp,lt,xml);
		}
		if (img_ext != 'gif' && typeof img != "undefined"){
			return this.updateXML(type, where, attributes,img.width,img.height,xml);
		} else {
			JS$1.alert("Please Do not use Gif Image!!!");
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
		let xmlDom = JS$1.parseHtml(xml);
		let insert;
		if (where == "hptmain") {
			insert = xmlDom;
		} else {
			insert = JS$1.find(xmlDom, where);
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

/* clsSMHotspot\Hotspot.svelte generated by Svelte v3.40.2 */

const { Object: Object_1, console: console_1 } = globals;
const file = "clsSMHotspot\\Hotspot.svelte";

// (943:8) <Dialog width="600" bind:visible={state.openImg}>
function create_default_slot_7(ctx) {
	let div5;
	let div0;
	let input0;
	let input0_value_value;
	let t0;
	let button;
	let t2;
	let div1;
	let img;
	let img_src_value;
	let t3;
	let span0;
	let label0;
	let t4;
	let label0_class_value;
	let t5;
	let input1;
	let input1_class_value;
	let input1_defaultvalue_value;
	let t6;
	let div2;
	let span1;
	let label1;
	let t8;
	let select0;
	let option0;
	let option1;
	let option2;
	let option3;
	let option4;
	let option5;
	let div2_class_value;
	let t15;
	let div3;
	let span2;
	let label2;
	let t17;
	let select1;
	let option6;
	let option7;
	let option8;
	let div3_class_value;
	let t21;
	let br;
	let t22;
	let div4;
	let span3;
	let label3;
	let t24;
	let select2;
	let option9;
	let option10;
	let option11;
	let option12;
	let select2_value_value;
	let div4_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div5 = element("div");
			div0 = element("div");
			input0 = element("input");
			t0 = space();
			button = element("button");
			button.textContent = "Upload image";
			t2 = space();
			div1 = element("div");
			img = element("img");
			t3 = space();
			span0 = element("span");
			label0 = element("label");
			t4 = text("Image Alt");
			t5 = space();
			input1 = element("input");
			t6 = space();
			div2 = element("div");
			span1 = element("span");
			label1 = element("label");
			label1.textContent = "Border width";
			t8 = space();
			select0 = element("select");
			option0 = element("option");
			option0.textContent = "None";
			option1 = element("option");
			option1.textContent = "1";
			option2 = element("option");
			option2.textContent = "2";
			option3 = element("option");
			option3.textContent = "3";
			option4 = element("option");
			option4.textContent = "4";
			option5 = element("option");
			option5.textContent = "5";
			t15 = space();
			div3 = element("div");
			span2 = element("span");
			label2 = element("label");
			label2.textContent = "Border color";
			t17 = space();
			select1 = element("select");
			option6 = element("option");
			option6.textContent = "None";
			option7 = element("option");
			option7.textContent = "Black";
			option8 = element("option");
			option8.textContent = "Grey";
			t21 = space();
			br = element("br");
			t22 = space();
			div4 = element("div");
			span3 = element("span");
			label3 = element("label");
			label3.textContent = "Draw line color";
			t24 = space();
			select2 = element("select");
			option9 = element("option");
			option9.textContent = "Please Select";
			option10 = element("option");
			option10.textContent = "Red";
			option11 = element("option");
			option11.textContent = "Black";
			option12 = element("option");
			option12.textContent = "Blue";
			attr_dev(input0, "type", "text");
			attr_dev(input0, "id", "backgroundImage");
			input0.disabled = "true";
			input0.value = input0_value_value = /*state*/ ctx[7].bgImg;
			attr_dev(input0, "margin", "normal");
			set_style(input0, "pointer-events", "none");
			set_style(input0, "width", "76%");
			attr_dev(input0, "class", "form-control mr-2");
			add_location(input0, file, 948, 20, 46916);
			attr_dev(button, "id", "upload_media");
			attr_dev(button, "type", "button");
			button.value = "Upload Media";
			attr_dev(button, "margin", "normal");
			attr_dev(button, "class", "btn btn-outline-primary position-relative");
			add_location(button, file, 957, 20, 47296);
			attr_dev(div0, "class", "d-flex");
			add_location(div0, file, 947, 16, 46874);
			if (!src_url_equal(img.src, img_src_value = /*state*/ ctx[7].image_url)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "background");
			attr_dev(img, "class", "img img-responsive span7");
			add_location(img, file, 966, 20, 47699);
			attr_dev(div1, "class", "mx-auto width8 p-2 border mt-2");
			add_location(div1, file, 965, 16, 47633);
			attr_dev(label0, "for", "imgAlt");

			attr_dev(label0, "class", label0_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "my-1 text-dark"
			: "hidden");

			add_location(label0, file, 969, 20, 47848);
			add_location(span0, file, 968, 16, 47820);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "id", "imgAlt");
			attr_dev(input1, "placeholder", "Alt text");

			attr_dev(input1, "class", input1_class_value = /*state*/ ctx[7].valueMultiple == 4
			? " form-control mt-0"
			: "hidden form-control mt-0");

			attr_dev(input1, "defaultvalue", input1_defaultvalue_value = /*state*/ ctx[7].alt);
			attr_dev(input1, "margin", "normal");
			set_style(input1, "width", "-webkit-fill-available");
			add_location(input1, file, 971, 16, 47993);
			attr_dev(label1, "for", "hotBorder");
			attr_dev(label1, "class", "my-1 text-dark");
			add_location(label1, file, 982, 24, 48537);
			add_location(span1, file, 981, 20, 48505);
			option0.__value = "0";
			option0.value = option0.__value;
			add_location(option0, file, 985, 24, 48724);
			option1.__value = "1";
			option1.value = option1.__value;
			add_location(option1, file, 986, 24, 48781);
			option2.__value = "2";
			option2.value = option2.__value;
			add_location(option2, file, 987, 24, 48835);
			option3.__value = "3";
			option3.value = option3.__value;
			add_location(option3, file, 988, 24, 48889);
			option4.__value = "4";
			option4.value = option4.__value;
			add_location(option4, file, 989, 24, 48943);
			option5.__value = "5";
			option5.value = option5.__value;
			add_location(option5, file, 990, 24, 48997);
			attr_dev(select0, "id", "hotBorder");
			attr_dev(select0, "class", "form-control");
			add_location(select0, file, 984, 20, 48654);

			attr_dev(div2, "class", div2_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block pr-2 mt-2 w-sm"
			: "hidden");

			add_location(div2, file, 980, 16, 48398);
			attr_dev(label2, "for", "hotBorderColor");
			attr_dev(label2, "class", "my-1 text-dark");
			add_location(label2, file, 995, 24, 49232);
			add_location(span2, file, 994, 20, 49200);
			option6.__value = "white";
			option6.value = option6.__value;
			add_location(option6, file, 998, 24, 49429);
			option7.__value = "black";
			option7.value = option7.__value;
			add_location(option7, file, 999, 24, 49490);
			option8.__value = "grey";
			option8.value = option8.__value;
			add_location(option8, file, 1000, 24, 49552);
			attr_dev(select1, "id", "hotBorderColor");
			attr_dev(select1, "class", "form-control");
			add_location(select1, file, 997, 20, 49354);

			attr_dev(div3, "class", div3_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block mt-2 w-sm"
			: "hidden");

			add_location(div3, file, 993, 16, 49098);
			add_location(br, file, 1003, 16, 49659);
			attr_dev(label3, "for", "setLineColor");
			attr_dev(label3, "class", "mt-2 text-dark");
			add_location(label3, file, 1006, 24, 49794);
			add_location(span3, file, 1005, 20, 49762);
			option9.__value = "Please Select";
			option9.value = option9.__value;
			add_location(option9, file, 1009, 24, 50047);
			option10.__value = "red";
			option10.value = option10.__value;
			add_location(option10, file, 1010, 24, 50103);
			option11.__value = "black";
			option11.value = option11.__value;
			add_location(option11, file, 1011, 24, 50161);
			option12.__value = "blue";
			option12.value = option12.__value;
			add_location(option12, file, 1012, 24, 50223);
			attr_dev(select2, "id", "setLineColor");
			attr_dev(select2, "class", "form-control");
			add_location(select2, file, 1008, 20, 49917);
			attr_dev(div4, "class", div4_class_value = /*state*/ ctx[7].valueMultiple == 3 ? " " : "hidden");
			add_location(div4, file, 1004, 16, 49683);
			add_location(div5, file, 946, 12, 46851);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, div0);
			append_dev(div0, input0);
			append_dev(div0, t0);
			append_dev(div0, button);
			append_dev(div5, t2);
			append_dev(div5, div1);
			append_dev(div1, img);
			append_dev(div5, t3);
			append_dev(div5, span0);
			append_dev(span0, label0);
			append_dev(label0, t4);
			append_dev(div5, t5);
			append_dev(div5, input1);
			append_dev(div5, t6);
			append_dev(div5, div2);
			append_dev(div2, span1);
			append_dev(span1, label1);
			append_dev(div2, t8);
			append_dev(div2, select0);
			append_dev(select0, option0);
			append_dev(select0, option1);
			append_dev(select0, option2);
			append_dev(select0, option3);
			append_dev(select0, option4);
			append_dev(select0, option5);
			append_dev(div5, t15);
			append_dev(div5, div3);
			append_dev(div3, span2);
			append_dev(span2, label2);
			append_dev(div3, t17);
			append_dev(div3, select1);
			append_dev(select1, option6);
			append_dev(select1, option7);
			append_dev(select1, option8);
			append_dev(div5, t21);
			append_dev(div5, br);
			append_dev(div5, t22);
			append_dev(div5, div4);
			append_dev(div4, span3);
			append_dev(span3, label3);
			append_dev(div4, t24);
			append_dev(div4, select2);
			append_dev(select2, option9);
			append_dev(select2, option10);
			append_dev(select2, option11);
			append_dev(select2, option12);
			select_option(select2, /*state*/ ctx[7].lineColor);

			if (!mounted) {
				dispose = listen_dev(select2, "blur", /*changeLine*/ ctx[15].bind(this), false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 128 && input0_value_value !== (input0_value_value = /*state*/ ctx[7].bgImg) && input0.value !== input0_value_value) {
				prop_dev(input0, "value", input0_value_value);
			}

			if (dirty[0] & /*state*/ 128 && !src_url_equal(img.src, img_src_value = /*state*/ ctx[7].image_url)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty[0] & /*state*/ 128 && label0_class_value !== (label0_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "my-1 text-dark"
			: "hidden")) {
				attr_dev(label0, "class", label0_class_value);
			}

			if (dirty[0] & /*state*/ 128 && input1_class_value !== (input1_class_value = /*state*/ ctx[7].valueMultiple == 4
			? " form-control mt-0"
			: "hidden form-control mt-0")) {
				attr_dev(input1, "class", input1_class_value);
			}

			if (dirty[0] & /*state*/ 128 && input1_defaultvalue_value !== (input1_defaultvalue_value = /*state*/ ctx[7].alt)) {
				attr_dev(input1, "defaultvalue", input1_defaultvalue_value);
			}

			if (dirty[0] & /*state*/ 128 && div2_class_value !== (div2_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block pr-2 mt-2 w-sm"
			: "hidden")) {
				attr_dev(div2, "class", div2_class_value);
			}

			if (dirty[0] & /*state*/ 128 && div3_class_value !== (div3_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block mt-2 w-sm"
			: "hidden")) {
				attr_dev(div3, "class", div3_class_value);
			}

			if (dirty[0] & /*state*/ 128 && select2_value_value !== (select2_value_value = /*state*/ ctx[7].lineColor)) {
				select_option(select2, /*state*/ ctx[7].lineColor);
			}

			if (dirty[0] & /*state*/ 128 && div4_class_value !== (div4_class_value = /*state*/ ctx[7].valueMultiple == 3 ? " " : "hidden")) {
				attr_dev(div4, "class", div4_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7.name,
		type: "slot",
		source: "(943:8) <Dialog width=\\\"600\\\" bind:visible={state.openImg}>",
		ctx
	});

	return block;
}

// (944:12) 
function create_title_slot_1(ctx) {
	let div1;
	let div0;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			div0.textContent = "Image";
			attr_dev(div0, "style", "");
			add_location(div0, file, 944, 16, 46792);
			attr_dev(div1, "slot", "title");
			set_style(div1, "text-align", "left");
			add_location(div1, file, 943, 12, 46730);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_title_slot_1.name,
		type: "slot",
		source: "(944:12) ",
		ctx
	});

	return block;
}

// (1018:16) <Button                      on:click={handleClose}                      style="text-transform: none"                      key={l.cancel}                  >
function create_default_slot_6(ctx) {
	let t_value = l.cancel + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_6.name,
		type: "slot",
		source: "(1018:16) <Button                      on:click={handleClose}                      style=\\\"text-transform: none\\\"                      key={l.cancel}                  >",
		ctx
	});

	return block;
}

// (1025:16) <Button                      on:click={handleSubmit.bind(this, 'img')}                      class="bg-primary text-white"                      style="text-transform: none"                      key={l.submit}                  >
function create_default_slot_5(ctx) {
	let t_value = l.submit + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(1025:16) <Button                      on:click={handleSubmit.bind(this, 'img')}                      class=\\\"bg-primary text-white\\\"                      style=\\\"text-transform: none\\\"                      key={l.submit}                  >",
		ctx
	});

	return block;
}

// (1017:12) 
function create_footer_slot_1(ctx) {
	let div;
	let button0;
	let t;
	let button1;
	let current;

	button0 = new Button({
			props: {
				style: "text-transform: none",
				key: l.cancel,
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button0.$on("click", /*handleClose*/ ctx[11]);

	button1 = new Button({
			props: {
				class: "bg-primary text-white",
				style: "text-transform: none",
				key: l.submit,
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button1.$on("click", /*handleSubmit*/ ctx[10].bind(this, 'img'));

	const block = {
		c: function create() {
			div = element("div");
			create_component(button0.$$.fragment);
			t = space();
			create_component(button1.$$.fragment);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "svelteFooter");
			add_location(div, file, 1016, 12, 50346);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(button0, div, null);
			append_dev(div, t);
			mount_component(button1, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button0_changes = {};

			if (dirty[1] & /*$$scope*/ 65536) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty[1] & /*$$scope*/ 65536) {
				button1_changes.$$scope = { dirty, ctx };
			}

			button1.$set(button1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button0.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button0.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(button0);
			destroy_component(button1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_footer_slot_1.name,
		type: "slot",
		source: "(1017:12) ",
		ctx
	});

	return block;
}

// (1035:8) <Dialog width="600" bind:visible={state.openDrag}>
function create_default_slot_4(ctx) {
	let div6;
	let div2;
	let div0;
	let span0;
	let label0;
	let t1;
	let input0;
	let t2;
	let div1;
	let span1;
	let label1;
	let t4;
	let input1;
	let t5;
	let div5;
	let div3;
	let span2;
	let label2;
	let t7;
	let input2;
	let t8;
	let div4;
	let span3;
	let label3;
	let t10;
	let input3;

	const block = {
		c: function create() {
			div6 = element("div");
			div2 = element("div");
			div0 = element("div");
			span0 = element("span");
			label0 = element("label");
			label0.textContent = "Height";
			t1 = space();
			input0 = element("input");
			t2 = space();
			div1 = element("div");
			span1 = element("span");
			label1 = element("label");
			label1.textContent = "Width";
			t4 = space();
			input1 = element("input");
			t5 = space();
			div5 = element("div");
			div3 = element("div");
			span2 = element("span");
			label2 = element("label");
			label2.textContent = "Top";
			t7 = space();
			input2 = element("input");
			t8 = space();
			div4 = element("div");
			span3 = element("span");
			label3 = element("label");
			label3.textContent = "Left";
			t10 = space();
			input3 = element("input");
			attr_dev(label0, "for", "dragHeight");
			attr_dev(label0, "class", "my-1 text-dark");
			add_location(label0, file, 1042, 28, 51307);
			add_location(span0, file, 1041, 24, 51271);
			attr_dev(input0, "type", "number");
			attr_dev(input0, "id", "dragHeight");
			attr_dev(input0, "placeholder", "Height");
			attr_dev(input0, "defaultvalue", " ");
			attr_dev(input0, "class", "form-control");
			add_location(input0, file, 1044, 24, 51427);
			attr_dev(div0, "class", "col-6 pr-1");
			add_location(div0, file, 1040, 20, 51221);
			attr_dev(label1, "for", "dragWidth");
			attr_dev(label1, "class", "my-1 text-dark");
			add_location(label1, file, 1054, 28, 51831);
			add_location(span1, file, 1053, 24, 51795);
			attr_dev(input1, "type", "number");
			attr_dev(input1, "id", "dragWidth");
			attr_dev(input1, "placeholder", "Width");
			attr_dev(input1, "defaultvalue", " ");
			attr_dev(input1, "class", "form-control");
			add_location(input1, file, 1056, 24, 51949);
			attr_dev(div1, "class", "col-6 pl-1");
			add_location(div1, file, 1052, 20, 51745);
			attr_dev(div2, "class", "row");
			add_location(div2, file, 1039, 16, 51182);
			attr_dev(label2, "for", "dragTop");
			attr_dev(label2, "class", "my-1 text-dark");
			add_location(label2, file, 1068, 28, 52415);
			add_location(span2, file, 1067, 24, 52379);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "id", "dragTop");
			attr_dev(input2, "placeholder", "Top");
			attr_dev(input2, "defaultvalue", " ");
			attr_dev(input2, "class", "form-control");
			add_location(input2, file, 1070, 24, 52529);
			attr_dev(div3, "class", "col-6 pr-1");
			add_location(div3, file, 1066, 20, 52329);
			attr_dev(label3, "for", "dragLeft");
			attr_dev(label3, "class", "my-1 text-dark");
			add_location(label3, file, 1080, 28, 52927);
			add_location(span3, file, 1079, 24, 52891);
			attr_dev(input3, "type", "number");
			attr_dev(input3, "id", "dragLeft");
			attr_dev(input3, "placeholder", "Left");
			attr_dev(input3, "defaultvalue", " ");
			attr_dev(input3, "class", "form-control");
			add_location(input3, file, 1082, 24, 53043);
			attr_dev(div4, "class", "col-6 pl-1");
			add_location(div4, file, 1078, 20, 52841);
			attr_dev(div5, "class", "row mt-2");
			add_location(div5, file, 1065, 16, 52285);
			add_location(div6, file, 1038, 12, 51159);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div6, anchor);
			append_dev(div6, div2);
			append_dev(div2, div0);
			append_dev(div0, span0);
			append_dev(span0, label0);
			append_dev(div0, t1);
			append_dev(div0, input0);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, span1);
			append_dev(span1, label1);
			append_dev(div1, t4);
			append_dev(div1, input1);
			append_dev(div6, t5);
			append_dev(div6, div5);
			append_dev(div5, div3);
			append_dev(div3, span2);
			append_dev(span2, label2);
			append_dev(div3, t7);
			append_dev(div3, input2);
			append_dev(div5, t8);
			append_dev(div5, div4);
			append_dev(div4, span3);
			append_dev(span3, label3);
			append_dev(div4, t10);
			append_dev(div4, input3);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div6);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(1035:8) <Dialog width=\\\"600\\\" bind:visible={state.openDrag}>",
		ctx
	});

	return block;
}

// (1036:12) 
function create_title_slot(ctx) {
	let div1;
	let div0;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			div0.textContent = "Hotspot";
			attr_dev(div0, "style", "");
			add_location(div0, file, 1036, 16, 51098);
			attr_dev(div1, "slot", "title");
			set_style(div1, "text-align", "left");
			add_location(div1, file, 1035, 12, 51036);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_title_slot.name,
		type: "slot",
		source: "(1036:12) ",
		ctx
	});

	return block;
}

// (1094:16) <Button                      on:click={handleClose}                      style="text-transform: none"                      key={l.cancel + "1"}                  >
function create_default_slot_3(ctx) {
	let t_value = l.cancel + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(1094:16) <Button                      on:click={handleClose}                      style=\\\"text-transform: none\\\"                      key={l.cancel + \\\"1\\\"}                  >",
		ctx
	});

	return block;
}

// (1101:16) <Button                      on:click={handleSubmit.bind(this, 'drag')}                      class="bg-primary text-white"                      style="text-transform: none"                      key={l.done}                  >
function create_default_slot_2(ctx) {
	let t_value = l.done + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(1101:16) <Button                      on:click={handleSubmit.bind(this, 'drag')}                      class=\\\"bg-primary text-white\\\"                      style=\\\"text-transform: none\\\"                      key={l.done}                  >",
		ctx
	});

	return block;
}

// (1093:12) 
function create_footer_slot(ctx) {
	let div;
	let button0;
	let t;
	let button1;
	let current;

	button0 = new Button({
			props: {
				style: "text-transform: none",
				key: l.cancel + "1",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button0.$on("click", /*handleClose*/ ctx[11]);

	button1 = new Button({
			props: {
				class: "bg-primary text-white",
				style: "text-transform: none",
				key: l.done,
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button1.$on("click", /*handleSubmit*/ ctx[10].bind(this, 'drag'));

	const block = {
		c: function create() {
			div = element("div");
			create_component(button0.$$.fragment);
			t = space();
			create_component(button1.$$.fragment);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "svelteFooter");
			add_location(div, file, 1092, 12, 53397);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(button0, div, null);
			append_dev(div, t);
			mount_component(button1, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button0_changes = {};

			if (dirty[1] & /*$$scope*/ 65536) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty[1] & /*$$scope*/ 65536) {
				button1_changes.$$scope = { dirty, ctx };
			}

			button1.$set(button1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button0.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button0.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(button0);
			destroy_component(button1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_footer_slot.name,
		type: "slot",
		source: "(1093:12) ",
		ctx
	});

	return block;
}

// (1111:8) <Snackbar bind:visible={state.snackback} bg="#f44336" bottom={true} timeout={10} style="position:fixed; bottom:50px">
function create_default_slot_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text(/*message*/ ctx[9]);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(1111:8) <Snackbar bind:visible={state.snackback} bg=\\\"#f44336\\\" bottom={true} timeout={10} style=\\\"position:fixed; bottom:50px\\\">",
		ctx
	});

	return block;
}

// (1114:16) <Button color="#ff0" on:click={() => (state.snackback = false)}>
function create_default_slot(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Close");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(1114:16) <Button color=\\\"#ff0\\\" on:click={() => (state.snackback = false)}>",
		ctx
	});

	return block;
}

// (1113:12) 
function create_action_slot(ctx) {
	let span;
	let button;
	let current;

	button = new Button({
			props: {
				color: "#ff0",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*click_handler*/ ctx[20]);

	const block = {
		c: function create() {
			span = element("span");
			create_component(button.$$.fragment);
			attr_dev(span, "slot", "action");
			add_location(span, file, 1112, 12, 54179);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			mount_component(button, span, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty[1] & /*$$scope*/ 65536) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			destroy_component(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_action_slot.name,
		type: "slot",
		source: "(1113:12) ",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div10;
	let center;
	let div0;
	let div0_type_value;
	let t0;
	let div5;
	let div2;
	let div1;
	let span0;
	let t1;
	let span1;
	let t3;
	let div4;
	let div3;
	let button0;
	let i0;
	let t4;
	let div9;
	let div6;
	let button1;
	let i1;
	let t5;
	let img;
	let img_src_value;
	let img_alt_value;
	let t6;
	let div8;
	let div7;
	let button2;
	let i2;
	let div8_draggable_value;
	let t7;
	let textarea;
	let textarea_value_value;
	let t8;
	let dialog0;
	let updating_visible;
	let t9;
	let dialog1;
	let updating_visible_1;
	let t10;
	let snackbar;
	let updating_visible_2;
	let current;
	let mounted;
	let dispose;

	function dialog0_visible_binding(value) {
		/*dialog0_visible_binding*/ ctx[18](value);
	}

	let dialog0_props = {
		width: "600",
		$$slots: {
			footer: [create_footer_slot_1],
			title: [create_title_slot_1],
			default: [create_default_slot_7]
		},
		$$scope: { ctx }
	};

	if (/*state*/ ctx[7].openImg !== void 0) {
		dialog0_props.visible = /*state*/ ctx[7].openImg;
	}

	dialog0 = new Dialog({ props: dialog0_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog0, 'visible', dialog0_visible_binding));

	function dialog1_visible_binding(value) {
		/*dialog1_visible_binding*/ ctx[19](value);
	}

	let dialog1_props = {
		width: "600",
		$$slots: {
			footer: [create_footer_slot],
			title: [create_title_slot],
			default: [create_default_slot_4]
		},
		$$scope: { ctx }
	};

	if (/*state*/ ctx[7].openDrag !== void 0) {
		dialog1_props.visible = /*state*/ ctx[7].openDrag;
	}

	dialog1 = new Dialog({ props: dialog1_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog1, 'visible', dialog1_visible_binding));

	function snackbar_visible_binding(value) {
		/*snackbar_visible_binding*/ ctx[21](value);
	}

	let snackbar_props = {
		bg: "#f44336",
		bottom: true,
		timeout: 10,
		style: "position:fixed; bottom:50px",
		$$slots: {
			action: [create_action_slot],
			default: [create_default_slot_1]
		},
		$$scope: { ctx }
	};

	if (/*state*/ ctx[7].snackback !== void 0) {
		snackbar_props.visible = /*state*/ ctx[7].snackback;
	}

	snackbar = new Snackbar({ props: snackbar_props, $$inline: true });
	binding_callbacks.push(() => bind(snackbar, 'visible', snackbar_visible_binding));

	const block = {
		c: function create() {
			div10 = element("div");
			center = element("center");
			div0 = element("div");
			t0 = space();
			div5 = element("div");
			div2 = element("div");
			div1 = element("div");
			span0 = element("span");
			t1 = space();
			span1 = element("span");
			span1.textContent = `${l.reset}`;
			t3 = space();
			div4 = element("div");
			div3 = element("div");
			button0 = element("button");
			i0 = element("i");
			t4 = space();
			div9 = element("div");
			div6 = element("div");
			button1 = element("button");
			i1 = element("i");
			t5 = space();
			img = element("img");
			t6 = space();
			div8 = element("div");
			div7 = element("div");
			button2 = element("button");
			i2 = element("i");
			t7 = space();
			textarea = element("textarea");
			t8 = space();
			create_component(dialog0.$$.fragment);
			t9 = space();
			create_component(dialog1.$$.fragment);
			t10 = space();
			create_component(snackbar.$$.fragment);
			attr_dev(div0, "class", "tinymce-editor-response");
			attr_dev(div0, "id", "text0");
			attr_dev(div0, "type", div0_type_value = /*moduleArr*/ ctx[6][0]);
			set_style(div0, "width", /*bgImgWidth*/ ctx[1] + ", \r\n                    height: " + /*bgImgHeight*/ ctx[0] + ", \r\n                    border: 1px solid #ccc");
			set_style(div0, "outline", "none");
			set_style(div0, "padding", "10px");
			set_style(div0, "textAlign", "left");
			set_style(div0, "display", "none");
			set_style(div0, "overflowY", "scroll\r\n                ");
			attr_dev(div0, "contenteditable", "true");
			add_location(div0, file, 832, 12, 42241);
			attr_dev(span0, "class", "icomoon-new-24px-reset-1 s3");
			set_style(span0, "vertical-align", "text-top");
			add_location(span0, file, 864, 24, 43412);
			attr_dev(span1, "class", "position-relative bottom1");
			add_location(span1, file, 865, 24, 43521);
			attr_dev(div1, "id", "resetAuth");
			attr_dev(div1, "class", "reset btn btn-outline-primary btn-sm height27 mt-sm2 mr-sm2 float-right");
			set_style(div1, "width", "90px");
			add_location(div1, file, 859, 20, 43166);
			set_style(div2, "width", /*bgImgWidth*/ ctx[1]);
			set_style(div2, "height", "32px");
			set_style(div2, "background", "#d9e7fd");
			set_style(div2, "border-top", "2px solid #96bbf6\r\n                ");
			add_location(div2, file, 851, 16, 42899);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file, 886, 28, 44463);
			attr_dev(button0, "name", "change_image");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light px-1 pt-sm1 pb-sm1 mt");
			add_location(button0, file, 880, 24, 44163);
			attr_dev(div3, "class", "btn-group tools");
			add_location(div3, file, 879, 20, 44108);
			attr_dev(div4, "id", "hptdraw");
			set_style(div4, "width", /*bgImgWidth*/ ctx[1]);
			set_style(div4, "height", /*bgImgHeight*/ ctx[0]);
			set_style(div4, "background-image", "url('" + (/*bgImgPath*/ ctx[8] + /*state*/ ctx[7].bgImg) + "')");
			set_style(div4, "background-repeat", "no-repeat");
			set_style(div4, "position", "relative");
			set_style(div4, "border", "1px solid #e0e0e0");
			add_location(div4, file, 868, 16, 43647);
			attr_dev(div5, "class", "drawImage d-none");
			add_location(div5, file, 850, 12, 42851);
			attr_dev(i1, "class", "icomoon-24px-edit-1");
			add_location(i1, file, 903, 24, 45103);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light px-1 pt-sm1 pb-sm1 mt");
			add_location(button1, file, 898, 20, 44872);
			attr_dev(div6, "class", "btn-group tools");
			add_location(div6, file, 897, 16, 44821);
			attr_dev(img, "id", "im");
			attr_dev(img, "class", "hotSpotImg border");
			if (!src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[8] + /*state*/ ctx[7].bgImg)) attr_dev(img, "src", img_src_value);
			set_style(img, "height", /*state*/ ctx[7].imgheight);
			set_style(img, "width", /*state*/ ctx[7].imgwidth);
			set_style(img, "border", /*state*/ ctx[7].hotBorder);
			set_style(img, "border-color", /*state*/ ctx[7].hotBorderColor);
			attr_dev(img, "alt", img_alt_value = /*state*/ ctx[7].alt);
			add_location(img, file, 906, 16, 45211);
			attr_dev(i2, "class", "icomoon-24px-edit-1");
			add_location(i2, file, 930, 28, 46292);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-light px-1 pt-sm1 pb-sm1");
			add_location(button2, file, 925, 24, 46042);
			attr_dev(div7, "class", "btn-group tools h");
			add_location(div7, file, 924, 20, 45985);
			attr_dev(div8, "draggable", div8_draggable_value = true);
			attr_dev(div8, "class", "drag-resize position-absolute");
			attr_dev(div8, "id", "ID0");
			set_style(div8, "left", /*hotAreaLeft*/ ctx[5]);
			set_style(div8, "top", /*hotAreaTop*/ ctx[2]);
			set_style(div8, "height", /*hotAreaHeight*/ ctx[3]);
			set_style(div8, "width", /*hotAreaWidth*/ ctx[4]);
			add_location(div8, file, 918, 16, 45693);
			attr_dev(div9, "id", "hptmain");
			attr_dev(div9, "path", /*bgImgPath*/ ctx[8]);
			attr_dev(div9, "class", "d-none");
			set_style(div9, "position", "relative");
			set_style(div9, "width", /*bgImgWidth*/ ctx[1]);
			add_location(div9, file, 891, 12, 44619);
			attr_dev(textarea, "class", "d-none");
			attr_dev(textarea, "id", "special_module_xml");
			attr_dev(textarea, "name", "special_module_xml");
			textarea.value = textarea_value_value = /*state*/ ctx[7].xml;
			add_location(textarea, file, 935, 12, 46448);
			attr_dev(center, "class", "mt");
			attr_dev(center, "id", "mainContent");
			add_location(center, file, 831, 8, 42191);
			add_location(div10, file, 830, 4, 42176);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div10, anchor);
			append_dev(div10, center);
			append_dev(center, div0);
			append_dev(center, t0);
			append_dev(center, div5);
			append_dev(div5, div2);
			append_dev(div2, div1);
			append_dev(div1, span0);
			append_dev(div1, t1);
			append_dev(div1, span1);
			append_dev(div5, t3);
			append_dev(div5, div4);
			append_dev(div4, div3);
			append_dev(div3, button0);
			append_dev(button0, i0);
			append_dev(center, t4);
			append_dev(center, div9);
			append_dev(div9, div6);
			append_dev(div6, button1);
			append_dev(button1, i1);
			append_dev(div9, t5);
			append_dev(div9, img);
			append_dev(div9, t6);
			append_dev(div9, div8);
			append_dev(div8, div7);
			append_dev(div7, button2);
			append_dev(button2, i2);
			append_dev(center, t7);
			append_dev(center, textarea);
			append_dev(div10, t8);
			mount_component(dialog0, div10, null);
			append_dev(div10, t9);
			mount_component(dialog1, div10, null);
			append_dev(div10, t10);
			mount_component(snackbar, div10, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div0, "keyup", /*setData*/ ctx[14], false, false, false),
					listen_dev(button0, "click", /*changeImg*/ ctx[12].bind(this, 'img'), false, false, false),
					listen_dev(button1, "click", /*changeImg*/ ctx[12].bind(this, 'img'), false, false, false),
					listen_dev(button2, "click", /*changeDrag*/ ctx[13].bind(this, 'drag'), false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (!current || dirty[0] & /*moduleArr*/ 64 && div0_type_value !== (div0_type_value = /*moduleArr*/ ctx[6][0])) {
				attr_dev(div0, "type", div0_type_value);
			}

			if (!current || dirty[0] & /*bgImgWidth, bgImgHeight*/ 3) {
				set_style(div0, "width", /*bgImgWidth*/ ctx[1] + ", \r\n                    height: " + /*bgImgHeight*/ ctx[0] + ", \r\n                    border: 1px solid #ccc");
			}

			if (!current || dirty[0] & /*bgImgWidth*/ 2) {
				set_style(div2, "width", /*bgImgWidth*/ ctx[1]);
			}

			if (!current || dirty[0] & /*bgImgWidth*/ 2) {
				set_style(div4, "width", /*bgImgWidth*/ ctx[1]);
			}

			if (!current || dirty[0] & /*bgImgHeight*/ 1) {
				set_style(div4, "height", /*bgImgHeight*/ ctx[0]);
			}

			if (!current || dirty[0] & /*state*/ 128) {
				set_style(div4, "background-image", "url('" + (/*bgImgPath*/ ctx[8] + /*state*/ ctx[7].bgImg) + "')");
			}

			if (!current || dirty[0] & /*state*/ 128 && !src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[8] + /*state*/ ctx[7].bgImg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (!current || dirty[0] & /*state*/ 128) {
				set_style(img, "height", /*state*/ ctx[7].imgheight);
			}

			if (!current || dirty[0] & /*state*/ 128) {
				set_style(img, "width", /*state*/ ctx[7].imgwidth);
			}

			if (!current || dirty[0] & /*state*/ 128) {
				set_style(img, "border", /*state*/ ctx[7].hotBorder);
			}

			if (!current || dirty[0] & /*state*/ 128) {
				set_style(img, "border-color", /*state*/ ctx[7].hotBorderColor);
			}

			if (!current || dirty[0] & /*state*/ 128 && img_alt_value !== (img_alt_value = /*state*/ ctx[7].alt)) {
				attr_dev(img, "alt", img_alt_value);
			}

			if (!current || dirty[0] & /*hotAreaLeft*/ 32) {
				set_style(div8, "left", /*hotAreaLeft*/ ctx[5]);
			}

			if (!current || dirty[0] & /*hotAreaTop*/ 4) {
				set_style(div8, "top", /*hotAreaTop*/ ctx[2]);
			}

			if (!current || dirty[0] & /*hotAreaHeight*/ 8) {
				set_style(div8, "height", /*hotAreaHeight*/ ctx[3]);
			}

			if (!current || dirty[0] & /*hotAreaWidth*/ 16) {
				set_style(div8, "width", /*hotAreaWidth*/ ctx[4]);
			}

			if (!current || dirty[0] & /*bgImgWidth*/ 2) {
				set_style(div9, "width", /*bgImgWidth*/ ctx[1]);
			}

			if (!current || dirty[0] & /*state*/ 128 && textarea_value_value !== (textarea_value_value = /*state*/ ctx[7].xml)) {
				prop_dev(textarea, "value", textarea_value_value);
			}

			const dialog0_changes = {};

			if (dirty[0] & /*state*/ 128 | dirty[1] & /*$$scope*/ 65536) {
				dialog0_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty[0] & /*state*/ 128) {
				updating_visible = true;
				dialog0_changes.visible = /*state*/ ctx[7].openImg;
				add_flush_callback(() => updating_visible = false);
			}

			dialog0.$set(dialog0_changes);
			const dialog1_changes = {};

			if (dirty[1] & /*$$scope*/ 65536) {
				dialog1_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible_1 && dirty[0] & /*state*/ 128) {
				updating_visible_1 = true;
				dialog1_changes.visible = /*state*/ ctx[7].openDrag;
				add_flush_callback(() => updating_visible_1 = false);
			}

			dialog1.$set(dialog1_changes);
			const snackbar_changes = {};

			if (dirty[0] & /*state*/ 128 | dirty[1] & /*$$scope*/ 65536) {
				snackbar_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible_2 && dirty[0] & /*state*/ 128) {
				updating_visible_2 = true;
				snackbar_changes.visible = /*state*/ ctx[7].snackback;
				add_flush_callback(() => updating_visible_2 = false);
			}

			snackbar.$set(snackbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dialog0.$$.fragment, local);
			transition_in(dialog1.$$.fragment, local);
			transition_in(snackbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dialog0.$$.fragment, local);
			transition_out(dialog1.$$.fragment, local);
			transition_out(snackbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div10);
			destroy_component(dialog0);
			destroy_component(dialog1);
			destroy_component(snackbar);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function initEditor() {
	tinymce.init({
		selector: '.tinymce-editor-response',
		inline: true,
		theme: 'modern',
		min_width: 100,
		resize: true,
		menubar: false,
		toolbar: false,
		elementpath: false,
		statusbar: false,
		force_br_newlines: true,
		remove_trailing_brs: true,
		forced_root_block: false,
		paste_as_text: true,
		//extended_valid_elements : 'input[onChange|id|name|class|style|correctAns|userAns],div[class|style],span[id|contentEditable|class|style]',
		extended_valid_elements: 'span[onClick|contentEditable]',
		valid_elements: "*[*]",
		extended_valid_elements: 'uc:syntax,uc:ref',
		custom_elements: 'uc:syntax,~uc:ref',
		plugins: ["res contextmenu paste"],
		//toolbar1: "response",
		contextmenu: "link resp"
	});
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Hotspot', slots, []);
	let { xml } = $$props;
	let { getChildXml } = $$props;
	const authScript = new HotspotAuthScript();

	// variable declaration
	let count = 0;

	let drawstr = '';
	let bgImgHeight = '';
	let bgImgWidth = '';
	let bgImgPath = '//s3.amazonaws.com/jigyaasa_content_static/';
	let hotAreaTop = '';
	let hotAreaHeight = '';
	let hotAreaWidth = '';
	let hotAreaLeft = '';
	let cmTime = {};
	let defaultXml = [], moduleArr = [], imgWidth = '', imgHeight = '', correct = '';
	defaultXml[1] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textclick" top="10" left="20" width="30" height="50"><!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--></div></smxml>';
	defaultXml[2] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textselect" top="10" left="20" width="30" height="50"><!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--></div></smxml>';
	defaultXml[3] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="imagehighlight" top="10" left="20" width="30" height="50"><!--[CDATA[]]--></div></smxml>';
	defaultXml[4] = '<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="hotspot" top="172" left="220" width="112" height="80"><!--[CDATA[]]--></div></smxml>';

	// for module type indentification
	moduleArr["1"] = "textclick";

	moduleArr["2"] = "textselect";
	moduleArr["3"] = "imagehighlight";
	moduleArr["4"] = "hotspot";
	moduleArr["textclick"] = "1";
	moduleArr["textselect"] = "2";
	moduleArr["imagehighlight"] = "3";
	moduleArr["hotspot"] = "4";
	let message = '';
	let state = {};

	let hdd = writable({
		xml: '',
		openImg: false,
		openDrag: false,
		bgImg: '',
		snackback: false,
		valueMultiple: '1',
		cdata: '',
		bgImgWidth: "600px",
		bgImgHeight: "360px",
		alt: "",
		imgheight: "",
		imgwidth: "",
		hotBorder: "",
		hotBorderColor: "",
		lineColor: "",
		image_url: ""
	});

	const unsubscribe = hdd.subscribe(items => {
		$$invalidate(7, state = items);
	});

	// this will added the file in the script before rendering  
	onMount(() => {
		AH.createLink(window.itemUrl + "clsSMHotspot/css/hotspot.min.css", { preload: true });
		didMount();
	});

	// call just after rendering
	function didMount() {
		$$invalidate(7, state.xml = xml, state);

		// here it converts the xml to json using the function XMLToJSON
		let newXml = XMLToJSON(xml);

		if (newXml) {
			// checking for the type if in xml there is any type given or not if not then assign it hotspot type
			newXml.smxml.div._type = newXml.smxml.div._type
			? newXml.smxml.div._type
			: 'hotspot';

			$$invalidate(7, state.valueMultiple = moduleArr[newXml.smxml.div._type], state);

			// parsing the xml according to the type
			switch (moduleArr[newXml.smxml.div._type]) {
				case "1":
				case "2":
					parseXmlForText(newXml);
					break;
				case "3":
					parseXmlForDraw(newXml);
					break;
				case "4":
					{
						parseXML(newXml);
						bindKey();
					}
					break;
			}
		}

		// tinyMCE Plugin
		tinyMCE.PluginManager.add('res', function (editor) {
			editor.addMenuItem('resp', {
				text: "Add Token",
				id: "addToken",
				onclick() {
					addToken();
				},
				context: 'insert',
				prependToContext: true
			});
		});

		initEditor();
		AH.listen(document, 'mousedown', '.draggable', setData);
		cmTime = {};

		AH.listen(document, 'touchstart', '.tinymce-editor-response', () => {
			cmTime.s = new Date().getTime();
		});

		AH.listen(document, 'touchend', '.tinymce-editor-response', () => {
			cmTime.e = new Date().getTime() - cmTime.s;

			if (cmTime.e / 1000 > 1) {
				addToken();
				cmTime = {};
			}
		});

		// binding the event for the image upload dialog
		AH.listen(document, "click", "#upload_media", () => {
			//AH.getBS("#modal-media-upload", 'Modal').show();
			window.setImage("backgroundImage");
		});

		AH.bind(document, 'click', () => {
			$$invalidate(7, state.image_url = bgImgPath + '' + AH.select('#backgroundImage').value, state);
		});
	}

	// for warning purpose
	function handleWarning() {
		let height_value = AH.select('#dragHeight').value;
		let height_integer_value = parseInt(height_value);
		let width_value = AH.select('#dragWidth').value;
		let width_integer_value = parseInt(width_value);
		let top_value = AH.select('#dragTop').value;
		let top_integer_value = parseInt(top_value);
		let left_value = AH.select('#dragLeft').value;
		let left_integer_value = parseInt(left_value);
		let bgHeight_data = parseInt(bgImgHeight);
		let bgWidth_data = parseInt(bgImgWidth);

		if (isNaN(Number(height_value))) {
			AH.showmsg('Only numeric value accepted.');
			AH.select('#dragHeight').focus();
			return false;
		} else {
			if (isNaN(height_integer_value)) {
				AH.showmsg('Only numeric value accepted.');
				AH.select('#dragHeight').focus();
				return false;
			} else {
				if (height_integer_value > parseInt(bgHeight_data / 2) || height_integer_value < 32) {
					AH.showmsg('Height must be greater than or equal to 32 and less than or equal to ' + parseInt(bgHeight_data / 2));
					AH.select('#dragHeight').focus();
					return false;
				}
			}
		}

		if (isNaN(Number(width_value))) {
			AH.showmsg('Only numeric value accepted.');
			AH.select('#dragWidth').focus();
			return false;
		} else {
			if (isNaN(width_integer_value)) {
				AH.showmsg('Only numeric value accepted.');
				AH.select('#dragWidth').focus();
				return false;
			} else {
				if (width_integer_value > parseInt(bgWidth_data / 2) || width_integer_value < 32) {
					AH.showmsg('Width must be greater than or equal to 32 and less than or equal to ' + parseInt(bgWidth_data / 2));
					AH.select('#dragWidth').focus();
					return false;
				}
			}
		}

		if (isNaN(Number(top_value))) {
			AH.showmsg('Only numeric value accepted.');
			AH.select('#dragTop').focus();
			return false;
		} else {
			if (isNaN(top_integer_value)) {
				AH.showmsg('Only numeric value accepted.');
				AH.select('#dragTop').focus();
				return false;
			} else {
				if (top_integer_value > bgHeight_data - height_integer_value || top_integer_value < 0) {
					AH.showmsg('Top value must be greater than or equal to 0 and less than or equal to ' + (bgHeight_data - height_integer_value));
					AH.select('#dragTop').focus();
					return false;
				}
			}
		}

		if (isNaN(Number(left_value))) {
			AH.showmsg('Only numeric value accepted.');
			AH.select('#dragLeft').focus();
			return false;
		} else {
			if (isNaN(left_integer_value)) {
				AH.showmsg('Only numeric value accepted.');
				AH.select('#dragLeft').focus();
				return false;
			} else {
				if (left_integer_value > bgWidth_data - width_integer_value || left_integer_value < 0) {
					AH.showmsg('Left value must be greater than or equal to 0 and less than or equal to ' + (bgWidth_data - width_integer_value));
					AH.select('#dragLeft').focus();
					return false;
				}
			}
		}

		return true;
	}

	// 	it is called in case of text and token highlight to add token
	function addToken() {
		// getting the selected text in content variable
		let content = tinyMCE.activeEditor.selection.getContent({ format: 'raw' });

		// Replacing the content to add style on it
		content = content.replace(content, '<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">' + content + '</span>');

		// sett the content
		tinyMCE.activeEditor.selection.setContent(content);

		// update the cdata 
		setData();
	}

	// for parsing the xml
	function parseXML(QXML) {
		$$invalidate(7, state.bgImg = QXML.smxml._bgimg, state);
		$$invalidate(0, bgImgHeight = QXML.smxml._height + 'px'); // Image Height
		$$invalidate(7, state.alt = QXML.smxml._alt, state);
		$$invalidate(1, bgImgWidth = QXML.smxml._width + 'px'); // Image Width
		$$invalidate(4, hotAreaWidth = QXML.smxml.div._width + 'px'); // draggable area width
		$$invalidate(3, hotAreaHeight = QXML.smxml.div._height + 'px'); // draggable area height
		$$invalidate(5, hotAreaLeft = QXML.smxml.div._left + 'px'); // draggable area left
		$$invalidate(2, hotAreaTop = QXML.smxml.div._top + 'px'); // draggable area top
		let image = new Image();
		image.src = bgImgPath + QXML.smxml._bgimg;

		image.onload = function () {
			$$invalidate(0, bgImgHeight = this.height + 'px');
			$$invalidate(1, bgImgWidth = this.width + 'px');

			imgHeight = QXML.smxml.div._imgheight
			? QXML.smxml.div._imgheight + 'px'
			: "auto !important";

			imgWidth = QXML.smxml.div._imgwidth
			? QXML.smxml.div._imgwidth + 'px'
			: "auto !important";

			$$invalidate(7, state.imgwidth = imgWidth, state);
			$$invalidate(7, state.imgheight = imgHeight, state);

			AH.select('#hptmain', 'css', {
				'height': bgImgHeight,
				'width': bgImgWidth
			});
		};

		AH.select('#hptmain', 'toggleClass', 'd-none');
		AH.selectAll('.drawImage,#text0', 'hide');
		AH.find(document, 'canvas', { action: 'remove' });
		documentReady();
	}

	// for parsing the xml in case of Draw highlight
	function parseXmlForDraw(QXML) {
		$$invalidate(7, state.bgImg = QXML.smxml._bgimg, state);
		let image = new Image();

		image.onload = function () {
			$$invalidate(0, bgImgHeight = QXML.smxml._height > this.height
			? QXML.smxml._height + 'px'
			: this.height + 'px');

			$$invalidate(1, bgImgWidth = QXML.smxml._width > this.width
			? QXML.smxml._width + 'px'
			: this.width + 'px');

			//AH.find('#hptdraw', 'canvas', {action: 'attr', actionData: {height: bgImgHeight, width: bgImgWidth}});
			AH.find('#previewSection', '.reset').click();

			AH.find('#mainContent', '#hptdraw canvas', {
				action: 'attr',
				actionData: {
					height: bgImgHeight,
					width: bgImgWidth,
					correctans: QXML.smxml.div.__cdata
				}
			});

			// for updating the xml in case of image highlight
			update_XMLValue();
		};

		image.src = bgImgPath + QXML.smxml._bgimg;
		$$invalidate(7, state.bgImg = QXML.smxml._bgimg, state);
		AH.selectAll('.drawImage', 'toggleClass', 'd-none');
		AH.selectAll('#text0,#hptmain', 'hide');
		documentReady();
	}

	// parse xml function for text & token highlight module(textselect, textclick)
	function parseXmlForText(QXML) {
		$$invalidate(7, state.cdata = QXML.smxml.div.__cdata, state);
		$$invalidate(0, bgImgHeight = QXML.smxml._height + 'px');
		$$invalidate(1, bgImgWidth = QXML.smxml._width + 'px');
		AH.select('#text0', 'show');
		AH.selectAll('.drawImage,#hptmain', 'hide');
		AH.find(document, 'canvas').remove();

		// for changing the {% , %} , symbols with span
		getData(QXML.smxml.div.__cdata);
	}

	// for binding the data
	function bind_data(xml) {
		let elem = xml.getAttribute('id'), attrs = [];

		if (xml.nodeName == "SMXML") {
			elem = xml.children[0].getAttribute('type') == 'imagehighlight'
			? "hptdraw"
			: "hptmain";
		}

		Array.prototype.forEach.call(xml.attributes, (v, i) => {
			attrs[i] = { "name": v.name, "value": v.value };
		});

		if (xml.children.length == 0 && xml.textContent.trim() != "") {
			attrs[attrs.length] = {
				"name": "value",
				"value": xml.textContent.trim()
			};
		}

		if (typeof elem != "undefined") {
			AH.select('#' + elem).dataset["attributes"] = JSON.stringify(attrs);
		}

		if (xml.children.length > 0) {
			Array.prototype.forEach.call(xml.children, child => {
				bind_data(child);
			});
		}
	}

	// Create The x,y coordinate and decide draggable and also set the user answer
	function documentReady() {
		let xaxis = [], yaxis = [];
		bind_data(AH.parseHtml(state.xml));

		// calling the draggable event on draggable element (which is used for setting answer) 
		// in case of spot an image module
		let dnd = new Draggable({
				onDragEnd: (e, ui) => {
					$$invalidate(7, state.xml = authScript.updateElem('div', e, ui.getAttribute('id'), ui, state.xml), state);
					getChildXml(state.xml);
				}
			});

		// for showing focus on the draggable element
		AH.listen('#hptmain', 'click', '.drag-resize', function (_this) {
			AH.selectAll('#hptmain .elemActive', 'removeClass', 'elemActive');
			AH.select(_this, 'addClass', 'elemActive').focus();
		});

		// for showing/hiding edit icon of draggable element in case of spot an image
		AH.bind('#hptmain .drag-resize', 'mouseenter', event => {
			let _this = event.target;
			AH.find(_this, '.tools', { action: 'show', actionData: 'block' });
		});

		AH.bind('#hptmain .drag-resize', 'mouseleave', event => {
			let _this = event.target;
			AH.find(_this, '.tools', { action: 'hide' });
		});

		// taking image height and width
		imgWidth = AH.find('#mainContent', '#hptdraw').clientWidth;

		imgHeight = AH.find('#mainContent', '#hptdraw').clientHeight;

		// calling dooScribPlugin 
		let surface = new DooScribPlugin({
				target: AH.find('#mainContent', '#hptdraw'),
				width: imgWidth,
				height: imgHeight,
				correctans: correct,
				cssClass: 'drawSurface',
				penSize: 4,
				type: 'imagehighlight',
				editable: true,
				onMove() {
					
				},
				onClick() {
					
				},
				onPaint(e) {
					console.log("onPaint auth");

					// storeing the X and Y values
					xaxis.push(e.X);

					yaxis.push(e.Y);
				},
				onRelease(e) {
					AH.select('#special_module_user_xml').value = '';
					let coor = AH.find('#mainContent', '#hptdraw canvas').getAttribute('correctans');

					if (coor != '') {
						coor = Object.keys(JSON.parse(coor)).length;
						getCoordinate(xaxis, yaxis, coor);
					} else {
						getCoordinate(xaxis, yaxis, count);
					}

					xaxis = [];
					yaxis = [];
					console.log(e);
				}
			});

		let surfaceColor = surface.lineColor(window.color);

		AH.siblings(AH.find('#mainContent', '#hptdraw')).find(elm => {
			let res = AH.find(elm, 'div').getAttribute('id');

			AH.bind('#' + res, 'click', function (event) {
				surface.clearSurface();
				drawstr = '{}';
				count = 0;

				AH.find('#mainContent', '#hptdraw canvas', {
					action: 'attr',
					actionData: { correctans: drawstr }
				});

				update_XMLValue();
			});

			return res;
		});

		let currentXMl = AH.parseHtml(xml);

		// if the type is imagehighlisght then draw ib the canvas by getting values from the xml
		if (currentXMl.getAttribute('type') == 'imagehighlight') {
			var ans = state.xml;
			ans = ans.substring(ans.indexOf('{'), ans.lastIndexOf('}') + 1);

			if (ans != '') {
				ans = JSON.parse(ans);
			}

			setTimeout(
				function () {
					// for drawing the path on the canvas by looping through the ans
					authScript.drawOnCanvasAuth(AH.find('#mainContent', '#hptdraw canvas').getAttribute('id'), ans, surfaceColor);
				},
				4000
			);
		}

		window.surface = surface;
	}

	// get the coordinates of xaxis, and yaxis
	function getCoordinate(xaxis, yaxis, count) {
		if (count == 0) {
			drawstr = "{\"" + ++count + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
		} else {
			drawstr = AH.find('#mainContent', '#hptdraw canvas').getAttribute('correctans');
			drawstr = drawstr.slice(0, -1);
			drawstr += ",\"" + ++count + "\":{\"x\":[" + xaxis + "],\"y\":[" + yaxis + "]}}";
		}

		AH.find('#mainContent', '#hptdraw canvas', {
			action: 'attr',
			actionData: { correctans: drawstr }
		});

		update_XMLValue();
	}

	// it sets the data of variables, states according to the uploaded image and updates the xml
	function handleUpdatedData(change) {
		// for checking which type of dialog is
		if (change == 'img') {
			// goes in this block if it is the image dialog
			// setting state and storing the value
			$$invalidate(7, state.bgImg = AH.select('#backgroundImage').value, state);

			$$invalidate(7, state.alt = AH.select('#imgAlt').value, state);
			$$invalidate(7, state.imgheight = AH.select('#imgHeight').value, state);
			$$invalidate(7, state.imgwidth = AH.select('#imgWidth').value, state);
			$$invalidate(7, state.hotBorder = AH.select('#hotBorder').value, state);
			$$invalidate(7, state.hotBorderColor = AH.select('#hotBorderColor').value, state);
			globalThis.sda = AH.selectAll("#backgroundImage, #imgAlt, #imgHeight, #imgWidth, #hotBorder, #hotBorderColor");

			// here we are updating the value of alt,bgimg,imgheight,imgwidth in the xml state
			$$invalidate(7, state.xml = state.xml.replace(/alt="(.*?)"/gmi, `alt="${state.alt.replace(/"/g, '&quot;')}"`), state);

			$$invalidate(7, state.xml = state.xml.replace(/bgimg="(.*?)"/gmi, `bgimg="${state.bgImg}"`), state);
			$$invalidate(7, state.xml = state.xml.replace(/imgheight="(.*?)"/gmi, `imgheight="${state.imgheight}"`), state);
			$$invalidate(7, state.xml = state.xml.replace(/imgwidth="(.*?)"/gmi, `imgwidth="${state.imgwidth}"`), state);
			let jj = XMLToJSON(state.xml);

			// setting value of borderm bordercolor, linecolor
			jj.smxml.div._border = state.hotBorder;

			jj.smxml.div._bordercolor = state.hotBorderColor;
			jj.smxml.div._linecolor = window.color;
			let image = new Image();

			image.onload = function () {
				$$invalidate(0, bgImgHeight = this.height + 'px');
				$$invalidate(1, bgImgWidth = this.width + 'px');
				AH.select('#hptmain', 'css', { height: bgImgHeight, width: bgImgWidth });

				// used to update the height and width value when height and width goes over the maximum allowed value or below minimum allowed value
				if (jj.smxml.div._type == 'imagehighlight') {
					jj.smxml._width = this.width;
					jj.smxml._height = this.height;

					AH.find('#hptdraw', 'canvas', {
						action: 'attr',
						actionData: { height: this.height, width: this.width }
					});

					AH.selectAll('#previewSection .reset, #authoringLoadComponent .reset').forEach(_this => {
						_this.click();
					});
				}

				$$invalidate(7, state.xml = JSONToXML(jj), state);

				// for storing and updating the xml
				getChildXml(state.xml);
			};

			image.src = bgImgPath + state.bgImg;
			$$invalidate(7, state.openImg = false, state);
		} else {
			var isValidationOk = handleWarning();

			// goes here if it is draggable elment dialog
			if (isValidationOk) {
				var smxml = XMLToJSON(state.xml);
				$$invalidate(3, hotAreaHeight = smxml.smxml.div._height = parseInt(AH.select('#dragHeight').value));
				$$invalidate(4, hotAreaWidth = smxml.smxml.div._width = parseInt(AH.select('#dragWidth').value));
				$$invalidate(2, hotAreaTop = smxml.smxml.div._top = parseInt(AH.select('#dragTop').value));
				$$invalidate(5, hotAreaLeft = smxml.smxml.div._left = parseInt(AH.select('#dragLeft').value));
				$$invalidate(7, state.openDrag = false, state);
				$$invalidate(3, hotAreaHeight += 'px');
				$$invalidate(4, hotAreaWidth += 'px');
				$$invalidate(2, hotAreaTop += 'px');
				$$invalidate(5, hotAreaLeft += 'px');

				// for storing and updating the xml
				getChildXml(JSONToXML(smxml));

				// setting the current xml on the current xml state
				$$invalidate(7, state.xml = JSONToXML(smxml), state);
			}
		}
	}

	// checks for image when hotspot type is 'imagehighlight' as it passes the min and max allowed condition of height and width
	function handleSubmit(change) {
		let json_data = XMLToJSON(state.xml),
			argument_data = change,
			isWidthValid = true,
			isHeightValid = true,
			handlemodal = false;

		if (json_data.smxml.div._type == 'imagehighlight') {
			let image = new Image();

			image.onload = function () {
				// this block handle with default image height and width when uploaded image failed the condition
				if (handlemodal) {
					$$invalidate(0, bgImgHeight = json_data.smxml._height + 'px');
					$$invalidate(1, bgImgWidth = json_data.smxml._width + 'px');
				} else {
					// used for set the height and width for checking purpose that it passes the min and max condition of height and width
					$$invalidate(0, bgImgHeight = this.height + 'px');

					$$invalidate(1, bgImgWidth = this.width + 'px');
				}

				// handle with width
				if (this.width >= 100 && this.width <= 1000) {
					isWidthValid = true;

					// handle with height if width is ok
					if (this.height >= 80 && this.height <= 550) {
						isHeightValid = true;
					} else {
						AH.alert(l.height_warning);
						isHeightValid = false;
					}
				} else {
					AH.alert(l.width_warning);
					isWidthValid = false;
				}

				// enters in this block if height and width passes the defined min and max condition
				if (isHeightValid && isWidthValid) {
					// handle in case when uploading image failed and then default image sets
					if (handlemodal) {
						$$invalidate(7, state.openImg = true, state);
					} else {
						// goes for other process if height and width passes the defined condition
						handleUpdatedData(argument_data);
					}
				} else {
					console.log("Default Image set");

					// in case when height and width does not passes the defined min and max condition
					$$invalidate(7, state.openImg = true, state);

					image.src = bgImgPath + json_data.smxml._bgimg;
					AH.selectAll('#backgroundImage').value = json_data.smxml._bgimg;
					handlemodal = true;
				}
			};

			image.src = bgImgPath + AH.select('#backgroundImage').value;
		} else {
			handleUpdatedData(argument_data);
		}
	}

	// for closing the open dialog
	function handleClose() {
		//setState({openDrag: false});
		$$invalidate(7, state.openDrag = false, state);

		$$invalidate(7, state.openImg = false, state);
	}

	// when image edit button is clicked
	function changeImg() {
		// calling the function in timeout to show value after the dialog will open
		// restoring the value of the background image when the dialog will open again
		AH.select('#backgroundImage').value = state.bgImg;

		$$invalidate(7, state.image_url = bgImgPath + '' + state.bgImg, state);

		AH.select(AH.select('#backgroundImage').previousElementSibling, 'css', {
			transform: "scale(0.75) translate(0px, -28px)",
			color: "rgb(0, 188, 212)"
		});

		if (state.hotBorder) {
			// restoring the value of the image border when the dialog will open again
			AH.select('#hotBorder').value = state.hotBorder;

			AH.select(AH.select('#hotBorder').previousElementSibling, 'css', {
				transform: "scale(0.75) translate(0px, -28px)",
				color: "rgb(0, 188, 212)"
			});
		}

		if (state.hotBorderColor) {
			// restoring the value of the image border color when the dialog will open again
			AH.select('#hotBorderColor').value = state.hotBorderColor;

			AH.select(AH.select('#hotBorderColor').previousElementSibling, 'css', {
				transform: "scale(0.75) translate(0px, -28px)",
				color: "rgb(0, 188, 212)"
			});
		}

		// change the state of the openImg true as currently the dialog is open
		$$invalidate(7, state.openImg = true, state);
	}

	// when draggable edit button is clicked
	function changeDrag() {
		$$invalidate(7, state.openDrag = true, state);

		// calling the function in timeout to show value after the dialog will open
		var timer = setTimeout(
			function () {
				// setting the value of top,left,width,height in case of draggable element icon is clicked
				AH.select('#dragHeight').value = parseInt(AH.select('#ID0').style.height);

				AH.select('#dragWidth').value = parseInt(AH.select('#ID0').style.width);
				AH.select('#dragTop').value = parseInt(AH.select('#ID0').style.top);
				AH.select('#dragLeft').value = parseInt(AH.select('#ID0').style.left);
				clearTimeout(timer);
			},
			300
		);
	} // change the state of the image to true as the dialog is opened 

	// @pradeep sir Please verify this function is not calling
	function handleChangeMultiple(event, value) {
		if (value == 1 || value == 2) {
			initEditor();
		}

		var newXml = XMLToJSON(defaultXml[value]);
		parseXmlForText(newXml);

		switch (value) {
			case "1":
				parseXmlForText(newXml);
				break;
			case "2":
				parseXmlForText(newXml);
				break;
			case "3":
				parseXmlForDraw(newXml);
				break;
			case "4":
				parseXML(newXml);
				break;
		}

		$$invalidate(7, state.valueMultiple = value, state);
		$$invalidate(7, state.xml = defaultXml[value], state);
		getChildXml(state.xml);
	}

	// calls in case of text and token highlight and change the style of correct answer
	function getData(xml) {
		// replacing the correct answer with span to give it styling
		xml = xml.replace(/%{/gm, '<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">').replace(/}%/gm, '</span>');

		AH.find('#mainContent', '.tinymce-editor-response').innerHTML = xml;
	}

	// update the xml
	function update_XMLValue() {
		// get the dom of the xml
		var xmlDom = AH.parseHtml(state.xml);

		// get the type
		var typ = xmlDom.querySelector('div')?.getAttribute('type');

		// check if the type is imagehighlight then update the cdata
		if (typ == 'imagehighlight') xmlDom.querySelector('div').innerHTML = '<![CDATA[' + AH.find('#mainContent', '#hptdraw canvas').getAttribute('correctans') + ']]>';

		var getCdata = state.xml;

		if (getCdata) {
			// replacing the current state xml with the new one
			var getCdataClean = state.xml.replace(getCdata, formatXml(xmlDom.xml
			? xmlDom.xml
			: new XMLSerializer().serializeToString(xmlDom)));

			$$invalidate(7, state.xml = getCdataClean.toString(), state);
			getChildXml(state.xml);
		}
	}

	// in case of text & token highlight update the cdata
	function setData() {
		var arr = [];
		var selectedText = '';

		// for getting the content
		var data = tinyMCE.activeEditor.getContent({ format: 'raw' });

		// Here finding the element span having data-type="select" and storing it in arr
		arr = data.match(/<span data-type="select"(.*?)>(.*?)<\/span>/gi);

		// if arr is not blank, then changing the text between the span by encolsing it in the symbol {%, %} in the data
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				selectedText = arr[i].replace(/<span data-type="select"(.*?)>|<\/span>/gm, '');
				data = data.replace(arr[i], '%{' + selectedText + '}%');
			}
		}

		// Finding the text betwenn the <!--[CDATA , ]-->
		var getCdata = state.xml.match(/<!--\[CDATA\[(.*?)\]\]-->/gm);

		// if match found
		if (getCdata) {
			var getCdataClean = getCdata.toString().replace("<!--[CDATA[", '').replace("]]-->", '');

			//adding the data in cdata and replacing it with current xml cdata
			getCdataClean = state.xml.replace(getCdata, '<!--[CDATA[' + data + ']]-->');

			// updating the state 
			$$invalidate(7, state.xml = getCdataClean.toString(), state);

			// updaing and storing the xml
			getChildXml(getCdataClean.toString());
		}
	}

	//For binding key event in case of spot an image
	function bindKey() {
		AH.bind(document, 'keydown', e => {
			// in case of ctrl key and shift key is stored 
			/**
 * 37 : left arrow key
 * 38 : up arrow key
 * 39 : right arrow key
 * 40 : down arrow key
 * 27 : esc key
*/
			if (e.ctrlKey && e.shiftKey) {
				switch (e.keyCode.toString()) {
					case "37":
						setPS(-10, 0, 0, 0);
						break;
					case "38":
						setPS(0, -10, 0, 0);
						break;
					case "39":
						setPS(10, 0, 0, 0);
						break;
					case "40":
						setPS(0, 10, 0, 0);
						break;
				}
			} else if (e.shiftKey) {
				// in case of shiftKey
				switch (e.keyCode.toString()) {
					case "37":
						setPS(-1, 0, 0, 0);
						break;
					case "38":
						setPS(0, -1, 0, 0);
						break;
					case "39":
						setPS(1, 0, 0, 0);
						break;
					case "40":
						setPS(0, 1, 0, 0);
						break;
				}
			} else if (e.ctrlKey) {
				// in case of ctrl key
				switch (e.keyCode.toString()) {
					case "37":
						setPS(0, 0, 0, -10);
						break;
					case "38":
						setPS(0, 0, -10, 0);
						break;
					case "39":
						setPS(0, 0, 0, 10);
						break;
					case "40":
						setPS(0, 0, 10, 0);
						break;
				}
			} else {
				switch (e.keyCode.toString()) {
					case "27":
						// esc key
						AH.selectAll('.dragable-container .ui-draggable', 'removeClass', 'elemActive');
						break;
					case "38":
						// up arrow
						e.preventDefault();
						setPS(0, 0, -1, 0);
						break;
					case "40":
						// down arrow
						e.preventDefault();
						setPS(0, 0, 1, 0);
						break;
				}
			}
		});
	}

	// for changing linecolor 
	function changeLine(elem) {
		// setting the target value color in linecolor state
		$$invalidate(7, state.lineColor = elem.target.value, state);

		// setting it in window
		window.color = state.lineColor;
	}

	// for setting position or size of the draggable element in spot an image module
	function setPS(w, h, t, l, del) {
		console.log("setps");
		let ac = AH.select('#ID0');

		if (ac) {
			let acRect = ac.getBoundingClientRect();
			let key = ac.getAttribute('id');
			let xmlDom = AH.parseHtml(state.xml);
			let insert = xmlDom.querySelector('[id="' + key + '"]');

			if (typeof del !== "undefined" && del) {
				if (confirm('Do you want to delete it?')) {
					ac.remove();
					insert.remove();
				}
			} else if (ac.offsetWidth > 0 && ac.offsetHeight > 0) {
				// is visible
				w = ac.clientWidth + w;

				h = ac.clientHeight + h;
				t = acRect.top + t;
				l = acRect.left + l;

				AH.select(ac, 'css', {
					width: w + "px",
					height: h + "px",
					top: t + "px",
					left: l + "px"
				});

				let attributes = AH.select('[id="' + key + '"]').dataset['attributes'];

				JSON.stringify(attributes).forEach((value, index) => {
					switch (value.name) {
						case "width":
							value.value = parseInt(ac.clientWidth);
							insert.setAttribute('width', value.value);
							break;
						case "height":
							value.value = parseInt(ac.clientHeight);
							insert.setAttribute('height', value.value);
							break;
						case "top":
							value.value = parseInt(acRect.top);
							insert.setAttribute('top', value.value);
							break;
						case "left":
							value.value = parseInt(acRect.left);
							insert.setAttribute('left', value.value);
							break;
					}
				});

				AH.select('[id="' + key + '"]').dataset['attributes'] = attributes;
			}

			// for updating the xml
			AH.select('#special_module_xml').value = xmlDom.xml
			? xmlDom.xml
			: new XMLSerializer().serializeToString(xmlDom[0]);

			$$invalidate(
				7,
				state.xml = xmlDom.xml
				? xmlDom.xml
				: new XMLSerializer().serializeToString(xmlDom[0]),
				state
			);

			getChildXml(xmlDom.xml
			? xmlDom.xml
			: new XMLSerializer().serializeToString(xmlDom[0]));
		}
	}

	const writable_props = ['xml', 'getChildXml'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Hotspot> was created with unknown prop '${key}'`);
	});

	function dialog0_visible_binding(value) {
		if ($$self.$$.not_equal(state.openImg, value)) {
			state.openImg = value;
			$$invalidate(7, state);
		}
	}

	function dialog1_visible_binding(value) {
		if ($$self.$$.not_equal(state.openDrag, value)) {
			state.openDrag = value;
			$$invalidate(7, state);
		}
	}

	const click_handler = () => $$invalidate(7, state.snackback = false, state);

	function snackbar_visible_binding(value) {
		if ($$self.$$.not_equal(state.snackback, value)) {
			state.snackback = value;
			$$invalidate(7, state);
		}
	}

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(16, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(17, getChildXml = $$props.getChildXml);
	};

	$$self.$capture_state = () => ({
		Button,
		Dialog,
		Checkbox,
		Snackbar,
		AH,
		JSONToXML,
		XMLToJSON,
		Draggable,
		DooScribPlugin,
		HotspotAuthScript,
		l,
		writable,
		onMount,
		xml,
		getChildXml,
		authScript,
		count,
		drawstr,
		bgImgHeight,
		bgImgWidth,
		bgImgPath,
		hotAreaTop,
		hotAreaHeight,
		hotAreaWidth,
		hotAreaLeft,
		cmTime,
		defaultXml,
		moduleArr,
		imgWidth,
		imgHeight,
		correct,
		message,
		state,
		hdd,
		unsubscribe,
		didMount,
		handleWarning,
		addToken,
		initEditor,
		parseXML,
		parseXmlForDraw,
		parseXmlForText,
		bind_data,
		documentReady,
		getCoordinate,
		handleUpdatedData,
		handleSubmit,
		handleClose,
		changeImg,
		changeDrag,
		handleChangeMultiple,
		getData,
		update_XMLValue,
		setData,
		bindKey,
		changeLine,
		setPS
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(16, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(17, getChildXml = $$props.getChildXml);
		if ('count' in $$props) count = $$props.count;
		if ('drawstr' in $$props) drawstr = $$props.drawstr;
		if ('bgImgHeight' in $$props) $$invalidate(0, bgImgHeight = $$props.bgImgHeight);
		if ('bgImgWidth' in $$props) $$invalidate(1, bgImgWidth = $$props.bgImgWidth);
		if ('bgImgPath' in $$props) $$invalidate(8, bgImgPath = $$props.bgImgPath);
		if ('hotAreaTop' in $$props) $$invalidate(2, hotAreaTop = $$props.hotAreaTop);
		if ('hotAreaHeight' in $$props) $$invalidate(3, hotAreaHeight = $$props.hotAreaHeight);
		if ('hotAreaWidth' in $$props) $$invalidate(4, hotAreaWidth = $$props.hotAreaWidth);
		if ('hotAreaLeft' in $$props) $$invalidate(5, hotAreaLeft = $$props.hotAreaLeft);
		if ('cmTime' in $$props) cmTime = $$props.cmTime;
		if ('defaultXml' in $$props) defaultXml = $$props.defaultXml;
		if ('moduleArr' in $$props) $$invalidate(6, moduleArr = $$props.moduleArr);
		if ('imgWidth' in $$props) imgWidth = $$props.imgWidth;
		if ('imgHeight' in $$props) imgHeight = $$props.imgHeight;
		if ('correct' in $$props) correct = $$props.correct;
		if ('message' in $$props) $$invalidate(9, message = $$props.message);
		if ('state' in $$props) $$invalidate(7, state = $$props.state);
		if ('hdd' in $$props) hdd = $$props.hdd;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		bgImgHeight,
		bgImgWidth,
		hotAreaTop,
		hotAreaHeight,
		hotAreaWidth,
		hotAreaLeft,
		moduleArr,
		state,
		bgImgPath,
		message,
		handleSubmit,
		handleClose,
		changeImg,
		changeDrag,
		setData,
		changeLine,
		xml,
		getChildXml,
		dialog0_visible_binding,
		dialog1_visible_binding,
		click_handler,
		snackbar_visible_binding
	];
}

class Hotspot extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { xml: 16, getChildXml: 17 }, null, [-1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Hotspot",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[16] === undefined && !('xml' in props)) {
			console_1.warn("<Hotspot> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[17] === undefined && !('getChildXml' in props)) {
			console_1.warn("<Hotspot> was created without expected prop 'getChildXml'");
		}
	}

	get xml() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Hotspot;
//# sourceMappingURL=Hotspot-d20deb80.js.map
