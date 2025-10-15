import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface SiteContent {
  id: string;
  key: string;
  title: string;
  content: string;
  metadata: any;
  is_active: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  position: number;
  is_active: boolean;
}

export interface LandingPageSection {
  id: string;
  page_type: 'publisher' | 'retailer';
  section_type: 'hero' | 'benefits' | 'how_it_works' | 'requirements';
  title: string;
  subtitle: string;
  content: string;
  metadata: any;
  position: number;
  is_active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  position: number;
  is_active: boolean;
}

export const useContentManagement = () => {
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [landingPageSections, setLandingPageSections] = useState<LandingPageSection[]>([]);
  const [faqItems, setFAQItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all content
  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: contentData, error: contentError },
        { data: navData, error: navError },
        { data: landingData, error: landingError },
        { data: faqData, error: faqError }
      ] = await Promise.all([
        supabase.from('site_content').select('*').order('key'),
        supabase.from('navigation_items').select('*').order('position'),
        supabase.from('landing_page_sections').select('*').order('page_type, position'),
        supabase.from('faq_items').select('*').order('position')
      ]);

      if (contentError) throw contentError;
      if (navError) throw navError;
      if (landingError) throw landingError;
      if (faqError) throw faqError;

      setSiteContent(contentData || []);
      setNavigationItems(navData || []);
      setLandingPageSections(landingData || []);
      setFAQItems(faqData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  // Get content by key
  const getContentByKey = (key: string): string => {
    const content = siteContent.find(item => item.key === key && item.is_active);
    return content?.content || '';
  };

  // Get styles by key
  const getStylesByKey = (key: string): any => {
    const content = siteContent.find(item => item.key === key && item.is_active);
    return content?.metadata?.styles || {};
  };

  // Get custom CSS by key
  const getCustomCSSByKey = (key: string): string => {
    const content = siteContent.find(item => item.key === key && item.is_active);
    return content?.metadata?.customCSS || '';
  };

  // Update site content
  const updateSiteContent = async (id: string, updates: Partial<SiteContent>) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchContent(); // Refresh data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return false;
    }
  };

  // Update site content by key
  const updateSiteContentByKey = async (key: string, updates: Partial<SiteContent>) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .update(updates)
        .eq('key', key);

      if (error) throw error;
      await fetchContent(); // Refresh data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return false;
    }
  };

  // Update navigation item
  const updateNavigationItem = async (id: string, updates: Partial<NavigationItem>) => {
    try {
      const { error } = await supabase
        .from('navigation_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchContent(); // Refresh data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update navigation');
      return false;
    }
  };

  // Update landing page section
  const updateLandingPageSection = async (id: string, updates: Partial<LandingPageSection>) => {
    try {
      const { error } = await supabase
        .from('landing_page_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchContent(); // Refresh data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update landing page section');
      return false;
    }
  };

  // Update FAQ item
  const updateFAQItem = async (id: string, updates: Partial<FAQItem>) => {
    try {
      const { error } = await supabase
        .from('faq_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchContent(); // Refresh data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update FAQ item');
      return false;
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    siteContent,
    navigationItems,
    landingPageSections,
    faqItems,
    loading,
    error,
    getContentByKey,
    getStylesByKey,
    getCustomCSSByKey,
    updateSiteContent,
    updateSiteContentByKey,
    updateNavigationItem,
    updateLandingPageSection,
    updateFAQItem,
    refreshContent: fetchContent
  };
};
