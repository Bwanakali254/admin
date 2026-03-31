import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload, X } from 'lucide-react'

const AddProduct = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Batteries')
  const [subCategory, setSubCategory] = useState('high-voltage-battery')
  const [brand, setBrand] = useState('')
  const [quantity, setQuantity] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('brand', brand)
      formData.append('quantity', quantity)
      formData.append('bestseller', bestseller)

      images.forEach((img, index) => {
        if (img) {
          formData.append(`image${index + 1}`, img)
        }
      })

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImages([null, null, null, null])
        setPrice('')
        setBrand('')
        setQuantity('')
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = 'w-full mt-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Add Solar Product</h2>
        <p className="text-gray-500 text-sm">Create a new product for Sun Mega Limited</p>
      </div>

      <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-sm p-8 space-y-10">
        <div>
          <h4 className="font-medium mb-3 text-gray-700">Product Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <label htmlFor={`image${index}`} className="cursor-pointer">
                  <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-green-500 transition-colors bg-gray-50">
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Product ${index + 1}`}
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
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputStyle}
                placeholder="High Voltage Battery"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputStyle} min-h-[120px] resize-none`}
                placeholder="Write product details..."
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
                required
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputStyle}
              >
                <option>Batteries</option>
                <option>Controllers</option>
                <option>Converters</option>
                <option>Energy Storage Systems</option>
                <option>Inverters</option>
                <option>Portable Power</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Sub Category</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className={inputStyle}
              >
                <option value="high-voltage-battery">High Voltage Battery</option>
                <option value="stack-battery-pack">Stack Battery Pack</option>
                <option value="main-controller">Main Controller</option>
                <option value="power-converter">Power Converter</option>
                <option value="grid-tie-inverter">Grid Tie Inverter</option>
                <option value="portable-outdoor-power-supply">Portable Outdoor Power Supply</option>
                <option value="single-phase-hybrid-inverter">Single Phase Hybrid Inverter</option>
                <option value="three-phase-hybrid-inverter">Three Phase Hybrid Inverter</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Price (KES)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputStyle}
                placeholder="100000"
                min="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputStyle}
                placeholder="10"
                min="0"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="bestseller"
                checked={bestseller}
                onChange={() => setBestseller((p) => !p)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="bestseller" className="text-sm font-medium text-gray-700">
                Mark as Bestseller
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-medium transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
