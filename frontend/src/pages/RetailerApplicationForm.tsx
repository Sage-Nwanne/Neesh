import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
// Note: We'll use simple alert for now since toast hook isn't available
import { Store, MapPin, User, Briefcase, Palette } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './RetailerApplicationForm.module.css';

import StepNav from '../components/form/StepNav';
import StepProgress from '../components/form/StepProgress';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// --- constants (same as before) ---
const STORE_CATEGORIES = ['Independent Bookstore','Coffee Shop/Cafe','Boutique/Fashion','Gift Shop','Art Gallery','Museum Shop','Hotel/Lobby Shop','University Bookstore','Lifestyle Store','Other'] as const;
const STORE_TYPES = ['Independent','Small Chain (2-5 locations)','Regional Chain (6-20 locations)','National Chain (20+ locations)'] as const;
const STORE_SIZES = ['Small (under 1,000 sq ft)','Medium (1,000-3,000 sq ft)','Large (over 3,000 sq ft)'] as const;
const TARGET_CUSTOMERS = ['Young Adults (18-30)','Millennials (30-40)','Gen X (40-55)','Baby Boomers (55+)', 'Families with Children','Students','Tourists/Visitors','Art & Design Enthusiasts','Local Community'] as const;
const AESTHETIC_PREFERENCES = ['Minimalist/Clean','Vintage/Retro','Eclectic/Bohemian','Modern/Contemporary','Industrial/Urban','Cozy/Homey','Sophisticated/Upscale','Artistic/Creative'] as const;
const POS_SYSTEMS = ['Square','Shopify POS','Clover','Toast','Lightspeed','Vend','Cash Register','Other'] as const;
const MAGAZINE_SOURCES = ['Ubiquity Distributors','Ingram Periodicals','TNG','Direct from Publishers','Local Distributors','None Currently','Other'] as const;
const DELIVERY_FREQUENCIES = ['Weekly','Bi-weekly','Monthly','Quarterly','As Needed'] as const;
const INTERESTED_GENRES = ['Art & Design','Culture & Society','Fashion & Style','Food & Drink','Lifestyle','Literature & Poetry','Music','Photography','Politics & Current Affairs','Science & Technology','Travel','Independent/Zines'] as const;

// --- schema (unchanged core, but we’ll reuse per-step) ---
const RetailerSchema = z.object({
  shop_name: z.string().min(1, 'Shop name is required'),
  business_address_line_1: z.string().min(1, 'Address is required'),
  business_address_line_2: z.string().optional().default(''),
  business_city: z.string().min(1, 'City is required'),
  business_state: z.string().min(1, 'State is required'),
  business_zip_code: z.string().min(1, 'ZIP code is required'),
  business_country: z.string().default('US'),

  store_category: z.enum(STORE_CATEGORIES, { required_error: 'Select a category' }),
  store_type: z.enum(STORE_TYPES, { required_error: 'Select a store type' }),
  store_size: z.enum(STORE_SIZES, { required_error: 'Select a store size' }),

  target_customers: z.array(z.enum(TARGET_CUSTOMERS)).min(1, 'Select at least one target customer'),
  aesthetic_preferences: z.array(z.enum(AESTHETIC_PREFERENCES)).min(1, 'Select at least one aesthetic'),

  buyer_name: z.string().min(1, 'Buyer name is required'),
  buyer_email: z.string().email('Enter a valid email'),
  buyer_phone: z.string().optional().default(''),

  pos_system: z.enum(POS_SYSTEMS).optional().or(z.literal('')).transform(v => v ?? ''),
  current_magazine_sources: z.array(z.enum(MAGAZINE_SOURCES)).optional().default([]),

  monthly_magazine_budget: z
    .union([z.string(), z.number(), z.null()])
    .transform(v => (typeof v === 'string' && v.trim() === '' ? null : typeof v === 'string' ? Number(v) : v))
    .refine(v => v === null || (typeof v === 'number' && v >= 0 && isFinite(v as number)), 'Must be a positive number'),

  preferred_delivery_frequency: z.enum(DELIVERY_FREQUENCIES).optional().or(z.literal('')).transform(v => v ?? ''),
  years_in_business: z
    .union([z.string(), z.number(), z.null()])
    .transform(v => (typeof v === 'string' && v.trim() === '' ? null : typeof v === 'string' ? Number(v) : v))
    .refine(v => v === null || (typeof v === 'number' && v >= 0 && Number.isInteger(v)), 'Must be an integer ≥ 0'),

  current_magazine_titles: z.array(z.string()).optional().default([]),
  interested_genres: z.array(z.enum(INTERESTED_GENRES)).optional().default([])
});
type RetailerForm = z.infer<typeof RetailerSchema>;

