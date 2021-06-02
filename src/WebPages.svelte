<script>
    import { onMount, beforeUpdate, afterUpdate , tick } from 'svelte';
    import { writable } from 'svelte/store';
import { AH } from '../helper/HelperAI.svelte';
    import {editorConfig} from './EditorConfig.svelte';
    export let editorState;
    export let content_guid;
	export let getLabel;
	export let didMount;
    let webData = [];
	let activated;
    let state = {}
    let hdd = writable({
			content_type : "",
			content_subtype : "",
			exam : "",
			examdetails : "",
			subject : "",
			message : "",
			meta_title : "",
			meta_keywords : "",
			meta_description : "",
			meta_keywords : "",
			google_suggestion : "",
			exam_groups : "",
			requirements : "",
			about : "",
			about_more : "",
			header : "",
			footer : "",
			usefull_Links : "",
			content : "",
			details : "",
			Heading : "",
        });
    const unsubscribe = hdd.subscribe((item)=> {
        state = item;
    })

    onMount(async ()=> {
        webData = loadComponent();
        if (editorState.viewConfig.showRefresh) {
			AI.set(editorState.content_type+"_refresh", refreshWebPage);
		}
        state.content_type = editorState.content_type;
        state.content_subtype = editorState.item;
        afterInit();
    });

    beforeUpdate(async ()=> {
        if (editorState.webpageArray != state.webpageArray) {
			for (let i in editorState.webpageArray) {
				state[i] = editorState.webpageArray[i];
            }
            state.webpageArray = editorState.webpageArray;
			setTimeout(function() {
				webPageData(getDataToSend(1));
			}, 200);
		}
	})
	
	function webPageData(data) {
		editorState.webPageData = data;
	}

    function afterInit() {
        if (editorState.content_type == "e") {
			AH.insert('#content_show', '<div id="subject_show" class="pt-md bold" style="whiteSpace:pre-line;wordWrap:break-word;"></div><div id="message_show" class="pt-md" style="whiteSpace:pre-line;wordWrap:break-word;"></div>', 'afterend');
		} 
		setTimeout(function() {
			updatePreview();
		}, 200);
		AH.listen('body', 'click','#showPreview', (_this)=> {
			let data = getDataToSend(); 
			editorState.activator = true;
	    	AH.ajax({
	                url: baseUrl+'editor/index.php',
	                data: data,
	                type: 'post',
			}).then((response)=> {
				response = JSON.parse(response);
				if (editorState.propsAjaxData['page_data']) { 
					document.querySelector('#layoutMode').innerHTML = "<iframe></iframe>";
					sendToFrame(response["page_data"]);
				};
				editorState.activator = false;
			}); 
		});
		tinyMCE.PluginManager.add('changeInModule', function(editorPlugin) {
	       editorPlugin.on('change click ExecCommand keyup', function(e) {
	       		try {
	       			setContent(tinyMCE.activeEditor.id);
	       		} catch(e) {}
			});
        });
    }
	function onMessagChange(event) {
		let content = event.target.value;
		document.querySelector('#message_show').innerHTML = get_ucsyntax(content);
		if (content.match(/<uc:syntax/gm)) prettyPrint();
		state.message = seqTag(content).replace(/&lsqb;/g,"[");
		webPageData(getDataToSend(1));
		let xmlRef = AH.select('#save_xml');
		if(xmlRef.classList.contains('disabled') && xmlRef.getAttribute('disabled') == "disabled") {
			if (editor.save == 1) {
				AH.select(xmlRef, 'removeClass', 'disabled');
				xmlRef.disabled = false;
			} else {
				AH.select(xmlRef, 'addClass', 'disabled')
				xmlRef.disabled = true;
			}
		}
	}

    function setContent(e) {
		let selector  = (typeof e == 'object') ? e.target.id : e ;
		let content = tinyMCE.activeEditor.getContent({format : 'raw'});
		document.querySelector('#'+selector+'_show').innerHTML = get_ucsyntax(content);
		if (content.match(/<uc:syntax/gm)) prettyPrint();
		let contentClear = AH.select('#webpageContentShow', 'html', tinyMCE.activeEditor.getContent())
		contentClear = contentClear.textContent; //Removing special symbol
		state[selector] = seqTag(contentClear, 1);
		webPageData(getDataToSend(1));
	}
    function refreshWebPage() {
		activate(2);
		AH.ajax({
			url: baseUrl + 'editor/index.php',
			cache: false,
			data: { 
				ajax: "1", 
				action: 'get_web_page_data', 
				content_guid: editorState.content_guid,
				content_text: editorState.currentWebPageData,
			},
			type: 'post',
		}).then((response)=> {
			document.querySelector('#layoutMode').innerHTML = "<iframe></iframe>";
			sendToFrame(response);
			activate(0);
		});
	}

    function sendToFrame(data) {
		let allStyles      = document.querySelectorAll('style');
	 	let allStylesLink  = document.querySelectorAll('link');
	 	let allScripts     = document.querySelectorAll('script');
	 	let Alltags = [allStyles,allStylesLink,allScripts];
	 	let libs = "";
	 	for (let i = 0; i < 3; i++) {
	 		for (let j = 0; j < Alltags[i].length; j++) {
	 			if (/bundle\.js/gm.test(Alltags[i][j].outerHTML)) {
	 				continue;
	 			}
	 			libs += Alltags[i][j].outerHTML;
	 		}
		 }
		let fullData = "<!DOCTYPE html><html><head>"+libs+"</head><body>"+data+"</body></html>"
		let frame = document.querySelector("#layoutMode").firstElementChild;
		frame.className = "fwidth border-0";
		frame.style.cssText = "min-height: 600px;"
		let iframeDoc  = frame.contentDocument;
		iframeDoc.open();
		iframeDoc.write(fullData);
		iframeDoc.close();

		let frameInterval = setInterval(function() {
			let imgTags = iframeDoc.querySelectorAll(".video_preview img");
			if (imgTags.length > 0) {
				for (let i = 0; i < imgTags.length; i++) {
					imgTags[i].style.cssText = "transform:unset";
				}
				clearInterval(frameInterval);
			}
		}, 300);
    }
    
    function getDataToSend(forSave = 0) {
		let data = {};

		if (state.content_type == 'p') {
			switch (parseInt(state.content_subtype)) {
				case 0 : 
					data['exam'] = seqTag(state.exam);	
					data['examdetails'] = seqTag(state.examdetails);
					data['meta_title'] = seqTag(state.meta_title);	
					data['meta_description'] = seqTag(state.meta_description);	
					data['meta_keywords'] = seqTag(state.meta_keywords);	
					data['google_suggestion'] = seqTag(state.google_suggestion);	
					data['exam_groups'] = seqTag(state.exam_groups);	
					data['header'] = seqTag(state.header);
					data['about'] = seqTag(state.about); 
					
				case 1 : 
					data['meta_title'] = seqTag(state.meta_title);	
					data['meta_keywords'] = seqTag(state.meta_keywords);
					data['meta_description'] = seqTag(state.meta_description);	
					data['google_suggestion'] = seqTag(state.google_suggestion);	
					data['exam_groups'] = seqTag(state.exam_groups);	
					data['requirements'] = seqTag(state.requirements);	
					data['about'] = seqTag(state.about);	
					data['about_more'] = seqTag(state.about_more);
				case 2 : 
					data['meta_title'] = seqTag(state.meta_title);	
					data['meta_description'] = seqTag(state.meta_description);	
					data['meta_keywords'] = seqTag(state.meta_keywords);	
					data['about'] = seqTag(state.about);	
					data['about_more'] = seqTag(state.about_more);	
					data['google_suggestion'] = seqTag(state.google_suggestion);	
					data['header'] = seqTag(state.header);
					data['footer'] = seqTag(state.footer);
				case 3 : 
					data['meta_title'] = seqTag(state.meta_title);	
					data['meta_description'] = seqTag(state.meta_description);	
					data['meta_keywords'] = seqTag(state.meta_keywords);	
					data['heading'] = seqTag(state.heading);	
					data['details'] = seqTag(state.details);	
					data['header'] = seqTag(state.header);	
					data['content'] = seqTag(state.content);
					data['usefull_links'] = seqTag(state.usefull_links);
				default : 
					data['exam'] = seqTag(state.exam);	
					data['examdetails'] = seqTag(state.examdetails);
			}
		}
		else if(state.content_type == 'e') {
			data['subject'] = br2nl(state.subject);	
			data['message'] = br2nl(state.message);	
		}
		if(forSave) {
			data['content_icon'] = 0;
			data['course_code'] = editor.course;
			data['action'] = 'save';
		}
		else {
			data['func'] = 'react_get_preview';
			data['ajax'] = '1';
		}
		data['content_guid'] = (state.content_type == 'p') ? AH.select('#show_guid').innerHTML : content_guid;
		data['content_type'] = state.content_type;
		data['content_subtype'] = state.content_subtype;
		(state.content_type == 'p') ? data['webpage'] = AH.select('#show_guid').innerHTML : "";
		return JSON.parse(JSON.stringify(data));
    }
    
    function updatePreview(setAjaxContent = editorState.propsAjaxData) {
		if (setAjaxContent) {
			for (let i in setAjaxContent) {
				if (state[i] != undefined) {
					state[i] = setAjaxContent[i];
					if (AI.isValid(setAjaxContent[i])) {
						AH.selectAll(`#${i}, #${i}_show`, 'html', setAjaxContent[i].replace(/\n/g,'<br />'));
						(i == 'message') ? AH.select('#message', 'value', setAjaxContent[i].replace(/\n/g,'<br />')) : "" ;
					}
				}			
			}
			webPageData(getDataToSend(1));
			if (setAjaxContent['page_data']) { 
				AH.select('#layoutMode', 'html', "<iframe></iframe>");
				sendToFrame(setAjaxContent['page_data']);
			};
		} else {
			AH.select("#exam", 'html', editorConfig.getWebpageTags('exam'));
			AH.select("#examdetails", 'html', editorConfig.getWebpageTags('examdetails'));
		}
    }
    
    function loadComponent() {
        let comp = [
                    {
                        label: "Exam",
                        id: "exam",
                        arg: "exam",
                        view: [0],
                    },
                    {
                        label: "Exam Details",
                        id: "examdetails",
                        arg: "examdetails",
                        view: [0],
                    },
                    {
                        label: "Meta Title",
                        id: "meta_title",
                        arg: "meta_title",
                        view: [0,1,2,3],
                    },
                    {
                        label: "Meta Description",
                        id: "meta_description",
                        arg: "meta_description",
                        view: [0, 1,2,3],
                    },
                    {
                        label: "Meta Keywords",
                        id: "meta_keywords",
                        arg: "meta_keywords",
                        view: [0, 1, 2, 3],
                    },
                    {
                        label: "Google Suggestion",
                        id: "google_suggestion",
                        arg: "google_suggestion",
                        view: [0,1, 2],
                    },
                    {
                        label: "Exam Groups",
                        id: "exam_groups",
                        arg: "exam_groups",
                        view: [1],
                    },
                    {
                        label: "Requirements",
                        id: "requirements",
                        arg: "requirements",
                        view: [1],
                    },
                    {
                        label: "Header",
                        id: "header",
                        arg: "header",
                        view: [0,2,3],
                    },
                    {
                        label: "Heading",
                        id: "heading",
                        arg: "heading",
                        view: [3],
                    },
                    {
                        label: "Details",
                        id: "details",
                        arg: "details",
                        view: [3],
                    },
                    {
                        label: "Content",
                        id: "Content",
                        arg: "Content",
                        view: [3],
                    },
                    {
                        label: "Usefull Links",
                        id: "usefull_links",
                        arg: "usefull_links",
                        view: [3],
                    },
                    {
                        label: "About",
                        id: "about",
                        arg: "about",
                        view: [0,1, 2],
                    },
                    {
                        label: "About More",
                        id: "about_more",
                        arg: "about_more",
                        view: [1,2],
                    },
                    {
                        label: "Footer",
                        id: "footer",
                        arg: "footer",
                        view: [2],
                    },
                ];
        return comp;
	}
    
