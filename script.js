async function blowOutCandles() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let candles = document.querySelectorAll('.candle');
    let audio = new Audio('hbd.mp3'); // Lagu ulang tahun

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      const avgVolume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

      if (avgVolume > 200) { // Jika suara terdeteksi lebih dari batas tertentu
        // Mematikan lilin secara acak
        candles.forEach(candle => {
          if (!candle.classList.contains('out')) {
            candle.classList.add('out'); // Menambahkan class "out" untuk mematikan api
          }
        });
      }

      // Pastikan semua lilin benar-benar padam
      if (Array.from(candles).every(candle => candle.classList.contains('out'))) {
        analyser.disconnect(); // Hentikan deteksi mikrofon
        setTimeout(function() {

          triggerConfetti(); // Menampilkan confetti setelah jeda kecil
          audio.play(); // Mainkan lagu ulang tahun
          document.getElementById("doneButton").style.display = "block"; // Tampilkan tombol "Done"
        }, 500); // Tambahkan sedikit jeda sebelum confetti muncul
      } else {
        requestAnimationFrame(detectBlow); // Lanjutkan deteksi jika ada lilin yang belum padam
      }
    }

    detectBlow();
  } catch (err) {
    alert('Akses mikrofon diperlukan untuk meniup lilin!');
    console.error(err);
  }
}

// Fungsi untuk memicu confetti sedikit saja
function triggerConfetti() {
  confetti({
    particleCount: 500, // Jumlah confetti yang lebih sedikit
    spread: 70, // Lebar sebaran confetti
    origin: { y: 0.6 } // Titik asal confetti
  });
}

// Jalankan fungsi untuk mendeteksi tiupan lilin
blowOutCandles();
