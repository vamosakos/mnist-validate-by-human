import React from 'react';
import { Head } from '@inertiajs/react';
import Footer from '@/Footer/Footer';
import Header from '@/Header/Header';

export default function PrivacyPolicy() {
    return (
        <div>
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="bg-gray-127 min-h-screen flex flex-col justify-center items-center py-">
                <div className="container mx-auto bg-gray-194 rounded-lg p-12 text-center mb-6 flex flex-wrap">
                    {/* Text */}
                    <div className="w-full text-left">
                        <div>
                            <Head title="Privacy Policy" />
                            <p className="text-4xl font-bold mb-6">Privacy Policy</p>
                            <p className="text-xl mb-6">
                                Üdvözlünk a weboldalunkon! Az alábbiakban megtalálod az adatvédelmi gyakorlatunkat, amely magában foglalja az adatgyűjtés, -kezelés és -védelem részleteit. Kérjük, olvasd el ezt a dokumentumot figyelmesen, hogy megértsd, milyen adatokat gyűjtünk, és hogyan kezeljük azokat.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>1. Gyűjtött adatok</strong><br/>
                                A weboldalunk látogatása során két fő típusú cookie-t használunk: XSRF-TOKEN és laravel_session. Ezek a cookie-k segítik az oldal biztonságát és funkcionalitását.
                                <br/><br/>
                                <strong>XSRF-TOKEN:</strong> Ez a cookie segít megvédeni a weboldalt a Cross-Site Request Forgery (CSRF) támadások ellen.
                                <br/><br/>
                                <strong>laravel_session:</strong> Ez a cookie tárolja az aktuális látogatásod során összegyűjtött információkat. Az érvényessége egy évre terjed, és nélkülözhetetlen az oldal biztonsága és funkcionalitása szempontjából.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>2. Adatkezelés célja</strong><br/>
                                Az általunk gyűjtött adatokat kizárólag a weboldal biztonságának és funkcionalitásának javítására használjuk. Semmilyen személyes adatot nem értékesítünk vagy osztunk meg harmadik féllel.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>3. Felhasználói jogok</strong><br/>
                                Felhasználóként jogod van kérvényezni az általunk tárolt személyes adatokhoz való hozzáférést, módosítást vagy törlést. Kérjük, vedd fel velünk a kapcsolatot az alábbi elérhetőségeken, ha bármilyen adatkezelési kérdésed vagy kéréseid vannak.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>4. Cookie-k kezelése</strong><br/>
                                A cookie-kat általában a böngésző beállításaiban lehet kezelni. Azonban megjegyezzük, hogy a cookie-k letiltása vagy törlése befolyásolhatja az oldal funkcionalitását és biztonságát.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>5. Elfogadás</strong><br/>
                                Az oldalunk használatával és a cookie-k elfogadásával beleegyezel az általunk leírt adatkezelési gyakorlatokba.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>Kapcsolat</strong><br/>
                                Ha kérdéseid vagy észrevételeid vannak az adatvédelmi gyakorlatunkkal kapcsolatban, kérjük, lépj kapcsolatba velünk az alábbi elérhetőségeken: [email cím vagy elérhetőség].
                            </p>
                            <p className="text-xl mb-6">
                                Ez az adatvédelmi nyilatkozat 2024. március 8-án lépett életbe, és fenntartjuk a jogot a módosításokra, amennyiben szükségesnek találjuk.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
