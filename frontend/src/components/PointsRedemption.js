import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Coins, Gift, Star, CreditCard, Wifi, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import BackButton from './BackButton';
import gameService from '../services/gameService';

const PointsRedemption = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  // Mock redemption categories
  const redemptionCategories = [
    { id: 'all', name: 'All Rewards', icon: <Star className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'vouchers', name: 'Vouchers', icon: <Gift className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { id: 'gifts', name: 'Gifts', icon: <ShoppingBag className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'cards', name: 'Gift Cards', icon: <CreditCard className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
    { id: 'data', name: 'Data Plans', icon: <Wifi className="w-5 h-5" />, color: 'from-indigo-500 to-purple-500' }
  ];

  // Mock available rewards
  const availableRewards = [
    // Vouchers
    {
      id: 'voucher_1',
      name: 'Amazon Gift Voucher',
      description: 'Redeem for Amazon shopping spree',
      category: 'vouchers',
      pointsRequired: 500,
      value: '$10',
      image: '🛒',
      color: 'from-green-500 to-emerald-500',
      stock: 25,
      popular: true
    },
    {
      id: 'voucher_2',
      name: 'Starbucks Coffee Voucher',
      description: 'Enjoy your favorite coffee drinks',
      category: 'vouchers',
      pointsRequired: 200,
      value: '$5',
      image: '☕',
      color: 'from-green-600 to-emerald-600',
      stock: 50,
      popular: false
    },
    // Gifts
    {
      id: 'gift_1',
      name: 'Wireless Earbuds',
      description: 'Premium audio experience for speech practice',
      category: 'gifts',
      pointsRequired: 1500,
      value: '$30',
      image: '🎧',
      color: 'from-blue-500 to-cyan-500',
      stock: 10,
      popular: true
    },
    // Data Plans
    {
      id: 'data_1',
      name: '1GB Mobile Data',
      description: 'Stay connected for speech therapy sessions',
      category: 'data',
      pointsRequired: 100,
      value: '1GB',
      image: '📱',
      color: 'from-indigo-500 to-purple-500',
      stock: 100,
      popular: true
    }
  ];

  // Mock redemption history
  const mockRedemptionHistory = [
    {
      id: 1,
      rewardName: 'Amazon Gift Voucher',
      pointsSpent: 500,
      value: '$10',
      redeemedAt: '2024-01-15T10:30:00Z',
      status: 'completed',
      category: 'vouchers'
    },
    {
      id: 2,
      rewardName: '1GB Mobile Data',
      pointsSpent: 100,
      value: '1GB',
      redeemedAt: '2024-01-10T14:20:00Z',
      status: 'completed',
      category: 'data'
    }
  ];

  const [redemptionHistory, setRedemptionHistory] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Load user points from game service
      if (user?.id) {
        const stats = await gameService.getUserStats(user.id);
        setUserPoints(stats.totalPoints || 0);
      } else {
        // Mock data for demo
        setUserPoints(1250);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to mock data
      setUserPoints(1250);
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = selectedCategory === 'all' 
    ? availableRewards 
    : availableRewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = (reward) => {
    if (userPoints < reward.pointsRequired) {
      alert('Insufficient points! Keep practicing to earn more points.');
      return;
    }
    
    if (reward.stock <= 0) {
      alert('Sorry, this reward is out of stock!');
      return;
    }

    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedemption = async () => {
    if (!selectedReward) return;

    setRedeemLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user points
      setUserPoints(prev => prev - selectedReward.pointsRequired);
      
      // Add to redemption history
      const newRedemption = {
        id: Date.now(),
        rewardName: selectedReward.name,
        pointsSpent: selectedReward.pointsRequired,
        value: selectedReward.value,
        redeemedAt: new Date().toISOString(),
        status: 'completed',
        category: selectedReward.category
      };
      
      setRedemptionHistory(prev => [newRedemption, ...prev]);
      
      // Show success message
      setRedeemSuccess(true);
      setTimeout(() => setRedeemSuccess(false), 3000);
      
      // Close modal
      setShowRedeemModal(false);
      setSelectedReward(null);
      
    } catch (error) {
      console.error('Redemption failed:', error);
      alert('Redemption failed. Please try again.');
    } finally {
      setRedeemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
            <Coins className="w-5 h-5" />
            <span className="text-sm font-medium">Points Redemption Center</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">
            Redeem Your Points
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Convert your hard-earned speech therapy points into amazing rewards!
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <BackButton to="/home" variant="outline">
            Back to Home
          </BackButton>
        </div>

        {/* Points Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200/50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coins className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Points Balance</h2>
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
              {userPoints.toLocaleString()}
            </div>
            <p className="text-slate-600 text-lg">Keep practicing to earn more points!</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200/50">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Choose Category</h3>
          <div className="flex flex-wrap gap-3">
            {redemptionCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200/50">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Available Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <div
                key={reward.id}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  userPoints >= reward.pointsRequired && reward.stock > 0
                    ? 'border-slate-200 hover:border-purple-300 hover:shadow-xl'
                    : 'border-slate-200 opacity-60'
                }`}
              >
                {/* Popular Badge */}
                {reward.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Stock Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className={`text-xs px-2 py-1 rounded-full font-bold ${
                    reward.stock > 10 ? 'bg-green-100 text-green-800' :
                    reward.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {reward.stock} left
                  </div>
                </div>

                <div className="p-6">
                  {/* Reward Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${reward.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-3xl">{reward.image}</span>
                  </div>

                  {/* Reward Info */}
                  <h4 className="text-lg font-bold text-slate-800 mb-2 text-center">{reward.name}</h4>
                  <p className="text-slate-600 text-sm text-center mb-4">{reward.description}</p>

                  {/* Points and Value */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-slate-700">{reward.pointsRequired} points</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">{reward.value}</div>
                      <div className="text-xs text-slate-500">Value</div>
                    </div>
                  </div>

                  {/* Redeem Button */}
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={userPoints < reward.pointsRequired || reward.stock <= 0}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      userPoints >= reward.pointsRequired && reward.stock > 0
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {userPoints >= reward.pointsRequired && reward.stock > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>Redeem Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    ) : (
                      userPoints < reward.pointsRequired ? 'Need More Points' : 'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Redemption History */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200/50">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Redemption History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Reward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Points Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Redeemed At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
                             <tbody className="bg-white divide-y divide-slate-200">
                 {redemptionHistory.length === 0 ? (
                   <tr>
                     <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                       <Gift className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                       <p>No redemptions yet. Start earning points and redeem your first reward!</p>
                     </td>
                   </tr>
                 ) : (
                   redemptionHistory.map((history) => (
                     <tr key={history.id}>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                         {history.rewardName}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                         {history.pointsSpent} points
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                         {history.value}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                         {new Date(history.redeemedAt).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm">
                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                           history.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                         }`}>
                           {history.status}
                         </span>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Redemption Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 bg-gradient-to-r ${selectedReward.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <span className="text-4xl">{selectedReward.image}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Confirm Redemption</h3>
              <p className="text-slate-600">Are you sure you want to redeem this reward?</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Reward:</span>
                <span className="font-semibold">{selectedReward.name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Points Required:</span>
                <span className="font-semibold text-yellow-600">{selectedReward.pointsRequired} points</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Your Balance:</span>
                <span className="font-semibold text-green-600">{userPoints} points</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Remaining After:</span>
                <span className="font-semibold text-blue-600">{userPoints - selectedReward.pointsRequired} points</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 py-3 px-4 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedemption}
                disabled={redeemLoading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
              >
                {redeemLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Redemption'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {redeemSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-slide-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <div className="font-semibold">Redemption Successful!</div>
              <div className="text-sm opacity-90">Your reward has been processed.</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PointsRedemption;