// step labels
const STEPS = ['Shop', 'Address', 'Profile', 'Ops'] as const;

export default function RetailerApplicationForm() {
  // For now, we'll simulate a user since we don't have auth context
  const user = { id: 'temp-user-id', email: 'temp@example.com' };
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState({ cat: false, type: false, size: false });
  const anyMenuOpen = menuOpen.cat || menuOpen.type || menuOpen.size;

  const defaultValues = useMemo<RetailerForm>(() => ({
    shop_name: '',
    business_address_line_1: '',
    business_address_line_2: '',
    business_city: '',
    business_state: '',
    business_zip_code: '',
    business_country: 'US',
    store_category: undefined as unknown as RetailerForm['store_category'],
    store_type: undefined as unknown as RetailerForm['store_type'],
    store_size: undefined as unknown as RetailerForm['store_size'],
    target_customers: [],
    aesthetic_preferences: [],
    buyer_name: '',
    buyer_email: user?.email ?? '',
    buyer_phone: '',
    pos_system: '',
    current_magazine_sources: [],
    monthly_magazine_budget: null,
    preferred_delivery_frequency: '',
    years_in_business: null,
    current_magazine_titles: [],
    interested_genres: []
  }), [user?.email]);

  const { register, control, handleSubmit, trigger, setValue, getValues, formState: { errors, isSubmitting } } =
    useForm<RetailerForm>({ resolver: zodResolver(RetailerSchema), defaultValues, mode: 'onBlur' });

  // helper to toggle string-in-array for Checkbox groups
  const toggleInArray = (field: keyof RetailerForm, value: string, checked: boolean) => {
    const current = (getValues(field as any) as string[]) ?? [];
    const next = checked ? Array.from(new Set([...current, value])) : current.filter(v => v !== value);
    setValue(field as any, next, { shouldValidate: true, shouldDirty: true });
  };

  // basic phone formatter (US) — keeps it lightweight
  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 10);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 10);
    if (digits.length > 6) return `(${p1}) ${p2}-${p3}`;
    if (digits.length > 3) return `(${p1}) ${p2}`;
    if (digits.length > 0) return `(${p1}`;
    return '';
  };

  // fields per step for partial validation
  const stepFields: (keyof RetailerForm)[][] = [
    // Step 0: Shop
    ['shop_name','store_category','store_type','store_size','years_in_business','buyer_name','buyer_email','buyer_phone'],
    // Step 1: Address
    ['business_address_line_1','business_address_line_2','business_city','business_state','business_zip_code'],
    // Step 2: Profile
    ['target_customers','aesthetic_preferences','interested_genres'],
    // Step 3: Ops
    ['pos_system','preferred_delivery_frequency','monthly_magazine_budget','current_magazine_sources','current_magazine_titles']
  ];

  const next = async () => {
    const fields = stepFields[step];
    const ok = await trigger(fields as any, { shouldFocus: true });
    if (!ok) return;
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => setStep(s => Math.max(s - 1, 0));

  const onSubmit = async (data: RetailerForm) => {
    if (!user?.id) {
      toast({ title: 'Sign in required', description: 'Please sign in before submitting.', variant: 'destructive' });
      return;
    }
    try {
      const { error } = await supabase.from('retailer_applications').insert({ user_id: user.id, ...data });
      if (error) throw error;
      toast({ title: 'Application submitted!', description: "We’ll review and respond within 2–3 business days." });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Submission failed', description: err?.message ?? 'An error occurred.', variant: 'destructive' });
    }
  };

  // convenience
  const StepShop = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" /> Shop Information
        </CardTitle>
        <CardDescription>Tell us about your store and buyer contact</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shop_name">Shop Name *</Label>
            <Input id="shop_name" {...register('shop_name')} placeholder="Your store name"
              aria-invalid={!!errors.shop_name} autoComplete="organization" />
            {errors.shop_name && <p className="text-sm text-destructive">{errors.shop_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Store Category *</Label>
            <Controller name="store_category" control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(o: boolean) => setMenuOpen((s) => ({ ...s, cat: o }))}
                >
                  <SelectTrigger
                    className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between ${
                      errors.store_category ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={8} className="z-50">
                    {STORE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.store_category && <p className="text-sm text-destructive">{errors.store_category.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Store Type *</Label>
            <Controller name="store_type" control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(o: boolean) => setMenuOpen((s) => ({ ...s, type: o }))}
                >
                  <SelectTrigger
                    className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between ${
                      errors.store_type ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={8} className="z-50">
                    {STORE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.store_type && <p className="text-sm text-destructive">{errors.store_type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Store Size *</Label>
            <Controller name="store_size" control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(o: boolean) => setMenuOpen((s) => ({ ...s, size: o }))}
                >
                  <SelectTrigger
                    className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between ${
                      errors.store_size ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={8} className="z-50">
                    {STORE_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.store_size && <p className="text-sm text-destructive">{errors.store_size.message}</p>}
          </div>
        </div>

        {/* Spacer to push subsequent content down while a menu is open */}
        {anyMenuOpen && <div className={styles.dropdownSpacer} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="years_in_business">Years in Business</Label>
            <Input id="years_in_business" inputMode="numeric" {...register('years_in_business')}
              placeholder="e.g., 3" aria-invalid={!!errors.years_in_business} />
            {errors.years_in_business && <p className="text-sm text-destructive">{errors.years_in_business.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyer_name">Buyer Name *</Label>
            <Input id="buyer_name" {...register('buyer_name')} autoComplete="name" aria-invalid={!!errors.buyer_name} />
            {errors.buyer_name && <p className="text-sm text-destructive">{errors.buyer_name.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buyer_email">Email Address *</Label>
            <Input id="buyer_email" type="email" {...register('buyer_email')} autoComplete="email"
              aria-invalid={!!errors.buyer_email} />
            {errors.buyer_email && <p className="text-sm text-destructive">{errors.buyer_email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyer_phone">Phone Number</Label>
            <Controller name="buyer_phone" control={control}
              render={({ field }) => (
                <Input
                  id="buyer_phone"
                  inputMode="tel"
                  placeholder="(555) 123-4567"
                  value={field.value}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StepAddress = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Business Address</CardTitle>
        <CardDescription>Where should we ship your orders?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business_address_line_1">Address Line 1 *</Label>
          <Input id="business_address_line_1" {...register('business_address_line_1')}
            autoComplete="address-line1" aria-invalid={!!errors.business_address_line_1} />
          {errors.business_address_line_1 && <p className="text-sm text-destructive">{errors.business_address_line_1.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_address_line_2">Address Line 2</Label>
          <Input id="business_address_line_2" {...register('business_address_line_2')} autoComplete="address-line2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business_city">City *</Label>
            <Input id="business_city" {...register('business_city')} autoComplete="address-level2"
              aria-invalid={!!errors.business_city} />
            {errors.business_city && <p className="text-sm text-destructive">{errors.business_city.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_state">State *</Label>
            <Input id="business_state" {...register('business_state')} autoComplete="address-level1"
              aria-invalid={!!errors.business_state} />
            {errors.business_state && <p className="text-sm text-destructive">{errors.business_state.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_zip_code">ZIP Code *</Label>
            <Input id="business_zip_code" {...register('business_zip_code')} inputMode="numeric" autoComplete="postal-code"
              aria-invalid={!!errors.business_zip_code} />
            {errors.business_zip_code && <p className="text-sm text-destructive">{errors.business_zip_code.message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StepProfile = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Store Profile</CardTitle>
        <CardDescription>Help us recommend the best magazines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Target Customers *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TARGET_CUSTOMERS.map(c => (
              <div key={c} className="flex items-center space-x-2">
                <Controller name="target_customers" control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`customer-${c}`}
                      checked={(field.value ?? []).includes(c)}
                      onCheckedChange={(checked) => toggleInArray('target_customers', c, !!checked)}
                    />
                  )}
                />
                <Label htmlFor={`customer-${c}`} className="text-sm">{c}</Label>
              </div>
            ))}
          </div>
          {errors.target_customers && <p className="text-sm text-destructive">{errors.target_customers.message}</p>}
        </div>

        <div className="space-y-3">
          <Label>Store Aesthetic *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AESTHETIC_PREFERENCES.map(a => (
              <div key={a} className="flex items-center space-x-2">
                <Controller name="aesthetic_preferences" control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`aesthetic-${a}`}
                      checked={(field.value ?? []).includes(a)}
                      onCheckedChange={(checked) => toggleInArray('aesthetic_preferences', a, !!checked)}
                    />
                  )}
                />
                <Label htmlFor={`aesthetic-${a}`} className="text-sm">{a}</Label>
              </div>
            ))}
          </div>
          {errors.aesthetic_preferences && <p className="text-sm text-destructive">{errors.aesthetic_preferences.message}</p>}
        </div>

        <div className="space-y-3">
          <Label>Interested Genres</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INTERESTED_GENRES.map(g => (
              <div key={g} className="flex items-center space-x-2">
                <Controller name="interested_genres" control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`genre-${g}`}
                      checked={(field.value ?? []).includes(g)}
                      onCheckedChange={(checked) => toggleInArray('interested_genres', g, !!checked)}
                    />
                  )}
                />
                <Label htmlFor={`genre-${g}`} className="text-sm">{g}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StepOps = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Business Operations</CardTitle>
        <CardDescription>Tell us about your sourcing and systems</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>POS System</Label>
            <Controller name="pos_system" control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select POS system" /></SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    {POS_SYSTEMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred Delivery Frequency</Label>
            <Controller name="preferred_delivery_frequency" control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    {DELIVERY_FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Budget slider + input (sync both) */}
        <div className="space-y-2">
          <Label htmlFor="monthly_magazine_budget">Monthly Magazine Budget</Label>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-3">
            <Controller
              name="monthly_magazine_budget"
              control={control}
              render={({ field }) => (
                <>
                  <Slider
                    value={[typeof field.value === 'number' ? field.value : 0]}
                    min={0}
                    max={5000}
                    step={50}
                    onValueChange={(val) => field.onChange(val[0])}
                  />
                  <Input
                    id="monthly_magazine_budget"
                    inputMode="decimal"
                    className="w-28"
                    value={field.value === null || field.value === undefined ? '' : String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="e.g., 500"
                  />
                </>
              )}
            />
          </div>
          {errors.monthly_magazine_budget && <p className="text-sm text-destructive">{errors.monthly_magazine_budget.message}</p>}
        </div>

        <div className="space-y-3">
          <Label>Current Magazine Sources</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {MAGAZINE_SOURCES.map(s => (
              <div key={s} className="flex items-center space-x-2">
                <Controller name="current_magazine_sources" control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`source-${s}`}
                      checked={(field.value ?? []).includes(s)}
                      onCheckedChange={(checked) => toggleInArray('current_magazine_sources', s, !!checked)}
                    />
                  )}
                />
                <Label htmlFor={`source-${s}`} className="text-sm">{s}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_magazine_titles">Current Magazine Titles</Label>
          <Textarea
            id="current_magazine_titles"
            placeholder="List magazines you currently stock (comma-separated)"
            {...register('current_magazine_titles', {
              setValueAs: (v: string) =>
                (v ?? '')
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
            })}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const screens = [StepShop, StepAddress, StepProfile, StepOps];

  return (
    <div className={`min-h-screen bg-background ${styles.formContainer}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">Stock curated indie magazines with low risk and full visibility into sell-through</h1>
          </div>

          <StepProgress steps={STEPS as unknown as string[]} current={step} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="px-6 md:px-12 py-12">
              {screens[step]}
            </div>

            {step < STEPS.length - 1 ? (
              <StepNav
                current={step}
                total={STEPS.length}
                onPrev={prev}
                onNext={next}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className="flex items-center justify-between">
                <Button type="button" variant="outline" onClick={prev} disabled={isSubmitting}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="btn-primary px-12 py-3 text-lg">
                  {isSubmitting ? 'Submitting…' : 'Submit Application'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
