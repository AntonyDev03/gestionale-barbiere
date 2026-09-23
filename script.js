/* Questa è la lista di tutti i clienti */


const clienti = [
 
];

/* Questa è la lista di tutti i servizi disponibili */
const servizi = [
  {
    id: 1,
    nome: "Taglio",
    prezzo: 10,
    durata: 30,
  },

  {
    id: 2,
    nome: "Barba",
    prezzo: 8,
    durata: 15,
  },

  {
    id: 3,
    nome: "Tinta",
    prezzo: 50,
    durata: 60,
  },


  {
    id: 5,
    nome: "Piega",
    prezzo: 30,
    durata: 120,
  }
];

/* Questa è la lista di tutti gli appuntamenti */
const appuntamenti = [

];


const DURATA_SLOT_MINUTI = 15;












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
function creaAppuntamento(clienteId, servizioIds, giorno) {
  if (esisteConflitto({ clienteId, servizioIds, giorno })) {
    console.log("Errore: Conflitto di orario con un appuntamento esistente.");
    return null;
  }
    const nuovoAppuntamento = {
        id: generaIdUnico(appuntamenti),
        clienteId: clienteId,
        servizioIds: servizioIds,
        giorno: giorno,
    };
    appuntamenti.push(nuovoAppuntamento);
    salvaDati();
    console.log(`Appuntamento creato: ${descriviAppuntamento(nuovoAppuntamento)}`);
    return nuovoAppuntamento;
}


/* Questa funzione descrive un appuntamento in modo leggibile */
function descriviAppuntamento(appuntamento) {
  const nomiServizi = appuntamento.servizioIds.map(function(servizioId) {
    const nomeServizio = trovaServizioPerId(servizioId)
    return nomeServizio.nome

  })

  const listaServizi = nomiServizi.join(", ")
  let prezzoTotale = 0
  appuntamento.servizioIds.forEach(function(servizioId) {
    const prezzoSingolo = trovaServizioPerId(servizioId)
    prezzoTotale += prezzoSingolo.prezzo
  })

    const cliente = trovaClientePerId(appuntamento.clienteId);

        return `<p>Appuntamento per: <span class="font-semibold text-bordeaux">${cliente.nome}</span></p><p>Telefono: ${cliente.telefono}</p><p>Servizio: ${listaServizi} - €${prezzoTotale}</p><p>Giorno e Orario: ${appuntamento.giorno}</p>`;
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
    let durataTotale = 0
    appuntamento.servizioIds.forEach(function(servizioId) {
        const servizioN = trovaServizioPerId(servizioId)
        durataTotale += servizioN.durata 
    })

    const inizio = new Date(appuntamento.giorno).getTime();
    const fine = inizio + durataTotale * 60000;
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
      salvaDati();
      return nuovoCliente
      
    }
  }

  /* Aggiunge un evento al bottone per creare un nuovo appuntamento */
const bottone = document.getElementById("btn-crea")
bottone.addEventListener("click", function(){
  const giorno = document.getElementById("input-giorno").value
  if (giorno === "") {
  apriModal("Seleziona data e ora dell'appuntamento!")
  return null
  }
  const checkboxSelezionate = document.querySelectorAll("#checkbox-servizi input[type='checkbox']:checked")
  const servizioIds = Array.from(checkboxSelezionate).map(function(checkbox) {
    return Number(checkbox.value)
  })
  if (servizioIds.length === 0) {
    apriModal("Seleziona almeno un servizio!")
    return null
  }
  
    if (esisteConflitto({servizioIds, giorno})) {
      apriModal("Errore: Conflitto di orario!")
      console.log("Errore: Conflitto di orario!")
      return null
      
    }
    else {
      
      const nome = (document.getElementById("input-nome-cliente").value)
      const telefono = (document.getElementById("input-numero-telefono").value)
      const cliente = trovaOCreaCliente(nome, telefono);
      const appuntamento = creaAppuntamento(cliente.id, servizioIds, giorno);
      apriModal(`Appuntamento creato: ${descriviAppuntamento(appuntamento)}`)
      renderProssimoAppuntamento();
      
      //contatoreClienti();
    }
  //renderAppuntamenti();
  renderGriglia();
  renderAppuntamentiOggi();
  renderRubrica(clienti);
});


function oggiLocale() {
  const d = new Date();
  const anno = d.getFullYear();
  const mese = String(d.getMonth() + 1).padStart(2, "0");
  const giorno = String(d.getDate()).padStart(2, "0");
  return `${anno}-${mese}-${giorno}`;
}

