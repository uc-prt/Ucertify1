

"use strict";
window.isResizable = (window.isResizable) ? window.isResizable : false;
export default class Resizable {
    constructor (container, elements) {
        this.container = container;
        this.targetResize = null;
        this.elmsResizable = document.querySelectorAll(elements);
        this.started = false;
        this.init();
    }

    init() {

        [] .forEach.call (this.elmsResizable, (el) => {
            if (el.querySelector('.resizer') == null  || (el.id == 'dndmain' && document.querySelector('#dndmain > .resizer') == null)) { 
                let resizer = document.createElement('div');
                resizer.className ='resizer icomoon-resize';
                el.appendChild (resizer);
            }
        });

        if (!window.isResizable) {
            window.isResizable = true;
            AI.listen('body', 'mouseleave', this.container, () => {
                this.targetResize = null;
            })
            AI.listen('body', 'mousedown', '.resizer', (current) => {
                this.targetResize = current.parentNode;
                this.started = true;
                this.onStart && this.onStart(current);
            });
            AI.listenAll('body', 'mousemove', (event) => {
                if (this.targetResize == null || !this.started) {return;}
                let position = this.getPosition(event, this.targetResize);
                this.targetResize.style.width = position.x +'px';
                this.targetResize.style.height = position.y +'px';
            });

            AI.listenAll('body', 'mouseup', (event) => {
                if (this.started) {
                    this.started = false;
                    this.onStop && this.onStop(event, this.targetResize);
                    this.targetResize = null;
                }
            })

        }
        
    }   
    
    getPosition (e, node) {
        let rect = node.getBoundingClientRect();
        const x = e.x - rect.x;
        const y = e.y - rect.y;
        if (this.setLimit) {
            return this.setLimit(x,y)
        }
        return {x, y};
    }

}