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
    { id: 1, title: "Luan Favoritas", imageUrl: "https://i.pinimg.com/736x/26/66/5c/26665ce8ef3b98bd44615d6a6f85efd2.jpg" },
    { id: 2, title: "+ Animação ;)", imageUrl: "https://i.pinimg.com/736x/4c/be/2e/4cbe2ee0e7885abba6f1d982ddde7a49.jpg" },
    { id: 3, title: "Modão", imageUrl: "https://i.pinimg.com/236x/13/89/4f/13894f1d07e4d807c06c3563ed5a6035.jpg" },
  ];

  const artistas = [
    { id: 4, title: "Luan Santana", imageUrl: "https://i.pinimg.com/736x/17/33/97/173397ab0829467c7ff9da3bdbf459ae.jpg" },
    { id: 5, title: "Gusttavo Lima", imageUrl: "https://i.pinimg.com/736x/c4/71/f6/c471f686fccab957e2c6785f2d1c7ce3.jpg" },
    { id: 6, title: "One Direction", imageUrl: "https://i.pinimg.com/736x/fd/74/c6/fd74c6b97a433407bcc8d03771c32cd5.jpg" },
  ];

  const albuns = [
    { id: 7, title: "O Embaixador", imageUrl: "https://i.pinimg.com/236x/44/9f/05/449f056e1d3c637d449d14e677cfd3c5.jpg" },
    { id: 8, title: "Luan CITY 2.0.", imageUrl: "https://i.pinimg.com/736x/b5/47/98/b54798a5ab5efe0d34f4c01c85feae13.jpg" },
  ];

  const musicas = [
    { id: 9, title: "Deus é muito bom", imageUrl: "https://i.pinimg.com/736x/b5/47/98/b54798a5ab5efe0d34f4c01c85feae13.jpg" },
    { id: 10, title: "Princesinha Mandona", imageUrl: "https://i.pinimg.com/236x/01/66/be/0166be5839386af5838e8e7c41a20d8c.jpg" },
    { id: 11, title: "Certeza", imageUrl: "https://i.pinimg.com/474x/94/16/41/941641dfebadcda71f42398b7cb3da60.jpg" },
    { id: 12, title: "Carrinho na Areia", imageUrl: "https://i.pinimg.com/236x/44/9f/05/449f056e1d3c637d449d14e677cfd3c5.jpg" },
    { id: 13, title: "Sinônimos", imageUrl: "https://i.pinimg.com/236x/cd/f9/8d/cdf98db78ced11788690ac7dce8fca21.jpg" },
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
      <ScrollView style={styles.scroll}>
        {renderSection("Músicas", musicas)}
        {renderSection("Playlists", playlists)}
        {renderSection("Artistas", artistas)}
        {renderSection("Álbuns", albuns)}
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
    marginRight: 30,
    alignItems: 'center',
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#880e4f',
  },
  scroll: {
    height: 100,
  }
});

export default Home;
