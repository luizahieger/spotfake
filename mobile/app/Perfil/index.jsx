import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Perfil({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendImage = async (imageUri) => {
        try {
            const data = {
                "file": imageUri,
                "upload_preset": 'ml_default',
            };
            const res = await fetch('https://api.cloudinary.com/v1_1/dkshtl0gq/upload', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`Erro ${res.status}: ${res.statusText}`);
            }

            const result = await res.json();
            console.log(result)
            setProfileImage(result.url);
            setImageInDatabase(result.url);
        } catch (e) {
            console.error('Erro ao enviar imagem:', e);
            Alert.alert('Erro', 'Não foi possível enviar a imagem.');
        }
    };

    const setImageInDatabase = async(url) => {
        try {
            const response = await fetch(`http://localhost:8000/${email}/foto_perfil`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url
                })
            });

        } catch (error) {
            alert('erro!')
        }
    }


    const fetchUserData = async () => {
        try {
            const response = await fetch('http://192.168.0.100:8000/get.users', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            if (!response.headers.get('content-type')?.includes('application/json')) {
                throw new Error('Resposta não é JSON');
            }

            const userData = await response.json();
            setBio(userData.bio);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            Alert.alert('Erro', 'Erro ao conectar ao servidor.');
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permissão necessária', 'Permita o acesso à galeria para selecionar uma imagem.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            handleSendImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        Alert.alert('Perfil atualizado', 'Suas alterações foram salvas.');
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('As senhas devem coincidir');

        }
        try {
            const response = await fetch(`http://localhost:8000/${email}/nova_senha`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senha: newPassword
                })
            });
            if (response.status === 200) {
                setIsModalVisible(false);
            }

        } catch (error) {
            alert('erro!')
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                setEmail(value)
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
            console.log(result)
            setProfileImage(result.foto)
            setName(result.nome + result.sobrenome)
        } catch (error) {
            alert('erro!')
        }
    }

    useEffect(() => {
        fetchUserData();
        getData()
    }, []);

    return (
        <SafeAreaView style={styles.profileScreenContainer}>
            <View style={styles.topBar}>
                <Pressable onPress={() => navigation.navigate('Home')}><Ionicons name="arrow-back" size={26} color="white" /></Pressable>
            </View>
            <View style={styles.boxProfile}>
                <View style={styles.profileContentWrapper}>
                    <View style={styles.profileHeaderWrapper}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.avatarImage}
                            />
                        </TouchableOpacity>
                        {isEditing ? (
                            <TextInput
                                placeholder='Digite seu nome'
                                style={styles.nameInputField}
                                value={name}
                                onChangeText={(text) => setName(text)}
                            />
                        ) : (
                            <Text style={styles.userNameText}>{name}</Text>
                        )}
                        <Text style={styles.userEmailText}>{email}</Text>
                    </View>

                    <View style={styles.profileBodyWrapper}>
                        <Text style={styles.bioLabelText}>Bio</Text>
                        {isEditing ? (
                            <TextInput
                                placeholder='Digite sua bio'
                                style={styles.bioInputField}
                                value={bio}
                                onChangeText={(text) => setBio(text)}
                                multiline
                            />
                        ) : (
                            <Text style={styles.userBioText}>{bio}</Text>
                        )}
                    </View>
                    <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)} style={styles.botao}>
                        <Text style={styles.botaoText}>{isEditing ? "Salvar" : "Editar Perfil"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.botao}>
                        <Text style={styles.botaoText}>Trocar Senha</Text>
                    </TouchableOpacity>
                    <Modal visible={isModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Trocar Senha</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nova senha"
                                    secureTextEntry
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirmar nova senha"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity onPress={handleChangePassword} style={styles.botaoModal}>
                                    <Text style={styles.botaoModalText}>Confirmar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.botaoModal}>
                                    <Text style={styles.botaoModalText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    profileScreenContainer: {
        flex: 1,
        backgroundColor: '#fce4ec',
        padding: 20,
        justifyContent: 'center',
    },
    profileContentWrapper: {
        margin: 20,
    },
    profileHeaderWrapper: {
        alignItems: 'center',
        marginBottom: 30,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-start',
        padding: 12
    },
    avatarImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 15,
    },
    userNameText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    nameInputField: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#d81b60',
        borderBottomWidth: 1,
        borderBottomColor: '#d81b60',
        marginBottom: 10,
    },
    userEmailText: {
        fontSize: 16,
        color: 'white',
    },
    profileBodyWrapper: {
        marginVertical: 20,
    },
    bioLabelText: {
        fontSize: 20,
        color: 'white',
        marginBottom: 10,
    },
    userBioText: {
        fontSize: 16,
        color: 'white',
        lineHeight: 22,
    },
    bioInputField: {
        fontSize: 16,
        color: '#d81b60',
        lineHeight: 22,
        borderColor: '#d81b60',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fce4ec',
        textAlignVertical: 'top',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d81b60',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fce4ec',
        color: '#333',
        fontSize: 16,
    },
    botao: {
        backgroundColor: '#fce4ec',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    botaoModal: {
        backgroundColor: '#d81b60',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    botaoText: {
        color: '#d81b60',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botaoModalText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    boxProfile: {
        backgroundColor: '#d81b60',
        marginHorizontal: 80,
        borderRadius: 10,
        opacity: 1,
    },
});
