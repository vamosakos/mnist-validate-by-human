# mnist-validate-by-human

## Telepítés

A GitHub-ról való telepítés hasonló a zip-elt verzióhoz. Itt azonban több lépésre van szükségünk. A repository-ból történő klónozás előtt azonban rendelkeznie kell [XAMPP](https://www.apachefriends.org/download.html) vezérlővel, illetve [Node.js](https://nodejs.org/en/download) és [Composer](https://getcomposer.org/download/) telepítésével.


![XAMPP](/szakdolgozat-F6L4X9/imgs/xampp.png)

A XAMPP vezérlőpulton, az Apache Config gombjára kattintva a `php.ini` konfigurációs fájlban végezzük el az alábbi módosítást:

![A php.ini konfigurációs fájl 'extension=zip' sor keresése](/szakdolgozat-F6L4X9/imgs/extension_zip.png)

Amennyiben az `extension=zip` sor előtt `;` (pontosvesszőt) lát, törölje azt ki. Ez azért fontos, mert ha meghagynánk a sor előtt lévő pontosvesszőt, úgy a Composer (a webalkalmazás telepítésekor) az összes csomagot le fogja húzni, ami több gigabyte-os fájlt fog okozni, a mindössze pár száz MB helyett.

Amint végzett az előzetes beállításokkal, nyissa meg a klónozott repository mappáját egy fejlesztői környezetben. Keresse meg a `.env.example` nevű fájlt. Készítsen belőle másolatot és nevezze át `.env`-re. Ezek után keresse meg benne az alábbi sorokat és módosítsa azokat:

```plaintext
DB_DATABASE=mnist_validate_by_human
SESSION_DRIVER=database
SESSION_LIFETIME=525600
```

Hozzon létre új MySQL adatbázist `mnist_validate_by_human` néven. Majd nyisson három új terminált az `mnist-valide-by-human` könyvtárban és adja ki sorrendben a következő parancsokat:

# Szerveroldali terminál:

`composer install` | `php artisan migrate` | `php artisan db:seed` | `php artisan key:generate` | `php artisan serve`

# Kliensoldali terminál:

`npm install` | `npm install uuid` | `npm install react-chartjs-2 chart.js` | `npm install dompurify` | `npm run dev`

# Az ütemezőért felelős terminál:

`php artisan schedule:work`

# MNIST adatbázis betöltése
A parancsok sikeres lefutása után keresse meg a `./storage/scripts` mappában található `mnist_images_init.py` python szkriptet. Futtassa le a szkriptet. Ennek segítségével az MNIST adatbázis összes rekordját feltöltjük az adatbázisunkba. A szkript lefutása hosszabb ideig is eltarthat. Működéséhez az alábbi csomagokkal kell rendelkeznünk:

`pip install matplotlib` | `pip install python-mnist` | `pip install mysql-connector-python` | `pip install keras` | `pip install tensorflow`
