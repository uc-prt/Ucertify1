"use strict";
window.isDraggableAdded = (window.isDraggableAdded) ? window.isDraggableAdded : false;
window.isDraggable = (window.isDraggable) ? window.isDraggable :false;

export default class Draggable {
    /* 
        DragNDrop class fire following events 
            onDragStart(event, element) // when dragging is just started
            onDrag(event, ui) // when element is dragging
            onDrop(source, target) // when element is dropped
            onRemove(source, target) // whene drop element is removed
            onOver(element) // when draggable is over the doppable area
            onOut(element) // when draggble leave the droppable area
            isRevert() // when element is started dragging but not droppped at proper place
            changeContainment(element) // if defined set the return element as container

        Dragging:
            onDragStart(event, element) // when dragging is just started
            onDrag(event, ui)  // when element is dragging
            onDragStop(event, position , ui) // when element is dropped
            changeContainment(element) // if defined set the return element as container


    */
    constructor(container, drag, drop, draglist) {
        if (typeof (container) == 'object') {
            this.container = container.containment;
            this.drag =  container.classes;
            this.ignore = container.ignore;
            this.initDraggable();
        } else {
            this.drag = drag;
            this.drop = drop;
            this.container = container;
            this.initDnd();
        }
        this.lastPosition = [0, 0];
        window.draglist = draglist;
        this.isStart = false;
        this.isMoving = false;
        this.node = null;
        this.target = null;
        this.prenode = null;
    }

    checkPosition(event, node) {
        let boundry = document.querySelector(this.container).getBoundingClientRect()
        let x = event.clientX - boundry.left;
        let y = event.clientY - boundry.top;
        let dimension = {
            width : node.offsetWidth / 2,
            height: node.offsetHeight / 2,
        }
        if (x < dimension.width) {
            x = dimension.width;
        } else if (x > (boundry.width -  dimension.width) ) {
            x = (boundry.width -  dimension.width);
        } 

        if (y < dimension.height) {
            y = dimension.height;
        } else if (y > (boundry.height -  dimension.height)) {
            y = (boundry.height -  dimension.height);
        }

        if (x < 0) {
            x = dimension.width + 10;
        } 
        if (y < 0) {
            y = dimension.height + 10;
        }

        return [x, y];
    };

    binddndEvents(drag, drop) {
        if (drag) {
            AI.listen('body', 'mousedown', drag, (current, event) => {
                if (this.changeContainment) {
                    this.container = this.changeContainment(current);
                }
                if (!(current.classList.contains('uc_drag_disable') || current.classList.contains('lab_disable') )) {
                    if (drop) {
                        AI.selectAll(drop).forEach(element => {
                            if (element.getAttribute('droping') == '2') {
                                element.style.zIndex = 5;
                            } else {
                                element.style.zIndex = 2;
                            }
                        })
                    }

                    this.prenode = current;
                    this.isStart = false;
                    this.node = null;

                    if (this.onDragStart) {
                        let clone_node = this.onDragStart(event, this.prenode);
                        this.node = clone_node;
                        this.lastPosition = this.checkPosition(event, this.prenode)
                        clone_node.style.top = this.lastPosition[1] - this.prenode.offsetHeight / 2 + 'px';
                        clone_node.style.left = this.lastPosition[0]  - this.prenode.offsetWidth / 2 + 'px';
                        document.querySelector(this.container).appendChild(clone_node);
                        this.isStart = true;
                    }
                }
            });

            AI.listen('body', 'dragstart', drag, (current, event) => {
                event.preventDefault();
            });

            AI.listenAll('body', 'mousemove', (event) => {
                if (this.isStart && this.node) {
                    this.isMoving = true;
                    this.lastPosition = this.checkPosition(event, this.node)
                    this.node.style.top = this.lastPosition[1] - this.node.offsetHeight / 2 + 'px';
                    this.node.style.left = this.lastPosition[0]  - this.node.offsetWidth / 2 + 'px';
                    this.onDrag && this.onDrag(event, {node: this.node, top: (this.lastPosition[1] - this.node.offsetHeight / 2), left : (this.lastPosition[0]  - this.node.offsetWidth / 2 )})
                }
            });

            AI.listenAll('body', 'mouseup', () => {
                if (this.isStart && this.node && this.isMoving) {
                    this.isMoving = false;
                    this.isStart = false;
                    if (this.target) {
                        if (this.target.getAttribute('droping') == '1' && this.prenode.getAttribute('droping') == '2') {
                            this.onDropChange(this.prenode, this.target, window.draglist[this.prenode.id][0]);
                            this.saveDetail(window.draglist[this.prenode.id][0], this.target);
                            delete window.draglist[this.prenode.id];
                        } else if (this.target.getAttribute('droping') == '2' && this.prenode.getAttribute('droping') == '2') {
                            this.onDropInterchange(this.prenode, this.target, window.draglist[this.prenode.id][0], window.draglist[this.target.id][0]);
                            let clone_draglist = Object.assign({}, window.draglist);
                            this.saveDetail(clone_draglist[this.prenode.id][0], this.target);
                            this.saveDetail(clone_draglist[this.target.id][0], this.prenode);
                        } else if (this.target.getAttribute('droping') == '2' && this.prenode.getAttribute('draging') == '1') {
                            this.onDragInterchange(this.prenode, this.target, window.draglist[this.target.id][0]);
                            this.saveDetail(this.prenode, this.target)
                        } else if (this.prenode.id != this.target.id) { //  if data is drop from source to target
                            this.saveDetail(this.prenode, this.target)
                            this.onDrop(this.prenode, this.target)
                        } else if (this.prenode.id == this.target.id) { // if both the drop and drag are same target
                            this.target.classList.remove('drop-hover');
                            this.target.style.opacity = '';
                        }
                    } else if (this.node.getAttribute('draging') == '2') { // when element is remove from target -> source 
                        let target =  window.draglist[this.prenode.id];
                        this.onRemove(this.prenode, target[0])
                        delete window.draglist[this.prenode.id];
                    } else {
                        this.isRevert && this.isRevert();
                    }

                    this.node.remove();
                } else if (!this.isMoving && this.node) {
                    this.node.remove();
                }
        
                if (drop) {
                    AI.selectAll(drop).forEach(element => {
                        element.style.zIndex = '';
                        // element.style.position = '';
                    });
                }
        
                this.node = null;
                this.target = null;
                this.prenode = null;
            });
        }
        if (drop) {
            AI.listen('body', 'mousemove', drop, (current) => {
                if (this.isStart && this.node && this.isMoving) {
                    this.target = current;
                    this.target.classList.add('drop-hover');
                    this.target.style.opacity = '0.7';
                    this.onOver && this.onOver(current);
                }
            });
            
            AI.listen('body', 'mouseover', drop, (current) => {
                this.target = current;
                this.target.classList.add('drop-hover');
            });

            AI.listen('body','mouseout', drop, () => {
                if (this.isStart && this.node && this.isMoving && this.target) {
                    this.onOut && this.onOut(this.target);
                    this.target.style.opacity = '1';
                    this.target = null;
                }
                this.target.classList.remove('drop-hover');
            });
        }
    };

