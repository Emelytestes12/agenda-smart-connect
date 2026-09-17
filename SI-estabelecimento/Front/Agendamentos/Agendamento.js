document.addEventListener('DOMContentLoaded', () => {
  // Elementos do Modal Drawer
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('drawer');
  const agendamentoForm = document.getElementById('agendamento-form');

  // Elementos da Tabela e Filtros
  const scheduleBody = document.getElementById('schedule-body');
  const searchInput = document.getElementById('search-input');
  const statusFilters = document.querySelectorAll('.filter-status');
  const calendarDays = document.querySelectorAll('.cal-day:not(.empty)');
  const selectedDateDisplay = document.getElementById('selected-date-display');
  const btnToday = document.getElementById('btn-today');

  // Mapeamento de Rótulos e Classes CSS (Atende RF03 e RNF03)
  const statusMap = {
    confirmado: { text: 'Confirmado', class: 'status-confirmado' },
    aguardando: { text: 'Aguardando', class: 'status-aguardando' },
    finalizado: { text: 'Finalizado', class: 'status-finalizado' },
    cancelado: { text: 'Cancelado', class: 'status-cancelado' }
  };

  // 1. ABRIR E FECHAR DRAWER
  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    agendamentoForm.reset();
  }

  btnOpenDrawer.addEventListener('click', openDrawer);
  btnCloseDrawer.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // 2. ALTERAÇÃO MANUAL DE STATUS VIA SELECT
  scheduleBody.addEventListener('change', (e) => {
    if (e.target.classList.contains('status-select')) {
      const selectedValue = e.target.value;
      if (!selectedValue) return;

      const row = e.target.closest('tr');
      const badge = row.querySelector('.status-badge');

      // Atualiza atributo de dados e classe do badge conforme a taxonomia
      row.setAttribute('data-status', selectedValue);
      badge.className = 'status-badge';

      if (statusMap[selectedValue]) {
        badge.classList.add(statusMap[selectedValue].class);
        badge.textContent = statusMap[selectedValue].text;
      }

      e.target.value = "";

      // Atualiza a visibilidade da tabela de acordo com os filtros de tela ativos
      applyFilters();
    }
  });

  // 3. FILTRO COMBINADO (BUSCA POR TEXTO + CHECKBOXES DE STATUS)
  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const activeStatuses = Array.from(statusFilters)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    const rows = scheduleBody.querySelectorAll('tr:not(.date-divider-row)');

    rows.forEach(row => {
      const rowStatus = row.getAttribute('data-status');
      const clientName = row.querySelector('.client-name')?.textContent.toLowerCase() || '';
      const clientPhone = row.querySelector('.client-phone')?.textContent.toLowerCase() || '';

      const matchesStatus = activeStatuses.includes(rowStatus);
      const matchesSearch = clientName.includes(query) || clientPhone.includes(query);

      row.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', applyFilters);
  statusFilters.forEach(checkbox => checkbox.addEventListener('change', applyFilters));

  // 4. CLIQUE NOS DIAS DO MINI CALENDÁRIO
  calendarDays.forEach(day => {
    day.addEventListener('click', () => {
      calendarDays.forEach(d => d.classList.remove('active'));
      day.classList.add('active');

      const selectedDay = day.textContent.padStart(2, '0');
      selectedDateDisplay.textContent = `Visão do Dia: ${selectedDay}/08/2026`;
    });
  });

  btnToday.addEventListener('click', () => {
    calendarDays.forEach(d => d.classList.remove('active'));
    const day26 = Array.from(calendarDays).find(d => d.textContent === '26');
    if (day26) day26.classList.add('active');

    selectedDateDisplay.textContent = `Visão do Dia: 26/08/2026`;
  });

  // 5. SUBMIT DE NOVO AGENDAMENTO
  agendamentoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('input-cliente').value;
    const tel = document.getElementById('input-telefone').value;
    const data = document.getElementById('input-data').value;
    const hora = document.getElementById('input-hora').value;
    const servico = document.getElementById('input-servico').value;
    const dividerRow = document.getElementById('divider-row');

    const tr = document.createElement('tr');
    tr.setAttribute('data-status', 'aguardando');
    tr.setAttribute('data-date', data);

    const isToday = data === '2026-08-26';
    const timeDisplay = isToday 
      ? hora 
      : `${hora} <small class="date-subtext">(${data.split('-').slice(1).reverse().join('/')})</small>`;

    tr.innerHTML = `
      <td class="time-col">${timeDisplay}</td>
      <td>
        <strong class="client-name">${nome}</strong>
        <span class="client-phone">${tel}</span>
      </td>
      <td>
        <span class="badge-profile badge-frequente">Novo Cliente</span>
        <span class="metrics-text">0 Presenças / 0 Faltas</span>
      </td>
      <td>${servico}</td>
      <td><span class="status-badge status-aguardando">Aguardando</span></td>
      <td>
        <select class="status-select">
          <option value="">Mudar Status...</option>
          <option value="confirmado">Confirmado</option>
          <option value="aguardando">Aguardando</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </td>
    `;

    if (isToday) {
      scheduleBody.insertBefore(tr, dividerRow);
    } else {
      scheduleBody.appendChild(tr);
    }

    applyFilters();
    closeDrawer();
  });
});