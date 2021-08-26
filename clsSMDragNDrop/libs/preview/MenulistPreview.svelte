<!--
 *  File Name   : MenulistPreview.svelte
 *  Description : Responsible for MenulistPreview
 *  Author      : Ayush Srivastava
 *  Package     : Drag and Drop (preview)
 *  Last update : 20-Jan-2021
 *  Last Updated By : Ayush Srivastava
-->
<script>
    export let modules;
    let menulist_data = [];
    let menulist_preview = modules;
    let menuEvent = [];
    let correctSelect = "";
    $: if (modules) {
        if (Array.isArray(modules) == false) {
            menulist_preview = []
            menulist_preview[0] = modules;
        } else {
            menulist_preview = modules;
        }
        menulist_data = [];
        menulist_preview.map( function (data) {
            let row, col, matrix;
            let count = 0;
            let menulist_item = [];
            menuEvent = [];

            if (data.__text) {
                getClick(data.__text);
            }

            matrix = ((data._matrix) ? (data._matrix).split("x") : []);
            row = matrix[0];
            col = matrix[1];

            for (let row_loop = 1; row_loop <= row; row_loop++) {
                for (let col_loop = 1; col_loop <= col; col_loop++) {
                    menulist_item.push({
                        id: data._id + "_" + row_loop + "_" + col_loop,
                        classes: ((data._correctans && menuEvent[count]) ? "menu off menulist dndTest record" : "menu off menulist dndTest" ),
                        correctans: ((menuEvent[count])? "1"  : "0" ),
                        top: getTop(row_loop, row, data) + 'px',
                        left: getLeft(col_loop, col, data) + 'px',
                        height: getHeight(row, data) + 'px',
                        width: getWidth(col, data) + 'px',
                        click_event: (menuEvent[count]) ? menuEvent[count] : "",
                    })
                    count++;
                }
            }

            menulist_data = [
                ...menulist_data, {
                    top:data._top+"px",
                    left:data._left+"px",
                    height:data._height+"px",
                    width:data._width+"px",
                    menulist_item: menulist_item
                }
            ]
        });
    } else {
        menulist_data = [];
    }

	function getTop(rowCount, row, list) {
		let top = (((parseFloat(list._height) / parseFloat(row)) - 0) * (parseFloat(rowCount) - 1)) + ((parseFloat(rowCount) - 1) * 0) + (0 / 2);
		return top;
	}

	function getLeft(colCount, col, list) {
		let left = (((parseFloat(list._width) / parseFloat(col)) - 0) * (parseFloat(colCount) - 1)) + ((parseFloat(colCount) - 1) * 0) + (0 / 2);
		return left;
	}

	function getHeight(row, list) {
		let height = (( parseFloat(list._height) / parseFloat(row) ) - 0 );
		return height;
	}

	function getWidth(col ,list) {
		let width = (( parseFloat(list._width) / parseFloat(col) ) - 0 );
		return width;
	}

	function getClick(text) {
		let data = text.split("|");
		for (let i = 0; i < data.length ; i++) {
			let clck = data[i].match(/\(.*?\)/gi);
			if(clck) {
				menuEvent[i] = clck[0].replace('(','').replace(')','').replace(/"/g,'').replace(/'/g,'');
			} else {
				menuEvent[i] = "";
			}
		}
	}

    // @ayush : I don't find the function used for now will look it later on it
	function getCorrect(r,c,row,col,data) {
		correctSelect = ","+((data._correctans)?data._correctans.replace(" ",""):"")+",";
		let cans = "menu off dndTest menulist";
		if((row > 1) && (col <= 1)) {
			let srch1 = ","+r+",";
			if(correctSelect.indexOf(srch1) !== false) {
				cans = "menu off menulist dndTest record";
			}
		} else if ((row <= 1) && (col > 1)) {
			let srch2 = ","+c+",";
			if (correctSelect.indexOf(srch2) !== false) {
				cans = "menu off menulist dndTest record";
			}
		} else if ((row > 1) && (col > 1)) {
			let srch3 = r+"x"+c+",";
			if (correctSelect.indexOf(srch3) !== false) {
				cans = "menu off menulist dndTest record";
			}
		} else {
			let srch4 = ","+r+",";
			if (correctSelect.indexOf(srch4) !== false) {
				cans = "menu off menulist dndTest record";
			}
		}
		return cans;
	}
</script>

<div>
    {#if menulist_data && menulist_data.length > 0}
        {#each menulist_data as data, index}
            <div
                key={index}
                class="drag-resize"
                style="
                    position: absolute;
                    top:{data.top};
                    left:{data.left};
                    height:{data.height};
                    width:{data.width};
                    z-index: 1;
                "
                data-correctans=""
                data-userans=""
                data-defaultans=""
            >
                {#if data.menulist_item.length > 0}
                    {#each data.menulist_item as menu_data, subindex}
                        <span
                            key={"menu_" + subindex}
                            id={menu_data.id}
                            class={menu_data.classes}
                            data-correctans={menu_data.correctans}
                            data-defaultans=""
                            data-userans=""
                            on:click="{()=> window.setStep(menu_data.click_event)}"
                            style="
                                position: absolute;
                                top:{menu_data.top};
                                left:{menu_data.left};
                                height:{menu_data.height};
                                width:{menu_data.width};
                            "
                        >
                            <!--@TO DO : NEED TO ADD ONCLICK EVENT FOR SETSTEP --->
                        </span>
                    {/each}
                {/if}
            </div>
        {/each}
    {/if}
</div>