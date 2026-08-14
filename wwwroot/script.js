document.addEventListener("DOMContentLoaded", () => {
    gorevleriYukle();
    
    // Formun submit (gönderme) olayını dinliyoruz
    const form = document.getElementById("taskForm");
    if (form) {
        form.addEventListener("submit", yeniGorevEkle);
    }
});

// 1. Görevleri Getir
async function gorevleriYukle() {
    try {
        const response = await fetch('/api/taskitems');
        if (!response.ok) throw new Error('Sunucu hatası');

        const tasks = await response.json();
        
        // Yükleniyor yazısını gizle
        const loadingText = document.getElementById("loadingState");
        if (loadingText) loadingText.style.display = 'none';

        // Bağlantı hatası uyarısı varsa gizle
        document.getElementById("connError").hidden = true;

        ekraniGuncelle(tasks);
    } catch (error) {
        console.error('Hata:', error);
        // Hata durumunda bağlantı hatası mesajını göster
        const loadingText = document.getElementById("loadingState");
        if (loadingText) loadingText.style.display = 'none';
        document.getElementById("connError").hidden = false;
    }
}

// 2. Ekranı, İstatistikleri ve Listeyi Güncelle
function ekraniGuncelle(tasks) {
    const board = document.getElementById("board"); 
    const emptyState = document.getElementById("emptyState");

    if (!board) return;

    // Listeyi temizle
    board.innerHTML = ""; 

    if (tasks.length === 0) {
        // Görev yoksa empty-state göster
        if (emptyState) emptyState.hidden = false;
    } else {
        // Görev varsa empty-state gizle ve kartları bas
        if (emptyState) emptyState.hidden = true;
        
       tasks.forEach(task => {
            const tarihObje = new Date(task.createdAt);
            const tarihMetni = tarihObje.toLocaleDateString('tr-TR', { 
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
            });

            const kart = document.createElement("div");
            
            // Kartın Ana Stili (Blueprint temasına uygun, şık ve hafif gölgeli)
            kart.style.backgroundColor = "rgba(15, 23, 42, 0.6)"; // Koyu lacivert/transparan
            kart.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            kart.style.borderRadius = "10px";
            kart.style.padding = "1.5rem";
            kart.style.marginBottom = "1.2rem";
            kart.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";

            kart.innerHTML = `
                <!-- Üst Kısım: Başlık, Açıklama ve Tarih -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                    <div>
                        <h3 style="margin: 0 0 0.4rem 0; color: #f8fafc; font-size: 1.2rem; font-weight: 600; letter-spacing: 0.5px;">
                            ${task.title}
                        </h3>
                        <p style="margin: 0; color: #94a3b8; font-size: 0.95rem;">
                            ${task.description || 'Açıklama belirtilmemiş.'}
                        </p>
                    </div>
                    <div style="color: #64748b; font-size: 0.8rem; font-family: monospace; white-space: nowrap;">
                        ${tarihMetni}
                    </div>
                </div>
                
                <!-- Alt Kısım: Durum ve Butonlar -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
                    
                    <!-- Durum Göstergesi (Renkli Nokta ile) -->
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${task.isCompleted ? '#10b981' : '#f59e0b'}; box-shadow: 0 0 8px ${task.isCompleted ? '#10b981' : '#f59e0b'};"></span>
                        <span style="color: ${task.isCompleted ? '#10b981' : '#f59e0b'}; font-size: 0.9rem; font-weight: 500;">
                            ${task.isCompleted ? 'Tamamlandı' : 'Devam Ediyor'}
                        </span>
                    </div>
                    
                    <!-- Aksiyon Butonları -->
                    <div style="display: flex; gap: 0.75rem;">
                        <button onclick="durumGuncelle(${task.id}, ${task.isCompleted}, '${task.title}', '${task.description || ''}')" 
                                style="background: ${task.isCompleted ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; 
                                       border: 1px solid ${task.isCompleted ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; 
                                       color: ${task.isCompleted ? '#f59e0b' : '#10b981'}; 
                                       padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;">
                            ${task.isCompleted ? '⟲ Geri Al' : '✓ Tamamla'}
                        </button>
                        
                        <button onclick="gorevSil(${task.id})" 
                                style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; 
                                       padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s ease;">
                            ✕ Sil
                        </button>
                    </div>
                </div>
            `;
            board.appendChild(kart);
        });
    }

    // İstatistik (Stats) alanlarını güncelle
    const aktifSayisi = tasks.filter(t => !t.isCompleted).length;
    const tamamlananSayisi = tasks.filter(t => t.isCompleted).length;
    
    document.getElementById("statTotal").textContent = tasks.length;
    document.getElementById("statActive").textContent = aktifSayisi;
    document.getElementById("statDone").textContent = tamamlananSayisi;
}

// 3. Yeni Görev Ekle (POST)
async function yeniGorevEkle(e) {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    
    const baslikInput = document.getElementById("titleInput");
    const aciklamaInput = document.getElementById("descInput");

    if (!baslikInput.value.trim()) return;

    const yeniGorev = {
        title: baslikInput.value,
        description: aciklamaInput ? aciklamaInput.value : ""
    };

    try {
        const response = await fetch('/api/taskitems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(yeniGorev)
        });

        if (response.ok) {
            // Inputları temizle ve listeyi baştan çek
            baslikInput.value = "";
            if (aciklamaInput) aciklamaInput.value = "";
            gorevleriYukle(); 
        } else {
            console.error("Ekleme başarısız oldu.");
        }
    } catch (error) {
        console.error("Bağlantı hatası:", error);
    }
}
// 4. Görev Sil (DELETE)
async function gorevSil(id) {
    if (!confirm("Bu görevi silmek istediğine emin misin?")) return;

    try {
        const response = await fetch(`/api/taskitems/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            gorevleriYukle(); // Listeyi yenile
        } else {
            console.error("Silme işlemi başarısız.");
        }
    } catch (error) {
        console.error("Bağlantı hatası:", error);
    }
}

// 5. Görev Durumunu Güncelle (PUT)
async function durumGuncelle(id, isCompleted, title, description) {
    // API'mizdeki UpdateTaskDto ile eşleşen veri modeli
    const guncelData = {
        title: title,
        description: description,
        isCompleted: !isCompleted // Tamamlandıysa açık yap, açıksa tamamlandı yap
    };

    try {
        const response = await fetch(`/api/taskitems/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guncelData)
        });

        if (response.ok) {
            gorevleriYukle(); // Listeyi yenile
        } else {
            console.error("Güncelleme başarısız.");
        }
    } catch (error) {
        console.error("Bağlantı hatası:", error);
    }
}