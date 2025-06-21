// Admin Charts JavaScript - Chart.js Implementation

class AdminChartsManager {
  constructor() {
    this.charts = {};
    this.chartColors = {
      primary: "#667eea",
      secondary: "#764ba2",
      success: "#00ff88",
      warning: "#ffc107",
      danger: "#ff6b7d",
      info: "#4facfe",
      purple: "#a855f7",
      orange: "#f97316",
      teal: "#14b8a6",
      pink: "#ec4899",
    };

    this.gradients = {};
    this.initializeCharts();
  }

  initializeCharts() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.createCharts());
    } else {
      this.createCharts();
    }
  }

  createCharts() {
    this.createRevenueHoursChart();
    this.createLearnersGrowthChart();
    this.createCompletionRateChart();
    this.animateChartsOnScroll();
  }

  createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  createRevenueHoursChart() {
    const canvas = document.getElementById("revenueHoursChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Create gradients
    const revenueGradient = this.createGradient(
      ctx,
      this.chartColors.primary,
      this.chartColors.secondary,
    );
    const hoursGradient = this.createGradient(
      ctx,
      this.chartColors.success,
      this.chartColors.teal,
    );

    const data = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Monthly Revenue ($)",
          data: [
            4200, 5100, 4800, 6200, 7300, 8100, 8800, 9200, 8600, 9800, 10200,
            11400,
          ],
          borderColor: this.chartColors.primary,
          backgroundColor: revenueGradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: this.chartColors.primary,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          yAxisID: "y",
        },
        {
          label: "Teaching Hours",
          data: [120, 145, 135, 165, 185, 200, 210, 225, 205, 240, 250, 275],
          borderColor: this.chartColors.success,
          backgroundColor: hoursGradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: this.chartColors.success,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          yAxisID: "y1",
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: "600",
            },
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: this.chartColors.primary,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.datasetIndex === 0) {
                label += "$" + context.parsed.y.toLocaleString();
              } else {
                label += context.parsed.y + " hours";
              }
              return label;
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
              weight: "500",
            },
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Revenue ($)",
            font: {
              size: 12,
              weight: "600",
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
            drawBorder: false,
          },
          ticks: {
            callback: function (value) {
              return "$" + value.toLocaleString();
            },
            font: {
              size: 11,
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Teaching Hours",
            font: {
              size: 12,
              weight: "600",
            },
          },
          grid: {
            drawOnChartArea: false,
            drawBorder: false,
          },
          ticks: {
            callback: function (value) {
              return value + "h";
            },
            font: {
              size: 11,
            },
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart",
      },
    };

    this.charts.revenueHours = new Chart(ctx, {
      type: "line",
      data: data,
      options: options,
    });
  }

  createLearnersGrowthChart() {
    const canvas = document.getElementById("learnersGrowthChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const gradient = this.createGradient(
      ctx,
      this.chartColors.info,
      this.chartColors.purple,
    );

    const data = {
      labels: [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
        "Week 9",
        "Week 10",
        "Week 11",
        "Week 12",
      ],
      datasets: [
        {
          label: "New Sign-ups",
          data: [25, 32, 28, 41, 38, 45, 52, 48, 61, 55, 68, 72],
          backgroundColor: gradient,
          borderColor: this.chartColors.info,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: this.chartColors.purple,
          hoverBorderColor: this.chartColors.purple,
          hoverBorderWidth: 3,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: this.chartColors.info,
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return `New Learners: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
              weight: "500",
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
      animation: {
        duration: 1500,
        easing: "easeOutBounce",
      },
    };

    this.charts.learnersGrowth = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
  }

  createCompletionRateChart() {
    const canvas = document.getElementById("completionRateChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const data = {
      labels: ["Completed Courses", "In Progress", "Not Started"],
      datasets: [
        {
          data: [234, 156, 89],
          backgroundColor: [
            this.chartColors.success,
            this.chartColors.warning,
            this.chartColors.danger,
          ],
          borderColor: [
            this.chartColors.success,
            this.chartColors.warning,
            this.chartColors.danger,
          ],
          borderWidth: 2,
          hoverOffset: 15,
          hoverBorderWidth: 3,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: "600",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: "easeInOutQuart",
      },
    };

    this.charts.completionRate = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: options,
    });
  }

  animateChartsOnScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chartCard = entry.target;
            chartCard.classList.add("animate-chart");

            // Trigger chart animation
            const canvas = chartCard.querySelector("canvas");
            if (canvas && this.charts[canvas.id.replace("Chart", "")]) {
              setTimeout(() => {
                this.charts[canvas.id.replace("Chart", "")].update("active");
              }, 300);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    document.querySelectorAll(".chart-card").forEach((card) => {
      observer.observe(card);
    });
  }

  updateChartPeriod(chartType, period) {
    // Update chart data based on selected period
    // This would typically fetch new data from an API
    console.log(`Updating ${chartType} chart for ${period} period`);

    // For demo purposes, generate new random data
    if (this.charts[chartType]) {
      const chart = this.charts[chartType];
      chart.data.datasets.forEach((dataset) => {
        dataset.data = dataset.data.map(
          () => Math.floor(Math.random() * 100) + 20,
        );
      });
      chart.update("active");
    }
  }

  generateInsights() {
    // Generate AI-like insights for the charts
    return {
      revenue: {
        trend: "positive",
        percentage: 15.6,
        insight:
          "Revenue has grown consistently over the past 6 months with a 15.6% increase from the previous period.",
      },
      learners: {
        trend: "positive",
        percentage: 23.4,
        insight:
          "New learner sign-ups are trending upward with a 23.4% increase in the last quarter.",
      },
      completion: {
        rate: 48.9,
        insight:
          "Course completion rate is at 48.9%, which is above industry average of 35%.",
      },
    };
  }

  exportChartData(chartType) {
    if (!this.charts[chartType]) return;

    const chart = this.charts[chartType];
    const data = chart.data;

    // Convert chart data to CSV format
    let csv = "Label,Value\n";
    data.labels.forEach((label, index) => {
      data.datasets.forEach((dataset) => {
        csv += `${label},${dataset.data[index]}\n`;
      });
    });

    // Download CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chartType}-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Utility method to refresh all charts
  refreshAllCharts() {
    Object.keys(this.charts).forEach((chartKey) => {
      if (this.charts[chartKey]) {
        this.charts[chartKey].update("active");
      }
    });
  }

  // Destroy all charts (useful for cleanup)
  destroyAllCharts() {
    Object.keys(this.charts).forEach((chartKey) => {
      if (this.charts[chartKey]) {
        this.charts[chartKey].destroy();
        delete this.charts[chartKey];
      }
    });
  }
}

// Initialize charts when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.adminChartsManager = new AdminChartsManager();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdminChartsManager;
}
