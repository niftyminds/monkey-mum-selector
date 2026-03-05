export default function Footer() {
  return (
    <footer className="bg-primary-800 text-primary-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-300 mb-4">
              Společnost
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.monkeymum.com/nas-tym" className="hover:text-white transition-colors">Náš tým</a></li>
              <li><a href="https://www.monkeymum.com/kontakty" className="hover:text-white transition-colors">Kontakt</a></li>
              <li><a href="https://www.monkeymum.com/kariera" className="hover:text-white transition-colors">Kariéra</a></li>
              <li><a href="https://www.monkeymum.com/mlog" className="hover:text-white transition-colors">Mlog</a></li>
              <li><a href="https://www.monkeymum.com/napsali-o-nas-1" className="hover:text-white transition-colors">Napsali o nás</a></li>
              <li><a href="https://www.monkeymum.com/pomahame" className="hover:text-white transition-colors">Pomáháme</a></li>
            </ul>
          </div>

          {/* Column 2: Shopping info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-300 mb-4">
              Vše o nákupu
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.monkeymum.com/obchodni-podminky" className="hover:text-white transition-colors">Obchodní podmínky</a></li>
              <li><a href="https://www.monkeymum.com/formular-pro-uplatneni-reklamace" className="hover:text-white transition-colors">Uplatnění reklamace</a></li>
              <li><a href="https://www.monkeymum.com/formular-pro-odstoupeni-od-smlouvy" className="hover:text-white transition-colors">Odstoupení od smlouvy</a></li>
              <li><a href="https://www.monkeymum.com/vernostni-program" className="hover:text-white transition-colors">Věrnostní program</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-300 mb-4">
              Nevíte si s něčím rady?
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:informace@monkeymum.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                informace@monkeymum.com
              </a>
              <a
                href="tel:+420725441733"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +420 725 441 733
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.facebook.com/monkeymumcom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center hover:bg-primary-600 transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/monkeymum_com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center hover:bg-primary-600 transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCKloZfKcTCx5PXRiZRatBWQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center hover:bg-primary-600 transition-colors"
                title="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-700 pt-6 text-center text-xs text-primary-300">
          <p>&copy; 2020–2026 Monkey Mum s.r.o.</p>
        </div>
      </div>
    </footer>
  );
}
