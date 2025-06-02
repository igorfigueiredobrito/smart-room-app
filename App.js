import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import { connect } from 'mqtt';
import Slider from '@react-native-community/slider'; // IMPORTAÇÃO AQUI

export default function App() {
  const [luminosidade, setLuminosidade] = useState(50);

  const sendHttpRequest = async (comando) => {
    try {
      const response = await axios.get(
        `https://lucaspinotti.app.n8n.cloud/webhook/smartroom/devicecontrol?comando=${comando}`
      );
      Alert.alert('Atualização Enviada');
    } catch (error) {
      Alert.alert('Erro ao Enviar', error.message);
    }
  };

  const sendMqttMessage = () => {
    const client = connect('wss://test.mosquitto.org:8081');
    client.on('connect', () => {
      client.publish('smart/luminosidade', luminosidade.toString());
      Alert.alert('MQTT', `Luminosidade enviada: ${luminosidade}`);
      client.end();
    });

    client.on('error', (err) => {
      Alert.alert('Erro MQTT', err.message);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <Text style={styles.title}>🏠 App Smart Home</Text>

      {/* Slider de Luminosidade */}
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={luminosidade}
        onValueChange={setLuminosidade}
        minimumTrackTintColor="#60a5fa"
        maximumTrackTintColor="#94a3b8"
        thumbTintColor="#60a5fa"
      />
      <Text style={styles.sliderLabel}>Luminosidade: {luminosidade}%</Text>

      {/* Botões */}
      <TouchableOpacity
        style={styles.atualizarLuminosidade}
        onPress={() => sendHttpRequest(`di${String(luminosidade).padStart(3, '0')}`)}
      >

        <Text style={styles.buttonText}>Atualizar Luminosidade</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.abrirJanela} onPress={() => sendHttpRequest('aj000')}>
        <Text style={styles.buttonText}>Abrir Janela</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.fecharJanela} onPress={() => sendHttpRequest('fj000')}>
        <Text style={styles.buttonText}>Fechar Janela</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.abrirPorta} onPress={() => sendHttpRequest('ap000')}>
        <Text style={styles.buttonText}>Abrir Porta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.fecharPorta} onPress={() => sendHttpRequest('fp000')}>
        <Text style={styles.buttonText}>Fechar Porta</Text>
      </TouchableOpacity>
    </View>
  );
}

const baseButton = {
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  width: '100%',
  marginBottom: 20,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  sliderLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  atualizarLuminosidade: {
    ...baseButton,
    backgroundColor: '#60a5fa',
  },
  abrirJanela: {
    ...baseButton,
    backgroundColor: '#2563eb',
  },
  fecharJanela: {
    ...baseButton,
    backgroundColor: '#10b981',
  },
  abrirPorta: {
    ...baseButton,
    backgroundColor: '#f59e0b',
  },
  fecharPorta: {
    ...baseButton,
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
