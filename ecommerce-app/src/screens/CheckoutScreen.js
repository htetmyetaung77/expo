import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { clearCart } from '../store/cartSlice';
import { addOrder } from '../store/userSlice';

export default function CheckoutScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.user);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [selectedPayment, setSelectedPayment] = useState('card');

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const requiredShipping = ['fullName', 'address', 'city', 'zipCode', 'phone'];
    const requiredPayment = selectedPayment === 'card' 
      ? ['cardNumber', 'expiryDate', 'cvv', 'cardholderName']
      : [];

    for (let field of requiredShipping) {
      if (!shippingInfo[field].trim()) {
        Alert.alert('Missing Information', `Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    for (let field of requiredPayment) {
      if (!paymentInfo[field].trim()) {
        Alert.alert('Missing Information', `Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    const order = {
      id: Date.now(),
      items: items,
      total: total * 1.08,
      shippingInfo,
      paymentMethod: selectedPayment,
      status: 'Processing',
      date: new Date().toISOString(),
    };

    dispatch(addOrder(order));
    dispatch(clearCart());

    Alert.alert(
      'Order Placed!',
      'Your order has been placed successfully. You will receive a confirmation email shortly.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main', { screen: 'Home' })
        }
      ]
    );
  };

  const taxAmount = total * 0.08;
  const finalTotal = total + taxAmount;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>${taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalValue}>Free</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotalRow]}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Shipping Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={shippingInfo.fullName}
            onChangeText={(value) => handleInputChange('shipping', 'fullName', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={shippingInfo.address}
            onChangeText={(value) => handleInputChange('shipping', 'address', value)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              value={shippingInfo.city}
              onChangeText={(value) => handleInputChange('shipping', 'city', value)}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="ZIP Code"
              value={shippingInfo.zipCode}
              onChangeText={(value) => handleInputChange('shipping', 'zipCode', value)}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={shippingInfo.phone}
            onChangeText={(value) => handleInputChange('shipping', 'phone', value)}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.formCard}>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                selectedPayment === 'card' && styles.selectedPaymentOption
              ]}
              onPress={() => setSelectedPayment('card')}
            >
              <Ionicons name="card" size={20} color={selectedPayment === 'card' ? '#007AFF' : '#666'} />
              <Text style={[
                styles.paymentOptionText,
                selectedPayment === 'card' && styles.selectedPaymentOptionText
              ]}>
                Credit Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                selectedPayment === 'paypal' && styles.selectedPaymentOption
              ]}
              onPress={() => setSelectedPayment('paypal')}
            >
              <Ionicons name="logo-paypal" size={20} color={selectedPayment === 'paypal' ? '#007AFF' : '#666'} />
              <Text style={[
                styles.paymentOptionText,
                selectedPayment === 'paypal' && styles.selectedPaymentOptionText
              ]}>
                PayPal
              </Text>
            </TouchableOpacity>
          </View>

          {selectedPayment === 'card' && (
            <View style={styles.cardForm}>
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={paymentInfo.cardholderName}
                onChangeText={(value) => handleInputChange('payment', 'cardholderName', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChangeText={(value) => handleInputChange('payment', 'cardNumber', value)}
                keyboardType="numeric"
                maxLength={16}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChangeText={(value) => handleInputChange('payment', 'expiryDate', value)}
                  maxLength={5}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChangeText={(value) => handleInputChange('payment', 'cvv', value)}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <LinearGradient
          colors={['#28A745', '#20C997']}
          style={styles.placeOrderGradient}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.placeOrderText}>Place Order - ${finalTotal.toFixed(2)}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  finalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginTop: 10,
    marginBottom: 0,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28A745',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  paymentOptions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginRight: 10,
  },
  selectedPaymentOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  paymentOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  selectedPaymentOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  cardForm: {
    marginTop: 10,
  },
  placeOrderButton: {
    margin: 15,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  placeOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  placeOrderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});