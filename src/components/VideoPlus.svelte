<script>
    import { writable } from "svelte/store";
    import { beforeUpdate, onMount } from "svelte";
    import { AH } from "../../helper/HelperAI.svelte";
    export let setAjaxContent;
    export let editorState;
    let lastAction =""
    let state = {};
    let hdd = writable({
			sequence:'0',
			info:"",
			vtt:""
        });
    const unsubscribe = hdd.subscribe((items)=> {
        state = items;
    })
        
    onMount(()=> {
        if (setAjaxContent) {
			var ajaxPageData = setAjaxContent['page_data'];
			state.vtt = setAjaxContent['vtt'],
			state.info = setAjaxContent['info']
            if (ajaxPageData) {
                ajaxPageData = setAjaxContent['page_data'].replace(/id="update-vtt"/gmi,'id="update-vtt" in_editor="1" ');
                AH.select('#previewSection').innerHTML = ajaxPageData;
            }
		}
		AH.listen(document, 'click','#showPreview', updateVideoContent.bind(this));
		AH.listen(document, 'click','#update-vtt',function(_this) {
			AH.selectAll(".text").forEach((elm, index)=> {
		        captions[index].text = elm.textContent;
		    });
		    var vtt_data = JSON.stringify(captions);
            editorState.activator = true;
            
			AH.ajax({
		       url: baseUrl+"editor/index.php",
		       type: 'POST',
		       data: {
				   ajax:1,
				   content_guid:self.props.guid,
				   text:vtt_data,
				   tag:[],
				   action:'update_vtt',
				   in_editor:1
                },
            }).then((data)=> {
                try {
                    AH.select('#save_xml').classList.remove('disabled');
                    AH.select('#save_xml').setAttribute('disabled', false);
                    data = JSON.parse(data);
                    state.vtt = data.vtt;
                    state.info = data.info;
                    AH.select('#vtt').innerHTML = data.vtt;
                    AH.select('#info').innerHTML = data.info;
                    AH.select('#showPreview').click();
                }
                catch(err) {
                    console.log({err,func:'componentDidMount @ 70'});
                }
		    });
		});
		tinyMCE.PluginManager.add('changeInModule', function(editorPlugin, url) {
			editorPlugin.on('change click', function(e) {
				try {
					setContent(tinyMCE.activeEditor.id);
				} catch(error) {
					console.log({error, func:'loadVideoListener @ 1173'});
				}
			});
		});
    })

    beforeUpdate(async ()=> {
		let videoHeight = AH.select(".video-container").clientHeight;
		if (videoHeight > 100 && videoHeight > AH.select("#sidebar").clientHeight) {
			AH.select("#sidebar").style.height = videoHeight - (isNaN(AH.select('.sidetab_ul').clientHeight) ? 0 : AH.select('.sidetab_ul').clientHeight);
			let reduceHeight = videoHeight - (AH.select(".trans_toolbar").clientHeight + 10);
			AH.select("#transcript").style.height = reduceHeight;
			AH.selectAll("#transcript,.transcript-ul").forEach((elm)=> elm.style.height = (AH.select('#video-container').outerHeight - AH.select('.sidetab_ul').outerHeight - 4) +'px');
			AH.select('.video_comment_section').style.height = AH.select('#video-container').outerHeight - AH.select('.sidetab_ul').outerHeight - 4;
		}
	})

	function updateVideoContent(){
		var content = {};
		content['title'] = editorState.title;
		content['content'] = (editorState.content) ? editorState.content.replace(/'/g,'"') : '';
		content['info'] = state.info;
		var vtt = (state.vtt) ? state.vtt.replace(/<br>|<br\/>|<br \/>/gim,"\n").replace(/<span>|<\/span>/gim,'') : "";
		content['vtt'] = vtt.replace(/ \n|\n |\n/g,"\n");
		editorState.activator = true;
		AH.ajax({
            url: baseUrl+'editor/index.php', 
            cache: false,
            data: {ajax:1, content_guid : editorState.guid,title:content['title'],content:content['content'],info:content['info'],vtt:content['vtt'],content_type : 'f',content_subtype : '45',content_text:content , func:'react_get_preview'},                         
        }).then((response)=> {
            response = JSON.parse(response);
            response['page_data'] = response['page_data'].replace(/id="update-vtt"/gmi,'id="update-vtt" in_editor="1" ');
            AH.select('#previewSection').innerHTML = response['page_data'];
            editorState.activator = false;
		});
	}

	function setContent(type) {
		(lastAction) ? clearTimeout(lastAction) : "";
		lastAction = setTimeout(function() {
			var content = tinyMCE.activeEditor.getContent({format : 'raw'});
			content = content.replace(/<span class="nanospell-typo" data-mce-bogus="1">/g, '');
			content = content.replace(/<span class="" data-mce-bogus="1">/g, '');
			(content.match(/<uc:syntax/gm)) ? prettyPrint() : '';
			state[type] = content.replace(/<br>|<br\/>|<br \/>/gim,"\n").replace(/<span>|<\/span>/gim,'');
            updateVttAndInfo(state.vtt, state.info);
			clearTimeout(lastAction);
		},200);
    }
    function updateVttAndInfo(vtt, info) {
		editorState.vtt = vtt;
		editorState.info = info;
	}
</script>

<div id="authoringArea">
    <div 
        class="tinymce-editor auth-editor"
        contentEditable={true}
        id="vtt"
        data-text="Vtt"
        on:keyup={setContent.bind(this, 'vtt')}
        style="border-bottom: 1px solid #e7e7e7; margin: 5px 0 5px 0; whiteSpace: pre-line; clear: both; min-height: 125px"  
    ></div>
    <div 
        class="tinymce-editor auth-editor"
        contentEditable={true}
        id="info"
        data-text="Info"
        on:keyup={setContent.bind(this, 'info')}
        style="border-bottom: 1px solid #e7e7e7; margin: 5px 0 5px 0; whiteSpace: pre-line; clear: both; min-height: 125px"  
    ></div>
</div>