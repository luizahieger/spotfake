import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import PlaylistSection from '../../components/PlaylistSection';
import MusicControls from '../../components/MusicControls';

const HomeScreen = () => {
  const playlists = [
    { id: '1', name: 'Minha Playlist 1' },
    { id: '2', name: 'Minha Playlist 2' },
    { id: '3', name: 'Minha Playlist 3' },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <PlaylistSection playlists={playlists} />
      <MusicControls />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});

export default HomeScreen;
