
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { L as JUI, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, J as append_styles, M as Dialog, N as binding_callbacks, O as bind, P as Snackbar, v as validate_slots, o as onMount, A as AH, X as XMLToJSON, Q as Draggable, R as Button, T as Checkbox, K as JSONToXML, y as l, w as writable, g as globals, e as element, f as space, c as create_component, j as attr_dev, l as set_style, k as add_location, U as src_url_equal, n as insert_dev, p as append_dev, m as mount_component, q as listen_dev, V as stop_propagation, W as prevent_default, F as prop_dev, Y as add_flush_callback, t as transition_in, a as transition_out, x as detach_dev, b as destroy_component, G as run_all, Z as select_value, h as text, _ as add_render_callback, $ as set_input_value, a0 as select_option, B as noop } from './main-6d54a80a.js';

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
		let hp_image = JS$1.select('#im').getBoundingClientRect();
		if (typeof(ui) !== "undefined") {
			attributes = JS$1.select('#'+key).dataset['attributes'];
			if(attributes) {
				attributes = JSON.parse(attributes);
			}

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
						if(_data.value < 0) {
							_data.value = 0;
						}
						if ((_data.value + ui.clientHeight) > hp_image.height) {
							_data.value = hp_image.height - ui.clientHeight;
						}
						break;
					case "left":
						_data.value = (+(_data.value) + _this.offsetX) - (ui.clientWidth/2);
						if(_data.value < 0) {
							_data.value = 0;
						}
						if ((_data.value + ui.clientWidth) > hp_image.width) {
							_data.value = hp_image.width - ui.clientWidth;						}
						break;
				}
				_orginalArr[index] = _data;
			});
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
		if (insert && img_w > 0 && img_h > 0) {
			insert.setAttribute("width", img_w);
			insert.setAttribute("height", img_h);
		}
		if (attributes) {
			for (let _tempAttr of attributes ) {
				if (_tempAttr.value !== "") {
					insert && insert.setAttribute(_tempAttr.name, _tempAttr.value);
					if (_tempAttr.name=='type') insert && insert.setAttribute(_tempAttr.value, 'hotspot');
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

const { Object: Object_1 } = globals;
const file = "clsSMHotspot\\Hotspot.svelte";

function add_css(target) {
	append_styles(target, "svelte-dl6gty", "#resizeX.svelte-dl6gty{position:absolute;right:0;width:3px;opacity:0;height:100%;cursor:w-resize}#resizeY.svelte-dl6gty{position:absolute;bottom:0;width:100%;height:3px;opacity:0;cursor:s-resize}#resizeXY.svelte-dl6gty{position:absolute;bottom:0;right:0;width:3px;height:3px;opacity:0;cursor:se-resize}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90c3BvdC5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBeXFDSSxRQUFRLGNBQUMsQ0FBQyxBQUNOLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEtBQUssQ0FBRSxDQUFDLENBQ1IsS0FBSyxDQUFFLEdBQUcsQ0FDVixPQUFPLENBQUUsQ0FBQyxDQUNWLE1BQU0sQ0FBRSxJQUFJLENBQ1osTUFBTSxDQUFFLFFBQVEsQUFDcEIsQ0FBQyxBQUNELFFBQVEsY0FBQyxDQUFDLEFBQ04sUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxDQUFFLENBQUMsQ0FDVCxLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxHQUFHLENBQ1gsT0FBTyxDQUFFLENBQUMsQ0FDVixNQUFNLENBQUUsUUFBUSxBQUNwQixDQUFDLEFBQ0QsU0FBUyxjQUFDLENBQUMsQUFDUCxRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLENBQUUsQ0FBQyxDQUNULEtBQUssQ0FBRSxDQUFDLENBQ1IsS0FBSyxDQUFFLEdBQUcsQ0FDVixNQUFNLENBQUUsR0FBRyxDQUNYLE9BQU8sQ0FBRSxDQUFDLENBQ1YsTUFBTSxDQUFFLFNBQVMsQUFDckIsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJIb3RzcG90LnN2ZWx0ZSJdfQ== */");
}

// (1010:4) <Dialog class="remove_right_margin" width="600" bind:visible={state.openImg} style="background: #fff; border-radius: 5px;">
function create_default_slot_7(ctx) {
	let h4;
	let div1;
	let div0;
	let t1;
	let div8;
	let div2;
	let input0;
	let input0_value_value;
	let t2;
	let button;
	let t4;
	let div3;
	let img;
	let img_src_value;
	let t5;
	let span0;
	let label0;
	let t6;
	let label0_class_value;
	let t7;
	let input1;
	let input1_class_value;
	let t8;
	let div6;
	let div4;
	let span1;
	let label1;
	let t10;
	let select0;
	let option0;
	let option1;
	let option2;
	let option3;
	let option4;
	let option5;
	let div4_class_value;
	let t17;
	let div5;
	let span2;
	let label2;
	let t19;
	let select1;
	let option6;
	let option7;
	let option8;
	let div5_class_value;
	let t23;
	let br;
	let t24;
	let div7;
	let span3;
	let label3;
	let t26;
	let select2;
	let option9;
	let option10;
	let option11;
	let option12;
	let div7_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			h4 = element("h4");
			div1 = element("div");
			div0 = element("div");
			div0.textContent = "Image";
			t1 = space();
			div8 = element("div");
			div2 = element("div");
			input0 = element("input");
			t2 = space();
			button = element("button");
			button.textContent = "Upload image";
			t4 = space();
			div3 = element("div");
			img = element("img");
			t5 = space();
			span0 = element("span");
			label0 = element("label");
			t6 = text("Image Alt");
			t7 = space();
			input1 = element("input");
			t8 = space();
			div6 = element("div");
			div4 = element("div");
			span1 = element("span");
			label1 = element("label");
			label1.textContent = "Border width";
			t10 = space();
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
			t17 = space();
			div5 = element("div");
			span2 = element("span");
			label2 = element("label");
			label2.textContent = "Border color";
			t19 = space();
			select1 = element("select");
			option6 = element("option");
			option6.textContent = "None";
			option7 = element("option");
			option7.textContent = "Black";
			option8 = element("option");
			option8.textContent = "Grey";
			t23 = space();
			br = element("br");
			t24 = space();
			div7 = element("div");
			span3 = element("span");
			label3 = element("label");
			label3.textContent = "Draw line color";
			t26 = space();
			select2 = element("select");
			option9 = element("option");
			option9.textContent = "Please Select";
			option10 = element("option");
			option10.textContent = "Red";
			option11 = element("option");
			option11.textContent = "Black";
			option12 = element("option");
			option12.textContent = "Blue";
			add_location(div0, file, 1012, 16, 46127);
			attr_dev(div1, "class", "d-flex justify-content-between");
			add_location(div1, file, 1011, 12, 46065);
			attr_dev(h4, "class", "mt-1 font21 mb-4");
			add_location(h4, file, 1010, 8, 46022);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "id", "backgroundImage");
			input0.disabled = "true";
			input0.value = input0_value_value = /*state*/ ctx[7].bgImg;
			attr_dev(input0, "margin", "normal");
			set_style(input0, "pointer-events", "none");
			set_style(input0, "width", "76%");
			attr_dev(input0, "class", "form-control mr-2");
			add_location(input0, file, 1017, 16, 46292);
			attr_dev(button, "id", "upload_media");
			attr_dev(button, "type", "button");
			button.value = "Upload Media";
			attr_dev(button, "margin", "normal");
			attr_dev(button, "class", "btn btn-outline-primary position-relative");
			add_location(button, file, 1026, 16, 46636);
			attr_dev(div2, "class", "d-flex");
			add_location(div2, file, 1016, 12, 46254);
			if (!src_url_equal(img.src, img_src_value = /*state*/ ctx[7].image_url)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "background");
			attr_dev(img, "class", "img img-responsive span7");
			add_location(img, file, 1035, 16, 47003);
			attr_dev(div3, "class", "mx-auto width8 p-2 border mt-2");
			add_location(div3, file, 1034, 12, 46941);
			attr_dev(label0, "for", "imgAlt");

			attr_dev(label0, "class", label0_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "my-1 text-dark"
			: "hidden");

			add_location(label0, file, 1038, 16, 47140);
			add_location(span0, file, 1037, 12, 47116);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "id", "imgAlt");
			attr_dev(input1, "placeholder", "Alt text");

			attr_dev(input1, "class", input1_class_value = /*state*/ ctx[7].valueMultiple == 4
			? " form-control mt-0"
			: "hidden form-control mt-0");

			attr_dev(input1, "margin", "normal");
			set_style(input1, "width", "-webkit-fill-available");
			add_location(input1, file, 1040, 12, 47277);
			attr_dev(label1, "for", "hotBorder");
			attr_dev(label1, "class", "my-1 text-dark");
			add_location(label1, file, 1052, 24, 47821);
			add_location(span1, file, 1051, 20, 47789);
			option0.__value = "0";
			option0.value = option0.__value;
			add_location(option0, file, 1055, 24, 48036);
			option1.__value = "1";
			option1.value = option1.__value;
			add_location(option1, file, 1056, 24, 48093);
			option2.__value = "2";
			option2.value = option2.__value;
			add_location(option2, file, 1057, 24, 48147);
			option3.__value = "3";
			option3.value = option3.__value;
			add_location(option3, file, 1058, 24, 48201);
			option4.__value = "4";
			option4.value = option4.__value;
			add_location(option4, file, 1059, 24, 48255);
			option5.__value = "5";
			option5.value = option5.__value;
			add_location(option5, file, 1060, 24, 48309);
			attr_dev(select0, "id", "hotBorder");
			attr_dev(select0, "class", "form-select");
			if (/*state*/ ctx[7].hotBorder === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[30].call(select0));
			add_location(select0, file, 1054, 20, 47938);

			attr_dev(div4, "class", div4_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block pr-2 mt-2 w-sm"
			: "hidden");

			add_location(div4, file, 1050, 16, 47682);
			attr_dev(label2, "for", "hotBorderColor");
			attr_dev(label2, "class", "my-1 text-dark");
			add_location(label2, file, 1065, 24, 48544);
			add_location(span2, file, 1064, 20, 48512);
			option6.__value = "white";
			option6.value = option6.__value;
			add_location(option6, file, 1068, 24, 48774);
			option7.__value = "black";
			option7.value = option7.__value;
			add_location(option7, file, 1069, 24, 48835);
			option8.__value = "grey";
			option8.value = option8.__value;
			add_location(option8, file, 1070, 24, 48897);
			attr_dev(select1, "id", "hotBorderColor");
			attr_dev(select1, "class", "form-select");
			if (/*state*/ ctx[7].hotBorderColor === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[31].call(select1));
			add_location(select1, file, 1067, 20, 48666);

			attr_dev(div5, "class", div5_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block mt-2 w-sm"
			: "hidden");

			add_location(div5, file, 1063, 16, 48410);
			attr_dev(div6, "class", "d-flex");
			add_location(div6, file, 1049, 12, 47644);
			add_location(br, file, 1074, 12, 49020);
			attr_dev(label3, "for", "setLineColor");
			attr_dev(label3, "class", "mt-2 text-dark");
			add_location(label3, file, 1077, 20, 49142);
			add_location(span3, file, 1076, 16, 49114);
			option9.__value = "Please Select";
			option9.value = option9.__value;
			add_location(option9, file, 1080, 20, 49387);
			option10.__value = "red";
			option10.value = option10.__value;
			add_location(option10, file, 1081, 20, 49439);
			option11.__value = "black";
			option11.value = option11.__value;
			add_location(option11, file, 1082, 20, 49493);
			option12.__value = "blue";
			option12.value = option12.__value;
			add_location(option12, file, 1083, 20, 49551);
			attr_dev(select2, "id", "setLineColor");
			attr_dev(select2, "class", "form-select");
			if (/*state*/ ctx[7].lineColor === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[32].call(select2));
			add_location(select2, file, 1079, 16, 49257);
			attr_dev(div7, "class", div7_class_value = /*state*/ ctx[7].valueMultiple == 3 ? "" : "hidden");
			add_location(div7, file, 1075, 12, 49040);
			set_style(div8, "overflow-y", "auto");
			set_style(div8, "padding-right", "20px");
			add_location(div8, file, 1015, 8, 46188);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h4, anchor);
			append_dev(h4, div1);
			append_dev(div1, div0);
			insert_dev(target, t1, anchor);
			insert_dev(target, div8, anchor);
			append_dev(div8, div2);
			append_dev(div2, input0);
			append_dev(div2, t2);
			append_dev(div2, button);
			append_dev(div8, t4);
			append_dev(div8, div3);
			append_dev(div3, img);
			append_dev(div8, t5);
			append_dev(div8, span0);
			append_dev(span0, label0);
			append_dev(label0, t6);
			append_dev(div8, t7);
			append_dev(div8, input1);
			set_input_value(input1, /*state*/ ctx[7].alt);
			append_dev(div8, t8);
			append_dev(div8, div6);
			append_dev(div6, div4);
			append_dev(div4, span1);
			append_dev(span1, label1);
			append_dev(div4, t10);
			append_dev(div4, select0);
			append_dev(select0, option0);
			append_dev(select0, option1);
			append_dev(select0, option2);
			append_dev(select0, option3);
			append_dev(select0, option4);
			append_dev(select0, option5);
			select_option(select0, /*state*/ ctx[7].hotBorder);
			append_dev(div6, t17);
			append_dev(div6, div5);
			append_dev(div5, span2);
			append_dev(span2, label2);
			append_dev(div5, t19);
			append_dev(div5, select1);
			append_dev(select1, option6);
			append_dev(select1, option7);
			append_dev(select1, option8);
			select_option(select1, /*state*/ ctx[7].hotBorderColor);
			append_dev(div8, t23);
			append_dev(div8, br);
			append_dev(div8, t24);
			append_dev(div8, div7);
			append_dev(div7, span3);
			append_dev(span3, label3);
			append_dev(div7, t26);
			append_dev(div7, select2);
			append_dev(select2, option9);
			append_dev(select2, option10);
			append_dev(select2, option11);
			append_dev(select2, option12);
			select_option(select2, /*state*/ ctx[7].lineColor);

			if (!mounted) {
				dispose = [
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[29]),
					listen_dev(select0, "change", /*select0_change_handler*/ ctx[30]),
					listen_dev(select1, "change", /*select1_change_handler*/ ctx[31]),
					listen_dev(select2, "change", /*select2_change_handler*/ ctx[32]),
					listen_dev(select2, "blur", /*changeLine*/ ctx[18].bind(this), false, false, false)
				];

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

			if (dirty[0] & /*state*/ 128 && input1.value !== /*state*/ ctx[7].alt) {
				set_input_value(input1, /*state*/ ctx[7].alt);
			}

			if (dirty[0] & /*state*/ 128) {
				select_option(select0, /*state*/ ctx[7].hotBorder);
			}

			if (dirty[0] & /*state*/ 128 && div4_class_value !== (div4_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block pr-2 mt-2 w-sm"
			: "hidden")) {
				attr_dev(div4, "class", div4_class_value);
			}

			if (dirty[0] & /*state*/ 128) {
				select_option(select1, /*state*/ ctx[7].hotBorderColor);
			}

			if (dirty[0] & /*state*/ 128 && div5_class_value !== (div5_class_value = /*state*/ ctx[7].valueMultiple == 4
			? "d-inline-block mt-2 w-sm"
			: "hidden")) {
				attr_dev(div5, "class", div5_class_value);
			}

			if (dirty[0] & /*state*/ 128) {
				select_option(select2, /*state*/ ctx[7].lineColor);
			}

			if (dirty[0] & /*state*/ 128 && div7_class_value !== (div7_class_value = /*state*/ ctx[7].valueMultiple == 3 ? "" : "hidden")) {
				attr_dev(div7, "class", div7_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h4);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div8);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7.name,
		type: "slot",
		source: "(1010:4) <Dialog class=\\\"remove_right_margin\\\" width=\\\"600\\\" bind:visible={state.openImg} style=\\\"background: #fff; border-radius: 5px;\\\">",
		ctx
	});

	return block;
}

