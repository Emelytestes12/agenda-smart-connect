document.addEventListener('DOMContentLoaded', () => {
  // Elementos da Interface
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('drawer');
  const queueForm = document.getElementById('queue-form');

  const queueBody = document.getElementById('queue-body');
  const searchInput = document.getElementById('search-input');
  const filterService = document.getElementById('filter-service');
  const totalQueueCount = document.getElementById('total-queue-count');

  // Controladores do Drawer
  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    queueForm.reset();
  }

  btnOpenDrawer.addEventListener('click', openDrawer);
  btnCloseDrawer.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Recalcular posições da fila (1º, 2º, 3º...)
  function updatePositions() {
    const rows = queueBody.querySelectorAll('tr');
    let positionCount = 0;

    rows.forEach((row) => {
      if (row.style.display !== 'none') {
        positionCount++;
        const posBadge = row.querySelector('.pos-badge');
        if (posBadge) {
          posBadge.textContent = `${positionCount}º`;

          if (positionCount === 1) {
            posBadge.classList.add('pos-next');
          } else {
            posBadge.classList.remove('pos-next');
          }
        }
      }
    });

    totalQueueCount.textContent = positionCount;
  }

  // Ações da Tabela (Encaixar, Notificar Zap, Reenviar Zap, Remover)
  queueBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    const clientName = row.querySelector('.client-name').textContent;

    if (e.target.classList.contains('btn-fit')) {
      alert(`Cliente ${clientName} encaixado(a) na agenda principal com sucesso!`);
      row.remove();
      updatePositions();
    } else if (e.target.classList.contains('btn-notify') || e.target.classList.contains('btn-resend')) {
      alert(`Mensagem WhatsApp reenviada para ${clientName}!`);
      const statusBadge = row.querySelector('.status-badge');
      if (statusBadge) {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        statusBadge.className = 'status-badge status-disparado';
        statusBadge.textContent = `📱 Zap Disparado (${now})`;
      }
    } else if (e.target.classList.contains('btn-remove')) {
      row.remove();
      updatePositions();
    }
  });

  // Filtros de busca
  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const serviceFilter = filterService.value;
    const rows = queueBody.querySelectorAll('tr');

    rows.forEach((row) => {
      const clientName = row.querySelector('.client-name').textContent.toLowerCase();
      const clientPhone = row.querySelector('.client-phone').textContent.toLowerCase();
      const rowService = row.getAttribute('data-service');

      const matchesSearch = clientName.includes(query) || clientPhone.includes(query);
      const matchesService = serviceFilter === 'all' || rowService === serviceFilter;

      if (matchesSearch && matchesService) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });

    updatePositions();
  }

  searchInput.addEventListener('input', applyFilters);
  filterService.addEventListener('change', applyFilters);

  // Cadastro Manual de Novo Cliente
  queueForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('input-cliente').value;
    const tel = document.getElementById('input-telefone').value;
    const servico = document.getElementById('input-servico').value;
    const profissional = document.getElementById('input-profissional').value;

    const tr = document.createElement('tr');
    tr.setAttribute('data-service', servico);

    tr.innerHTML = `
      <td><span class="pos-badge">0º</span></td>
      <td>
        <strong class="client-name">${nome}</strong>
        <span class="client-phone">${tel}</span>
      </td>
      <td>
        <strong>${servico}</strong>
        <span class="metrics-text">Prefere: ${profissional}</span>
      </td>
      <td>
        <span class="time-col">Sem Vaga</span>
        <span class="date-subtext">Aguardando cancelamento</span>
      </td>
      <td>
        <span class="status-badge status-aguardando">Na Fila</span>
      </td>
      <td class="actions-cell">
        <button class="btn-action btn-call btn-notify">Notificar Zap</button>
        <button class="btn-action btn-remove">Remover</button>
      </td>
    `;

    queueBody.appendChild(tr);
    updatePositions();
    closeDrawer();
  });

  updatePositions();
});