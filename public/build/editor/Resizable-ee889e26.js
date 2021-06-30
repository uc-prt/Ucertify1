
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
window.isResizable = (window.isResizable) ? window.isResizable : false;
class Resizable {
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
            });
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
            });

        }
        
    }   
    
    getPosition (e, node) {
        let element_boundry = node.getBoundingClientRect();
        let containment_boundry = document.querySelector(this.container).getBoundingClientRect();
        let left = e.clientX, top = e.clientY;
        if (top > containment_boundry.bottom) {
            top = containment_boundry.bottom;
        }
        
        if (left > containment_boundry.right) {
            left = containment_boundry.right;
        }

        let x = left - element_boundry.left;
        let y = top - element_boundry.top;

        if (this.setLimit) {
            return this.setLimit(x,y)
        }
        return {x:x, y:y};
    }

}

export { Resizable as R };
//# sourceMappingURL=Resizable-ee889e26.js.map