// (1089:12) <Button                  on:click={handleClose}                  unelevated={true}                  outlined={true}                  class="text-capitalize"                  color="#ccc"              >
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
		source: "(1089:12) <Button                  on:click={handleClose}                  unelevated={true}                  outlined={true}                  class=\\\"text-capitalize\\\"                  color=\\\"#ccc\\\"              >",
		ctx
	});

	return block;
}

// (1097:12) <Button                  on:click={handleSubmit.bind(this, 'img')}                  class="bg-primary text-white"                  style="text-transform: none"                  key={l.submit}              >
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
		source: "(1097:12) <Button                  on:click={handleSubmit.bind(this, 'img')}                  class=\\\"bg-primary text-white\\\"                  style=\\\"text-transform: none\\\"                  key={l.submit}              >",
		ctx
	});

	return block;
}

// (1088:8) 
function create_footer_slot_1(ctx) {
	let div;
	let button0;
	let t;
	let button1;
	let current;

	button0 = new Button({
			props: {
				unelevated: true,
				outlined: true,
				class: "text-capitalize",
				color: "#ccc",
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button0.$on("click", /*handleClose*/ ctx[14]);

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

	button1.$on("click", /*handleSubmit*/ ctx[13].bind(this, 'img'));

	const block = {
		c: function create() {
			div = element("div");
			create_component(button0.$$.fragment);
			t = space();
			create_component(button1.$$.fragment);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "svelteFooter");
			add_location(div, file, 1087, 8, 49658);
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

			if (dirty[2] & /*$$scope*/ 8) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty[2] & /*$$scope*/ 8) {
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
		source: "(1088:8) ",
		ctx
	});

	return block;
}

// (1106:4) <Dialog class="remove_right_margin" width="600" bind:visible={state.openDrag} style="background: #fff; border-radius: 5px;">
function create_default_slot_4(ctx) {
	let h4;
	let div1;
	let div0;
	let t1;
	let div8;
	let div4;
	let div2;
	let span0;
	let label0;
	let t3;
	let input0;
	let t4;
	let div3;
	let span1;
	let label1;
	let t6;
	let input1;
	let t7;
	let div7;
	let div5;
	let span2;
	let label2;
	let t9;
	let input2;
	let t10;
	let div6;
	let span3;
	let label3;
	let t12;
	let input3;

	const block = {
		c: function create() {
			h4 = element("h4");
			div1 = element("div");
			div0 = element("div");
			div0.textContent = "Hotspot";
			t1 = space();
			div8 = element("div");
			div4 = element("div");
			div2 = element("div");
			span0 = element("span");
			label0 = element("label");
			label0.textContent = "Height";
			t3 = space();
			input0 = element("input");
			t4 = space();
			div3 = element("div");
			span1 = element("span");
			label1 = element("label");
			label1.textContent = "Width";
			t6 = space();
			input1 = element("input");
			t7 = space();
			div7 = element("div");
			div5 = element("div");
			span2 = element("span");
			label2 = element("label");
			label2.textContent = "Top";
			t9 = space();
			input2 = element("input");
			t10 = space();
			div6 = element("div");
			span3 = element("span");
			label3 = element("label");
			label3.textContent = "Left";
			t12 = space();
			input3 = element("input");
			add_location(div0, file, 1108, 16, 50479);
			attr_dev(div1, "class", "d-flex justify-content-between");
			add_location(div1, file, 1107, 12, 50417);
			attr_dev(h4, "class", "mt-1 font21 mb-4");
			add_location(h4, file, 1106, 8, 50374);
			attr_dev(label0, "for", "dragHeight");
			attr_dev(label0, "class", "my-1 text-dark");
			add_location(label0, file, 1115, 24, 50721);
			add_location(span0, file, 1114, 20, 50689);
			attr_dev(input0, "type", "number");
			attr_dev(input0, "id", "dragHeight");
			attr_dev(input0, "placeholder", "Height");
			attr_dev(input0, "defaultvalue", " ");
			attr_dev(input0, "class", "form-control");
			add_location(input0, file, 1117, 20, 50833);
			attr_dev(div2, "class", "col-6 pr-1");
			add_location(div2, file, 1113, 16, 50643);
			attr_dev(label1, "for", "dragWidth");
			attr_dev(label1, "class", "my-1 text-dark");
			add_location(label1, file, 1127, 24, 51197);
			add_location(span1, file, 1126, 20, 51165);
			attr_dev(input1, "type", "number");
			attr_dev(input1, "id", "dragWidth");
			attr_dev(input1, "placeholder", "Width");
			attr_dev(input1, "defaultvalue", " ");
			attr_dev(input1, "class", "form-control");
			add_location(input1, file, 1129, 20, 51307);
			attr_dev(div3, "class", "col-6 pl-1");
			add_location(div3, file, 1125, 16, 51119);
			attr_dev(div4, "class", "row");
			add_location(div4, file, 1112, 12, 50608);
			attr_dev(label2, "for", "dragTop");
			attr_dev(label2, "class", "my-1 text-dark");
			add_location(label2, file, 1141, 24, 51725);
			add_location(span2, file, 1140, 20, 51693);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "id", "dragTop");
			attr_dev(input2, "placeholder", "Top");
			attr_dev(input2, "defaultvalue", " ");
			attr_dev(input2, "class", "form-control");
			add_location(input2, file, 1143, 20, 51831);
			attr_dev(div5, "class", "col-6 pr-1");
			add_location(div5, file, 1139, 16, 51647);
			attr_dev(label3, "for", "dragLeft");
			attr_dev(label3, "class", "my-1 text-dark");
			add_location(label3, file, 1153, 24, 52189);
			add_location(span3, file, 1152, 20, 52157);
			attr_dev(input3, "type", "number");
			attr_dev(input3, "id", "dragLeft");
			attr_dev(input3, "placeholder", "Left");
			attr_dev(input3, "defaultvalue", " ");
			attr_dev(input3, "class", "form-control");
			add_location(input3, file, 1155, 20, 52297);
			attr_dev(div6, "class", "col-6 pl-1");
			add_location(div6, file, 1151, 16, 52111);
			attr_dev(div7, "class", "row mt-2");
			add_location(div7, file, 1138, 12, 51607);
			set_style(div8, "overflow-y", "auto");
			set_style(div8, "padding-right", "20px");
			add_location(div8, file, 1111, 8, 50542);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h4, anchor);
			append_dev(h4, div1);
			append_dev(div1, div0);
			insert_dev(target, t1, anchor);
			insert_dev(target, div8, anchor);
			append_dev(div8, div4);
			append_dev(div4, div2);
			append_dev(div2, span0);
			append_dev(span0, label0);
			append_dev(div2, t3);
			append_dev(div2, input0);
			append_dev(div4, t4);
			append_dev(div4, div3);
			append_dev(div3, span1);
			append_dev(span1, label1);
			append_dev(div3, t6);
			append_dev(div3, input1);
			append_dev(div8, t7);
			append_dev(div8, div7);
			append_dev(div7, div5);
			append_dev(div5, span2);
			append_dev(span2, label2);
			append_dev(div5, t9);
			append_dev(div5, input2);
			append_dev(div7, t10);
			append_dev(div7, div6);
			append_dev(div6, span3);
			append_dev(span3, label3);
			append_dev(div6, t12);
			append_dev(div6, input3);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h4);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div8);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(1106:4) <Dialog class=\\\"remove_right_margin\\\" width=\\\"600\\\" bind:visible={state.openDrag} style=\\\"background: #fff; border-radius: 5px;\\\">",
		ctx
	});

	return block;
}

