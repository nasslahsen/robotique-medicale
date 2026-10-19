/*
 * Module Systèmes embarqués et instrumentation biomédicale intelligente : ordre des pages.
 * Couleurs, sous-modules et statut : registre.js.
 * chapitres[].sousModule : sous-module du registre auquel le chapitre appartient.
 * niveaux : pages du jeu, dans l'ordre (cours : true quand cours/<id>.html existe ;
 *           revision, boss : niveaux de fin de chapitre ; pret : niveau jouable).
 * cours : pages de cours, dans l'ordre du menu « Tous les concepts ».
 */
PLATEFORME.parcours("embarques", {
  chapitres: [
    { id: 0, titre: "Les bases du numérique", sous: "Bits, binaire, hexadécimal, registres et signaux logiques : ce que le cours suppose", sousModule: "embarques" },
    { id: 1, titre: "Le système embarqué", sous: "Définitions, exigences de conception, organisation en couches, deux dispositifs médicaux", sousModule: "embarques" },
    { id: 2, titre: "Architectures matérielles", sous: "Contrôleur embarqué, Von Neumann et Harvard, CISC et RISC, AVR, ARM", sousModule: "embarques" },
    { id: 3, titre: "Bus de communication", sous: "Pourquoi des bus, UART, SPI, I2C", sousModule: "embarques" },
    { id: 4, titre: "L'ESP32 : la carte et la puce", sous: "Caractéristiques, nomenclature, carte DEV KIT V1, cœurs, mémoire, alimentation", sousModule: "embarques" },
    { id: 5, titre: "Programmer les périphériques de l'ESP32", sous: "GPIO, interruptions, ADC, DAC, timers, watchdog, PWM, I2C et SPI", sousModule: "embarques" }
  ],
  niveaux: [
    { id: "binaire", chapitre: 0, titre: "Bits et binaire", cours: true, pret: true },
    { id: "hexadecimal", chapitre: 0, titre: "Hexadécimal et registres", cours: true, pret: true },
    { id: "signaux", chapitre: 0, titre: "Signaux logiques et horloge", cours: true, pret: true },
    { id: "revision-bases", chapitre: 0, titre: "Révision : les bases", revision: true, pret: true },
    { id: "boss-bases", chapitre: 0, titre: "Le registre du capteur", boss: true, pret: true },

    { id: "definition", chapitre: 1, titre: "Système embarqué : la définition", cours: true, pret: true },
    { id: "conception", chapitre: 1, titre: "Concevoir : matériel, modèle, logiciel, exigences", cours: true, pret: true },
    { id: "organisation", chapitre: 1, titre: "Organisation en couches", cours: true, pret: true },
    { id: "semelle", chapitre: 1, titre: "Exemple 1 : la semelle connectée", cours: true, pret: true },
    { id: "tensiometre", chapitre: 1, titre: "Exemple 2 : le tensiomètre", cours: true, pret: true },
    { id: "revision-systeme", chapitre: 1, titre: "Révision : le système embarqué", revision: true, pret: true },
    { id: "boss-systeme", chapitre: 1, titre: "Le pilulier connecté", boss: true, pret: true },

    { id: "controleur", chapitre: 2, titre: "Architecture d'un contrôleur embarqué", cours: true, pret: true },
    { id: "von-neumann-harvard", chapitre: 2, titre: "Von Neumann, Harvard, Super Harvard", cours: true, pret: true },
    { id: "cisc-risc", chapitre: 2, titre: "CISC et RISC", cours: true, pret: true },
    { id: "avr", chapitre: 2, titre: "L'architecture AVR", cours: true, pret: true },
    { id: "arm", chapitre: 2, titre: "ARM : composants et évolution", cours: true, pret: true },
    { id: "arm-interne", chapitre: 2, titre: "Le système ARM et son cœur", cours: true, pret: true },
    { id: "revision-architectures", chapitre: 2, titre: "Révision : les architectures", revision: true, pret: true },
    { id: "boss-architectures", chapitre: 2, titre: "Choisir le cœur d'un holter", boss: true, pret: true },

    { id: "bus", chapitre: 3, titre: "Le problème de communication", cours: true, pret: true },
    { id: "uart", chapitre: 3, titre: "UART : la trame asynchrone", cours: true, pret: true },
    { id: "uart-materiel", chapitre: 3, titre: "UART : émetteur et récepteur", cours: true, pret: true },
    { id: "spi", chapitre: 3, titre: "SPI : l'échange par registres à décalage", cours: true, pret: true },
    { id: "spi-esclaves", chapitre: 3, titre: "SPI : plusieurs esclaves", cours: true, pret: true },
    { id: "i2c", chapitre: 3, titre: "I2C : deux fils partagés", cours: true, pret: true },
    { id: "i2c-trame", chapitre: 3, titre: "I2C : le chronogramme", cours: true, pret: true },
    { id: "revision-bus", chapitre: 3, titre: "Révision : les bus", revision: true, pret: true },
    { id: "boss-bus", chapitre: 3, titre: "Brancher un oxymètre", boss: true, pret: true },

    { id: "esp32", chapitre: 4, titre: "L'ESP32 et sa nomenclature", cours: true, pret: true },
    { id: "devkit", chapitre: 4, titre: "La carte ESP32 DEV KIT V1", cours: true, pret: true },
    { id: "specifications", chapitre: 4, titre: "Blocs et spécifications", cours: true, pret: true },
    { id: "coeurs-memoire", chapitre: 4, titre: "Deux cœurs, DMA et adresses", cours: true, pret: true },
    { id: "alimentation", chapitre: 4, titre: "Domaines d'alimentation", cours: true, pret: true },
    { id: "revision-esp32", chapitre: 4, titre: "Révision : l'ESP32", revision: true, pret: true },
    { id: "boss-esp32", chapitre: 4, titre: "Lire la fiche d'une puce", boss: true, pret: true },

    { id: "gpio", chapitre: 5, titre: "Broches GPIO, IO MUX et matrice", cours: true, pret: true },
    { id: "pad", chapitre: 5, titre: "Structure interne d'un pad", cours: true, pret: true },
    { id: "interruptions", chapitre: 5, titre: "Interruptions : la matrice et les types", cours: true, pret: true },
    { id: "registre-gpio", chapitre: 5, titre: "Le registre GPIO_PINn_REG", cours: true, pret: true },
    { id: "adc", chapitre: 5, titre: "ADC : convertir une tension", cours: true, pret: true },
    { id: "dac", chapitre: 5, titre: "DAC : produire une tension", cours: true, pret: true },
    { id: "timer", chapitre: 5, titre: "Les timers 64 bits", cours: true, pret: true },
    { id: "watchdog", chapitre: 5, titre: "Les chiens de garde (WDT)", cours: true, pret: true },
    { id: "pwm", chapitre: 5, titre: "PWM : la largeur d'impulsion", cours: true, pret: true },
    { id: "bus-esp32", chapitre: 5, titre: "I2C et SPI sur l'ESP32", cours: true, pret: true },
    { id: "revision-peripheriques", chapitre: 5, titre: "Révision : les périphériques", revision: true, pret: true },
    { id: "boss-peripheriques", chapitre: 5, titre: "Le moniteur de perfusion", boss: true, pret: true }
  ],
  cours: [
    { chapitre: 0, id: "binaire", titre: "Bits et binaire" },
    { chapitre: 0, id: "hexadecimal", titre: "Hexadécimal et registres" },
    { chapitre: 0, id: "signaux", titre: "Signaux logiques et horloge" },
    { chapitre: 1, id: "definition", titre: "Système embarqué : définitions" },
    { chapitre: 1, id: "conception", titre: "Exigences de conception (Requirements Design)" },
    { chapitre: 1, id: "organisation", titre: "Organisation d'un système embarqué" },
    { chapitre: 1, id: "semelle", titre: "Exemple 1 : semelle instrumentée et connectée" },
    { chapitre: 1, id: "tensiometre", titre: "Exemple 2 : Blood Pressure Monitor" },
    { chapitre: 2, id: "controleur", titre: "Architecture d'un contrôleur embarqué" },
    { chapitre: 2, id: "von-neumann-harvard", titre: "Von Neumann, Harvard et Super Harvard" },
    { chapitre: 2, id: "cisc-risc", titre: "CISC et RISC" },
    { chapitre: 2, id: "avr", titre: "Architecture AVR et gamme de produits" },
    { chapitre: 2, id: "arm", titre: "Architecture ARM : composants et évolution" },
    { chapitre: 2, id: "arm-interne", titre: "Système ARM (AMBA) et cœur ARM" },
    { chapitre: 3, id: "bus", titre: "Problème de communication MCU, capteurs et actionneurs" },
    { chapitre: 3, id: "uart", titre: "UART : transmission asynchrone" },
    { chapitre: 3, id: "uart-materiel", titre: "UART du PIC18F4520 et UART du PSoC 5" },
    { chapitre: 3, id: "spi", titre: "Le bus SPI" },
    { chapitre: 3, id: "spi-esclaves", titre: "SPI : architecture multi esclaves" },
    { chapitre: 3, id: "i2c", titre: "Le bus I2C" },
    { chapitre: 3, id: "i2c-trame", titre: "Chronogramme I2C" },
    { chapitre: 4, id: "esp32", titre: "ESP32 et nomenclature des puces" },
    { chapitre: 4, id: "devkit", titre: "ESP32 DEV KIT V1 et brochage" },
    { chapitre: 4, id: "specifications", titre: "Architecture en blocs et spécifications" },
    { chapitre: 4, id: "coeurs-memoire", titre: "PRO_CPU et APP_CPU, DMA, plan d'adressage" },
    { chapitre: 4, id: "alimentation", titre: "Power Supply : domaines d'alimentation" },
    { chapitre: 5, id: "gpio", titre: "GPIO Pins, IO MUX et GPIO Matrix" },
    { chapitre: 5, id: "pad", titre: "Structure interne d'un pad" },
    { chapitre: 5, id: "interruptions", titre: "Interrupt Matrix et types d'interruption" },
    { chapitre: 5, id: "registre-gpio", titre: "Registre GPIO_PINn_REG" },
    { chapitre: 5, id: "adc", titre: "ADC (Analog to Digital Converter)" },
    { chapitre: 5, id: "dac", titre: "DAC (Digital to Analog Converter)" },
    { chapitre: 5, id: "timer", titre: "Timers" },
    { chapitre: 5, id: "watchdog", titre: "Watchdog Timers (WDT)" },
    { chapitre: 5, id: "pwm", titre: "PWM (Pulse Width Modulation)" },
    { chapitre: 5, id: "bus-esp32", titre: "Interfaces I2C et SPI de l'ESP32" }
  ]
});
