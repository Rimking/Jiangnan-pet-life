import { useCallback, useMemo, useState } from 'react';
import { useDidShow } from '@tarojs/taro';
import { getPetListData, mapPetToProfileModel, PetItem } from '@/api/data';
import { PetProfileModel } from '@/types/pet';
import { isLoggedIn } from '@/utils/authState';
import {
  clearStoredActivePetId,
  getStoredActivePetId,
  setStoredActivePetId,
} from '@/utils/activePetState';

export const usePetApiPets = (preferredPetId?: string) => {
  const [pets, setPets] = useState<PetProfileModel[]>([]);
  const [rawPets, setRawPets] = useState<PetItem[]>([]);
  const [activePetId, setActivePetIdState] = useState(() => preferredPetId || getStoredActivePetId());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setActivePetId = useCallback((petId: string) => {
    setActivePetIdState(petId);
    setStoredActivePetId(petId);
  }, []);

  const resetPets = useCallback(() => {
    setPets([]);
    setRawPets([]);
    setActivePetIdState('');
    clearStoredActivePetId();
    setError('');
    setLoading(false);
  }, []);

  const refreshPets = useCallback(async () => {
    if (!isLoggedIn()) {
      resetPets();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const petList = await getPetListData({});
      const profileList = petList.map(mapPetToProfileModel);
      setRawPets(petList);
      setPets(profileList);
      const storedActivePetId = getStoredActivePetId();
      const nextActivePetId =
        (preferredPetId && profileList.some((item) => item.id === preferredPetId) && preferredPetId) ||
        (activePetId && profileList.some((item) => item.id === activePetId) && activePetId) ||
        (storedActivePetId &&
          profileList.some((item) => item.id === storedActivePetId) &&
          storedActivePetId) ||
        profileList[0]?.id ||
        '';
      setActivePetId(nextActivePetId);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : '宠物数据加载失败';
      setRawPets([]);
      setPets([]);
      setActivePetIdState('');
      clearStoredActivePetId();
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activePetId, preferredPetId, resetPets, setActivePetId]);

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
    resetPets,
  };
};
