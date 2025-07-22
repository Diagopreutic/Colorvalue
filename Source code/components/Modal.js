import styles from "./colorPicker.module.css";

export default function Modal({isOpen,onClose}) {

    if(!isOpen){
        return null;
    } 
  return (
    <section className={styles.infosection}>
      <div id="documentation">
      <h2>Color Picker Documentation</h2>
        <p>Welcome to the Color Picker documentation. Follow the steps below to use the website:</p>

        <div >
          <h3>Step 1: Select an Image</h3>
          <ol>
            <li>Navigate to the Color Picker website.</li>
            <li>In the left column, you will find the --Select an image-- section.</li>
            <li>Click on the --Select-- button to choose an image from your device.</li>
          </ol>
        </div>

        <div >
          <h3>Step 2: Set Sampling Size</h3>
          <ol>
            <li>Adjust the sampling size using the --Set sampling size-- slider.</li>
            <li>Move the slider to the desired sampling size (ranging from 2 to 10).</li>
            <li>The sampling size determines the area from which the color will be sampled.</li>
          </ol>
        </div>

        <div >
          <h3>Step 3: Explore Colors</h3>
          <ol>
            <li>The selected image will be displayed in the right column.</li>
            <li>Hover over the image to preview color details.</li>
            <li>Click on the image to pick a color. The colors RGB values will be displayed.</li>
          </ol>
                  </div>

        <div >
          <h3>Step 4: View Threshold</h3>
          <ol>
            <li>In the --View Threshold-- section, you can see the color selected as the threshold.</li>
            <li>This color is marked with a rank --T-- and its brightness level.</li>
            <li>To change the threshold, click on another color.</li>
          </ol>
                  </div>

        <div >
          <h3>Step 5: View Selected Colors</h3>
          <ol>
            <li>As you click on the image, selected colors will be displayed in the --View selected-- section.</li>
            <li>Each color will show its rank (--S-- for sensitive, --R-- for resistance) and brightness level.
</li>
            <li>A maximum of 10 colors can be selected. If you try to exceed this limit, a notification will appear.</li>
          </ol>
                  </div>

        <p>Thank you for using the Color Picker!</p>
      </div>
      <button className={styles.remove} onClick={()=>onClose()}>Remove</button>
      </section>
  );
}
