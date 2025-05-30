import { exec } from 'child_process';
import { performance } from 'perf_hooks';

const simulaciones = [5, 10, 20, 30];
const isolationLevel = 'Serializable'; // Puedes cambiar a 'Serializable' si quieres

function correrSimulacion(usuarios) {
  return new Promise((resolve) => {
    console.log(`\n🚀 Simulación con ${usuarios} usuarios iniciando...`);
    const startTime = performance.now();

    exec(`node simulador.js ${usuarios} ${isolationLevel}`, (error, stdout, stderr) => {
      const endTime = performance.now();
      const duracionSegundos = ((endTime - startTime) / 1000).toFixed(2);

      if (error) {
        console.error(`Error en simulación de ${usuarios} usuarios:`, error);
        return resolve();
      }

      let resumen;
      try {
        const lineas = stdout.trim().split('\n');
        const ultimaLinea = lineas[lineas.length - 1];
        resumen = JSON.parse(ultimaLinea);
      } catch (err) {
        console.error('⚠️ No se pudo leer resumen JSON del simulador.');
        resumen = { exitosas: 0, fallidas: 0 };
      }

      console.log(stdout);
      console.log(`✅ Reservas exitosas: ${resumen.exitosas}`);
      console.log(`❌ Reservas fallidas: ${resumen.fallidas}`);
      console.log(`⏱️ Tiempo de ejecución: ${duracionSegundos} segundos`);

      resolve();
    });
  });
}


async function correrTodasSimulaciones() {
  for (const usuarios of simulaciones) {
    await correrSimulacion(usuarios);
  }
  console.log('\n🎉 Todas las simulaciones completadas.');
}

correrTodasSimulaciones();
