import App from './AlignMatchPreview.svelte';

const defXMl = `<smxml type="35" name="AlignMatch" maxwidth="500">
				<!--[CDATA[{
					"category":{
						"categories":[
							{
								"id":"category_1",
								"text":"State"								
							},
							{
								"id":"category_2",
								"text":"Capital"								
							}
						]
					},
					"item":{
						"items":[
							{
								"imageurl":"",
								"imagealt":"",
								"id":"item_1",
								"label":"Uttar Pradesh",
								"category":"category_1",
								"tags":"Tags 1"
							},
							{
								"imageurl":"1492581789/1_1492581789.jpg",
								"imagealt":"Lucknow",
								"id":"item_2",
								"label":"Lucknow",
								"category":"category_2",
								"tags":"Tags 1"
							},
							{
								"imageurl":"1492581901/1_1492581901.jpg",
								"imagealt":"Maharashtra",
								"id":"item_4",
								"label":"Maharashtra",
								"category":"category_1",
								"tags":"Tags 2"
							},
							{
								"imageurl":"1492581951/1_1492581951.jpg",
								"imagealt":"Mumbai",
								"id":"item_5",
								"label":"Mumbai",
								"category":"category_2",
								"tags":"Tags 2"
							},
							{
								"imageurl":"1492582059/1_1492582059.jpg",
								"imagealt":"Madhya Pradesh",
								"id":"item_7",
								"label":"Madhya Pradesh",
								"category":"category_1",
								"tags":"Tags 3"	
							},
							{
								"imageurl":"",
								"imagealt":"",
								"id":"item_8",
								"label":"Bhopal",
								"category":"category_2",
								"tags":"Tags 3"
							}																						
						]
					},
					"settings": {
						"assignmentTitle":"State Info Challenge",
						"assignmentSubtitle":"How well do you know the Indian states?",
						"introText":"In this challenge, you will put your knowledge of Indian state to the ultimate test. ",
						"beginButtonText":"begin",
						"howToPlayTitle":"Game: Align",
						"howToPlayText":"Match each State with their Capital and Monuments.",
						"resultsTitle":"Results",
						"outroTitle":"Good job!",
						"outroText":"You did it! \\n\\n Now result time.",
						"outroImage":"1491889706/1_1491889706.jpg",
						"outroImageDescription":"",
						"requiredMatches":4,
						"matchButtonText":"Match",
						"showPoints":true,
						"showAccuracy":true,
						"showMatches":true,
						"timeLimit":0,
						"correctValue":50,
						"incorrectValue":-25
					}
				}
				]]-->
				</smxml>`;

const app = new App({
	target: document.getElementById(window.moduleContainer) || document.body,
	props: {
		xml: window.QXML || defXMl,
		uxml: window.uaXML,
		ansStatus: 0,
		isReview: window.isReviewMode || false,
	}
});

export default app;