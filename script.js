/* Questa è la lista di tutti i clienti */


const clienti = [
 
];

/* Questa è la lista di tutti i servizi disponibili */
const servizi = [
  {
    id: 1,
    nome: "Servizio A",
    prezzo: 100,
    durata: 30,
  },

  {
    id: 2,
    nome: "Servizio B",
    prezzo: 150,
    durata: 45,
  }
];

/* Questa è la lista di tutti gli appuntamenti */
const appuntamenti = [

];

/* Questa funzione trova un cliente per ID */
function trovaClientePerId(id) {
    return clienti.find(function(cliente) {
        return cliente.id === id;
    });
}

/* Questa funzione trova un servizio per ID */
function trovaServizioPerId(id) {
    return servizi.find(function(servizio) {
        return servizio.id === id;
    });
}

/* Questa funzione genera un ID unico per un nuovo appuntamento */
function generaIdUnico(array) {
    if (array.length === 0) {
        return 1;
    }
    return Math.max(...array.map(function(a) { return a.id; })) + 1;
}


/* Questa funzione crea un nuovo appuntamento e lo aggiunge all'array degli appuntamenti */
function creaAppuntamento(clienteId, servizioId, giorno) {
  if (esisteConflitto({ clienteId, servizioId, giorno })) {
    console.log("Errore: Conflitto di orario con un appuntamento esistente.");
    return null;
  }
    const nuovoAppuntamento = {
        id: generaIdUnico(appuntamenti),
        clienteId: clienteId,
        servizioId: servizioId,
        giorno: giorno,
    };
    appuntamenti.push(nuovoAppuntamento);
    console.log(`Appuntamento creato: ${descriviAppuntamento(nuovoAppuntamento)}`);
    return nuovoAppuntamento;
}


/* Questa funzione descrive un appuntamento in modo leggibile */
function descriviAppuntamento(appuntamento) {
    const cliente = trovaClientePerId(appuntamento.clienteId);
    const servizio = trovaServizioPerId(appuntamento.servizioId);

        return `Appuntamento per ${cliente.nome}: (${cliente.telefono}), ${servizio.nome} - ${appuntamento.giorno}`;
    }


/* Questa funzione verifica se esiste un conflitto di orario con un appuntamento esistente */
function ceConflitto(inizio1, fine1, inizio2, fine2) {
    if (fine1 <= inizio2 || fine2 <= inizio1) {
        return false;
    }
    else {
        return true;
    }
}

/* Questa funzione calcola l'intervallo di tempo di un appuntamento in millisecondi */
function calcolaIntervallo(appuntamento) {
    const servizio = trovaServizioPerId(appuntamento.servizioId);
    const inizio = new Date(appuntamento.giorno).getTime();
    const fine = inizio + servizio.durata * 60000; // Converti minuti in millisecondi
    return { inizio, fine };
}


/* Questa funzione verifica se esiste un conflitto di orario con un appuntamento esistente */
function esisteConflitto(nuovoAppuntamento) {
  const nuovoIntervallo = calcolaIntervallo(nuovoAppuntamento);
  const nuovoConflitto = appuntamenti.some(function(appuntamento) {
    const intervalloEsistente = calcolaIntervallo(appuntamento);
    return ceConflitto(nuovoIntervallo.inizio, nuovoIntervallo.fine, intervalloEsistente.inizio, intervalloEsistente.fine);
  });
  return nuovoConflitto;
}


const contenitoreClienti = document.getElementById("lista-clienti");
//const contenitoreAppuntamenti = document.getElementById("lista-appuntamenti");

/* Questa funzione renderizza la lista dei clienti */
function renderClienti() {
  contenitoreClienti.innerHTML = "";
  clienti.forEach(function(cliente) {
    const divCliente = document.createElement("div");
    divCliente.textContent = `Cliente: ${cliente.nome}, Telefono: ${cliente.telefono}`;
    contenitoreClienti.appendChild(divCliente);
    divCliente.className = "p-2 m-2 border rounded bg-gray-100";

})
};

/* Questa funzione renderizza la lista degli appuntamenti */
/* function renderAppuntamenti() {
  contenitoreAppuntamenti.innerHTML = "";
  appuntamenti.forEach(function(appuntamento) {
    const divAppuntamento = document.createElement("div");
    divAppuntamento.textContent = descriviAppuntamento(appuntamento);
    contenitoreAppuntamenti.appendChild(divAppuntamento);
    divAppuntamento.className = "p-2 m-2 border rounded bg-blue-100";

});
}*/

/* Questa funzione trova un cliente per numero di telefono */
function trovaClientePerTelefono(telefono) {
    return clienti.find(function(cliente) {
        return cliente.telefono === telefono;
    });
}


/* Questa funzione trova un cliente per nome e numero di telefono, o lo crea se non esiste */
function trovaOCreaCliente (nome, telefono) {
  const clienteEsistente = trovaClientePerTelefono(telefono)
  
    if (clienteEsistente !== undefined) {
      return clienteEsistente
    }
    else {
      const nuovoCliente = {
        id: generaIdUnico(clienti),
        nome: nome,
        telefono: telefono
      }
      clienti.push(nuovoCliente)
      return nuovoCliente
    }
  }

  /* Aggiunge un evento al bottone per creare un nuovo appuntamento */
