// Íconos sólidos de Font Awesome Free (CC BY 4.0). Se dibujan como SVG en línea, de un solo color.
import {
  faArrowLeft,
  faBars,
  faBookOpen,
  faCalendarDay,
  faChevronLeft,
  faChevronRight,
  faCross,
  faCrown,
  faDove,
  faEnvelopeOpenText,
  faHandHoldingHeart,
  faHandsPraying,
  faHeart,
  faHouse,
  faMoon,
  faRotateRight,
  faSun,
  faXmark,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export const ICONOS = {
  inicio: faHouse,
  salir: faArrowLeft,
  menu: faBars,
  cerrar: faXmark,
  sol: faSun,
  luna: faMoon,
  cruz: faCross,
  hoy: faCalendarDay,
  anterior: faChevronLeft,
  siguiente: faChevronRight,
  otraVez: faRotateRight,
  carta: faEnvelopeOpenText,
  // Devociones
  rosario: faHandsPraying,
  coronilla: faHandHoldingHeart,
  'coronilla-sagrado-corazon': faHeart,
  // Secciones
  fundamentales: faHandsPraying,
  marianas: faCrown,
  'espiritu-santo': faDove,
  misericordia: faHandHoldingHeart,
  'sagrado-corazon': faHeart,
  tov: faBookOpen,
} satisfies Record<string, IconDefinition>;

export type NombreIcono = keyof typeof ICONOS;

export function esIcono(nombre: string): nombre is NombreIcono {
  return nombre in ICONOS;
}
