import styles from "./colorPicker.module.css";

/**
 * Color Component
 * Displays a colored box with additional information, allowing users to remove the color.
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.color - The color object containing RGB values.
 * @param {string} [props.rank='R'] - The rank of the color (default: 'R' for Resistance).
 * @param {function} props.setColors - The function to set selected colors.
 * @param {Object} props.threshold - The threshold color object.
 * @param {function} props.setThreshold - The function to set the threshold color.
 * @param {string} props.Brightness - The brightness value of the color.
 * @returns {JSX.Element} - The JSX representation of the Color component.
 */
export default function Color({ color, rank = 'R', setColors, threshold, setThreshold, Brightness }) {
  /**
   * Handles the color change event.
   * If there is a threshold color, sets it to null.
   * If there is no threshold color, removes the color from the selected colors.
   */
  const changecolor = () => {
    if (threshold) {
      setThreshold(null);
    } else {
      setColors(prev => prev.filter(p => p !== color));
    }
  };

  return (
    <div className={styles.selectedColor} style={threshold ? { width: "100%", background: `rgb(${color?.r}, ${color?.g}, ${color?.b})` } : { background: `rgb(${color.r}, ${color.g}, ${color.b})` }}>
      <div className={styles.selectedcolorinfo}>
        <div className="selectedcolorinfo-top">
          <div>
            {Brightness}
            <abbr title={rank === "S" ? "Sensitive" : rank === "T" ? "Threshold" : "Resistance"}>{rank}</abbr>
          </div>
        </div>
        <button className={styles.remove} onClick={() => changecolor()}>Remove</button>
      </div>
    </div>
  );
}
