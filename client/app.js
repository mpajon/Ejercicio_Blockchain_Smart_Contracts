App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.cargarCuenta();
    await App.cargarContrato();
    await App.mostrar();
    await App.mostrarTareas();
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }
  },
  cargarCuenta: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },
  cargarContrato: async () => {
    try {
      const res = await fetch("ContratoTareas.json");
      const tareasContratoJSON = await res.json();
      App.contracts.TareasContrato = TruffleContract(tareasContratoJSON);
      App.contracts.TareasContrato.setProvider(App.web3Provider);

      App.TareasContrato = await App.contracts.TareasContrato.deployed();
    } catch (error) {
      console.error(error);
    }
  },
  mostrar: async () => {
    document.getElementById("account").innerText = App.account;
  },
  mostrarTareas: async () => {
    const contadorTareas = await App.TareasContrato.contadorTareas();
    const contadorTareasNumero = contadorTareas.toNumber();

    let html = "";

    for (let i = 1; i <= contadorTareasNumero; i++) {
      const tarea = await App.TareasContrato.tareas(i);
      const tareaId = tarea[0].toNumber();
      const tareaTitulo = tarea[1];
      const tareaDescripcion = tarea[2];
      const tareaEstado = tarea[3];
      const tareaFechaCreacion = tarea[4];

      // Crear una tarea
      let nuevaTarea = `<div class="card bg-dark rounded-0 mb-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>${tareaTitulo}</span>
          <div class="form-check form-switch">
            <input class="form-check-input" data-id="${tareaId}" type="checkbox" onchange="App.cambiarEstadoTarea(this)" ${
              tareaEstado === true && "checked"
            }>
          </div>
        </div>
        <div class="card-body">
          <span>${tareaDescripcion}</span>
          <p class="text-muted">La tarea se creó el ${new Date(
            tareaFechaCreacion * 1000
          ).toLocaleString()}</p>
          </label>
        </div>
      </div>`;
      html += nuevaTarea;
    }

    document.querySelector("#listaTareas").innerHTML = html;
  },
  crearTarea: async (titulo, descripcion) => {
    try {
      const result = await App.TareasContrato.crearTarea(titulo, descripcion, {
        from: App.account,
      });
      console.log(result.logs[0].args);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },
  cambiarEstadoTarea: async (element) => {
    const tareaId = element.dataset.id;
    await App.TareasContrato.cambiarEstadoTarea(tareaId, {
      from: App.account,
    });
    window.location.reload();
  },
};
