import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          senha: password
        })
      });

      if (response.status === 404) {
        window.alert('ERRO: Usuário não cadastrado!');
        return
      } else if (response.status === 406) {
        window.alert('ERRO: Preencha todos os campos!');
        return
      } else if (response.status === 403) {
        window.alert('ERRO: Senha incorreta!');
        return
      } else if (response.status === 200) {
        navigation.navigate('Home');
      } else if (response.status === 500) {
        window.alert('ERRO: Ocorreu um erro inesperado');
        return
      } else {
        window.alert('ERRO: Resposta desconhecida do servidor');
        return
      }
    } catch (error) {
      window.alert('ERRO: Não foi possível conectar ao servidor');
      return
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Esqueceu sua senha?</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d81b60',
    marginBottom: 16,
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
  registerText: {
    fontSize: 14,
    color: '#d81b60',
  },
});

export default Login;
