import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Cadastro = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      window.alert('ERRO: As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/registro', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: firstName,
          sobrenome: lastName,
          dataNascimento: birthDate,
          email: email,
          senha: password
        })
      });

      if (response.status === 400) {
        window.alert('ERRO: Usuário já cadastrado!');
      } else if (response.status === 406) {
        window.alert('ERRO: Preencha todos os campos!');
      } else if (response.status === 201) {
        navigation.navigate('Home');
      } else {
        window.alert('ERRO: Ocorreu um erro inesperado');
      }
    } catch (error) {
      window.alert('ERRO: Não foi possível conectar ao servidor');
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastrar</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento (DD/MM/AAAA)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Já tem uma conta? Faça Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d81b60',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f8bbd0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#d81b60',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginText: {
    fontSize: 16,
    color: '#d81b60',
  },
});

export default Cadastro;
