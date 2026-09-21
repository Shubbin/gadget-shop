import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Link as LinkIcon,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Product, StockStatus, GadgetCondition, StorageVariant, ColorVariant } from '@/types';

export interface SubPictureItem {
  id: string;
  url: string;
  colorName?: string;
}

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export default function ProductUploadModal({ isOpen, onClose, productToEdit }: ProductUploadModalProps) {
  const { categories, addProduct, updateProduct, addCategory, addSubCategory } = useAdmin();

  // Basic Details
  const [name, setName] = useState(productToEdit?.name || '');
  const [parentCategory, setParentCategory] = useState(
    productToEdit?.parentCategory || categories[0]?.name || 'Apple Devices'
  );
  const [subCategory, setSubCategory] = useState(
    productToEdit?.subCategory || categories[0]?.subCategories[0] || 'iPhones'
  );
  const [price, setPrice] = useState(productToEdit?.price?.toString() || '');
  const [oldPrice, setOldPrice] = useState(productToEdit?.oldPrice?.toString() || '');
  const [discountBadge, setDiscountBadge] = useState(productToEdit?.discountBadge || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [isFeatured, setIsFeatured] = useState(productToEdit?.isFeatured || false);

  // Stock / Availability
  const [stockStatus, setStockStatus] = useState<StockStatus>(productToEdit?.stockStatus || 'available');

  // Condition
  const [condition, setCondition] = useState<GadgetCondition>(productToEdit?.condition || 'london_used');
  const [customConditionNote, setCustomConditionNote] = useState(productToEdit?.customConditionNote || '');

  // Media: Primary Hero Main Picture
  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');
  const [imageUrl, setImageUrl] = useState(productToEdit?.image || '');
  const [previewImage, setPreviewImage] = useState(productToEdit?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Media: Sub-Pictures Gallery (up to 5 additional pictures)
  const [subImages, setSubImages] = useState<SubPictureItem[]>(() => {
    if (productToEdit?.images && productToEdit.images.length > 1) {
      return productToEdit.images.slice(1, 6).map((img, idx) => ({
        id: `sub-${idx}-${Date.now()}`,
        url: img,
        colorName: productToEdit.colors?.find(c => c.image === img)?.name || undefined,
      }));
    }
    return [];
  });
  const [subUploadMode, setSubUploadMode] = useState<'device' | 'url'>('device');
  const [subInputUrl, setSubInputUrl] = useState('');
  const [subSelectedColor, setSubSelectedColor] = useState('');
  const subFileInputRef = useRef<HTMLInputElement>(null);

  // Variants: Storage
  const [storageOptions, setStorageOptions] = useState<StorageVariant[]>(
    productToEdit?.storageOptions || [
      { capacity: '128GB', priceDelta: 0, available: true },
      { capacity: '256GB', priceDelta: 60000, available: true },
      { capacity: '512GB', priceDelta: 130000, available: true },
    ]
  );
  const [newCapacity, setNewCapacity] = useState('');
  const [newDelta, setNewDelta] = useState('');

  // Variants: Colors
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    productToEdit?.colorVariants || [
      { name: 'Space Black', hex: '#232325', available: true },
      { name: 'Silver', hex: '#e2e2e4', available: true },
      { name: 'Deep Purple', hex: '#581c87', available: true },
    ]
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#7c3aed');

  // Dynamic Specs
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>(
    productToEdit?.specs || [
      { name: 'Display', value: '6.7-inch OLED 120Hz' },
      { name: 'Battery Health', value: '100% Factory Tested' },
      { name: 'Warranty', value: '6 Months Store Warranty' },
    ]
  );
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Category creation modal toggle
  const [showCatCreator, setShowCatCreator] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newSubCatName, setNewSubCatName] = useState('');

  if (!isOpen) return null;

  // Selected parent category object
  const currentCategoryObj = categories.find(
    (c) => c.name.toLowerCase() === parentCategory.toLowerCase()
  );

  // File Upload Handler (Device)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubImage = (url: string, color?: string) => {
    if (subImages.length >= 5) {
      alert('Maximum of 5 additional sub-pictures allowed.');
      return;
    }
    if (!url.trim()) return;
    setSubImages(prev => [
      ...prev,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        url: url.trim(),
        colorName: color?.trim() || undefined,
      },
    ]);
    setSubInputUrl('');
    setSubSelectedColor('');
  };

  const handleSubFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAddSubImage(reader.result as string, subSelectedColor);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleRemoveSubImage = (id: string) => {
    setSubImages(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateSubColor = (id: string, colorName: string) => {
    setSubImages(prev =>
      prev.map(s => (s.id === id ? { ...s, colorName: colorName || undefined } : s))
    );
  };

  const handleAddStorage = () => {
    if (newCapacity.trim()) {
      setStorageOptions([
        ...storageOptions,
        { capacity: newCapacity.trim(), priceDelta: Number(newDelta) || 0, available: true },
      ]);
      setNewCapacity('');
      setNewDelta('');
    }
  };

  const handleRemoveStorage = (idx: number) => {
    setStorageOptions(storageOptions.filter((_, i) => i !== idx));
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColorVariants([
        ...colorVariants,
        { name: newColorName.trim(), hex: newColorHex, available: true },
      ]);
      setNewColorName('');
    }
  };

  const handleRemoveColor = (idx: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== idx));
  };

  const handleAddSpec = () => {
    if (newSpecKey.trim() && newSpecVal.trim()) {
      setSpecs([...specs, { name: newSpecKey.trim(), value: newSpecVal.trim() }]);
      setNewSpecKey('');
      setNewSpecVal('');
    }
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory(newCatName.trim(), 'Smartphone', newSubCatName.trim() ? [newSubCatName.trim()] : []);
      setParentCategory(newCatName.trim());
      if (newSubCatName.trim()) setSubCategory(newSubCatName.trim());
      setNewCatName('');
      setNewSubCatName('');
      setShowCatCreator(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('Please provide at least a Product Name and Base Price.');
      return;
    }

    const finalImage = previewImage || imageUrl || '/images/products/iphone-16-pro.jpg';
    const finalSubImages = subImages.map(s => s.url);
    const allImages = [finalImage, ...finalSubImages];

    // Map color variants to images if associated
    const mappedColors = colorVariants.map((c) => {
      const linkedSub = subImages.find(s => s.colorName?.toLowerCase() === c.name.toLowerCase());
      return {
        name: c.name,
        hex: c.hex,
        image: linkedSub ? linkedSub.url : (c.name.toLowerCase().includes('default') ? finalImage : undefined),
      };
    });

    const productPayload: Product = {
      id: productToEdit?.id || `gs-gadget-${Date.now()}`,
      name: name.trim(),
      category: parentCategory,
      parentCategory,
      subCategory,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      discountBadge: discountBadge.trim() || undefined,
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 1,
      inStock: stockStatus === 'available',
      stockStatus,
      condition,
      customConditionNote: customConditionNote.trim() || undefined,
      isFeatured,
      image: finalImage,
      images: allImages,
      description: description.trim() || `${name} in ${condition.replace('_', ' ')} condition. Tested & verified.`,
      specs,
      colors: mappedColors,
      colorVariants,
      storageOptions,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-[#7c3aed] uppercase bg-purple-50 px-2 py-0.5 rounded">
              {productToEdit ? 'EDIT EXISTING GADGET' : 'INVENTORY MANAGEMENT'}
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              {productToEdit ? `Edit: ${productToEdit.name}` : 'Upload New Gadget / Device'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section 1A: Primary Hero Main Picture */}
          <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold text-[#7c3aed] uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Primary Catalog Photo (Hero)
                </span>
                <label className="font-bold text-slate-900 block text-xs mt-1">
                  Main Picture (Default Showcase)
                </label>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setUploadMode('device')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                    uploadMode === 'device'
                      ? 'bg-[#7c3aed] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" /> From Device
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                    uploadMode === 'url'
                      ? 'bg-[#7c3aed] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Image URL
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview Thumbnail */}
              <div className="relative w-28 h-28 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                {previewImage ? (
                  <img src={previewImage} alt="Main Preview" className="object-contain p-2 w-full h-full" />
                ) : (
                  <div className="text-center p-2 text-slate-400 text-[10px]">
                    <UploadCloud className="w-6 h-6 mx-auto mb-1 text-purple-300" />
                    No Main Photo
                  </div>
                )}
              </div>

              {/* Upload Input Area */}
              <div className="flex-1 w-full space-y-2">
                {uploadMode === 'device' ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-200 hover:border-[#7c3aed] bg-white rounded-xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-5 h-5 text-[#7c3aed] mx-auto mb-1" />
                    <p className="font-bold text-slate-800 text-xs">
                      Click to browse or drag &amp; drop main hero photo
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Paste main photo URL (https://...)"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setPreviewImage(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    />
                    <p className="text-[10px] text-slate-400">
                      High-resolution front/angle hero shot for catalog listing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 1B: Sub-Pictures Gallery (Up to 5 Additional Photos) */}
          <div className="space-y-3 bg-purple-50/40 p-4 rounded-xl border border-purple-200/70">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold text-[#7c3aed] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-purple-200">
                  Sub-Pictures Gallery (Up to 5 Photos)
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Upload additional device angles, close-ups, or link photos to color finishes.
                </p>
              </div>
              <span className="text-xs font-black text-[#7c3aed] bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                {subImages.length} / 5 Slots
              </span>
            </div>

            {/* Gallery Grid (Up to 5 slots) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {subImages.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl border border-purple-200 p-2 space-y-2 relative group shadow-2xs flex flex-col"
                >
                  <div className="w-full h-20 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center relative">
                    <img src={sub.url} alt={`Sub ${idx + 1}`} className="object-contain w-full h-full p-1" />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubImage(sub.id)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-90 hover:opacity-100 shadow-xs cursor-pointer"
                      title="Remove Sub-Picture"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white font-bold text-[9px] px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Link to Color Variant */}
                  <div className="space-y-1 mt-auto">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block">Color Link:</label>
                    <select
                      value={sub.colorName || ''}
                      onChange={(e) => handleUpdateSubColor(sub.id, e.target.value)}
                      className="w-full text-[10px] bg-slate-50 border border-slate-200 rounded p-1 font-medium text-slate-800"
                    >
                      <option value="">No Color Link</option>
                      {colorVariants.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {/* Add New Sub-Picture Card if < 5 slots */}
              {subImages.length < 5 && (
                <div className="border-2 border-dashed border-purple-300 hover:border-[#7c3aed] bg-white/80 rounded-xl p-2.5 flex flex-col justify-between space-y-2 text-center transition-colors">
                  <div className="space-y-1">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7c3aed] flex items-center justify-center mx-auto">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 block">
                      Add Sub-Photo #{subImages.length + 1}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {/* Optional Color Link Selector */}
                    <select
                      value={subSelectedColor}
                      onChange={(e) => setSubSelectedColor(e.target.value)}
                      className="w-full text-[9px] bg-slate-50 border border-slate-200 rounded p-1 text-slate-700"
                    >
                      <option value="">Attach to Color (Optional)</option>
                      {colorVariants.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => subFileInputRef.current?.click()}
                        className="flex-1 py-1 px-1.5 bg-[#7c3aed] text-white rounded text-[9px] font-bold hover:bg-[#6d28d9] transition-colors"
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter sub-picture web image URL:');
                          if (url) handleAddSubImage(url, subSelectedColor);
                        }}
                        className="py-1 px-2 bg-slate-100 text-slate-700 rounded text-[9px] font-bold hover:bg-slate-200"
                      >
                        URL
                      </button>
                    </div>

                    <input
                      ref={subFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSubFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Title, Categories & Subcategories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Product Title / Device Name *
              </label>
              <input
                type="text"
                placeholder="e.g. iPhone 15 Pro Max 256GB"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>

            {/* Parent Category */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  Parent Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowCatCreator(true)}
                  className="text-[10px] font-bold text-[#7c3aed] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>
              <select
                value={parentCategory}
                onChange={(e) => {
                  setParentCategory(e.target.value);
                  const found = categories.find(
                    (c) => c.name.toLowerCase() === e.target.value.toLowerCase()
                  );
                  if (found && found.subCategories.length > 0) {
                    setSubCategory(found.subCategories[0]);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Category */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">Sub-Category</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              >
                {currentCategoryObj?.subCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                {!currentCategoryObj?.subCategories.length && <option value="General">General</option>}
              </select>
            </div>
          </div>

          {/* Inline Category Creator Form */}
          {showCatCreator && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#7c3aed] flex items-center gap-1">
                  <FolderPlus className="w-4 h-4" /> Add Custom Category or Subcategory
                </span>
                <button
                  type="button"
                  onClick={() => setShowCatCreator(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Apple Devices)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Subcategory (e.g. iPhones)"
                  value={newSubCatName}
                  onChange={(e) => setNewSubCatName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="bg-[#7c3aed] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#6d28d9]"
              >
                Save Category
              </button>
            </div>
          )}

          {/* Section 2B: Full Product Description */}
          <div className="space-y-1.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                Comprehensive Product Description *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {description.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Provide a detailed overview of hardware condition, cosmetic grade, battery health, accessories included, and functional testing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] leading-relaxed"
            />
            <p className="text-[10px] text-slate-400">
              This description is displayed on product detail tabs and storefront search snippets.
            </p>
          </div>

          {/* Section 3: Availability / Stock Status & Condition Tagging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
            {/* Stock Availability */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                Availability Status
              </label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                className={`w-full font-bold border rounded-xl p-2.5 text-xs focus:outline-none ${
                  stockStatus === 'available'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : stockStatus === 'sold'
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <option value="available">✅ Available (In Stock & Ready)</option>
                <option value="sold">🔴 SOLD (Mark as Sold Out)</option>
                <option value="out_of_stock">⚠️ Out of Stock (Temporary)</option>
                <option value="pre_order">📦 Pre-Order</option>
              </select>
            </div>

            {/* Condition Presets */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider">
                Gadget Condition / Origin
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as GadgetCondition)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              >
                <option value="brand_new">Brand New (Factory Sealed)</option>
                <option value="london_used">London Used (UK Used)</option>
                <option value="nigerian_used">Nigerian Used (Fairly Used)</option>
                <option value="refurbished">Certified Refurbished (Grade A)</option>
                <option value="open_box">Open Box (Like New)</option>
                <option value="custom">Custom Condition (Type Below)</option>
              </select>
            </div>

            {/* Custom Condition Note / Typing */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-600 text-[11px]">
                Custom Condition Note / Grading Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 'Direct UK Import', 'Battery Health 98%', 'Minor edge scratch', etc."
                value={customConditionNote}
                onChange={(e) => setCustomConditionNote(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>

          {/* Section 4: Pricing & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Base Price (₦) *
              </label>
              <input
                type="number"
                placeholder="e.g. 1250000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Old / Slash Price (₦)
              </label>
              <input
                type="number"
                placeholder="e.g. 1400000"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Discount Tag
              </label>
              <input
                type="text"
                placeholder="e.g. 10% OFF"
                value={discountBadge}
                onChange={(e) => setDiscountBadge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>

          {/* Section 5: Multi-Variant (Storage Tiers) */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 uppercase tracking-wider">
                Storage Capacity Options & Price Adders
              </label>
              <span className="text-[11px] text-slate-400">e.g. 128GB, 256GB</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {storageOptions.map((v, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-purple-50 text-[#7c3aed] border border-purple-200 px-3 py-1 rounded-lg text-xs font-bold"
                >
                  {v.capacity} (+₦{v.priceDelta.toLocaleString()})
                  <button
                    type="button"
                    onClick={() => handleRemoveStorage(idx)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Capacity (e.g. 1TB)"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
              <input
                type="number"
                placeholder="Price Diff (₦)"
                value={newDelta}
                onChange={(e) => setNewDelta(e.target.value)}
                className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddStorage}
                className="bg-purple-100 hover:bg-purple-200 text-[#7c3aed] text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Storage
              </button>
            </div>
          </div>

          {/* Section 6: Color Swatches */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="font-bold text-slate-800 uppercase tracking-wider">
              Available Color Finishes
            </label>
            <div className="flex flex-wrap gap-2">
              {colorVariants.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Color Name (e.g. Natural Titanium)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-10 h-8 p-0 border border-slate-200 rounded cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-purple-100 hover:bg-purple-200 text-[#7c3aed] text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Color
              </button>
            </div>
          </div>

          {/* Section 7: Specs & Description */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="font-bold text-slate-800 uppercase tracking-wider">
              Key Technical Specifications
            </label>
            <div className="space-y-1.5">
              {specs.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <span className="font-bold text-slate-700">{s.name}:</span>
                  <span className="text-slate-600 flex-1 px-3 truncate">{s.value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Spec Key (e.g. RAM)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
              <input
                type="text"
                placeholder="Spec Value (e.g. 16GB Unified Memory)"
                value={newSpecVal}
                onChange={(e) => setNewSpecVal(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="bg-purple-100 hover:bg-purple-200 text-[#7c3aed] text-xs font-bold px-3 py-2 rounded-lg"
              >
                Add Spec
              </button>
            </div>
          </div>

          {/* Featured Showcase Toggle */}
          <div className="border-t border-slate-100 pt-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#7c3aed] focus:ring-[#7c3aed]"
              />
              <span className="font-bold text-slate-800 text-xs">
                Display as Flagship Featured Gadget on Homepage Showcase
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {productToEdit ? 'Save Changes' : 'Publish Gadget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
