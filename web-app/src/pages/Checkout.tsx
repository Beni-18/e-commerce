import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { useCreateOrder } from '../hooks/useOrder';
import { useNavigate } from 'react-router-dom';

import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { ROUTES } from '../config/routes.constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const steps = [
    { id: 'shipping' as CheckoutStep, label: 'Shipping', icon: Truck },
    { id: 'payment' as CheckoutStep, label: 'Payment', icon: CreditCard },
    { id: 'review' as CheckoutStep, label: 'Review', icon: CheckCircle2 },
  ];

  const { items, subtotal } = useCart();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
  try {
    await createOrder.mutateAsync({
      order: {
        status: 'pending',
        payment_status: 'paid',
        tax,
        shipping_fee: shipping,
      },
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    });

    navigate('/profile?tab=orders');
  } catch (err) {
    console.error(err);
  }
};

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Checkout</h1>
          <p className="text-lg text-white/90">Complete your purchase securely</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-semibold ${isActive ? 'text-primary-600' : 'text-neutral-600'
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-1 mx-2 transition-all ${isCompleted ? 'bg-green-500' : 'bg-neutral-200'
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Information */}
            {currentStep === 'shipping' && (
              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg">
                    <Truck className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Shipping Information</h2>
                    <p className="text-neutral-600">Where should we deliver your order?</p>
                  </div>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-5">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    leftIcon={<User className="w-5 h-5" />}
                    required
                  />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      type="email"
                      label="Email"
                      placeholder="john@example.com"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      leftIcon={<Mail className="w-5 h-5" />}
                      required
                    />
                    <Input
                      type="tel"
                      label="Phone"
                      placeholder="+91 98765 43210"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      leftIcon={<Phone className="w-5 h-5" />}
                      required
                    />
                  </div>

                  <Input
                    label="Address"
                    placeholder="123 Main Street, Apartment 4B"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    leftIcon={<Home className="w-5 h-5" />}
                    required
                  />

                  <div className="grid sm:grid-cols-3 gap-5">
                    <Input
                      label="City"
                      placeholder="Mumbai"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      leftIcon={<MapPin className="w-5 h-5" />}
                      required
                    />
                    <Input
                      label="State"
                      placeholder="Maharashtra"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      placeholder="400001"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Link to={ROUTES.CART}>
                      <Button variant="outline" type="button">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Cart
                      </Button>
                    </Link>
                    <Button type="submit">
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Payment Information */}
            {currentStep === 'payment' && (
              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Payment Details</h2>
                    <p className="text-neutral-600">Enter your payment information</p>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                    leftIcon={<CreditCard className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                    required
                  />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                      required
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      type="password"
                      maxLength={3}
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                      leftIcon={<Lock className="w-5 h-5" />}
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
                        <p className="text-sm text-blue-700">
                          Your payment information is encrypted and secure. We never store your card details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" type="button" onClick={() => setCurrentStep('shipping')}>
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </Button>
                    <Button type="submit">
                      Review Order
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Review Order */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">Review Your Order</h2>
                      <p className="text-neutral-600">Please verify all details before placing your order</p>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900">Shipping Address</h3>
                      <button
                        onClick={() => setCurrentStep('shipping')}
                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4 space-y-1">
                      <p className="font-semibold text-neutral-900">{shippingInfo.fullName}</p>
                      <p className="text-neutral-600">{shippingInfo.address}</p>
                      <p className="text-neutral-600">
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                      <p className="text-neutral-600">{shippingInfo.email}</p>
                      <p className="text-neutral-600">{shippingInfo.phone}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900">Payment Method</h3>
                      <button
                        onClick={() => setCurrentStep('payment')}
                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-neutral-600" />
                      <div>
                        <p className="font-semibold text-neutral-900">
                          •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}
                        </p>
                        <p className="text-sm text-neutral-600">{paymentInfo.cardName}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('payment')}>
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </Button>
                  <Button size="lg" onClick={handlePlaceOrder}>
                    Place Order
                    <CheckCircle2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="elevated" padding="lg" className="sticky top-24">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">Order Summary</h3>

              {/* Order Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{item.product_name}</p>
                      <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      ₹{item.total.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Shipping</span>
                  <Badge variant="success">FREE</Badge>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Tax (GST 18%)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-neutral-900">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">100% Secure Checkout</p>
                    <p className="text-sm text-green-700">
                      SSL encrypted payment processing
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
