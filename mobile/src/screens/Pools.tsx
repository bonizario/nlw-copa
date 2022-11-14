import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, Icon, useToast, VStack } from 'native-base';
import { useCallback, useState } from 'react';

import { Button } from '../components/Button';
import { EmptyPoolList } from '../components/EmptyPoolList';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PoolCard, PoolCardProps } from '../components/PoolCard';
import { api } from '../services/api';

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardProps[]>([]);
  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get('/pools');
      setPools(response.data.pools);
    } catch (error) {
      console.error(error);
      if (!toast.isActive('1')) {
        toast.show({
          id: '1',
          title: 'Não foi possível carregar os bolões',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  return (
    <VStack flex="1" bgColor="gray.900">
      <Header title="Meus bolões" />
      <VStack
        mt="6"
        mx="5"
        pb="4"
        mb="4"
        borderBottomWidth="1"
        borderBottomColor="gray.600"
      >
        <Button
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          title="Buscar bolão por código"
          onPress={() => navigate('find')}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyPoolList />}
          _contentContainerStyle={{ pb: '32' }}
          px="5"
        />
      )}
    </VStack>
  );
}
