import React, { useEffect, useState, useRef } from "react";
import styles from "./colorPicker.module.css";
import Color from "./Color";
import Modal from "./Modal";
import FeedbackForm from "./FeedbackForm";


/**
 * ColorPicker Component
 * Allows users to pick colors from an image, view a threshold color, and see selected colors.
 */
const ColorPicker = () => {
  // State for the selected image
  const [image, setImage] = useState(null);
  // State for the threshold color
  const [threshold, setThreshold] = useState(null);
  // State for the selected colors
  const [colors, setColors] = useState([]);
  // Reference to the canvas element
  const canvasRef = useRef(null);
  // State for the sampling size used to calculate average color
  const [samplingSize, setSamplingSize] = useState(5);
  // State for the magnification factor used for hovering effect
  const [magnificationFactor, setMagnificationFactor] = useState(10);

  // State for the modal to open and close
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formstate,setFormstate]=useState(false);
  // Track the magnified canvas
  let magnifiedCanvas = null;

  /**
   * Calculates the average color from the given imageData.
   * @param {ImageData} imageData - The image data from which to calculate the average color.
   * @returns {string} - The average color in RGB format.
   */
  const calculateAverageColor = (imageData) => {
    const pixel = imageData.data.slice(0, 3);
    return `rgb(${pixel.join(',')})`;
  };

  /**
   * Handles file input change and sets the selected image.
   * @param {Object} e - The event object representing the file input change.
   */
  const handleFileInput = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  /**
   * Handles canvas click event and calculates the average color of the selected area.
   * Adds the color to the threshold or selected colors based on conditions.
   * @param {Object} e - The event object representing the canvas click.
   */
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const imageData = context?.getImageData(
      x - Math.floor(samplingSize / 2),
      y - Math.floor(samplingSize / 2),
      samplingSize,
      samplingSize
    );

    let avgRed = 0;
    let avgGreen = 0;
    let avgBlue = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      avgRed += imageData.data[i];
      avgGreen += imageData.data[i + 1];
      avgBlue += imageData.data[i + 2];
    }

    avgRed /= samplingSize * samplingSize;
    avgGreen /= samplingSize * samplingSize;
    avgBlue /= samplingSize * samplingSize;

    !threshold && setThreshold({r:Math.round(avgRed),g:Math.round(avgGreen),b:Math.round(avgBlue)});

    if(threshold && colors.length >= 100) {
      alert("Only 10 selections can be made!");
      return;
    }

    threshold && setColors(prev => [...prev, { r: Math.round(avgRed), g: Math.round(avgGreen), b: Math.round(avgBlue) }]);
    
    if (magnifiedCanvas) {
      document.body.removeChild(magnifiedCanvas);
      magnifiedCanvas = null;
    }
  };

  /**
   * Handles canvas hover event and displays a magnified view of the selected area.
   * @param {Object} e - The event object representing the canvas hover.
   */
  const handleCanvasHover = (e) => {
    const canvas = canvasRef.current;
    canvas.style.cursor = 'pointer';

    if (magnifiedCanvas) {
      document.body.removeChild(magnifiedCanvas);
      magnifiedCanvas = null;
    }

    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(
      Math.round(x - Math.floor(samplingSize / 2)),
      Math.round(y - Math.floor(samplingSize / 2)),
      samplingSize,
      samplingSize
    );

    magnifiedCanvas = document.createElement('canvas');
    magnifiedCanvas.width = (samplingSize * magnificationFactor);
    magnifiedCanvas.height = (samplingSize * magnificationFactor);
    const magnifiedContext = magnifiedCanvas.getContext('2d');

    magnifiedContext.drawImage(
      canvas,
      Math.round(x - Math.floor(samplingSize / 2)),
      Math.round(y - Math.floor(samplingSize / 2)),
      samplingSize,
      samplingSize,
      0,
      0,
      samplingSize * magnificationFactor,
      samplingSize * magnificationFactor
    );

    document.body.appendChild(magnifiedCanvas);
    magnifiedCanvas.attributes.id='magni';
    magnifiedCanvas.style.position = 'absolute';
    magnifiedCanvas.style.left = e.pageX + 10 + 'px';
    magnifiedCanvas.style.top = e.pageY + 'px';
    magnifiedCanvas.style.border = '2px solid red';
  };

  /**
   * Handles canvas leave event and removes the magnified canvas.
   */
  const handleCanvasLeave = () => {
    const canvas = canvasRef.current;
    canvas.style.cursor = 'default';

    if (magnifiedCanvas) {
      document.body.removeChild(magnifiedCanvas);
      magnifiedCanvas = null;
    }
  };

  /**
   * Effect hook to handle image loading and resizing based on the parent container size.
   */
  useEffect(() => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext('2d');

    /**
     * Handles resizing of the canvas based on the parent container size.
     */
    const handleResize = () => {
      if (!image) {
        setColors([]);
        return;
      }

      const img = new Image();
      img.src = image;

      const parentWidth = canvas.parentElement.clientWidth;
      const canvasWidth = 0.8 * parentWidth; // Set to 80% of parent width
      const scale = canvasWidth / img.width;

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      canvas.width = drawWidth;
      canvas.height = drawHeight;

      context?.clearRect(0, 0, canvas.width, canvas.height);
      context?.drawImage(img, 0, 0, drawWidth, drawHeight);
    };

    /**
     * Loads the image and initializes resizing.
     */
    const loadImage = () => {
      if (image) {
        const img = new Image();
        img.src = image;

        img.onload = () => {
          handleResize();
        };
      }
    };

    handleResize();
    loadImage();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [image]);

  /**
   * Calculates brightness based on the given color.
   * @param {Object} color - The color object containing RGB values.
   * @returns {number} - The brightness value ranging from 0 to 1.
   */
  const calculateBrightness = (color) => {
    const r = color?.r;
    const g = color?.g;
    const b = color?.b;

    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    return 1 - brightness.toFixed(2);
  };

  function printPDF() {
    var WinPrint = window.open('', '');
  
    // Create an HTML string representing the Print component
    var printableContent = `
      <html>
        <head>
          <title>ColorValue</title>
          <style>
          body{
            width:100%;
            height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;
            margin:0;
            padding:1rem;
            box-sizing:border-box;
          }
          .container{
            width:100%;
            display:flex;
            justify-content:center;
            align-items:center;
            gap:1rem;
            flex-wrap:wrap;
          }
          .selectedcolorinfo{
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: max-content;
            gap: 1rem;
            background-color: #46495e;
            height: 100%;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
            padding: .1rem .5rem;
          }
          .selectedcolorinfo-top{
            display: flex;
            flex-direction: column;
            gap: .5rem;
          }
          .selectedColor {
            width: 45%;
            height: 30px;
            font-size: .7rem;
            margin-bottom: 1rem;
          
            border: none;
            border-radius: 0.1rem;
          
            display: flex;
            justify-content: flex-end;
          
            transition: 0.2s background;
          
            display: grid;
            place-items: center;
            color: white;
            font-weight: bolder;
            outline: #000000;
          
            box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;}
            
          
            .threshold{
              width:45%;
            }
          </style>
        </head>
        <body>

        <h2>Threshold</h2>
        <div class=" selectedColor threshold" style='background:rgb(${threshold.r}, ${threshold.g}, ${threshold.b})'>
              <div class="selectedcolorinfo" >
                <div class="selectedcolorinfo-top">
                  <div>
                    ${calculateBrightness(threshold).toFixed(2)} 
                    
                  </div>
                </div>
              </div>
              </div>

              <h2>selected Colors</h2>
            <div class="container">
            ${colors.map((color, index) => `
            <div class="selectedColor" style='background:rgb(${color.r}, ${color.g}, ${color.b})'>
              <div class="selectedcolorinfo" >
                <div class="selectedcolorinfo-top">
                  <div>
                    ${(calculateBrightness(color)/calculateBrightness(threshold)).toFixed(2)  + " " + (calculateBrightness(color).toFixed(2)/calculateBrightness(threshold).toFixed(2)<=0.94 ? "S" :"R")}
                  </div>
                </div>
              </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  
    // Write the HTML string to the new window's document
    WinPrint.document.write(printableContent);
    WinPrint.print();
    WinPrint.document.close();
    WinPrint.close();
  }
  

  
  // Make sure you have the 'Print' component defined somewhere in your code
  
  
  
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftColumn}>
        <h1 className={styles.headingText}>Pick color from image</h1>
        <p className={styles.Help}>Help <span onClick={() => setIsModalOpen(true)}>i</span></p>
        <div className={styles.range_slider}>
          <p>Set sampling size</p>
          <input className={styles.range_slider__range} type="range" value={samplingSize} onChange={(e)=>setSamplingSize(e.target.value)} min="2" max="10" />
          <span className={styles.range_slider__value}>{samplingSize}</span>
        </div>
        <div className={styles.range_slider}>
          <p>Set magnification size</p>
          <input className={styles.range_slider__range} type="range" value={magnificationFactor} onChange={(e)=>setMagnificationFactor(e.target.value)} min="5" max="20" />
          <span className={styles.range_slider__value}>{magnificationFactor}</span>
        </div>
        <div className={styles.formSection}>
          <p>1. Select an image</p>
          {image ? (
            <button onClick={() => setThreshold(null) || setImage(null)} className={styles.remove}>Remove</button>
          ) : (
            <label className={styles.label}>
              Select<input className={styles.input} onChange={handleFileInput} type="file" accept="image/*" />
            </label>
          )}
        </div>

        <div className={styles.formSection}>
          <p>2. View Threshold </p>
          <div className={styles.colorsection}>
            {threshold && <Color color={threshold} rank="T" Brightness={calculateBrightness(threshold).toFixed(2)} threshold={threshold} setThreshold={setThreshold} />}
          </div>
        </div>

        <div className={styles.formSection} >
          <p>4. View selected <span style={colors.length>=100 ? {color:'red'} : {}}>{`(${colors.length}/100)`}</span></p> 
          <div className={styles.colorsection} id="selectedColor">
            {colors.map((color, index) => (
              <Color
                key={index}
                color={color}
                rank={calculateBrightness(color).toFixed(2)/calculateBrightness(threshold).toFixed(2)<=0.94 ? "S" :"R"}
                setColors={setColors}
                Brightness={(calculateBrightness(color)/calculateBrightness(threshold)).toFixed(2)}
              />
            ))}
          </div>
          <button className={styles.remove} onClick={()=>setFormstate(prev=>!prev)}>FeedBack Form</button>
          {(colors.length>0 && threshold) && <button className={styles.remove} onClick={()=>printPDF()}>PDF</button>}

        </div>
      </div>

      <div className={styles.rightColumn}>
      
        {image && 
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasHover}
            onMouseLeave={handleCanvasLeave}
          ></canvas> || (formstate && <FeedbackForm />) 
        }

      </div>
      {<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ColorPicker;