// (1167:12) <Button                  on:click={handleClose}                  unelevated={true}                  outlined={true}                  class="text-capitalize"                  color="#ccc"              >
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
		source: "(1167:12) <Button                  on:click={handleClose}                  unelevated={true}                  outlined={true}                  class=\\\"text-capitalize\\\"                  color=\\\"#ccc\\\"              >",
		ctx
	});

	return block;
}

// (1175:12) <Button                  on:click={handleSubmit.bind(this, 'drag')}                  class="bg-primary text-white"                  style="text-transform: none"                  key={l.done}              >
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
		source: "(1175:12) <Button                  on:click={handleSubmit.bind(this, 'drag')}                  class=\\\"bg-primary text-white\\\"                  style=\\\"text-transform: none\\\"                  key={l.done}              >",
		ctx
	});

	return block;
}

// (1166:8) 
function create_footer_slot(ctx) {
	let div;
	let button0;
	let t;
	let button1;
	let current;

	button0 = new Button({
			props: {
				unelevated: true,
				outlined: true,
				class: "text-capitalize",
				color: "#ccc",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button0.$on("click", /*handleClose*/ ctx[14]);

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

	button1.$on("click", /*handleSubmit*/ ctx[13].bind(this, 'drag'));

	const block = {
		c: function create() {
			div = element("div");
			create_component(button0.$$.fragment);
			t = space();
			create_component(button1.$$.fragment);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "svelteFooter");
			add_location(div, file, 1165, 8, 52611);
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

			if (dirty[2] & /*$$scope*/ 8) {
				button0_changes.$$scope = { dirty, ctx };
			}

			button0.$set(button0_changes);
			const button1_changes = {};

			if (dirty[2] & /*$$scope*/ 8) {
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
		source: "(1166:8) ",
		ctx
	});

	return block;
}

// (1185:4) <Snackbar bind:visible={state.snackback} bg="#f44336" bottom={true} timeout={10} style="position:fixed; bottom:50px">
function create_default_slot_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text(/*message*/ ctx[12]);
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
		source: "(1185:4) <Snackbar bind:visible={state.snackback} bg=\\\"#f44336\\\" bottom={true} timeout={10} style=\\\"position:fixed; bottom:50px\\\">",
		ctx
	});

	return block;
}

