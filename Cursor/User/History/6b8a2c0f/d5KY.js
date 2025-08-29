import React, { useState } from 'react';
import { SafeAreaView, Text, Button, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen() {
  const [cigarettesSmoked, setCigarettesSmoked] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [healthBenefits, setHealthBenefits] = useState('');

  const pricePerCigarette = 0.5; // Prix d'une cigarette (en €)

  // Calcul des économies et des cigarettes non fumées
  const handleQuitSmoking = () => {
    setCigarettesSmoked(cigarettesSmoked + 1);
    setMoneySaved(moneySaved + pricePerCigarette);
    setHealthBenefits('Vous respirez mieux et avez plus d’énergie !');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Félicitations !</Text>
      <Text style={styles.subtitle}>Vous avez arrêté de fumer !</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Cigarettes non fumées : {cigarettesSmoked}</Text>
        <Text style={styles.stat}>Économies réalisées : {moneySaved.toFixed(2)} €</Text>
        <Text style={styles.stat}>Bienfaits sur la santé : {healthBenefits}</Text>
      </View>

      <Button title="Ajoutez une cigarette non fumée" onPress={handleQuitSmoking} />
    </SafeAreaView>
  );
}

function BenefitsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienfaits sur la santé</Text>
      <Text style={styles.subtitle}>Voici ce qui arrive à votre corps chaque jour sans cigarette :</Text>
      
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefit}>Jour 1 : Votre tension artérielle baisse.</Text>
        <Text style={styles.benefit}>Jour 7 : Votre fonction pulmonaire commence à s'améliorer.</Text>
        <Text style={styles.benefit}>Jour 30 : Votre risque de crise cardiaque commence à diminuer.</Text>
        {/* Ajoute plus de bénéfices ici */}
      </View>
    </SafeAreaView>
  );
}

function StatisticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.subtitle}>Visualisez vos progrès !</Text>
      {/* Tu peux ajouter des graphiques ici en utilisant des bibliothèques comme 'react-native-chart-kit' */}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Bienfaits" component={BenefitsScreen} />
        <Stack.Screen name="Statistiques" component={StatisticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  statsContainer: {
    marginBottom: 30,
  },
  stat: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  benefitsContainer: {
    marginTop: 20,
  },
  benefit: {
    fontSize: 16,
    color: '#3b5998',
    marginBottom: 10,
  },
});

