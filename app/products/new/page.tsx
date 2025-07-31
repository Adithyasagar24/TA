'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Camera, 
  Upload, 
  Package, 
  Shield,
  ChevronRight,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().optional(),
  category: z.string().optional(),
  barcode: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  'Food & Beverages',
  'Personal Care & Beauty',
  'Health & Supplements',
  'Household & Cleaning',
  'Clothing & Textiles',
  'Electronics',
  'Baby & Kids',
  'Pet Care',
  'Other'
];

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialSearch,
      brand: '',
      category: '',
      barcode: '',
      description: '',
      imageUrl: '',
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (initialSearch) {
      setValue('name', initialSearch);
    }
  }, [initialSearch, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create product record
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imageUrl: uploadedImage,
          userId: 'temp-user-id', // TODO: Replace with actual user ID from auth
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const result = await response.json();
      
      toast.success('Product created successfully!');
      
      // Redirect to questionnaire
      window.location.href = `/products/${result.data.id}/questionnaire`;
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarcodeInput = (barcode: string) => {
    setValue('barcode', barcode);
    setShowBarcodeScanner(false);
    // TODO: Implement barcode lookup to auto-fill product details
    toast.success('Barcode captured! You can now fill in additional details.');
  };

  const clearImage = () => {
    setUploadedImage(null);
    setValue('imageUrl', '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold text-gray-900">New Product Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-primary">Product Info</span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Questionnaire</span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Report</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tell Us About Your Product
              </h1>
              <p className="text-gray-600">
                Provide basic information about the product you'd like to analyze. 
                We'll use this to generate intelligent questions for a comprehensive transparency report.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Image */}
              <div>
                <label className="form-label">Product Image (Optional)</label>
                <div className="mt-1">
                  {uploadedImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={uploadedImage} 
                        alt="Product" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowBarcodeScanner(true)}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Take Photo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label htmlFor="name" className="form-label">
                  Product Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  placeholder="e.g., Organic Almond Milk, iPhone 15 Pro, etc."
                  className="form-input"
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="form-label">
                  Brand
                </label>
                <input
                  {...register('brand')}
                  type="text"
                  id="brand"
                  placeholder="e.g., Silk, Apple, Nike"
                  className="form-input"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  {...register('category')}
                  id="category"
                  className="form-input"
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barcode */}
              <div>
                <label htmlFor="barcode" className="form-label">
                  Barcode/UPC
                </label>
                <div className="flex space-x-2">
                  <input
                    {...register('barcode')}
                    type="text"
                    id="barcode"
                    placeholder="Enter or scan barcode"
                    className="form-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBarcodeScanner(true)}
                    className="bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="form-label">
                  Additional Information
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={4}
                  placeholder="Any additional details about the product that might be relevant for analysis..."
                  className="form-input"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Next: We'll ask intelligent questions about this product
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !watchedValues.name?.trim()}
                  className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Start Questionnaire
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* How It Works */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What happens next?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Intelligent Questions</h4>
                  <p className="text-sm text-gray-600">We'll ask targeted questions based on your product category and the information you need.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dynamic Follow-ups</h4>
                  <p className="text-sm text-gray-600">Based on your answers, we'll ask relevant follow-up questions for deeper insights.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Transparency Report</h4>
                  <p className="text-sm text-gray-600">Get a comprehensive report with scores, analysis, and recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Scan Barcode</h3>
              <button
                onClick={() => setShowBarcodeScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-8">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Camera functionality would be implemented here using a barcode scanning library.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Or enter barcode manually"
                  className="form-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      handleBarcodeInput(e.currentTarget.value);
                    }
                  }}
                />
                <p className="text-xs text-gray-500">
                  Press Enter after typing the barcode
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}