import os
import sys
import subprocess
import time
import webbrowser
import signal

# Global subprocess handles
backend_process = None
frontend_process = None

def signal_handler(sig, frame):
    print("\n[main.py] Kapatma sinyali alındı. Sunucular sonlandırılıyor...")
    cleanup()
    sys.exit(0)

def cleanup():
    global backend_process, frontend_process
    # Terminate backend
    if backend_process:
        print("[main.py] Backend sunucusu kapatılıyor...")
        try:
            backend_process.terminate()
            backend_process.wait(timeout=3)
        except Exception:
            backend_process.kill()
            
    # Terminate frontend
    if frontend_process:
        print("[main.py] Frontend sunucusu kapatılıyor...")
        try:
            frontend_process.terminate()
            frontend_process.wait(timeout=3)
        except Exception:
            frontend_process.kill()
    print("[main.py] Tüm işlemler temizlendi. İyi günler!")

# Register signal handlers for clean exit
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

def run_npm_install(path):
    print(f"[main.py] '{path}' dizininde paketler kontrol ediliyor...")
    node_modules_path = os.path.join(path, "node_modules")
    
    if not os.path.exists(node_modules_path):
        print(f"[main.py] node_modules bulunamadı. npm install çalıştırılıyor in '{path}'...")
        try:
            # Use shell=True for windows npm compatibility
            subprocess.run("npm install", cwd=path, shell=True, check=True)
            print(f"[main.py] Paket kurulumu başarıyla tamamlandı: '{path}'")
        except subprocess.CalledProcessError as e:
            print(f"[main.py] HATA: npm install başarısız oldu in '{path}': {e}")
            sys.exit(1)
    else:
        print(f"[main.py] Paketler hazır (node_modules mevcut): '{path}'")

def free_port(port):
    try:
        # Find process ID (PID) using netstat on Windows
        result = subprocess.run("netstat -ano", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        lines = result.stdout.splitlines()
        pids = set()
        for line in lines:
            if f":{port}" in line and "LISTENING" in line:
                parts = line.strip().split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    if pid.isdigit() and pid != "0":
                        pids.add(pid)
        for pid in pids:
            print(f"[main.py] Port {port} meşgul. PID {pid} sonlandırılıyor...")
            subprocess.run(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        print(f"[main.py] Port temizlenirken hata oluştu: {e}")

def main():
    global backend_process, frontend_process
    
    root_dir = os.path.abspath(os.path.dirname(__file__))
    backend_dir = os.path.join(root_dir, "yokdil_app", "backend")
    frontend_dir = os.path.join(root_dir, "yokdil_app", "frontend")
    
    # Clean up conflicting ports 5000 and 5173 before starting
    free_port(5000)
    free_port(5173)
    
    print("=" * 60)
    print("      YÖKDİL FEN BİLİMLERİ HAZIRLIK SİSTEMİ BAŞLATILIYOR")
    print("=" * 60)
    
    # 1. Check and install dependencies
    run_npm_install(backend_dir)
    run_npm_install(frontend_dir)
    
    # 2. Start Express Backend
    print("[main.py] Backend sunucusu başlatılıyor (Port 5000)...")
    try:
        backend_process = subprocess.Popen(
            ["node", "server.js"],
            cwd=backend_dir,
            text=True,
            shell=True
        )
    except Exception as e:
        print(f"[main.py] HATA: Backend başlatılamadı: {e}")
        sys.exit(1)

    # 3. Start Vite Frontend
    print("[main.py] Frontend sunucusu başlatılıyor (Port 5173)...")
    try:
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=frontend_dir,
            text=True,
            shell=True
        )
    except Exception as e:
        print(f"[main.py] HATA: Frontend başlatılamadı: {e}")
        cleanup()
        sys.exit(1)

    # 4. Wait for warmup and open browser
    print("[main.py] Sunucuların ısınması bekleniyor (3 saniye)...")
    time.sleep(3)
    
    app_url = "http://localhost:5173/"
    print(f"[main.py] Tarayıcı açılıyor: {app_url}")
    webbrowser.open(app_url)
    
    print("\n" + "=" * 60)
    print("  Sistem başarıyla çalıştırıldı!")
    print("  Uygulamayı kapatmak için bu terminalde CTRL + C tuşlarına basın.")
    print("=" * 60 + "\n")
    
    # Keep main thread alive and monitor processes
    try:
        while True:
            # Check if subprocesses died unexpectedly
            if backend_process.poll() is not None:
                print("[main.py] UYARI: Backend beklenmedik şekilde kapandı!")
                break
            if frontend_process.poll() is not None:
                print("[main.py] UYARI: Frontend beklenmedik şekilde kapandı!")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        cleanup()

if __name__ == "__main__":
    main()
