import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, MapPin, 
  Phone, User, CheckCircle2, X, Send, Sparkles,
  Star, FileText, Plus, ShieldCheck, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function BuyCrops() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('lots'); // 'lots', 'requests', 'reviews'
  
  // Crop Listings (Harvest Lots)
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [qualityFilter, setQualityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Buyer Procurement Demands
  const [buyerDemands, setBuyerDemands] = useState([]);
  const [demandsLoading, setDemandsLoading] = useState(true);

  // Buyer Reviews
  const [buyerReviews, setBuyerReviews] = useState([]);

  // Enquiry Modal state
  const [activeListing, setActiveListing] = useState(null);
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerMobile, setBuyerMobile] = useState(user?.mobile || '');
  const [offerPrice, setOfferPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Post Procurement Requirement Modal
  const [reqModalOpen, setReqModalOpen] = useState(false);
  const [reqCropName, setReqCropName] = useState('Tomato');
  const [reqQuantity, setReqQuantity] = useState(100);
  const [reqBudget, setReqBudget] = useState(2500);
  const [reqDistrict, setReqDistrict] = useState('Bengaluru Rural');
  const [reqQuality, setReqQuality] = useState('Grade A');
  const [reqNotes, setReqNotes] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  // Buyer Review Submission Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [revReviewerName, setRevReviewerName] = useState(user?.name || 'Ramesh Gowda');
  const [revRating, setRevRating] = useState(5);
  const [revTargetName, setRevTargetName] = useState('Kishan Fresh Foods');
  const [revComment, setRevComment] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  useEffect(() => {
    loadListings();
    loadDemands();
    loadReviews();
  }, [districtFilter, qualityFilter, search]);

  const loadListings = () => {
    setLoading(true);
    let q = '';
    if (districtFilter) q += `district=${districtFilter}&`;
    if (qualityFilter) q += `quality=${qualityFilter}&`;
    if (search) q += `search=${encodeURIComponent(search)}`;

    api.getListings(q)
      .then(res => {
        setListings(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const loadDemands = () => {
    setDemandsLoading(true);
    api.getBuyerCropRequests()
      .then(res => {
        setBuyerDemands(res || []);
        setDemandsLoading(false);
      })
      .catch(() => setDemandsLoading(false));
  };

  const loadReviews = () => {
    api.getReviews('target_type=buyer')
      .then(res => {
        setBuyerReviews(res || []);
      })
      .catch(() => {});
  };

  const handleOpenEnquiry = (listing) => {
    setActiveListing(listing);
    setOfferPrice(listing.price_per_quintal);
    setQuantity(listing.quantity_quintals);
    setEnquirySuccess(false);
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    if (!buyerName || !buyerMobile) {
      alert("Please fill your Name and Mobile Number");
      return;
    }

    try {
      await api.sendEnquiry({
        listing_id: activeListing.id,
        buyer_name: buyerName,
        buyer_mobile: buyerMobile,
        offer_price: parseFloat(offerPrice),
        quantity: parseFloat(quantity),
        message: message
      });
      setEnquirySuccess(true);
      setTimeout(() => {
        setActiveListing(null);
        setEnquirySuccess(false);
      }, 2000);
    } catch (err) {
      alert("Failed to submit enquiry.");
    }
  };

  const handlePostRequirement = async (e) => {
    e.preventDefault();
    try {
      await api.postBuyerCropRequest({
        buyer_name: buyerName || user?.name || 'Commercial Procurement Partner',
        company_name: 'Direct Food Wholesale',
        buyer_mobile: buyerMobile || user?.mobile || '9876543210',
        crop_name: reqCropName,
        quantity_quintals: parseFloat(reqQuantity),
        max_budget_per_quintal: parseFloat(reqBudget),
        district: reqDistrict,
        state: 'Karnataka',
        quality_requirement: reqQuality,
        notes: reqNotes || 'Looking for steady supply directly from farmer lots.'
      });
      setReqSuccess(true);
      loadDemands();
      setTimeout(() => {
        setReqSuccess(false);
        setReqModalOpen(false);
      }, 1500);
    } catch (err) {
      alert("Failed to post procurement requirement.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!revComment.trim()) {
      alert("Please enter a short comment.");
      return;
    }
    try {
      await api.submitReview({
        reviewer_type: 'farmer',
        reviewer_name: revReviewerName,
        target_type: 'buyer',
        target_id: 1,
        target_name: revTargetName,
        crop_name: 'Field Produce',
        rating: Number(revRating),
        badge: 'Timely Payment & Weighbridge Verified',
        comment: revComment
      });
      setReviewSubmitSuccess(true);
      loadReviews();
      setTimeout(() => {
        setReviewSubmitSuccess(false);
        setReviewModalOpen(false);
        setRevComment('');
      }, 1500);
    } catch (err) {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Navigation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-emerald-700" />
            <span>Buy Crops Direct from Farmers</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Browse verified harvest lots, publish bulk procurement demands, and check peer buyer ratings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setReqModalOpen(true)}
            className="btn-kisan bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post Bulk Buying Demand</span>
          </button>
          <a
            href="/sell"
            className="btn-kisan btn-kisan-primary text-xs px-4 py-2.5"
          >
            Farmer? Sell Crops →
          </a>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-stone-200 space-x-4">
        <button
          onClick={() => setActiveTab('lots')}
          className={`pb-3 font-extrabold text-sm border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'lots' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Available Harvest Lots</span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">
            {listings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 font-extrabold text-sm border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'requests' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Bulk Buying Requests (Procurement)</span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
            {buyerDemands.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 font-extrabold text-sm border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'reviews' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Buyer Trust Ratings</span>
          <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full text-xs">
            {buyerReviews.length}
          </span>
        </button>
      </div>

      {/* TAB 1: AVAILABLE HARVEST LOTS */}
      {activeTab === 'lots' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="card-kisan p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search crop or village..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-100 pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none font-medium"
              />
            </div>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-stone-100 px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
            >
              <option value="">All Locations / Districts</option>
              <option value="Kolar">Kolar</option>
              <option value="Nashik">Nashik</option>
              <option value="Ludhiana">Ludhiana</option>
              <option value="Guntur">Guntur</option>
              <option value="Agra">Agra</option>
            </select>

            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="bg-stone-100 px-3 py-2.5 rounded-xl text-sm font-medium outline-none"
            >
              <option value="">All Quality Grades</option>
              <option value="Grade A">Grade A</option>
              <option value="Organic Certified">Organic Certified</option>
              <option value="Export Quality">Export Quality</option>
            </select>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-20 text-stone-500">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Loading verified harvest lots...</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="card-kisan p-12 text-center text-stone-500">
              <p className="text-base font-bold text-stone-800">No crop listings match your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="card-kisan overflow-hidden flex flex-col justify-between hover:border-emerald-500 transition group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <img
                        src={l.image_url}
                        alt={l.crop_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {l.quality_grade}
                      </span>
                      {l.is_demo && (
                        <span className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                          DEMO LISTING
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-stone-900">{l.crop_name}</h3>
                        <div className="flex items-center space-x-1 text-xs text-stone-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{l.village}, {l.district}, {l.state}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="text-stone-500 block">Available Qty:</span>
                          <span className="font-extrabold text-stone-900 text-sm">{l.quantity_quintals} Quintals</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Asking Rate:</span>
                          <span className="font-extrabold text-emerald-800 text-sm">₹{l.price_per_quintal}/Q</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-500 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>Farmer: <strong className="text-stone-800">{l.farmer_name}</strong></span>
                        </div>
                        <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ⭐ 4.9 Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(l)}
                      className="btn-kisan btn-kisan-primary w-full text-sm"
                    >
                      Send Purchase Enquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BULK BUYING REQUESTS (DEMAND BOARD) */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-amber-950 text-base">Are you a food processor, supermarket chain, or wholesale buyer?</h3>
              <p className="text-xs text-amber-800 mt-1">
                Post your procurement requirements with target pricing and quality needs. Farmers will connect directly with matching harvest lots.
              </p>
            </div>
            <button
              onClick={() => setReqModalOpen(true)}
              className="btn-kisan bg-amber-600 hover:bg-amber-500 text-white text-xs px-5 py-2.5 whitespace-nowrap shadow-sm"
            >
              + Post Buying Request
            </button>
          </div>

          {demandsLoading ? (
            <div className="text-center py-16 text-stone-500">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Loading buyer requests...</span>
            </div>
          ) : buyerDemands.length === 0 ? (
            <div className="card-kisan p-12 text-center text-stone-500">
              <p className="text-base font-bold text-stone-800">No active buying requests right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyerDemands.map((dem) => (
                <div key={dem.id} className="card-kisan p-5 space-y-4 border-2 border-stone-200 hover:border-amber-400 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {dem.quality_requirement}
                      </span>
                      <span className="text-[11px] text-stone-400">{dem.created_at}</span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-xl font-black text-stone-900">{dem.crop_name}</h4>
                      <p className="text-xs font-bold text-stone-600">{dem.company_name || dem.buyer_name}</p>
                      <div className="flex items-center space-x-1 text-xs text-stone-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Delivery to: {dem.district}, {dem.state}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                      <div>
                        <span className="text-stone-500 block">Required Qty:</span>
                        <span className="font-extrabold text-stone-900 text-sm">{dem.quantity_quintals} Quintals</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Max Budget:</span>
                        <span className="font-extrabold text-emerald-800 text-sm">₹{dem.max_budget_per_quintal}/Q</span>
                      </div>
                    </div>

                    {dem.notes && (
                      <p className="text-xs text-stone-600 italic mt-3 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                        "{dem.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <a
                      href={`tel:${dem.buyer_mobile}`}
                      className="btn-kisan bg-emerald-800 hover:bg-emerald-700 text-white w-full text-xs py-2.5 flex items-center justify-center space-x-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-300" />
                      <span>Contact Buyer: {dem.buyer_mobile}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BUYER REVIEWS & TRUST */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center space-x-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Farmer Peer Reviews on Wholesale Buyers</span>
              </h3>
              <p className="text-xs text-stone-500">
                Transparent reviews on payment speed, weighbridge accuracy, and unloading ethics.
              </p>
            </div>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="btn-kisan btn-kisan-primary text-xs px-4 py-2"
            >
              + Review a Buyer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyerReviews.map((rev) => (
              <div key={rev.id} className="card-kisan p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-stone-900">{rev.target_name}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
                <div className="pt-2 border-t text-[10px] text-stone-500 flex items-center justify-between">
                  <span>Reviewed by: <strong>{rev.reviewer_name}</strong></span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">{rev.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENQUIRY MODAL */}
      {activeListing && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in">
            <button
              onClick={() => setActiveListing(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-6 h-6" />
            </button>

            {enquirySuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-stone-900">Enquiry Sent to Farmer!</h3>
                <p className="text-sm text-stone-600">
                  Farmer {activeListing.farmer_name} has received your purchase request.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-stone-900">
                    Send Purchase Enquiry for {activeListing.crop_name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Farmer asking rate: ₹{activeListing.price_per_quintal}/Quintal • Available: {activeListing.quantity_quintals} Q
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Traders"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={buyerMobile}
                      onChange={(e) => setBuyerMobile(e.target.value)}
                      className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Your Offer Price (₹/Q)</label>
                    <input
                      type="number"
                      required
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold text-emerald-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Quantity Needed (Q)</label>
                    <input
                      type="number"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold text-stone-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Message or Logistics Note</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="We can arrange our truck pickup from your village..."
                    className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-medium outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-kisan btn-kisan-primary w-full text-base"
                >
                  <Send className="w-5 h-5 mr-2" />
                  <span>Submit Purchase Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST BUYER REQUIREMENT MODAL */}
      {reqModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-black text-stone-900 flex items-center space-x-2">
                <Plus className="w-6 h-6 text-amber-600" />
                <span>Post Bulk Buying Requirement</span>
              </h3>
              <button
                onClick={() => setReqModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-black text-xl"
              >
                &times;
              </button>
            </div>

            {reqSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300">
                Procurement demand posted successfully!
              </div>
            )}

            <form onSubmit={handlePostRequirement} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomato, Wheat, Cotton"
                    value={reqCropName}
                    onChange={(e) => setReqCropName(e.target.value)}
                    className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Quality Needed</label>
                  <select
                    value={reqQuality}
                    onChange={(e) => setReqQuality(e.target.value)}
                    className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold outline-none"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Organic">Organic</option>
                    <option value="Processing Grade">Processing Grade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Quantity (Quintals)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(e.target.value)}
                    className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Max Budget (₹/Quintal)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={reqBudget}
                    onChange={(e) => setReqBudget(e.target.value)}
                    className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-bold text-emerald-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Delivery District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Kolar, Nashik"
                  value={reqDistrict}
                  onChange={(e) => setReqDistrict(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl text-sm font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Special Notes / Payment Terms</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Daily payment on unloading. Can provide empty crates."
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl text-xs font-medium outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReqModalOpen(false)}
                  className="flex-1 py-3 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-kisan bg-amber-600 hover:bg-amber-500 text-white text-sm py-3"
                >
                  Publish Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW BUYER MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center space-x-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Rate & Review a Buyer</span>
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-black text-xl"
              >
                &times;
              </button>
            </div>

            {reviewSubmitSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300">
                Review submitted successfully!
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Buyer / Company Name</label>
                <input
                  type="text"
                  required
                  value={revTargetName}
                  onChange={(e) => setRevTargetName(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-bold text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Farmer Name</label>
                <input
                  type="text"
                  required
                  value={revReviewerName}
                  onChange={(e) => setRevReviewerName(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl font-medium text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Rating (1 to 5 Stars)</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRevRating(s)}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${s <= revRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-600 ml-2">{revRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Review Feedback</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Share details on prompt payment, fair grading, clean weighbridge..."
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  className="w-full bg-stone-100 p-2.5 rounded-xl text-xs font-medium outline-none resize-none"
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
