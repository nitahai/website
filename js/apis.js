const form = document.getElementById("form");
    const photo = document.getElementById("photo");
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    const chooseText = document.getElementById("chooseText");
    const modalPreview = document.getElementById("modalPreview");
    const modalPr = document.getElementById("modalPr");
    const modalRoast = document.getElementById("modalRoast");
    const modalBorder = document.getElementById("modalBorder");
    const infos = document.getElementById("infos");
    const button = document.getElementById("button");
    const loadingPage = document.getElementById("loadingPage");
    const modalLabel = document.getElementById("modalLabel");
    const potoPreview = document.getElementById('potoPreview');
    const scanLine = document.getElementById('scanLine');
    
    function updateButtonState() {
    if (photo.files.length === 0) {
    button.classList.remove("btn-custom-active");
    button.classList.add("btn-custom-disabled");
    button.disabled = true;
    // Menampilkan toast Bootstrap
    } else {
    button.classList.remove("btn-custom-disabled");
    button.classList.add("btn-custom-active");
    button.disabled = false;
    
    }
    }
    
    
    photo.onchange = (evt) => {
    const [file] = photo.files;
    if (file) {
    chooseText.textContent = file.name;
    fileNameDisplay.textContent = file.name;
    button.innerHTML = "Temukan jawaban sekarang";
    } else {
    chooseText.textContent = "Pilih file foto soalmu telusuri dari perangkat";
    fileNameDisplay.textContent = "";
    }
    updateButtonState();
    };
    
  
    
    function displayLoadingTexts() {
    potoPreview.src = URL.createObjectURL(photo.files[0]);
    setTimeout(() => {
    modalPreview.src = URL.createObjectURL(photo.files[0]);
    //loadingText.textContent = "Udah beres nih kata-kata roasting buat foto luh 🔥";
    }, 2000); // Tampilkan teks "Gue lagi ngerapihin kata-katanya dulu ya..." selama 3 detik
    }
    
    function displayFinalResults(data) {
    // Jeda 3 detik sebelum menampilkan data
    setTimeout(() => {
    loadingPage.style.display = "none";
    button.disabled = false;
    button.innerHTML = "Temukan jawaban";
    
    if (data.ok) {
    modalPreview.src = URL.createObjectURL(photo.files[0]);
    modalPreview.style.display = "block";
    modalPr.style.display = "block";
    infos.style.display = "block";
    const processedText = data.text.replace(/==(.+?)==/g, '<mark>$1</mark>');
    modalRoast.innerHTML = marked.parse(processedText);
    modalRoast.style.display = "block";
    modalBorder.style.display = "block";
    
    } else if (data.statusCode == 429) {
    
    modalPreview.src = URL.createObjectURL(photo.files[0]);
    modalPreview.style.display = "block";
    modalPr.style.display = "block";
    infos.style.display = "block";
    modalRoast.innerHTML = `Sorry pengunjung diwebsite lagi naik lagi rame banget ini, sabar sebentar ya 😭😭<br><small>${data.message}</small>`;
    modalRoast.style.display = "block";
    modalBorder.style.display = "block";
    modalLabel.textContent = "Ada masalah!!";
    } else {
    
    modalPreview.src = URL.createObjectURL(photo.files[0]);
    modalPreview.style.display = "block";
    modalPr.style.display = "block";
    modalRoast.innerHTML = "Terjadi kesalahan coba lagi.";
    infos.style.display = "none";
    modalRoast.style.display = "block";
    modalBorder.style.display = "block";
    }
    
    form.reset();
    chooseText.textContent = "Pilih file foto soalmu telusuri dari perangkat";
    modalLabel.textContent = "Hasil Jawaban";
    
    }, 2000); // Jeda 3 detik sebelum menampilkan hasil akhir
    }
    
    form.onsubmit = (e) => {
    e.preventDefault();
    
    // Tampilkan modal dengan loading
    const modal = new bootstrap.Modal(document.getElementById('resultModal'));
    modal.show();
    
    // Reset tampilan modal untuk roasting
    modalRoast.style.display = "none";
    modalBorder.style.display = "none";
    modalPreview.style.display = "none";
    modalPr.style.display = "none";
    infos.style.display = "none";
    loadingPage.style.display = "flex";
    
    // Mulai menampilkan teks loading
    displayLoadingTexts();
    modalLabel.textContent = "Mencari jawaban";
    button.disabled = false;
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Tunggu sebentar ya..`;
    
    const data = new FormData();
    data.append("file", photo.files[0]);
    
    fetch("https://nitah.vercel.app/roast", {
    method: "POST",
    body: data,
    })
    .then((response) => response.json())
    .then((data) => {
    // Tampilkan hasil akhir setelah teks loading
    displayFinalResults(data);
    })
    .catch((error) => {
    console.error("Error:", error);
    // Hentikan teks loading
    loadingText.textContent = "Terjadi kesalahan. Silakan coba lagi.";
    loadingPage.style.display = "none";
    button.disabled = false;
    button.innerHTML = "Temukan jawaban";
    modalRoast.style.display = "block";
    modalBorder.style.display = "block";
    infos.style.display = "block";
    });
    };