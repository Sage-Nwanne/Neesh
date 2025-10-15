import { useState, useEffect, useCallback } from 'react';
import { useContentManagement } from './useContentManagement';

export interface CMSElement {
  key: string;
  selector: string;
  content: string;
  type: 'text' | 'html' | 'image' | 'link';
  position: { x: number; y: number; width: number; height: number };
  styles: Record<string, string>;
  metadata: {
    label: string;
    description: string;
    section: string;
    editable: boolean;
    moveable: boolean;
    deletable: boolean;
  };
}

export interface CMSChange {
  elementKey: string;
  type: 'content' | 'position' | 'style' | 'delete' | 'duplicate';
  oldValue: any;
  newValue: any;
  timestamp: number;
}

export interface CMSHistory {
  changes: CMSChange[];
  currentIndex: number;
}

export const useVisualCMS = () => {
  const { siteContent, updateSiteContentByKey, loading } = useContentManagement();
  const [elements, setElements] = useState<CMSElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, CMSChange>>({});
  const [history, setHistory] = useState<CMSHistory>({ changes: [], currentIndex: -1 });
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);

  // Enhanced content mapping with metadata
  const contentMapping: Record<string, Omit<CMSElement, 'content' | 'position'>> = {
    'homepage_hero_title': {
      key: 'homepage_hero_title',
      selector: '.hero h1, .heroContent h1',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Hero Title',
        description: 'Main headline on the homepage',
        section: 'Hero Section',
        editable: true,
        moveable: true,
        deletable: false
      }
    },
    'homepage_hero_subtitle': {
      key: 'homepage_hero_subtitle',
      selector: '.hero p, .heroContent p',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Hero Subtitle',
        description: 'Subtitle text below the main headline',
        section: 'Hero Section',
        editable: true,
        moveable: true,
        deletable: false
      }
    },
    'homepage_publisher_section_title': {
      key: 'homepage_publisher_section_title',
      selector: '.propCard:first-child h3',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Publisher Section Title',
        description: 'Small title for publisher value proposition',
        section: 'Value Propositions',
        editable: true,
        moveable: false,
        deletable: false
      }
    },
    'homepage_publisher_main_title': {
      key: 'homepage_publisher_main_title',
      selector: '.propCard:first-child h2',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Publisher Main Title',
        description: 'Main heading for publisher value proposition',
        section: 'Value Propositions',
        editable: true,
        moveable: false,
        deletable: false
      }
    },
    'homepage_publisher_description': {
      key: 'homepage_publisher_description',
      selector: '.propCard:first-child p:not(.subText)',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Publisher Description',
        description: 'Main description for publishers',
        section: 'Value Propositions',
        editable: true,
        moveable: false,
        deletable: false
      }
    },
    'homepage_retailer_section_title': {
      key: 'homepage_retailer_section_title',
      selector: '.propCard:last-child h3',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Retailer Section Title',
        description: 'Small title for retailer value proposition',
        section: 'Value Propositions',
        editable: true,
        moveable: false,
        deletable: false
      }
    },
    'homepage_retailer_main_title': {
      key: 'homepage_retailer_main_title',
      selector: '.propCard:last-child h2',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Retailer Main Title',
        description: 'Main heading for retailer value proposition',
        section: 'Value Propositions',
        editable: true,
        moveable: false,
        deletable: false
      }
    },
    'homepage_retailer_description': {
      key: 'homepage_retailer_description',
      selector: '.propCard:last-child p:not(.subText)',
      type: 'text',
      styles: {},
      metadata: {
        label: 'Retailer Description',
        description: 'Main description for retailers',
        section: 'Value Propositions',
        editable: true,
        moveable: false,
        deletable: false
      }
    }
  };

  // Initialize elements from content
  useEffect(() => {
    if (siteContent.length > 0) {
      const newElements = siteContent
        .filter(item => contentMapping[item.key])
        .map(item => ({
          ...contentMapping[item.key],
          content: item.content,
          position: { x: 0, y: 0, width: 0, height: 0 }
        }));
      setElements(newElements);
    }
  }, [siteContent]);

  // Add change to history
  const addToHistory = useCallback((change: CMSChange) => {
    setHistory(prev => {
      const newChanges = prev.changes.slice(0, prev.currentIndex + 1);
      newChanges.push(change);
      return {
        changes: newChanges,
        currentIndex: newChanges.length - 1
      };
    });
  }, []);

  // Update element content
  const updateElementContent = useCallback((elementKey: string, newContent: string) => {
    const element = elements.find(el => el.key === elementKey);
    if (!element) return;

    const change: CMSChange = {
      elementKey,
      type: 'content',
      oldValue: element.content,
      newValue: newContent,
      timestamp: Date.now()
    };

    setPendingChanges(prev => ({ ...prev, [elementKey]: change }));
    addToHistory(change);

    // Update local element
    setElements(prev => prev.map(el => 
      el.key === elementKey ? { ...el, content: newContent } : el
    ));
  }, [elements, addToHistory]);

  // Update element position
  const updateElementPosition = useCallback((elementKey: string, newPosition: CMSElement['position']) => {
    const element = elements.find(el => el.key === elementKey);
    if (!element) return;

    const change: CMSChange = {
      elementKey,
      type: 'position',
      oldValue: element.position,
      newValue: newPosition,
      timestamp: Date.now()
    };

    setPendingChanges(prev => ({ ...prev, [`${elementKey}_position`]: change }));
    addToHistory(change);

    setElements(prev => prev.map(el => 
      el.key === elementKey ? { ...el, position: newPosition } : el
    ));
  }, [elements, addToHistory]);

  // Undo last change
  const undo = useCallback(() => {
    if (history.currentIndex >= 0) {
      const change = history.changes[history.currentIndex];
      
      // Revert the change
      if (change.type === 'content') {
        setElements(prev => prev.map(el => 
          el.key === change.elementKey ? { ...el, content: change.oldValue } : el
        ));
      } else if (change.type === 'position') {
        setElements(prev => prev.map(el => 
          el.key === change.elementKey ? { ...el, position: change.oldValue } : el
        ));
      }

      setHistory(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  }, [history]);

  // Redo last undone change
  const redo = useCallback(() => {
    if (history.currentIndex < history.changes.length - 1) {
      const change = history.changes[history.currentIndex + 1];
      
      // Apply the change
      if (change.type === 'content') {
        setElements(prev => prev.map(el => 
          el.key === change.elementKey ? { ...el, content: change.newValue } : el
        ));
      } else if (change.type === 'position') {
        setElements(prev => prev.map(el => 
          el.key === change.elementKey ? { ...el, position: change.newValue } : el
        ));
      }

      setHistory(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    }
  }, [history]);

  // Save all pending changes
  const saveChanges = useCallback(async () => {
    const contentChanges = Object.values(pendingChanges).filter(change => change.type === 'content');
    let successCount = 0;

    for (const change of contentChanges) {
      const success = await updateSiteContentByKey(change.elementKey, { content: change.newValue });
      if (success) successCount++;
    }

    if (successCount === contentChanges.length) {
      setPendingChanges({});
      return { success: true, message: `Successfully saved ${successCount} changes!` };
    } else {
      return { success: false, message: `Saved ${successCount} of ${contentChanges.length} changes. Some changes failed.` };
    }
  }, [pendingChanges, updateSiteContentByKey]);

  // Discard all pending changes
  const discardChanges = useCallback(() => {
    setPendingChanges({});
    setSelectedElement(null);
    setIsEditing(false);
    
    // Reset elements to original content
    if (siteContent.length > 0) {
      const resetElements = siteContent
        .filter(item => contentMapping[item.key])
        .map(item => ({
          ...contentMapping[item.key],
          content: item.content,
          position: elements.find(el => el.key === item.key)?.position || { x: 0, y: 0, width: 0, height: 0 }
        }));
      setElements(resetElements);
    }
  }, [siteContent, elements]);

  return {
    // State
    elements,
    selectedElement,
    pendingChanges,
    history,
    previewMode,
    isEditing,
    loading,

    // Actions
    setSelectedElement,
    setPreviewMode,
    setIsEditing,
    updateElementContent,
    updateElementPosition,
    undo,
    redo,
    saveChanges,
    discardChanges,

    // Computed
    hasChanges: Object.keys(pendingChanges).length > 0,
    canUndo: history.currentIndex >= 0,
    canRedo: history.currentIndex < history.changes.length - 1,
    changeCount: Object.keys(pendingChanges).length
  };
};
