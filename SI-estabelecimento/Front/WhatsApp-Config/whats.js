document.addEventListener('DOMContentLoaded', () => {
  // Elementos do Card 1 - Lembretes
  const toggleReminders = document.getElementById('toggle-reminders');
  const btnSaveReminders = document.getElementById('btn-save-reminders');
  const selectAntecedence = document.getElementById('select-antecedence');

  // Elementos do Card 2 - Vagas Fila
  const selectQueuePosition = document.getElementById('select-queue-position');
  const inputSlotInfo = document.getElementById('input-slot-info');
  const previewSlot = document.getElementById('preview-slot');
  const btnSendSlotNotify = document.getElementById('btn-send-slot-notify');

  // Elementos do Card 3 - Comunicados
  const textareaAnnouncement = document.getElementById('textarea-announcement');
  const btnSendBroadcast = document.getElementById('btn-send-broadcast');
  const selectBroadcastTarget = document.getElementById('select-broadcast-target');

  // 1. ATUALIZAÇÃO EM TEMPO REAL DO PREVIEW DA VAGA
  inputSlotInfo.addEventListener('input', (e) => {
    previewSlot.textContent = e.target.value || 'Horário não especificado';
  });

  // 2. SALVAR REGRAS DE LEMBRETE AUTOMÁTICO
  btnSaveReminders.addEventListener('click', () => {
    const isEnabled = toggleReminders.checked;
    const timeValue = selectAntecedence.options[selectAntecedence.selectedIndex].text;

    if (isEnabled) {
      alert(`Configuração Salva!\nOs lembretes automáticos serão enviados ${timeValue}.`);
    } else {
      alert('Aviso: Os lembretes automáticos de confirmação foram desativados.');
    }
  });

  // 3. DISPARAR NOTIFICAÇÃO DE VAGA POR POSIÇÃO DA FILA
  btnSendSlotNotify.addEventListener('click', () => {
    const clientSelected = selectQueuePosition.options[selectQueuePosition.selectedIndex].text;
    const slotText = inputSlotInfo.value;

    if (!slotText.trim()) {
      alert('Por favor, informe o horário da vaga liberada.');
      return;
    }

    alert(`Sucesso! Notificação de vaga (${slotText}) enviada no WhatsApp de: ${clientSelected}`);
  });

  // 4. DISPARAR COMUNICADO GERAL
  btnSendBroadcast.addEventListener('click', () => {
    const text = textareaAnnouncement.value.trim();
    const target = selectBroadcastTarget.options[selectBroadcastTarget.selectedIndex].text;

    if (!text) {
      alert('Escreva o texto do comunicado antes de enviar.');
      return;
    }

    alert(`Comunicado enviado com sucesso!\n\nPúblico: ${target}\nMensagem: "${text}"`);
    textareaAnnouncement.value = '';
  });
});