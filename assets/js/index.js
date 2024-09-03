const getDivisas = async () => {
    try {
      const response = await fetch("https://mindicador.cl/api");
      
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      alert(`Ocurrió un error al obtener los datos: ${error.message}`);
      console.error('Detalles del error:', error);
    }
  }

  const convertirMoneda = async () => {
    const monto = parseFloat(document.getElementById("monto").value);
    const moneda = document.getElementById("moneda").value;
  
    if (isNaN(monto) || monto <= 0) {
      alert("Por favor, ingresa un monto válido en pesos chilenos.");
      return;
    }
  
    const data = await getDivisas();
  
    if (data && data[moneda]) {
      const valorMoneda = data[moneda].valor;
      const resultado = monto / valorMoneda;
  
      renderResultado(resultado, moneda);
      await renderGrafica(moneda);
    } else {
      alert("No se pudo obtener la información de la moneda seleccionada.");
    }
  }
  
 
  const renderResultado = (resultado, moneda) => {
    const resultadoElement = document.getElementById("resultado");
    resultadoElement.textContent = `El monto convertido es: ${resultado.toFixed(2)} ${moneda.toUpperCase()}`;
  }
  
  document.getElementById("convertir").addEventListener("click", convertirMoneda); 

  let chartInstance; 

  async function getAndCreateDataToChart(moneda) {
    
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await res.json();

   
    const ultimos10Dias = data.serie.slice(0, 10).reverse();

    const labels = ultimos10Dias.map(dato => {
        const fecha = new Date(dato.fecha);
        return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    });

    const valores = ultimos10Dias.map(dato => dato.valor);

    const datasets = [
        {
            label: `Valor de ${moneda.toUpperCase()} en los últimos 10 días`,
            borderColor: "rgb(255, 99, 132)",
            data: valores
        }
    ];

    return { labels, datasets };
}
async function renderGrafica(moneda) {
    const data = await getAndCreateDataToChart(moneda);
    if (chartInstance) {
      chartInstance.destroy();
  }
    const config = {
        type: "line",
        data
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    chartInstance = new Chart(myChart, config);
}
renderGrafica(moneda);

    