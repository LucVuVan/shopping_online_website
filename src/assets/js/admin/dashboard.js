/**
 * dashboard.js - Admin dashboard với Chart.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Auth check - chỉ admin
    if (typeof Auth !== 'undefined') {
        if (!Auth.isLoggedIn() || Auth.getRole() !== 'admin') {
            window.location.href = '../login.html';
            return;
        }
    }

    initRevenueChart();

    document.getElementById('periodSelect')?.addEventListener('change', (e) => {
        updateChartData(e.target.value);
    });
});

// ===== DATA =====
const CHART_DATA = {
    month: {
        labels: ['01/02','02/02','03/02','04/02','05/02','06/02','07/02','08/02','09/02','10/02','11/02','12/02'],
        data:   [2700000, 2900000, 3100000, 3050000, 4200000, 4000000, 3600000, 4500000, 4400000, 3200000, 4800000, 4600000, 5700000]
    },
    week: {
        labels: ['T2','T3','T4','T5','T6','T7','CN'],
        data:   [1200000, 1800000, 1400000, 2100000, 1700000, 2800000, 900000]
    },
    year: {
        labels: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
        data:   [38000000, 47900000, 42000000, 55000000, 48000000, 61000000, 52000000, 59000000, 64000000, 70000000, 66000000, 75000000]
    }
};

let chart;

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart')?.getContext('2d');
    if (!ctx) return;

    const d = CHART_DATA.month;

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: d.labels,
            datasets: [{
                label: 'Doanh thu',
                data: d.data,
                borderColor: '#22c55e',
                borderWidth: 2.5,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#22c55e',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 12, weight: '600' },
                        color: '#555',
                        padding: 20,
                    }
                },
                tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#000',
                    bodyColor: '#555',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => {
                            const val = ctx.parsed.y;
                            if (val >= 1000000) return ` ${(val/1000000).toFixed(1)}Mđ`;
                            return ` ${val.toLocaleString('vi-VN')}đ`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 }, color: '#888' },
                    border: { display: false }
                },
                y: {
                    grid: { color: '#f3f4f6', lineWidth: 1 },
                    border: { display: false, dash: [4, 4] },
                    ticks: {
                        font: { size: 11 },
                        color: '#888',
                        callback: (val) => {
                            if (val === 0) return '0.0M';
                            return (val / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

function updateChartData(period) {
    if (!chart) return;
    const d = CHART_DATA[period];
    chart.data.labels = d.labels;
    chart.data.datasets[0].data = d.data;
    chart.update('active');
}
