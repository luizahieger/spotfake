import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [image, setImage] = useState(null);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        getImg(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getImg = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/${email}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setImage(result.foto);
    } catch (error) {
      alert('Erro ao carregar imagem!');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Dados das listas
  const playlists = [
    { id: 1, title: "Top Hits", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
    { id: 2, title: "Chill Beats", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
  ];

  const artistas = [
    { id: 3, title: "Taylor Swift", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
    { id: 4, title: "Drake", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
  ];

  const albuns = [
    { id: 5, title: "1989", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
    { id: 6, title: "Certified Lover Boy", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
  ];

  const musicas = [
    { id: 7, title: "Shake It Off", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
    { id: 8, title: "God's Plan", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
    { id: 9, title: "Bad Guy", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
    { id: 10, title: "Blinding Lights", imageUrl: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" },
  ];

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item) => (
          <View key={item.id} style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.navigate('Perfil')}>
          <Image
            style={styles.profileImage}
            source={{ uri: image || "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2024/03/27/cachorro-salsicha-(2)-ubgbe5b698hf.jpg" }}
          />
        </Pressable>
      </View>
      <Text style={styles.title}>SpotFake</Text>
      <ScrollView>
        {renderSection("Playlists", playlists)}
        {renderSection("Artistas", artistas)}
        {renderSection("Álbuns", albuns)}
        {renderSection("Músicas", musicas)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
    padding: 16,
  },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d81b60',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#c2185b',
    marginBottom: 8,
  },
  item: {
    marginRight: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#880e4f',
  },
});

export default Home;
