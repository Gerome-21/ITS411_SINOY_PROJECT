import { COLOR } from '@/constants/colorPalette';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/createMemory';
import { Album } from '../../types/memory';

interface AlbumSelectorModalProps {
  visible: boolean;
  albums: Album[];
  onSelect: (album: Album | null) => void;
  onClose: () => void;
  onCreateNew: () => void;
}

const AlbumSelectorModal: React.FC<AlbumSelectorModalProps> = ({
  visible,
  albums,
  onSelect,
  onClose,
  onCreateNew,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.albumScroll}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            <TouchableOpacity
              style={styles.albumOption}
              onPress={() => {
                onSelect({ id: 'uncategorized', name: 'Uncategorized' } as Album);
                onClose();
              }}
            >
              <Text>Uncategorized</Text>
            </TouchableOpacity>

            {albums.map((album) => (
              <TouchableOpacity
                key={album.id}
                style={styles.albumOption}
                onPress={() => {
                  onSelect(album);
                  onClose();
                }}
              >
                <Text>{album.name}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.albumOption, { borderBottomWidth: 0 }]}
              onPress={() => {
                onClose();
                onCreateNew();
              }}
            >
              <Text style={{ color: COLOR.primary, fontWeight: 'bold' }}>
                + Create New Album
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AlbumSelectorModal;
