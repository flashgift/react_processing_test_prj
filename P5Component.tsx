import React, { useEffect, useCallback, useState, WheelEvent } from 'react'
import p5 from 'p5'




type P5ComponentProps = {
    name:string
    gridDraw:boolean
}

class WrappedP5 {

    gridDraw: boolean = true

    sketch : (...args: any[]) => any
    nodeId : string

    onWheelCallback : (e:WheelEvent<HTMLDivElement>) => void = (e) => {console.log('대체되엇다')}
    onWheel : (e:WheelEvent<HTMLDivElement>) => void = (e) => {this.onWheelCallback(e)}

    p5Instance : p5 | undefined
    

    

    constructor(sketch:(...args:any[]) => any, nodeId:string)
    {
        this.sketch = sketch
        this.nodeId = nodeId
    }

    createP5()
    {
        console.log('p5 생성')
        this.p5Instance = new p5(this.sketch, document.getElementById(this.nodeId) as HTMLElement)
    }

    removeP5()
    {
        if(this.p5Instance != undefined) { 
            console.log('p5 제거')
            this.p5Instance.remove()
        }
            
    }
}

function P5Component( { name , gridDraw } : P5ComponentProps ) {

    const s = (sketch:p5) => { 

        let scale:number = 12;
        let graphicRenderer:p5;

        wp5.onWheelCallback = (e) => {
            if(e.deltaY > 0) {
                if(scale < 50)
                    scale ++
            }
            else {
                if(scale > 1)
                    scale --
            }
        }

        const SetGrid = (gridCount:number) => {
          let i:number = 0, j:number = 0;
          sketch.strokeWeight(0.7);
      
          if(true) {
            for(j = 0; j < graphicRenderer.width/gridCount; j++) {
              sketch.stroke(0, 40)
              for(i = 1;i < gridCount; i++) {
                sketch.line(0.5 + (i + j * gridCount) * scale, 0.5, 0.5 + (i + j * gridCount) * scale, 0.5 + graphicRenderer.height * scale);
              }
              sketch.stroke(0, 255)
              sketch.line(0.5 + (gridCount + j * gridCount) * scale, 0.5, 0.5 + (gridCount + j * gridCount) * scale, 0.5 + graphicRenderer.height * scale);
            }
        
            
            for(j = 0; j < graphicRenderer.height/gridCount; j++) {
              sketch.stroke(0, 40)
              for(i = 1;i < gridCount; i++) {
                sketch.line(0.5, 0.5 + (i + j * gridCount) * scale, 0.5 + graphicRenderer.width * scale, 0.5 + (i + j * gridCount) * scale);
              }
              sketch.stroke(0, 255)
              sketch.line(0.5, 0.5 + (gridCount + j * gridCount) * scale, 0.5 + graphicRenderer.width * scale, 0.5 + (gridCount + j * gridCount) * scale);
            }
          }
          
          
          sketch.fill(0,0,0,0)
          sketch.rect(0.5, 0.5, graphicRenderer.width * scale, graphicRenderer.height * scale)
        }
      
        sketch.setup = () => {
            sketch.createCanvas(1024, 768, 'p2d')
            graphicRenderer = sketch.createGraphics(128, 128, 'p2d')
            sketch.background(0, 155, 55)
            sketch.noSmooth()
            graphicRenderer.noSmooth()
            graphicRenderer.strokeWeight(1)
            graphicRenderer.stroke(100, 255)
        }
        
        sketch.draw = () => {
            sketch.background(255, 255, 255);
        
            sketch.image(graphicRenderer as unknown as p5.Image, 0.5, 0.5, graphicRenderer.width * scale, graphicRenderer.height * scale)

            if(wp5.gridDraw)
                SetGrid(8)
        }
        
        sketch.mouseDragged = () => {
            let mx:number, my:number;
        
            if(sketch.mouseX < 0)
                return
            else if(sketch.mouseX > graphicRenderer.width * scale)
                return
            else
                mx = sketch.mouseX;
        
            if(sketch.mouseY < 0)
                return
            else if(sketch.mouseY > graphicRenderer.height * scale)
                return
            else
                my = sketch.mouseY;
        
            graphicRenderer.loadPixels()
            switch(sketch.mouseButton){
                case 'right':
                graphicRenderer.set(sketch.int(mx / scale), sketch.int(my / scale), 255)
                break
                case 'left':
                graphicRenderer.set(sketch.int(mx / scale), sketch.int(my / scale), 0)
                break
            }
            graphicRenderer.updatePixels()
        }
        
        sketch.mousePressed = sketch.mouseDragged
    }

    const [wp5, SetWp5] = useState<WrappedP5>(new WrappedP5(s, 'p5Renderer'))

    wp5.gridDraw = gridDraw

    useEffect(() => {
            wp5.createP5()
        return () => {
            wp5.removeP5()
        }
    }, []); 

    return (<div id='p5Renderer' onWheel={wp5.onWheel}>
           </div>);
}


export default P5Component
