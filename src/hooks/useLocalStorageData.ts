
import { useState, useEffect } from 'react';

export interface DataMasterItem {
  id: string;
  nama?: string;
  kode?: string;
  alasan?: string;
  created_at: string;
  updated_at: string;
}

// Hardcoded Tipe Faskes data with localStorage persistence
const getTipeFaskesFromStorage = (): DataMasterItem[] => {
  const stored = localStorage.getItem('tipe_faskes_data');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default data
  const defaultData = [
    { id: '1', nama: 'Rumah Sakit', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', nama: 'Klinik', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', nama: 'Puskesmas', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', nama: 'Laboratorium', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '5', nama: 'Apotek', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
  localStorage.setItem('tipe_faskes_data', JSON.stringify(defaultData));
  return defaultData;
};

const saveTipeFaskesToStorage = (data: DataMasterItem[]) => {
  localStorage.setItem('tipe_faskes_data', JSON.stringify(data));
};

// Hardcoded Status Leads data with localStorage persistence
const getStatusLeadsFromStorage = (): DataMasterItem[] => {
  const stored = localStorage.getItem('status_leads_data');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default data
  const defaultData = [
    { id: '1', nama: 'Prospek', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', nama: 'Dihubungi', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '3', nama: 'Leads', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '4', nama: 'Bukan Leads', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '5', nama: 'On Going', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
  localStorage.setItem('status_leads_data', JSON.stringify(defaultData));
  return defaultData;
};

const saveStatusLeadsToStorage = (data: DataMasterItem[]) => {
  localStorage.setItem('status_leads_data', JSON.stringify(data));
};

export function useLocalStorageData() {
  const [tipeFaskesData, setTipeFaskesData] = useState<DataMasterItem[]>([]);
  const [statusLeadsData, setStatusLeadsData] = useState<DataMasterItem[]>([]);

  // CRUD operations for Tipe Faskes (localStorage based)
  const createTipeFaskes = (data: { nama: string }) => {
    const currentData = getTipeFaskesFromStorage();
    const newItem: DataMasterItem = {
      id: Date.now().toString(),
      nama: data.nama,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updatedData = [...currentData, newItem];
    saveTipeFaskesToStorage(updatedData);
    setTipeFaskesData(updatedData);
    return newItem;
  };

  const updateTipeFaskes = (id: string, data: { nama: string }) => {
    const currentData = getTipeFaskesFromStorage();
    const updatedData = currentData.map(item => 
      item.id === id 
        ? { ...item, nama: data.nama, updated_at: new Date().toISOString() }
        : item
    );
    saveTipeFaskesToStorage(updatedData);
    setTipeFaskesData(updatedData);
    return updatedData.find(item => item.id === id);
  };

  const deleteTipeFaskes = (id: string) => {
    const currentData = getTipeFaskesFromStorage();
    const updatedData = currentData.filter(item => item.id !== id);
    saveTipeFaskesToStorage(updatedData);
    setTipeFaskesData(updatedData);
    return true;
  };

  // CRUD operations for Status Leads (localStorage based)
  const createStatusLeads = (data: { nama: string }) => {
    const currentData = getStatusLeadsFromStorage();
    const newItem: DataMasterItem = {
      id: Date.now().toString(),
      nama: data.nama,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updatedData = [...currentData, newItem];
    saveStatusLeadsToStorage(updatedData);
    setStatusLeadsData(updatedData);
    return newItem;
  };

  const updateStatusLeads = (id: string, data: { nama: string }) => {
    const currentData = getStatusLeadsFromStorage();
    const updatedData = currentData.map(item => 
      item.id === id 
        ? { ...item, nama: data.nama, updated_at: new Date().toISOString() }
        : item
    );
    saveStatusLeadsToStorage(updatedData);
    setStatusLeadsData(updatedData);
    return updatedData.find(item => item.id === id);
  };

  const deleteStatusLeads = (id: string) => {
    const currentData = getStatusLeadsFromStorage();
    const updatedData = currentData.filter(item => item.id !== id);
    saveStatusLeadsToStorage(updatedData);
    setStatusLeadsData(updatedData);
    return true;
  };

  useEffect(() => {
    // Load data from localStorage on component mount
    setTipeFaskesData(getTipeFaskesFromStorage());
    setStatusLeadsData(getStatusLeadsFromStorage());
  }, []);

  return {
    tipeFaskesData,
    statusLeadsData,
    createTipeFaskes,
    updateTipeFaskes,
    deleteTipeFaskes,
    createStatusLeads,
    updateStatusLeads,
    deleteStatusLeads,
    refetchData: () => {
      setTipeFaskesData(getTipeFaskesFromStorage());
      setStatusLeadsData(getStatusLeadsFromStorage());
    }
  };
}
