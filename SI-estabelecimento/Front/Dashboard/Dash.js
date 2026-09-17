document.addEventListener('DOMContentLoaded', () => {
  const periodButtons = document.querySelectorAll('.btn-period');
  const kpiRecoveredSlots = document.getElementById('kpi-recovered-slots');
  const kpiNoShowRate = document.getElementById('kpi-noshow-rate');
  const kpiOccupancy = document.getElementById('kpi-occupancy');
  const kpiAvgTime = document.getElementById('kpi-avg-time');

  const periodMetrics = {
    today: {
      slots: '4',
      noshow: '0.0%',
      occupancy: '98.0%',
      avgTime: '2.1 min'
    },
    week: {
      slots: '12',
      noshow: '1.8%',
      occupancy: '96.5%',
      avgTime: '3.5 min'
    },
    month: {
      slots: '28',
      noshow: '2.4%',
      occupancy: '95.8%',
      avgTime: '4.2 min'
    }
  };

  periodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedPeriod = btn.getAttribute('data-period');
      const metrics = periodMetrics[selectedPeriod];

      if (metrics) {
        kpiRecoveredSlots.textContent = metrics.slots;
        kpiNoShowRate.textContent = metrics.noshow;
        kpiOccupancy.textContent = metrics.occupancy;
        kpiAvgTime.textContent = metrics.avgTime;
      }
    });
  });
});