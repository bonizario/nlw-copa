import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';
import { useState } from 'react';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { api } from '../services/api';

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);
      if (!code.trim()) {
        if (!toast.isActive('1'))
          toast.show({
            id: '1',
            title: 'Informe o código do bolão!',
            placement: 'top',
            bgColor: 'red.500',
          });
        return;
      }
      await api.post('/pools/join', { code });
      toast.show({
        title: 'Você entrou no bolão com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });
      setIsLoading(false);
      setCode('');
      navigate('pools');
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      if (error.response?.status === 404 && !toast.isActive('2')) {
        return toast.show({
          id: '2',
          title: 'Bolão não encontrado!',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
      if (
        error.response?.data?.message ===
          'You have already joined this betting pool.' &&
        !toast.isActive('3')
      ) {
        return toast.show({
          id: '3',
          title: 'Você já participa desse bolão!',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
      if (!toast.isActive('4')) {
        toast.show({
          id: '4',
          title: 'Erro ao participar do bolão!',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    }
  }

  return (
    <VStack flex="1" bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt="8" mx="5" alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb="8"
          textAlign="center"
        >
          Participe de um bolão através{'\n'}de seu código único
        </Heading>
        <Input
          value={code}
          mb="2"
          placeholder="Qual o código do seu bolão?"
          autoCapitalize="characters"
          onChangeText={text => setCode(text.toUpperCase())}
        />
        <Button
          title="Participar do bolão"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
