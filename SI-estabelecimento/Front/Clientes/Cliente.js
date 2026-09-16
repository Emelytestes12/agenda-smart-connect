document.addEventListener('DOMContentLoaded', () => {
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('drawer');
  const drawerTitle = document.getElementById('drawer-title');
  const formCliente = document.getElementById('cliente-form');

  function openDrawer(isEdit = false) {
    drawerTitle.textContent = isEdit ? "Editar Cliente" : "Novo Cliente";
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    formCliente.reset();
  }

  btnOpenDrawer.addEventListener('click', () => openDrawer(false));
  btnCloseDrawer.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  formCliente.addEventListener('submit', (e) => {
    e.preventDefault();
    closeDrawer();
  });
});