import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, Plus, Trash2, Edit3, Image, 
  MapPin, CheckCircle2, MessageCircle, AlertCircle, Camera, RefreshCw, Star, X
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function SellCrops() {
  const { user } = useApp();
  const [crops, setCrops] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedCropId, setSelectedCropId] = useState(1);
  const [quantity, setQuantity] = useState(50);
  const [price, setPrice] = useState(2400);
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [village, setVillage] = useState(user?.village || 'Srinivaspur');
  const [district, setDistrict] = useState(user?.district || 'Kolar');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Direct Camera Access States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Review Farmer Modal State (Buyers reviewing this farmer or viewing farmer reviews)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [farmerReviews, setFarmerReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState('Apex Mandi Buyer');
  const [reviewerType, setReviewerType] = useState('buyer');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getCrops(),
      api.getMyListings(),
      api.getReviews('target_type=farmer&target_id=1')
    ]).then(([cRes, lRes, rRes]) => {
      setCrops(cRes || []);
      setMyListings(lRes || []);
      setFarmerReviews(rRes || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => {
      stopCameraStream();
    };
  }, []);

  // Camera Management
  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      setCameraError(err.message || 'Unable to access camera directly. Please check device permissions.');
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCustomPhotoUrl(photoDataUrl);
    stopCameraStream();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const selCrop = crops.find(c => c.id === Number(selectedCropId));
    try {
      await api.createListing({
        crop_id: selectedCropId,
        crop_name: selCrop?.name || 'Fresh Produce',
        quantity_quintals: parseFloat(quantity),
        price_per_quintal: parseFloat(price),
        quality_grade: qualityGrade,
        village: village,
        district: district,
        state: state,
        image_url: customPhotoUrl || selCrop?.image_url
      });
      setFormSuccess(true);
      // Reload
      const updated = await api.getMyListings();
      setMyListings(updated || []);
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      alert("Failed to publish listing.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.deleteListing(id);
      setMyListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please enter a short comment.");
      return;
    }
    try {
      const selCrop = crops.find(c => c.id === Number(selectedCropId));
      await api.submitReview({
        reviewer_type: reviewerType,
        reviewer_name: reviewerName,
        target_type: 'farmer',
        target_id: user?.id || 1,
        target_name: user?.name || 'Ramesh Gowda',
        crop_name: selCrop?.name || 'Agricultural Produce',
        rating: Number(rating),
        badge: reviewerType === 'buyer' ? 'Verified Wholesale Buyer' : 'Cooperative Partner',
        comment: comment
      });
      setReviewSuccess(true);
      const updated = await api.getReviews('target_type=farmer&target_id=1');
      setFarmerReviews(updated || []);
      setComment('');
      setTimeout(() => {
        setReviewSuccess(false);
        setReviewModalOpen(false);
      }, 1500);
    } catch (err) {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Trust Reviews Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <Store className="w-8 h-8 text-amber-600" />
            <span>Sell Your Harvest (Zero Commission)</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Publish your crop lots directly to wholesale buyers, food processors, and mandi traders.
          </p>
        </div>

        {/* Farmer Trust Score & Reviews Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setReviewModalOpen(true)}
            className="flex items-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2.5 rounded-2xl shadow-sm transition"
          >
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-black text-sm text-stone-900">4.9 / 5.0</span>
            </div>
            <span className="text-xs font-bold text-stone-600">
              ({farmerReviews.length} Buyer Reviews)
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Listing Form */}
        <div className="lg:col-span-1 card-kisan p-6 space-y-4">
          <h2 className="font-extrabold text-stone-900 text-lg border-b pb-3 flex items-center space-x-2">
            <Plus className="w-5 h-5 text-emerald-700" />
            <span>Publish New Crop Listing</span>
          </h2>

          {formSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Listing published successfully! Visible to buyers.</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4">
            {/* Select Crop */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Select Crop</label>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm text-stone-800 outline-none"
              >
                {crops.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                ))}
              </select>
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Quantity (Quintals)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-bold text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Price (₹/Quintal)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-bold text-sm text-emerald-800 outline-none"
                />
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Quality Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm text-stone-800 outline-none"
              >
                <option value="Grade A">Grade A (Premium Quality)</option>
                <option value="Grade B">Grade B (Standard Market)</option>
                <option value="Organic Certified">Organic Certified</option>
                <option value="Export Quality">Export Quality</option>
              </select>
            </div>

            {/* Village & District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-medium text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-medium text-sm outline-none"
                />
              </div>
            </div>

            {/* DIRECT CAMERA ACCESS & PHOTO UPLOAD */}
            <div className="space-y-2 border-t pt-3">
              <label className="text-xs font-bold text-stone-700 uppercase block">
                Crop Photo (Direct Camera / Upload)
              </label>

              {customPhotoUrl && (
                <div className="relative mb-2">
                  <img
                    src={customPhotoUrl}
                    alt="Captured Crop"
                    className="w-full h-36 object-cover rounded-2xl border-2 border-emerald-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomPhotoUrl('')}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs shadow-md"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Live Camera Viewfinder */}
              {isCameraActive && (
                <div className="space-y-2 bg-stone-900 p-3 rounded-2xl">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-black text-xs rounded-xl flex items-center justify-center space-x-1 shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Photo Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="px-3 py-2.5 bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  {cameraError}
                </p>
              )}

              {/* Action Buttons for Camera / File */}
              {!isCameraActive && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Open Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition border border-stone-300"
                  >
                    <Image className="w-4 h-4 text-stone-600" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* 56px action button */}
            <button
              type="submit"
              className="btn-kisan btn-kisan-primary w-full text-base mt-2"
            >
              Publish Crop Listing
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Manage My Listings & Enquiries */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-stone-900 text-xl">Your Active Listings</h2>
            <span className="text-xs font-bold text-stone-500">{myListings.length} Active Lots</span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-stone-500">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Loading your listings...</span>
            </div>
          ) : myListings.length === 0 ? (
            <div className="card-kisan p-12 text-center text-stone-500">
              <p className="text-base font-bold text-stone-800">You haven't published any crop listings yet.</p>
              <p className="text-xs text-stone-400 mt-1">Use the form on the left to publish your first lot.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myListings.map(l => (
                <div key={l.id} className="card-kisan p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={l.image_url}
                      alt={l.crop_name}
                      className="w-20 h-20 rounded-2xl object-cover border"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-stone-900 text-lg">{l.crop_name}</h4>
                        <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold">
                          {l.quality_grade}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        Location: <span className="font-semibold text-stone-800">{l.village}, {l.district}</span>
                      </div>
                      <div className="text-sm font-extrabold text-emerald-800 mt-1">
                        {l.quantity_quintals} Q @ ₹{l.price_per_quintal}/Quintal
                      </div>
                    </div>
                  </div>

                  {/* Actions & Enquiry Count */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {l.enquiries_count} Enquiries
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mutual Reviews Section for Farmer */}
          <div className="card-kisan p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Verified Buyer Reviews for this Farmer</span>
              </h3>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                + Leave a Review
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {farmerReviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">{rev.reviewer_name}</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">{rev.badge}</span>
                    <span>{rev.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative border border-amber-300">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Rate & Review Farmer</span>
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-black text-xl"
              >
                &times;
              </button>
            </div>

            {reviewSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300">
                Review submitted successfully!
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Name / Company</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl font-bold text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Star Rating (1 to 5)</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-600 ml-2">{rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Feedback / Experience</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Share details on crop freshness, weighbridge honesty, loading support..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-stone-100 p-3 rounded-xl text-xs font-medium outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-3 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-kisan btn-kisan-primary text-sm py-3"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
