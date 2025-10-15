import React, { useState, useEffect, useRef } from 'react';
import { useContentManagement } from '../hooks/useContentManagement';
import { useCMSAuth } from '../hooks/useCMSAuth';
import CMSLogin from '../components/CMSLogin';
import CMSNavigation from '../components/CMSNavigation';
import StyleEditor from '../components/StyleEditor';
import { config } from '../lib/config';
import { supabase } from '../integrations/supabase/client';
import styles from './VisualPageEditor.module.css';

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

interface EditableElement {
  id: string;
  selector: string;
  originalText: string;
  newText: string;
  element: HTMLElement;
  contentKey?: string;
  originalStyles: CSSStyles;
  newStyles: CSSStyles;
}

interface PendingChange {
  id: string;
  selector: string;
  originalText: string;
  newText: string;
  contentKey?: string;
  originalStyles: CSSStyles;
  newStyles: CSSStyles;
  customCSS?: string;
}

const VisualPageEditor: React.FC = () => {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { isAuthenticated, login, logout } = useCMSAuth();
  const { updateSiteContentByKey, refreshContent } = useContentManagement();
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [editText, setEditText] = useState('');
  const [editStyles, setEditStyles] = useState<CSSStyles>({});
  const [customCSS, setCustomCSS] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Real-time preview: Apply styles immediately when they change
  useEffect(() => {
    if (selectedElement && selectedElement.element) {
      console.log('🎨 Real-time preview: Applying styles', editStyles);
      applyStylesToElement(selectedElement.element, editStyles);
    }
  }, [editStyles, selectedElement]);

  // Real-time preview: Apply custom CSS immediately when it changes
  useEffect(() => {
    if (selectedElement && selectedElement.element) {
      applyCustomCSS(selectedElement.element, customCSS);
    }
  }, [customCSS, selectedElement]);

  // Load and apply saved styles from database
  const loadSavedStyles = async () => {
    try {
      console.log('🔄 Loading saved styles from database...');
      const { data } = await supabase
        .from('site_content')
        .select('key, metadata')
        .not('metadata', 'is', null);

      console.log('📦 Retrieved metadata from database:', data);

      if (data) {
        data.forEach(item => {
          if (item.metadata?.styles || item.metadata?.customCSS) {
            console.log(`🎨 Applying saved styles for ${item.key}:`, item.metadata);
            const iframe = iframeRef.current;
            if (iframe && iframe.contentDocument) {
              const doc = iframe.contentDocument;

              // Try multiple selectors to find the element
              let elements: NodeListOf<Element> | null = null;

              // First try with data-content-key attribute
              elements = doc.querySelectorAll(`[data-content-key="${item.key}"]`);
              console.log(`🔍 Found ${elements.length} elements with data-content-key="${item.key}"`);

              // If not found, try to find by content key mapping
              if (elements.length === 0) {
                for (const [selector, contentKey] of Object.entries(contentKeyMappings)) {
                  if (contentKey === item.key) {
                    elements = doc.querySelectorAll(selector);
                    console.log(`🔍 Found ${elements.length} elements using selector "${selector}" for key ${item.key}`);
                    break;
                  }
                }
              }

              if (elements && elements.length > 0) {
                elements.forEach(element => {
                  console.log(`✨ Applying styles to element:`, element);
                  if (item.metadata.styles) {
                    applyStylesToElement(element as HTMLElement, item.metadata.styles);
                  }
                  if (item.metadata.customCSS) {
                    applyCustomCSS(element as HTMLElement, item.metadata.customCSS);
                  }
                });
              } else {
                console.warn(`⚠️ Could not find element for key: ${item.key}`);
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('❌ Error loading saved styles:', error);
    }
  };
  const [currentPage, setCurrentPage] = useState<'home' | 'publisher' | 'retailer'>('home');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Content key mappings for different elements (based on actual database keys)
  const contentKeyMappings: Record<string, string> = {
    // Hero section - multiple ways to match the main title
    'h1': 'homepage_hero_title',
    '.hero h1': 'homepage_hero_title',
    '.hero-title': 'homepage_hero_title',
    'h1.hero-title': 'homepage_hero_title',
    '.hero p': 'homepage_hero_subtitle',

    // Publisher value proposition
    '.propCard:nth-child(1) h3': 'homepage_publisher_section_title',
    '.propCard:nth-child(1) h2': 'homepage_publisher_main_title',
    '.propCard:nth-child(1) p:first-of-type': 'homepage_publisher_description',
    '.propCard:nth-child(1) .subText': 'homepage_publisher_subtext',

    // Retailer value proposition
    '.propCard:nth-child(2) h3': 'homepage_retailer_section_title',
    '.propCard:nth-child(2) h2': 'homepage_retailer_main_title',
    '.propCard:nth-child(2) p:first-of-type': 'homepage_retailer_description',
    '.propCard:nth-child(2) .subText': 'homepage_retailer_subtext',

    // Pipeline section
    '.pipeline h2': 'homepage_pipeline_title',
    '.step:nth-child(1) h4': 'homepage_pipeline_step1_title',
    '.step:nth-child(1) p': 'homepage_pipeline_step1_desc',
    '.step:nth-child(2) h4': 'homepage_pipeline_step2_title',
    '.step:nth-child(2) p': 'homepage_pipeline_step2_desc',
    '.step:nth-child(3) h4': 'homepage_pipeline_step3_title',
    '.step:nth-child(3) p': 'homepage_pipeline_step3_desc',

    // CTA section
    '.ctaTitle': 'homepage_cta_title'
  };

  // Page URLs for iframe
  const pageUrls = {
    home: window.location.origin,
    publisher: `${window.location.origin}/publisher-landing`,
    retailer: `${window.location.origin}/retailer-landing`
  };

  // Helper function to convert RGB to hex
  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    if (rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#000000';

    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      console.log(`🎨 RGB to Hex conversion: ${rgb} → ${hex}`);
      return hex;
    }
    console.log(`🎨 RGB to Hex: No conversion needed for ${rgb}`);
    return rgb;
  };

  // Helper function to normalize style values for comparison
  const normalizeStyleValue = (property: string, value: string): string => {
    if (!value) return '';

    // Normalize colors to hex
    if (property === 'color' || property === 'backgroundColor') {
      return rgbToHex(value);
    }

    // Normalize font family (remove quotes and normalize spacing)
    if (property === 'fontFamily') {
      return value.replace(/['"]/g, '').replace(/,\s+/g, ', ');
    }

    return value;
  };

  // Helper function to extract current styles from an element
  const extractElementStyles = (element: HTMLElement): CSSStyles => {
    const computedStyles = window.getComputedStyle(element);
    return {
      fontSize: computedStyles.fontSize,
      fontFamily: computedStyles.fontFamily,
      fontWeight: computedStyles.fontWeight,
      lineHeight: computedStyles.lineHeight,
      letterSpacing: computedStyles.letterSpacing,
      color: rgbToHex(computedStyles.color),
      backgroundColor: rgbToHex(computedStyles.backgroundColor),
      textAlign: computedStyles.textAlign,
      textDecoration: computedStyles.textDecoration,
      fontStyle: computedStyles.fontStyle,
      textTransform: computedStyles.textTransform,
      marginTop: computedStyles.marginTop,
      marginBottom: computedStyles.marginBottom,
      paddingTop: computedStyles.paddingTop,
      paddingBottom: computedStyles.paddingBottom,
      paddingLeft: computedStyles.paddingLeft,
      paddingRight: computedStyles.paddingRight,
    };
  };

  // Helper function to apply styles to an element
  const applyStylesToElement = (element: HTMLElement, elementStyles: CSSStyles) => {
    Object.entries(elementStyles).forEach(([property, value]) => {
      if (value && value !== '') {
        // Convert camelCase to kebab-case for CSS properties
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        element.style.setProperty(cssProperty, value);
      }
    });
  };

  // Helper function to parse and apply custom CSS
  const applyCustomCSS = (element: HTMLElement, css: string) => {
    if (!css.trim()) return;

    const rules = css.split(';').filter(rule => rule.trim());
    rules.forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) {
        element.style.setProperty(property, value);
      }
    });
  };

  // Define all functions before useEffect and authentication check
  const setupEditableElements = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;

    // Add edit mode styles to iframe
    const style = doc.createElement('style');
    style.textContent = `
      .neesh-editable {
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .neesh-editable:hover {
        background-color: rgba(52, 152, 219, 0.1);
        outline: 2px dashed #3498db;
      }
      .neesh-edit-overlay {
        position: absolute;
        top: -25px;
        left: 0;
        background: #3498db;
        color: white;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 3px;
        z-index: 1000;
        pointer-events: none;
      }
      .selected {
        background-color: rgba(52, 152, 219, 0.2) !important;
        outline: 2px solid #3498db !important;
      }
    `;
    doc.head.appendChild(style);

    // Define selectors for editable elements
    const editableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', '.hero p', '.propCard p', '.propCard h2', '.propCard h3',
      '.valueTitle', '.valueDescription',
      '.step h4', '.step p', '.stepSubtext',
      '.ctaTitle'
    ];

    editableSelectors.forEach(selector => {
      const elements = doc.querySelectorAll(selector);
      console.log(`🔍 Selector "${selector}" found ${elements.length} elements`);

      elements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        console.log(`📝 Processing element ${index + 1}/${elements.length} for selector "${selector}":`, htmlElement);

        // Skip if already processed or contains only images/buttons
        if (htmlElement.classList.contains('neesh-editable') ||
            htmlElement.querySelector('img, button')) {
          console.log(`⏭️ Skipping element (already processed or contains img/button):`, htmlElement);
          return;
        }

        htmlElement.classList.add('neesh-editable');
        console.log(`✅ Made element editable:`, htmlElement);

        // Add data attribute for content key if available
        const contentKey = contentKeyMappings[selector];
        if (contentKey) {
          htmlElement.setAttribute('data-content-key', contentKey);
          console.log(`🏷️ Set data-content-key="${contentKey}" on element:`, htmlElement);
        } else {
          console.log(`⚠️ No content key found for selector: ${selector}`);
        }

        // Add overlay
        const overlay = doc.createElement('div');
        overlay.className = 'neesh-edit-overlay';
        overlay.textContent = 'Click to edit';
        overlay.style.display = 'none';
        htmlElement.style.position = 'relative';
        htmlElement.appendChild(overlay);

        // Add hover events
        htmlElement.addEventListener('mouseenter', () => {
          overlay.style.display = 'block';
        });

        htmlElement.addEventListener('mouseleave', () => {
          overlay.style.display = 'none';
        });

        // Add click event
        htmlElement.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleElementClick(htmlElement, selector, index);
        });
      });
    });
  };

  const handleElementClick = (element: HTMLElement, selector: string, index: number) => {
    // Clear previous selection
    const iframe = iframeRef.current;
    if (iframe?.contentDocument) {
      iframe.contentDocument.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
      });
    }

    element.classList.add('selected');

    const uniqueSelector = index > 0 ? `${selector}:nth-of-type(${index + 1})` : selector;
    let contentKey = contentKeyMappings[uniqueSelector] || contentKeyMappings[selector];

    // If no direct match, try to find a partial match or use data-content-key attribute
    if (!contentKey) {
      // Check if element has data-content-key attribute
      const dataContentKey = element.getAttribute('data-content-key');
      if (dataContentKey) {
        contentKey = dataContentKey;
        console.log('🏷️ Found content key from data attribute:', contentKey);
      } else {
        // Try to find a mapping based on element's context (parent classes, etc.)
        const tagName = element.tagName.toLowerCase();

        // For p elements, check if they're in specific sections
        if (tagName === 'p') {
          console.log('🔍 Analyzing p element context:', {
            element: element,
            textContent: element.textContent?.substring(0, 50),
            parentElement: element.parentElement,
            parentClasses: element.parentElement?.className,
            closestHero: element.closest('.hero, section.hero, [class*="hero"]'),
            closestPropCard: element.closest('.propCard, [class*="prop"]')
          });

          // Check if it's in the hero section (multiple ways)
          const heroSection = element.closest('.hero, section.hero, [class*="hero"]');
          if (heroSection) {
            contentKey = 'homepage_hero_subtitle';
            console.log('🏷️ Found p element in hero section, using homepage_hero_subtitle');
          }

          // Check if it's in a propCard
          if (!contentKey) {
            const propCard = element.closest('.propCard, [class*="prop"]');
            if (propCard) {
              const iframe = iframeRef.current;
              if (iframe && iframe.contentDocument) {
                const propCards = Array.from(iframe.contentDocument.querySelectorAll('.propCard, [class*="prop"]'));
                const index = propCards.indexOf(propCard);
                if (index === 0) {
                  contentKey = 'homepage_publisher_description';
                  console.log('🏷️ Found p element in first propCard, using homepage_publisher_description');
                } else if (index === 1) {
                  contentKey = 'homepage_retailer_description';
                  console.log('🏷️ Found p element in second propCard, using homepage_retailer_description');
                }
              }
            }
          }

          // If still no match, check text content to identify the element
          if (!contentKey) {
            const text = element.textContent?.toLowerCase() || '';
            if (text.includes('marketplace') || text.includes('publishers get discovered')) {
              contentKey = 'homepage_hero_subtitle';
              console.log('🏷️ Identified hero subtitle by text content');
            } else if (text.includes('publisher') || text.includes('independent')) {
              contentKey = 'homepage_publisher_description';
              console.log('🏷️ Identified publisher description by text content');
            } else if (text.includes('retailer') || text.includes('curated')) {
              contentKey = 'homepage_retailer_description';
              console.log('🏷️ Identified retailer description by text content');
            }
          }
        }

        // For h2 elements, check text content to identify them
        if (tagName === 'h2' && !contentKey) {
          const text = element.textContent?.toLowerCase() || '';
          if (text.includes('stock magazines') || text.includes('unforgettable')) {
            contentKey = 'homepage_retailer_main_title';
            console.log('🏷️ Identified retailer main title by text content');
          } else if (text.includes('publish') || text.includes('independent')) {
            contentKey = 'homepage_publisher_main_title';
            console.log('🏷️ Identified publisher main title by text content');
          }
        }

        // Fallback: try tag name or class names
        if (!contentKey) {
          if (contentKeyMappings[tagName]) {
            contentKey = contentKeyMappings[tagName];
            console.log('🏷️ Found content key by tag name:', contentKey);
          } else {
            const classList = Array.from(element.classList);
            for (const className of classList) {
              if (contentKeyMappings[`.${className}`]) {
                contentKey = contentKeyMappings[`.${className}`];
                console.log('🏷️ Found content key by class name:', contentKey);
                break;
              }
            }
          }
        }
      }
    }

    // If still no content key found, create a fallback based on element characteristics
    if (!contentKey) {
      const tagName = element.tagName.toLowerCase();
      const textContent = element.textContent?.trim().substring(0, 20) || '';
      contentKey = `temp_${tagName}_${textContent.replace(/\s+/g, '_').toLowerCase()}`;
      console.log('🔧 Created fallback content key:', contentKey);
    }

    console.log('=== ELEMENT CLICKED ===');
    console.log('Selector:', selector);
    console.log('Unique selector:', uniqueSelector);
    console.log('Content key found:', contentKey);
    console.log('Element tag:', element.tagName);
    console.log('Element classes:', Array.from(element.classList));
    console.log('Data content key:', element.getAttribute('data-content-key'));
    console.log('Available mappings:', contentKeyMappings);

    // Extract current styles from the element
    const currentStyles = extractElementStyles(element);
    console.log('🎨 Extracted current styles:', currentStyles);

    const editableElement: EditableElement = {
      id: `${selector}-${index}`,
      selector: uniqueSelector,
      element: element,
      originalText: element.textContent || '',
      newText: element.textContent || '',
      contentKey: contentKey,
      originalStyles: currentStyles,
      newStyles: { ...currentStyles }
    };

    setSelectedElement(editableElement);
    setEditStyles({ ...currentStyles });
    console.log('🎨 Set editStyles to:', { ...currentStyles });

    // Get the actual text content, excluding any overlay elements
    const actualText = element.childNodes.length > 0
      ? Array.from(element.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !(node as Element).classList.contains('neesh-edit-overlay')))
          .map(node => node.textContent)
          .join('')
          .trim()
      : element.textContent || '';
    setEditText(actualText);
  };

  // useEffect hook must be before authentication check
  useEffect(() => {
    if (iframeRef.current && isEditMode) {
      setupEditableElements();
    }
  }, [isEditMode, currentPage]);

  // Show login form if not authenticated (AFTER ALL HOOKS)
  if (!isAuthenticated) {
    console.log('🔐 User not authenticated, showing login form');
    return <CMSLogin onLogin={login} />;
  }

  console.log('✅ User authenticated, rendering page editor');

  const addPendingChange = () => {
    if (!selectedElement) {
      console.log('❌ No selected element');
      return;
    }

    console.log('💾 Adding pending change with styles:', {
      originalStyles: selectedElement.originalStyles,
      newStyles: editStyles,
      customCSS: customCSS,
      stylesChanged: JSON.stringify(editStyles) !== JSON.stringify(selectedElement.originalStyles),
      textChanged: editText !== selectedElement.originalText,
      hasCustomCSS: customCSS.trim() !== ''
    });

    setPendingChanges(prev => {
      const existing = prev.find(change => change.selector === selectedElement.selector);
      if (existing) {
        return prev.map(change =>
          change.selector === selectedElement.selector
            ? { ...change, newText: editText, newStyles: editStyles, customCSS: customCSS }
            : change
        );
      }
      return [...prev, {
        id: selectedElement.id,
        selector: selectedElement.selector,
        originalText: selectedElement.originalText,
        newText: editText,
        contentKey: selectedElement.contentKey,
        originalStyles: selectedElement.originalStyles,
        newStyles: editStyles,
        customCSS: customCSS
      }];
    });

    // Update the element in the iframe
    selectedElement.element.textContent = editText;

    // Apply styles to the element (they're already applied via useEffect, but ensure they persist)
    applyStylesToElement(selectedElement.element, editStyles);
    applyCustomCSS(selectedElement.element, customCSS);
    
    // Clear selection
    selectedElement.element.classList.remove('selected');
    setSelectedElement(null);
    setEditText('');
    setEditStyles({});
    setCustomCSS('');
  };

  const removePendingChange = (selector: string) => {
    const change = pendingChanges.find(c => c.selector === selector);
    if (change) {
      // Revert the element text
      const iframe = iframeRef.current;
      if (iframe?.contentDocument) {
        const element = iframe.contentDocument.querySelector(change.selector) as HTMLElement;
        if (element) {
          element.textContent = change.originalText;
        }
      }
    }

    setPendingChanges(prev => prev.filter(change => change.selector !== selector));
  };

  const applyAllChanges = async () => {
    try {
      setSaving(true);
      let successCount = 0;
      let totalChanges = 0;

      console.log('=== APPLYING CHANGES ===');
      console.log('🌐 User Agent:', navigator.userAgent);
      console.log('🔗 Current URL:', window.location.href);
      console.log('📝 Pending changes:', pendingChanges);
      console.log('🗝️ Available content keys in mappings:', Object.values(contentKeyMappings));

    for (const change of pendingChanges) {
      if (change.contentKey) {
        totalChanges++;
        console.log(`Attempting to save:`, {
          selector: change.selector,
          contentKey: change.contentKey,
          oldText: change.originalText,
          newText: change.newText,
          styles: change.newStyles,
          customCSS: change.customCSS,
          hasStyleChanges: !!(change.newStyles && Object.keys(change.newStyles).length > 0),
          hasCustomCSS: !!(change.customCSS && change.customCSS.trim() !== '')
        });

        // Prepare the update object with content and styles
        const updateData: any = { content: change.newText };

        // If we have style changes, store them in metadata
        if (change.newStyles || change.customCSS) {
          let existingMetadata = {};
          try {
            // Try to get existing metadata from the database
            const { data } = await supabase
              .from('site_content')
              .select('metadata')
              .eq('key', change.contentKey)
              .single();
            existingMetadata = data?.metadata || {};
          } catch (error) {
            console.log('No existing metadata found, creating new');
          }

          updateData.metadata = {
            ...existingMetadata,
            styles: change.newStyles || {},
            customCSS: change.customCSS || ''
          };

          console.log(`📝 Saving metadata for ${change.contentKey}:`, updateData.metadata);
        }

        // Update in database if we have a content key mapping
        const success = await updateSiteContentByKey(change.contentKey, updateData);
        if (success) {
          successCount++;
          console.log(`✅ Successfully saved: ${change.contentKey}`);
        } else {
          console.error(`❌ Failed to save: ${change.contentKey}`);
        }
      } else {
        console.warn(`⚠️ No content key mapping for selector: ${change.selector}`);
        console.log('Available mappings:', contentKeyMappings);
        console.log('Change object:', change);

        // Still count this as a change that was attempted
        totalChanges++;
      }
    }

    if (successCount > 0) {
      await refreshContent();
      // Reload the iframe to show updated content
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
      alert(`Successfully saved ${successCount} of ${totalChanges} changes!`);
    } else if (totalChanges > 0) {
      alert(`Failed to save ${totalChanges} changes. Please try again.`);
    } else {
      alert('No changes to save.');
    }

      setPendingChanges([]);
    } catch (error) {
      console.error('❌ Error applying changes:', error);
      alert(`Error applying changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const discardAllChanges = () => {
    // Revert all changes in the iframe
    pendingChanges.forEach(change => {
      const iframe = iframeRef.current;
      if (iframe?.contentDocument) {
        const element = iframe.contentDocument.querySelector(change.selector) as HTMLElement;
        if (element) {
          element.textContent = change.originalText;
        }
      }
    });

    setPendingChanges([]);
    setSelectedElement(null);
    setEditText('');
  };

  const handleSyncToSheets = async () => {
    setSyncing(true);
    setSyncMessage('');

    try {
      const response = await fetch(`${config.supabase.url}/functions/v1/sync-to-sheets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.supabase.anonKey}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSyncMessage('✅ Data successfully synced to Google Sheets!');
      } else {
        setSyncMessage(`❌ Sync failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setSyncMessage(`❌ Sync failed: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(''), 5000);
    }
  };

  const clearOldContent = async (key: string) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('key', key);

      if (error) {
        console.error('Error clearing content:', error);
        alert(`Error clearing ${key}: ${error.message}`);
      } else {
        console.log(`✅ Cleared old content for ${key}`);
        alert(`✅ Cleared old content for ${key}. Refresh the homepage to see the new fallback text.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error clearing ${key}`);
    }
  };

  return (
    <div className={styles.container}>
      <CMSNavigation onLogout={logout} />
      <header className={styles.header}>
        <h1>NEESH Visual Page Editor</h1>
        <p>Click on any text element to edit it directly</p>
        
        <div className={styles.headerControls}>
          <div className={styles.pageSelector}>
            <button
              className={`${styles.pageButton} ${currentPage === 'home' ? styles.active : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              Homepage
            </button>
            <button
              className={`${styles.pageButton} ${currentPage === 'publisher' ? styles.active : ''}`}
              onClick={() => setCurrentPage('publisher')}
            >
              Publisher Page
            </button>
            <button
              className={`${styles.pageButton} ${currentPage === 'retailer' ? styles.active : ''}`}
              onClick={() => setCurrentPage('retailer')}
            >
              Retailer Page
            </button>
          </div>

          <div className={styles.modeControls}>
            <button
              className={`${styles.modeButton} ${isEditMode ? styles.active : ''}`}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? '👁️ View Mode' : '✏️ Edit Mode'}
            </button>

            {isEditMode && (
              <>
                <button
                  onClick={() => {
                    console.log('🔧 Manual setup trigger...');
                    setupEditableElements();
                    setTimeout(() => {
                      console.log('🔧 Manual style loading trigger...');
                      loadSavedStyles();
                    }, 500);
                  }}
                  style={{ marginLeft: '10px', padding: '8px 16px', fontSize: '14px' }}
                >
                  🔧 Reload Styles
                </button>
                <button
                  onClick={() => clearOldContent('homepage_retailer_main_title')}
                  style={{
                    marginLeft: '10px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Clear Retailer Title
                </button>
              </>
            )}

            <button
              className={`${styles.syncButton} ${syncing ? styles.syncing : ''}`}
              onClick={handleSyncToSheets}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : '📊 Sync to Sheets'}
            </button>

            {/* Debug button to test style changes */}
            {selectedElement && (
              <button
                onClick={() => {
                  console.log('🔍 Debug - Current state:', {
                    selectedElement: selectedElement.selector,
                    originalStyles: selectedElement.originalStyles,
                    editStyles: editStyles,
                    customCSS: customCSS,
                    stylesEqual: JSON.stringify(editStyles) === JSON.stringify(selectedElement.originalStyles)
                  });
                }}
                style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px' }}
              >
                🔍 Debug
              </button>
            )}
          </div>
        </div>

        {syncMessage && (
          <p className={styles.syncMessage}>{syncMessage}</p>
        )}
      </header>

      {pendingChanges.length > 0 && (
        <div className={styles.pendingChanges}>
          <h3>📝 Pending Changes ({pendingChanges.length})</h3>
          <div className={styles.pendingList}>
            {pendingChanges.map(change => (
              <div key={change.selector} className={styles.pendingItem}>
                <div className={styles.pendingInfo}>
                  <strong>{change.selector}</strong>
                  <div className={styles.changePreview}>
                    <span className={styles.oldText}>"{change.originalText}"</span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.newText}>"{change.newText}"</span>
                  </div>
                </div>
                <button
                  className={styles.removeChange}
                  onClick={() => removePendingChange(change.selector)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className={styles.pendingActions}>
            <button
              className={styles.discardButton}
              onClick={discardAllChanges}
            >
              Discard All Changes
            </button>
            <button
              className={styles.applyButton}
              onClick={applyAllChanges}
              disabled={saving}
            >
              {saving ? 'Applying...' : `Apply ${pendingChanges.length} Changes`}
            </button>
          </div>
        </div>
      )}

      <div className={styles.editorLayout}>
        <div className={styles.pageFrame}>
          <iframe
            ref={iframeRef}
            src={pageUrls[currentPage]}
            className={styles.pageIframe}
            onLoad={async () => {
              console.log('📄 Iframe loaded, isEditMode:', isEditMode);
              if (isEditMode) {
                setTimeout(async () => {
                  console.log('🚀 Setting up editable elements...');
                  setupEditableElements();
                  // Wait a bit for DOM to be ready, then load saved styles
                  setTimeout(() => {
                    console.log('🎨 Loading saved styles after setup...');
                    loadSavedStyles();
                  }, 200);
                }, 500);
              }
            }}
          />
          {isEditMode && (
            <div className={styles.editOverlay}>
              <div className={styles.editInstructions}>
                ✏️ Edit Mode Active - Click on any text to edit it
              </div>
            </div>
          )}
        </div>

        {selectedElement && (
          <div className={styles.editPanel}>
            <h3>Edit Element</h3>
            <div className={styles.editForm}>
              <label>
                Element: <strong>{selectedElement.selector}</strong>
              </label>

              {/* Text Content Section */}
              <div className={styles.editSection}>
                <h4>Text Content</h4>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className={styles.editTextarea}
                  placeholder="Enter your text..."
                />
              </div>

              {/* Style Editor Section */}
              <div className={styles.editSection}>
                <StyleEditor
                  elementStyles={editStyles}
                  onStyleChange={setEditStyles}
                  customCSS={customCSS}
                  onCustomCSSChange={setCustomCSS}
                />
              </div>

              <div className={styles.editActions}>
                <button
                  onClick={() => {
                    setSelectedElement(null);
                    setEditText('');
                    setEditStyles({});
                    setCustomCSS('');
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={addPendingChange}
                  className={styles.saveButton}
                  disabled={false}
                >
                  Add to Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualPageEditor;
