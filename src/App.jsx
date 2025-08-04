import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  User,
  Calendar,
  MapPin,
  Stethoscope,
  CheckCircle,
} from "lucide-react";

const EWSClickForm = () => {
  // State untuk data pasien
  const [patientData, setPatientData] = useState({
    name: "",
    medicalRecord: "",
    date: new Date().toISOString().split("T")[0],
    ward: "",
  });

  // State untuk vital signs per jam
  const [vitalSigns, setVitalSigns] = useState({});

  // State untuk jam yang dipilih
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());

  // Jam-jam dalam sehari
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Parameter EWS dengan pilihan dan skor
  const ewsParameters = {
    respiratoryRate: {
      name: "Frekuensi Napas (RR)",
      icon: "",
      options: [
        { label: "≤ 8 /menit", value: "≤8", score: 3, color: "bg-red-500" },
        {
          label: "9-11 /menit",
          value: "9-11",
          score: 1,
          color: "bg-yellow-500",
        },
        {
          label: "12-20 /menit (Normal)",
          value: "12-20",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "21-24 /menit",
          value: "21-24",
          score: 2,
          color: "bg-orange-500",
        },
        { label: "≥ 25 /menit", value: "≥25", score: 3, color: "bg-red-500" },
      ],
    },
    spo2: {
      name: "SpO2",
      icon: "",
      options: [
        { label: "< 91%", value: "<91", score: 3, color: "bg-red-500" },
        { label: "92-93%", value: "92-93", score: 2, color: "bg-orange-500" },
        { label: "94-95%", value: "94-95", score: 1, color: "bg-yellow-500" },
        {
          label: "> 96% (Normal)",
          value: ">96",
          score: 0,
          color: "bg-green-500",
        },
      ],
    },
    oxygenSupport: {
      name: "Alat Bantu Napas",
      icon: "",
      options: [
        { label: "Tidak", value: "tidak", score: 0, color: "bg-green-500" },
        { label: "Ya", value: "Ya", score: 2, color: "bg-orange-500" },
      ],
    },
    systolicBP: {
      name: "Tekanan Darah Sistolik",
      icon: "",
      options: [
        { label: "< 40 mmHg", value: "< 40", score: 3, color: "bg-red-500" },
        {
          label: "41-50 mmHg",
          value: "41-50",
          score: 1,
          color: "bg-yellow-500",
        },
        {
          label: "51-60 mmHg",
          value: "51-60",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "61-70 mmHg",
          value: "61-70",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "71-80 mmHg",
          value: "71-80",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "81-90 mmHg",
          value: "81-90",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "91-100 mmHg",
          value: "91-100",
          score: 1,
          color: "bg-yellow-500",
        },
        {
          label: "101-110 mmHg",
          value: "101-110",
          score: 1,
          color: "bg-yellow-500",
        },
        {
          label: "111-120 mmHg",
          value: "111-120",
          score: 2,
          color: "bg-orange-500",
        },
        {
          label: "121-130 mmHg",
          value: "121-130",
          score: 2,
          color: "bg-orange-500",
        },
        { label: "> 130 mmHg", value: ">130", score: 3, color: "bg-red-500" },
      ],
    },
    heartRate: {
      name: "Denyut Jantung (HR)",
      icon: "",
      options: [
        { label: "< 40 /menit", value: "<40", score: 3, color: "bg-red-500" },
        {
          label: "41-50 /menit",
          value: "41-50",
          score: 1,
          color: "bg-yellow-500",
        },
        {
          label: "51-90 /menit (Normal)",
          value: "51-90",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "91-110 /menit",
          value: "91-110",
          score: 1,
          color: "bg-yellow-500",
        },
        {
          label: "111-130 /menit",
          value: "111-130",
          score: 2,
          color: "bg-orange-500",
        },
        { label: "> 130 /menit", value: ">130", score: 3, color: "bg-red-500" },
      ],
    },
    temperature: {
      name: "Suhu Tubuh",
      icon: "",
      options: [
        { label: "≤ 35°C", value: "≤35", score: 3, color: "bg-red-500" },
        {
          label: "36-37°C (Normal)",
          value: "36-37",
          score: 0,
          color: "bg-green-500",
        },
        { label: "38°C", value: "38", score: 1, color: "bg-yellow-500" },
        { label: "≥ 39°C", value: "≥39", score: 2, color: "bg-orange-500" },
      ],
    },
    consciousness: {
      name: "Tingkat Kesadaran",
      icon: "",
      options: [
        {
          label: "Alert (Normal)",
          value: "Normal",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "V/P/U (Gangguan)",
          value: "Gangguan",
          score: 3,
          color: "bg-red-500",
        },
      ],
    },
  };

  const morseScaleParameters = {
    riwayatJatuh: {
      name: "Riwayat Jatuh",
      icon: "",
      options: [
        { label: "Tidak", value: "Tidak", score: 0, color: "bg-green-500" },
        { label: "Ya", value: "Ya", score: 25, color: "bg-orange-500" },
      ],
    },
    diagnosisSekunder: {
      name: "Diagnosis Sekunder",
      icon: "",
      options: [
        { label: "Tidak", value: "Tidak", score: 0, color: "bg-green-500" },
        { label: "Ya", value: "Ya", score: 15, color: "bg-orange-500" },
      ],
    },
    alatBantuAmbulatori: {
      name: "Alat Bantu Ambulatori",
      icon: "",
      options: [
        {
          label: "Bedrest/Dibantu Perawat",
          value: "Bedrest / Dibantu Perawat",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "Kruk/Tongkat/Walker",
          value: "Kruk / Tongkat / Walker",
          score: 15,
          color: "bg-yellow-500",
        },
        {
          label: "Furniture",
          value: "Furniture",
          score: 30,
          color: "bg-orange-500",
        },
      ],
    },
    terapiInfus: {
      name: "Terapi IV/Infus",
      icon: "",
      options: [
        { label: "Tidak", value: "Tidak", score: 0, color: "bg-green-500" },
        { label: "Ya", value: "Ya", score: 20, color: "bg-yellow-500" },
      ],
    },
    caraBerjalan: {
      name: "Cara Berjalan",
      icon: "",
      options: [
        {
          label: "Normal/Bedrest/Kursi Roda",
          value: "Normal / Bedrest / Kursi Roda",
          score: 0,
          color: "bg-green-500",
        },
        { label: "Lemah", value: "Lemah", score: 10, color: "bg-yellow-500" },
        {
          label: "Terganggu",
          value: "Terganggu",
          score: 20,
          color: "bg-orange-500",
        },
      ],
    },
    statusMental: {
      name: "Status Mental",
      icon: "",
      options: [
        {
          label: "Orientasi Baik",
          value: "normal",
          score: 0,
          color: "bg-green-500",
        },
        {
          label: "Lupa Keterbatasan",
          value: "disordered",
          score: 15,
          color: "bg-orange-500",
        },
      ],
    },
  };

  // Menghitung total skor EWS
  const calculateTotalScore = (vitals) => {
    let totalScore = 0;
    Object.keys(ewsParameters).forEach((param) => {
      if (vitals[param]) {
        const option = ewsParameters[param].options.find(
          (opt) => opt.value === vitals[param]
        );
        if (option) totalScore += option.score;
      }
    });
    return totalScore;
  };

  // Fungsi untuk menghitung skor EWS
  const calculateEWSScore = (vitals) => {
    let score = 0;

    // Respiratory Rate (RR)
    const rr = parseInt(vitals.respiratoryRate || 14);
    if (rr >= 25) score += 3;
    else if (rr >= 21) score += 2;
    else if (rr >= 12) score += 0;
    else if (rr >= 9) score += 1;
    else if (rr <= 8) score += 3;

    // SpO2
    const spo2 = parseInt(vitals.spo2 || 100);
    if (spo2 > 96) score += 0;
    else if (spo2 >= 94) score += 1;
    else if (spo2 >= 92) score += 2;
    else score += 3;

    // Alat bantu napas
    const oxygenSupport = vitals.oxygenSupport || "no";
    if (oxygenSupport === "yes") score += 2;

    // Tekanan Darah Sistolik
    const systolic = parseInt(vitals.systolicBP || 80);
    if (systolic > 130) score += 3;
    else if (systolic >= 121 && systolic <= 130) score += 2;
    else if (systolic >= 111 && systolic <= 120) score += 1;
    else if (systolic >= 101 && systolic <= 110) score += 1;
    else if (systolic >= 91 && systolic <= 100) score += 1;
    else if (systolic >= 51 && systolic <= 90) score += 0;
    else if (systolic >= 41 && systolic <= 50) score += 1;
    else if (systolic <= 40) score += 3;

    // Heart Rate
    const hr = parseInt(vitals.heartRate || 80);
    if (hr > 130) score += 3;
    else if (hr >= 121) score += 2;
    else if (hr >= 111) score += 2;
    else if (hr >= 101) score += 1;
    else if (hr >= 91) score += 1;
    else if (hr >= 41) score += 0;
    else score += 3;

    // Temperature
    const temp = parseFloat(vitals.temperature || 37);
    if (temp >= 39) score += 2;
    else if (temp >= 38) score += 1;
    else if (temp >= 36) score += 0;
    else score += 3;

    // Level of Consciousness
    const consciousness = vitals.consciousness || "alert";
    if (consciousness === "vpu") score += 3;

    return score;
  };

  const calculateMorseScore = (morseVitals) => {
    let totalScore = 0;
    Object.keys(morseScaleParameters).forEach((param) => {
      if (morseVitals[param]) {
        const option = morseScaleParameters[param].options.find(
          (opt) => opt.value === morseVitals[param]
        );
        if (option) totalScore += option.score;
      }
    });
    return totalScore;
  };

  // Menentukan kategori risiko
  const getRiskCategory = (score) => {
    if (score >= 7)
      return {
        category: "TINGGI",
        color: "bg-red-500",
        textColor: "text-red-700",
        bgLight: "bg-red-100",
      };
    else if (score >= 4)
      return {
        category: "SEDANG",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgLight: "bg-yellow-100",
      };
    else if (score >= 2)
      return {
        category: "RENDAH",
        color: "bg-green-400",
        textColor: "text-green-700",
        bgLight: "bg-green-100",
      };
    else
      return {
        category: "NORMAL",
        color: "bg-green-500",
        textColor: "text-green-700",
        bgLight: "bg-green-100",
      };
  };

  const getScaleRiskCategory = (score) => {
    if (score <= 24)
      return {
        category: "RENDAH",
        color: "bg-green-500",
        textColor: "text-green-700",
        bgLight: "bg-green-100",
      };
    else if (score > 24 && score <= 44)
      return {
        category: "SEDANG",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgLight: "bg-yellow-100",
      };
    else if (score >= 45)
      return {
        category: "TINGGI",
        color: "bg-red-400",
        textColor: "text-red-700",
        bgLight: "bg-red-100",
      };
  };

  // Menentukan jadwal pemantauan
  const getMonitoringSchedule = (category) => {
    switch (category) {
      case "TINGGI":
        return {
          interval: "Setiap jam",
          hours: hours,
          description: "Pemantauan intensif setiap jam",
          action: "Lapor ke dokter jaga/DPJP segera!",
        };
      case "SEDANG":
        return {
          interval: "Setiap jam",
          hours: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23,
          ],
          description: "Lapor ke dokter jaga, observasi setiap jam",
          action: "Lapor ke dokter jaga",
        };
      case "RENDAH":
        return {
          interval: "Setiap 4 jam",
          hours: [6, 10, 14, 18, 22],
          description: "Observasi dan dokumentasi setiap 4 jam",
          action: "Observasi ketat",
        };
      default:
        return {
          interval: "Setiap 8 jam",
          hours: [6, 14, 22],
          description: "Observasi rutin setiap 8 jam",
          action: "Observasi rutin",
        };
    }
  };

  // Update pilihan untuk parameter tertentu
  const updateParameter = (hour, parameter, optionValue) => {
    setVitalSigns((prev) => ({
      ...prev,
      [hour]: {
        ...prev[hour],
        [parameter]: optionValue,
      },
    }));
  };

  const updateVitalSigns = (hour, field, value) => {
    setVitalSigns((prev) => ({
      ...prev,
      [hour]: {
        ...prev[hour],
        [field]: value,
      },
    }));
  };

  const painOptions = [
    {
      emoji: "😄",
      label: "Tidak nyeri",
      value: "Tidak Nyeri",
      color: "bg-green-500",
    },
    {
      emoji: "🙂",
      label: "Nyeri ringan",
      value: "Nyeri ringan",
      color: "bg-emerald-500",
    },
    {
      emoji: "😐",
      label: "Nyeri sedang",
      value: "Nyeri Sedang",
      color: "bg-yellow-500",
    },
    {
      emoji: "😟",
      label: "Nyeri agak berat",
      value: "Nyeri Agak Berat",
      color: "bg-orange-500",
    },
    {
      emoji: "😣",
      label: "Nyeri berat",
      value: "Nyeri Berat",
      color: "bg-pink-500",
    },
    {
      emoji: "😭",
      label: "Nyeri sangat berat",
      value: "Nyeri Sangat Berat",
      color: "bg-red-500",
    },
  ];

  const handleSubmit = async () => {
    const selectedVitals = vitalSigns[selectedHour] || {}; // ambil hanya data jam yang dipilih
    const ewsScore = calculateEWSScore(selectedVitals);
    const morseScore = calculateMorseScore(selectedVitals);

    const allData = {
      ...patientData,
      ...selectedVitals,
      ewsScore: ewsScore,
      morseScore: morseScore,
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyKMvBYvHehzUZQQM7ID8QapUDLqWcEgPDpLFlDtW0qgkPe8m9dpW_eKQUiNzueiyVR/exec",
        {
          method: "POST",
          mode: "no-cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allData),
        }
      );

      alert("Data berhasil dikirim!");
    } catch (error) {
      console.error("Gagal mengirim:", error);
      alert("Gagal mengirim data");
    }
  };

  // Mendapatkan skor untuk jam tertentu
  const getHourScore = (hour) => {
    const vitals = vitalSigns[hour];
    return vitals ? calculateEWSScore(vitals) : 0;
  };

  const currentVitals = vitalSigns[selectedHour] || {};
  const currentScore = getHourScore(selectedHour);
  const riskInfo = getRiskCategory(currentScore);
  const schedule = getMonitoringSchedule(riskInfo.category);

  const morseScore = calculateMorseScore(currentVitals);
  const morseInfo = getScaleRiskCategory(calculateMorseScore(currentVitals));
  const morseCategory = morseInfo.category;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Stethoscope className="mr-3" />
          Early Warning System
        </h1>
      </div>

      {/* Data Pasien */}
      <div className="bg-white p-6 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <User className="mr-2" />
          Data Pasien
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Pasien
            </label>
            <input
              type="text"
              value={patientData.name}
              onChange={(e) =>
                setPatientData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama pasien"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">No. RM</label>
            <input
              type="text"
              value={patientData.medicalRecord}
              onChange={(e) =>
                setPatientData((prev) => ({
                  ...prev,
                  medicalRecord: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nomor rekam medis"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input
              type="date"
              value={patientData.date}
              onChange={(e) =>
                setPatientData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Kamar Rawat
            </label>
            <input
              type="text"
              value={patientData.ward}
              onChange={(e) =>
                setPatientData((prev) => ({ ...prev, ward: e.target.value }))
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nama kamar rawat"
            />
          </div>
        </div>
      </div>

      {/* Form Klik Parameter */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Input Vital Signs - Jam {selectedHour.toString().padStart(2, "0")}:00
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Respiratory Rate */}
          <div className="space-y-2">
            <label className="block text-sm font-medium flex items-center">
              Frekuensi Napas (RR)
            </label>
            <input
              type="number"
              value={currentVitals.respiratoryRate || ""}
              onChange={(e) =>
                updateVitalSigns(
                  selectedHour,
                  "respiratoryRate",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded-md"
              placeholder="x/menit"
            />
            <div className="text-xs text-gray-500">Normal: 12-20/menit</div>
          </div>

          {/* SpO2 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium flex items-center">
              SpO2 (%)
            </label>
            <input
              type="number"
              value={currentVitals.spo2 || ""}
              onChange={(e) =>
                updateVitalSigns(selectedHour, "spo2", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="%"
              min="0"
              max="100"
            />
            <div className="text-xs text-gray-500">Normal: {">"} 96%</div>
          </div>

          {/* Alat Bantu Napas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Alat Bantu Napas
            </label>
            <select
              value={currentVitals.oxygenSupport || "no"}
              onChange={(e) =>
                updateVitalSigns(selectedHour, "oxygenSupport", e.target.value)
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="no">Tidak</option>
              <option value="yes">Ya</option>
            </select>
          </div>

          {/* Tekanan Darah */}
          <div className="space-y-2">
            <label className="block text-sm font-medium flex items-center">
              Tekanan Darah Sistolik
            </label>
            <input
              type="number"
              value={currentVitals.systolicBP || ""}
              onChange={(e) =>
                updateVitalSigns(selectedHour, "systolicBP", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="mmHg"
            />
            <div className="text-xs text-gray-500">Normal: 90-140 mmHg</div>
          </div>

          {/* Heart Rate */}
          <div className="space-y-2">
            <label className="block text-sm font-medium flex items-center">
              Denyut Jantung (HR)
            </label>
            <input
              type="number"
              value={currentVitals.heartRate || ""}
              onChange={(e) =>
                updateVitalSigns(selectedHour, "heartRate", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="x/menit"
            />
            <div className="text-xs text-gray-500">Normal: 60-100/menit</div>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <label className="block text-sm font-medium flex items-center">
              Suhu (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={currentVitals.temperature || ""}
              onChange={(e) =>
                updateVitalSigns(selectedHour, "temperature", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="°C"
            />
            <div className="text-xs text-gray-500">Normal: 36-37°C</div>
          </div>

          {/* Level of Consciousness */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tingkat Kesadaran
            </label>
            <select
              value={currentVitals.consciousness || "alert"}
              onChange={(e) =>
                updateVitalSigns(selectedHour, "consciousness", e.target.value)
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="alert">Alert</option>
              <option value="vpu">V/P/U</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Pemilihan Jam */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3 flex items-center">
            <Clock className="mr-2" />
            Pilih Jam
          </h3>
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(parseInt(e.target.value))}
            className="w-full p-3 border rounded-lg text-lg font-bold focus:ring-2 focus:ring-blue-500"
          >
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour.toString().padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>

        {/* Status EWS */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Status EWS</h3>
          <div
            className={`${riskInfo.color} text-white p-4 rounded-lg text-center shadow-lg`}
          >
            <div className="text-3xl font-bold">{currentScore}</div>
            <div className="text-lg font-semibold">{riskInfo.category}</div>
          </div>
        </div>

        {/* Tindakan */}
        <div
          className={`${
            riskInfo.bgLight
          } p-4 rounded-lg shadow border-l-4 ${riskInfo.color.replace(
            "bg-",
            "border-"
          )}`}
        >
          <h3 className="font-semibold mb-2 flex items-center">
            <AlertTriangle className="mr-2" />
            Tindakan
          </h3>
          <div className="text-sm">
            <div className="font-medium">{schedule.action}</div>
            <div className="mt-2">{schedule.description}</div>
          </div>
        </div>
      </div>

      {/* Morse Scale*/}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-6">
          Pilih Parameter Morse Scale
        </h3>

        <div className="space-y-6">
          {Object.entries(morseScaleParameters).map(([paramKey, param]) => (
            <div key={paramKey} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center text-lg">
                <span className="mr-2 text-2xl">{param.icon}</span>
                {param.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {param.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      updateParameter(selectedHour, paramKey, option.value)
                    }
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left relative ${
                      currentVitals[paramKey] === option.value
                        ? `${option.color} text-white border-gray-700 shadow-lg transform scale-105`
                        : `bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300`
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">
                          {option.label}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            currentVitals[paramKey] === option.value
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        >
                          Skor: {option.score}
                        </div>
                      </div>
                      {currentVitals[paramKey] === option.value && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Status EWS */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Status Morse</h3>
          <div
            className={`${morseInfo.color} text-white p-4 rounded-lg text-center shadow-lg`}
          >
            <div className="text-3xl font-bold">{morseScore}</div>
            <div className="text-lg font-semibold">{morseCategory}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">Skala Nyeri (0-10)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {painOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                  updateVitalSigns(selectedHour, "skalaNyeri", option.value)
                }
              className={`flex flex-col items-center justify-center p-2 border rounded-lg transition ${
                currentVitals.skalaNyeri === option.value
                  ? `${option.color} text-white border-gray-700 shadow-lg transform scale-105`
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-xs mt-1">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ringkasan Harian */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Ringkasan 24 Jam</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left font-semibold">Jam</th>
                <th className="p-3 text-center font-semibold">RR</th>
                <th className="p-3 text-center font-semibold">SpO2</th>
                <th className="p-3 text-center font-semibold">O2</th>
                <th className="p-3 text-center font-semibold">TD</th>
                <th className="p-3 text-center font-semibold">HR</th>
                <th className="p-3 text-center font-semibold">Suhu</th>
                <th className="p-3 text-center font-semibold">GCS</th>
                <th className="p-3 text-center font-semibold">Total</th>
                <th className="p-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => {
                const vitals = vitalSigns[hour];
                const score = getHourScore(hour);
                const risk = getRiskCategory(score);
                const isRequired = schedule.hours.includes(hour);

                return (
                  <tr
                    key={hour}
                    className={`border-t hover:bg-gray-50 ${
                      isRequired ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {hour.toString().padStart(2, "0")}:00
                      {isRequired && (
                        <span className="ml-1 text-blue-600 font-bold">●</span>
                      )}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {vitals?.respiratoryRate || "-"}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {vitals?.spo2 || "-"}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {vitals?.oxygenSupport === "yes"
                        ? "Ya"
                        : vitals?.oxygenSupport === "no"
                        ? "Tidak"
                        : "-"}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {vitals?.systolicBP || "-"}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {vitals?.heartRate || "-"}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {vitals?.temperature || "-"}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {vitals?.consciousness === "alert"
                        ? "Alert"
                        : vitals?.consciousness === "vpu"
                        ? "V/P/U"
                        : "-"}
                    </td>
                    <td className="p-3 text-center font-bold text-lg">
                      {score || "-"}
                    </td>
                    <td className="p-3 text-center">
                      {score > 0 && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold text-white ${risk.color}`}
                        >
                          {risk.category}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <span className="text-blue-600 font-bold">●</span> = Jam wajib
            pemantauan
          </p>
        </div>

        <div className="align-items-center justify-center flex">
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kirim Data
          </button>
        </div>
      </div>

      {/* Petunjuk Penggunaan */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          💡 Petunjuk Penggunaan:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Pilih jam pemantauan di bagian atas</li>
          <li>
            • Klik tombol yang sesuai dengan kondisi pasien untuk setiap
            parameter
          </li>
          <li>• Skor akan dihitung otomatis dan status risiko akan muncul</li>
          <li>
            • Sistem akan memberikan panduan tindakan yang harus dilakukan
          </li>
          <li>
            • Jam-jam wajib pemantauan akan ditandai dengan titik biru (●)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EWSClickForm;
