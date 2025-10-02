import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import AICropRecommendation from "./AICropRecommendation";


// --- PriceCard Component ---
const PriceCard = ({ title, price, color, icon }) => {
  const colorConfig = {
    blue: { bg: "#DBEAFE", text: "#2563EB", border: "#3B82F6" },
    green: { bg: "#D1FAE5", text: "#059669", border: "#10B981" },
    orange: { bg: "#FFEDD5", text: "#D97706", border: "#F97316" },
  };
  const currentStyle = colorConfig[color];

  return (
    <View style={[styles.priceCard, { backgroundColor: currentStyle.bg, borderLeftColor: currentStyle.border }]}>
      <Text style={[styles.priceCardTitle, { color: currentStyle.text }]}>{icon} {title} Price</Text>
      <Text style={styles.priceCardValue}>₹{price ? Number(price).toFixed(2) : '0.00'}</Text>
      <Text style={styles.priceCardUnit}>Per Quintal</Text>
    </View>
  );
};

// --- PriceChart Component ---
const PriceChart = ({ results }) => {
  const data = {
    labels: ["Min", "Modal", "Max"],
    datasets: [
      {
        data: [
          Number(results.predicted_min_price),
          Number(results.predicted_modal_price),
          Number(results.predicted_max_price),
        ],
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // line color
        strokeWidth: 2,
      },
    ],
  };
  const router = useRouter();
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Price Distribution</Text>
      <LineChart
        data={data}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel="₹"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#2563EB",
          },
        }}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
};

// --- PricePredictionForm Component ---
const PricePredictionForm = () => {
  const [formData, setFormData] = useState({
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Lasalgaon(Niphad)',
    commodity: 'Wheat',
    variety: 'Maharashtra 2189',
    grade: 'FAQ'
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData = {
        predicted_min_price: (Math.random() * 500 + 1500).toFixed(2),
        predicted_modal_price: (Math.random() * 500 + 1700).toFixed(2),
        predicted_max_price: (Math.random() * 500 + 2000).toFixed(2),
      };
      setResults(mockData);
    } catch (err) {
      alert('Network Error. Check API connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Mandi Price Predictor 🌾</Text>
      {Object.keys(formData).map((key) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</Text>
          <TextInput
            style={styles.input}
            value={formData[key]}
            onChangeText={text => handleChange(key, text)}
            placeholder={`Enter ${key}`}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Get Prediction</Text>}
      </TouchableOpacity>

      {results && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.summaryText}>
            Predicted <Text style={{ fontWeight: 'bold' }}>Modal Price</Text> is <Text style={{ fontWeight: 'bold' }}>₹{Number(results.predicted_modal_price).toFixed(2)}</Text> per quintal.
          </Text>

          <PriceCard title="Minimum" price={results.predicted_min_price} color="blue" icon="📉" />
          <PriceCard title="Modal" price={results.predicted_modal_price} color="green" icon="📊" />
          <PriceCard title="Maximum" price={results.predicted_max_price} color="orange" icon="📈" />
          <PriceChart results={results} />
        </View>
      )}
    </View>
  );
};

// --- CropRecommendation Component ---
const CropRecommendation = () => (
  <View style={styles.featureContainer}>
    
    
    <AICropRecommendation/>
  </View>
);

// --- CUSTOM HEADER ---
const CustomHeader = ({ router }) => (
  <View style={headerStyles.headerContainer}>
    <TouchableOpacity
      style={headerStyles.backButton}
      onPress={() => router.replace("/Home")}
      activeOpacity={0.6}
    >
      <Icon name="chevron-left" size={28} color={COLORS.textPrimary} />
    </TouchableOpacity>
    <Text style={headerStyles.headerTitle}>Crop Disease Diagnostics</Text>
    <View style={headerStyles.placeholder} />
  </View>
);
// --- Main Screen Component ---
const AIFarmerAssistant = () => {
  const [activeTab, setActiveTab] = useState('mandi');

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={{ position: "absolute", left: 16, top: 16 }}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Farmer Assistant</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mandi' && styles.activeTab]}
          onPress={() => setActiveTab('mandi')}
        >
          <Text style={[styles.tabText, activeTab === 'mandi' && styles.activeTabText]}>Mandi Prices</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'crop' && styles.activeTab]}
          onPress={() => setActiveTab('crop')}
        >
          <Text style={[styles.tabText, activeTab === 'crop' && styles.activeTabText]}>Recommend Crop</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16 }}>
        {activeTab === 'mandi' ? <PricePredictionForm /> : <CropRecommendation />}
      </View>
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#10B981' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#059669' },
  formContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  formTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#4B5563' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, backgroundColor: '#F9FAFB' },
  submitButton: { backgroundColor: '#10B981', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  summaryText: { fontSize: 15, color: '#065F46', textAlign: 'center', marginBottom: 16 },
  priceCard: { padding: 16, borderRadius: 12, borderLeftWidth: 5, marginBottom: 12 },
  priceCardTitle: { fontSize: 14, fontWeight: '600' },
  priceCardValue: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginVertical: 4 },
  priceCardUnit: { fontSize: 12, color: '#6B7280' },
  chartContainer: { marginTop: 16, borderRadius: 16, backgroundColor: '#fff', padding: 16 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  featureContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center' },
  featureTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 8 },
  featureText: { fontSize: 16, textAlign: 'center', color: '#6B7280', marginVertical: 2 },
});

export default AIFarmerAssistant;