</script>

<div id="webPagesAuthoring" use:didMount={activated}>
    {#if editorState.content_type == 'p'}
		{#each webData as item, i (item.id)}
			{#if item.view.includes(editorState.item)}
				<div key={item.id}>
					{@html getLabel(item.label)}
					<div
						class="tinymce-editor auth-editor"
						contentEditable={true}
						id="subject"
						data-text="Subject"
						style="border-bottom: 1px solid #e7e7e7; margin: 10px 0 5px 0; min-height: 125px"
						on:keyup={setContent.bind(this, item.arg)}
					></div>
				</div>
			{/if}
        {/each}
    {:else if editorState.content_type == 'e'}
        <div>
            {@html getLabel("Subject")}
            <div
                class="tinymce-editor auth-editor"
                contentEditable={true}
                id="subject"
                data-text="Subject"
                style="border-bottom: 1px solid #e7e7e7; margin: 10px 0 5px 0; min-height: 80px"
                on:keyup={setContent.bind(this,"subject")}
            ></div>
            {@html getLabel("Message")}
            <br/>
            <textarea
                id="message"
                rows={10}
                cols={90}
                placeholder="Message"
				on:Change={onMessagChange}
            >	
            </textarea>
        </div>
    {/if}
</div>

<style>
    #headingIntro .active_videos.play_it {
        height: auto!important;
    }
    .prod_detail.product-box {
        width: 282px!important;
    }
    .width282 {
        width: 282px!important;
    }
</style>


