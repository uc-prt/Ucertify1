window.isDraggableAdded=!!window.isDraggableAdded&&window.isDraggableAdded,window.isDraggable=!!window.isDraggable&&window.isDraggable;class t{constructor(t,i,s,e){"object"==typeof t?(this.container=t.containment,this.drag=t.classes,this.ignore=t.ignore,this.initDraggable()):(this.drag=i,this.drop=s,this.container=t,this.initDnd()),this.lastPosition=[0,0],window.draglist=e,this.isStart=!1,this.isMoving=!1,this.node=null,this.target=null,this.prenode=null}checkPosition(t,i){let s=document.querySelector(this.container).getBoundingClientRect(),e=t.clientX-s.left,o=t.clientY-s.top,n={width:i.offsetWidth/2,height:i.offsetHeight/2};return e<n.width?e=n.width:e>s.width-n.width&&(e=s.width-n.width),o<n.height?o=n.height:o>s.height-n.height&&(o=s.height-n.height),e<0&&(e=n.width+10),o<0&&(o=n.height+10),[e,o]}binddndEvents(t,i){t&&(AI.listen("body","mousedown",t,((t,s)=>{if(this.changeContainment&&(this.container=this.changeContainment(t)),!t.classList.contains("uc_drag_disable")&&!t.classList.contains("lab_disable")&&(i&&AI.selectAll(i).forEach((t=>{"2"==t.getAttribute("droping")?t.style.zIndex=5:t.style.zIndex=2})),this.prenode=t,this.isStart=!1,this.node=null,this.onDragStart)){let t=this.onDragStart(s,this.prenode);this.node=t,this.lastPosition=this.checkPosition(s,this.prenode),t.style.top=this.lastPosition[1]-this.prenode.offsetHeight/2+"px",t.style.left=this.lastPosition[0]-this.prenode.offsetWidth/2+"px",document.querySelector(this.container).appendChild(t),this.isStart=!0}})),AI.listen("body","dragstart",t,((t,i)=>{i.preventDefault()})),AI.listenAll("body","mousemove",(t=>{this.isStart&&this.node&&(this.isMoving=!0,this.lastPosition=this.checkPosition(t,this.node),this.node.style.top=this.lastPosition[1]-this.node.offsetHeight/2+"px",this.node.style.left=this.lastPosition[0]-this.node.offsetWidth/2+"px",this.onDrag&&this.onDrag(t,{node:this.node,top:this.lastPosition[1]-this.node.offsetHeight/2,left:this.lastPosition[0]-this.node.offsetWidth/2}))})),AI.listenAll("body","mouseup",(()=>{if(this.isStart&&this.node&&this.isMoving){if(this.isMoving=!1,this.isStart=!1,this.target)if("1"==this.target.getAttribute("droping")&&"2"==this.prenode.getAttribute("droping"))this.onDropChange(this.prenode,this.target,window.draglist[this.prenode.id][0]),this.saveDetail(window.draglist[this.prenode.id][0],this.target),delete window.draglist[this.prenode.id];else if("2"==this.target.getAttribute("droping")&&"2"==this.prenode.getAttribute("droping")){this.onDropInterchange(this.prenode,this.target,window.draglist[this.prenode.id][0],window.draglist[this.target.id][0]);let t=Object.assign({},window.draglist);this.saveDetail(t[this.prenode.id][0],this.target),this.saveDetail(t[this.target.id][0],this.prenode)}else"2"==this.target.getAttribute("droping")&&"1"==this.prenode.getAttribute("draging")?(this.onDragInterchange(this.prenode,this.target,window.draglist[this.target.id][0]),this.saveDetail(this.prenode,this.target)):this.prenode.id!=this.target.id?(this.saveDetail(this.prenode,this.target),this.onDrop(this.prenode,this.target)):this.prenode.id==this.target.id&&(this.target.classList.remove("drop-hover"),this.target.style.opacity="");else if("2"==this.node.getAttribute("draging")){let t=window.draglist[this.prenode.id];this.onRemove(this.prenode,t[0]),delete window.draglist[this.prenode.id]}else this.isRevert&&this.isRevert();this.node.remove()}else!this.isMoving&&this.node&&this.node.remove();i&&AI.selectAll(i).forEach((t=>{t.style.zIndex=""})),this.node=null,this.target=null,this.prenode=null}))),i&&(AI.listen("body","mousemove",i,(t=>{this.isStart&&this.node&&this.isMoving&&(this.target=t,this.target.classList.add("drop-hover"),this.target.style.opacity="0.7",this.onOver&&this.onOver(t))})),AI.listen("body","mouseover",i,(t=>{this.target=t,this.target.classList.add("drop-hover")})),AI.listen("body","mouseout",i,(()=>{this.isStart&&this.node&&this.isMoving&&this.target&&(this.onOut&&this.onOut(this.target),this.target.style.opacity="1",this.target=null),null==this.target&&null==this.target||this.target.classList.remove("drop-hover")})))}bindDraggable(t){AI.listen("body","mousedown",t,((t,i)=>{if(this.changeContainment&&(this.container=this.changeContainment(t)),this.ignore&&Array.isArray(this.ignore)&&i.target){let t=!1;for(let s=0;s<this.ignore.length;s++)if(i.target.closest(this.ignore[s])||i.target.classList.contains(this.ignore[s])){t=!0;break}if(t)return!1}this.isStart=!0,this.node=t,this.lastPosition=this.checkPosition(i,t),t.style.top=this.lastPosition[1]-t.offsetHeight/2+"px",t.style.left=this.lastPosition[0]-t.offsetWidth/2+"px",this.onDragStart&&this.onDragStart(i,t)})),AI.listen("body","dragstart",t,((t,i)=>{i.preventDefault()})),AI.listenAll("body","mousemove",(t=>{this.isStart&&this.node&&(this.isMoving=!0,this.lastPosition=this.checkPosition(t,this.node),this.node.style.top=this.lastPosition[1]-this.node.offsetHeight/2+"px",this.node.style.left=this.lastPosition[0]-this.node.offsetWidth/2+"px",this.onDrag&&this.onDrag(t,{top:this.lastPosition[1]-this.node.offsetHeight/2,left:this.lastPosition[0]-this.node.offsetWidth/2}))})),AI.listenAll("body","mouseup",(t=>{this.isStart&&this.node&&this.isMoving&&(this.isMoving=!1,this.isStart=!1,this.lastPosition=this.checkPosition(t,this.node),this.node.style.top=this.lastPosition[1]-this.node.offsetHeight/2+"px",this.node.style.left=this.lastPosition[0]-this.node.offsetWidth/2+"px",this.onDragStop&&this.onDragStop(t,{top:this.lastPosition[1]-this.node.offsetHeight/2,left:this.lastPosition[0]-this.node.offsetWidth/2},this.node)),this.node=null}))}initDnd(){window.isDraggableAdded||(this.binddndEvents(this.drag,this.drop),window.isDraggableAdded=!0)}initDraggable(){window.isDraggable||(this.bindDraggable(this.drag),window.isDraggable=!0)}saveDetail(t,i){window.draglist[i.id]=[t,i],window.draglist=window.draglist}onDrop(t,i){let s=t.cloneNode(!0);i.style.backgroundColor=s.getAttribute("data-bgcolor"),i.setAttribute("draging",2),i.setAttribute("droping",2),"1"!=t.getAttribute("data-multi_drag")&&(t.classList.add("uc_drag_disable"),t.style.setProperty("cursor","no-drop","important"),t.style.setProperty("opacity","0.5","important")),i.classList.remove("drop-hover"),i.style.opacity="1",AI.find(i,"p").innerText=AI.find(s,"p").innerText}onRemove(t,i){t.removeAttribute("draging"),t.style.backgroundColor=t.getAttribute("data-bgcolor"),t.setAttribute("droping",1),i&&(i.classList.remove("uc_drag_disable"),i.style.cursor="",i.style.opacity=""),t.classList.remove("drop-hover"),t.style.opacity="1",AI.find(t,"p").innerText=t.getAttribute("data-caption")}onDropChange(t,i,s){this.onDrop(s,i),this.onRemove(t)}onDropInterchange(t,i,s,e){this.onDrop(s,i),this.onDrop(e,t)}onDragInterchange(t,i,s){this.onRemove(i,s),this.onDrop(t,i)}}export{t as D};
//# sourceMappingURL=Draggable-fbfbfef6.js.map