// (1188:12) <Button color="#ff0" on:click={() => (state.snackback = false)}>
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
		source: "(1188:12) <Button color=\\\"#ff0\\\" on:click={() => (state.snackback = false)}>",
		ctx
	});

	return block;
}

// (1187:8) 
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

	button.$on("click", /*click_handler*/ ctx[35]);

	const block = {
		c: function create() {
			span = element("span");
			create_component(button.$$.fragment);
			attr_dev(span, "slot", "action");
			add_location(span, file, 1186, 8, 53352);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			mount_component(button, span, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty[2] & /*$$scope*/ 8) {
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
		source: "(1187:8) ",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div13;
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
	let div12;
	let div6;
	let button1;
	let i1;
	let t5;
	let img;
	let img_src_value;
	let img_alt_value;
	let t6;
	let div11;
	let div7;
	let button2;
	let i2;
	let t7;
	let div8;
	let t8;
	let div9;
	let t9;
	let div10;
	let div11_draggable_value;
	let t10;
	let textarea;
	let textarea_value_value;
	let t11;
	let dialog0;
	let updating_visible;
	let t12;
	let dialog1;
	let updating_visible_1;
	let t13;
	let snackbar;
	let updating_visible_2;
	let current;
	let mounted;
	let dispose;

	function dialog0_visible_binding(value) {
		/*dialog0_visible_binding*/ ctx[33](value);
	}

	let dialog0_props = {
		class: "remove_right_margin",
		width: "600",
		style: "background: #fff; border-radius: 5px;",
		$$slots: {
			footer: [create_footer_slot_1],
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
		/*dialog1_visible_binding*/ ctx[34](value);
	}

	let dialog1_props = {
		class: "remove_right_margin",
		width: "600",
		style: "background: #fff; border-radius: 5px;",
		$$slots: {
			footer: [create_footer_slot],
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
		/*snackbar_visible_binding*/ ctx[36](value);
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
			div13 = element("div");
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
			div12 = element("div");
			div6 = element("div");
			button1 = element("button");
			i1 = element("i");
			t5 = space();
			img = element("img");
			t6 = space();
			div11 = element("div");
			div7 = element("div");
			button2 = element("button");
			i2 = element("i");
			t7 = space();
			div8 = element("div");
			t8 = space();
			div9 = element("div");
			t9 = space();
			div10 = element("div");
			t10 = space();
			textarea = element("textarea");
			t11 = space();
			create_component(dialog0.$$.fragment);
			t12 = space();
			create_component(dialog1.$$.fragment);
			t13 = space();
			create_component(snackbar.$$.fragment);
			attr_dev(div0, "class", "tinymce-editor-response");
			attr_dev(div0, "id", "text0");
			attr_dev(div0, "type", div0_type_value = /*moduleArr*/ ctx[6][0]);
			set_style(div0, "width", /*bgImgWidth*/ ctx[1] + ", \r\n                height: " + /*bgImgHeight*/ ctx[0] + ", \r\n                border: 1px solid #ccc");
			set_style(div0, "outline", "none");
			set_style(div0, "padding", "10px");
			set_style(div0, "textAlign", "left");
			set_style(div0, "display", "none");
			set_style(div0, "overflowY", "scroll\r\n            ");
			attr_dev(div0, "contenteditable", "true");
			add_location(div0, file, 896, 8, 41525);
			attr_dev(span0, "class", "icomoon-new-24px-reset-1 s3");
			set_style(span0, "vertical-align", "text-top");
			add_location(span0, file, 928, 20, 42568);
			attr_dev(span1, "class", "position-relative bottom1");
			add_location(span1, file, 929, 20, 42673);
			attr_dev(div1, "id", "resetAuth");
			attr_dev(div1, "class", "reset btn btn-outline-primary btn-sm height27 mt-sm2 mr-sm2 float-right");
			set_style(div1, "width", "90px");
			add_location(div1, file, 923, 16, 42342);
			set_style(div2, "width", /*bgImgWidth*/ ctx[1]);
			set_style(div2, "height", "32px");
			set_style(div2, "background", "#d9e7fd");
			set_style(div2, "border-top", "2px solid #96bbf6\r\n            ");
			add_location(div2, file, 915, 12, 42107);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file, 950, 24, 43531);
			attr_dev(button0, "name", "change_image");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light px-1 pt-sm1 pb-sm1 mt");
			add_location(button0, file, 944, 20, 43255);
			attr_dev(div3, "class", "btn-group tools");
			add_location(div3, file, 943, 16, 43204);
			attr_dev(div4, "id", "hptdraw");
			set_style(div4, "width", /*bgImgWidth*/ ctx[1]);
			set_style(div4, "height", /*bgImgHeight*/ ctx[0]);
			set_style(div4, "background-image", "url('" + (/*bgImgPath*/ ctx[11] + /*state*/ ctx[7].bgImg) + "')");
			set_style(div4, "background-repeat", "no-repeat");
			set_style(div4, "position", "relative");
			set_style(div4, "border", "1px solid #e0e0e0");
			add_location(div4, file, 932, 12, 42787);
			attr_dev(div5, "class", "drawImage d-none");
			add_location(div5, file, 914, 8, 42063);
			attr_dev(i1, "class", "icomoon-24px-edit-1");
			add_location(i1, file, 967, 20, 44103);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light px-1 pt-sm1 pb-sm1 mt");
			add_location(button1, file, 962, 16, 43892);
			attr_dev(div6, "class", "btn-group tools");
			add_location(div6, file, 961, 12, 43845);
			attr_dev(img, "id", "im");
			attr_dev(img, "class", "hotSpotImg border");
			if (!src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[11] + /*state*/ ctx[7].bgImg)) attr_dev(img, "src", img_src_value);
			set_style(img, "height", /*state*/ ctx[7].imgheight);
			set_style(img, "width", /*state*/ ctx[7].imgwidth);
			set_style(img, "border", /*state*/ ctx[7].hotBorder);
			set_style(img, "border-color", /*state*/ ctx[7].hotBorderColor);
			attr_dev(img, "alt", img_alt_value = /*state*/ ctx[7].alt);
			add_location(img, file, 970, 12, 44199);
			attr_dev(i2, "class", "icomoon-24px-edit-1");
			add_location(i2, file, 994, 24, 45184);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-light px-1 pt-sm1 pb-sm1");
			add_location(button2, file, 989, 20, 44954);
			attr_dev(div7, "class", "btn-group tools h");
			add_location(div7, file, 988, 16, 44901);
			attr_dev(div8, "id", "resizeX");
			attr_dev(div8, "class", "svelte-dl6gty");
			add_location(div8, file, 997, 16, 45292);
			attr_dev(div9, "id", "resizeY");
			attr_dev(div9, "class", "svelte-dl6gty");
			add_location(div9, file, 998, 16, 45417);
			attr_dev(div10, "id", "resizeXY");
			attr_dev(div10, "class", "svelte-dl6gty");
			add_location(div10, file, 999, 16, 45542);
			attr_dev(div11, "draggable", div11_draggable_value = true);
			attr_dev(div11, "class", "drag-resize position-absolute");
			attr_dev(div11, "id", "ID0");
			set_style(div11, "left", /*hotAreaLeft*/ ctx[5]);
			set_style(div11, "top", /*hotAreaTop*/ ctx[2]);
			set_style(div11, "height", /*hotAreaHeight*/ ctx[3]);
			set_style(div11, "width", /*hotAreaWidth*/ ctx[4]);
			add_location(div11, file, 982, 12, 44633);
			attr_dev(div12, "id", "hptmain");
			attr_dev(div12, "path", /*bgImgPath*/ ctx[11]);
			attr_dev(div12, "class", "d-none");
			set_style(div12, "position", "relative");
			set_style(div12, "width", /*bgImgWidth*/ ctx[1]);
			add_location(div12, file, 955, 8, 43667);
			attr_dev(textarea, "class", "d-none");
			attr_dev(textarea, "id", "special_module_xml");
			attr_dev(textarea, "name", "special_module_xml");
			textarea.value = textarea_value_value = /*state*/ ctx[7].xml;
			add_location(textarea, file, 1002, 8, 45698);
			attr_dev(center, "class", "mt");
			attr_dev(center, "id", "mainContent");
			add_location(center, file, 895, 4, 41479);
			add_location(div13, file, 894, 0, 41468);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div13, anchor);
			append_dev(div13, center);
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
			append_dev(center, div12);
			append_dev(div12, div6);
			append_dev(div6, button1);
			append_dev(button1, i1);
			append_dev(div12, t5);
			append_dev(div12, img);
			append_dev(div12, t6);
			append_dev(div12, div11);
			append_dev(div11, div7);
			append_dev(div7, button2);
			append_dev(button2, i2);
			append_dev(div11, t7);
			append_dev(div11, div8);
			/*div8_binding*/ ctx[26](div8);
			append_dev(div11, t8);
			append_dev(div11, div9);
			/*div9_binding*/ ctx[27](div9);
			append_dev(div11, t9);
			append_dev(div11, div10);
			/*div10_binding*/ ctx[28](div10);
			append_dev(center, t10);
			append_dev(center, textarea);
			append_dev(div13, t11);
			mount_component(dialog0, div13, null);
			append_dev(div13, t12);
			mount_component(dialog1, div13, null);
			append_dev(div13, t13);
			mount_component(snackbar, div13, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div0, "keyup", /*setData*/ ctx[17], false, false, false),
					listen_dev(button0, "click", /*changeImg*/ ctx[15].bind(this, 'img'), false, false, false),
					listen_dev(button1, "click", /*changeImg*/ ctx[15].bind(this, 'img'), false, false, false),
					listen_dev(button2, "click", /*changeDrag*/ ctx[16].bind(this, 'drag'), false, false, false),
					listen_dev(div8, "mousedown", stop_propagation(prevent_default(/*resizeHandleW*/ ctx[19])), false, true, true),
					listen_dev(div9, "mousedown", stop_propagation(prevent_default(/*resizeHandleH*/ ctx[20])), false, true, true),
					listen_dev(div10, "mousedown", stop_propagation(prevent_default(/*resizeHandleWH*/ ctx[21])), false, true, true)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (!current || dirty[0] & /*moduleArr*/ 64 && div0_type_value !== (div0_type_value = /*moduleArr*/ ctx[6][0])) {
				attr_dev(div0, "type", div0_type_value);
			}

			if (!current || dirty[0] & /*bgImgWidth, bgImgHeight*/ 3) {
				set_style(div0, "width", /*bgImgWidth*/ ctx[1] + ", \r\n                height: " + /*bgImgHeight*/ ctx[0] + ", \r\n                border: 1px solid #ccc");
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
				set_style(div4, "background-image", "url('" + (/*bgImgPath*/ ctx[11] + /*state*/ ctx[7].bgImg) + "')");
			}

			if (!current || dirty[0] & /*state*/ 128 && !src_url_equal(img.src, img_src_value = /*bgImgPath*/ ctx[11] + /*state*/ ctx[7].bgImg)) {
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
				set_style(div11, "left", /*hotAreaLeft*/ ctx[5]);
			}

			if (!current || dirty[0] & /*hotAreaTop*/ 4) {
				set_style(div11, "top", /*hotAreaTop*/ ctx[2]);
			}

			if (!current || dirty[0] & /*hotAreaHeight*/ 8) {
				set_style(div11, "height", /*hotAreaHeight*/ ctx[3]);
			}

			if (!current || dirty[0] & /*hotAreaWidth*/ 16) {
				set_style(div11, "width", /*hotAreaWidth*/ ctx[4]);
			}

			if (!current || dirty[0] & /*bgImgWidth*/ 2) {
				set_style(div12, "width", /*bgImgWidth*/ ctx[1]);
			}

			if (!current || dirty[0] & /*state*/ 128 && textarea_value_value !== (textarea_value_value = /*state*/ ctx[7].xml)) {
				prop_dev(textarea, "value", textarea_value_value);
			}

			const dialog0_changes = {};

			if (dirty[0] & /*state*/ 128 | dirty[2] & /*$$scope*/ 8) {
				dialog0_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty[0] & /*state*/ 128) {
				updating_visible = true;
				dialog0_changes.visible = /*state*/ ctx[7].openImg;
				add_flush_callback(() => updating_visible = false);
			}

			dialog0.$set(dialog0_changes);
			const dialog1_changes = {};

			if (dirty[2] & /*$$scope*/ 8) {
				dialog1_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible_1 && dirty[0] & /*state*/ 128) {
				updating_visible_1 = true;
				dialog1_changes.visible = /*state*/ ctx[7].openDrag;
				add_flush_callback(() => updating_visible_1 = false);
			}

			dialog1.$set(dialog1_changes);
			const snackbar_changes = {};

			if (dirty[0] & /*state*/ 128 | dirty[2] & /*$$scope*/ 8) {
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
			if (detaching) detach_dev(div13);
			/*div8_binding*/ ctx[26](null);
			/*div9_binding*/ ctx[27](null);
			/*div10_binding*/ ctx[28](null);
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
		$$invalidate(7, state.hotBorder = QXML.smxml.div._border, state);
		$$invalidate(7, state.hotBorderColor = QXML.smxml.div._bordercolor, state);
		$$invalidate(7, state.bgImg = QXML.smxml._bgimg, state);
		$$invalidate(0, bgImgHeight = QXML.smxml._height + 'px'); // Image Height
		$$invalidate(7, state.alt = QXML.smxml._alt, state);
		$$invalidate(1, bgImgWidth = QXML.smxml._width + 'px'); // Image Width
		$$invalidate(4, hotAreaWidth = QXML.smxml.div._width + 'px'); // draggable area width
		$$invalidate(3, hotAreaHeight = QXML.smxml.div._height + 'px'); // draggable area height
		$$invalidate(5, hotAreaLeft = parseInt(QXML.smxml.div._left) + 4 + 'px'); // draggable area left
		$$invalidate(2, hotAreaTop = parseInt(QXML.smxml.div._top) + 2 + 'px'); // draggable area top
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
		$$invalidate(7, state.lineColor = QXML.smxml.div._linecolor, state);
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

		if (AH.find(document, 'canvas')) {
			AH.find(document, 'canvas').remove();
		}

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
			if (elem) {
				AH.select('#' + elem).dataset["attributes"] = JSON.stringify(attrs);
			}
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
				}
			});

		let surfaceColor = surface.lineColor(state.lineColor);

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
		if (currentXMl.children[0].getAttribute('type') == 'imagehighlight') {
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
				2000
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

	let m_posX;
	let m_posY;
	let resize_elW;
	let resize_elH;
	let resize_elWH;

	function resizeX(e) {
		let parent = resize_elW.parentNode;
		let dx = m_posX - e.x;
		$$invalidate(24, m_posX = e.x);
		parent.style.width = parseInt(getComputedStyle(parent, '').width) - dx + "px";
	}

	function resizeY(e) {
		let parent = resize_elH.parentNode;
		let dy = m_posY - e.y;
		$$invalidate(25, m_posY = e.y);
		parent.style.height = parseInt(getComputedStyle(parent, '').height) - dy + "px";
	}

	function resizeXY(e) {
		let parent = resize_elH.parentNode;
		let dx = m_posX - e.x;
		let dy = m_posY - e.y;
		$$invalidate(24, m_posX = e.x);
		$$invalidate(25, m_posY = e.y);
		parent.style.width = parseInt(getComputedStyle(parent, '').width) - dx + "px";
		parent.style.height = parseInt(getComputedStyle(parent, '').height) - dy + "px";
	}

	function resizeHandleW(e) {
		$$invalidate(24, m_posX = e.x);
		document.removeEventListener("mousemove", resizeY, false);
		document.addEventListener("mousemove", resizeX, false);

		document.addEventListener(
			"mouseup",
			function () {
				document.removeEventListener("mousemove", resizeX, false);
				document.removeEventListener("mousemove", resizeY, false);
				document.removeEventListener("mousemove", resizeXY, false);
			},
			false
		);
	}

	function resizeHandleH(e) {
		$$invalidate(25, m_posY = e.y);
		document.removeEventListener("mousemove", resizeX, false);
		document.addEventListener("mousemove", resizeY, false);

		document.addEventListener(
			"mouseup",
			function () {
				document.removeEventListener("mousemove", resizeX, false);
				document.removeEventListener("mousemove", resizeY, false);
			},
			false
		);
	}

	function resizeHandleWH(e) {
		$$invalidate(24, m_posX = e.x);
		$$invalidate(25, m_posY = e.y);
		document.removeEventListener("mousemove", resizeX, false);
		document.removeEventListener("mousemove", resizeY, false);
		document.addEventListener("mousemove", resizeXY, false);

		document.addEventListener(
			"mouseup",
			function () {
				document.removeEventListener("mousemove", resizeX, false);
				document.removeEventListener("mousemove", resizeY, false);
				document.removeEventListener("mousemove", resizeXY, false);
			},
			false
		);
	}

	const writable_props = ['xml', 'getChildXml'];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hotspot> was created with unknown prop '${key}'`);
	});

	function div8_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			resize_elW = $$value;
			$$invalidate(8, resize_elW);
		});
	}

	function div9_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			resize_elH = $$value;
			$$invalidate(9, resize_elH);
		});
	}

	function div10_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			resize_elWH = $$value;
			$$invalidate(10, resize_elWH);
		});
	}

	function input1_input_handler() {
		state.alt = this.value;
		$$invalidate(7, state);
	}

	function select0_change_handler() {
		state.hotBorder = select_value(this);
		$$invalidate(7, state);
	}

	function select1_change_handler() {
		state.hotBorderColor = select_value(this);
		$$invalidate(7, state);
	}

	function select2_change_handler() {
		state.lineColor = select_value(this);
		$$invalidate(7, state);
	}

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
		if ('xml' in $$props) $$invalidate(22, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(23, getChildXml = $$props.getChildXml);
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
		setPS,
		m_posX,
		m_posY,
		resize_elW,
		resize_elH,
		resize_elWH,
		resizeX,
		resizeY,
		resizeXY,
		resizeHandleW,
		resizeHandleH,
		resizeHandleWH
	});

	$$self.$inject_state = $$props => {
		if ('xml' in $$props) $$invalidate(22, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(23, getChildXml = $$props.getChildXml);
		if ('count' in $$props) count = $$props.count;
		if ('drawstr' in $$props) drawstr = $$props.drawstr;
		if ('bgImgHeight' in $$props) $$invalidate(0, bgImgHeight = $$props.bgImgHeight);
		if ('bgImgWidth' in $$props) $$invalidate(1, bgImgWidth = $$props.bgImgWidth);
		if ('bgImgPath' in $$props) $$invalidate(11, bgImgPath = $$props.bgImgPath);
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
		if ('message' in $$props) $$invalidate(12, message = $$props.message);
		if ('state' in $$props) $$invalidate(7, state = $$props.state);
		if ('hdd' in $$props) hdd = $$props.hdd;
		if ('m_posX' in $$props) $$invalidate(24, m_posX = $$props.m_posX);
		if ('m_posY' in $$props) $$invalidate(25, m_posY = $$props.m_posY);
		if ('resize_elW' in $$props) $$invalidate(8, resize_elW = $$props.resize_elW);
		if ('resize_elH' in $$props) $$invalidate(9, resize_elH = $$props.resize_elH);
		if ('resize_elWH' in $$props) $$invalidate(10, resize_elWH = $$props.resize_elWH);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*m_posX*/ 16777216) ;

		if ($$self.$$.dirty[0] & /*m_posY*/ 33554432) ;
	};

	return [
		bgImgHeight,
		bgImgWidth,
		hotAreaTop,
		hotAreaHeight,
		hotAreaWidth,
		hotAreaLeft,
		moduleArr,
		state,
		resize_elW,
		resize_elH,
		resize_elWH,
		bgImgPath,
		message,
		handleSubmit,
		handleClose,
		changeImg,
		changeDrag,
		setData,
		changeLine,
		resizeHandleW,
		resizeHandleH,
		resizeHandleWH,
		xml,
		getChildXml,
		m_posX,
		m_posY,
		div8_binding,
		div9_binding,
		div10_binding,
		input1_input_handler,
		select0_change_handler,
		select1_change_handler,
		select2_change_handler,
		dialog0_visible_binding,
		dialog1_visible_binding,
		click_handler,
		snackbar_visible_binding
	];
}

class Hotspot extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { xml: 22, getChildXml: 23 }, add_css, [-1, -1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Hotspot",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[22] === undefined && !('xml' in props)) {
			console.warn("<Hotspot> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[23] === undefined && !('getChildXml' in props)) {
			console.warn("<Hotspot> was created without expected prop 'getChildXml'");
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
//# sourceMappingURL=Hotspot-37fedab6.js.map