    bindDraggable(drag) {
        AI.listen('body', 'mousedown', drag, (current, event) => {
            if (this.changeContainment) {
                this.container = this.changeContainment(current);
            }

            if (this.ignore && Array.isArray(this.ignore) && event.target) {
                let revert = false;
                for (let index = 0; index < this.ignore.length; index++) {
                    if (event.target.closest(this.ignore[index]) || event.target.classList.contains(this.ignore[index])) {
                        revert = true;
                        break;
                    }
                }
                if (revert) {
                    return false;
                }
            }
            this.isStart = true;
            this.node = current;
            this.lastPosition = this.checkPosition(event, current)
            current.style.top = this.lastPosition[1] - current.offsetHeight / 2 + 'px';
            current.style.left = this.lastPosition[0]  - current.offsetWidth / 2 + 'px';
            this.onDragStart && this.onDragStart(event, current);
        });

        AI.listen('body', 'dragstart', drag, (current, event) => {
            event.preventDefault();
        });

        AI.listenAll('body', 'mousemove', (event) => {
            if (this.isStart && this.node) {
                this.isMoving = true;
                this.lastPosition = this.checkPosition(event, this.node)
                this.node.style.top = this.lastPosition[1] - this.node.offsetHeight / 2 + 'px';
                this.node.style.left = this.lastPosition[0]  - this.node.offsetWidth / 2 + 'px';
                this.onDrag && this.onDrag(event, {top: (this.lastPosition[1] - this.node.offsetHeight / 2), left : (this.lastPosition[0]  - this.node.offsetWidth / 2 )})
            }
        });

        AI.listenAll('body', 'mouseup', (event) => {
            if (this.isStart && this.node && this.isMoving) {
                this.isMoving = false;
                this.isStart = false;
                this.lastPosition = this.checkPosition(event, this.node)
                this.node.style.top = this.lastPosition[1] - this.node.offsetHeight / 2 + 'px';
                this.node.style.left = this.lastPosition[0]  - this.node.offsetWidth / 2 + 'px';
                this.onDragStop && this.onDragStop(event, {top: (this.lastPosition[1] - this.node.offsetHeight / 2), left : (this.lastPosition[0]  - this.node.offsetWidth / 2 )}, this.node)
            }
            this.node = null;
        });
    }

    initDnd() {
        if (!window.isDraggableAdded) {
            this.binddndEvents(this.drag, this.drop);
            window.isDraggableAdded = true;
        }
    };

    initDraggable() {
        if (!window.isDraggable) {
            this.bindDraggable(this.drag);
            window.isDraggable = true;
        }
    };

    saveDetail(source, target) {
        window.draglist[target.id] = [source, target];
        window.draglist = window.draglist;
    };

    onDrop(source, target) {
        let copied = source.cloneNode(true);
        target.style.backgroundColor = copied.getAttribute('data-bgcolor');
        target.setAttribute('draging', 2);
        target.setAttribute('droping', 2); 
    
        // for disabling the dragable
        if (! (source.getAttribute("data-multi_drag") == "1") ) {
            source.classList.add('uc_drag_disable');
            source.style.setProperty("cursor", "no-drop", "important");
            source.style.setProperty("opacity", "0.5", "important");
        }
    
        target.classList.remove('drop-hover');
        target.style.opacity = '1';
        AI.find(target, 'p').innerText = AI.find(copied, 'p').innerText;
    } 
    
    onRemove(source, target) {
    
        source.removeAttribute('draging');
        source.style.backgroundColor = source.getAttribute('data-bgcolor');
        source.setAttribute('droping', 1);
    
        // for disabling the dragable
        if (target) {
            target.classList.remove('uc_drag_disable');
            target.style.cursor = '';
            target.style.opacity = '';
        }
    
        source.classList.remove('drop-hover');
        source.style.opacity = '1';
        AI.find(source, 'p').innerText = source.getAttribute('data-caption');
    } 
    
    onDropChange(source, target, originalSource) {
        this.onDrop(originalSource, target);
        this.onRemove(source);
    }
    
    onDropInterchange(source, target, originalSource, originalTarget) {
        this.onDrop(originalSource, target);
        this.onDrop(originalTarget, source);
    }
    
    onDragInterchange(source, target, originalSource) {
        this.onRemove(target, originalSource);
        this.onDrop(source, target);
    }
}

