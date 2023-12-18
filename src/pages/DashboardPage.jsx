import  NavScrollPrincipal  from '../componentes/Navar_pagina'
import '../css/Dashboard.css'
import UncontrolCarousel from '../componentes/Carousels';
import InformacionEdsoft from '../componentes/Informacion_Farmacia';



export const DashboardPage = () => {
  return (
    <>
        <NavScrollPrincipal/>
        <InformacionEdsoft/>
        <UncontrolCarousel/>
      
    </>


  );
}
