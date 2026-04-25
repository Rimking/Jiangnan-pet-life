import { useCallback, useMemo, useState } from 'react';
import { useDidShow } from '@tarojs/taro';
import { getPetListData, mapPetToProfileModel, PetItem } from '@/api/data';
import { PetProfileModel } from '@/types/pet';

export const usePetApiPets = () => {
  const [pets, setPets] = useState<PetProfileModel[]>([]);
  const [rawPets, setRawPets] = useState<PetItem[]>([]);
  const [activePetId, setActivePetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshPets = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const petList = await getPetListData({});
      const profileList = petList.map(mapPetToProfileModel);
      setRawPets(petList);
      setPets(profileList);

      setActivePetId((prev) => {
        if (prev && profileList.some((item) => item.id === prev)) {
          return prev;
        }
        return profileList[0]?.id || '';
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : '宠物数据加载失败';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useDidShow(() => {
    refreshPets();
  });

  const activePet = useMemo(() => {
    return pets.find((item) => item.id === activePetId) || pets[0];
  }, [activePetId, pets]);

  const activeRawPet = useMemo(() => {
    return rawPets.find((item) => item.id === activePetId) || rawPets[0];
  }, [activePetId, rawPets]);

  return {
    pets,
    rawPets,
    activePetId,
    activePet,
    activeRawPet,
    loading,
    error,
    setActivePetId,
    refreshPets,
  };
};
