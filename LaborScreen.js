import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const LaborScreen = () => {
  const [month, setMonth] = useState('');
  const [expenses, setExpenses] = useState('');
  const [cost, setCost] = useState('');
  const [records, setRecords] = useState([]);
  const scrollViewRef = useRef(null);

  const handleSave = () => {
    const newRecord = {
      id: Date.now(),
      month,
      expenses,
      cost,
    };

    setRecords([...records, newRecord]);
    clearForm();
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const handleDelete = (id) => {
    const updatedRecords = records.filter((record) => record.id !== id);
    setRecords(updatedRecords);
  };

  const clearForm = () => {
    setMonth('');
    setExpenses('');
    setCost('');
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
              <th>Month</th>
              <th>Expenses</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
    `;

    data.forEach((record) => {
      html += `
        <tr>
          <td>${record.month}</td>
          <td>${record.expenses}</td>
          <td>${record.cost}</td>
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
      <Text style={styles.heading}>Labor & Majuri</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Month"
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={styles.input}
          placeholder="Expenses"
          value={expenses}
          onChangeText={setExpenses}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cost"
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
        />
        <Button title="Save" onPress={handleSave} />
        <Button title="Clear" onPress={clearForm} />
      </View>

      <ScrollView ref={scrollViewRef}>
        {records.map((record) => (
          <View key={record.id} style={styles.recordContainer}>
            <Text>Month: {record.month}</Text>
            <Text>Expenses: {record.expenses}</Text>
            <Text>Cost: {record.cost}</Text>
            <Button
              title="Delete"
              onPress={() => handleDelete(record.id)}
              style={styles.actionButton}
            />
          </View>
        ))}
      </ScrollView>

      <Button title="Export" onPress={handleExport} />
    </View>
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
});

export default LaborScreen;
