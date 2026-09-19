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
