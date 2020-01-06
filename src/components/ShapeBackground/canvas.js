    // _updateBackground() {

    //     this._drawBackground();
    //     this.update = requestAnimationFrame(this._updateBackground);

    // }
    componentDidMount() {
      
        // this.ctx = this.canvasRef.current.getContext('2d');
        // this._resizeCanvas();
        // this._drawBackground();
        // this._updateBackground();

    }
    _resizeCanvas() {
        
        const canvas = this.canvasRef.current,
            background = this.backgroundRef.current,
            backgroundBCR = background.getBoundingClientRect();

        canvas.width = backgroundBCR.width
        canvas.height = backgroundBCR.height

    }
    _drawBackground() {

        const canvas = this.canvasRef.current,
            background = this.backgroundRef.current,
            backgroundBCR = background.getBoundingClientRect();

        const svgTemplate = `
            <svg height="${backgroundBCR.height}" width="${backgroundBCR.width}" xmlns="http://www.w3.org/2000/svg">
                <foreignObject x="0" y="0" width="${backgroundBCR.width}" height="${backgroundBCR.height}">
                    ${Array.from(document.head.querySelectorAll('style')).map(s => s.outerHTML).join('')}
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        ${background.outerHTML}
                    </div>
                </foreignObject>
            </svg>
        `.trim();
        
        const svgElem = new Blob([svgTemplate], {type: 'image/svg+xml;charset=utf-8'});

        // console.log(svgElem)

        this.backgroundImgURI = (window.URL || window.webkitURL || window).createObjectURL(svgElem);

// console.log(this.backgroundImgURI)

        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height)
            // this.ctx.scale(2, 2)
            this.ctx.drawImage(img, 0, 0);
            // this.ctx.setTransform(1, 0, 0, 1, 0, 0);

            (window.URL || window.webkitURL || window).revokeObjectURL(this.backgroundImgURI);
        }
        img.src = this.backgroundImgURI

    }
    
        // this._drawBackground = this._drawBackground.bind(this);
        // this._resizeCanvas = this._resizeCanvas.bind(this);
        // this._updateBackground = this._updateBackground.bind(this);
                {/* <canvas style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%',  }} ref={this.canvasRef}></canvas> */}
