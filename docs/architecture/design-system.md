# Design System

## Objetivo

El proyecto dispone de un único Design System Enterprise compartido por todas las aplicaciones del monorepo.

El Design System constituye el contrato entre UX y desarrollo y proporciona:

- Consistencia visual.
- Componentes reutilizables.
- Accesibilidad.
- APIs estables.
- Integración con formularios.
- Design tokens.
- Documentación viva.
- Testing visual y de accesibilidad.

No es una colección de componentes; es una plataforma UI.

---

# Filosofía

El Design System sigue los siguientes principios:

- Platform First.
- Accessibility by Default.
- Semantic HTML First.
- Headless when possible.
- Components only when they add value.
- Stable public APIs.
- Design Tokens as the single styling contract.
- AI-friendly architecture.

---

# Arquitectura

```
                    ┌──────────────┐
                    │ Applications │
                    └──────┬───────┘
                           │
                           ▼
                 @ae/design-system
                           │
          ┌────────────────┴───────────────┐
          │                                │
          ▼                                ▼
    Angular Aria                     Angular CDK
 Accessibility                Infrastructure / Behaviors
          │                                │
          └────────────────┬───────────────┘
                           ▼
                    Semantic HTML
                           │
                           ▼
                    Browser Platform
```

Storybook actúa como otro consumidor del Design System:

```
                 ┌── Enterprise Apps
                 │
Design System ───┤
                 │
                 └── Storybook
```

---

# Stack tecnológico

El Design System utilizará:

- HTML semántico.
- CSS Variables.
- SCSS.
- Angular standalone components.
- Angular Signals.
- ChangeDetectionStrategy.OnPush.
- Angular Aria.
- Angular CDK.
- Storybook.
- TypeScript estricto.

No se utilizará Angular Material como base.

---

# Responsabilidades

| Necesidad | Solución |
|-----------|----------|
| Button | HTML nativo |
| Input | HTML nativo |
| Checkbox | HTML nativo |
| Link | HTML nativo |
| Badge | HTML |
| Tabs | Angular Aria |
| Accordion | Angular Aria |
| Menu | Angular Aria |
| Select | Angular Aria + CDK Overlay |
| MultiSelect | Angular Aria + CDK Overlay |
| Dialog | Angular CDK |
| Tooltip | Angular CDK |
| Overlay | Angular CDK |
| Drag & Drop | Angular CDK |
| Virtual Scroll | Angular CDK |

La regla general será:

```
HTML
   ↓
Angular Aria
   ↓
Angular CDK
```

Siempre se utilizará la solución más simple posible.

---

# Principios de diseño

## HTML primero

Siempre que sea posible se utilizarán elementos HTML nativos.

Correcto

```html
<button aeButton>
```

Incorrecto

```html
<ae-button>
```

La semántica nativa es parte de la accesibilidad.

---

## Componentes sólo cuando aportan valor

No se crearán abstracciones sin comportamiento.

No existen componentes como:

```html
<ae-div>

<ae-container>

<ae-span>
```

Un componente entra en el Design System únicamente cuando aporta:

- comportamiento
- accesibilidad
- API
- reutilización
- integración
- semántica

---

## Componentes sin lógica de negocio

El Design System nunca conocerá:

- usuarios
- permisos
- APIs
- casos de uso
- entidades de dominio
- stores
- autenticación

Los componentes reciben datos.

Los componentes emiten eventos.

Nada más.

---

# Design Tokens

Todo el aspecto visual del sistema estará gobernado por Design Tokens.

Los tokens se organizan en tres niveles.

```
Primitive Tokens
        ↓
Semantic Tokens
        ↓
Component Tokens
```

Ejemplo

```
blue-600
      ↓
color-action-primary
      ↓
button-primary-background
```

Los componentes únicamente consumirán Component Tokens o Semantic Tokens.

Nunca valores hardcodeados.

Correcto

```css
background:
var(--ae-button-primary-background);
```

Incorrecto

```css
background:
#2457d6;
```

---

# Interoperabilidad del Design System

El proyecto no estará acoplado a una herramienta concreta de diseño.

La arquitectura introduce una capa denominada:

```
Design Bridge
```

```
            Design Tool
                 │
                 ▼
         Design Bridge
                 │
                 ▼
        Design Contract
                 │
     ┌───────────┼────────────┐
     ▼           ▼            ▼
 Storybook   Angular      AI Agents
```

Actualmente el primer adaptador previsto será Figma, pero la arquitectura permitirá sustituirlo por cualquier otra herramienta.

---

# Design Contract

El Design Contract representa el lenguaje común entre UX y desarrollo.

Incluye:

- Design Tokens
- Componentes
- Variantes
- Estados
- Accesibilidad
- Versionado
- Mapeos

No pertenece ni a Angular ni a Figma.

---

# Integración con herramientas de diseño

La sincronización entre diseño y código se realizará mediante adaptadores.

Inicialmente se evaluará:

- Figma Variables
- Figma Code Connect
- Figma MCP

El objetivo no es sincronizar automáticamente el código desde Figma, sino compartir un contrato común que reduzca el trabajo manual y mejore la colaboración entre UX, desarrollo y herramientas de IA.

Los cambios de diseño deberán seguir el flujo habitual de ingeniería:

```
Cambio de diseño
        ↓
Actualización del Design Contract
        ↓
Pull Request
        ↓
Review
        ↓
Tests
        ↓
Release
```

---

# Storybook

Storybook es un consumidor del Design System.

Sus responsabilidades son:

- documentación viva
- catálogo de componentes
- playground
- ejemplos
- estados
- responsive
- interaction testing
- accessibility testing
- visual regression

Storybook representa la implementación real del Design System.

---

# Estructura

```
libs/

    ae-design-tokens/

    ae-design-system/
        button/
        dialog/
        accordion/
        form-field/
        multi-select/
        testing/
```

Cada componente se publica mediante un Secondary Entry Point.

Ejemplo

```
@ae/design-system/button

@ae/design-system/dialog

@ae/design-system/testing
```

No se permitirá un barrel global que exponga toda la biblioteca.

---

# Accesibilidad

La accesibilidad forma parte del contrato del componente.

Todo componente interactivo debe definir:

- navegación por teclado
- foco
- screen readers
- estados disabled
- estados error
- alto contraste
- reduced motion

La accesibilidad nunca será una mejora posterior.

---

# Testing

El Design System dispondrá de:

- Unit Tests
- Interaction Tests
- Accessibility Tests
- Visual Regression Tests

Todo nuevo componente deberá incorporar sus pruebas correspondientes antes de ser considerado completo.

---

# Relación con la IA

La arquitectura está diseñada para que agentes de IA puedan comprender fácilmente el Design System.

Los objetivos son:

- APIs estables.
- Componentes bien documentados.
- Design Contract compartido.
- Storybook como fuente de ejemplos.
- Code Connect para mapear diseño ↔ código.
- Harness Engineering para proporcionar contexto arquitectónico.

El propósito es reducir la distancia entre el diseño, la implementación y la asistencia mediante IA.

---

# Resumen

El Design System de AE se basa en cinco pilares fundamentales:

1. HTML semántico antes que abstracciones.
2. Accesibilidad como parte del contrato.
3. Design Tokens como única fuente de estilos.
4. Storybook como verdad de implementación.
5. Design Bridge como puente entre UX, desarrollo e IA.

Esta arquitectura permite mantener un sistema de diseño escalable, desacoplado de herramientas concretas y preparado para evolucionar junto con el ecosistema Angular y las capacidades de IA.