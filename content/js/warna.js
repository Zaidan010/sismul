const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const colorContainer = document.getElementById("colors");
  const brushSize = document.getElementById("brushSize");

  let currentColor = "#000000";
  let drawing = false;

  // MODE
  let currentTool = "brush";

  const history = [];
  let historyStep = -1;

  // =========================
  // COLORS
  // =========================
  const colors = [
  // Merah
  "#ffcdd2", "#ef9a9a", "#e57373", "#ef5350",
  "#f44336", "#e53935", "#d32f2f", "#c62828",
  "#b71c1c", "#7f0000", "#ff5252", "#ff1744",

  // Merah Tua & Maroon
  "#ff8a80", "#ff6d00", "#bf360c", "#8b0000",

  // Oranye
  "#ffe0b2", "#ffcc80", "#ffb74d", "#ffa726",
  "#ff9800", "#fb8c00", "#f57c00", "#ef6c00",
  "#e65100", "#ff6d00", "#ff9100", "#ffab40",

  // Kuning
  "#fff9c4", "#fff59d", "#fff176", "#ffee58",
  "#ffeb3b", "#fdd835", "#f9a825", "#f57f17",
  "#ffd600", "#ffea00", "#ffe082", "#ffd740",

  // Gold & Mustard
  "#ffd700", "#ffca28", "#ffb300", "#ff8f00",
  "#e6ac00", "#c79100", "#a37800", "#7a5900",

  // Lime & Hijau Neon
  "#f9fbe7", "#f0f4c3", "#e6ee9c", "#dce775",
  "#d4e157", "#cddc39", "#c6ff00", "#aeea00",
  "#76ff03", "#64dd17", "#ccff90", "#b2ff59",

  // Hijau
  "#e8f5e9", "#c8e6c9", "#a5d6a7", "#81c784",
  "#66bb6a", "#4caf50", "#43a047", "#388e3c",
  "#2e7d32", "#1b5e20", "#8bc34a", "#558b2f",

  // Hijau Neon & Mint
  "#00e676", "#69f0ae", "#b9f6ca", "#00c853",

  // Teal & Mint
  "#e0f2f1", "#b2dfdb", "#80cbc4", "#4db6ac",
  "#26a69a", "#009688", "#00897b", "#00796b",
  "#00695c", "#004d40", "#1de9b6", "#64ffda",

  // Cyan
  "#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1",
  "#26c6da", "#00bcd4", "#00acc1", "#0097a7",
  "#00838f", "#006064", "#18ffff", "#84ffff",

  // Biru Muda
  "#e1f5fe", "#b3e5fc", "#81d4fa", "#4fc3f7",
  "#29b6f6", "#03a9f4", "#039be5", "#0288d1",
  "#0277bd", "#01579b", "#40c4ff", "#80d8ff",

  // Biru
  "#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6",
  "#42a5f5", "#2196f3", "#1e88e5", "#1976d2",
  "#1565c0", "#0d47a1", "#82b1ff", "#448aff",

  // Biru Tua & Navy
  "#002171", "#1a237e", "#283593", "#3949ab",
  "#5c6bc0", "#9fa8da", "#c5cae9", "#0000cd",

  // Indigo
  "#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb",
  "#5c6bc0", "#3f51b5", "#3949ab", "#303f9f",
  "#283593", "#1a237e", "#536dfe", "#3d5afe",

  // Ungu
  "#f3e5f5", "#e1bee7", "#ce93d8", "#ba68c8",
  "#ab47bc", "#9c27b0", "#8e24aa", "#7b1fa2",
  "#6a1b9a", "#4a148c", "#ea80fc", "#e040fb",

  // Violet
  "#ede7f6", "#d1c4e9", "#b39ddb", "#9575cd",
  "#7e57c2", "#673ab7", "#5e35b1", "#512da8",
  "#4527a0", "#311b92", "#7c4dff", "#651fff",

  // Pink & Magenta
  "#fce4ec", "#f8bbd0", "#f48fb1", "#f06292",
  "#ec407a", "#e91e63", "#d81b60", "#c2185b",
  "#ad1457", "#880e4f", "#ff4081", "#f50057",

  // Pink Pastel
  "#ffd6e0", "#ffb3c6", "#ff85a1", "#ff4d77",
  "#ffc0cb", "#ffb6c1", "#ff69b4", "#ff1493",

  // Coklat & Skin
  "#efebe9", "#d7ccc8", "#bcaaa4", "#a1887f",
  "#8d6e63", "#795548", "#6d4c41", "#5d4037",
  "#4e342e", "#3e2723", "#cd853f", "#deb887",

  // Skin & Peach
  "#fff3e0", "#ffe0b2", "#ffccbc", "#ffab91",
  "#ff8a65", "#ff7043", "#f4511e", "#d4826a",
  "#c4a882", "#a67c52", "#7a5230", "#d2b48c",

  // Abu-abu
  "#fafafa", "#f5f5f5", "#eeeeee", "#e0e0e0",
  "#bdbdbd", "#9e9e9e", "#757575", "#616161",
  "#424242", "#212121", "#607d8b", "#546e7a",

  // Biru Abu & Slate
  "#eceff1", "#cfd8dc", "#b0bec5", "#90a4ae",
  "#78909c", "#607d8b", "#546e7a", "#455a64",
  "#37474f", "#263238", "#000000", "#ffffff",
];

  // Generate Color Buttons
  colors.forEach((color, index) => {

    const btn = document.createElement("div");

    btn.className = "color-btn";
    btn.style.background = color;

    if(index === 0){
      btn.classList.add("active-color");
    }

    btn.addEventListener("click", () => {

      currentColor = color;

      document.querySelectorAll(".color-btn").forEach(el => {
        el.classList.remove("active-color");
      });

      btn.classList.add("active-color");
    });

    colorContainer.appendChild(btn);
  });

  // =========================
  // TOOL BUTTONS
  // =========================
  const toolWrapper = document.createElement("div");

  toolWrapper.className = "flex gap-2 mb-5";

  toolWrapper.innerHTML = `
    <button id="brushTool"
      class=" flex items-center gap-2 bg-blue-400 text-white px-3 py-2 rounded-lg mt-3">
       <img src="../content/images/icons/brush.png" alt="" class="w-6 h-6">
       Brush
    </button>

    <button id="fillTool"
      class="flex items-center gap-2 bg-green-400 text-white px-3 py-2 rounded-lg mt-3">
      <img src="../content/images/icons/fill.png" alt="" class="w-6 h-6">
      Fill
    </button>
  `;

  colorContainer.parentElement.appendChild(toolWrapper);

  document.getElementById("brushTool")
    .addEventListener("click", () => {
      currentTool = "brush";
    });

  document.getElementById("fillTool")
    .addEventListener("click", () => {
      currentTool = "fill";
    });

  
    // =========================
    // LOAD IMAGE
    // =========================

    // ambil parameter URL
    const params = new URLSearchParams(
    window.location.search
    );

    // ambil gambar dari URL
    const selectedImage = params.get("img");

    // ambil gambar upload dari localStorage
    const uploadedImage =
    localStorage.getItem("uploadedImage");

    // buat image object
    const img = new Image();

    img.crossOrigin = "anonymous";

    // =========================
    // PRIORITAS GAMBAR
    // =========================

    // 1. jika ada upload user
    if (uploadedImage) {

    img.src = uploadedImage;

    // hapus storage agar tidak tersimpan terus
    localStorage.removeItem(
        "uploadedImage"
    );

    }

    // 2. jika pilih dari gallery
    else if (selectedImage) {

    img.src = selectedImage;

    }

    // 3. fallback default
    else {

    img.src = "images/gambar1.png";
    }

    // =========================
    // SAAT GAMBAR SELESAI LOAD
    // =========================
    img.onload = () => {

    // bersihkan canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // tampilkan gambar
    ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // simpan history awal
    saveState();
    };

    // =========================
    // JIKA GAGAL LOAD
    // =========================
    img.onerror = () => {

    alert(
        "Gagal memuat gambar."
    );
    };


  // =========================
  // DRAW EVENTS
  // =========================
  canvas.addEventListener("mousedown", startDraw);

  canvas.addEventListener("mousemove", draw);

  canvas.addEventListener("mouseup", stopDraw);

  canvas.addEventListener("mouseleave", stopDraw);

  canvas.addEventListener("click", fillArea);

  function startDraw(e){

    if(currentTool !== "brush") return;

    drawing = true;

    draw(e);
  }

  function draw(e){

    if(!drawing) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    ctx.fillStyle = currentColor;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      brushSize.value / 2,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  function stopDraw(){

    if(drawing){

      drawing = false;

      saveState();
    }
  }

  // =========================
  // BUCKET FILL
  // =========================
  function fillArea(e){

    if(currentTool !== "fill") return;

    const rect = canvas.getBoundingClientRect();

    const x = Math.floor(e.clientX - rect.left);

    const y = Math.floor(e.clientY - rect.top);

    floodFill(
      x,
      y,
      hexToRgb(currentColor)
    );

    saveState();
  }

  function floodFill(startX, startY, fillColor){

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const data = imageData.data;

    const width = canvas.width;

    const height = canvas.height;

    const startPos =
      (startY * width + startX) * 4;

    const targetColor = {
      r: data[startPos],
      g: data[startPos + 1],
      b: data[startPos + 2],
      a: data[startPos + 3]
    };

    // Jangan isi jika sama
    if(
      targetColor.r === fillColor.r &&
      targetColor.g === fillColor.g &&
      targetColor.b === fillColor.b
    ){
      return;
    }

    const stack = [[startX, startY]];
    const visited = new Uint8Array(width * height);

    while(stack.length){

      const [x, y] = stack.pop();

      const currentPos =
        (y * width + x) * 4;

      const currentColorPixel = {
        r: data[currentPos],
        g: data[currentPos + 1],
        b: data[currentPos + 2],
        a: data[currentPos + 3]
      };

      if(matchColor(currentColorPixel, targetColor)){

        // Isi warna
        data[currentPos] = fillColor.r;
        data[currentPos + 1] = fillColor.g;
        data[currentPos + 2] = fillColor.b;
        data[currentPos + 3] = 255;

        // Kiri
        if(x > 0){
          stack.push([x - 1, y]);
        }

        // Kanan
        if(x < width - 1){
          stack.push([x + 1, y]);
        }

        // Atas
        if(y > 0){
          stack.push([x, y - 1]);
        }

        // Bawah
        if(y < height - 1){
          stack.push([x, y + 1]);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function matchColor(a, b, tolerance = 35){

    return (
      Math.abs(a.r - b.r) <= tolerance &&
      Math.abs(a.g - b.g) <= tolerance &&
      Math.abs(a.b - b.b) <= tolerance &&
      Math.abs(a.a - b.a) <= tolerance
    );
  }

  function hexToRgb(hex){

    const bigint = parseInt(
      hex.slice(1),
      16
    );

    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  // =========================
  // SAVE HISTORY
  // =========================
  function saveState(){

    historyStep++;

    if(historyStep < history.length){

      history.length = historyStep;
    }

    history.push(canvas.toDataURL());
  }

  // =========================
  // UNDO
  // =========================
  document.getElementById("undoBtn")
    .addEventListener("click", () => {

      if(historyStep > 0){

        historyStep--;

        restoreState();
      }
    });

  // =========================
  // REDO
  // =========================
  document.getElementById("redoBtn")
    .addEventListener("click", () => {

      if(historyStep < history.length - 1){

        historyStep++;

        restoreState();
      }
    });

  function restoreState(){

    const canvasPic = new Image();

    canvasPic.src = history[historyStep];

    canvasPic.onload = () => {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(canvasPic, 0, 0);
    };
  }

  // =========================
  // CLEAR
  // =========================
  document.getElementById("clearBtn")
    .addEventListener("click", () => {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      if(img.complete){

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      saveState();
    });

  // =========================
  // DOWNLOAD
  // =========================
  document.getElementById("downloadBtn")
    .addEventListener("click", () => {

      const link = document.createElement("a");

      link.download = "hasil-mewarnai.png";

      link.href = canvas.toDataURL();

      link.click();
    });

  // =========================
  // UPLOAD IMAGE
  // =========================
  document.getElementById("uploadImage")
    .addEventListener("change", (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const warning =
        document.getElementById("uploadWarning");

        warning.classList.add("hidden");
        warning.textContent = "";

        // =========================
        // VALIDASI FORMAT
        // =========================
        const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml"
        ];

        if (!allowedTypes.includes(file.type)) {

        warning.textContent =
            "Format gambar harus PNG atau JPG.";

        warning.classList.remove("hidden");

        return;
        }

        // =========================
        // VALIDASI SIZE
        // =========================
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (file.size > maxSize) {

        warning.textContent =
            "Ukuran gambar maksimal 2 MB.";

        warning.classList.remove("hidden");

        return;
        }

        // =========================
        // CEK RESOLUSI
        // =========================
        const reader = new FileReader();

        reader.onload = function(event) {

        const uploadedImg = new Image();

        uploadedImg.onload = function() {

            const width = uploadedImg.width;
            const height = uploadedImg.height;

            // minimal resolusi
            if (width < 500 || height < 300) {

            warning.textContent =
                "Resolusi minimal gambar adalah 500x300 px.";

            warning.classList.remove("hidden");

            return;
            }

            // maksimal resolusi
            if (width > 3000 || height > 3000) {

            warning.textContent =
                "Resolusi gambar terlalu besar.";

            warning.classList.remove("hidden");

            return;
            }

            // =========================
            // JIKA VALID
            // =========================
            ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
            );

            ctx.drawImage(
            uploadedImg,
            0,
            0,
            canvas.width,
            canvas.height
            );

            saveState();
        };

        uploadedImg.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });