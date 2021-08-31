<script context="module">
    import {XMLToJSON} from '../helper/HelperAI.svelte';
    export function getItems(subtype, state) {
        return new Promise(async (resolve)=> {
            if (state.viewConfig.isQuestion) {
                switch(subtype) { 
                    case 8:
                    case 0: 
                        resolve({
                                "auth": (await import('../clsSMMultipleChoice/MultipleChoice.svelte')).default,
                                "preview": (await import('../clsSMMultipleChoice/MultipleChoicePreview.svelte')).default,
                                "default": (await import('../clsSMMultipleChoice/defaultXML.svelte')),
                                "UI": (await import('../clsSMMultipleChoice/mcqHelper.svelte')).itemHelper,
                            });
                    break;
                    case 4: {
                            let hotXml = XMLToJSON(state.xml);
                            //let type = hotXml && hotXml.smxml && hotXml.smxml.div && ["w", "s", "p"].includes(hotXml.smxml.div._type);
                            let type = (state.content_icon == 2 || state.content_icon == 4) ? true : false;
                            resolve({
                                "auth": type ? (await import('../clsSMHotspot/HotspotToken.svelte')).default : (await import('../clsSMHotspot/Hotspot.svelte')).default,
                                "preview": type ? (await import('../clsSMHotspot/HotspotTokenPreview.svelte')).default : (await import('../clsSMHotspot/HotspotPreview.svelte')).default,
                                "default": (await import('../clsSMHotspot/defaultXML.svelte')),
                                "UI": (await import('../clsSMHotspot/hotspotHelper.svelte')).itemHelper,
                            });   
                        }
                    break;
                    case 9: 
                        resolve({
                            "auth": (await import('../clsSMFill/FillInTheBlanks.svelte')).default, 
                            "preview": (await import('../clsSMFill/FillInTheBlanksPreview.svelte')).default,
                            "default": (await import('../clsSMFill/defaultXML.svelte')),
                            "UI": (await import('../clsSMFill/fillHelper.svelte')).itemHelper,
                        });
                    break;
                    case 1: 
                    case 3: 
                    case 15: 
                        resolve({
                            "auth": (await import('../clsSMDragNDrop/DragNDrop.svelte')).default,
                            "preview": (await import('../clsSMDragNDrop/DragNDropPreview.svelte')).default,
                            "default": (await import('../clsSMDragNDrop/defaultXML.svelte')),
                            "UI": (await import('../clsSMDragNDrop/DNDHelper.svelte')).itemHelper,
                        });
                        break;
                    case 27:  
                        resolve({
                            "auth": (await import('../clsSMChoiceMatrix/ChoiceMatrix.svelte')).default,
                            "preview": (await import('../clsSMChoiceMatrix/ChoiceMatrixPreview.svelte')).default,
                            "default": (await import('../clsSMChoiceMatrix/defaultXML.svelte')),
                            "UI": (await import('../clsSMChoiceMatrix/choiceMatrixHelper.svelte')),
                        });
                    case 22: 
                        resolve({ 
                            "auth": (await import('../clsSMWeb/Web.svelte')).default,
                            "preview": (await import('../clsSMWeb/Web.svelte')).default,
                            "default": (await import('../clsSMWeb/defaultXML.svelte')),
                            "UI": (await import('../clsSMWeb/WebHelper.svelte')),
                        });
                        
                    break;
                    case 36: 
                        resolve({
                            "auth": (await import('../clsSMInsight/Insight.svelte')).default,
                            "preview": "",
                            "default": (await import('../clsSMInsight/defaultXML.svelte')),
                            "UI": (await import('../clsSMInsight/insightHelper.svelte')).itemHelper,
                        })
                    break;
                    case 20: 
                        resolve({
                            "auth": (await import('../clsSMGraph/Graph.svelte')).default,
                            "preview": (await import('../clsSMGraph/GraphPreview.svelte')).default,
                            "default": (await import('../clsSMGraph/defaultXML.svelte')),
                            "UI": {
                                helpVideo: '//player.vimeo.com/external/287907354.hd.mp4?s=aacf37c33f846bc4478bbafc7cf300efdd569537',
                            },
                        });
                    break;
                    case 38: 
                        resolve({
                            "auth": (await import('../clsSMChart/ChartAuthoring.svelte')).default,
                            "preview": (await import('../clsSMChart/ChartPreview.svelte')).default,
                            "default": (await import('../clsSMChart/defaultXML.svelte')),
                            "UI": {
                                helpVideo: '//player.vimeo.com/external/287907081.hd.mp4?s=46e83309850cafe52d14223f1b94a5f6e2968c76',
                            },
                        });
                    break;
                    case 14: 
                        resolve({
                            "auth": (await import('../clsSMMatchList/MatchList.svelte')).default,
                            "preview": (await import('../clsSMMatchList/MatchListPreview.svelte')).default,
                            "default": (await import('../clsSMMatchList/defaultXML.svelte')),
                            "UI": (await import('../clsSMMatchList/MatchListHelper.svelte')).itemHelper,
                        });
                    break;
                    case 56: 
                        resolve({
                            "auth": (await import('../clsSMGridded/Gridded.svelte')).default,
                            "preview": (await import('../clsSMGridded/GriddedPreview.svelte')).default,
                            "default": (await import('../clsSMGridded/defaultXML.svelte')),
                            "UI": "",
                        });
                    break;
                    case 57: 
                        resolve({
                            "auth": (await import('../clsSMList/ListAuthoring.svelte')).default,
                            "preview": (await import('../clsSMList/ListPreview.svelte')).default,
                            "default": (await import('../clsSMList/defaultXML.svelte')),
                            "UI": "",
                        });
                    break;
                    case 37: 
                    resolve({
                        "auth": (await import('../clsSMMixedItem/ItemPlugin.svelte')).default,
                        "preview": (await import('../clsSMMixedItem/ItemPluginPreview.svelte')).default,
                        "default": (await import('../clsSMMixedItem/defaultXML.svelte')),
                        "UI": (await import('../clsSMMixedItem/itemPluginHelper.svelte')),
                        });
                    break;
                    case 16:
                        resolve({
                            "auth": (await import("../clsSMExternal/External.svelte")).default,
                            "preview": (await import("../clsSMExternal/External.svelte")).default,
                            "default": (await import('../clsSMExternal/defaultXML.svelte')),
                            "UI": (await import('../clsSMExternal/externalHelper.svelte')).itemHelper,
                        });
                    break;
                    case 17:
                        resolve({
                            "auth": (await import("../clsSMLabSimulation/Labsimulation.svelte")).default,
                            "preview": (await import("../clsSMLabSimulation/Labsimulation.svelte")).default,
                            "default": (await import('../clsSMLabSimulation/defaultXML.svelte')),
                            "UI": (await import('../clsSMLabSimulation/labSimHelper.svelte')).itemHelper,
                        })
                    break;
                    case 24: 
                        resolve({
                            "auth": (await import('../clsSMEval/Eval.svelte')).default,
                            //"preview": (await import('../clsSMEval/Eval.svelte')).default,
                            "default": (await import('../clsSMEval/defaultXML.svelte')),
                            "UI": (await import('../clsSMEval/evalHelper.svelte')).itemHelper,
                        })
                    break;
                    case 25: 
                        resolve({
                            "auth": (await import('../clsSMVirtualLab/VirtualLab.svelte')).default,
                            "preview": (await import('../clsSMVirtualLab/VirtualLabPreview.svelte')).default,
                            "default": (await import('../clsSMVirtualLab/defaultXML.svelte')),
                            "UI": (await import('../clsSMVirtualLab/virtualLabHelper.svelte')).itemHelper,
                        })
                    break;
                    case 35: 
                        resolve({
                                "auth": (await import('../clsSMAlignMatch/AlignMatch.svelte')).default,
                                "preview": (await import('../clsSMAlignMatch/AlignMatchPreview.svelte')).default,
                                "default": (await import('../clsSMAlignMatch/defaultXML.svelte')),
                                "UI": (await import('../clsSMAlignMatch/AlignMatchHelper.svelte')).itemHelper,
                            });
                    break;
                    case 5: 
                        resolve({
                            "auth": (await import('../clsSMEssay/Essay.svelte')).default,
                            "preview": (await import('../clsSMEssay/EssayPreview.svelte')).default,
                            "default": (await import('../clsSMEssay/defaultXML.svelte')),
                            "UI": {},
                        });
                    break;
                    case 7: 
                        resolve({
                                "auth": (await import('../clsSMTree/TreeViewAuthoring.svelte')).default,
                                "preview": (await import('../clsSMTree/TreeViewPreview.svelte')).default,
                                "default": (await import('../clsSMTree/defaultXML.svelte')),
                                "UI": {},
                            });
                    break;
                    case 6: 
                        resolve({
                            "auth": (await import('../clsSMChoose/ChooseNReorder.svelte')).default,
                            "preview": (await import('../clsSMChoose/ChooseNReorderPreview.svelte')).default,
                            "default": (await import('../clsSMChoose/defaultXML.svelte')),
                            "UI": (await import('../clsSMChoose/chooseHelper.svelte')).itemHelper,
                        });
                    break;
                    case 26: 
                        resolve({
                            "auth": (await import('../clsSMChoose/ChooseMultiGrid.svelte')).default,
                            "preview": (await import('../clsSMChoose/ChooseMultiGridPreview.svelte')).default,
                            "default": (await import('../clsSMChoose/defaultXML.svelte')),
                            "UI": (await import('../clsSMChooseMultiGrid/ChooseMultiGridHelper.svelte')).itemHelper,
                        });
                    break;
                    case 30: 
                        resolve({
                            "auth": (await import('../clsSMSlider/SliderItem.svelte')).default,
                            "preview": (await import('../clsSMSlider/SliderItemPreview.svelte')).default,
                            "default": (await import('../clsSMSlider/defaultXML.svelte')),
                            "UI": (await import('../clsSMSlider/SliderItemHelper.svelte')).itemHelper,
                        });
                    break;
                    case 44: 
                        resolve({
                            "auth": (await import('../clsSMShadedGrid/ShadingAuth.svelte')).default,
                            "preview": (await import('../clsSMShadedGrid/ShadingPreview.svelte')).default,
                            "default": (await import('../clsSMShadedGrid/defaultXML.svelte')),
                            "UI": {},
                        });
                    break;
                    case 43: 
                        resolve({
                            "auth": (await import('../clsSMAudioRecorder/AudioRecorder.svelte')).default,
                            "preview": (await import('../clsSMAudioRecorder/AudioPreview.svelte')).default,
                            "default": (await import('../clsSMAudioRecorder/defaultXML.svelte')),
                            "UI": (await import('../clsSMAudioRecorder/AudioHelper.svelte')).itemHelper,
                        });
                    break;
                    case 41: 
                        resolve({
                            "auth": (await import('../clsSMDrawing/Drawing.svelte')).default,
                            "preview": (await import('../clsSMDrawing/DrawingPreview.svelte')).default,
                            "default": (await import('../clsSMDrawing/defaultXML.svelte')),
                            "UI": {},
                        });
                        break;
                    default:
                        resolve({
                                "auth": (await import('../helper/UnderDev.svelte')).default,
                                "preview": (await import('../helper/UnderDev.svelte')).default,
                                "default": "",
                                "UI": "",
                            });
                    break;
                }
            } else if (state.content_type == 'f') {
                switch (subtype) {
                    case 2:
                        resolve({
                                "auth": (await import('../helper/UnderDev.svelte')).default,
                                "preview": (await import('../helper/UnderDev.svelte')).default,
                                "default": "",
                                "UI": "",
                            });
                    break;
				    case 45:
                        resolve({
                                "auth": (await import('./components/VideoPlus.svelte')).default,
                                "preview": "",
                                "default": "",
                                "UI": "",
                            });
                    break;
				    case 52:
                        resolve({
                                "auth": (await import('./ObjectEditor.svelte')).default,
                                "preview": (await import('./ObjectEditor.svelte')).default,
                                "default": "",
                                "UI": "",
                            });
                    break;
				    default:
                        resolve({
                            "auth": (await import('../helper/UnderDev.svelte')).default,
                            "preview": (await import('../helper/UnderDev.svelte')).default,
                            "default": "",
                            "UI": "",
                        });
                    break;
			    }
            } else if (state.viewConfig.loadWebPages) {
                resolve({
                        "auth": (await import('./WebPages.svelte')).default,
                        "preview": false,
                        "default": "",
                        "UI": "",
                    });
            } else {
                resolve({
                        "auth": (await import('../helper/UnderDev.svelte')).default,
                        "preview": (await import('../helper/UnderDev.svelte')).default,
                        "default": "",
                        "UI": "",
                    });
            }        

        });
    }
</script>