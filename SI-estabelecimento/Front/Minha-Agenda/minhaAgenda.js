document.addEventListener('DOMContentLoaded', () => {
  // Estado no LocalStorage
  let profissionais = JSON.parse(localStorage.getItem('agenda_profissionais')) || [];
  let servicos = JSON.parse(localStorage.getItem('agenda_servicos')) || [];
  let agendamentos = JSON.parse(localStorage.getItem('agenda_agendamentos')) || [];

  // Controle da Data Ativa
  let dataSelecionada = new Date(2026, 7, 25);
  let mesCalendario = dataSelecionada.getMonth();
  let anoCalendario = dataSelecionada.getFullYear();

  // GERAÇÃO DINÂMICA DAS 24 HORAS CHEIAS (00:00 até 23:00)
  const horarios = [];
  for (let h = 0; h < 24; h++) {
    const hora = String(h).padStart(2, '0');
    horarios.push(`${hora}:00`);
  }

  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const nomesDiasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  // Elementos HTML
  const linhaCabecalhoGrid = document.getElementById('linhaCabecalhoGrid');
  const corpoGrid = document.getElementById('corpoGrid');
  const containerChkProfissionais = document.getElementById('containerChkProfissionais');
  const filtroServico = document.getElementById('filtroServico');
  const selectProfissionalForm = document.getElementById('profissionalSelect');
  const selectServicoForm = document.getElementById('servicoSelect');
  const selectHoraForm = document.getElementById('horaSelect'); // Campo de seleção do horário no formulário
  const tituloDataExibida = document.getElementById('tituloDataExibida');
  const inputDataForm = document.getElementById('dataSelect');

  // Formatação
  const formatarIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const formatarBR = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  function atualizarDataSelecionada(novaData) {
    dataSelecionada = novaData;
    mesCalendario = novaData.getMonth();
    anoCalendario = novaData.getFullYear();

    const diaSemana = nomesDiasSemana[dataSelecionada.getDay()];
    tituloDataExibida.textContent = `${diaSemana}, ${formatarBR(dataSelecionada)}`;
    inputDataForm.value = formatarIso(dataSelecionada);

    renderizarMiniCalendario();
    renderizarGridHorarios();
  }

  // --- POPULAR SELEÇÃO DE HORÁRIOS DO FORMULÁRIO (24h) ---
  function renderizarOpcoesHorario() {
    if (!selectHoraForm) return;
    selectHoraForm.innerHTML = '';
    horarios.forEach(hora => {
      const option = document.createElement('option');
      option.value = hora;
      option.textContent = hora;
      selectHoraForm.appendChild(option);
    });
  }

  // --- RENDERING DO MINI CALENDÁRIO COM DESTAQUE ---
  function renderizarMiniCalendario() {
    document.getElementById('calMesAno').textContent = `${nomesMeses[mesCalendario]} ${anoCalendario}`;
    const calDias = document.getElementById('calDias');
    calDias.innerHTML = '';

    const primeiroDiaSemana = new Date(anoCalendario, mesCalendario, 1).getDay();
    const totalDiasMes = new Date(anoCalendario, mesCalendario + 1, 0).getDate();

    for (let i = 0; i < primeiroDiaSemana; i++) {
      const spanVazio = document.createElement('span');
      spanVazio.className = 'vazio';
      calDias.appendChild(spanVazio);
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const btnDia = document.createElement('button');
      btnDia.textContent = dia;

      const dataIsoDia = `${anoCalendario}-${String(mesCalendario + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

      if (agendamentos.some(item => item.data === dataIsoDia)) {
        btnDia.classList.add('tem-agendamento');
      }

      const eDataSelecionada = (
        dia === dataSelecionada.getDate() &&
        mesCalendario === dataSelecionada.getMonth() &&
        anoCalendario === dataSelecionada.getFullYear()
      );

      if (eDataSelecionada) btnDia.classList.add('ativo');

      btnDia.addEventListener('click', () => {
        atualizarDataSelecionada(new Date(anoCalendario, mesCalendario, dia));
      });

      calDias.appendChild(btnDia);
    }
  }

  document.getElementById('btnPrevMes').addEventListener('click', () => {
    mesCalendario--;
    if (mesCalendario < 0) { mesCalendario = 11; anoCalendario--; }
    renderizarMiniCalendario();
  });

  document.getElementById('btnNextMes').addEventListener('click', () => {
    mesCalendario++;
    if (mesCalendario > 11) { mesCalendario = 0; anoCalendario++; }
    renderizarMiniCalendario();
  });

  document.getElementById('btnHoje').addEventListener('click', () => {
    atualizarDataSelecionada(new Date(2026, 7, 25));
  });

  // --- RENDERING DA GRADE DE DADOS (Horas Cheias) ---
  function renderizarServicos() {
    filtroServico.innerHTML = '<option value="todos">Todos os Serviços</option>';
    selectServicoForm.innerHTML = '';

    servicos.forEach(serv => {
      filtroServico.innerHTML += `<option value="${serv}">${serv}</option>`;
      selectServicoForm.innerHTML += `<option value="${serv}">${serv}</option>`;
    });
  }

  function renderizarProfissionais() {
    linhaCabecalhoGrid.innerHTML = '<th class="col-hora">Horário</th>';
    containerChkProfissionais.innerHTML = '';
    selectProfissionalForm.innerHTML = '';

    if (profissionais.length === 0) {
      containerChkProfissionais.innerHTML = '<span class="texto-vazio">Nenhum profissional cadastrado</span>';
      renderizarGridHorarios();
      return;
    }

    profissionais.forEach(prof => {
      linhaCabecalhoGrid.innerHTML += `<th class="col-prof" data-prof="${prof.nome}">${prof.nome} <br><small style="font-weight:normal; font-size:10px;">(${prof.especialidade})</small></th>`;
      containerChkProfissionais.innerHTML += `<label><input type="checkbox" checked value="${prof.nome}" class="chk-prof"> ${prof.nome}</label>`;
      selectProfissionalForm.innerHTML += `<option value="${prof.nome}">${prof.nome}</option>`;
    });

    document.querySelectorAll('.chk-prof').forEach(chk => chk.addEventListener('change', aplicarFiltros));
    renderizarGridHorarios();
  }

  function renderizarGridHorarios() {
    corpoGrid.innerHTML = '';

    horarios.forEach(hora => {
      const tr = document.createElement('tr');
      let tdHtml = `<td class="col-hora" style="text-align: center; font-size: 11px; color: #666; font-weight: 500;">${hora}</td>`;

      profissionais.forEach(prof => {
        tdHtml += `<td data-prof="${prof.nome}" data-hora="${hora}"></td>`;
      });

      tr.innerHTML = tdHtml;
      corpoGrid.appendChild(tr);
    });

    renderizarAgendamentos();
  }

  function renderizarAgendamentos() {
    const dataIsoAtual = formatarIso(dataSelecionada);
    const agendamentosDoDia = agendamentos.filter(item => item.data === dataIsoAtual);

    agendamentosDoDia.forEach(item => {
      const celula = document.querySelector(`td[data-prof="${item.prof}"][data-hora="${item.hora}"]`);
      if (celula) {
        const card = document.createElement('div');
        card.className = 'card-agendamento';
        card.setAttribute('data-servico', item.servico);

        card.innerHTML = `
          <button class="btn-excluir-card" title="Excluir Horário">&times;</button>
          <span class="titulo-card">${item.servico}</span>
          ${item.obs ? `<span class="sub-tag">${item.obs}</span>` : ''}
        `;

        card.querySelector('.btn-excluir-card').addEventListener('click', () => excluirAgendamento(item.id));
        celula.appendChild(card);
      }
    });

    aplicarFiltros();
  }

  // --- MANIPULAÇÃO DE FORMULÁRIOS ---
  document.getElementById('formAgendamento').addEventListener('submit', (e) => {
    e.preventDefault();

    if (profissionais.length === 0 || servicos.length === 0) {
      alert('Cadastre pelo menos um Profissional e um Serviço primeiro!');
      return;
    }

    const dataInput = document.getElementById('dataSelect').value;
    const novoItem = {
      id: Date.now(),
      data: dataInput,
      hora: selectHoraForm.value,
      prof: document.getElementById('profissionalSelect').value,
      servico: document.getElementById('servicoSelect').value,
      obs: document.getElementById('observacao').value
    };

    agendamentos.push(novoItem);
    localStorage.setItem('agenda_agendamentos', JSON.stringify(agendamentos));

    const [y, m, d] = dataInput.split('-').map(Number);
    atualizarDataSelecionada(new Date(y, m - 1, d));

    document.getElementById('formAgendamento').reset();
    fecharPainel('painelAgendamento');
  });

  document.getElementById('formProfissional').addEventListener('submit', (e) => {
    e.preventDefault();
    profissionais.push({
      nome: document.getElementById('nomeProfissional').value,
      especialidade: document.getElementById('especialidadeProfissional').value
    });
    localStorage.setItem('agenda_profissionais', JSON.stringify(profissionais));
    renderizarProfissionais();
    document.getElementById('formProfissional').reset();
    fecharPainel('painelProfissional');
  });

  document.getElementById('formServico').addEventListener('submit', (e) => {
    e.preventDefault();
    servicos.push(document.getElementById('nomeServico').value);
    localStorage.setItem('agenda_servicos', JSON.stringify(servicos));
    renderizarServicos();
    document.getElementById('formServico').reset();
    fecharPainel('painelServico');
  });

  function excluirAgendamento(id) {
    agendamentos = agendamentos.filter(item => item.id !== id);
    localStorage.setItem('agenda_agendamentos', JSON.stringify(agendamentos));
    renderizarGridHorarios();
    renderizarMiniCalendario();
  }

  function aplicarFiltros() {
    const servicoSelecionado = filtroServico.value;

    document.querySelectorAll('.card-agendamento').forEach(card => {
      const bateServico = (servicoSelecionado === 'todos' || card.getAttribute('data-servico') === servicoSelecionado);
      card.classList.toggle('escondido', !bateServico);
    });

    document.querySelectorAll('.chk-prof').forEach(chk => {
      const profNome = chk.value;
      const visivel = chk.checked;

      const thProf = document.querySelector(`th[data-prof="${profNome}"]`);
      if (thProf) thProf.style.display = visivel ? '' : 'none';

      document.querySelectorAll(`td[data-prof="${profNome}"]`).forEach(td => {
        td.style.display = visivel ? '' : 'none';
      });
    });
  }

  // Controles dos Painéis
  const abrirPainel = (id) => document.getElementById(id).classList.add('aberto');
  const fecharPainel = (id) => document.getElementById(id).classList.remove('aberto');

  document.getElementById('btnNovoAgendamento').addEventListener('click', () => abrirPainel('painelAgendamento'));
  document.getElementById('btnNovoProfissional').addEventListener('click', () => abrirPainel('painelProfissional'));
  document.getElementById('btnNovoServico').addEventListener('click', () => abrirPainel('painelServico'));
  document.querySelectorAll('.btn-fechar').forEach(btn => {
    btn.addEventListener('click', (e) => fecharPainel(e.target.getAttribute('data-fechar')));
  });

  filtroServico.addEventListener('change', aplicarFiltros);

  // Inicialização
  renderizarOpcoesHorario();
  renderizarServicos();
  renderizarProfissionais();
  atualizarDataSelecionada(dataSelecionada);
});