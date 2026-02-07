import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  AlertCircle,
  Package
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { ROUTES } from '../config/routes.constants';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

import { toast } from 'react-toastify';
import { validatePassword } from '../utils/validators';
import PasswordStrengthIndicator from '../components/auth/PasswordStrengthIndicator';
import authService from '../api/authService';

type Tab = 'profile' | 'security' | 'orders';

export default function Profile() {
  const { user, updateUser } = useAuth(); // ✅ FIXED
  const { data: orders = [], isLoading: ordersLoading } = useOrders();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tabFromUrl && ['profile', 'security', 'orders'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!user) return null;

  // ---------------- PROFILE STATE ----------------
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
  });

  // ---------------- PASSWORD STATE ----------------
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.updateUserProfile(profileData);
      if (res.success && res.user) {
        updateUser(res.user);
        toast.success('Profile updated');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      toast.error('Password too weak');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.changeUserPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (res.success) {
        toast.success('Password updated');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR */}
        <div className="w-full lg:w-64 space-y-2">
          <SidebarButton active={activeTab === 'profile'} onClick={() => switchTab('profile')} icon={<User />} label="Profile" />
          <SidebarButton active={activeTab === 'security'} onClick={() => switchTab('security')} icon={<Shield />} label="Security" />
          <SidebarButton active={activeTab === 'orders'} onClick={() => switchTab('orders')} icon={<Package />} label="Orders" />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <Card padding="lg">
              <h3 className="text-lg font-bold mb-6">Personal Information</h3>
              <form onSubmit={handleProfileUpdate} className="grid md:grid-cols-2 gap-6">
                <Input label="Name" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                <Input label="Email" value={profileData.email} disabled />
                <Input label="Phone" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
                <Input label="Address" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} />
                <div className="md:col-span-2 text-right">
                  <Button type="submit" isLoading={isLoading}>Save</Button>
                </div>
              </form>
            </Card>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <Card padding="lg">
              <h3 className="text-lg font-bold mb-6">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                <Input type="password" label="Current Password" value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
                <Input type="password" label="New Password" value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                <PasswordStrengthIndicator password={passwordData.newPassword} />
                <Input type="password" label="Confirm Password" value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                <Button type="submit" isLoading={isLoading}>Update Password</Button>
              </form>
            </Card>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <Card padding="lg">
              <h3 className="text-lg font-bold mb-6">Order History</h3>

              {ordersLoading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <Link to={ROUTES.PRODUCTS}>
                    <Button variant="outline" className="mt-4">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Order #{order.id}</span>
                        <Badge variant="success">{order.status}</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Items: {order.order_items.length}
                      </p>
                      <p className="font-bold mt-2">
                        ₹{order.total_amount}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- HELPER ----------------
function SidebarButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
        active ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}