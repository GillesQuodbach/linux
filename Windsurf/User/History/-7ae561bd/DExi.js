import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { usePlants, PLANT_TYPES } from '../context/PlantContext';
import { colors } from '../constants/colors';

const screenWidth = Dimensions.get('window').width;

export default function ChartsScreen() {
  const { 
    plants, 
    groups, 
    getGroupHydroponicHistory, 
    getPlantsInGroup 
  } = usePlants();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewMode, setViewMode] = useState('plants'); // 'plants' or 'groups'
  const [chartType, setChartType] = useState('ph'); // 'ph', 'ec', 'fertilizer'

  const chartConfig = {
    backgroundColor: colors.cardBackground,
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const waterChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    propsForDots: {
      ...chartConfig.propsForDots,
      stroke: colors.water,
    },
  };

  const getHydroponicPlants = () => {
    return plants.filter(plant => 
      plant.type === PLANT_TYPES.HYDROPONIC && 
      plant.hydroponicHistory && 
      plant.hydroponicHistory.length > 0
    );
  };

  const getHydroponicGroups = () => {
    return groups.filter(group => {
      const groupPlants = getPlantsInGroup ? getPlantsInGroup(group.id) : [];
      const hasHydroponicPlants = groupPlants.some(plant => plant.type === PLANT_TYPES.HYDROPONIC);
      const hasHistory = getGroupHydroponicHistory ? 
        getGroupHydroponicHistory(group.id).length > 0 : false;
      return hasHydroponicPlants && hasHistory;
    });
  };

  const getPlantsWithFertilizerHistory = () => {
    return plants.filter(plant => 
      plant.fertilizerHistory && 
      plant.fertilizerHistory.length > 0
    );
  };

  const getPHData = (entity) => {
    let history = [];
    
    if (viewMode === 'groups' && entity && getGroupHydroponicHistory) {
      history = getGroupHydroponicHistory(entity.id);
    } else if (viewMode === 'plants' && entity && entity.hydroponicHistory) {
      history = entity.hydroponicHistory;
    }
    
    if (!history || history.length === 0) {
      return null;
    }

    const recentHistory = history.slice(-7); // Last 7 measurements
    
    return {
      labels: recentHistory.map((_, index) => `M${index + 1}`),
      datasets: [{
        data: recentHistory.map(record => record.ph),
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  };

  const getECData = (entity) => {
    let history = [];
    
    if (viewMode === 'groups' && entity && getGroupHydroponicHistory) {
      history = getGroupHydroponicHistory(entity.id);
    } else if (viewMode === 'plants' && entity && entity.hydroponicHistory) {
      history = entity.hydroponicHistory;
    }
    
    if (!history || history.length === 0) {
      return null;
    }

    const recentHistory = history.slice(-7); // Last 7 measurements
    
    return {
      labels: recentHistory.map((_, index) => `M${index + 1}`),
      datasets: [{
        data: recentHistory.map(record => record.ec),
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  };

  const getFertilizerData = (plant) => {
    if (!plant.fertilizerHistory || plant.fertilizerHistory.length === 0) {
      return null;
    }

    // Group by month
    const monthlyData = {};
    plant.fertilizerHistory.forEach(record => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const labels = Object.keys(monthlyData).slice(-6); // Last 6 months
    const data = labels.map(label => monthlyData[label]);

    return {
      labels: labels.map(label => {
        const [year, month] = label.split('-');
        return `${month}/${year.slice(-2)}`;
      }),
      datasets: [{
        data,
      }],
    };
  };



  const renderEntitySelector = () => {
    let availableEntities = [];
    
    if (viewMode === 'groups') {
      availableEntities = chartType === 'fertilizer' ? [] : getHydroponicGroups();
    } else {
      availableEntities = chartType === 'fertilizer' 
        ? getPlantsWithFertilizerHistory()
        : getHydroponicPlants();
    }

    if (availableEntities.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {viewMode === 'groups' 
              ? 'Aucun groupe hydroponique avec données'
              : chartType === 'fertilizer' 
                ? 'Aucune plante avec historique d\'engrais'
                : 'Aucune plante hydroponique avec données'
            }
          </Text>
        </View>
      );
    }

    const selectedEntity = viewMode === 'groups' ? selectedGroup : selectedPlant;
    const setSelectedEntity = viewMode === 'groups' ? setSelectedGroup : setSelectedPlant;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plantSelector}>
        {availableEntities.map(entity => (
          <TouchableOpacity
            key={entity.id}
            style={[
              styles.plantSelectorItem,
              selectedEntity?.id === entity.id && styles.plantSelectorItemActive
            ]}
            onPress={() => setSelectedEntity(entity)}
          >
            <Text style={[
              styles.plantSelectorText,
              selectedEntity?.id === entity.id && styles.plantSelectorTextActive
            ]}>
              {viewMode === 'groups' ? `Groupe: ${entity.name}` : entity.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderChart = () => {
    const selectedEntity = viewMode === 'groups' ? selectedGroup : selectedPlant;
    
    if (!selectedEntity) {
      return (
        <View style={styles.emptyStateFullHeight}>
          <Ionicons name="bar-chart-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyStateText}>
            {viewMode === 'groups' 
              ? 'Sélectionnez un groupe pour voir les graphiques'
              : 'Sélectionnez une plante pour voir les graphiques'
            }
          </Text>
        </View>
      );
    }

    let data, title;
    
    switch (chartType) {
      case 'ph':
        data = getPHData(selectedEntity);
        title = viewMode === 'groups' 
          ? `pH - Groupe: ${selectedEntity.name}` 
          : `pH - ${selectedEntity.name}`;
        break;
      case 'ec':
        data = getECData(selectedEntity);
        title = viewMode === 'groups' 
          ? `EC - Groupe: ${selectedEntity.name}` 
          : `EC - ${selectedEntity.name}`;
        break;
      case 'fertilizer':
        if (viewMode === 'groups') {
          return (
            <View style={styles.emptyStateFullHeight}>
              <Text style={styles.emptyStateText}>
                Les graphiques d'engrais ne sont pas disponibles pour les groupes
              </Text>
            </View>
          );
        }
        data = getFertilizerData(selectedEntity);
        title = `Engrais - ${selectedEntity.name}`;
        break;
      default:
        return null;
    }

    if (!data || data.datasets[0].data.length === 0) {
      return (
        <View style={styles.emptyStateFullHeight}>
          <Text style={styles.emptyStateText}>
            Pas assez de données pour afficher le graphique
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        {chartType === 'fertilizer' ? (
          <BarChart
            data={data}
            width={screenWidth - 32}
            height={500}
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={0}
          />
        ) : (
          <LineChart
            data={data}
            width={screenWidth - 32}
            height={500}
            chartConfig={waterChartConfig}
            style={styles.chart}
            bezier
          />
        )}
        
        {/* Optimal range indicator for pH/EC */}
        {(chartType === 'ph' || chartType === 'ec') && selectedEntity && (
          <View style={styles.rangeIndicator}>
            <Text style={styles.rangeText}>
              {viewMode === 'groups' 
                ? `Plage optimale moyenne du groupe`
                : `Plage optimale: ${
                    chartType === 'ph' 
                      ? selectedEntity.optimalPHRange?.join(' - ') || 'N/A'
                      : selectedEntity.optimalECRange?.join(' - ') || 'N/A'
                  }`
              }
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
          {/* View Mode Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mode d'affichage</Text>
            <View style={styles.chartTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.chartTypeButton,
                  viewMode === 'plants' && styles.chartTypeButtonActive
                ]}
                onPress={() => {
                  setViewMode('plants');
                  setSelectedPlant(null);
                  setSelectedGroup(null);
                }}
              >
                <Ionicons name="leaf" size={20} color={
                  viewMode === 'plants' ? colors.white : colors.primary
                } />
                <Text style={[
                  styles.chartTypeText,
                  viewMode === 'plants' && styles.chartTypeTextActive
                ]}>
                  Plantes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.chartTypeButton,
                  viewMode === 'groups' && styles.chartTypeButtonActive
                ]}
                onPress={() => {
                  setViewMode('groups');
                  setSelectedPlant(null);
                  setSelectedGroup(null);
                }}
              >
                <Ionicons name="layers" size={20} color={
                  viewMode === 'groups' ? colors.white : colors.primary
                } />
                <Text style={[
                  styles.chartTypeText,
                  viewMode === 'groups' && styles.chartTypeTextActive
                ]}>
                  Groupes
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Chart Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type de graphique</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chartTypeSelector}>
<TouchableOpacity
                  style={[
                    styles.chartTypeButton,
                    chartType === 'ph' && styles.chartTypeButtonActive
                  ]}
                  onPress={() => {
                    setChartType('ph');
                    setSelectedPlant(null);
                    setSelectedGroup(null);
                  }}
                >
                  <Ionicons name="flask" size={20} color={
                    chartType === 'ph' ? colors.white : colors.water
                  } />
                  <Text style={[
                    styles.chartTypeText,
                    chartType === 'ph' && styles.chartTypeTextActive
                  ]}>
                    pH
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.chartTypeButton,
                    chartType === 'ec' && styles.chartTypeButtonActive
                  ]}
                  onPress={() => {
                    setChartType('ec');
                    setSelectedPlant(null);
                  }}
                >
                  <Ionicons name="flash" size={20} color={
                    chartType === 'ec' ? colors.white : colors.water
                  } />
                  <Text style={[
                    styles.chartTypeText,
                    chartType === 'ec' && styles.chartTypeTextActive
                  ]}>
                    EC
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.chartTypeButton,
                    chartType === 'fertilizer' && styles.chartTypeButtonActive
                  ]}
                  onPress={() => {
                    setChartType('fertilizer');
                    setSelectedPlant(null);
                  }}
                >
                  <Ionicons name="leaf" size={20} color={
                    chartType === 'fertilizer' ? colors.white : colors.primary
                  } />
                  <Text style={[
                    styles.chartTypeText,
                    chartType === 'fertilizer' && styles.chartTypeTextActive
                  ]}>
                    Engrais
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Entity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {viewMode === 'groups' ? 'Sélectionner un groupe' : 'Sélectionner une plante'}
            </Text>
            {renderEntitySelector()}
          </View>

          {/* Chart */}
          <View style={styles.chartSection}>
            {renderChart()}
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  chartSection: {
    flex: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    gap: 8,
  },
  chartTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  chartTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  chartTypeTextActive: {
    color: colors.white,
  },
  plantSelector: {
    marginBottom: 16,
  },
  plantSelectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  plantSelectorItemActive: {
    backgroundColor: colors.primary,
  },
  plantSelectorText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  plantSelectorTextActive: {
    color: colors.white,
  },
  chartContainer: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  rangeIndicator: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 6,
  },
  rangeText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  emptyStateFullHeight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },

});