const bottone = document.getElementById("btn-crea")
bottone.addEventListener("click", function(){
  const giorno = document.getElementById("input-giorno").value
  const servizioId = Number(document.getElementById("select-servizio").value)
  
    if (esisteConflitto({servizioId, giorno})) {
      apriModal("Errore: Conflitto di orario!")
      console.log("Errore: Conflitto di orario!")
      return null
      
    }
    else {
      
      const nome = (document.getElementById("input-nome-cliente").value)
      const telefono = (document.getElementById("input-numero-telefono").value)
      const cliente = trovaOCreaCliente(nome, telefono);
      const appuntamento = creaAppuntamento(cliente.id, servizioId, giorno);
      apriModal(`Appuntamento creato: ${descriviAppuntamento(appuntamento)}`)
    }
  //renderAppuntamenti();
  renderGriglia();
});

/* Questa funzione genera gli slot orari dalle 9:00 alle 20:00 con intervalli di 30 minuti */
function generaSlotOrari() {
  const slot = []
  for (let minuti = 540; minuti < 1200; minuti += 30) {
    const ore = Math.floor(minuti/60)
    const min = minuti % 60
    slot.push(`${String(ore).padStart(2, "0")}:${String(min).padStart(2, "0")}`)
  }
  return slot;
}

//renderAppuntamenti();

/* Questa funzione verifica se uno slot è occupato da un appuntamento esistente */
function slotOccupato(giorno, orario) {
  const inizioSlot = new Date(`${giorno}T${orario}`).getTime();
  const fineSlot = inizioSlot + 30 * 60000;
  const nIntervallo = appuntamenti.some(function(appuntamento) {
    const intervalloAppEs = calcolaIntervallo(appuntamento)
    return ceConflitto(inizioSlot, fineSlot, intervalloAppEs.inizio, intervalloAppEs.fine);
  })
  return nIntervallo;  
  
};

/* Questa funzione renderizza la lista dei servizi disponibili */
function renderServizi() {
  const lista = document.getElementById("lista-servizi")
  lista.innerHTML = "" 

  for (let s of servizi) {
    const nuovoDiv = document.createElement('div')
    nuovoDiv.textContent = `${s.nome} - ${s.prezzo}`
    lista.appendChild(nuovoDiv)
  }
};

/* Questa funzione trova un appuntamento per ID */
function trovaAppuntamentoPerId(id) {
  return appuntamenti.find(function(appuntamento) {
    return appuntamento.id === id
  })
  
}

let giornoSelezionato;
if (appuntamenti.length > 0) {
  giornoSelezionato = appuntamenti[0].giorno.split("T")[0]
}
else {
  giornoSelezionato = new Date().toISOString().split("T")[0]
}

/* Questa funzione renderizza la griglia degli orari per il giorno selezionato */
function renderGriglia() {
  const grigliaOrari = document.getElementById("griglia-orari")
  grigliaOrari.innerHTML = ""
  
  for (let s of generaSlotOrari()) {
    const divGriglia = document.createElement('div')
    const appTrovato = trovaAppuntamentoAllo(giornoSelezionato, s)
    const divOrario = document.createElement('div')
    divOrario.textContent = s
    const divContenuto = document.createElement('div')
    divContenuto.textContent = ""
    divGriglia.appendChild(divOrario)
    divGriglia.appendChild(divContenuto)

      if (appTrovato) {
          divContenuto.textContent = `Cliente: ${trovaClientePerId(appTrovato.clienteId).nome}, Servizio: ${trovaServizioPerId(appTrovato.servizioId).nome}`
        }
        else {
          divContenuto.textContent = "Slot libero!"
          divContenuto.className = "text-bold"
        }

    divGriglia.addEventListener("click", function(){

      if (appTrovato) {
        apriModal(descriviAppuntamento(appTrovato))
      }
      else {
        apriModal("Slot libero!")
      }
    })

    if (appTrovato) {
      divGriglia.className = "p-2 m-1 border rounded bg-bordeaux/30 hover:bg-bordeaux/70 hover:text-white transition duration-200 cursor-pointer flex justify-between"
      divOrario.className = "font-bold text-lg"
    }
    else {
      divGriglia.className = "p-2 m-1 border rounded bg-emerald-200 hover:bg-emerald-500 transition duration-200 cursor-pointer flex justify-between"
      divOrario.className = "font-bold text-lg"
    }
    grigliaOrari.appendChild(divGriglia)
  }
}

/* Questa funzione trova un appuntamento per giorno e orario */
function trovaAppuntamentoAllo(giorno, orario) {
  const inizioApp = new Date(`${giorno}T${orario}`).getTime();
  const fineApp = inizioApp + 30 * 60000;
  const appTrovato = appuntamenti.find(function(appuntamento) {
    const intervalloNuovo = calcolaIntervallo(appuntamento)
    return ceConflitto(inizioApp, fineApp, intervalloNuovo.inizio, intervalloNuovo.fine);
  })
  return appTrovato;

}

const selettoreGiorno = document.getElementById("selettore-giorno")

/* Aggiunge un evento al selettore per visualizzare gli appuntamenti di un giorno specifico */
selettoreGiorno.addEventListener("change", function(){
  giornoSelezionato = selettoreGiorno.value;
renderGriglia();
})

const modalOverlay = document.getElementById("modal-overlay")
const modalContenuto = document.getElementById("modal-contenuto")

function apriModal(testo) {
  const modalTesto = document.getElementById("modal-testo")
  modalTesto.textContent = testo
  modalOverlay.classList.remove("opacity-0", "pointer-events-none")
}

function chiudiModal() {
  modalOverlay.classList.add("opacity-0", "pointer-events-none")
}

const btnChiudiModal = document.getElementById("btn-chiudi-modal")
btnChiudiModal.addEventListener("click", function(){
  chiudiModal()
})

renderGriglia();