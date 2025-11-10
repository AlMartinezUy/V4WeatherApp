#  WeatherApp

Una aplicación del clima desarrollada con **React + Vite**, que muestra información meteorológica actualizada de cualquier ciudad.  
Su interfaz es moderna, rápida y responsiva, con un favicon personalizado que combina **programación y clima**. 

---

##  Características

-  Búsqueda por ciudad o ubicación actual  
-  Muestra temperatura, humedad, presión y condiciones del cielo  
-  Actualización en tiempo real mediante API del clima  
-  Diseño responsivo y minimalista  
-  Construido con **Vite** para máxima velocidad  
-  Código modular y limpio (componentes reutilizables)

---

##  Tecnologías utilizadas

| Tecnología | Uso |
|-------------|-----|
| **React** | Framework principal para construir la interfaz |
| **Vite** | Entorno de desarrollo rápido y liviano |
| **JavaScript (ES6+)** | Lógica y manejo de datos |
| **CSS / Tailwind / Styled Components** | Estilos (dependiendo de tu setup) |
| **API OpenWeatherMap** | Fuente de datos meteorológicos |
| **Favicon personalizado** | Diseñado especialmente para el proyecto (☁️ + </>) |

---

##  Instalación y ejecución

1. Cloná este repositorio:
   
   git clone https://github.com/AlMartinezUy/weatherapp.git

2. Entrá al directorio:

   cd weatherapp

3. Instalá las dependencias:

   npm install

4. Iniciá el servidor de desarrollo:
  
   npm run dev

5. Abrí el navegador en http://localhost:5173


Configurar API del clima

1-Creá una cuenta en OpenWeatherMap

2-Obtené tu API Key.

3-Creá un archivo .env en la raíz del proyecto con:

VITE_API_KEY=TU_API_KEY_AQUI

4-En tu código, accedé a la variable con:

const apiKey = import.meta.env.VITE_API_KEY;


Autor

Alvaro Martínez
alvaro.m.irrazabal@gmail.com
https://github.com/AlMartinezUy


Licencia:

Este proyecto se distribuye bajo la licencia MIT.
¡Podés usarlo, modificarlo y compartirlo libremente!
