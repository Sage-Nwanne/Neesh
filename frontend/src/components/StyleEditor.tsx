import React from 'react';
import styles from './StyleEditor.module.css';

interface CSSStyles {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: string;
  textDecoration?: string;
  fontStyle?: string;
  textTransform?: string;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

interface StyleEditorProps {
  elementStyles: CSSStyles;
  onStyleChange: (elementStyles: CSSStyles) => void;
  customCSS: string;
  onCustomCSSChange: (css: string) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({
  elementStyles,
  onStyleChange,
  customCSS,
  onCustomCSSChange
}) => {
  // Safe parseInt that handles invalid values
  const safeParseInt = (value: string | undefined, defaultValue: number = 0): number => {
    if (!value) return defaultValue;
    const parsed = parseInt(value.replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Safe parseFloat that handles invalid values
  const safeParseFloat = (value: string | undefined, defaultValue: number = 1.2): number => {
    if (!value) return defaultValue;
    const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Convert any color format to hex for color inputs
  const toHexColor = (color: string | undefined, defaultColor: string): string => {
    if (!color) return defaultColor;
    if (color.startsWith('#')) return color;
    if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return '#000000';

    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return defaultColor;
  };

  const updateStyle = (property: keyof CSSStyles, value: string) => {
    const newStyles = {
      ...elementStyles,
      [property]: value
    };
    console.log(`🎨 StyleEditor: Updating ${property} to ${value}`, newStyles);
    onStyleChange(newStyles);
  };

  const fontFamilies = [
    'Arial, sans-serif',
    'Helvetica, sans-serif', 
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Trebuchet MS, sans-serif',
    'Impact, sans-serif'
  ];

  const fontWeights = [
    { value: '100', label: 'Thin' },
    { value: '300', label: 'Light' },
    { value: '400', label: 'Normal' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' },
    { value: '900', label: 'Black' }
  ];

  return (
    <div className={styles.styleEditor}>
      <h3>Style Editor</h3>
      
      {/* Typography Section */}
      <div className={styles.styleSection}>
        <h4>Typography</h4>
        
        <div className={styles.styleRow}>
          <label>Font Size:</label>
          <input
            type="range"
            min="8"
            max="72"
            value={safeParseInt(elementStyles.fontSize, 16)}
            onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
          />
          <input
            type="number"
            value={safeParseInt(elementStyles.fontSize, 16)}
            onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
            style={{ width: '60px', marginLeft: '10px' }}
          />
          <span>px</span>
        </div>

        <div className={styles.styleRow}>
          <label>Font Family:</label>
          <select
            value={elementStyles.fontFamily || ''}
            onChange={(e) => updateStyle('fontFamily', e.target.value)}
          >
            <option value="">Default</option>
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font.split(',')[0]}</option>
            ))}
          </select>
        </div>

        <div className={styles.styleRow}>
          <label>Font Weight:</label>
          <select
            value={elementStyles.fontWeight || '400'}
            onChange={(e) => updateStyle('fontWeight', e.target.value)}
          >
            {fontWeights.map(weight => (
              <option key={weight.value} value={weight.value}>{weight.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.styleRow}>
          <label>Font Style:</label>
          <select
            value={elementStyles.fontStyle || 'normal'}
            onChange={(e) => updateStyle('fontStyle', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
            <option value="oblique">Oblique</option>
          </select>
        </div>

        <div className={styles.styleRow}>
          <label>Line Height:</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={safeParseFloat(elementStyles.lineHeight, 1.2)}
            onChange={(e) => updateStyle('lineHeight', e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            value={safeParseFloat(elementStyles.lineHeight, 1.2)}
            onChange={(e) => updateStyle('lineHeight', e.target.value)}
            style={{ width: '60px', marginLeft: '10px' }}
          />
        </div>

        <div className={styles.styleRow}>
          <label>Letter Spacing:</label>
          <input
            type="range"
            min="-2"
            max="10"
            step="0.1"
            value={safeParseFloat(elementStyles.letterSpacing, 0)}
            onChange={(e) => updateStyle('letterSpacing', `${e.target.value}px`)}
          />
          <input
            type="number"
            step="0.1"
            value={safeParseFloat(elementStyles.letterSpacing, 0)}
            onChange={(e) => updateStyle('letterSpacing', `${e.target.value}px`)}
            style={{ width: '60px', marginLeft: '10px' }}
          />
          <span>px</span>
        </div>

        <div className={styles.styleRow}>
          <label>Text Align:</label>
          <select
            value={elementStyles.textAlign || 'left'}
            onChange={(e) => updateStyle('textAlign', e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>

        <div className={styles.styleRow}>
          <label>Text Transform:</label>
          <select
            value={elementStyles.textTransform || 'none'}
            onChange={(e) => updateStyle('textTransform', e.target.value)}
          >
            <option value="none">None</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>

        <div className={styles.styleRow}>
          <label>Text Decoration:</label>
          <select
            value={elementStyles.textDecoration || 'none'}
            onChange={(e) => updateStyle('textDecoration', e.target.value)}
          >
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="overline">Overline</option>
            <option value="line-through">Line Through</option>
          </select>
        </div>
      </div>

      {/* Colors Section */}
      <div className={styles.styleSection}>
        <h4>Colors</h4>
        
        <div className={styles.styleRow}>
          <label>Text Color:</label>
          <input
            type="color"
            value={toHexColor(elementStyles.color, '#000000')}
            onChange={(e) => updateStyle('color', e.target.value)}
          />
          <input
            type="text"
            value={elementStyles.color || ''}
            onChange={(e) => updateStyle('color', e.target.value)}
            placeholder="#000000"
            style={{ marginLeft: '10px', width: '100px' }}
          />
        </div>

        <div className={styles.styleRow}>
          <label>Background Color:</label>
          <input
            type="color"
            value={toHexColor(elementStyles.backgroundColor, '#ffffff')}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
          />
          <input
            type="text"
            value={elementStyles.backgroundColor || ''}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            placeholder="transparent"
            style={{ marginLeft: '10px', width: '100px' }}
          />
        </div>
      </div>

      {/* Spacing Section */}
      <div className={styles.styleSection}>
        <h4>Spacing</h4>
        
        <div className={styles.styleRow}>
          <label>Margin Top:</label>
          <input
            type="number"
            value={safeParseInt(elementStyles.marginTop, 0)}
            onChange={(e) => updateStyle('marginTop', `${e.target.value}px`)}
            style={{ width: '60px' }}
          />
          <span>px</span>
        </div>

        <div className={styles.styleRow}>
          <label>Margin Bottom:</label>
          <input
            type="number"
            value={safeParseInt(elementStyles.marginBottom, 0)}
            onChange={(e) => updateStyle('marginBottom', `${e.target.value}px`)}
            style={{ width: '60px' }}
          />
          <span>px</span>
        </div>

        <div className={styles.styleRow}>
          <label>Padding:</label>
          <input
            type="number"
            value={safeParseInt(elementStyles.paddingTop, 0)}
            onChange={(e) => {
              const value = `${e.target.value}px`;
              onStyleChange({
                ...elementStyles,
                paddingTop: value,
                paddingBottom: value,
                paddingLeft: value,
                paddingRight: value
              });
            }}
            style={{ width: '60px' }}
          />
          <span>px (all sides)</span>
        </div>
      </div>

      {/* Custom CSS Section */}
      <div className={styles.styleSection}>
        <h4>Custom CSS</h4>
        <textarea
          value={customCSS}
          onChange={(e) => onCustomCSSChange(e.target.value)}
          placeholder="Enter custom CSS properties here...&#10;Example: border: 1px solid #ccc; border-radius: 4px;"
          rows={4}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
        />
      </div>
    </div>
  );
};

export default StyleEditor;
