import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LaborScreen from './LaborScreen';
import RawProductsScreen from './RawProductsScreen';

const Tab = createBottomTabNavigator();

const AccountKeeping = () => {
  const [date, setDate] = useState('');
  const [sugarMill, setSugarMill] = useState('');
  const [rent, setRent] = useState('');
  const [paid, setPaid] = useState('');
  const [records, setRecords] = useState([]);
  const scrollViewRef = useRef(null);

  const handleSave = () => {
    const newRecord = {
      id: Date.now(),
      date,
      sugarMill,
      rent,
      paid,
    };

    setRecords([...records, newRecord]);
    clearForm();
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const handleDelete = (id) => {
    const updatedRecords = records.filter((record) => record.id !== id);
    setRecords(updatedRecords);
  };

  const handleEdit = (id) => {
    const recordToEdit = records.find((record) => record.id === id);
    if (recordToEdit) {
      setDate(recordToEdit.date);
      setSugarMill(recordToEdit.sugarMill);
      setRent(recordToEdit.rent);
      setPaid(recordToEdit.paid);
    }
  };

  const clearForm = () => {
    setDate('');
    setSugarMill('');
    setRent('');
    setPaid('');
  };

  const handleExport = async () => {
    const htmlContent = generateHtmlContent(records);
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    Sharing.shareAsync(uri);
  };

  const generateHtmlContent = (data) => {
    let html = `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sugar Mill</th>
              <th>Rent</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
    `;

    data.forEach((record) => {
      html += `
        <tr>
          <td>${record.date}</td>
          <td>${record.sugarMill}</td>
          <td>${record.rent}</td>
          <td>${record.paid}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    return html;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Armec India</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Sugar Mill"
          value={sugarMill}
          onChangeText={setSugarMill}
        />
        <TextInput
          style={styles.input}
          placeholder="Rent"
          value={rent}
          onChangeText={setRent}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Paid"
          value={paid}
          onChangeText={setPaid}
          keyboardType="numeric"
        />
        <Button title="Save" onPress={handleSave} />
        <Button title="Clear" onPress={clearForm} />
      </View>

      <ScrollView ref={scrollViewRef}>
        {records.map((record) => (
          <View key={record.id} style={styles.recordContainer}>
            <Text>Date: {record.date}</Text>
            <Text>Sugar Mill: {record.sugarMill}</Text>
            <Text>Rent: {record.rent}</Text>
            <Text>Paid: {record.paid}</Text>
            <View style={styles.actionsContainer}>
              <Button
                title="Edit"
                onPress={() => handleEdit(record.id)}
                style={styles.actionButton}
              />
              <Button
                title="Delete"
                onPress={() => handleDelete(record.id)}
                style={styles.actionButton}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <Button title="Export" onPress={handleExport} />

    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Account') {
              iconName = 'account';
            } else if (route.name === 'LaborScreen') {
              iconName = 'account-hard-hat';
            } else if (route.name === 'RawProductsScreen') {
              iconName = 'cube-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Account" component={AccountKeeping} />
        <Tab.Screen name="LaborScreen" component={LaborScreen} />
        <Tab.Screen name="RawProductsScreen" component={RawProductsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
  recordContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    width: '45%',
  },
});

export default App;