/* Questa funzione genera gli slot orari dalle 9:00 alle 20:00 con intervalli di 30 minuti */
function generaSlotOrari() {
  const slot = []
  for (let minuti = 540; minuti < 1200; minuti += DURATA_SLOT_MINUTI) {
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
  const fineSlot = inizioSlot + DURATA_SLOT_MINUTI * 60000;
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
  giornoSelezionato = oggiLocale()
}

caricaDati();

let appuntamentoAperto = null;
let clienteSelezionato = null
/* Questa funzione renderizza la griglia degli orari per il giorno selezionato */
function renderGriglia() {
  const grigliaOrari = document.getElementById("griglia-orari")
  grigliaOrari.innerHTML = ""
  let ultimoAppuntamentoId = null;
  
  for (let s of generaSlotOrari()) {
    const divGriglia = document.createElement('div')
    const appTrovato = trovaAppuntamentoAllo(giornoSelezionato, s)
    const divOrario = document.createElement('div')
    divOrario.textContent = s
    const divContenuto = document.createElement('div')
    divContenuto.textContent = ""
    divGriglia.appendChild(divOrario)
    divGriglia.appendChild(divContenuto)
    divContenuto.className = "leading-relaxed gap-2" 

      if (appTrovato) {
        if (appTrovato.id === ultimoAppuntamentoId) {
          divContenuto.textContent = `${trovaClientePerId(appTrovato.clienteId).nome}`
          divContenuto.className = "text-bold"
          const fineTimestamp = calcolaIntervallo(appTrovato).fine
          const dataFine = new Date(fineTimestamp)
          const oreFine = String(dataFine.getHours()).padStart(2, "0")
          const minutiFine = String(dataFine.getMinutes()).padStart(2, "0")
          divContenuto.textContent += ` - Fine: ${oreFine}:${minutiFine}`
        }
        else {
          ultimoAppuntamentoId = appTrovato.id;
          const nomiServizi = appTrovato.servizioIds.map(function(servizioId) {
          const nomeServizio = trovaServizioPerId(servizioId)
          return nomeServizio.nome
        })
          divContenuto.innerHTML = `Cliente: ${trovaClientePerId(appTrovato.clienteId).nome}, Servizio: ${nomiServizi.join(", ")}`
        }
        
        }
      else {
          divContenuto.textContent = "Slot libero!"
          divContenuto.className = "text-bold"
      }

    divGriglia.addEventListener("click", function(){

      if (appTrovato) {
        appuntamentoAperto = appTrovato
        apriModal(descriviAppuntamento(appTrovato))
      }
      else {
        appuntamentoAperto = null;
        apriModal("Slot libero!")        
      }
    })

    if (appTrovato) {
      divGriglia.className = "p-2 m-1 border rounded bg-bordeaux/30 hover:bg-bordeaux/70 hover:text-white transition duration-200 cursor-pointer flex justify-between"
      divOrario.className = "font-bold text-lg w-16 flex-shrink-0"
    }
    else {
      divGriglia.className = "p-2 m-1 border rounded bg-emerald-200 hover:bg-emerald-500 transition duration-200 cursor-pointer flex justify-between"
      divOrario.className = "font-bold text-lg w-16 flex-shrink-0"
    }
    grigliaOrari.appendChild(divGriglia)
  }
}

/* Questa funzione trova un appuntamento per giorno e orario */
function trovaAppuntamentoAllo(giorno, orario) {
  const inizioApp = new Date(`${giorno}T${orario}`).getTime();
  const fineApp = inizioApp + DURATA_SLOT_MINUTI * 60000;
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

const btnEliminaModal = document.getElementById("btn-elimina-modal")
btnEliminaModal.addEventListener("click", function() {
  if (appuntamentoAperto) {
    cancellaAppuntamento(appuntamentoAperto.id)
    btnEliminaModal.classList.add("hidden")
    chiudiModal()
    
  }
  
})

function apriModal(testo) {
  const modalTesto = document.getElementById("modal-testo")
  modalOverlay.classList.remove("opacity-0", "pointer-events-none")
  if (appuntamentoAperto) {
    btnEliminaModal.classList.remove("hidden")
    modalTesto.innerHTML = `<div class="flex items-start gap-2 text-left"><i class="ti ti-user text-stone-500 mt-1"></i><div class="space-y-1">${testo}</div></div>`;
  }
  else {
    btnEliminaModal.classList.add("hidden")
    modalTesto.innerHTML = testo;
  }
}

function chiudiModal() {
  modalOverlay.classList.add("opacity-0", "pointer-events-none")
}

const btnChiudiModal = document.getElementById("btn-chiudi-modal")
btnChiudiModal.addEventListener("click", function(){
  chiudiModal()
})

function cancellaAppuntamento(id) {
  const index = appuntamenti.findIndex(function(appuntamento) {
    return appuntamento.id === id
  })
  if (index !== -1) {
    appuntamenti.splice(index, 1)
    salvaDati();
  }
  renderGriglia();
  renderProssimoAppuntamento();
  renderAppuntamentiOggi();
}

function trovaProssimoAppuntamento() {
  const oggi = new Date().getTime();
  const futuri = appuntamenti.filter(function(appuntamento) {
   return calcolaIntervallo(appuntamento).inizio > oggi
  })
  futuri.sort(function(a, b) {
    return calcolaIntervallo(a).inizio - calcolaIntervallo(b).inizio
  })
  return futuri[0]
}



function renderProssimoAppuntamento() {
  const contenitore = document.getElementById("prossimo-appuntamento")
  const prossimo = trovaProssimoAppuntamento()

  if (prossimo) {
    const orario = prossimo.giorno.split("T")[1]
    const cliente = trovaClientePerId(prossimo.clienteId)
    
    const nomiServizi = prossimo.servizioIds.map(function(servizioId) {
      const nomeServizio = trovaServizioPerId(servizioId)
      return nomeServizio.nome
    })

    contenitore.innerHTML = `<i class="ti ti-clock text-bordeaux"></i> Prossimo: ${orario} — ${cliente.nome} (${nomiServizi.join(", ")})`
  }
  else {
    contenitore.innerHTML = `<i class="ti ti-calendar-off text-stone-400"></i> Nessun appuntamento in programma`
  }
}

/*function contatoreClienti() {
  let contatore = document.getElementById("contatore-clienti")
  let numeroClienti = clienti.length
  contatore.innerHTML = numeroClienti
}

contatoreClienti();*/

function salvaDati() {
  localStorage.setItem("clienti", JSON.stringify(clienti))
  localStorage.setItem("appuntamenti", JSON.stringify(appuntamenti))
}

function caricaDati() {

  try {
      const clientiSalvati = JSON.parse(localStorage.getItem("clienti"))
      clienti.splice(0, clienti.length)
      clientiSalvati.forEach(function(cliente) {
      clienti.push(cliente)
    })

      const appSalvati = JSON.parse(localStorage.getItem("appuntamenti"))
      appuntamenti.splice(0, appuntamenti.length)
      appSalvati.forEach(function(appuntamento) {
        appuntamenti.push(appuntamento)
    })
  }
  catch {
    console.log("Nessun dato salvato trovato, si parte da zero.")
  }
  
}

function renderSelectServizi(idSelect) {
  const selectServizio = document.getElementById(idSelect)
  servizi.forEach(function(servizio) {
    const opzione = document.createElement("option")
    opzione.value = servizio.id
    opzione.textContent = `${servizio.nome}: €${servizio.prezzo}`
    selectServizio.appendChild(opzione)
  })
}

function renderRubrica(listaClienti) {
  const rubricaClienti = document.getElementById("rubrica-clienti")
  rubricaClienti.innerHTML = ""
  clienti.sort(function(a, b) {
    return a.nome.localeCompare(b.nome)
  })
  listaClienti.forEach(function(cliente) {
    const divCliente = document.createElement("div")
    divCliente.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="ti ti-user text-stone-500"></i>
        <div>
          <div class="font-medium">${cliente.nome}</div>
          <div class="text-xs text-stone-500"><i class="ti ti-phone"></i> ${cliente.telefono}</div>
        </div>
      </div>
    `
    divCliente.className = "flex justify-between items-center py-2 border-b border-stone-200"
    rubricaClienti.appendChild(divCliente)

    const btnApriContatto = document.createElement("button")
    btnApriContatto.innerHTML = `<i class="ti ti-calendar-plus"></i>`
    btnApriContatto.classList.add("border", "p-2", "rounded-md", "hover:bg-stone-500", "transition", "duration-200")
    divCliente.appendChild(btnApriContatto)
    btnApriContatto.addEventListener("click", function(){
      clienteSelezionato = cliente
      apriNuovoModal();
    })
  })
}

function apriNuovoModal() {
  const mNuovoNome = document.getElementById("modal-nuovo-nome")
  const mNuovoOverlay = document.getElementById("modal-nuovo-overlay")
  mNuovoNome.innerHTML = `Nuovo Appuntamento per: ${clienteSelezionato.nome}`
  mNuovoOverlay.classList.remove("opacity-0", "pointer-events-none")
}

const btnCreaNuovo = document.getElementById("btn-crea-nuovo")
btnCreaNuovo.addEventListener("click", function() {
  const giorno = document.getElementById("modal-nuovo-giorno").value
  if (giorno === "") {
  apriModal("Seleziona data e ora dell'appuntamento!")
  return null
  }
  const checkSelezionate = document.querySelectorAll("#checkbox-servizi-modal input[type='checkbox']:checked")
  const servizioIds = Array.from(checkSelezionate).map(function(checkbox) {
    return Number(checkbox.value)
  })
  if (servizioIds.length === 0) {
    apriModal("Seleziona almeno un servizio!")
    return null
  }
  
  if (esisteConflitto({servizioIds, giorno})) {
  apriModal("Errore: Conflitto di orario")
  return null
}
else {
  
  const appModalNuovo = creaAppuntamento(clienteSelezionato.id, servizioIds, giorno)
  
  apriModal(`Appuntamento creato: ${descriviAppuntamento(appModalNuovo)}`)
  renderGriglia();
  renderProssimoAppuntamento();
  const mNuovoOverlay = document.getElementById("modal-nuovo-overlay")
  mNuovoOverlay.addEventListener("click", function() {})
  mNuovoOverlay.classList.add("opacity-0", "pointer-events-none")
}
renderAppuntamentiOggi();
})


const btnChiudiModalNuovo = document.getElementById("btn-chiudi-modal-nuovo")
btnChiudiModalNuovo.addEventListener("click", function(){
  const mNuovoOverlay = document.getElementById("modal-nuovo-overlay")
  mNuovoOverlay.classList.add("opacity-0", "pointer-events-none")
})


function renderAppuntamentiOggi() {
  const oggi = oggiLocale()
  const appuntamentiOggi = appuntamenti.filter(function(appuntamento) {
    return appuntamento.giorno.split("T")[0] === oggi
  })
  const appGrigliaOggi = document.getElementById("appuntamenti-oggi")
  appGrigliaOggi.innerHTML = ""
  appuntamentiOggi.forEach(function(appuntamento) {
    const clienteTrovato = trovaClientePerId(appuntamento.clienteId)
    const divApp = document.createElement("div")
    divApp.className = "flex justify-between items-center py-2 border-b border-stone-200"
    divApp.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="ti ti-user text-stone-500"></i>
        <div>
          <div class="font-medium">${clienteTrovato.nome}</div>
          <div class="text-xs text-stone-500"><i class="ti ti-phone"></i> ${appuntamento.giorno.split("T")[1]}</div>
        </div>
      </div>
    `
    appGrigliaOggi.appendChild(divApp)
    const btnElimina = document.createElement("button")
    btnElimina.innerHTML = `<i class="ti ti-trash"></i>`
    btnElimina.classList.add("border", "p-2", "rounded-md", "hover:bg-red-500", "transition", "duration-200")
    btnElimina.addEventListener("click", function() {
      cancellaAppuntamento(appuntamento.id);
      
      
    })
    divApp.appendChild(btnElimina);
  })
}


const inputRicerca = document.getElementById("input-ricerca-rubrica")
inputRicerca.addEventListener("input", function() {
  const testoCercato = inputRicerca.value
  const risultati = clienti.filter(function(cliente) {
    return cliente.nome.toLowerCase().includes(testoCercato.toLowerCase())
  })
  renderRubrica(risultati);
})

function renderCheckboxServizi (idContenitore) {
  const contenitore = document.getElementById(idContenitore)
  contenitore.innerHTML = ""
  servizi.forEach(function(servizio) {
    const divCheckbox = document.createElement("div")
    divCheckbox.innerHTML = `<label class="flex items-center gap-2 whitespace-nowrap cursor-pointer">
    <input type="checkbox" value="${servizio.id}" class="peer hidden">
    <span class="w-5 h-5 rounded-full border-2 border-stone-400 peer-checked:bg-bordeaux peer-checked:border-bordeaux transition-colors duration-300"></span>
    ${servizio.nome}: €${servizio.prezzo}
    </label>`
    contenitore.appendChild(divCheckbox)
  })
}



renderCheckboxServizi("checkbox-servizi");
renderCheckboxServizi("checkbox-servizi-modal");
renderAppuntamentiOggi()
renderRubrica(clienti);
renderProssimoAppuntamento();
renderGriglia();



