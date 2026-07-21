import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Firebase Firestore & Storage Imports
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../config/firebase";

// Expo Image Picker Import
import * as ImagePicker from "expo-image-picker";

export default function TambahObat() {
  // 1. State Form Input (Sesuaikan nama state ini dengan kode lamamu jika berbeda)
  const [kodeObat, setKodeObat] = useState("");
  const [namaObat, setNamaObat] = useState("");
  const [jenisObat, setJenisObat] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // 2. State Khusus Image Picker & Loading Upload
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk membuka Galeri dan memilih gambar
  async function pilihGambar() {
    try {
      // Meminta izin akses galeri HP terlebih dahulu
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi memerlukan izin galeri untuk memilih gambar.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Mengunci rasio gambar kotak (square)
        quality: 0.5, // Mengkompres gambar agar ukuran file kecil/ringan saat diupload
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // Simpan lokasi gambar sementara ke state
      }
    } catch (error) {
      console.log("Gagal memilih gambar:", error);
      Alert.alert("Error", "Gagal membuka galeri.");
    }
  }

  // Fungsi Simpan Data (Menghandle upload ke Storage baru kemudian menyimpan ke Firestore)
  async function simpanDataObat() {
    // Validasi dasar agar form tidak kosong (bisa disesuaikan dengan kebutuhanmu)
    if (!kodeObat || !namaObat || !stok || !harga) {
      Alert.alert("Peringatan", "Mohon isi semua field data utama obat.");
      return;
    }

    setLoading(true); // Aktifkan indikator loading (tombol berubah jadi spinner)

    try {
      let downloadUrl = ""; // Default kosong jika user memilih untuk tidak menyertakan gambar

      // PROSES 1: JIKA USER MEMILIH GAMBAR, UPLOAD KE FIREBASE STORAGE TERLEBIH DAHULU
      if (imageUri) {
        // Konversi file URI lokal HP menjadi tipe data Blob yang dibutuhkan Firebase
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storage = getStorage();
        // Membuat nama file yang unik berdasarkan timestamp di folder 'gambar_obat'
        const storageRef = ref(storage, `gambar_obat/obat_${Date.now()}`);

        // Eksekusi upload file mentah (blob) ke Firebase Storage
        await uploadBytes(storageRef, blob);

        // Ambil URL publik gambar yang berhasil diupload tadi
        downloadUrl = await getDownloadURL(storageRef);
      }

      // PROSES 2: SIMPAN SELURUH DATA TEKS BESERTA URL GAMBAR KE FIRESTORE
      await addDoc(collection(db, "tbobat"), {
        kode_obat: kodeObat,
        nama_obat: namaObat,
        jenis_obat: jenisObat,
        stok: Number(stok) || 0,
        harga: Number(harga) || 0,
        keterangan: keterangan,
        gambar_url: downloadUrl, // Memasukkan link URL yang didapatkan dari Storage
      });

      Alert.alert("Sukses", "Data obat berhasil disimpan!");
      router.back(); // Kembali ke halaman sebelumnya (misalnya halaman Laporan)
    } catch (error) {
      console.log("Gagal menyimpan data obat:", error);
      Alert.alert("Error", "Gagal menyimpan data ke database.");
    } finally {
      setLoading(false); // Matikan loading jika proses selesai/gagal
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Input fields lama kamu (tetap dipertahankan dimensinya) */}
        <Text style={styles.label}>Kode Obat</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Kode"
          placeholderTextColor="#64748b"
          value={kodeObat}
          onChangeText={setKodeObat}
        />

        <Text style={styles.label}>Nama Obat</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Nama"
          placeholderTextColor="#64748b"
          value={namaObat}
          onChangeText={setNamaObat}
        />

        <Text style={styles.label}>
          Jenis Obat, contoh: Tablet / Sirup / Kapsul
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Jenis"
          placeholderTextColor="#64748b"
          value={jenisObat}
          onChangeText={setJenisObat}
        />

        <Text style={styles.label}>Stok</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Stok"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={stok}
          onChangeText={setStok}
        />

        <Text style={styles.label}>Harga</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Harga"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={harga}
          onChangeText={setHarga}
        />

        <Text style={styles.label}>Keterangan</Text>
        <TextInput
          style={[styles.input, styles.inputArea]}
          placeholder="Masukkan Keterangan"
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={4}
          value={keterangan}
          onChangeText={setKeterangan}
        />

        {/* --- DI SINI BAGIAN COMPONENT URL YANG DIUBAH MENJADI UPLOAD GAMBAR --- */}
        <Text style={styles.label}>Gambar Obat</Text>
        <View style={styles.imageUploadContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Belum Ada Gambar</Text>
            </View>
          )}

          <TouchableOpacity style={styles.btnPilihGambar} onPress={pilihGambar}>
            <Text style={styles.btnPilihGambarText}>
              Pilih Gambar dari Galeri
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Simpan dengan deteksi loading */}
        <TouchableOpacity
          style={styles.btnSimpan}
          onPress={simpanDataObat}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.btnSimpanText}>Simpan Data Obat</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Dark mode sesuai screenshot aplikasimu
    padding: 20,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    padding: 14,
    color: "#ffffff",
    fontSize: 15,
  },
  inputArea: {
    height: 100,
    textAlignVertical: "top",
  },

  // STYLING BARU UNTUK BAGIAN UPLOAD GAMBAR
  imageUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 20,
    gap: 15,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#475569",
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#334155",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#64748b",
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  btnPilihGambar: {
    backgroundColor: "#3b82f6", // Warna Biru Elegan
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  btnPilihGambarText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  btnSimpan: {
    backgroundColor: "#16a34a", // Warna Hijau persis seperti di gambar kamu
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnSimpanText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
