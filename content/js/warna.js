const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const colorContainer = document.getElementById("colors");
  const brushSize = document.getElementById("brushSize");

  let currentColor = "#ff0000";
  let drawing = false;

  // MODE
  let currentTool = "brush";

  const history = [];
  let historyStep = -1;

  // =========================
  // COLORS
  // =========================
  const colors = [
    "#ff0000",
    "#ff9800",
    "#ffeb3b",
    "#4caf50",
    "#00bcd4",
    "#2196f3",
    "#3f51b5",
    "#9c27b0",
    "#e91e63",
    "#795548",
    "#607d8b",
    "#000000",
    "#ffffff",
    "#ffc0cb",
    "#8bc34a",
    "#673ab7"
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
      class="bg-blue-400 text-white px-3 py-2 rounded-lg mt-3">
      ✏ Brush
    </button>

    <button id="fillTool"
      class="bg-green-400 text-white px-3 py-2 rounded-lg mt-3">
      🪣 Fill
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