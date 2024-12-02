import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [image, setImage] = useState(null)

  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('email');
        if (value !== null) {
            getImg(value)
        }
    } catch (e) {
        console.log(e)
    }
};

const getImg = async(email) => {
  try {
      const response = await fetch(`http://localhost:8000/${email}`, {
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          },
      })
      const result = await response.json()
      setImage(result.foto)
  } catch (error) {
      alert('erro!')
  }
}

useEffect(() => {
  getData()
}, []); 

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.navigate('Perfil')}>
          <Image
          style={{width: 50, height: 50, borderRadius: 100 }}
            source={{ uri: image }} />
        </Pressable>
      </View>
      <Text style={styles.text}>Esta é a home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d81b60',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    padding: 12
  }
});

export default Home;
