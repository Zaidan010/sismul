const gallery = document.getElementById("gallery");

// ambil data dari DATABASE
const dataGambar = DATABASE["warna.html"];

// looping data
dataGambar.forEach((item) => {

  // buat card
  const card = document.createElement("div");

  card.className =
    "bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden";

  // isi card
  card.innerHTML = `
    <img 
      src="${item.img}" 
      alt="${item.title}"
      class="w-full h-64 object-cover"
    >

    <div class="p-4">
      <h2 class="text-xl font-semibold mb-3">
        ${item.title}
      </h2>

      <a 
        href="warna.html?img=${encodeURIComponent(item.img)}"
        class="inline-block bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
      >
        Mulai Mewarnai
      </a>
    </div>
  `;

  // masukkan card ke gallery
  gallery.appendChild(card);
});


// =========================
// HEADER IMAGE UPLOAD
// =========================

document.getElementById("headerUpload")
  .addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // validasi format
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml"
    ];

    if (!allowedTypes.includes(file.type)) {

      alert("Format gambar harus PNG, JPG, atau SVG.");

      return;
    }

    // maksimal 5MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

      alert("Ukuran gambar maksimal 5 MB.");

      return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

      // simpan ke localStorage
      localStorage.setItem(
        "uploadedImage",
        event.target.result
      );

      // pindah halaman
      window.location.href = "warna.html";
    };

    reader.readAsDataURL(file);
});