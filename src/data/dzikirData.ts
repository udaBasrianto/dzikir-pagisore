export interface DzikirItem {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  category?: string;
}

export const dzikirPagiData: DzikirItem[] = [
  {
    id: 1,
    title: "Ta'awudz",
    arabic: "أَعُوذُ بِاللَّهِ مِنْ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "A'uudzu billaahi minasy-syaithoonir-rojiim.",
    translation: "Aku berlindung kepada Allah dari godaan syaitan yang terkutuk.",
    count: 1
  },
  {
    id: 2,
    title: "Ayat Kursi",
    arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ، لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration: "Allahu laa ilaaha illa huwal hayyul qayyuum...",
    translation: "Allah tidak ada Ilah (yang berhak diibadahi) melainkan Dia Yang Hidup Kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang ada di langit dan di bumi...",
    count: 1
  },
  {
    id: 3,
    title: "Surat Al-Ikhlas",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ {١} اللَّهُ الصَّمَدُ {٢} لَمْ يَلِدْ وَلَمْ يُولَدْ {٣} وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ {٤}",
    transliteration: "Bismillahir-rahmanir-rahim. Qul huwallahu ahad. Allahus-samad. Lam yalid wa lam yuulad. Wa lam yakun lahu kufuwan ahad.",
    translation: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang. Katakanlah, Dia-lah Allah Yang Maha Esa. Allah adalah (Rabb) yang segala sesuatu bergantung kepada-Nya. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada seorang pun yang setara dengan-Nya.",
    count: 3
  },
  {
    id: 4,
    title: "Surat Al-Falaq",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ {١} مِن شَرِّ مَا خَلَقَ {٢} وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ {٣} وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ {٤} وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ {٥}",
    transliteration: "Bismillahir-rahmanir-rahim. Qul a'uudzu bi rabbil-falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin-naffaatsaati fil 'uqad. Wa min syarri haasidin idzaa hasad.",
    translation: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang. Katakanlah: 'Aku berlindung kepada Rabb Yang menguasai (waktu) Shubuh dari kejahatan makhluk-Nya. Dan dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. Serta dari kejahatan orang yang dengki apabila dia dengki.'",
    count: 3
  },
  {
    id: 5,
    title: "Surat An-Naas",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ {١} مَلِكِ النَّاسِ {٢} إِلَهِ النَّاسِ {٣} مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ {٤} الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ {٥} مِنَ الْجِنَّةِ وَ النَّاسِ {٦}",
    transliteration: "Bismillahir-rahmanir-rahim. Qul a'uudzu bi rabbin-naas. Malikin-naas. Ilaahin-naas. Min syarril-waswaasil-khannaas. Alladzi yuwaswisu fii suduurin-naas. Minal-jinnati wan-naas.",
    translation: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang. Katakanlah, 'Aku berlindung kepada Rabb (yang memelihara dan menguasai) manusia. Raja manusia. Sembahan (Ilah) manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada-dada manusia. Dari golongan jin dan manusia.'",
    count: 3
  },
  {
    id: 6,
    title: "Doa Pagi",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
    transliteration: "Ash-bahnaa wa ash-bahal mulku lillah walhamdulillah, laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa 'ala kulli syai-in qodir. Robbi as-aluka khoiro maa fii hadzal yaum wa khoiro maa ba'dahu, wa a'udzu bika min syarri maa fii hadzal yaum wa syarri maa ba'dahu. Robbi a'udzu bika minal kasali wa su-il kibar. Robbi a'udzu bika min 'adzabin fin naari wa 'adzabin fil qobri.",
    translation: "Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji hanya milik Allah. Tidak ada ilah yang berhak diibadahi dengan benar kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabb, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabb, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabb, aku berlindung kepada-Mu dari siksaan di Neraka dan siksaan di kubur.",
    count: 1
  },
  {
    id: 7,
    title: "Doa Pagi (2)",
    arabic: "اَللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ وَإِلَيْكَ النُّشُوْرُ",
    transliteration: "Allahumma bika ash-bahnaa wa bika amsaynaa wa bika nahyaa wa bika namuutu wa ilaikan nusyuur.",
    translation: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu sore. Dengan rahmat dan kehendak-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan (bagi semua makhluk).",
    count: 1
  },
  {
    id: 8,
    title: "Sayyidul Istighfar",
    arabic: "اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ",
    transliteration: "Allahumma anta robbii laa ilaha illa anta, kholaqtanii wa anaa 'abduka wa anaa 'ala 'ahdika wa wa'dika mas-tatho'tu. A'udzu bika min syarri maa shona'tu. Abu-u laka bi ni'matika 'alayya wa abu-u bi dzambii. Fagh-firlii fainnahu laa yagh-firudz dzunuuba illa anta.",
    translation: "Ya Allah, Engkau adalah Rabb-ku, tidak ada Ilah (yang berhak diibadahi dengan benar) kecuali Engkau, Engkau-lah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan (apa) yang kuperbuat. Aku mengakui nikmat-Mu (yang diberikan) kepadaku dan aku mengakui dosaku, oleh karena itu, ampunilah aku. Sesungguhnya tidak ada yang dapat mengampuni dosa kecuali Engkau.",
    count: 1
  },
  {
    id: 9,
    title: "Doa Keselamatan",
    arabic: "اَللَّهُمَّ عَافِنِيْ فِيْ بَدَنِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ سَمْعِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ بَصَرِيْ، لاَ إِلَـهَ إِلاَّ أَنْتَ. اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَـهَ إِلاَّ أَنْتَ",
    transliteration: "Allaahumma 'aafinii fii badanii, Allahumma 'aafinii fii sam'ii, Allaahumma 'aafinii fii bashorii, Laa ilaaha illa anta. Allahumma inni a'uudzu bika minal kufri wal faqri, Wa a'uudzu bika min 'adzaabil qobri, Laa ilaaha illaa anta.",
    translation: "Ya Allah, selamatkanlah tubuhku (dari penyakit dan dari apa yang tidak aku inginkan). Ya Allah, selamatkanlah pendengaranku (dari penyakit dan maksiat atau dari apa yang tidak aku inginkan). Ya Allah, selamatkanlah penglihatanku, tidak ada Ilah yang berhak diibadahi dengan benar kecuali Engkau. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur, tidak ada Ilah yang berhak diibadahi dengan benar kecuali engkau.",
    count: 3
  },
  {
    id: 10,
    title: "Doa Perlindungan",
    arabic: "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى. اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ",
    transliteration: "Allahumma innii as-alukal 'afwa wal 'aafiyah fid dunyaa wal aakhiroh. Allahumma innii as-alukal 'afwa wal 'aafiyah fii diinii wa dun-yaya wa ahlii wa maalii. Allahumas-tur 'awrootii wa aamin row'aatii. Allahumah fadni min bayni yadayya wa min kholfii wa 'an yamiinii wa 'an syimaalii wa min fawqii wa a'udzu bi 'azhomatik an ughtala min tahtii.",
    translation: "Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan dalam agama, dunia, keluarga dan hartaku. Ya Allah, tutupilah auratku (aib dan sesuatu yang tidak layak dilihat orang) dan tentramkan-lah aku dari rasa takut. Ya Allah, peliharalah aku dari depan, belakang, kanan, kiri dan dari atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak disambar dari bawahku (aku berlindung dari dibenamkan ke dalam bumi).",
    count: 1
  },
  {
    id: 11,
    title: "Doa Berlindung",
    arabic: "اَللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرُّهُ إِلَى مُسْلِمٍ",
    transliteration: "Allahumma 'aalimal ghoybi wasy syahaadah faathiros samaawaati wal ardh. Robba kulli syai-in wa maliikah. Asyhadu alla ilaha illa anta. A'udzu bika min syarri nafsii wa min syarrisy syaythooni wa syirkihi, wa an aqtarifa 'alaa nafsii suu-an aw ajurruhu ilaa muslim.",
    translation: "Ya Allah Yang Mahamengetahui yang ghaib dan yang nyata, wahai Rabb Pencipta langit dan bumi, Rabb atas segala sesuatu dan Yang Merajainya. Aku bersaksi bahwa tidak ada Ilah yang berhak diibadahi dengan benar kecuali Engkau. Aku berlindung kepada-Mu dari kejahatan diriku, syaitan dan ajakannya menyekutukan Allah (aku berlindung kepada-Mu) dari berbuat kejelekan atas diriku atau mendorong seorang muslim kepadanya.",
    count: 1
  },
  {
    id: 12,
    title: "Bismillah yang Agung",
    arabic: "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي اْلأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ",
    transliteration: "Bismillahilladzi laa yadhurru ma'asmihi syai-un fil ardhi wa laa fis samaa' wa huwas samii'ul 'aliim.",
    translation: "Dengan Menyebut Nama Allah, yang dengan Nama-Nya tidak ada satupun yang membahayakan, baik di bumi maupun dilangit. Dia-lah Yang Mahamendengar dan Maha mengetahui.",
    count: 3
  },
  {
    id: 13,
    title: "Ridha kepada Allah",
    arabic: "رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    transliteration: "Rodhiitu billaahi robbaa wa bil-islaami diinaa, wa bi-muhammadin shallallaahu 'alaihi wa sallama nabiyya.",
    translation: "Aku rela (ridha) Allah sebagai Rabb-ku (untukku dan orang lain), Islam sebagai agamaku dan Muhammad صلي الله عليه وسلم sebagai Nabiku (yang diutus oleh Allah).",
    count: 3
  },
  {
    id: 14,
    title: "Ya Hayyu Ya Qayyum",
    arabic: "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، وَأَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ",
    transliteration: "Yaa Hayyu Yaa Qoyyum, bi-rohmatika as-taghiits, wa ash-lih lii sya'nii kullahu wa laa takilnii ilaa nafsii thorfata 'ainin.",
    translation: "Wahai Rabb Yang Maha hidup, Wahai Rabb Yang Maha berdiri sendiri (tidak butuh segala sesuatu) dengan rahmat-Mu aku meminta pertolongan, perbaikilah segala urusanku dan jangan diserahkan (urusanku) kepada diriku sendiri meskipun hanya sekejap mata (tanpa mendapat pertolongan dari-Mu).",
    count: 1
  },
  {
    id: 15,
    title: "Fitrah Islam",
    arabic: "أَصْبَحْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    transliteration: "Ash-bahnaa 'ala fithrotil islaam wa 'alaa kalimatil ikhlaash, wa 'alaa diini nabiyyinaa Muhammadin shallallahu 'alaihi wa sallam, wa 'alaa millati abiina Ibraahiima haniifam muslimaaw wa maa kaana minal musyrikin",
    translation: "Di waktu pagi kami berada diatas fitrah agama Islam, kalimat ikhlas, agama Nabi kami Muhammad صلي الله عليه وسلم dan agama ayah kami, Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang musyrik.",
    count: 1
  },
  {
    id: 16,
    title: "La ilaha illallah (10x)",
    arabic: "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ",
    transliteration: "Laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa 'ala kulli syai-in qodiir.",
    translation: "Tidak ada Ilah yang berhak diibadahi dengan benar selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji. Dan Dia Mahakuasa atas segala sesuatu.",
    count: 10
  },
  {
    id: 17,
    title: "Tasbih dengan Jumlah Besar",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    transliteration: "Subhanallah wa bi-hamdih, 'adada kholqih wa ridhoo nafsih. wa zinata 'arsyih, wa midaada kalimaatih.",
    translation: "Mahasuci Allah, aku memuji-Nya sebanyak bilangan makhluk-Nya, Mahasuci Allah sesuai ke-ridhaan-Nya, Mahasuci seberat timbangan 'Arsy-Nya, dan Mahasuci sebanyak tinta (yang menulis) kalimat-Nya.",
    count: 3
  },
  {
    id: 18,
    title: "Doa Ilmu dan Rizki",
    arabic: "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    transliteration: "Allahumma innii as-aluka 'ilman naafi'a, wa rizqon thoyyibaa, wa 'amalan mutaqobbalaa.",
    translation: "Ya Allah, sesungguhnya aku meminta kepada-Mu ilmu yang bermanfaat, rizki yang halal, dan amalan yang diterima.",
    count: 1
  },
  {
    id: 19,
    title: "Subhanallah wa bihamdih",
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    transliteration: "Subhanallah wa bi-hamdih.",
    translation: "Mahasuci Allah, aku memuji-Nya.",
    count: 100
  },
  {
    id: 20,
    title: "Istighfar",
    arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوْبُ إِلَيْهِ",
    transliteration: "Astagh-firullah wa atuubu ilaih.",
    translation: "Aku memohon ampunan kepada Allah dan bertaubat kepada-Nya.",
    count: 100
  }
];

export const dzikirPetangData: DzikirItem[] = [
  // Untuk saat ini, kita fokus pada dzikir pagi dulu
  // Dzikir petang akan memiliki struktur yang sama tapi dengan konten yang berbeda
];