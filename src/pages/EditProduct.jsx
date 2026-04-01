import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { backendUrl } from '../App'
import { useToast } from '../hooks/useToast'
import { Upload, X, Plus, Minus, ArrowLeft } from 'lucide-react'

const EditProduct = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { formActions } = useToast()
  
  const [images, setImages] = useState([null, null, null, null])
  const [existingImages, setExistingImages] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('batteries')
  const [subCategory, setSubCategory] = useState([])
  const [brand, setBrand] = useState('Sun Mega')
  const [features, setFeatures] = useState([''])
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }])
  const [downloads, setDownloads] = useState([{ name: '', file: null }])
  const [existingDownloads, setExistingDownloads] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'

  // Category options
  const categories = [
    { value: 'batteries', label: 'Batteries' },
    { value: 'single-phase', label: 'Single-Phase Products' },
    { value: 'three-phase', label: 'Three-Phase Products' }
  ]

  const subCategoryOptions = {
    'batteries': ['battery-pack-series'],
    'single-phase': [
      'single-phase-all-in-one-solution',
      'single-phase-hybrid-series'
    ],
    'three-phase': [
      'three-phase-all-in-one-solution-indoor-outdoor',
      'three-phase-grid-on-series',
      'three-phase-hybrid-series'
    ]
  }

  useEffect(() => {
    fetchProduct()
  }, [id, token])

  const fetchProduct = async () => {
    try {
      setFetchLoading(true)
      const response = await axios.get(`${backendUrl}/api/product/${id}`, {
        headers: { token }
      })

      if (response.data.success) {
        const product = response.data.product
        setName(product.name || '')
        setDescription(product.description || '')
        setCategory(product.category || 'batteries')
        setSubCategory(product.subCategory || [])
        setBrand(product.brand || 'Sun Mega')
        setFeatures(product.features?.length ? product.features : [''])
        setExistingImages(product.image || [])
        setExistingDownloads(product.downloads || [])
        setDownloads([{ name: '', file: null }])
        
        // Convert specifications Map to array
        if (product.specifications) {
          const specsArray = Object.entries(product.specifications).map(([key, value]) => ({
            key,
            value
          }))
          setSpecifications(specsArray.length ? specsArray : [{ key: '', value: '' }])
        }
      } else {
        formActions.fetch.error('product data')
        navigate('/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      formActions.fetch.error('product data')
      navigate('/products')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleImageChange = (index, file) => {
    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages[index] = null
    setImages(newImages)
  }

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const handleSubCategoryToggle = (sub) => {
    if (subCategory.includes(sub)) {
      setSubCategory(subCategory.filter(s => s !== sub))
    } else {
      setSubCategory([...subCategory, sub])
    }
  }

  const addFeature = () => setFeatures([...features, ''])
  const removeFeature = (index) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeature = (index, value) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const addDownload = () => setDownloads([...downloads, { name: '', file: null }])
  const removeDownload = (index) => setDownloads(downloads.filter((_, i) => i !== index))
  const updateDownload = (index, field, value) => {
    const newDownloads = [...downloads]
    newDownloads[index][field] = value
    setDownloads(newDownloads)
  }

  const handleDownloadFileChange = (index, file) => {
    const newDownloads = [...downloads]
    newDownloads[index].file = file
    newDownloads[index].name = file.name
    setDownloads(newDownloads)
  }

  const removeExistingDownload = (index) => {
    setExistingDownloads(existingDownloads.filter((_, i) => i !== index))
  }
  const removeSpec = (index) => setSpecifications(specifications.filter((_, i) => i !== index))
  const updateSpec = (index, field, value) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    setSpecifications(newSpecs)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('subCategory', JSON.stringify(subCategory.filter(s => s)))
      formData.append('brand', brand || 'Sun Mega')
      formData.append('features', JSON.stringify(features.filter(f => f)))
      
      // Keep existing images
      formData.append('image', JSON.stringify(existingImages.filter(img => img)))
      
      // Convert specifications to object
      const specsObj = {}
      specifications.forEach(({ key, value }) => {
        if (key && value) specsObj[key] = value
      })
      formData.append('specifications', JSON.stringify(specsObj))

      // Keep existing downloads
      formData.append('existingDownloads', JSON.stringify(existingDownloads))

      // Append new downloads
      downloads.forEach((download) => {
        if (download.file) {
          formData.append('downloads', download.file)
        }
      })

      const response = await axios.post(
        backendUrl + '/api/product/update',
        formData,
        { 
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      if (response.data.success) {
        formActions.update.success('Product')
        navigate('/products')
      } else {
        formActions.update.error('product')
      }
    } catch (error) {
      formActions.update.error('product')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = 'w-full mt-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Edit Product</h2>
          <p className="text-gray-500 text-sm">Update product details</p>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-sm p-8 space-y-10">
        {/* Images */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700">Product Images</h4>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Current Images:</p>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img
                      src={img.startsWith('http') ? img : `${frontendUrl}${img}`}
                      alt={`Current ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Images */}
          <p className="text-sm text-gray-500 mb-2">Add New Images:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <label htmlFor={`image${index}`} className="cursor-pointer">
                  <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-green-500 transition-colors bg-gray-50">
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`New ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">Upload</span>
                      </div>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id={`image${index}`}
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                />
                {img && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Product Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputStyle}
                placeholder="e.g., Battery Pack Series - High Capacity"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputStyle} min-h-30 resize-none`}
                placeholder="Write detailed product description..."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={inputStyle}
                placeholder="Sun Mega"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setSubCategory([])
                }}
                className={inputStyle}
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Sub Categories</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {subCategoryOptions[category]?.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSubCategoryToggle(sub)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      subCategory.includes(sub)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="text-sm font-medium text-gray-700">Features</label>
              <div className="mt-2 space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className={inputStyle}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <motion.button
                      type="button"
                      onClick={() => removeFeature(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      disabled={features.length === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))}
                <motion.button
                  type="button"
                  onClick={addFeature}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </motion.button>
              </div>
            </div>

            {/* Downloads */}
            <div>
              <label className="text-sm font-medium text-gray-700">Downloads / Documents</label>
              
              {/* Existing Downloads */}
              {existingDownloads.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Current Downloads:</p>
                  <div className="space-y-2">
                    {existingDownloads.map((download, index) => (
                      <div key={`existing-download-${index}`} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-700">{download.name}</span>
                        <button
                          type="button"
                          onClick={() => removeExistingDownload(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New Downloads */}
              <p className="text-sm text-gray-500 mb-2">Add New Downloads:</p>
              <div className="mt-2 space-y-2">
                {downloads.map((download, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        value={download.name}
                        onChange={(e) => updateDownload(index, 'name', e.target.value)}
                        className={inputStyle}
                        placeholder="Document name (e.g., User Manual)"
                      />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                        onChange={(e) => handleDownloadFileChange(index, e.target.files[0])}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {download.file && (
                        <span className="text-xs text-green-600">
                          Selected: {download.file.name}
                        </span>
                      )}
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => removeDownload(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"
                      disabled={downloads.length === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))}
                <motion.button
                  type="button"
                  onClick={addDownload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Download
                </motion.button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="text-sm font-medium text-gray-700">Specifications</label>
              <div className="mt-2 space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={spec.key}
                      onChange={(e) => updateSpec(index, 'key', e.target.value)}
                      className={`${inputStyle} w-1/3`}
                      placeholder="Key (e.g., Capacity)"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                      className={`${inputStyle} flex-1`}
                      placeholder="Value (e.g., 10 kWh)"
                    />
                    <motion.button
                      type="button"
                      onClick={() => removeSpec(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      disabled={specifications.length === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))}
                <motion.button
                  type="button"
                  onClick={addSpec}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Specification
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <motion.button
            type="button"
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-3 rounded-xl font-medium transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
