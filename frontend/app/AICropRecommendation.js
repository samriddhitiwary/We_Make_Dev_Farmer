import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  FlatList,
} from 'react-native';

// --- IMPORTANT ---
// Replace 'YOUR_COMPUTER_IP' with your computer's IP address.
const API_URL = 'http://localhost:8000/api/recommend_crop'; // Example: 'http://192.168.1.10:8000'

// --- Data for dropdowns ---
const soilTypes = ['Clay', 'Saline', 'Loamy', 'Peaty'];
const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const Dropdown = ({ label, data, selected, onSelect }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ width: '100%', marginBottom: 15 }}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: selected ? '#000' : '#999' }}>
          {selected ? selected : `Select ${label}`}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {item.label || item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalItem, { backgroundColor: '#eee' }]}
              onPress={() => setVisible(false)}
            >
              <Text style={[styles.modalItemText, { color: '#D32F2F' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AICropRecommendation = () => {
  const [soilType, setSoilType] = useState('');
  const [month, setMonth] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRecommendation = async () => {
    if (!soilType || !month) {
      Alert.alert('Missing Information', 'Please select both a Soil Type and a Month.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Soil_Type: soilType, Month: month }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Something went wrong');
      setRecommendation(data.recommended_crop);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Crop Recommendation AI</Text>
      <Text style={styles.subtitle}>Select the details below to get a crop suggestion.</Text>

      <Dropdown
        label="Soil Type"
        data={soilTypes}
        selected={soilType}
        onSelect={setSoilType}
      />
      <Dropdown
        label="Month"
        data={months}
        selected={month ? months.find(m => m.value === month).label : ''}
        onSelect={item => setMonth(item.value || item)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleGetRecommendation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Get Recommendation</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {recommendation && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Recommended Crop:</Text>
          <Text style={styles.resultText}>{recommendation}</Text>
        </View>
      )}
    </View>
  );
};

// --- Styling ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 30 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  dropdownLabel: { marginBottom: 5, fontSize: 14, color: '#333' },
  dropdownButton: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: { backgroundColor: '#FFF', borderRadius: 10, maxHeight: '70%' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontSize: 16 },
  button: { width: '100%', backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { marginTop: 20, fontSize: 16, color: '#D32F2F', textAlign: 'center' },
  resultContainer: { marginTop: 30, padding: 20, backgroundColor: '#E8F5E9', borderRadius: 10, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9' },
  resultTitle: { fontSize: 18, color: '#388E3C', fontWeight: '600' },
  resultText: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginTop: 5 },
});

export default AICropRecommendation;
