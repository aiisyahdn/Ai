//  Kode ini memastikan semua elemen HTML sudah selesai dimuat sebelum JavaScript dijalankan.
document.addEventListener('DOMContentLoaded', function() {
            
    //  Mengambil elemen layar kalkulator, gambar status, dan semua tombol yang memiliki class .btn-calc untuk digunakan dalam logika kalkulator. 
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc');

    //  Menyimpan URL gambar untuk status kalkulator (normal, sukses, error).
    const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
    const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
    const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

    /**
      Fungsi ini mengganti gambar status sesuai kondisi perhitungan: normal, sukses, atau error. 
     */
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            //  Menampilkan imgNormal apabila tidak ada perhitungan yang dilakukan.
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**
      Menghapus seluruh angka pada layar kalkulator dan mengembalikan gambar status ke kondisi normal. 
     */
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil function untuk merubah gambar
    }

    /**
      Menghapus satu karakter terakhir dari angka yang sedang ditampilkan di layar. 
     */
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**
      Menambahkan angka atau simbol yang ditekan ke layar kalkulator.
     */
    function appendToDisplay(value) {
        display.value += value;
    }

    /**
      Bagian inti kalkulator. Kode ini menghitung hasil dari operasi matematika menggunakan eval, menangani error, dan mengganti gambar status sesuai hasil.
     */
    function calculateResult() {
        //  Jika belum ada input, tampilkan error. 
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            //  Jika belum ada input juga, reset otomatis setelah jeda waktu 
            setTimeout(clearDisplay, 1500);
            return;
        }

        try {
            //  Menggunakan eval untuk menghitung. 
            let result = eval(display.value
                .replace(/%/g, '/100') //  mengubah simbol % menjadi pembagian 100  
            ); 
            
            //  Mengecek hasil valid atau tidak
            if (isFinite(result)) {
                display.value = result;
                changeImage('success'); //  Jika valid, menampilkan gambar succes
            } else {
                throw new Error("Hasil tidak valid");
            }

        } catch (error) {
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            changeImage('error'); //  Menampilkan error apabila perhitungan tidak valid 
            setTimeout(clearDisplay, 1500);
        }
    }


    //  Memberikan fungsi klik pada setiap tombol kalkulator sesuai nilai (data-value)
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            //  Menampilkan display sesuai tombol yang ditekan 
            switch(value) {
                case 'C':
                    //  Jika ditekan C, maka akan menghapus seluruh angka yang ada di display
                    clearDisplay();
                    break;
                case 'DEL':
                    //  Jika ditekan DEL, maka akan menghapus satu angka terakhir 
                    deleteLastChar();
                    break;
                case '=':
                    //  Jika ditekan =, maka akan mengkalkulasi angka yang dimasukkan 
                    calculateResult();
                    break;
                default:
                    //  Jika sebelumnya status sukses/error dan tombol ditekan lagi, display akan reset dulu 
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(value);
                    break;
            }
        });
    });

    //  Menambahkan dukungan input melalui keyboard agar lebih nyaman digunakan 
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
            e.preventDefault();
        }
    });
});